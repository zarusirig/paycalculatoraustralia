// =============================================================================
// Time off in lieu (TOIL) — "time off instead of payment for overtime".
//
// There is NO time-in-lieu entitlement in the National Employment Standards.
// TOIL exists only where a modern award, an enterprise agreement or (for
// award/agreement-free staff) the employment contract provides for it. The
// Fair Work Ombudsman says so in terms: "Some awards and registered agreements
// allow an employee to take paid time off instead of being paid overtime pay.
// This is also known as 'time in lieu', 'time off in lieu' or 'TOIL'."
//   https://www.fairwork.gov.au/pay-and-wages/penalty-rates-allowances-and-other-payments/overtime-pay
//   (content last updated 10 August 2026, read 23 September 2026)
//
// ⚠️ THE RATIO IS NOT THE SAME IN EVERY AWARD. Read from each award's text at
// awards.fairwork.gov.au on 23 September 2026 (consolidations to 1 July 2026;
// SCHADS to 1 September 2026, PR813674):
//
//   HOUR FOR HOUR ("the same as the number of overtime hours worked"):
//     Clerks cl 23.4, Hospitality cl 28.5(d), Manufacturing cl 32.8(e),
//     Security cl 19.4(d), SCHADS cl 28.2(c).
//   EQUIVALENT TO THE OVERTIME PAYMENT (2 hours at 150% = 3 hours off):
//     Fast Food cl 20.7(b), Pharmacy cl 21.5(b), General Retail cl 21.3(b).
//
// ⚠️ THE WINDOW IS NOT THE SAME EITHER. Six months in every award above
// except SCHADS, which is THREE months (cl 28.2(d)) and pays untaken TOIL "based
// on the rates of pay applying at the time payment is made" (cl 28.2(e)-(f),(j)).
//
// Common to all eight: time off must be taken at an agreed time within the
// window; untaken TOIL must be paid at the overtime rate applicable when the
// overtime was worked, in the next pay period after the window ends or after
// the employee asks; untaken TOIL is paid at the overtime rate on termination;
// the employer must not exert undue influence or pressure.
//
// Written agreement: the Clerks, Hospitality, Manufacturing, Security,
// SCHADS and Retail clauses say "agree in writing"; the Fast Food (cl 20.7(a))
// and Pharmacy (cl 21.5(a)) clauses say only "may agree". The hour-for-hour
// clauses also require a SEPARATE agreement for each pay period's overtime.
// =============================================================================

import { MODERN_AWARDS } from "./modern-awards";
import { HOSPITALITY_AWARD, RETAIL_AWARD } from "./hospitality-award";
import { SCHADS_AWARD } from "./schads-award";

export const TOIL_VERIFIED_ON = "23 September 2026";
export const FWO_OVERTIME_URL =
  "https://www.fairwork.gov.au/pay-and-wages/penalty-rates-allowances-and-other-payments/overtime-pay";
/** FWC template agreement linked from the Security Award's Schedule D. */
export const FWC_TOIL_TEMPLATE_URL = "https://www.fwc.gov.au/documents/awards/resources/toil-agreement.pdf";

export type ToilBasis = "hour-for-hour" | "overtime-equivalent";

export interface ToilAwardRule {
  code: string;
  name: string;
  shortName: string;
  /** On-site award rate page. */
  href: string;
  awardTextUrl: string;
  clause: string;
  basis: ToilBasis;
  /** Months within which the time off must be taken. */
  windowMonths: number;
  /** Whether the clause says "agree in writing". */
  inWriting: boolean;
  /** Whether each pay period's overtime needs its own agreement. */
  separateAgreementPerPeriod: boolean;
  /** Anything unusual about this award's clause. */
  note?: string;
}

const MA = MODERN_AWARDS;

export const TOIL_AWARD_RULES: readonly ToilAwardRule[] = [
  {
    code: RETAIL_AWARD.code,
    name: RETAIL_AWARD.name,
    shortName: "Retail Award",
    href: "/retail-award-rates/",
    awardTextUrl: RETAIL_AWARD.awardTextUrl,
    clause: "cl 21.3",
    basis: "overtime-equivalent",
    windowMonths: 6,
    inWriting: true,
    separateAgreementPerPeriod: false,
    note: "Example in the award: 2 overtime hours at 150% = 3 hours' time off.",
  },
  {
    code: HOSPITALITY_AWARD.code,
    name: HOSPITALITY_AWARD.name,
    shortName: "Hospitality Award",
    href: "/hospitality-award-rates/",
    awardTextUrl: HOSPITALITY_AWARD.awardTextUrl,
    clause: "cl 28.5",
    basis: "hour-for-hour",
    windowMonths: 6,
    inWriting: true,
    separateAgreementPerPeriod: true,
    note: "An exchange of emails counts as a written agreement (NOTE to cl 28.5).",
  },
  {
    code: MA["fast-food"].meta.code,
    name: MA["fast-food"].meta.name,
    shortName: MA["fast-food"].meta.shortName,
    href: MA["fast-food"].meta.href,
    awardTextUrl: MA["fast-food"].meta.awardTextUrl,
    clause: "cl 20.7",
    basis: "overtime-equivalent",
    windowMonths: 6,
    inWriting: false,
    separateAgreementPerPeriod: false,
    note: "Example in the award: 2 overtime hours at 150% = 3 hours' time off.",
  },
  {
    code: MA.pharmacy.meta.code,
    name: MA.pharmacy.meta.name,
    shortName: MA.pharmacy.meta.shortName,
    href: MA.pharmacy.meta.href,
    awardTextUrl: MA.pharmacy.meta.awardTextUrl,
    clause: "cl 21.5",
    basis: "overtime-equivalent",
    windowMonths: 6,
    inWriting: false,
    separateAgreementPerPeriod: false,
  },
  {
    code: MA.clerks.meta.code,
    name: MA.clerks.meta.name,
    shortName: MA.clerks.meta.shortName,
    href: MA.clerks.meta.href,
    awardTextUrl: MA.clerks.meta.awardTextUrl,
    clause: "cl 23 (shiftworkers: cl 29)",
    basis: "hour-for-hour",
    windowMonths: 6,
    inWriting: true,
    separateAgreementPerPeriod: true,
  },
  {
    code: MA.manufacturing.meta.code,
    name: MA.manufacturing.meta.name,
    shortName: MA.manufacturing.meta.shortName,
    href: MA.manufacturing.meta.href,
    awardTextUrl: MA.manufacturing.meta.awardTextUrl,
    clause: "cl 32.8",
    basis: "hour-for-hour",
    windowMonths: 6,
    inWriting: true,
    separateAgreementPerPeriod: true,
    note: "Vehicle manufacturing employees use cl 57.1 instead.",
  },
  {
    code: MA.security.meta.code,
    name: MA.security.meta.name,
    shortName: MA.security.meta.shortName,
    href: MA.security.meta.href,
    awardTextUrl: MA.security.meta.awardTextUrl,
    clause: "cl 19.4",
    basis: "hour-for-hour",
    windowMonths: 6,
    inWriting: true,
    separateAgreementPerPeriod: true,
  },
  {
    code: SCHADS_AWARD.code,
    name: SCHADS_AWARD.name,
    shortName: "SCHADS Award",
    href: "/schads-award-pay-rates/",
    awardTextUrl: SCHADS_AWARD.awardTextUrl,
    clause: "cl 28.2",
    basis: "hour-for-hour",
    windowMonths: 3,
    inWriting: true,
    separateAgreementPerPeriod: true,
    note: "Only 3 months to take it, and untaken TOIL is paid at the rates applying when it is paid out.",
  },
];

export function toilRuleByCode(code: string): ToilAwardRule | undefined {
  return TOIL_AWARD_RULES.find((r) => r.code === code);
}

/** Round half up to the cent. */
function cents(value: number): number {
  return Math.round(value * 100 + Number.EPSILON) / 100;
}

/** One block of overtime at a single multiplier (1.5 = time and a half). */
export interface OvertimeBlock {
  hours: number;
  multiplier: number;
}

export interface ToilComparison {
  overtimeHours: number;
  /** What the overtime is worth as pay, at the overtime rates. */
  overtimePay: number;
  /** Hours of paid time off the agreement gives. */
  toilHours: number;
  /** Those hours valued at the ordinary hourly rate (what the time off pays). */
  toilValueAtOrdinaryRate: number;
  /** overtimePay − toilValueAtOrdinaryRate. Zero under an overtime-equivalent clause. */
  valueGivenUp: number;
  /** Paid out if not taken within the window, on request or on termination. */
  payoutIfUntaken: number;
}

/**
 * Overtime pay vs time in lieu for the same hours.
 *
 * Hour-for-hour: TOIL hours = overtime hours worked.
 * Overtime-equivalent: TOIL hours = Σ hours × multiplier (the time equivalent
 * of the overtime payment), per Fast Food cl 20.7(b), Pharmacy cl 21.5(b),
 * Retail cl 21.3(b).
 * Either way, untaken TOIL is paid "at the overtime rate applicable to the
 * overtime when worked", so the payout equals the overtime pay.
 */
export function compareToil(ordinaryHourly: number, blocks: readonly OvertimeBlock[], basis: ToilBasis): ToilComparison {
  const rate = Math.max(0, ordinaryHourly);
  const clean = blocks.filter((b) => b.hours > 0 && b.multiplier > 0);
  const overtimeHours = clean.reduce((a, b) => a + b.hours, 0);
  const overtimePay = cents(clean.reduce((a, b) => a + b.hours * b.multiplier * rate, 0));
  const toilHours =
    basis === "hour-for-hour"
      ? overtimeHours
      : Math.round(clean.reduce((a, b) => a + b.hours * b.multiplier, 0) * 100) / 100;
  const toilValueAtOrdinaryRate = cents(toilHours * rate);
  return {
    overtimeHours,
    overtimePay,
    toilHours,
    toilValueAtOrdinaryRate,
    valueGivenUp: cents(Math.max(0, overtimePay - toilValueAtOrdinaryRate)),
    payoutIfUntaken: overtimePay,
  };
}
