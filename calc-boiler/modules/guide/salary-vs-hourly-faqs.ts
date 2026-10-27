// Shared FAQ copy for /salary-vs-hourly/ — rendered by the page's accordion and
// turned into FAQPage JSON-LD in app/salary-vs-hourly/page.tsx, so the
// structured data cannot drift from the page. Rates come from lib/constants.

import { EMPLOYMENT, SUPER_GUARANTEE, formatAUD } from "@/lib/constants";
import { HIGH_INCOME_THRESHOLD } from "@/lib/constants/ote-salary";
import type { FaqItem } from "@/lib/faq";

const pct = (r: number) => `${Math.round(r * 1000) / 10}%`;
const EX_SALARY = 75_000;
const EX_HOURLY = EX_SALARY / EMPLOYMENT.weeksPerYear / EMPLOYMENT.standardWeeklyHours;

export const SALARY_VS_HOURLY_FAQS: readonly FaqItem[] = [
  {
    q: "Is salary or hourly pay better in Australia?",
    a: "Neither salary nor hourly pay is better for everyone in Australia. A salary pays you the same amount each pay cycle, which makes budgeting predictable and suits employees who value consistency. Paid leave is not a salary advantage: permanent (full-time or part-time) hourly employees get the same paid leave under the National Employment Standards as salaried employees, and casuals don't get most types of paid leave. An hourly rate pays you for every hour worked, including overtime and penalty rates, which suits workers in industries with regular overtime. Our view: choose on your industry, role and financial priorities, because those decide whether steady pay or paid overtime is worth more to you.",
  },
  {
    q: "How do I convert my salary to an hourly rate?",
    a: `Divide your annual salary by ${EMPLOYMENT.weeksPerYear} weeks, then divide by your standard weekly hours (${EMPLOYMENT.standardWeeklyHours} for full-time). For example: ${formatAUD(EX_SALARY)} / ${EMPLOYMENT.weeksPerYear} / ${EMPLOYMENT.standardWeeklyHours} = ${formatAUD(EX_HOURLY, 2)} per hour. Use our Hourly to Annual Salary Calculator for an instant conversion with tax and super included.`,
    links: { "Hourly to Annual Salary Calculator": "/hourly-to-annual-salary-calculator/" },
  },
  {
    q: "Do salaried employees get overtime in Australia?",
    a: `Whether a salaried employee gets overtime depends on their award or enterprise agreement. Under the National Employment Standards, your employer can ask a full-time employee to work reasonable additional hours beyond ${EMPLOYMENT.standardWeeklyHours} a week. However, some awards require overtime payments for salaried workers who exceed standard hours. Employees earning above the Fair Work high income threshold (${formatAUD(HIGH_INCOME_THRESHOLD.current)} from ${HIGH_INCOME_THRESHOLD.from}, indexed each 1 July) who have a written guarantee of annual earnings are not covered by their award, so award overtime rules do not apply to them.`,
  },
  {
    q: "Is casual hourly pay higher than salary?",
    a: `Casual hourly pay is higher on the headline rate because casual employees receive a ${pct(EMPLOYMENT.casualLoading)} casual loading on top of the base hourly rate. The loading compensates for the absence of paid leave entitlements. Our view: the total casual package is comparable to a permanent role, because the loading stands in for ${EMPLOYMENT.annualLeaveWeeks} weeks annual leave, ${EMPLOYMENT.personalLeaveDays} days personal leave and other entitlements.`,
  },
  {
    q: "Do hourly workers get superannuation?",
    a: `Yes. Employees aged 18 or over (salaried, hourly permanent and hourly casual) receive the ${pct(SUPER_GUARANTEE.rate)} Superannuation Guarantee from their employer on qualifying earnings, whatever their hours. Employees under 18, and workers paid for private or domestic work such as a nanny, receive it only for a week in which they work more than 30 hours. There is no minimum earnings threshold. Qualifying earnings are built on ordinary time earnings (OTE), which include base rate, shift loadings and casual loading. Overtime is excluded when your ordinary hours are clearly set in an award or agreement.`,
  },
  {
    q: "Which is better for getting a mortgage?",
    a: "Lenders generally prefer salaried income because it is predictable and verifiable with a single letter of employment. Hourly and casual workers may need to provide 3-6 months of payslips, income statements, or tax returns to prove consistent income. Overtime and penalty rate income is often discounted by 20-50% in lending assessments because it is not assured.",
  },
];
