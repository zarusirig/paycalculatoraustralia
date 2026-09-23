// Shared FAQ copy for /salary-vs-hourly/ — rendered by the page's accordion and
// turned into FAQPage JSON-LD in app/salary-vs-hourly/page.tsx, so the
// structured data cannot drift from the page. Rates come from lib/constants.

import { EMPLOYMENT, SUPER_GUARANTEE, formatAUD } from "@/lib/constants";
import type { FaqItem } from "@/lib/faq";

const pct = (r: number) => `${Math.round(r * 1000) / 10}%`;
const EX_SALARY = 75_000;
const EX_HOURLY = EX_SALARY / EMPLOYMENT.weeksPerYear / EMPLOYMENT.standardWeeklyHours;

export const SALARY_VS_HOURLY_FAQS: readonly FaqItem[] = [
  {
    q: "Is salary or hourly pay better in Australia?",
    a: "Neither is universally better. Salary provides income stability, guaranteed paid leave, and predictable budgeting — ideal for employees who value consistency. Hourly pay ensures compensation for every hour worked including overtime and penalty rates — better for workers in industries with regular overtime opportunities. The best choice depends on your industry, role, and financial priorities.",
  },
  {
    q: "How do I convert my salary to an hourly rate?",
    a: `Divide your annual salary by ${EMPLOYMENT.weeksPerYear} weeks, then divide by your standard weekly hours (${EMPLOYMENT.standardWeeklyHours} for full-time). For example: ${formatAUD(EX_SALARY)} / ${EMPLOYMENT.weeksPerYear} / ${EMPLOYMENT.standardWeeklyHours} = ${formatAUD(EX_HOURLY, 2)} per hour. Use our Hourly to Annual Salary Calculator for an instant conversion with tax and super included.`,
    links: { "Hourly to Annual Salary Calculator": "/hourly-to-annual-salary-calculator/" },
  },
  {
    q: "Do salaried employees get overtime in Australia?",
    a: "It depends on the award or enterprise agreement. Many salaried employees have \"reasonable additional hours\" clauses, meaning overtime is not separately compensated. However, some awards require overtime payments for salaried workers who exceed standard hours. Employees earning above the Fair Work high income threshold (indexed each 1 July) who have a written guarantee of annual earnings are not covered by their award, so award overtime rules do not apply to them.",
  },
  {
    q: "Is casual hourly pay higher than salary?",
    a: `Casual employees receive a ${pct(EMPLOYMENT.casualLoading)} casual loading on top of the base hourly rate, which compensates for the absence of paid leave entitlements. This means the headline hourly rate is higher, but when you account for the value of ${EMPLOYMENT.annualLeaveWeeks} weeks annual leave, ${EMPLOYMENT.personalLeaveDays} days personal leave, and other entitlements, the total package is typically comparable to a permanent role.`,
  },
  {
    q: "Do hourly workers get superannuation?",
    a: `Yes. All employees — salaried, hourly permanent, and hourly casual — receive the ${pct(SUPER_GUARANTEE.rate)} Superannuation Guarantee from their employer on ordinary time earnings (OTE). There is no minimum earnings threshold. Super is calculated on OTE, which includes base rate, shift loadings, and casual loading, but generally excludes overtime.`,
  },
  {
    q: "Which is better for getting a mortgage?",
    a: "Lenders generally prefer salaried income because it is predictable and verifiable with a single letter of employment. Hourly and casual workers may need to provide 3-6 months of payslips, income statements, or tax returns to prove consistent income. Overtime and penalty rate income is often discounted by 20-50% in lending assessments because it is not guaranteed.",
  },
];
