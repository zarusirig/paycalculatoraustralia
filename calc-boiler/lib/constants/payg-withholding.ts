// =============================================================================
// PAYG Withholding Engine — FY2026-27
// Single source of truth for the weekly / fortnightly / monthly tax-table
// pages and the Schedule 5 (back payments, bonuses, commissions) page.
//
// Methodology: per-period withholding is derived by annualising the pay
// period earnings (× 52 / 26 / 12) and applying the FY2026-27 resident tax
// scale, LITO, and Medicare levy (with the low-income shading), then dividing
// back to the pay period and rounding to the whole dollar — the same
// architecture as the ATO Statement of Formulas (NAT 1004). Printed ATO
// lookup tables round coefficients slightly differently, so amounts can vary
// from the published NAT 1005/1006/1007 tables by a few dollars.
//
// FY2026-27 change: from 1 July 2026 the 16% rate on $18,201–$45,000 falls
// to 15% (Treasury Laws Amendment (Cost of Living Tax Cuts) Act 2025) — see
// TAX_HISTORY.upcomingFY2026_27 in australian-tax.ts.
// =============================================================================

import {
  LITO,
  MEDICARE_LEVY,
  calculateLITO,
  calculateHECS,
  type TaxBracket,
} from "./australian-tax";

export const PAYG_FINANCIAL_YEAR = "2026-27";
export const PAYG_TABLES_UPDATED = "1 July 2026";

// ---------- Income Tax Brackets (FY2026-27, Residents, claiming TFT) ----------
export const TAX_BRACKETS_2026_27: readonly TaxBracket[] = [
  { min: 0, max: 18_200, rate: 0, base: 0, label: "Tax-free threshold" },
  { min: 18_201, max: 45_000, rate: 0.15, base: 0, label: "15c for each $1 over $18,200" },
  { min: 45_001, max: 135_000, rate: 0.30, base: 4_020, label: "30c for each $1 over $45,000" },
  { min: 135_001, max: 190_000, rate: 0.37, base: 31_020, label: "37c for each $1 over $135,000" },
  { min: 190_001, max: Infinity, rate: 0.45, base: 51_370, label: "45c for each $1 over $190,000" },
] as const;

// No tax-free threshold claimed (second job / no TFT declaration selection):
// the same marginal scale applied from the first dollar, i.e. every boundary
// shifted down by the $18,200 threshold. LITO does not apply.
const NO_TFT_BRACKETS_2026_27: readonly TaxBracket[] = [
  { min: 0, max: 26_800, rate: 0.15, base: 0, label: "15c for each $1" },
  { min: 26_801, max: 116_800, rate: 0.30, base: 4_020, label: "30c for each $1 over $26,800" },
  { min: 116_801, max: 171_800, rate: 0.37, base: 31_020, label: "37c for each $1 over $116,800" },
  { min: 171_801, max: Infinity, rate: 0.45, base: 51_370, label: "45c for each $1 over $171,800" },
] as const;

// ---------- Pay frequencies ----------
export type PayFrequency = "weekly" | "fortnightly" | "monthly";

export const PAY_PERIODS: Record<PayFrequency, number> = {
  weekly: 52,
  fortnightly: 26,
  monthly: 12,
};

export const FREQUENCY_LABELS: Record<PayFrequency, string> = {
  weekly: "week",
  fortnightly: "fortnight",
  monthly: "month",
};

// ---------- Internal helpers ----------
function progressiveTax(income: number, brackets: readonly TaxBracket[]): number {
  if (income <= 0) return 0;
  for (let i = brackets.length - 1; i >= 0; i--) {
    const bracket = brackets[i];
    if (income >= bracket.min) {
      return bracket.base + (income - (bracket.min - 1)) * bracket.rate;
    }
  }
  return 0;
}

/**
 * Medicare levy with the low-income shading applied (singles).
 * Below the threshold no levy applies; above it the levy phases in at 10c
 * per $1 over the threshold until it reaches the full 2% of income.
 */
export function medicareLevyShaded(income: number): number {
  if (income <= MEDICARE_LEVY.lowIncomeThreshold) return 0;
  const shaded = (income - MEDICARE_LEVY.lowIncomeThreshold) * 0.10;
  return Math.min(income * MEDICARE_LEVY.rate, shaded);
}

// ---------- Core API ----------
export interface WithholdingOptions {
  /** Employee claims the tax-free threshold on their TFN declaration (default true). */
  claimsTaxFreeThreshold?: boolean;
  /** Employee has a HECS-HELP / STSL study or training loan (default false). */
  hasSTSL?: boolean;
}

export interface WithholdingResult {
  grossPerPeriod: number;
  /** PAYG income tax component (incl. Medicare levy), rounded to whole dollars. */
  paygWithheld: number;
  /** Study & training support loan component, rounded to whole dollars. */
  stslWithheld: number;
  /** Total amount withheld per pay period. */
  totalWithheld: number;
  /** Take-home pay per period after withholding. */
  netPerPeriod: number;
  /** Annualised earnings the calculation is based on. */
  annualEquivalent: number;
}

/**
 * Per-pay-period PAYG withholding for regular salary and wages (Schedule 1
 * equivalent), FY2026-27 resident rates.
 */
export function calculatePAYGWithholding(
  grossPerPeriod: number,
  frequency: PayFrequency,
  options: WithholdingOptions = {}
): WithholdingResult {
  const { claimsTaxFreeThreshold = true, hasSTSL = false } = options;
  const periods = PAY_PERIODS[frequency];
  const gross = Math.max(0, grossPerPeriod);
  const annual = gross * periods;

  let annualTax: number;
  if (claimsTaxFreeThreshold) {
    const baseTax = progressiveTax(annual, TAX_BRACKETS_2026_27);
    annualTax = Math.max(0, baseTax - calculateLITO(annual)) + medicareLevyShaded(annual);
  } else {
    annualTax = progressiveTax(annual, NO_TFT_BRACKETS_2026_27) + medicareLevyShaded(annual);
  }

  const paygWithheld = Math.max(0, Math.round(annualTax / periods));
  const stslWithheld = hasSTSL ? Math.max(0, Math.round(calculateHECS(annual) / periods)) : 0;
  const totalWithheld = paygWithheld + stslWithheld;

  return {
    grossPerPeriod: gross,
    paygWithheld,
    stslWithheld,
    totalWithheld,
    netPerPeriod: Math.round((gross - totalWithheld) * 100) / 100,
    annualEquivalent: annual,
  };
}

// ---------- Schedule 5: back payments, commissions, bonuses (Method B(ii)) ----------
export interface Schedule5Result {
  /** Withholding on the regular pay alone, per period. */
  regularWithholding: number;
  /** The 1/periods slice of the additional payment used in the calculation. */
  apportionedAmount: number;
  /** Withholding on regular pay + apportioned slice, per period. */
  combinedWithholding: number;
  /** Extra withholding attributable to the additional payment, per period. */
  perPeriodDifference: number;
  /** Total withheld from the bonus / back payment / commission. */
  withheldFromAdditionalPayment: number;
  /** Net amount of the additional payment received in hand. */
  netAdditionalPayment: number;
  /** Effective withholding rate on the additional payment. */
  effectiveRate: number;
}

/**
 * ATO Schedule 5, Method B(ii): apportion the additional payment across the
 * number of pay periods in the year, work out the withholding difference on
 * one period, then multiply back by the number of periods.
 */
export function calculateSchedule5MethodB(
  regularGrossPerPeriod: number,
  additionalPayment: number,
  frequency: PayFrequency,
  options: WithholdingOptions = {}
): Schedule5Result {
  const periods = PAY_PERIODS[frequency];
  const additional = Math.max(0, additionalPayment);
  const apportioned = Math.floor(additional / periods);

  const base = calculatePAYGWithholding(regularGrossPerPeriod, frequency, options);
  const combined = calculatePAYGWithholding(regularGrossPerPeriod + apportioned, frequency, options);
  const perPeriodDifference = Math.max(0, combined.totalWithheld - base.totalWithheld);
  const withheld = Math.min(additional, perPeriodDifference * periods);

  return {
    regularWithholding: base.totalWithheld,
    apportionedAmount: apportioned,
    combinedWithholding: combined.totalWithheld,
    perPeriodDifference,
    withheldFromAdditionalPayment: withheld,
    netAdditionalPayment: Math.round((additional - withheld) * 100) / 100,
    effectiveRate: additional > 0 ? withheld / additional : 0,
  };
}

// ---------- Static table row builder ----------
export interface WithholdingTableRow {
  gross: number;
  withTFT: number;
  withTFTAndSTSL: number;
  noTFT: number;
  netWithTFT: number;
}

export function buildWithholdingRows(
  frequency: PayFrequency,
  amounts: readonly number[]
): WithholdingTableRow[] {
  return amounts.map((gross) => {
    const tft = calculatePAYGWithholding(gross, frequency, { claimsTaxFreeThreshold: true });
    const tftStsl = calculatePAYGWithholding(gross, frequency, { claimsTaxFreeThreshold: true, hasSTSL: true });
    const noTft = calculatePAYGWithholding(gross, frequency, { claimsTaxFreeThreshold: false });
    return {
      gross,
      withTFT: tft.totalWithheld,
      withTFTAndSTSL: tftStsl.totalWithheld,
      noTFT: noTft.totalWithheld,
      netWithTFT: gross - tft.totalWithheld,
    };
  });
}

// Standard earnings increments shown on each tax-table page.
export const WEEKLY_TABLE_AMOUNTS: readonly number[] = [
  300, 400, 500, 600, 700, 800, 900, 1_000, 1_100, 1_200, 1_300, 1_400, 1_500,
  1_600, 1_700, 1_800, 1_900, 2_000, 2_200, 2_400, 2_600, 2_800, 3_000, 3_250, 3_500,
];

export const FORTNIGHTLY_TABLE_AMOUNTS: readonly number[] = [
  600, 800, 1_000, 1_200, 1_400, 1_600, 1_800, 2_000, 2_200, 2_400, 2_600, 2_800,
  3_000, 3_200, 3_400, 3_600, 3_800, 4_000, 4_400, 4_800, 5_200, 5_600, 6_000, 6_500, 7_000,
];

export const MONTHLY_TABLE_AMOUNTS: readonly number[] = [
  1_500, 2_000, 2_500, 3_000, 3_500, 4_000, 4_500, 5_000, 5_500, 6_000, 6_500,
  7_000, 7_500, 8_000, 8_500, 9_000, 10_000, 11_000, 12_000, 13_000, 15_000,
];

// Re-export for pages that want to explain the shading parameters.
export { LITO, MEDICARE_LEVY };
