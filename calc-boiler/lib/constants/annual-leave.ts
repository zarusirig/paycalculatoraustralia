// =============================================================================
// Annual leave — NES accrual, balance, value and payout tax (/annual-leave-calculator/).
//
// SOURCES, read 5 October 2026 (Firecrawl scrape of the pages named):
//  - Fair Work Ombudsman, "Annual leave" (fairwork.gov.au/leave/annual-leave):
//    "Full-time and part-time employees get 4 weeks of annual leave, based on
//    their ordinary hours of work." Worked example: a part-timer on 20 hours a
//    week "will accumulate 80 hours of annual leave". Accumulates from the
//    first day, including probation; builds gradually during the year; unused
//    leave rolls over. Accumulates on paid leave, community service leave and
//    long service leave; NOT on unpaid annual, unpaid sick/carer's or unpaid
//    parental leave, and not on leave that has been cashed out. Casuals get no
//    paid annual leave. Shiftworkers can get more than 4 weeks if their award
//    or agreement defines them as receiving the additional week (Fair Work Act
//    s 87(1)(b): 5 weeks).
//  - FWO, "Payment for annual leave": leave is paid at the employee's current
//    base pay rate for all hours of leave taken (no overtime, penalties,
//    allowances or bonuses); awards and agreements can add leave loading;
//    when employment ends, unused leave must be paid "the same amount that the
//    employee would have received if they'd taken the annual leave", including
//    any loading, even if the award or contract says otherwise.
//  - ATO, PAYG withholding Schedule 7 (applies to payments from 1 July 2026):
//    unused annual leave and leave loading on a normal termination, accrued
//    after 17 August 1993: marginal rates, included in salary and wages; accrued
//    before 18 August 1993: 32%; termination because of genuine redundancy,
//    invalidity or an early retirement scheme: 32%, any accrual date.
//
// Accrual arithmetic: 4 weeks a year = 4/52 = 1/13 of ordinary hours. On a
// 38-hour week that is 152 hours a year and 2.923 hours a week, which is
// what leave-calculator.tsx already uses.
// =============================================================================

import { COMMON_LEAVE_LOADING, TERMINATION_LOADING_WITHHOLDING, leaveLoading } from "./leave-loading";
import { bonusTaxSplit } from "./australian-tax";

export const ANNUAL_LEAVE_VERIFIED_ON = "5 October 2026";

export const ANNUAL_LEAVE_SOURCES = {
  overview: "https://www.fairwork.gov.au/leave/annual-leave",
  payment: "https://www.fairwork.gov.au/leave/annual-leave/payment-for-annual-leave",
  atoSchedule7:
    "https://www.ato.gov.au/tax-rates-and-codes/payg-withholding-schedule-7-tax-table-for-unused-leave-payments-on-termination-of-employment",
  atoSchedule5:
    "https://www.ato.gov.au/tax-rates-and-codes/payg-withholding-schedule-5-tax-table-for-back-payments-commissions-bonuses-and-similar-payments",
  fwAct: "https://www.legislation.gov.au/C2009A00028/latest/text",
} as const;

export const ANNUAL_LEAVE = {
  /** NES: weeks of paid annual leave for a full-time or part-time employee. */
  weeksPerYear: 4,
  /** NES: weeks for a qualifying shiftworker (Fair Work Act s 87(1)(b)). */
  shiftworkerWeeksPerYear: 5,
  /** Standard full-time week. */
  standardWeeklyHours: 38,
  weeksInYear: 52,
  /** Leave loading rate when an award or agreement provides it. */
  loadingRate: COMMON_LEAVE_LOADING,
} as const;

export type AnnualLeaveEmployment = "full-time" | "part-time" | "casual";

function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

/** Hours of annual leave earned in one full year at a weekly load: weeks of leave × ordinary weekly hours. */
export function annualLeaveHoursPerYear(ordinaryHoursPerWeek: number, weeksOfLeave: number = ANNUAL_LEAVE.weeksPerYear): number {
  return round2(Math.max(0, ordinaryHoursPerWeek) * weeksOfLeave);
}

/** Hours earned over `weeksWorked` of service: ordinary hours × weeks × (leave weeks ÷ 52). */
export function accruedLeaveHours(
  ordinaryHoursPerWeek: number,
  weeksWorked: number,
  weeksOfLeave: number = ANNUAL_LEAVE.weeksPerYear,
): number {
  return round2((Math.max(0, ordinaryHoursPerWeek) * Math.max(0, weeksWorked) * weeksOfLeave) / ANNUAL_LEAVE.weeksInYear);
}

/** Hours earned each pay period (1 = weekly, 2 = fortnightly, 4 = four-weekly). */
export function leaveHoursPerPayPeriod(
  ordinaryHoursPerWeek: number,
  weeksInPeriod: 1 | 2 | 4,
  weeksOfLeave: number = ANNUAL_LEAVE.weeksPerYear,
): number {
  return round2((Math.max(0, ordinaryHoursPerWeek) * weeksInPeriod * weeksOfLeave) / ANNUAL_LEAVE.weeksInYear);
}

export interface AnnualLeaveInput {
  employment: AnnualLeaveEmployment;
  hoursPerWeek: number;
  /** Used only to show hours as days. */
  daysPerWeek: number;
  /** Weeks of service on paid leave or at work; leave out unpaid leave. */
  weeksWorked: number;
  takenHours: number;
  baseHourlyRate: number;
  shiftworker?: boolean;
  /** Add the award's leave loading (17.5% unless overridden). */
  includeLoading?: boolean;
  loadingRate?: number;
}

export interface AnnualLeaveResult {
  employment: AnnualLeaveEmployment;
  weeksOfLeavePerYear: number;
  hoursPerYear: number;
  accruedHours: number;
  takenHours: number;
  /** Accrued minus taken, never below zero. */
  balanceHours: number;
  balanceDays: number;
  balanceWeeks: number;
  /** Balance at the base hourly rate (what the NES pays). */
  baseValue: number;
  /** Loading on top, when included. */
  loadingValue: number;
  /** baseValue + loadingValue: what taking, or being paid out, this balance is worth before tax. */
  totalValue: number;
  /** Hours earned each fortnight on this load. */
  perFortnightHours: number;
  perHourWorked: number;
}

/** The calculator. Casuals accrue nothing under the NES. Days are hours ÷ average day length. */
export function annualLeave(input: AnnualLeaveInput): AnnualLeaveResult {
  const casual = input.employment === "casual";
  const weeksOfLeave = casual ? 0 : input.shiftworker ? ANNUAL_LEAVE.shiftworkerWeeksPerYear : ANNUAL_LEAVE.weeksPerYear;
  const hours = Math.max(0, input.hoursPerWeek);
  const dayLength = input.daysPerWeek > 0 ? hours / input.daysPerWeek : 0;
  const accrued = accruedLeaveHours(hours, input.weeksWorked, weeksOfLeave);
  const taken = casual ? 0 : Math.max(0, input.takenHours);
  const balance = round2(Math.max(0, accrued - taken));
  const rate = Math.max(0, input.baseHourlyRate);
  const loading = input.includeLoading
    ? leaveLoading({ hourlyRate: rate, weeklyHours: 1, weeks: balance, loadingRate: input.loadingRate ?? ANNUAL_LEAVE.loadingRate })
    : null;
  // leaveLoading works in weeks of hours; here "weeklyHours: 1 × weeks: balance" = balance hours.
  const baseValue = round2(balance * rate);
  const loadingValue = loading ? loading.loadingPaid : 0;
  return {
    employment: input.employment,
    weeksOfLeavePerYear: weeksOfLeave,
    hoursPerYear: annualLeaveHoursPerYear(hours, weeksOfLeave),
    accruedHours: accrued,
    takenHours: taken,
    balanceHours: balance,
    balanceDays: dayLength > 0 ? round2(balance / dayLength) : 0,
    balanceWeeks: hours > 0 ? round2(balance / hours) : 0,
    baseValue,
    loadingValue,
    totalValue: round2(baseValue + loadingValue),
    perFortnightHours: leaveHoursPerPayPeriod(hours, 2, weeksOfLeave),
    perHourWorked: casual ? 0 : Math.round((weeksOfLeave / ANNUAL_LEAVE.weeksInYear) * 10_000) / 10_000,
  };
}

export type PayoutScenario = "normal-termination" | "genuine-redundancy";

export interface PayoutTax {
  scenario: PayoutScenario;
  /** The gross payout being taxed. */
  gross: number;
  /** Tax withheld on the payout, per the ATO schedule. For normal termination it is the marginal-rate outcome. */
  tax: number;
  net: number;
  /** Plain-English method, for display. */
  method: string;
}

/**
 * Tax on an unused-leave payout made on termination (post-17 August 1993
 * leave). Normal termination: marginal rates (included in salary and wages),
 * so the tax is the extra annual tax and Medicare from adding the payout to
 * the year's income. Genuine redundancy, invalidity or early retirement
 * scheme: 32% withholding (ATO Schedule 7). The Medicare levy is shown by the
 * split inside bonusTaxSplit; the 32% case is the withholding rate only.
 */
export function leavePayoutTax(annualSalary: number, gross: number, scenario: PayoutScenario): PayoutTax {
  const g = Math.max(0, gross);
  if (scenario === "genuine-redundancy") {
    const tax = round2(g * TERMINATION_LOADING_WITHHOLDING.flatRate);
    return { scenario, gross: g, tax, net: round2(g - tax), method: "32% withholding (ATO Schedule 7: genuine redundancy, invalidity or early retirement scheme)" };
  }
  const split = bonusTaxSplit(annualSalary, g);
  return {
    scenario,
    gross: g,
    tax: Math.round(split.total),
    net: Math.round(g - split.total),
    method: "Marginal rates: added to the year's income and taxed like salary, plus the Medicare levy",
  };
}
