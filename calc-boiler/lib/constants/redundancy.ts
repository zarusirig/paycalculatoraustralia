// =============================================================================
// Redundancy pay — NES scale, genuine redundancy tax-free limit and ETP tax
//
// NES scale: Fair Work Act 2009 s 119(2) table, as published by the Fair Work
// Ombudsman ("Redundancy pay & entitlements",
// https://www.fairwork.gov.au/ending-employment/redundancy/redundancy-pay-and-entitlements).
// The same table is REDUNDANCY_WEEKS in australian-tax.ts; this file re-reads
// it as numeric bands so the calculator, the HTML table and the tests all use
// one lookup.
//
// Tax figures: ATO "Employment termination payments" key rates and thresholds
// (https://www.ato.gov.au/tax-rates-and-codes/key-superannuation-rates-and-thresholds/employment-termination-payments,
// last updated 17 April 2026) and ATO "Tax table for employment termination
// payments" (Schedule 11, last updated 17 June 2026). ato.gov.au blocks
// automated fetches, so these were read from the ATO pages' own indexed text
// on 23 September 2026:
//   - "Tax-free part of genuine redundancy and early retirement scheme
//      payments; 2026–27 $13,598 $6,801; 2025–26 $13,100 $6,552; 2024–25 $12,524 ..."
//   - Schedule 11: "The tax-free base limit for the 2026-27 income year is
//      $13,598 plus $6,801 for each completed year of service."
//   - "ETP cap for life benefit termination payments; 2026–27 $270,000;
//      2025–26 $260,000; 2024–25 $245,000; 2023–24 $235,000."
//   - "The whole-of-income cap is $180,000 ... This amount is not indexed."
//
// Why only the ETP cap matters here: the part of a genuine redundancy payment
// above the tax-free limit is an "excluded" ETP, which is tested against the
// ETP cap only — not the $180,000 whole-of-income cap (ATO, "How ETP
// components are taxed"; MLC technical guide worked example).
//
// Rates on the taxable component up to the ETP cap (ITAA 1997 s 82-10, plus
// the 2% Medicare levy, as the ATO quotes them): 17% if you have reached
// preservation age by the end of the income year, 32% if you have not. Above
// the cap: top marginal rate plus Medicare levy, 47%.
//
// Genuine redundancy conditions (ITAA 1997 s 83-175; ATO TR 2009/2): the
// employee is dismissed because the position is genuinely redundant, before
// reaching pension age (67 since 1 July 2023); the payment is no more than an
// arm's length amount; and there is no arrangement to re-employ.
// =============================================================================

export interface RedundancyTaxYear {
  incomeYear: string;
  /** Tax-free base amount for a genuine redundancy. */
  taxFreeBase: number;
  /** Added for each COMPLETED year of service. */
  taxFreePerYear: number;
  /** ETP cap for life benefit termination payments. */
  etpCap: number;
}

export const REDUNDANCY_TAX_2026_27: RedundancyTaxYear = {
  incomeYear: "2026-27",
  taxFreeBase: 13_598,
  taxFreePerYear: 6_801,
  etpCap: 270_000,
};

/** Retained for year-on-year comparison only (payments made before 1 July 2026). */
export const REDUNDANCY_TAX_2025_26: RedundancyTaxYear = {
  incomeYear: "2025-26",
  taxFreeBase: 13_100,
  taxFreePerYear: 6_552,
  etpCap: 260_000,
};

/** The year the calculator applies. */
export const REDUNDANCY_TAX = REDUNDANCY_TAX_2026_27;

/** ETP tax rates on the taxable component, INCLUDING the 2% Medicare levy. */
export const ETP_RATES = {
  underPreservationAge: 0.32,
  atOrOverPreservationAge: 0.17,
  aboveCap: 0.47,
} as const;

/** Preservation age for everyone born after 30 June 1964. */
export const PRESERVATION_AGE = 60;

/** Age-pension age — a dismissal at or after it cannot be a genuine redundancy. */
export const GENUINE_REDUNDANCY_AGE_LIMIT = 67;

/** Headcount below which an employer is exempt from NES redundancy pay (s 121(1)(b)). */
export const SMALL_BUSINESS_HEADCOUNT = 15;

/** NES redundancy pay, s 119(2): completed years of continuous service → weeks. */
export const NES_REDUNDANCY_SCALE: readonly { fromYears: number; toYears: number | null; weeks: number }[] = [
  { fromYears: 0, toYears: 1, weeks: 0 },
  { fromYears: 1, toYears: 2, weeks: 4 },
  { fromYears: 2, toYears: 3, weeks: 6 },
  { fromYears: 3, toYears: 4, weeks: 7 },
  { fromYears: 4, toYears: 5, weeks: 8 },
  { fromYears: 5, toYears: 6, weeks: 10 },
  { fromYears: 6, toYears: 7, weeks: 11 },
  { fromYears: 7, toYears: 8, weeks: 13 },
  { fromYears: 8, toYears: 9, weeks: 14 },
  { fromYears: 9, toYears: 10, weeks: 16 },
  { fromYears: 10, toYears: null, weeks: 12 },
] as const;

/** NES weeks for a period of continuous service in years (part years are dropped). */
export function nesRedundancyWeeks(yearsOfService: number): number {
  const y = Math.max(0, Math.floor(yearsOfService));
  const band = NES_REDUNDANCY_SCALE.find((b) => y >= b.fromYears && (b.toYears === null || y < b.toYears));
  return band ? band.weeks : 0;
}

/** Tax-free limit for a genuine redundancy: base + per-year × COMPLETED years. */
export function genuineRedundancyTaxFreeLimit(
  completedYears: number,
  year: RedundancyTaxYear = REDUNDANCY_TAX,
): number {
  return year.taxFreeBase + year.taxFreePerYear * Math.max(0, Math.floor(completedYears));
}

export interface RedundancyTaxInput {
  /** The redundancy payment itself — excludes leave and notice pay. */
  grossPayment: number;
  completedYears: number;
  genuine: boolean;
  reachedPreservationAge: boolean;
  year?: RedundancyTaxYear;
}

export interface RedundancyTaxResult {
  taxFreeLimit: number;
  taxFree: number;
  /** Taxable component, treated as an ETP. */
  etpTaxable: number;
  etpWithinCap: number;
  etpAboveCap: number;
  rateWithinCap: number;
  tax: number;
  net: number;
}

/**
 * Tax on a redundancy payment. A genuine redundancy is tax-free up to the
 * limit; the rest is an ETP taxed at the concessional rate up to the ETP cap
 * and 47% above it. A non-genuine redundancy is wholly an ETP. For a
 * non-genuine payment (a non-excluded ETP) the whole-of-income cap can also
 * apply; that depends on the person's other taxable income and is not
 * modelled, so the result is a floor on the tax, noted on the page.
 */
export function redundancyTax(input: RedundancyTaxInput): RedundancyTaxResult {
  const year = input.year ?? REDUNDANCY_TAX;
  const gross = Math.max(0, input.grossPayment);
  const taxFreeLimit = input.genuine ? genuineRedundancyTaxFreeLimit(input.completedYears, year) : 0;
  const taxFree = Math.min(gross, taxFreeLimit);
  const etpTaxable = gross - taxFree;
  const etpWithinCap = Math.min(etpTaxable, year.etpCap);
  const etpAboveCap = etpTaxable - etpWithinCap;
  const rateWithinCap = input.reachedPreservationAge
    ? ETP_RATES.atOrOverPreservationAge
    : ETP_RATES.underPreservationAge;
  const tax = etpWithinCap * rateWithinCap + etpAboveCap * ETP_RATES.aboveCap;
  return { taxFreeLimit, taxFree, etpTaxable, etpWithinCap, etpAboveCap, rateWithinCap, tax, net: gross - tax };
}
