// Shared FAQ copy for /employment-type-calculator/ — rendered by the page's
// accordion and turned into FAQPage JSON-LD in app/employment-type-calculator/
// page.tsx, so the structured data cannot drift from the page. Rates come from
// lib/constants.

import { EMPLOYMENT, formatPercent, SUPER_GUARANTEE } from "@/lib/constants";
import type { FaqItem } from "@/lib/faq";

const LOADING = formatPercent(EMPLOYMENT.casualLoading, 0);
const SG = formatPercent(SUPER_GUARANTEE.rate, 0);
// Paid days off a full-time employee gets a year: annual leave, personal leave
// and roughly 8 national public holidays, as a share of 260 working days.
const PAID_DAYS_OFF = EMPLOYMENT.annualLeaveWeeks * 5 + EMPLOYMENT.personalLeaveDays + 8;
const LEAVE_VALUE = formatPercent(PAID_DAYS_OFF / (EMPLOYMENT.weeksPerYear * 5 - PAID_DAYS_OFF), 0);

export const EMPLOYMENT_TYPE_FAQS: readonly FaqItem[] = [
  {
    q: "Is casual loading better than annual leave?",
    a: `In pure pay terms, usually yes. Annual leave (${EMPLOYMENT.annualLeaveWeeks} weeks), personal leave (${EMPLOYMENT.personalLeaveDays} days) and public holidays together are worth roughly ${LEAVE_VALUE} of pay for the days actually worked, less than the ${LOADING} casual loading. Permanent employment makes up the difference in other ways: paid time off when you are sick, job security, notice periods, and potential redundancy pay.`,
  },
  {
    q: "Do casual workers get superannuation?",
    a: `Yes. Casuals receive the ${SG} superannuation guarantee like other employees (if they are under 18, only in weeks they work more than 30 hours). Super is calculated on the casual employee's ordinary time earnings, which includes the ${LOADING} casual loading.`,
  },
  {
    q: "What is the difference between part-time and casual?",
    a: `Part-time employees work regular guaranteed hours (under ${EMPLOYMENT.standardWeeklyHours} per week), receive paid annual and personal leave on a pro-rata basis, and have ongoing employment. Casual employees have no guaranteed hours, receive ${LOADING} casual loading instead of leave, and either party can end the arrangement without notice.`,
  },
  {
    q: "Can I convert from casual to permanent?",
    a: "Yes. Since 26 August 2024, a casual employee who has worked for at least 6 months (12 months if the employer is a small business with fewer than 15 employees) can notify their employer in writing that they want to become permanent, if they believe they no longer meet the definition of a casual employee. The employer must respond in writing within 21 days and can refuse only on limited grounds.",
  },
  {
    q: "Which employment type pays more overall?",
    a: `Casual workers receive more cash in hand due to the ${LOADING} loading, but permanent employees receive a higher total package value when leave, job security, notice periods, and redundancy pay are included. The best option depends on whether you value flexibility (casual) or stability and entitlements (permanent).`,
  },
  {
    q: "Do casual employees pay more tax?",
    a: "Tax is based on total annual income, not employment type. A casual earning $70,000/year pays the same income tax as a full-time employee earning $70,000/year. However, casual employees earn more gross income (due to loading) for the same hours, which may place them in a higher tax bracket.",
  },
];
