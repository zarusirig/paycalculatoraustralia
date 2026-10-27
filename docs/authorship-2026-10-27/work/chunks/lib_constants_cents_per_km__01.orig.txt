// =============================================================================
// Cents per kilometre — the ATO rate, the 5,000 km cap, and how a car
// allowance paid at that rate is withheld from and reported.
//
// RATES. ato.gov.au "Cents per kilometre method" (QC107246, last updated
// 12 August 2026, read 23 September 2026):
//   2026-27: 91c · 2024-25 and 2025-26: 88c · 2023-24: 85c · 2022-23: 78c ·
//   2020-21 and 2021-22: 72c.
// Maximum 5,000 work-related km per car per year; no receipts, but a record of
// how the km were worked out; you must own (or lease) the car; the rate covers
// ALL car costs (fuel, rego, insurance, repairs, depreciation) and nothing can
// be added on top. Joint owners using the car for separate work can each claim
// up to 5,000 km.
//
// WITHHOLDING. ato.gov.au "Withholding for allowances" (QC51680, last updated
// 26 August 2026, read 23 September 2026), Table 2 — cents per kilometre car
// expense payments using the approved rate:
//   • paid at the approved (or a lower) rate for up to 5,000 business km:
//     NO withholding; shown separately in the allowance box.
//   • at the approved rate for km OVER 5,000: withhold from the payment for
//     the excess km.
//   • at a rate ABOVE the approved rate, for up to 5,000 km: withhold from the
//     part above the approved rate.
// Table 1 of the same page: a car allowance for NON-deductible travel (home to
// work), including cents per km payments, is included in gross payments and
// withheld from like wages.
//
// ⚠️ AWARD TRANSPORT PAYMENTS change on 1 October 2026. Payments under an
// industrial instrument in force on 29 October 1986 used to be varied to nil
// withholding. The Treasury Laws Amendment (Tax Reform No. 1) Act 2026 (assent
// 26 June 2026) repealed those provisions: from 1 October 2026 employers
// withhold from them (ato.gov.au "Changes to award transport payments",
// QC66099, published 26 August 2026). This does not change Table 2.
// =============================================================================

export const CENTS_PER_KM_VERIFIED_ON = "23 September 2026";

export const CENTS_PER_KM_SOURCES = {
  atoMethod:
    "https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/deductions-you-can-claim/work-related-deductions/cars-transport-and-travel/motor-vehicle-and-car-expenses/expenses-for-a-car-you-own-or-lease/cents-per-kilometre-method",
  atoWithholdingForAllowances:
    "https://www.ato.gov.au/businesses-and-organisations/hiring-and-paying-your-workers/payg-withholding/payments-you-need-to-withhold-from/payments-to-employees/allowances-and-reimbursements/withholding-for-allowances",
  atoAwardTransportChanges:
    "https://www.ato.gov.au/businesses-and-organisations/hiring-and-paying-your-workers/single-touch-payroll/in-detail/single-touch-payroll-phase-2-employer-reporting-guidelines/changes-to-award-transport-payments",
} as const;

/** Dollars per km, by income year. */
export const CENTS_PER_KM_RATES: Readonly<Record<string, number>> = {
  "2026-27": 0.91,
  "2025-26": 0.88,
  "2024-25": 0.88,
  "2023-24": 0.85,
  "2022-23": 0.78,
  "2021-22": 0.72,
  "2020-21": 0.72,
};

export const CURRENT_CPK_YEAR = "2026-27";
export const CURRENT_CPK_RATE = CENTS_PER_KM_RATES[CURRENT_CPK_YEAR];
export const PREVIOUS_CPK_RATE = CENTS_PER_KM_RATES["2025-26"];

/** Work-related km cap per car per year. */
export const CPK_KM_CAP = 5_000;

/** Award transport payment withholding change. */
export const AWARD_TRANSPORT_CHANGE_DATE = "1 October 2026";

function cents(n: number): number {
  return Math.round(n * 100 + Number.EPSILON) / 100;
}

/** Deduction under the cents per km method: min(km, 5,000) × rate. */
export function centsPerKmDeduction(km: number, year: string = CURRENT_CPK_YEAR): number {
  const rate = CENTS_PER_KM_RATES[year];
  if (rate === undefined) throw new Error(`No cents per km rate for ${year}`);
  return cents(Math.min(Math.max(0, km), CPK_KM_CAP) * rate);
}

export interface CarAllowanceInput {
  /** Business km the allowance is paid for this year (year to date + this payment). */
  km: number;
  /** Rate the employer pays, dollars per km. */
  ratePerKm: number;
  /** Whether the travel is deductible work travel (not home to work). */
  deductibleTravel?: boolean;
  year?: string;
}

export interface CarAllowanceResult {
  allowance: number;
  /** Part of the allowance paid free of withholding. */
  notWithheld: number;
  /** Part the employer must withhold from (added to taxable earnings for the period). */
  subjectToWithholding: number;
  /** Excess km over 5,000 × the rate paid. */
  fromExcessKm: number;
  /** Excess rate over the ATO rate × km up to 5,000. */
  fromExcessRate: number;
  /** Where the whole allowance is reported on the income statement. */
  reporting: "allowance box" | "gross payments";
}

/**
 * Split a cents-per-km car allowance into the part free of withholding and the
 * part that is withheld from, per ATO Tables 1 and 2 (QC51680).
 */
export function carAllowanceWithholding(input: CarAllowanceInput): CarAllowanceResult {
  const year = input.year ?? CURRENT_CPK_YEAR;
  const atoRate = CENTS_PER_KM_RATES[year];
  if (atoRate === undefined) throw new Error(`No cents per km rate for ${year}`);
  const km = Math.max(0, input.km);
  const rate = Math.max(0, input.ratePerKm);
  const allowance = cents(km * rate);
  if (input.deductibleTravel === false) {
    return { allowance, notWithheld: 0, subjectToWithholding: allowance, fromExcessKm: 0, fromExcessRate: 0, reporting: "gross payments" };
  }
  const capped = Math.min(km, CPK_KM_CAP);
  const excessKm = Math.max(0, km - CPK_KM_CAP);
  const notWithheld = cents(capped * Math.min(rate, atoRate));
  const fromExcessRate = cents(capped * Math.max(0, rate - atoRate));
  const fromExcessKm = cents(excessKm * rate);
  return {
    allowance,
    notWithheld,
    subjectToWithholding: cents(fromExcessRate + fromExcessKm),
    fromExcessKm,
    fromExcessRate,
    reporting: "allowance box",
  };
}
