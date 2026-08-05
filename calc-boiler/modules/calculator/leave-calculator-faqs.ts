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

/** 17.5% annual leave loading — award/agreement dependent, not an NES entitlement. */
export const LEAVE_LOADING_RATE = 0.175;

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
    a: `Annual leave loading is an extra ${LOADING_PCT} paid on top of your base pay while you are on annual leave, or on the leave paid out when you leave a job. It is not a universal entitlement — it applies only where an award, enterprise agreement, or employment contract provides for it. The formula is ${WEEKS} weeks × weekly base pay × ${LOADING_PCT} for a full year of leave.`,
  },
  {
    q: "Who gets leave loading?",
    a: `Leave loading applies to employees covered by an award or enterprise agreement that includes a ${LOADING_PCT} leave loading clause. Common awards with leave loading include the Clerks Award, Manufacturing Award, and Building Award. Award-free employees on individual contracts — common in professional services, banking, and technology — typically do not receive leave loading unless their contract specifies it. Check your payslip or employment contract to confirm your entitlement.`,
  },
  {
    q: "Is leave loading taxed?",
    a: `Yes. Leave loading is ordinary income, taxed at your marginal rate with PAYG withholding applied by your employer the same way as salary. The historical concessional tax treatment for leave loading was removed decades ago. Loading paid out on termination is added to your taxable income for the financial year it is received.`,
  },
  {
    q: "How much annual leave do I get in Australia?",
    a: `Full-time employees get ${WEEKS} weeks (${WEEKS * 5} days or ${LEAVE_HOURS} hours) of paid annual leave per year under the National Employment Standards. Part-time employees accrue leave on a pro-rata basis proportional to their ordinary hours. Shift workers who work a rotating roster including weekends and nights receive 5 weeks (190 hours) under their award.`,
  },
  {
    q: "How is annual leave calculated pro-rata?",
    a: `Leave accrues progressively throughout the year based on ordinary hours worked. A part-time employee working 20 hours per week accrues 80 hours (2.1 weeks) of leave per year, calculated as 20/${EMPLOYMENT.standardWeeklyHours} × ${LEAVE_HOURS} hours. The accrual rate is 1.538 hours per week for that employee, compared to 2.923 hours per week for a full-time worker.`,
  },
  {
    q: "How is leave payout taxed?",
    a: `Annual leave payouts are taxed as ordinary income at your marginal tax rate. The ATO treats the payout as assessable income in the financial year it is received. A large payout can push part of your income into a higher bracket — in FY${SITE_CONFIG.financialYear}, income between ${formatAUD(BRACKET_30.min)} and ${formatAUD(BRACKET_30.max)} is taxed at ${PCT(BRACKET_30.rate)}, so a $12,000 payout on top of a $128,000 salary lifts assessable income to $140,000 and the portion above ${formatAUD(BRACKET_30.max)} is taxed at ${PCT(BRACKET_37.rate)} instead of ${PCT(BRACKET_30.rate)}.`,
  },
  {
    q: "Do I get tax back on unused annual leave?",
    a: `Possibly. Annual leave payouts are taxed as lump-sum income at your marginal rate, which can over-withhold tax if the payout temporarily pushes you into a higher bracket for that pay period. When you lodge your annual tax return, any over-withheld tax is refunded based on actual annual income.`,
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
    a: `Long service leave qualification depends on state legislation. In NSW, QLD, WA, and TAS, the full entitlement of 8.67 weeks vests after 10 years of continuous service, with pro-rata payouts on termination available after 5 years in NSW and after 7 years in QLD, WA and TAS. Victoria works differently: under the Long Service Leave Act 2018 (Vic), leave accrues continuously from day one — worked weeks ÷ 60 — and the entitlement becomes available to take, or to be paid out on termination, after just 7 years (about 6.1 weeks), reaching the same 8.67 weeks by the 10-year mark. SA and NT provide 13 weeks after 10 years, with pro-rata payouts after 7 years. The ACT provides 6.07 weeks after 7 years, with pro-rata payouts after 5 years.`,
  },
  {
    q: "Do casual employees get annual leave?",
    a: `No. Casual employees do not accrue annual leave, personal leave, or long service leave under the NES. Instead, casuals receive a ${PCT(EMPLOYMENT.casualLoading)} casual loading on top of their base hourly rate to compensate for the absence of paid leave, notice of termination, and redundancy pay entitlements.`,
  },
];
