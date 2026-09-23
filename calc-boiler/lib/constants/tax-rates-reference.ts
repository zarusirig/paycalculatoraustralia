// =============================================================================
// Tax rates reference — year-by-year scales, marginal-rate analysis, LITO
// effective thresholds and the year-end withholding estimate.
//
// Composes the single sources of truth; defines NO new rate of its own except
// where marked "VERIFIED" below:
//   australian-tax.ts   TAX_BRACKETS_2026_27, TAX_BRACKETS_2025_26,
//                       NON_RESIDENT_TAX_BRACKETS, LITO, MEDICARE_LEVY,
//                       calculateIncomeTax / LITO / MedicareLevy / HECS
//   payg-withholding.ts calculatePAYGWithholding (Schedule 1 + Schedule 8,
//                       verified against 288 ATO sample rows)
//
// Sources, read 23 September 2026 via Firecrawl:
//  - ATO "Tax rates – Australian resident" (last updated 13 Aug 2026):
//    https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents
//    2026-27: "$18,201 – $45,000 | 15c for each $1 over $18,200",
//    "$45,001 – $135,000 | $4,020 plus 30c", "$135,001 – $190,000 | $31,020
//    plus 37c", "$190,001 and over | $51,370 plus 45c". 2025-26: 16c, $4,288,
//    $31,288, $51,638. "These rates don't include the Medicare levy".
//  - ATO "Personal income tax - new tax cuts for every Australian taxpayer"
//    (QC104015, last updated 13 May 2026): "This measure is now law." / "From
//    1 July 2026, the 16 per cent rate will be reduced to 15 per cent." /
//    "From 1 July 2027, the 15 per cent rate will be reduced further to 14 per
//    cent."
//    https://www.ato.gov.au/about-ato/new-legislation/in-detail/individuals/personal-income-tax-new-tax-cuts-for-every-australian-taxpayer
//  - Parliament of Australia, Treasury Laws Amendment (More Cost of Living
//    Relief) Bill 2025 (r7331): amends the Income Tax Rates Act 1986 "to reduce
//    the first income tax marginal rate to 15 per cent for the 2026-27
//    financial year and to 14 per cent for the 2027-28 and later financial
//    years"; passed both Houses 26 Mar 2025; assent 27 Mar 2025, Act No. 28 of
//    2025.
//    https://www.aph.gov.au/Parliamentary_Business/Bills_Legislation/Bills_Search_Results/Result?bId=r7331
//  - ATO "Tax rates – working holiday maker" (QC73322, last updated 1 Jun
//    2026). Latest table published is 2025-26: "0 – $45,000 | 15c for each
//    $1", "$45,001 – $135,000 | $6,750 plus 30c", "$135,001 – $190,000 |
//    $33,750 plus 37c", "$190,001 and over | $54,100 plus 45c".
//    https://www.ato.gov.au/tax-rates-and-codes/tax-rates-working-holiday-makers
//  - ATO "Tax rates – foreign resident" (last updated 1 Jun 2026): latest
//    table published is 2025-26 — 30c to $135,000, $40,500 + 37c, $60,850 +
//    45c — matching NON_RESIDENT_TAX_BRACKETS.
//    https://www.ato.gov.au/tax-rates-and-codes/tax-rates-foreign-residents
//  - ATO "Low income tax offset" (QC105020, last updated 8 Jun 2026): "$37,500
//    or less ... maximum offset of $700"; "$37,501 and $45,000 ... $700 minus 5
//    cents for every $1 above $37,500"; "$45,001 and $66,667 ... $325 minus 1.5
//    cents for every $1 above $45,000"; "can only reduce your tax payable to
//    $0".
// =============================================================================

import {
  LITO,
  MEDICARE_LEVY,
  NON_RESIDENT_TAX_BRACKETS,
  TAX_BRACKETS_2025_26,
  TAX_BRACKETS_2026_27,
  TAX_FREE_THRESHOLD,
  calculateHECS,
  calculateIncomeTax,
  calculateLITO,
  calculateMedicareLevy,
  type TaxBracket,
} from "./australian-tax";
import {
  PAY_PERIODS,
  calculatePAYGWithholding,
  type PayFrequency,
  type WithholdingResult,
} from "./payg-withholding";

// ---------------------------------------------------------------------------
// Scales
// ---------------------------------------------------------------------------

/** Tax on `income` under any bracket scale (same formula as calculateIncomeTax). */
export function taxOnScale(income: number, brackets: readonly TaxBracket[]): number {
  if (income <= 0) return 0;
  for (let i = brackets.length - 1; i >= 0; i--) {
    const b = brackets[i];
    if (income >= b.min) return b.base + (income - (b.min - 1)) * b.rate;
  }
  return 0;
}

function centsLabel(rate: number): string {
  return `${Math.round(rate * 1000) / 10}c`;
}

/**
 * Rebuild a resident scale with a different second-bracket rate, recomputing
 * every base amount from the thresholds. Used to derive 2027-28 (14%) from
 * the 2026-27 thresholds, which the More Cost of Living Relief Act leaves
 * untouched. The tests prove this reproduces the ATO's own 2025-26 (16%) and
 * 2026-27 (15%) tables to the dollar.
 */
export function deriveResidentScale(template: readonly TaxBracket[], secondRate: number): TaxBracket[] {
  const out: TaxBracket[] = [];
  let base = 0;
  template.forEach((b, i) => {
    const rate = i === 1 ? secondRate : b.rate;
    const prev = template[i - 1];
    if (i > 0) {
      const prevRate = i - 1 === 1 ? secondRate : prev.rate;
      base += (prev.max - (prev.min - 1)) * prevRate;
    }
    const roundedBase = Math.round(base);
    const over = formatWhole(b.min - 1);
    const label = i === 0 ? b.label : `${centsLabel(rate)} for each $1 over ${over}`;
    out.push({ min: b.min, max: b.max, rate, base: i <= 1 ? 0 : roundedBase, label });
  });
  return out;
}

function formatWhole(n: number): string {
  return `$${n.toLocaleString("en-AU")}`;
}

/**
 * FY2027-28 resident scale — LEGISLATED, not yet in force. Second rate 14%
 * (Act No. 28 of 2025); thresholds unchanged. The ATO's resident rates page
 * does not yet carry a 2027-28 table, so this is derived and labelled
 * "legislated" wherever it is rendered.
 */
export const TAX_BRACKETS_2027_28: readonly TaxBracket[] = deriveResidentScale(TAX_BRACKETS_2026_27, 0.14);

export const LEGISLATED_CUT_2027_28 = {
  effectiveDate: "1 July 2027",
  incomeYear: "2027-28",
  fromRate: 0.15,
  toRate: 0.14,
  act: "Treasury Laws Amendment (More Cost of Living Relief) Act 2025",
  actNumber: "Act No. 28 of 2025",
  assent: "27 March 2025",
  atoUrl:
    "https://www.ato.gov.au/about-ato/new-legislation/in-detail/individuals/personal-income-tax-new-tax-cuts-for-every-australian-taxpayer",
  aphUrl:
    "https://www.aph.gov.au/Parliamentary_Business/Bills_Legislation/Bills_Search_Results/Result?bId=r7331",
} as const;

/**
 * Working holiday maker scale (visa subclass 417 / 462). VERIFIED: ATO
 * QC73322, latest published table 2025-26. Rendered with that year label.
 */
export const WHM_TAX_BRACKETS_2025_26: readonly TaxBracket[] = [
  { min: 0, max: 45_000, rate: 0.15, base: 0, label: "15c for each $1" },
  { min: 45_001, max: 135_000, rate: 0.30, base: 6_750, label: "$6,750 plus 30c for each $1 over $45,000" },
  { min: 135_001, max: 190_000, rate: 0.37, base: 33_750, label: "$33,750 plus 37c for each $1 over $135,000" },
  { min: 190_001, max: Infinity, rate: 0.45, base: 54_100, label: "$54,100 plus 45c for each $1 over $190,000" },
] as const;
export const WHM_TABLE_YEAR = "2025-26";
/** The ATO's foreign-resident page also stops at 2025-26 (updated 1 Jun 2026). */
export const FOREIGN_TABLE_YEAR = "2025-26";
export { NON_RESIDENT_TAX_BRACKETS };

export type ScaleYear = "2025-26" | "2026-27" | "2027-28";
export const RESIDENT_SCALES: Readonly<Record<ScaleYear, readonly TaxBracket[]>> = {
  "2025-26": TAX_BRACKETS_2025_26,
  "2026-27": TAX_BRACKETS_2026_27,
  "2027-28": TAX_BRACKETS_2027_28,
};

/** Tax on each bracket ceiling — "how much tax at $45,000" etc. */
export function thresholdTax(brackets: readonly TaxBracket[]): { income: number; tax: number }[] {
  return brackets
    .filter((b) => Number.isFinite(b.max))
    .map((b) => ({ income: b.max, tax: Math.round(taxOnScale(b.max, brackets)) }));
}

/** Marginal bracket rate that applies to the dollar at `income`. */
export function bracketRateAt(income: number, brackets: readonly TaxBracket[] = TAX_BRACKETS_2026_27): number {
  let rate = 0;
  for (const b of brackets) if (income >= b.min) rate = b.rate;
  return rate;
}

// ---------------------------------------------------------------------------
// LITO — effective (nil-tax) threshold per scale
// ---------------------------------------------------------------------------

/** Resident income tax after LITO on a given scale, floored at nil. */
export function incomeTaxAfterLitoOnScale(income: number, brackets: readonly TaxBracket[]): number {
  // Rounded to cents: 5,000 × 0.14 is 700.0000000000001 in floating point.
  return Math.max(0, Math.round((taxOnScale(income, brackets) - calculateLITO(income)) * 100) / 100);
}

/**
 * Highest whole-dollar taxable income on which a resident pays no income tax
 * once LITO is applied, for a given scale. Derived, never hardcoded:
 * $18,200 + $700 ÷ second rate, floored. 16% → $22,575, 15% → $22,866,
 * 14% → $23,200.
 */
export function nilTaxIncomeOnScale(brackets: readonly TaxBracket[]): number {
  const guess = Math.floor(TAX_FREE_THRESHOLD + LITO.maxOffset / brackets[1].rate) + 2;
  let income = guess;
  while (income > TAX_FREE_THRESHOLD && incomeTaxAfterLitoOnScale(income, brackets) > 0) income -= 1;
  return income;
}

export type LitoPhase = "full" | "phase1" | "phase2" | "nil";

export interface LitoResult {
  income: number;
  offset: number;
  phase: LitoPhase;
  taxBeforeLito: number;
  /** LITO actually used — the offset is non-refundable. */
  offsetUsed: number;
  taxAfterLito: number;
  /** Offset that could not be used because tax was already nil. */
  offsetWasted: number;
}

export function litoPhase(income: number): LitoPhase {
  if (income <= LITO.fullOffsetCeiling) return "full";
  if (income <= LITO.phaseOut1.end) return "phase1";
  if (income <= LITO.phaseOut2.end) return "phase2";
  return "nil";
}

/** LITO for a resident taxable income on the current scale. */
export function litoBreakdown(income: number, brackets: readonly TaxBracket[] = TAX_BRACKETS_2026_27): LitoResult {
  const inc = Math.max(0, income);
  const offset = Math.round(calculateLITO(inc) * 100) / 100;
  const before = Math.round(taxOnScale(inc, brackets) * 100) / 100;
  const used = Math.min(offset, before);
  return {
    income: inc,
    offset,
    phase: litoPhase(inc),
    taxBeforeLito: before,
    offsetUsed: used,
    taxAfterLito: Math.round((before - used) * 100) / 100,
    offsetWasted: Math.round((offset - used) * 100) / 100,
  };
}

// ---------------------------------------------------------------------------
// Marginal vs average — what one income actually pays
// ---------------------------------------------------------------------------

export interface IncomeAnalysis {
  income: number;
  grossTax: number;
  lito: number;
  /** Income tax after LITO, rounded to the dollar. */
  incomeTax: number;
  medicareLevy: number;
  /** Income tax + Medicare levy. */
  totalTax: number;
  /** Bracket rate on the last dollar, excluding Medicare. */
  bracketRate: number;
  /** Bracket rate + 2% Medicare levy — the usual "marginal rate incl. Medicare". */
  marginalWithMedicare: number;
  /** Income tax ÷ income. */
  averageIncomeTaxRate: number;
  /** (Income tax + Medicare) ÷ income. */
  averageTotalRate: number;
  /** Extra income tax + Medicare on the next $1,000 of income. */
  taxOnNext1000: number;
  /** taxOnNext1000 ÷ 1,000 — shows LITO withdrawal and Medicare shade-in. */
  effectiveMarginalRate: number;
  takeHome: number;
}

function totalTaxAt(income: number, resident: boolean): { gross: number; lito: number; tax: number; medicare: number } {
  const gross = calculateIncomeTax(income, resident);
  const lito = resident ? calculateLITO(income) : 0;
  const tax = Math.max(0, Math.round(gross - lito));
  const medicare = resident ? calculateMedicareLevy(income) : 0;
  return { gross, lito, tax, medicare };
}

/**
 * Full marginal/average analysis of one taxable income for the current year.
 * Medicare levy uses the single low-income shading (MEDICARE_LEVY in
 * australian-tax.ts); the Medicare levy surcharge is excluded.
 */
export function analyseIncome(income: number, resident = true): IncomeAnalysis {
  const inc = Math.max(0, Math.round(income));
  const now = totalTaxAt(inc, resident);
  const next = totalTaxAt(inc + 1_000, resident);
  const totalTax = now.tax + now.medicare;
  const taxOnNext1000 = next.tax + next.medicare - totalTax;
  const bracketRate = bracketRateAt(inc, resident ? TAX_BRACKETS_2026_27 : NON_RESIDENT_TAX_BRACKETS);
  return {
    income: inc,
    grossTax: Math.round(now.gross),
    lito: Math.round(now.lito),
    incomeTax: now.tax,
    medicareLevy: now.medicare,
    totalTax,
    bracketRate,
    marginalWithMedicare: resident && bracketRate > 0 ? Math.round((bracketRate + MEDICARE_LEVY.rate) * 1000) / 1000 : bracketRate,
    averageIncomeTaxRate: inc > 0 ? now.tax / inc : 0,
    averageTotalRate: inc > 0 ? totalTax / inc : 0,
    taxOnNext1000,
    effectiveMarginalRate: taxOnNext1000 / 1_000,
    takeHome: inc - totalTax,
  };
}

// ---------------------------------------------------------------------------
// Tax withheld → year-end refund or bill
// ---------------------------------------------------------------------------

export interface YearEndInput {
  grossPerPeriod: number;
  frequency: PayFrequency;
  claimsTaxFreeThreshold: boolean;
  hasStudyLoan: boolean;
  foreignResident?: boolean;
}

export interface YearEndEstimate {
  perPeriod: WithholdingResult;
  periods: number;
  annualIncome: number;
  annualPaygWithheld: number;
  annualStslWithheld: number;
  annualWithheld: number;
  incomeTax: number;
  lito: number;
  medicareLevy: number;
  studyLoanRepayment: number;
  /** Income tax + Medicare levy + compulsory study loan repayment. */
  liability: number;
  /** annualWithheld − liability. Positive = likely refund, negative = likely bill. */
  difference: number;
}

/**
 * Annualise one regular pay's Schedule 1/8 withholding and compare it with
 * the actual 2026-27 liability on the same income, assuming this pay is the
 * person's only income for a full year and there are no deductions.
 */
export function estimateYearEnd(input: YearEndInput): YearEndEstimate {
  const { grossPerPeriod, frequency, claimsTaxFreeThreshold, hasStudyLoan, foreignResident = false } = input;
  const periods = PAY_PERIODS[frequency];
  const perPeriod = calculatePAYGWithholding(grossPerPeriod, frequency, {
    claimsTaxFreeThreshold: foreignResident ? false : claimsTaxFreeThreshold,
    hasSTSL: hasStudyLoan,
    foreignResident,
  });
  const annualIncome = Math.round(Math.max(0, grossPerPeriod) * periods * 100) / 100;
  const taxable = Math.floor(annualIncome);
  const t = totalTaxAt(taxable, !foreignResident);
  const studyLoanRepayment = hasStudyLoan ? calculateHECS(taxable) : 0;
  const liability = t.tax + t.medicare + studyLoanRepayment;
  const annualWithheld = perPeriod.totalWithheld * periods;
  return {
    perPeriod,
    periods,
    annualIncome,
    annualPaygWithheld: perPeriod.paygWithheld * periods,
    annualStslWithheld: perPeriod.stslWithheld * periods,
    annualWithheld,
    incomeTax: t.tax,
    lito: Math.round(t.lito),
    medicareLevy: t.medicare,
    studyLoanRepayment,
    liability,
    difference: annualWithheld - liability,
  };
}
