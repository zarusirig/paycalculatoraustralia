// =============================================================================
// Paid sick and carer's leave (personal/carer's leave) — NES rules and the
// accrual arithmetic behind /sick-leave-calculator/ (G3, wave 4).
//
// Keyword demand (DataForSEO Labs, AU, 24 Sep 2026): sick leave 8,100 (KD 5),
// carer leave 5,400, personal leave 2,900, personal/carer's leave 1,000, sick
// leave calculator 720, "sick leave calculator 38-hour week" 590.
//
// SOURCES — every rule below was read at fairwork.gov.au on 24 September 2026
// (Firecrawl scrape; FWO page "content last updated 2026-08-10"):
//   - Paid sick and carer's leave (Fair Work Act ss 95–97):
//     "10 days for full-time employees, and pro-rata for part-time employees.
//     This can be calculated as 1/26 of an employee's ordinary hours of work in
//     a year." Worked example: 38 h/week full-time → 76 hours a year; 19 h →
//     38 hours. Accrues from the first day, carries over year to year, accrues
//     on paid leave, community service leave and long service leave, NOT on
//     unpaid leave (annual, sick/carer's, parental, FDV).
//   - Payment for sick and carer's leave (ss 16, 99, 107): paid at the base pay
//     rate for the ordinary hours the employee would have worked; excludes
//     incentive payments, bonuses, loadings, allowances, overtime, penalties.
//   - Notice and medical certificates (s 107): evidence can be required for as
//     little as 1 day; a statutory declaration can be acceptable.
//   - Unpaid carer's leave (ss 102–103): 2 days per occasion for all employees
//     including casuals; permanent staff only once paid leave is exhausted.
//   - Cashing out (ss 100–101): only under the Timber or Stevedoring award or an
//     agreement that allows it; written agreement each time; a balance of at
//     least 15 days must remain.
//   - Final pay (fairwork.gov.au/ending-employment/final-pay): "Sick and carer's
//     leave isn't paid out when employment ends."
//   - Casuals: "All employees except casuals are entitled to paid sick and
//     carer's leave."
// =============================================================================

export const SICK_LEAVE_VERIFIED_ON = "24 September 2026";

export const SICK_LEAVE_SOURCES = {
  paid: "https://www.fairwork.gov.au/leave/sick-and-carers-leave/paid-sick-and-carers-leave",
  payment: "https://www.fairwork.gov.au/leave/sick-and-carers-leave/paid-sick-and-carers-leave/payment-for-sick-and-carers-leave",
  evidence: "https://www.fairwork.gov.au/leave/sick-and-carers-leave/paid-sick-and-carers-leave/notice-and-medical-certificates",
  unpaidCarers: "https://www.fairwork.gov.au/leave/sick-and-carers-leave/unpaid-carers-leave",
  cashingOut: "https://www.fairwork.gov.au/leave/sick-and-carers-leave/paid-sick-and-carers-leave/cashing-out-sick-and-carers-leave",
  finalPay: "https://www.fairwork.gov.au/ending-employment/final-pay",
  factSheet: "https://www.fairwork.gov.au/tools-and-resources/fact-sheets/minimum-workplace-entitlements/sick-and-carers-leave-and-compassionate-leave",
  fwAct: "https://www.legislation.gov.au/C2009A00028/latest/text",
} as const;

export const SICK_LEAVE = {
  /** NES: 10 days a year for a full-time employee. */
  fullTimeDaysPerYear: 10,
  /** Accrual as a share of ordinary hours: 1/26 (= 2 weeks of 52). */
  accrualFraction: 1 / 26,
  /** Standard full-time week used in the FWO worked example. */
  standardFullTimeHours: 38,
  /** Unpaid carer's leave per occasion, all employees including casuals. */
  unpaidCarersDaysPerOccasion: 2,
  /** Minimum balance that must remain after any permitted cash-out. */
  cashOutMinimumRemainingDays: 15,
  /** The only two modern awards that allow cashing out (FWO). */
  cashOutAwards: ["Timber Award (MA000071)", "Stevedoring Award (MA000053)"],
} as const;

export type SickLeaveEmployment = "full-time" | "part-time" | "casual";

/** Hours of paid sick and carer's leave a year for a given ordinary weekly load. 1/26 of a year's ordinary hours. */
export function annualSickLeaveHours(ordinaryHoursPerWeek: number): number {
  return round2(Math.max(0, ordinaryHoursPerWeek) * 52 * SICK_LEAVE.accrualFraction);
}

/**
 * Hours accrued over a number of weeks of service at a given weekly load.
 * Weeks on unpaid leave (other than community service leave) should be
 * excluded by the caller: leave does not accrue on them.
 */
export function accruedSickLeaveHours(ordinaryHoursPerWeek: number, weeksWorked: number): number {
  return round2(Math.max(0, ordinaryHoursPerWeek) * Math.max(0, weeksWorked) * SICK_LEAVE.accrualFraction);
}

export interface SickLeaveResult {
  employment: SickLeaveEmployment;
  /** Paid sick and carer's leave earned per year of service, hours. */
  annualHours: number;
  /** The same in days of average length (hours/week ÷ days/week). */
  annualDays: number;
  accruedHours: number;
  takenHours: number;
  /** Accrued minus taken, never below zero. */
  balanceHours: number;
  balanceDays: number;
  /** Balance valued at the base hourly rate (what taking it would pay). */
  balanceValue: number;
  /** Paid leave accrues per ordinary hour: hours per hour worked. */
  perHourWorked: number;
}

export interface SickLeaveInput {
  employment: SickLeaveEmployment;
  hoursPerWeek: number;
  daysPerWeek: number;
  weeksWorked: number;
  takenHours: number;
  baseHourlyRate: number;
}

/** The calculator. Casuals accrue nothing (NES). Days are hours ÷ average day length. */
export function sickLeave(input: SickLeaveInput): SickLeaveResult {
  const casual = input.employment === "casual";
  const hours = casual ? 0 : Math.max(0, input.hoursPerWeek);
  const dayLength = input.daysPerWeek > 0 ? input.hoursPerWeek / input.daysPerWeek : 0;
  const annualHours = annualSickLeaveHours(hours);
  const accruedHours = accruedSickLeaveHours(hours, input.weeksWorked);
  const takenHours = casual ? 0 : Math.max(0, input.takenHours);
  const balanceHours = round2(Math.max(0, accruedHours - takenHours));
  const toDays = (h: number) => (dayLength > 0 ? round2(h / dayLength) : 0);
  return {
    employment: input.employment,
    annualHours,
    annualDays: toDays(annualHours),
    accruedHours,
    takenHours,
    balanceHours,
    balanceDays: toDays(balanceHours),
    balanceValue: round2(balanceHours * Math.max(0, input.baseHourlyRate)),
    perHourWorked: casual ? 0 : round4(SICK_LEAVE.accrualFraction),
  };
}

/** Accrual per pay period, hours, for common pay cycles. */
export function sickLeavePerPayPeriod(ordinaryHoursPerWeek: number, weeksInPeriod: 1 | 2 | 4): number {
  return round2(ordinaryHoursPerWeek * weeksInPeriod * SICK_LEAVE.accrualFraction);
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function round4(n: number): number {
  return Math.round(n * 10_000) / 10_000;
}
