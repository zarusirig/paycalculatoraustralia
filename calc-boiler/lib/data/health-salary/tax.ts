// After-tax arithmetic for the health salary pages. Every figure comes from
// the site's own tax engine (lib/constants/australian-tax.ts, 2026–27
// resident rates), the same one behind /take-home-pay-on/N/. Nothing here
// carries a dollar figure of its own except through the shared constants.

import { SUPER_GUARANTEE, calculateHECS, calculatePayBreakdown } from "../../constants/australian-tax";
import { FBT_CAPS, capFaceValue, salaryPackagingBenefit } from "../../constants/novated-lease";
import { DIVISION_293 } from "../../constants/super-contributions";
import { nearestSalary } from "../salary-pages";

export interface TakeHome {
  gross: number;
  /** Income tax after the low income tax offset. */
  tax: number;
  medicare: number;
  net: number;
  weekly: number;
  fortnightly: number;
  /** Compulsory HELP repayment on the same income, if the person has a HELP debt. */
  help: number;
}

/**
 * Take-home on a gross figure, treated as taxable income with no deductions:
 * 2026–27 resident rates, LITO, 2% Medicare levy, private hospital cover (no
 * Medicare levy surcharge), no HELP debt. `help` is the compulsory repayment
 * the same engine charges when a HELP debt is switched on, shown separately.
 */
export function takeHome(gross: number): TakeHome {
  const b = calculatePayBreakdown({ grossSalary: gross, includeHECS: false, hasPrivateHealth: true });
  return {
    gross,
    tax: b.netIncomeTax,
    medicare: b.medicareLevy,
    net: b.takeHomePay,
    weekly: b.weekly,
    fortnightly: b.fortnightly,
    help: calculateHECS(gross),
  };
}

/** Closest /take-home-pay-on/N/ page (the grid runs to $500,000). */
export function takeHomePageFor(gross: number): { amount: number; href: string } {
  const amount = nearestSalary("take-home", gross);
  return { amount, href: `/take-home-pay-on/${amount}/` };
}

/** Division 293: an extra 15% on concessional super once income plus contributions pass this. */
export const DIVISION_293_THRESHOLD = DIVISION_293.threshold;

/** Super guarantee rate from 1 July 2025, as the engine holds it. */
export const SG_RATE = SUPER_GUARANTEE.rate;

/**
 * Public and not-for-profit hospital employees' FBT cap ($17,000 grossed-up,
 * about $9,010 of everyday expenses), from lib/constants/novated-lease.ts.
 */
export const HOSPITAL_PACKAGING = {
  grossedUpCap: FBT_CAPS.hospitalAndAmbulance,
  faceValue: capFaceValue(FBT_CAPS.hospitalAndAmbulance),
} as const;

/** Extra spendable income a year from packaging the full hospital cap on `salary`. */
export function hospitalPackagingBenefit(salary: number): number {
  return salaryPackagingBenefit(salary, HOSPITAL_PACKAGING.faceValue);
}
