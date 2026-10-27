// =============================================================================
// Annual leave loading — award rules, arithmetic and tax treatment.
//
// Leave loading is NOT a National Employment Standards entitlement. The NES
// pays annual leave at the employee's base rate (Fair Work Act s 90(1)); the
// 17.5% loading comes from the award or agreement. See COMMON_LEAVE_LOADING in
// minimum-wage.ts, which this file reuses.
//
// AWARD CLAUSES — read from awards.fairwork.gov.au on 23 September 2026
// (consolidations to 1 July 2026; SCHADS to 1 September 2026, PR813674):
//
//   Retail cl 28.3        greater of 17.5% of minimum hourly rate, or the
//                         minimum rate inclusive of penalty rates (cl 22);
//                         shiftworkers: inclusive of shift penalties (cl 25).
//   Clerks cl 32.3        same structure: 17.5% or weekend penalties (cl 24);
//                         shiftworkers: shift and weekend penalties (cl 31).
//   Fast Food cl 22.2     greater of 17.5% of the minimum hourly rate, or the
//                         "relevant weekend penalty amounts" (penalty less base).
//   Pharmacy cl 23.3      day work: 17.5% or relevant weekend penalty rates,
//                         "whichever is the greater but not both"; shiftwork:
//                         17.5% or the shift loading incl. weekend penalties.
//   Manufacturing cl 34.4 same as Pharmacy, calculated on cl 34.3 wages.
//   Hospitality cl 30.3   flat 17.5% "on the amount payable to the employee
//                         under the NES", including on termination. No
//                         comparison with penalties.
//   SCHADS cl 31.4        non-shiftworkers: flat 17.5% of ordinary rate of pay;
//                         shiftworkers: higher of 17.5% or weekend and shift
//                         penalties they would have received.
//   Security cl 21.3      leave is paid at the GREATER of (i) what the employee
//                         would have earned for those ordinary hours, and
//                         (ii) the minimum rate plus first aid / supervision /
//                         relieving allowances plus 17.5%. On termination the
//                         17.5% is not paid if dismissed for misconduct
//                         (cl 21.3(c)(ii)).
//
// FWO: "When employment ends, the employee's unused accumulated annual leave
// is paid out as if they had taken the leave during employment ... includes any
// annual leave loading" — library.fairwork.gov.au K600323 and
// fairwork.gov.au/leave/annual-leave/payment-for-annual-leave (read 23 Sep 2026).
//
// TAX (PAYG withholding), ato.gov.au, read 23 September 2026:
//   Schedule 1 "Allowances, leave and other payments" (QC107116, published
//   17 June 2026): paid pro rata with leave → add to that period's earnings;
//   paid as a lump sum → Schedule 5 (back payments, bonuses ...) method.
//   Schedule 7 (published 17 June 2026): unused leave loading on termination —
//   normal termination, post-17 August 1993 accrual: marginal rates ("include
//   in salary/wages"); pre-18 August 1993: 32%; genuine redundancy, invalidity
//   or early retirement scheme: 32%, any accrual date (Lump Sum A).
//
// SUPER: annual leave loading is ordinary time earnings (so qualifying
// earnings) unless it is "linked to a lost opportunity to work overtime" —
// see QUALIFYING_EARNINGS in australian-tax.ts (ATO QC105843).
// =============================================================================

import { COMMON_LEAVE_LOADING } from "./minimum-wage";
import { MODERN_AWARDS } from "./modern-awards";
import { HOSPITALITY_AWARD, RETAIL_AWARD } from "./hospitality-award";
import { SCHADS_AWARD } from "./schads-award";

export { COMMON_LEAVE_LOADING };
export const LEAVE_LOADING_VERIFIED_ON = "23 September 2026";

export const LEAVE_LOADING_SOURCES = {
  fwoLibrary: "https://library.fairwork.gov.au/viewer/?krn=K600323",
  fwoPayment: "https://www.fairwork.gov.au/leave/annual-leave/payment-for-annual-leave",
  atoSchedule1Leave:
    "https://www.ato.gov.au/tax-rates-and-codes/payg-withholding-schedule-1-statement-of-formulas-for-calculating-amounts-to-be-withheld/allowances-leave-and-other-payments",
  atoSchedule7:
    "https://www.ato.gov.au/tax-rates-and-codes/payg-withholding-schedule-7-tax-table-for-unused-leave-payments-on-termination-of-employment",
  atoQualifyingEarnings:
    "https://www.ato.gov.au/businesses-and-organisations/super-for-employers/paying-super-on-payday/what-payments-are-qualifying-earnings",
} as const;

/**
 * How the award decides the loading:
 *  - "flat": 17.5%, no comparison.
 *  - "greater-of-penalties": the higher of 17.5% or the weekend/shift penalty
 *    amounts the employee would have earned in the leave period.
 *  - "greater-of-earnings": leave is paid at the higher of normal earnings or
 *    base + allowances + 17.5% (Security).
 */
export type LoadingMethod = "flat" | "greater-of-penalties" | "greater-of-earnings";

export interface LeaveLoadingRule {
  code: string;
  shortName: string;
  href: string;
  awardTextUrl: string;
  clause: string;
  /** Rule for employees on day work (non-shiftworkers). */
  dayWork: LoadingMethod;
  /** Rule for shiftworkers. */
  shiftwork: LoadingMethod;
  /** One-sentence plain-English summary, faithful to the clause. */
  summary: string;
}

const MA = MODERN_AWARDS;

export const LEAVE_LOADING_RULES: readonly LeaveLoadingRule[] = [
  {
    code: RETAIL_AWARD.code,
    shortName: "Retail Award",
    href: "/retail-award-rates/",
    awardTextUrl: RETAIL_AWARD.awardTextUrl,
    clause: "cl 28.3",
    dayWork: "greater-of-penalties",
    shiftwork: "greater-of-penalties",
    summary: "The greater of 17.5% of the minimum hourly rate or the penalty rates you would have earned (shift penalties for shiftworkers).",
  },
  {
    code: HOSPITALITY_AWARD.code,
    shortName: "Hospitality Award",
    href: "/hospitality-award-rates/",
    awardTextUrl: HOSPITALITY_AWARD.awardTextUrl,
    clause: "cl 30.3",
    dayWork: "flat",
    shiftwork: "flat",
    summary: "A flat 17.5% on the amount payable under the NES for the leave, including untaken leave paid out when employment ends. No comparison with penalty rates.",
  },
  {
    code: MA["fast-food"].meta.code,
    shortName: MA["fast-food"].meta.shortName,
    href: MA["fast-food"].meta.href,
    awardTextUrl: MA["fast-food"].meta.awardTextUrl,
    clause: "cl 22.2",
    dayWork: "greater-of-penalties",
    shiftwork: "greater-of-penalties",
    summary: "The greater of 17.5% of the minimum hourly rate or the weekend penalty amounts (penalty less base rate) for the weekend hours you would have worked.",
  },
  {
    code: MA.pharmacy.meta.code,
    shortName: MA.pharmacy.meta.shortName,
    href: MA.pharmacy.meta.href,
    awardTextUrl: MA.pharmacy.meta.awardTextUrl,
    clause: "cl 23.3",
    dayWork: "greater-of-penalties",
    shiftwork: "greater-of-penalties",
    summary: "17.5% or the relevant weekend penalty rates, whichever is greater but not both; shiftworkers compare with the shift loading including weekend penalties.",
  },
  {
    code: MA.clerks.meta.code,
    shortName: MA.clerks.meta.shortName,
    href: MA.clerks.meta.href,
    awardTextUrl: MA.clerks.meta.awardTextUrl,
    clause: "cl 32.3",
    dayWork: "greater-of-penalties",
    shiftwork: "greater-of-penalties",
    summary: "The greater of 17.5% of the minimum hourly rate or the minimum rate inclusive of weekend penalty rates (shift and weekend penalties for shiftworkers).",
  },
  {
    code: MA.manufacturing.meta.code,
    shortName: MA.manufacturing.meta.shortName,
    href: MA.manufacturing.meta.href,
    awardTextUrl: MA.manufacturing.meta.awardTextUrl,
    clause: "cl 34.4",
    dayWork: "greater-of-penalties",
    shiftwork: "greater-of-penalties",
    summary: "17.5% of the cl 34.3 wages or the relevant weekend penalty rates, whichever is greater but not both; shiftworkers compare with the shift loading.",
  },
  {
    code: SCHADS_AWARD.code,
    shortName: "SCHADS Award",
    href: "/schads-award-pay-rates/",
    awardTextUrl: SCHADS_AWARD.awardTextUrl,
    clause: "cl 31.4",
    dayWork: "flat",
    shiftwork: "greater-of-penalties",
    summary: "Non-shiftworkers get a flat 17.5% of their ordinary rate; shiftworkers get the higher of 17.5% or the weekend and shift penalties they would have received.",
  },
  {
    code: MA.security.meta.code,
    shortName: MA.security.meta.shortName,
    href: MA.security.meta.href,
    awardTextUrl: MA.security.meta.awardTextUrl,
    clause: "cl 21.3",
    dayWork: "greater-of-earnings",
    shiftwork: "greater-of-earnings",
    summary: "Leave is paid at the greater of what you would have earned, or the minimum rate plus first aid, supervision or relieving allowances plus 17.5%. On termination the 17.5% is lost if dismissed for misconduct.",
  },
];

/** Round half up to the cent. */
function cents(value: number): number {
  return Math.round(value * 100 + Number.EPSILON) / 100;
}

export interface LeaveLoadingInput {
  /** Base (ordinary) hourly rate. */
  hourlyRate: number;
  /** Ordinary hours in a normal week. */
  weeklyHours: number;
  /** Weeks of annual leave being taken or paid out. */
  weeks: number;
  /**
   * Weekend or shift penalty dollars ABOVE the base rate you would normally
   * earn in a week of ordinary hours (e.g. 8 Saturday hours at 125% on $30 =
   * 8 × 30 × 0.25 = $60). Only used by "greater-of-penalties".
   */
  weeklyPenaltyPremium?: number;
  method?: LoadingMethod;
  /** Loading rate; 17.5% unless the agreement says otherwise. */
  loadingRate?: number;
}

export interface LeaveLoadingResult {
  /** Leave pay at the base rate (the NES amount). */
  basePay: number;
  /** 17.5% of the base pay. */
  flatLoading: number;
  /** Penalty premium the employee would have earned over the leave. */
  penaltyAlternative: number;
  /** The loading actually payable under the method. */
  loadingPaid: number;
  /** Which figure won. */
  paidAs: "17.5% loading" | "penalty rates";
  /** basePay + loadingPaid. */
  totalLeavePay: number;
}

/**
 * Leave pay plus loading for a period of leave. For "greater-of-earnings"
 * (Security) the comparison is total pay vs total pay, which comes to the same
 * thing as comparing the loading with the penalty premium when no allowances
 * are involved, so it is treated the same way here.
 */
export function leaveLoading(input: LeaveLoadingInput): LeaveLoadingResult {
  const rate = Math.max(0, input.hourlyRate);
  const hours = Math.max(0, input.weeklyHours);
  const weeks = Math.max(0, input.weeks);
  const loadingRate = input.loadingRate ?? COMMON_LEAVE_LOADING;
  const method = input.method ?? "flat";
  const basePay = cents(rate * hours * weeks);
  const flatLoading = cents(basePay * loadingRate);
  const penaltyAlternative = method === "flat" ? 0 : cents(Math.max(0, input.weeklyPenaltyPremium ?? 0) * weeks);
  const usePenalties = method !== "flat" && penaltyAlternative > flatLoading;
  const loadingPaid = usePenalties ? penaltyAlternative : flatLoading;
  return {
    basePay,
    flatLoading,
    penaltyAlternative,
    loadingPaid,
    paidAs: usePenalties ? "penalty rates" : "17.5% loading",
    totalLeavePay: cents(basePay + loadingPaid),
  };
}

/**
 * Schedule 7 withholding category for unused leave loading paid on
 * termination (ATO Schedule 7, published 17 June 2026).
 */
export const TERMINATION_LOADING_WITHHOLDING = {
  normalPost1993: "Marginal rates (added to the final pay's salary and wages)",
  normalPre1993: "32%",
  redundancyInvalidityEarlyRetirement: "32% of the total, whatever the accrual date",
  flatRate: 0.32,
  /** Step B of the ATO's unused annual leave method. */
  smallPaymentThreshold: 300,
} as const;
