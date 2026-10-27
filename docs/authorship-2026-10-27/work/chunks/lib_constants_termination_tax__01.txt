// =============================================================================
// Tax on a termination payment — genuine redundancy and other ETPs
// Run tests with: npm test
//
// This extends redundancy.ts (tax-free limit, ETP cap, 17% / 32% / 47% rates,
// all ATO-sourced and tested there) with the one thing that file leaves out:
// the $180,000 whole-of-income cap for a non-excluded ETP.
//
// Sources, ato.gov.au, read 5 October 2026 via Firecrawl:
//  - "Working out the whole-of-income cap amount" (last updated 24 Jul 2025):
//    "The $180,000 whole-of-income cap is reduced by any other taxable income
//    earned in the income year, either before or after receiving the ETP." For
//    a non-excluded ETP "the lesser of the 2 caps applies". Other taxable
//    income = assessable income minus deductions: salary, overtime, bank
//    interest, bonuses, "accrued leave paid when an employee is terminated" and
//    the taxable component of earlier ETPs in the year. It excludes reportable
//    fringe benefits, salary sacrifice, super guarantee and reportable employer
//    super contributions. Worked examples: Emilio (other income $100,000, ETP
//    $50,000, preservation age -> 17%); Tyrone (other income $25,000, ETP
//    $100,000, under preservation age -> 32%, cap $155,000). Tax losses are not
//    taken into account. Both caps are reduced by earlier life benefit ETPs in
//    the same income year.
//  - "Payments that are ETPs" (updated 24 Jul 2025): ETPs include a gratuity or
//    golden handshake, genuine redundancy above the tax-free limit, severance
//    pay, non-genuine redundancy, payments in lieu of notice of termination,
//    unused rostered days off, compensation for loss of job. NOT ETPs: payments
//    for unused annual leave and long service leave, genuine redundancy up to
//    the tax-free limit, salary and wages owed for work already done.
//  - "Employment termination payments" key rates (updated 17 Apr 2026): ETP cap
//    $270,000 for 2026-27, indexed each year; "The amount in excess of the ETP
//    cap amount will be taxed at the top marginal rate."
//
// An EXCLUDED ETP (the part of a genuine redundancy above the tax-free limit)
// is tested against the ETP cap only. A NON-EXCLUDED ETP (everything else) is
// tested against the lesser of the ETP cap and the whole-of-income cap.
//
// NOT MODELLED: the pre-1983 service component of the tax-free amount, ETPs
// paid on death, instalments and earlier ETPs in the same year, early
// retirement scheme payments, and the Medicare levy surcharge. Rates are the
// ATO's withholding rates (they include the 2% Medicare levy); the final
// assessment can differ.
// =============================================================================

import {
  ETP_RATES,
  GENUINE_REDUNDANCY_AGE_LIMIT,
  PRESERVATION_AGE,
  REDUNDANCY_TAX,
  genuineRedundancyTaxFreeLimit,
} from "./redundancy";

/** Cap on ETPs that are not excluded, reduced by other taxable income. Not indexed (ATO). */
export const WHOLE_OF_INCOME_CAP = 180_000;

export const TERMINATION_SOURCES = {
  woi: "https://www.ato.gov.au/businesses-and-organisations/hiring-and-paying-your-workers/engaging-a-worker/when-a-worker-leaves-your-business/taxation-of-termination-payments/working-out-the-whole-of-income-cap-amount",
  etpList: "https://www.ato.gov.au/businesses-and-organisations/hiring-and-paying-your-workers/engaging-a-worker/when-a-worker-leaves-your-business/taxation-of-termination-payments/payments-that-are-etps",
  caps: "https://www.ato.gov.au/tax-rates-and-codes/key-superannuation-rates-and-thresholds/employment-termination-payments",
  genuine: "https://www.ato.gov.au/individuals-and-families/jobs-and-employment-types/working-as-an-employee/leaving-your-job/genuine-redundancy-payments",
  taxation: "https://www.ato.gov.au/businesses-and-organisations/hiring-and-paying-your-workers/engaging-a-worker/when-a-worker-leaves-your-business/taxation-of-termination-payments",
} as const;

export type TerminationKind = "genuine-redundancy" | "other-etp";

export interface TerminationInput {
  kind: TerminationKind;
  /** The termination payment itself: not salary, notice already worked, or unused annual / long service leave. */
  payment: number;
  /** Completed years of service (genuine redundancy tax-free limit). */
  completedYears: number;
  /** Age at 30 June of the income year; preservation age is 60 for everyone born after 30 June 1964. */
  ageAtEndOfIncomeYear: number;
  /** Age when the job ended: a genuine redundancy needs this to be below age-pension age (67). */
  ageAtDismissal: number;
  /** Other taxable income in the same income year (salary, accrued leave paid out, interest). */
  otherTaxableIncome: number;
}

export interface TerminationResult {
  /** The payment was treated as a genuine redundancy. */
  genuine: boolean;
  /** Why a "genuine redundancy" was treated as an ordinary ETP, if so. */
  downgradedReason: string | null;
  taxFreeLimit: number;
  taxFree: number;
  /** Taxable component, treated as an ETP. */
  etpTaxable: number;
  /** Excluded ETPs ignore the whole-of-income cap. */
  excluded: boolean;
  etpCap: number;
  /** Whole-of-income cap after other taxable income (null for excluded ETPs). */
  wholeOfIncomeCapRemaining: number | null;
  /** The cap actually applied. */
  capApplied: number;
  capBinding: "etp-cap" | "whole-of-income-cap" | "none";
  withinCap: number;
  aboveCap: number;
  rateWithinCap: number;
  taxWithinCap: number;
  taxAboveCap: number;
  tax: number;
  net: number;
  effectiveRate: number;
  reachedPreservationAge: boolean;
}

const nn = (n: number) => (Number.isFinite(n) ? Math.max(0, n) : 0);

export function terminationTax(input: TerminationInput): TerminationResult {
  const payment = nn(input.payment);
  const reachedPreservationAge = input.ageAtEndOfIncomeYear >= PRESERVATION_AGE;
  let genuine = input.kind === "genuine-redundancy";
  let downgradedReason: string | null = null;
  if (genuine && input.ageAtDismissal >= GENUINE_REDUNDANCY_AGE_LIMIT) {
    genuine = false;
    downgradedReason = `A genuine redundancy requires dismissal before age-pension age (${GENUINE_REDUNDANCY_AGE_LIMIT}), so this payment is treated as an ordinary ETP with no tax-free part.`;
  }

  const taxFreeLimit = genuine ? genuineRedundancyTaxFreeLimit(input.completedYears) : 0;
  const taxFree = Math.min(payment, taxFreeLimit);
  const etpTaxable = payment - taxFree;
  const excluded = genuine;

  const etpCap = REDUNDANCY_TAX.etpCap;
  const wholeOfIncomeCapRemaining = excluded ? null : Math.max(0, WHOLE_OF_INCOME_CAP - nn(input.otherTaxableIncome));
  const capApplied = excluded ? etpCap : Math.min(etpCap, wholeOfIncomeCapRemaining as number);
  const withinCap = Math.min(etpTaxable, capApplied);
  const aboveCap = etpTaxable - withinCap;
  const rateWithinCap = reachedPreservationAge ? ETP_RATES.atOrOverPreservationAge : ETP_RATES.underPreservationAge;
  const taxWithinCap = withinCap * rateWithinCap;
  const taxAboveCap = aboveCap * ETP_RATES.aboveCap;
  const tax = taxWithinCap + taxAboveCap;

  const capBinding: TerminationResult["capBinding"] =
    aboveCap <= 0
      ? "none"
      : !excluded && (wholeOfIncomeCapRemaining as number) < etpCap
        ? "whole-of-income-cap"
        : "etp-cap";

  return {
    genuine,
    downgradedReason,
    taxFreeLimit,
    taxFree,
    etpTaxable,
    excluded,
    etpCap,
    wholeOfIncomeCapRemaining,
    capApplied,
    capBinding,
    withinCap,
    aboveCap,
    rateWithinCap,
    taxWithinCap,
    taxAboveCap,
    tax,
    net: payment - tax,
    effectiveRate: payment > 0 ? tax / payment : 0,
    reachedPreservationAge,
  };
}
