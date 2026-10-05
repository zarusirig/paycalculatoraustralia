// =============================================================================
// Net pay from an hourly rate and hours (/net-pay-calculator/).
//
// The question this answers is the one a worker actually has: "I earn $X an
// hour for Y hours a week; what lands in my account each pay, and what is my
// hour really worth after tax?" It composes the per-pay-period engine in
// gross-vs-net.ts, which composes the ATO's Schedule 1 withholding (verified
// against 288 ATO sample rows). So "net pay" here is what the payslip shows on
// payday, not the year-end tax bill. Annual tax-return figures live in
// calculatePayBreakdown (take-home pay calculator).
//
// Net pay = gross earnings − PAYG withholding (income tax + Medicare levy)
//           − study and training loan (HELP) component, if any
//           − pre-tax salary sacrifice's effect on withholding (sacrifice
//             reduces the taxed amount and is also removed from take-home)
//           − after-tax deductions (union fees and the like).
// Employer super is paid on top and is never part of gross or net pay.
//
// Casual loading: 25% under most awards (EMPLOYMENT.casualLoading). Applied to
// the base rate here only when the user says their rate excludes it.
// =============================================================================

import { EMPLOYMENT } from "./australian-tax";
import { payslipFromGross, type Payslip } from "./gross-vs-net";
import { type PayFrequency, type WithholdingOptions } from "./payg-withholding";

/** Weeks of work in one pay period. A month is 52 ÷ 12 weeks. */
export const WEEKS_PER_PERIOD: Record<PayFrequency, number> = {
  weekly: 1,
  fortnightly: 2,
  monthly: 52 / 12,
};

export interface NetPayInput {
  /** Base hourly rate before any casual loading. */
  hourlyRate: number;
  hoursPerWeek: number;
  frequency: PayFrequency;
  /** Add the 25% casual loading to the base rate. */
  casualLoading?: boolean;
  /** Pre-tax salary sacrifice per pay. */
  salarySacrifice?: number;
  /** After-tax deductions per pay. */
  postTaxDeductions?: number;
  options?: WithholdingOptions;
}

export interface NetPayResult extends Payslip {
  frequency: PayFrequency;
  /** Hourly rate actually paid (base × 1.25 for a casual). */
  paidHourlyRate: number;
  hoursInPeriod: number;
  /** net ÷ hours: what an hour of work is worth after tax. */
  netPerHour: number;
  /** Net pay for the other two pay cycles, for comparison. */
  netWeekly: number;
  netFortnightly: number;
  netMonthly: number;
  netAnnual: number;
}

function cents(n: number): number {
  return Math.round(n * 100 + Number.EPSILON) / 100;
}

export function netPay(input: NetPayInput): NetPayResult {
  const rate = Math.max(0, Number.isFinite(input.hourlyRate) ? input.hourlyRate : 0);
  const hours = Math.max(0, Number.isFinite(input.hoursPerWeek) ? input.hoursPerWeek : 0);
  const paidRate = input.casualLoading ? cents(rate * (1 + EMPLOYMENT.casualLoading)) : rate;
  const hoursInPeriod = hours * WEEKS_PER_PERIOD[input.frequency];
  const gross = cents(paidRate * hoursInPeriod);
  const slip = payslipFromGross({
    gross,
    frequency: input.frequency,
    salarySacrifice: input.salarySacrifice,
    postTaxDeductions: input.postTaxDeductions,
    options: input.options,
  });
  const weekly = payslipFromGross({ gross: cents(paidRate * hours), frequency: "weekly", options: input.options }).net;
  const fortnightly = payslipFromGross({ gross: cents(paidRate * hours * 2), frequency: "fortnightly", options: input.options }).net;
  const monthly = payslipFromGross({ gross: cents(paidRate * hours * (52 / 12)), frequency: "monthly", options: input.options }).net;
  return {
    ...slip,
    frequency: input.frequency,
    paidHourlyRate: paidRate,
    hoursInPeriod: Math.round(hoursInPeriod * 100) / 100,
    netPerHour: hoursInPeriod > 0 ? cents(slip.net / hoursInPeriod) : 0,
    netWeekly: weekly,
    netFortnightly: fortnightly,
    netMonthly: monthly,
    netAnnual: Math.round(weekly * 52),
  };
}
