// =============================================================================
// Notice of termination and payment in lieu of notice (/payment-in-lieu-of-notice/).
//
// SOURCES, read 5 October 2026 (Firecrawl):
//  - Fair Work Ombudsman, "Dismissal" (fairwork.gov.au/ending-employment/dismissal,
//    content last updated 28 August 2026). Minimum notice under the NES (Fair
//    Work Act s 117), by continuous service on the day notice is given:
//      1 year or less ................................ 1 week
//      more than 1 year, up to 3 years ............... 2 weeks
//      more than 3 years, up to 5 years .............. 3 weeks
//      more than 5 years ............................. 4 weeks
//    "Under the NES, employees over 45 years old get an extra week of notice
//    if they have at least 2 years of continuous service." An award, enterprise
//    agreement or contract can require longer notice, never shorter.
//    Continuous service includes unpaid leave (e.g. unpaid parental leave) and
//    excludes unauthorised absence; time as a casual usually does not count.
//    Notice runs from the day AFTER notice is given to the last day of
//    employment. Employees dismissed for serious misconduct are not entitled
//    to notice; casuals are among those not entitled to written notice.
//  - FWO, same page, "Payment in lieu of notice": happens when employment ends
//    on the day notice is given and the employee is paid what they would have
//    been paid if they had worked out the notice period. It "must equal the
//    full amount", including incentive-based payments and bonuses, loadings,
//    monetary allowances, overtime, penalty rates and any other separately
//    identifiable amounts. Employment ends on the last working day and the
//    employee stops accruing leave. An employer can let the employee work the
//    notice, pay it out, or do a combination.
//  - ATO, "Employment termination payments for employees" (last updated
//    2 September 2026) and "How ETP components are taxed" (last updated
//    5 June 2026): an ETP "may include ... payments in lieu of notice". It is a
//    "non-excluded" payment: concessionally taxed up to the smaller of the ETP
//    cap and the whole-of-income cap ($180,000, not indexed, reduced by your
//    other taxable income in the year): 17% if you have reached preservation
//    age, 32% if not; above the cap, 45% plus 2% Medicare. These rates include
//    the Medicare levy (ETP_RATES in redundancy.ts).
//  - ATO, "What payments are qualifying earnings" (Payday Super): payment in
//    lieu of notice, for all termination reasons, is ordinary time earnings
//    and qualifying earnings, so super guarantee is payable on it (the ATO's
//    worked example: $10,000 PILON x 12% = $1,200). Unused leave on
//    termination is NOT: that is why the two are not treated alike.
// =============================================================================

import { SUPER_GUARANTEE } from "./australian-tax";
import { ETP_RATES, PRESERVATION_AGE, REDUNDANCY_TAX_2026_27 } from "./redundancy";

export const NOTICE_VERIFIED_ON = "5 October 2026";

export const NOTICE_SOURCES = {
  dismissal: "https://www.fairwork.gov.au/ending-employment/dismissal",
  factSheet: "https://www.fairwork.gov.au/tools-and-resources/fact-sheets/minimum-workplace-entitlements/notice-of-termination-and-redundancy-pay",
  calculator: "https://www.fairwork.gov.au/ending-employment/notice-redundancy-calculator",
  atoEtp: "https://www.ato.gov.au/individuals-and-families/jobs-and-employment-types/working-as-an-employee/leaving-your-job/employment-termination-payments-for-employees",
  atoEtpComponents: "https://www.ato.gov.au/individuals-and-families/jobs-and-employment-types/working-as-an-employee/leaving-your-job/how-etp-components-are-taxed",
  atoQualifyingEarnings: "https://www.ato.gov.au/businesses-and-organisations/super-for-employers/paying-super-on-payday/what-payments-are-qualifying-earnings",
  fwAct: "https://www.legislation.gov.au/C2009A00028/latest/text",
} as const;

/** ETP whole-of-income cap. Not indexed (ATO). */
export const WHOLE_OF_INCOME_CAP = 180_000;

export interface NoticeBand {
  /** Years of continuous service this band starts after (exclusive). */
  moreThanYears: number;
  /** ... and runs up to and including; null = no upper limit. */
  upToYears: number | null;
  weeks: number;
  label: string;
}

/** NES minimum notice, before the extra week for employees over 45. */
export const NES_NOTICE_BANDS: readonly NoticeBand[] = [
  { moreThanYears: 0, upToYears: 1, weeks: 1, label: "1 year or less" },
  { moreThanYears: 1, upToYears: 3, weeks: 2, label: "More than 1 year, up to 3 years" },
  { moreThanYears: 3, upToYears: 5, weeks: 3, label: "More than 3 years, up to 5 years" },
  { moreThanYears: 5, upToYears: null, weeks: 4, label: "More than 5 years" },
] as const;

/** Years of continuous service needed for the extra week for an employee over 45. */
export const OVER_45_MIN_YEARS = 2;

/** Minimum NES notice in weeks. `over45` = the employee is over 45 years old on the day notice is given. */
export function nesNoticeWeeks(yearsOfService: number, over45: boolean): number {
  const years = Math.max(0, Number.isFinite(yearsOfService) ? yearsOfService : 0);
  const band = NES_NOTICE_BANDS.find((b) => years > b.moreThanYears && (b.upToYears === null || years <= b.upToYears)) ?? NES_NOTICE_BANDS[0];
  const extra = over45 && years >= OVER_45_MIN_YEARS ? 1 : 0;
  return band.weeks + extra;
}

export interface PilonInput {
  yearsOfService: number;
  over45: boolean;
  /** Weeks of notice actually paid out (≤ the minimum when part is worked). Defaults to the full minimum. */
  weeksPaidOut?: number;
  /** What the employee would have been paid for a normal week: ordinary pay plus the regular extras the FWO says must be included. */
  weeklyPay: number;
  /** Other taxable income in the year, which reduces the whole-of-income cap. */
  otherTaxableIncome?: number;
  reachedPreservationAge?: boolean;
}

export interface PilonResult {
  noticeWeeks: number;
  weeksPaidOut: number;
  /** Gross payment in lieu: weeks × weekly pay. */
  gross: number;
  /** Super guarantee on the payment, paid by the employer on top. */
  superGuarantee: number;
  /** Cap that applies: the smaller of the ETP cap and the whole-of-income cap less other income. */
  concessionalCap: number;
  taxedConcessionally: number;
  taxedAtTop: number;
  concessionalRate: number;
  /** Estimated tax on the ETP, including the Medicare levy. */
  tax: number;
  net: number;
}

function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

/** Payment in lieu of notice, the super on it and an estimate of the ETP tax. */
export function paymentInLieu(input: PilonInput): PilonResult {
  const noticeWeeks = nesNoticeWeeks(input.yearsOfService, input.over45);
  const weeksPaidOut = Math.min(noticeWeeks, Math.max(0, input.weeksPaidOut ?? noticeWeeks));
  const gross = round2(weeksPaidOut * Math.max(0, input.weeklyPay));
  const other = Math.max(0, input.otherTaxableIncome ?? 0);
  const concessionalCap = Math.max(0, Math.min(REDUNDANCY_TAX_2026_27.etpCap, WHOLE_OF_INCOME_CAP - other));
  const taxedConcessionally = Math.min(gross, concessionalCap);
  const taxedAtTop = round2(gross - taxedConcessionally);
  const concessionalRate = input.reachedPreservationAge ? ETP_RATES.atOrOverPreservationAge : ETP_RATES.underPreservationAge;
  const tax = round2(taxedConcessionally * concessionalRate + taxedAtTop * ETP_RATES.aboveCap);
  return {
    noticeWeeks,
    weeksPaidOut,
    gross,
    superGuarantee: round2(gross * SUPER_GUARANTEE.rate),
    concessionalCap,
    taxedConcessionally: round2(taxedConcessionally),
    taxedAtTop,
    concessionalRate,
    tax,
    net: round2(gross - tax),
  };
}

export { PRESERVATION_AGE };
