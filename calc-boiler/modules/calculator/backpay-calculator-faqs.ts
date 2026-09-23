// Shared FAQ copy for /backpay-calculator/.
//
// Read by BOTH the rendered accordion (plus its sr-only crawlable mirror) in
// modules/calculator/backpay-calculator.tsx and the FAQPage JSON-LD in
// app/backpay-calculator/page.tsx. Before this file the two held different
// question sets; this is their union plus People Also Ask questions from the
// live Google AU SERP for "back pay calculator" and "back pay"
// (docs/seo/2026-09-24-paa-optimisation.md). Figures come from lib/constants.
//
// Tax treatment verified 24 Sep 2026 against the ATO's "Lump sum payment in
// arrears" page (last updated 8 June 2026: assessable in the year received,
// LSPIA tax offset if the arrears are 10% or more of threshold-test income)
// and "Reporting back payments" (lump sum E = back pay accrued more than 12
// months before payment; the $1,200 threshold no longer applies from 1 July
// 2025). Criminal offence date from fairwork.gov.au/newsroom (1 January 2025).

import { EMPLOYMENT, formatAUD, formatPercent, SUPER_GUARANTEE } from "@/lib/constants";
import type { FaqItem } from "@/lib/faq";


const SG = formatPercent(SUPER_GUARANTEE.rate, 0);

/** Worked example: correct $30/hr, paid the National Minimum Wage instead, full-time for 26 weeks. */
export const EXAMPLE = (() => {
  const correct = 30;
  const actual = EMPLOYMENT.minimumWageHourly;
  const hours = EMPLOYMENT.standardWeeklyHours;
  const weeks = 26;
  const diff = Math.round((correct - actual) * 100) / 100;
  const shortfall = Math.round(diff * hours * weeks * 100) / 100;
  return {
    correct,
    actual,
    hours,
    weeks,
    diff,
    shortfall,
    superPerHour: Math.round(diff * SUPER_GUARANTEE.rate * 100) / 100,
    superOwed: Math.round(shortfall * SUPER_GUARANTEE.rate * 100) / 100,
  };
})();

export const BACKPAY_FAQS: readonly FaqItem[] = [
  {
    q: "What is back pay in Australia?",
    a: "Back pay is money your employer owes you for work you have already done but were paid too little for. It covers wages below your award or agreement rate, missed penalty rates, overtime, allowances and leave loading, and the super that should have been paid on them. It also describes a pay rise that is backdated to an earlier start date.",
  },
  {
    q: "How do I calculate back pay in Australia?",
    a: `Subtract the rate you were paid from the rate you should have been paid, then multiply by the hours worked. At ${formatAUD(EXAMPLE.correct, 2)} an hour but paid ${formatAUD(EXAMPLE.actual, 2)}, the gap is ${formatAUD(EXAMPLE.diff, 2)} an hour: ${EXAMPLE.hours} hours a week for ${EXAMPLE.weeks} weeks is ${formatAUD(EXAMPLE.shortfall, 2)}. Your employer also owes ${SG} super on that, ${formatAUD(EXAMPLE.superOwed, 2)}.`,
  },
  {
    q: "How is back pay taxed in Australia?",
    a: "Back pay is taxed in the year you receive it, not the years it relates to, and your employer withholds tax using the ATO's Schedule 5 methods. If part of it relates to work more than 12 months earlier and that part is 10% or more of your income for the year, the ATO may give you a tax offset so you don't pay more than if it had been paid on time.",
  },
  {
    q: "How far back can I claim backpay in Australia?",
    a: `Generally up to 6 years. You have 6 years from when an underpayment happened to recover it through the courts, and that covers wages, overtime, penalty rates and allowances. Unpaid super is chased separately through the ATO's Superannuation Guarantee Charge.`,
  },
  {
    q: "Do I still get back pay if I resign?",
    a: "If you were underpaid, yes. The money is still owed after you leave and can be claimed for up to 6 years. A backdated pay rise in a new enterprise agreement is different: whether former employees get it depends on the agreement, and some only pay it to people still employed when it is approved. Check your agreement's back pay clause.",
  },
  {
    q: "Does my employer owe super on backpay?",
    a: `Yes. The ${SG} Superannuation Guarantee applies to ordinary time earnings, including any underpaid amount. Your employer must make extra super contributions on the wage difference and can be liable for the Super Guarantee Charge if they are late.`,
  },
  {
    q: "How do I report underpayment to the Fair Work Ombudsman?",
    a: "Raise it with your employer in writing first. If that doesn't fix it, lodge a request for assistance online at fairwork.gov.au or call 13 13 94. The Fair Work Ombudsman can investigate, mediate, and in serious cases take legal action. Keep payslips, rosters, timesheets and bank statements as evidence.",
  },
  {
    q: "Is wage theft a criminal offence in Australia?",
    a: "Yes. Since 1 January 2025, intentionally underpaying an employee's wages or entitlements can be a federal criminal offence under the Fair Work Act. Honest mistakes are not covered. Civil claims to recover the money are separate and still available whether or not anyone is prosecuted.",
  },
  {
    q: "Do I get interest on underpaid wages?",
    a: "Not automatically. Interest is not part of a standard Fair Work claim, but a court can order interest on underpaid wages. Late super is different: an employer who misses the deadline pays the ATO's Superannuation Guarantee Charge, which includes an interest component that is passed on to your super fund.",
  },
];
