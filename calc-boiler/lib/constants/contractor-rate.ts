// =============================================================================
// Contractor rate → equivalent employee salary.
//
// Used by /contractor-pay-calculator/ ("What Contractor Hourly Rate Equals a
// Salary?" table and the "How do I convert a contractor rate to a salary?"
// FAQ). Every figure on that table is produced here so it can be reproduced
// from the assumptions printed under it.
//
// Method (all assumptions are parameters with the defaults below):
//   1. Billable days = 52 weeks × 5 days, less the days an employee is paid
//      for but a contractor cannot bill: NES annual leave (4 weeks) and
//      personal leave (10 days), weekday public holidays, and unbilled
//      downtime between contracts.
//   2. Billed income = rate × billable days (× hours per day for an hourly
//      rate), excluding GST.
//   3. Less the costs an employer would otherwise carry: insurance and
//      admin/accounting (flat annual amounts, stated as assumptions).
//   4. What is left is the full employment package. It is split into salary
//      plus Super Guarantee on that salary, with SG capped at the maximum
//      contribution base (same rule as calculatePayBreakdown's "includes
//      super" path), so salary = package ÷ (1 + SG rate) below the cap and
//      package − maximum SG above it.
// The leave the employee is paid for is therefore already priced in: the
// contractor earns nothing on those days. `leaveValue` reports how much of
// the equivalent salary is pay for days not worked.
// Leave loading, workers' compensation and income protection are not modelled.
// =============================================================================

import { EMPLOYMENT, SUPER_GUARANTEE } from "./australian-tax";

export type ContractRateUnit = "hour" | "day";

export interface ContractorSalaryAssumptions {
  /** Hours billed per day for an hourly rate. Default 7.6 (38 ÷ 5). */
  hoursPerDay: number;
  /** Unpaid annual leave, in working days. Default 20 (NES 4 weeks). */
  annualLeaveDays: number;
  /** Unpaid sick/carer's days. Default 10 (NES personal leave). */
  personalLeaveDays: number;
  /** Weekday public holidays not billed. Default 10. */
  publicHolidayDays: number;
  /** Unbilled days between contracts. Default 10 (an assumption). */
  downtimeDays: number;
  /** Insurance an employer would carry (public liability, PI), $/year. */
  insurancePerYear: number;
  /** Accounting, software and admin costs, $/year. */
  adminPerYear: number;
}

/** Weekdays in a 52-week year. */
export const WORKING_DAYS_PER_YEAR = EMPLOYMENT.weeksPerYear * 5;

export const DEFAULT_CONTRACTOR_ASSUMPTIONS: Readonly<ContractorSalaryAssumptions> = {
  hoursPerDay: EMPLOYMENT.standardWeeklyHours / 5,
  annualLeaveDays: EMPLOYMENT.annualLeaveWeeks * 5,
  personalLeaveDays: EMPLOYMENT.personalLeaveDays,
  publicHolidayDays: 10,
  downtimeDays: 10,
  insurancePerYear: 1_500,
  adminPerYear: 1_500,
};

/**
 * Weekday statewide public holidays (including substitute days) in calendar
 * 2026 across the states and territories, from lib/data/public-holidays.
 * A test recomputes this from the data, so the page copy cannot drift.
 */
export const WEEKDAY_PUBLIC_HOLIDAYS_2026 = { min: 8, max: 11 } as const;

export interface ContractorSalaryEquivalent {
  rate: number;
  unit: ContractRateUnit;
  billableDays: number;
  billableHours: number;
  /** Rate × billable time, ex GST. */
  billedIncome: number;
  insurance: number;
  admin: number;
  /** Billed income less insurance and admin: salary + super. */
  packageValue: number;
  /** Super the contractor funds for themselves (SG on the salary, capped). */
  superSelfFunded: number;
  /** Equivalent employee salary (base, excluding super). */
  equivalentSalary: number;
  /** Part of the salary paid for leave and public holidays (days not worked). */
  leaveValue: number;
  /** Equivalent salary ÷ 1,976 hours. */
  employeeHourly: number;
}

const round = (n: number) => Math.round(n);
const nonNeg = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);

/**
 * Convert a contract rate (ex GST) to the employee salary that leaves you
 * equally well off, before income tax. See the header for the method.
 */
export function contractorRateToEquivalentSalary(
  rate: number,
  unit: ContractRateUnit = "hour",
  overrides: Partial<ContractorSalaryAssumptions> = {},
): ContractorSalaryEquivalent {
  const a = { ...DEFAULT_CONTRACTOR_ASSUMPTIONS, ...overrides };
  const r = nonNeg(rate);
  const hoursPerDay = nonNeg(a.hoursPerDay);
  const unbilled =
    nonNeg(a.annualLeaveDays) + nonNeg(a.personalLeaveDays) + nonNeg(a.publicHolidayDays) + nonNeg(a.downtimeDays);
  const billableDays = Math.max(0, WORKING_DAYS_PER_YEAR - unbilled);
  const billableHours = billableDays * hoursPerDay;
  const billedIncome = round(unit === "day" ? r * billableDays : r * billableHours);
  const insurance = nonNeg(a.insurancePerYear);
  const admin = nonNeg(a.adminPerYear);
  const packageValue = Math.max(0, billedIncome - insurance - admin);

  const uncapped = packageValue / (1 + SUPER_GUARANTEE.rate);
  const equivalentSalary =
    uncapped > SUPER_GUARANTEE.maxContributionBaseAnnual
      ? round(packageValue - SUPER_GUARANTEE.maxSGAnnual)
      : round(uncapped);
  const superSelfFunded = packageValue - equivalentSalary;

  const paidDaysOff = nonNeg(a.annualLeaveDays) + nonNeg(a.personalLeaveDays) + nonNeg(a.publicHolidayDays);
  const leaveValue = round((equivalentSalary * Math.min(paidDaysOff, WORKING_DAYS_PER_YEAR)) / WORKING_DAYS_PER_YEAR);

  return {
    rate: r,
    unit,
    billableDays,
    billableHours: Math.round(billableHours * 100) / 100,
    billedIncome,
    insurance,
    admin,
    packageValue,
    superSelfFunded,
    equivalentSalary,
    leaveValue,
    employeeHourly: Math.round((equivalentSalary / EMPLOYMENT.hoursPerYear) * 100) / 100,
  };
}
