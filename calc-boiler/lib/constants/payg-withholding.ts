// =============================================================================
// PAYG Withholding Engine — FY2026-27
// Single source of truth for the weekly / fortnightly / monthly tax-table
// pages and the Schedule 5 (back payments, bonuses, commissions) page.
//
// Methodology: the published ATO Schedule 1 (NAT 1004) coefficient method.
// Earnings are converted to a weekly equivalent, the scale's `a` and `b`
// coefficients are applied as y = a·x − b, the result is rounded to the
// nearest dollar, and that weekly amount is converted back to the pay period.
// This reproduces the printed NAT 1005/1006/1007 tables exactly.
//
// It replaces an earlier annualise-and-divide approach which subtracted the
// FULL Low Income Tax Offset and so materially under-withheld: at $1,000 a
// fortnight it produced $18 against the ATO's $40. The ATO scales deliberately
// do not deliver the whole LITO through withholding.
//
// Verified against the ATO's own worked example (fortnightly $989.80):
//   Scale 2 → floor(989.80/2)+0.99 = 494.99; 0.1500×494.99 − 54.3462 = 19.90
//             → $20 × 2 = $40   (ATO column 2: $40)
//   Scale 1 → 0.1790×494.99 − 0.1066 = 88.50 → $88 × 2 = $176
//             (ATO column 3: $176)
// See lib/constants/__tests__/payg-withholding.test.ts.
//
// FY2026-27 change: from 1 July 2026 the 16% rate on $18,201–$45,000 falls
// to 15% (Treasury Laws Amendment (Cost of Living Tax Cuts) Act 2025) — see
// TAX_HISTORY.upcomingFY2026_27 in australian-tax.ts.
// =============================================================================

// calculateHECS is deliberately NOT imported here. The STSL withholding
// component comes from Schedule 8's own coefficients, not from the annual
// repayment schedule — mixing the two is what produced the defect fixed on
// 28 July 2026.
import { LITO, MEDICARE_LEVY } from "./australian-tax";

export const PAYG_FINANCIAL_YEAR = "2026-27";
export const PAYG_TABLES_UPDATED = "1 July 2026";

/**
 * Financial years the engine carries full Schedule 1 coefficient sets for.
 * The current year comes first. The tax-table pages offer these as an FY
 * toggle so payroll staff can check a pay run from the previous year.
 */
export type PaygFinancialYear = "2026-27" | "2025-26";
export const PAYG_FINANCIAL_YEARS: readonly PaygFinancialYear[] = ["2026-27", "2025-26"];
export const PAYG_PREVIOUS_FINANCIAL_YEAR: PaygFinancialYear = "2025-26";

export interface PaygYearInfo {
  readonly fy: PaygFinancialYear;
  /** Plain-English period the ATO says the schedule applies to. */
  readonly appliesTo: string;
  readonly schedule1Url: string;
  readonly sampleDataUrl: string;
  /** Whether the engine carries this year's Schedule 8 (STSL) coefficients. */
  readonly stslSupported: boolean;
}

export const PAYG_YEAR_INFO: Record<PaygFinancialYear, PaygYearInfo> = {
  "2026-27": {
    fy: "2026-27",
    appliesTo: "payments made from 1 July 2026",
    schedule1Url:
      "https://www.ato.gov.au/tax-rates-and-codes/payg-withholding-schedule-1-statement-of-formulas-for-calculating-amounts-to-be-withheld",
    sampleDataUrl:
      "https://www.ato.gov.au/tax-rates-and-codes/payg-withholding-schedule-1-statement-of-formulas-for-calculating-amounts-to-be-withheld/sample-data/withholding-amounts-sample-data",
    stslSupported: true,
  },
  "2025-26": {
    fy: "2025-26",
    // The ATO did not reissue Schedule 1 on 1 July 2025: the 1 July 2024
    // edition "applied to payments made from 1 July 2024 to 30 June 2026".
    appliesTo: "payments made from 1 July 2024 to 30 June 2026",
    schedule1Url:
      "https://www.ato.gov.au/tax-rates-and-codes/schedule-1-tax-table-01-july-2024-to-30-june-2026",
    sampleDataUrl:
      "https://www.ato.gov.au/tax-rates-and-codes/schedule-1-tax-table-01-july-2024-to-30-june-2026/sample-data/withholding-amounts-sample-data",
    // Schedule 8 changed part-way through 2025-26 (one edition for 1 July to
    // 23 September 2025, another from 24 September 2025 to 30 June 2026), so a
    // single 2025-26 STSL figure would be wrong for part of the year. Not
    // carried — the pages disable the study-loan option for this year.
    stslSupported: false,
  },
};

// The FY2026-27 scale now lives in australian-tax.ts as the sitewide single
// source of truth. Re-exported here so existing tax-table page imports keep
// working.
export { TAX_BRACKETS_2026_27 } from "./australian-tax";

// ---------- ATO Schedule 1 coefficients (NAT 1004, from 1 July 2026) ----------
// Source: ato.gov.au/tax-rates-and-codes/payg-withholding-schedule-1-statement-
// of-formulas-for-calculating-amounts-to-be-withheld/coefficients-to-use-in-
// formulas-for-withholding-from-weekly-payments (published 17 June 2026).
// Re-read digit for digit on 23 September 2026: Scales 1, 2 and 3 match. The
// engine also reproduces every Scale 1/2/3 row of the ATO's own "Withholding
// amounts sample data" page (weekly, fortnightly and monthly) — see the tests.
//
// Each band applies where the weekly equivalent x is LESS THAN `lessThan`.
// `a: null` marks a nil-withholding band.
export interface CoefficientBand {
  readonly lessThan: number;
  readonly a: number | null;
  readonly b: number;
}

/** Scale 2 — payee claimed the tax-free threshold. The common case. */
export const SCALE_2_TFT: readonly CoefficientBand[] = [
  { lessThan: 362, a: null, b: 0 },
  { lessThan: 538, a: 0.1500, b: 54.3462 },
  { lessThan: 673, a: 0.2500, b: 108.2135 },
  { lessThan: 721, a: 0.1700, b: 54.3473 },
  { lessThan: 865, a: 0.1790, b: 60.8377 },
  { lessThan: 1_282, a: 0.3227, b: 185.1935 },
  { lessThan: 2_596, a: 0.3200, b: 181.7319 },
  { lessThan: 3_653, a: 0.3900, b: 363.4627 },
  { lessThan: Infinity, a: 0.4700, b: 655.7704 },
] as const;

/** Scale 1 — payee did NOT claim the tax-free threshold (typical second job). */
export const SCALE_1_NO_TFT: readonly CoefficientBand[] = [
  { lessThan: 188, a: 0.1500, b: 0.1500 },
  { lessThan: 371, a: 0.2084, b: 11.0185 },
  { lessThan: 515, a: 0.1790, b: 0.1066 },
  { lessThan: 932, a: 0.3227, b: 74.1674 },
  { lessThan: 2_246, a: 0.3200, b: 71.6508 },
  { lessThan: 3_303, a: 0.3900, b: 228.8816 },
  { lessThan: Infinity, a: 0.4700, b: 493.1893 },
] as const;

/** Scale 3 — foreign residents. No tax-free threshold, no Medicare levy. */
export const SCALE_3_FOREIGN: readonly CoefficientBand[] = [
  { lessThan: 2_596, a: 0.3000, b: 0.3000 },
  { lessThan: 3_653, a: 0.3700, b: 181.7308 },
  { lessThan: Infinity, a: 0.4500, b: 474.0385 },
] as const;

// ---------- ATO Schedule 1 coefficients, 1 July 2024 to 30 June 2026 ----------
// Used for FY2025-26 (the same edition also covered FY2024-25). Source:
// https://www.ato.gov.au/tax-rates-and-codes/schedule-1-tax-table-01-july-2024-to-30-june-2026/coefficients-to-use-in-formulas-for-withholding-from-weekly-payments
// (published 17 June 2024; read 23 September 2026). Scale 1 carries a negative
// b in the $371–$515 band — the ATO notes "This is intentional."

/** Scale 2 (tax-free threshold claimed), 1 July 2024 to 30 June 2026. */
export const SCALE_2_TFT_2025_26: readonly CoefficientBand[] = [
  { lessThan: 361, a: null, b: 0 },
  { lessThan: 500, a: 0.1600, b: 57.8462 },
  { lessThan: 625, a: 0.2600, b: 107.8462 },
  { lessThan: 721, a: 0.1800, b: 57.8462 },
  { lessThan: 865, a: 0.1890, b: 64.3365 },
  { lessThan: 1_282, a: 0.3227, b: 180.0385 },
  { lessThan: 2_596, a: 0.3200, b: 176.5769 },
  { lessThan: 3_653, a: 0.3900, b: 358.3077 },
  { lessThan: Infinity, a: 0.4700, b: 650.6154 },
] as const;

/** Scale 1 (no tax-free threshold), 1 July 2024 to 30 June 2026. */
export const SCALE_1_NO_TFT_2025_26: readonly CoefficientBand[] = [
  { lessThan: 150, a: 0.1600, b: 0.1600 },
  { lessThan: 371, a: 0.2117, b: 7.7550 },
  { lessThan: 515, a: 0.1890, b: -0.6702 },
  { lessThan: 932, a: 0.3227, b: 68.2367 },
  { lessThan: 2_246, a: 0.3200, b: 65.7202 },
  { lessThan: 3_303, a: 0.3900, b: 222.9510 },
  { lessThan: Infinity, a: 0.4700, b: 487.2587 },
] as const;

/** Scale 3 (foreign residents), 1 July 2024 to 30 June 2026 — identical to 2026-27. */
export const SCALE_3_FOREIGN_2025_26: readonly CoefficientBand[] = [
  { lessThan: 2_596, a: 0.3000, b: 0.3000 },
  { lessThan: 3_653, a: 0.3700, b: 181.7308 },
  { lessThan: Infinity, a: 0.4500, b: 474.0385 },
] as const;

/** Scale 4 — no TFN provided. Flat rate on earnings, cents ignored. */
export const NO_TFN_RATES = { resident: 0.47, foreignResident: 0.45 } as const;

/** Medicare levy parameters embedded in Scale 2 (FY2026-27). */
export const SCALE_2_MEDICARE = {
  weeklyThreshold: 538,
  weeklyShadeInThreshold: 673,
  annualThreshold: 28_011,
  annualShadeInThreshold: 35_013,
  familyThreshold: 47_238,
  additionalChild: 4_338,
  rate: 0.02,
} as const;

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

/** ATO rounding: to the nearest dollar, with exact .50 going up. */
function roundATO(amount: number): number {
  return Math.floor(amount + 0.5);
}

/**
 * Convert pay-period earnings to the weekly equivalent `x` used by the
 * Schedule 1 formulas.
 *
 * Weekly:      ignore cents, add 99c.
 * Fortnightly: halve, ignore cents, add 99c.
 * Monthly:     if the amount ends in exactly 33c add 1c, then × 3 ÷ 13,
 *              ignore cents, add 99c.
 */
function toWeeklyEquivalent(gross: number, frequency: PayFrequency): number {
  if (frequency === "weekly") return Math.floor(gross) + 0.99;
  if (frequency === "fortnightly") return Math.floor(gross / 2) + 0.99;
  const cents = Math.round((gross % 1) * 100);
  const adjusted = cents === 33 ? gross + 0.01 : gross;
  return Math.floor((adjusted * 3) / 13) + 0.99;
}

/** Convert a weekly withholding amount back to the pay period. */
function fromWeeklyWithholding(weekly: number, frequency: PayFrequency): number {
  if (frequency === "weekly") return weekly;
  if (frequency === "fortnightly") return weekly * 2;
  return roundATO((weekly * 13) / 3);
}

/** Apply a coefficient scale: y = a·x − b, rounded to the nearest dollar. */
function applyScale(x: number, scale: readonly CoefficientBand[]): number {
  for (const band of scale) {
    if (x < band.lessThan) {
      if (band.a === null) return 0;
      return Math.max(0, roundATO(band.a * x - band.b));
    }
  }
  return 0;
}

export type WithholdingScale = "tft" | "noTft" | "foreignResident";

const SCALES_BY_YEAR: Record<PaygFinancialYear, Record<WithholdingScale, readonly CoefficientBand[]>> = {
  "2026-27": {
    tft: SCALE_2_TFT,
    noTft: SCALE_1_NO_TFT,
    foreignResident: SCALE_3_FOREIGN,
  },
  "2025-26": {
    tft: SCALE_2_TFT_2025_26,
    noTft: SCALE_1_NO_TFT_2025_26,
    foreignResident: SCALE_3_FOREIGN_2025_26,
  },
};

// ---------- Schedule 8 (NAT 3539): study and training support loans ----------
//
// Published 17 June 2026, applies to payments made from 1 July 2026.
//
// From FY2025-26 student loan repayments moved to a MARGINAL system, so the
// component is y = ax − b on the weekly equivalent — not a flat percentage of
// income, and not the annual repayment schedule divided back to the period.
//
// This engine previously annualised earnings, ran the annual HECS bands and
// divided the result by the number of pay periods. That is the same
// annualise-and-divide shape as the NAT 1006 defect fixed in July 2026, and it
// produced fortnightly figures the ATO never publishes — the ATO always derives
// a rounded WEEKLY component and doubles it, so a fortnightly STSL amount is
// necessarily even.

/** Schedule 8 — tax-free threshold claimed, or foreign resident. */
export const STSL_TFT: readonly CoefficientBand[] = [
  { lessThan: 1_337, a: null, b: 0 },
  { lessThan: 2_494, a: 0.1500, b: 200.5615 },
  { lessThan: 3_577, a: 0.1700, b: 250.4527 },
  { lessThan: Infinity, a: 0.1000, b: 0 },
] as const;

/** Schedule 8 — tax-free threshold NOT claimed. */
export const STSL_NO_TFT: readonly CoefficientBand[] = [
  { lessThan: 987, a: null, b: 0 },
  { lessThan: 2_144, a: 0.1500, b: 148.0615 },
  { lessThan: 2_727, a: 0.1700, b: 190.9527 },
  { lessThan: Infinity, a: 0.1000, b: 0 },
] as const;

const STSL_SCALES: Record<WithholdingScale, readonly CoefficientBand[]> = {
  // The ATO groups "tax-free threshold claimed" and "foreign resident" into one
  // STSL table; only the no-threshold case differs.
  tft: STSL_TFT,
  foreignResident: STSL_TFT,
  noTft: STSL_NO_TFT,
};

/**
 * Study and training support loans component for one pay period, per ATO
 * Schedule 8. Uses the same weekly-equivalent machinery as Schedule 1, so a
 * fortnightly component is always an even number of dollars.
 */
export function stslForPeriod(
  grossPerPeriod: number,
  frequency: PayFrequency,
  scale: WithholdingScale = "tft"
): number {
  if (grossPerPeriod <= 0) return 0;
  const x = toWeeklyEquivalent(grossPerPeriod, frequency);
  const weekly = applyScale(x, STSL_SCALES[scale]);
  return fromWeeklyWithholding(weekly, frequency);
}

/**
 * Withholding for one pay period under a given Schedule 1 scale.
 * This is the ATO's published method and reproduces NAT 1005/1006/1007.
 */
export function withholdingForPeriod(
  grossPerPeriod: number,
  frequency: PayFrequency,
  scale: WithholdingScale = "tft",
  financialYear: PaygFinancialYear = PAYG_FINANCIAL_YEAR
): number {
  if (grossPerPeriod <= 0) return 0;
  const x = toWeeklyEquivalent(grossPerPeriod, frequency);
  const weekly = applyScale(x, SCALES_BY_YEAR[financialYear][scale]);
  return fromWeeklyWithholding(weekly, frequency);
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
  /** Use the foreign-resident scale (Scale 3) — no threshold, no Medicare levy. */
  foreignResident?: boolean;
  /**
   * Which year's Schedule 1 coefficients to use (default: the current year).
   * STSL is only computed where PAYG_YEAR_INFO[fy].stslSupported is true; for
   * other years `hasSTSL` yields no component and `stslSupported` is false.
   */
  financialYear?: PaygFinancialYear;
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
  /** False when STSL was requested for a year whose Schedule 8 is not carried. */
  stslSupported: boolean;
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
  const {
    claimsTaxFreeThreshold = true,
    hasSTSL = false,
    foreignResident = false,
    financialYear = PAYG_FINANCIAL_YEAR,
  } = options;
  const periods = PAY_PERIODS[frequency];
  const gross = Math.max(0, grossPerPeriod);
  const annual = gross * periods;

  const scale: WithholdingScale = foreignResident
    ? "foreignResident"
    : claimsTaxFreeThreshold
      ? "tft"
      : "noTft";

  const paygWithheld = withholdingForPeriod(gross, frequency, scale, financialYear);
  const yearHasStsl = PAYG_YEAR_INFO[financialYear].stslSupported;

  // STSL (Schedule 8, NAT 3539) uses its own coefficient table on the weekly
  // equivalent — NOT the annual repayment schedule divided back to the period.
  // Which STSL table applies depends on the same threshold/residency choice as
  // the PAYG scale above.
  const stslWithheld = hasSTSL && yearHasStsl ? stslForPeriod(gross, frequency, scale) : 0;
  const totalWithheld = paygWithheld + stslWithheld;

  return {
    grossPerPeriod: gross,
    paygWithheld,
    stslWithheld,
    totalWithheld,
    netPerPeriod: Math.round((gross - totalWithheld) * 100) / 100,
    annualEquivalent: annual,
    stslSupported: !hasSTSL || yearHasStsl,
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
  /** The 47% ceiling for this payment (Schedule 5, "Withholding limit"). */
  withholdingLimit: number;
  /** True where the uncapped calculation exceeded the limit and was reduced. */
  withholdingLimitApplied: boolean;
  /** What the calculation produced before the limit was applied. */
  uncappedWithholding: number;
}

/**
 * Schedule 5 withholding limit. Verified verbatim at ato.gov.au (QC107123,
 * "Working out the withholding amount", published 17 June 2026):
 *
 *   "If you use Method A or Method B(ii), the amount of tax to be withheld
 *    from an additional payment is limited to a maximum of 47% of the
 *    additional payment."
 *
 * Two details that matter and are easy to miss:
 *  - the cap applies to the COMBINED total "including a study and training
 *    support loan component", not to the PAYG component alone; and
 *  - it applies to the additional payment only, never to normal earnings for
 *    the current pay period.
 */
export const SCHEDULE_5_WITHHOLDING_LIMIT = 0.47;

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

  // Step 7: multiply the per-period difference back out.
  const uncapped = perPeriodDifference * periods;

  // Steps 9-10: the withholding limit. This previously capped at `additional`
  // — i.e. 100% of the payment — which let the result run past the ATO's
  // ceiling. On $8,000/fortnight regular plus a $1,000 bonus with STSL it
  // reached 57.2%. The limit binds on the combined PAYG + STSL figure, which
  // is what `totalWithheld` already is. "Ignore any cents" → floor to dollars.
  const limit = Math.floor(additional * SCHEDULE_5_WITHHOLDING_LIMIT);
  const withheld = Math.min(Math.floor(uncapped), limit);

  return {
    regularWithholding: base.totalWithheld,
    apportionedAmount: apportioned,
    combinedWithholding: combined.totalWithheld,
    perPeriodDifference,
    withheldFromAdditionalPayment: withheld,
    netAdditionalPayment: Math.round((additional - withheld) * 100) / 100,
    effectiveRate: additional > 0 ? withheld / additional : 0,
    withholdingLimit: limit,
    withholdingLimitApplied: Math.floor(uncapped) > limit,
    uncappedWithholding: Math.floor(uncapped),
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

// ---------- Full stepped tax table + CSV export ----------
// The weekly / fortnightly / monthly pages render a full HTML table in fixed
// earnings steps and offer the same data, in whole-dollar steps, as a CSV the
// browser generates on click. Both come from withholdingForPeriod, so they can
// never drift from the lookup.

export interface TaxTableRow {
  gross: number;
  /** Column 2 of the ATO table: tax-free threshold claimed (Scale 2). */
  withTFT: number;
  /** Column 3 of the ATO table: no tax-free threshold (Scale 1). */
  noTFT: number;
  /** Scale 2 plus the Schedule 8 STSL component; null where not carried. */
  withTFTAndSTSL: number | null;
  /** Scale 3, foreign resident. */
  foreignResident: number;
}

export interface TaxTableRange {
  readonly from: number;
  readonly to: number;
  readonly step: number;
}

/** Ranges rendered as HTML on each page — steps keep the page light. */
export const HTML_TABLE_RANGES: Record<PayFrequency, TaxTableRange> = {
  weekly: { from: 350, to: 4_000, step: 50 },
  fortnightly: { from: 700, to: 8_000, step: 100 },
  monthly: { from: 1_500, to: 17_500, step: 250 },
};

/**
 * Ranges for the whole-dollar CSV download. Weekly and monthly use $1 steps;
 * fortnightly uses $2 steps because the ATO's fortnightly figures only change
 * every $2 of earnings (earnings are halved before the weekly formula).
 */
export const CSV_TABLE_RANGES: Record<PayFrequency, TaxTableRange> = {
  weekly: { from: 0, to: 5_000, step: 1 },
  fortnightly: { from: 0, to: 10_000, step: 2 },
  monthly: { from: 0, to: 21_000, step: 1 },
};

export function buildTaxTableRows(
  frequency: PayFrequency,
  financialYear: PaygFinancialYear,
  range: TaxTableRange
): TaxTableRow[] {
  const rows: TaxTableRow[] = [];
  const stsl = PAYG_YEAR_INFO[financialYear].stslSupported;
  for (let gross = range.from; gross <= range.to; gross += range.step) {
    const withTFT = withholdingForPeriod(gross, frequency, "tft", financialYear);
    rows.push({
      gross,
      withTFT,
      noTFT: withholdingForPeriod(gross, frequency, "noTft", financialYear),
      withTFTAndSTSL: stsl ? withTFT + stslForPeriod(gross, frequency, "tft") : null,
      foreignResident: withholdingForPeriod(gross, frequency, "foreignResident", financialYear),
    });
  }
  return rows;
}

/** CSV text for a set of rows. Plain numbers, no currency symbols. */
export function taxTableCsv(
  frequency: PayFrequency,
  financialYear: PaygFinancialYear,
  rows: readonly TaxTableRow[]
): string {
  const period = FREQUENCY_LABELS[frequency];
  const hasStsl = rows.some((r) => r.withTFTAndSTSL !== null);
  const header = [
    `${period.charAt(0).toUpperCase()}${period.slice(1)}ly earnings ($)`,
    "Withheld - tax-free threshold claimed ($)",
    "Withheld - no tax-free threshold ($)",
    ...(hasStsl ? ["Withheld - tax-free threshold + study loan ($)"] : []),
    "Withheld - foreign resident ($)",
  ];
  const lines = [
    `# PAYG withholding ${financialYear}, ${period}ly pay, computed from ATO Schedule 1 (NAT 1004): ${PAYG_YEAR_INFO[financialYear].schedule1Url}`,
    header.join(","),
    ...rows.map((r) =>
      [
        r.gross,
        r.withTFT,
        r.noTFT,
        ...(hasStsl ? [r.withTFTAndSTSL ?? ""] : []),
        r.foreignResident,
      ].join(",")
    ),
  ];
  return lines.join("\n") + "\n";
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
