// =============================================================================
// Gross vs net pay — per-pay-period converters built on the PAYG withholding
// engine (payg-withholding.ts), so "net" here means what actually lands in
// the bank on payday, not the year-end tax bill.
//
// Gross pay: earnings before tax and any other deduction. The ATO's income
// statement reports it as "Gross payments", the figure that goes at item 1
// (Salary or wages) of the tax return.
// Net pay: gross − PAYG withholding − STSL (HELP) component − any after-tax
// deductions (union fees, salary packaging repayments, etc.). Pre-tax salary
// sacrifice reduces the gross the tax is worked out on.
// Employer super (12% SG) is paid on top and appears on the payslip, but it is
// never part of gross OR net pay.
//
// Why per period, not annual: withholding uses the Schedule 1 coefficients,
// which do not deliver the whole LITO during the year (see the note at the top
// of payg-withholding.ts), so annual tax ÷ 26 is not what a payslip shows.
// Annual figures live in /gross-pay-calculator/ (calculatePayBreakdown).
// =============================================================================

import { SUPER_GUARANTEE } from "./australian-tax";
import { calculatePAYGWithholding, type PayFrequency, type WithholdingOptions } from "./payg-withholding";

export interface PayslipInput {
  gross: number;
  frequency: PayFrequency;
  /** Pre-tax salary sacrifice per period (reduces the taxed amount). */
  salarySacrifice?: number;
  /** After-tax deductions per period (union fees, etc.). */
  postTaxDeductions?: number;
  options?: WithholdingOptions;
}

export interface Payslip {
  gross: number;
  salarySacrifice: number;
  taxableGross: number;
  paygWithheld: number;
  stslWithheld: number;
  postTaxDeductions: number;
  net: number;
  /** Employer super guarantee on the gross (before sacrifice), paid on top. */
  employerSuper: number;
  /** (gross − net) ÷ gross. */
  deductionRate: number;
}

function cents(n: number): number {
  return Math.round(n * 100 + Number.EPSILON) / 100;
}

/** Gross → net for one pay period. */
export function payslipFromGross(input: PayslipInput): Payslip {
  const gross = Math.max(0, input.gross);
  const sacrifice = Math.min(gross, Math.max(0, input.salarySacrifice ?? 0));
  const taxableGross = cents(gross - sacrifice);
  const w = calculatePAYGWithholding(taxableGross, input.frequency, input.options);
  const post = Math.max(0, input.postTaxDeductions ?? 0);
  const net = cents(taxableGross - w.totalWithheld - post);
  return {
    gross,
    salarySacrifice: sacrifice,
    taxableGross,
    paygWithheld: w.paygWithheld,
    stslWithheld: w.stslWithheld,
    postTaxDeductions: post,
    net,
    employerSuper: cents(gross * SUPER_GUARANTEE.rate),
    deductionRate: gross > 0 ? (gross - net) / gross : 0,
  };
}

/**
 * Net → gross for one pay period: a whole-cent gross at which net pay (after
 * withholding, with no sacrifice or other deductions) first reaches
 * `targetNet`. Withholding is a whole-dollar step function, so a range of
 * grosses can give the same net; the binary search lands on the boundary.
 */
export function grossFromNet(targetNet: number, frequency: PayFrequency, options?: WithholdingOptions): number {
  const target = Math.max(0, targetNet);
  if (target === 0) return 0;
  const net = (g: number) => payslipFromGross({ gross: g, frequency, options }).net;
  let lo = target; // withholding is never negative, so gross ≥ net
  let hi = target * 3 + 100;
  while (net(hi) < target) hi *= 2;
  // Binary search on whole cents.
  let loC = Math.floor(lo * 100);
  let hiC = Math.ceil(hi * 100);
  while (loC < hiC) {
    const mid = Math.floor((loC + hiC) / 2);
    if (net(mid / 100) >= target) hiC = mid;
    else loC = mid + 1;
  }
  return hiC / 100;
}
