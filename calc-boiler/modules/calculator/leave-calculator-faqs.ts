// Shared FAQ copy for /leave-calculator/.
//
// Deliberately NOT inside the "use client" calculator module: both the rendered
// accordion and the FAQPage JSON-LD in app/leave-calculator/page.tsx read from
// here, so the structured data cannot drift from the visible page. This mirrors
// the pattern in modules/guide/schads-award-faqs.ts.
//
// Every dollar figure below is interpolated from lib/constants — nothing is
// typed as a literal. The $80,000 worked example uses the SAME arithmetic as
// the calculator module (weekly pay × loading rate × weeks of leave).

import {
  formatAUD,
  EMPLOYMENT,
  TAX_BRACKETS,
  SUPER_GUARANTEE,
  SITE_CONFIG,
} from "@/lib/constants";
import { COMMON_LEAVE_LOADING, TERMINATION_LOADING_WITHHOLDING } from "@/lib/constants/leave-loading";
import { ANNUAL_LEAVE } from "@/lib/constants/annual-leave";
import { LSL_JURISDICTIONS, LSL_TAX } from "@/lib/constants/long-service-leave";

/** 17.5% annual leave loading — award/agreement dependent, not an NES entitlement. */
export const LEAVE_LOADING_RATE = COMMON_LEAVE_LOADING;

const LOADING_PCT = `${(LEAVE_LOADING_RATE * 100).toFixed(1)}%`;

const WEEKS = EMPLOYMENT.annualLeaveWeeks; // 4 weeks (NES minimum, full-time)
const LEAVE_HOURS = WEEKS * EMPLOYMENT.standardWeeklyHours; // 152 hours

// $80,000 worked example — identical arithmetic to the calculator module.
const WEEKLY_80K = 80_000 / EMPLOYMENT.weeksPerYear;
const BASE_PAYOUT_80K = WEEKLY_80K * WEEKS;
const LOADING_80K = WEEKLY_80K * LEAVE_LOADING_RATE * WEEKS;

// FY2026-27 bracket boundaries, for the payout-tax answer. TAX_BRACKETS[2] is
// the 30% bracket ($45,001–$135,000); TAX_BRACKETS[3] is the 37% bracket.
const BRACKET_30 = TAX_BRACKETS[2];
const BRACKET_37 = TAX_BRACKETS[3];
const PCT = (rate: number) => `${Math.round(rate * 100)}%`;

// ATO Schedule 7 (payments from 1 July 2026): unused annual leave and loading.
const FLAT_32 = PCT(TERMINATION_LOADING_WITHHOLDING.flatRate);
const CUTOVER_1993 = LSL_TAX.aug1993Cutover; // "17 August 1993"

// Long service leave figures, read from the state and territory Acts' guidance.
const LSL = LSL_JURISDICTIONS;
/** Weeks as the authorities print them: 8.6667 -> "8.67", 13 -> "13". */
const wk = (n: number) => String(Number(n.toFixed(2)));
const SHIFT_WEEKS = ANNUAL_LEAVE.shiftworkerWeeksPerYear;

export interface LeaveFaq {
  q: string;
  a: string;
}

export const LEAVE_FAQS: readonly LeaveFaq[] = [
  {
    q: "How is annual leave payout calculated?",
    a: `Annual leave payout is calculated by multiplying your weekly base pay by the number of accrued unused weeks of leave, plus ${LOADING_PCT} leave loading if your award or contract provides for it. On an $80,000 salary with ${WEEKS} weeks accrued leave, the gross payout is ${formatAUD(BASE_PAYOUT_80K)} base ($80,000 ÷ ${EMPLOYMENT.weeksPerYear} × ${WEEKS}) plus ${formatAUD(LOADING_80K)} leave loading where applicable, totalling ${formatAUD(BASE_PAYOUT_80K + LOADING_80K)} before tax.`,
  },
  {
    q: "What is annual leave loading?",
    a: `Annual leave loading is an extra ${LOADING_PCT} paid on top of your base pay while you are on annual leave, or on the leave paid out when you leave a job. It is not a universal entitlement. It applies only where an award, enterprise agreement, or employment contract provides for it. The formula is ${WEEKS} weeks × weekly base pay × ${LOADING_PCT} for a full year of leave.`,
  },
  {
    q: "Who gets leave loading?",
    a: `Leave loading applies to employees covered by an award or enterprise agreement that includes a ${LOADING_PCT} leave loading clause. Common awards with leave loading include the Clerks Award, Manufacturing Award, and Building Award. Award-free employees on individual contracts do not receive leave loading unless their contract specifies it. Check the leave loading clause in your award, agreement or employment contract to confirm your entitlement.`,
  },
  {
    q: "Is leave loading taxed?",
    a: `Yes. Leave loading is ordinary income, taxed at your marginal rate with PAYG withholding applied by your employer the same way as salary. The historical concessional tax treatment for leave loading was removed decades ago. Loading paid out on termination is taxed with the unused annual leave it comes with: at your marginal rate on a normal termination, or withheld at a flat ${FLAT_32} if the job ends because of a genuine redundancy, invalidity or an early retirement scheme, or if the loading accrued on or before ${CUTOVER_1993}.`,
  },
  {
    q: "How much annual leave do I get in Australia?",
    a: `Full-time employees get ${WEEKS} weeks (${WEEKS * 5} days or ${LEAVE_HOURS} hours) of paid annual leave per year under the National Employment Standards. Part-time employees accrue leave on a pro-rata basis proportional to their ordinary hours. Shift workers, as defined in their award or enterprise agreement, get ${SHIFT_WEEKS} weeks (${SHIFT_WEEKS * EMPLOYMENT.standardWeeklyHours} hours) under the National Employment Standards.`,
  },
  {
    q: "How is annual leave calculated pro-rata?",
    a: `Leave accrues progressively throughout the year based on ordinary hours worked. A part-time employee working 20 hours per week accrues 80 hours (2.1 weeks) of leave per year, calculated as 20/${EMPLOYMENT.standardWeeklyHours} × ${LEAVE_HOURS} hours. The accrual rate is 1.538 hours per week for that employee, compared to 2.923 hours per week for a full-time worker.`,
  },
  {
    q: "How is leave payout taxed?",
    a: `On a normal termination, such as resignation or retirement, unused annual leave and leave loading that accrued after ${CUTOVER_1993} are taxed as ordinary income at your marginal tax rate, in the financial year you receive them. A large payout can push part of your income into a higher bracket. In FY${SITE_CONFIG.financialYear}, income between ${formatAUD(BRACKET_30.min)} and ${formatAUD(BRACKET_30.max)} is taxed at ${PCT(BRACKET_30.rate)}. A $12,000 payout on top of a $128,000 salary lifts assessable income to $140,000. The portion above ${formatAUD(BRACKET_30.max)} is then taxed at ${PCT(BRACKET_37.rate)} instead of ${PCT(BRACKET_30.rate)}. Two cases are withheld at a flat ${FLAT_32} instead, under the ATO's Schedule 7: leave paid out because of a genuine redundancy, invalidity or an early retirement scheme (whenever it accrued), and leave that accrued on or before ${CUTOVER_1993}.`,
  },
  {
    q: "Do I get tax back on unused annual leave?",
    a: `Only if more tax was withheld across the year than you owe on your actual taxable income. On a normal termination your employer uses the ATO's marginal rate method in Schedule 7: the payout is divided across a full year of pay periods (52 weekly, 26 fortnightly or 12 monthly), the extra tax on one share is worked out from the normal tax table, and that amount is multiplied back up. This stops the whole payout being taxed at a higher rate in a single pay period. Your tax return then settles the difference: if the tax withheld is more than the tax on your income for the year, the ATO refunds the excess.`,
  },
  {
    q: "Is annual leave paid out when I leave my job?",
    a: `Yes. When your employment ends, your employer must pay out all accrued but untaken annual leave, plus leave loading where your award or agreement provides for it. This is a legal requirement under the National Employment Standards and applies whether you resign, are made redundant, or are dismissed.`,
  },
  {
    q: "Is superannuation payable on leave payouts?",
    a: `No. The employer SG rate of ${PCT(SUPER_GUARANTEE.rate)} is not payable on annual leave payouts made on termination. Superannuation is payable on annual leave taken during employment (as it forms part of ordinary time earnings), but termination payouts for unused leave are excluded from the superannuation guarantee calculation.`,
  },
  {
    q: "Can I cash out sick leave?",
    a: `No. Personal/carer's leave (sick leave) cannot be cashed out and has no payout value on termination. Employees accrue ${EMPLOYMENT.personalLeaveDays} days (76 hours) per year, and unused days carry over indefinitely, but the balance has zero cash value. Only annual leave and long service leave are paid out when employment ends.`,
  },
  {
    q: "When do I qualify for long service leave?",
    a: `Long service leave qualification depends on state and territory legislation. In NSW, Queensland, WA and Tasmania, ${wk(LSL.nsw.weeksAtQualifying)} weeks vests after ${LSL.nsw.takeAfterYears} years of continuous service, and SA and the NT give ${wk(LSL.sa.weeksAtQualifying)} weeks after ${LSL.sa.takeAfterYears} years. Victoria and the ACT let you take leave after ${LSL.vic.takeAfterYears} years, when ${wk(LSL.vic.weeksAtQualifying)} weeks has accrued. Under the Long Service Leave Act 2018 (Vic), leave accrues from day one at one week for every 60 weeks worked. If your job ends before the full entitlement, a pro-rata payout is paid however the job ends after ${LSL.vic.proRataUnconditionalFromYears} years in Victoria, WA and SA (WA and SA do not pay it before ${LSL.wa.takeAfterYears} years if you are dismissed for serious misconduct, and SA also does not pay it before ${LSL.sa.takeAfterYears} years if you end the contract unlawfully, such as by walking out without working your notice). In NSW from ${LSL.nsw.proRataFromYears} years, and in Queensland, Tasmania and the NT from ${LSL.qld.proRataFromYears} years, a payout before ${LSL.nsw.proRataUnconditionalFromYears} years is owed only on defined grounds, such as resigning because of illness, incapacity or a domestic or other pressing necessity, or some dismissals. The ACT works the same way from ${LSL.act.proRataFromYears} years until ${LSL.act.proRataUnconditionalFromYears} years. A plain resignation inside these windows pays nothing.`,
  },
  {
    q: "Do casual employees get annual leave?",
    a: `No. Casual employees do not get paid annual leave or paid personal/carer's leave under the NES. Instead, casuals receive a ${PCT(EMPLOYMENT.casualLoading)} casual loading on top of their base hourly rate to compensate for the absence of paid leave, notice of termination, and redundancy pay entitlements. Long service leave is different: casuals with continuous service can qualify for it under the long service leave law of every state and territory.`,
  },
];
