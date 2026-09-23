// Shared FAQ copy for /hourly-to-annual-salary-calculator/ — rendered by the
// calculator's accordion and turned into FAQPage JSON-LD in the page file, so
// the structured data cannot drift from the page. Every figure is computed from
// lib/constants (38-hour week, 52 weeks, tax engine, SG, HECS threshold).

import {
  calculatePayBreakdown,
  EMPLOYMENT,
  formatAUD,
  formatPercent,
  HECS_HELP,
  SITE_CONFIG,
  SUPER_GUARANTEE,
  TAX_BRACKETS,
  TAX_FREE_THRESHOLD,
} from "@/lib/constants";
import type { FaqItem } from "@/lib/faq";
import { AWE_HEADLINE, AWE_RELEASE, annualise } from "@/lib/data/average-salary";
import { NMW } from "@/lib/constants/minimum-wage";
import { SALARY_TO_HOURLY_SALARIES } from "@/lib/data/salary-pages";

const FY = SITE_CONFIG.financialYear;
const H = EMPLOYMENT.standardWeeklyHours;
const W = EMPLOYMENT.weeksPerYear;
const HOURS = EMPLOYMENT.hoursPerYear;
const HOURS_LABEL = HOURS.toLocaleString("en-AU");
const SG = formatPercent(SUPER_GUARANTEE.rate, 0);
const LOADING = formatPercent(EMPLOYMENT.casualLoading, 0);
const annualAt = (rate: number, hours: number = H) => rate * hours * W;
const netAt = (rate: number) => calculatePayBreakdown({ grossSalary: annualAt(rate) }).takeHomePay;
const PT_RATE = 35;
const PT_HOURS = 20;
const CASUAL_BASE = 30;
const CASUAL_RATE = CASUAL_BASE * (1 + EMPLOYMENT.casualLoading);
const SECOND = TAX_BRACKETS[1];

const perYear = (rate: number): FaqItem => ({
  q: `$${rate} an hour is how much a year in Australia?`,
  a: `$${rate}/hr full-time (${H}h/week, ${W} weeks) = ${formatAUD(annualAt(rate))} gross per year, ${formatAUD(netAt(rate))} after tax (FY${FY}).`,
});

// People Also Ask (Google AU, Sept 2026) for "hourly to annual salary
// calculator" and "hourly rate to salary calculator":
// docs/seo/2026-09-24-paa-optimisation.md.
/** Salary → hourly reverse table (PAA: "How do I work out my hourly rate based on salary?"). */
export const SALARY_TO_HOURLY_ROWS = [50_000, 60_000, 70_000, 80_000, 90_000, 100_000, 120_000, 150_000].map((salary) => ({
  salary,
  hourly: salary / HOURS,
  href: SALARY_TO_HOURLY_SALARIES.includes(salary) ? `/salary-to-hourly/${salary}/` : null,
}));
const AWOTE_ANNUAL = annualise(AWE_HEADLINE.fullTimeOrdinaryWeekly);
const AWOTE_HOURLY = AWE_HEADLINE.fullTimeOrdinaryWeekly / H;

/** PAA answer reused as the lead of the salary-to-hourly section. */
export const SALARY_TO_HOURLY_ANSWER: FaqItem = {
  q: "How do I work out my hourly rate based on salary?",
  a: `Divide your annual salary by ${HOURS_LABEL}, the paid hours in a full-time year (${H} hours × ${W} weeks). For example, ${formatAUD(70_000)} ÷ ${HOURS_LABEL} = ${formatAUD(70_000 / HOURS, 2)} an hour. If your contract is for different weekly hours, divide by those hours × ${W} instead.`,
};

export const HOURLY_TO_ANNUAL_FAQS: readonly FaqItem[] = [
  {
    q: "How do you calculate annual salary from an hourly rate?",
    a: `Multiply your hourly rate by the number of hours you work each week, then multiply that result by ${W} (the number of weeks in a year). For example, $40/hr × ${H} hours × ${W} weeks = ${formatAUD(annualAt(40))} gross per year.`,
  },
  perYear(25),
  perYear(40),
  perYear(50),
  {
    q: "How many working hours are in a year in Australia?",
    a: `A full-time employee is paid for ${HOURS_LABEL} hours a year: ${H} ordinary hours a week × ${W} weeks. A 40-hour week is ${(40 * W).toLocaleString("en-AU")} hours and a 37.5-hour week is ${(37.5 * W).toLocaleString("en-AU")}. A calendar year has 8,760 hours in total (8,784 in a leap year).`,
  },
  {
    q: "What is a standard working week in Australia?",
    a: `The National Employment Standards (NES) define maximum ordinary hours as ${H} hours per week for full-time employees. This equates to ${H / 5} hours per day over a 5-day working week, producing ${HOURS_LABEL} ordinary hours per year.`,
  },
  {
    q: "Does my hourly rate include superannuation?",
    a: `No. For permanent employees, the employer pays an additional ${SG} superannuation guarantee on top of your ordinary time earnings. Casual employees also receive the ${SG} SG rate on top of their hourly rate, which already includes ${LOADING} casual loading.`,
  },
  {
    q: "Should I include overtime in my annual salary calculation?",
    a: `The standard conversion (hourly × hours × ${W}) covers only ordinary time earnings. Overtime is paid at penalty rates of 1.5x or 2x and is not guaranteed weekly. Calculate overtime separately and add it to your base annual salary. Superannuation is generally calculated on ordinary time earnings only, not on overtime hours.`,
  },
  {
    q: "How do I convert a part-time hourly rate to a full-time equivalent?",
    a: `The hourly rate does not change between part-time and full-time. To find the full-time equivalent (FTE) salary, multiply your hourly rate by ${H} hours × ${W} weeks. A part-time worker earning $${PT_RATE}/hr at ${PT_HOURS} hours per week has an actual annual salary of ${formatAUD(annualAt(PT_RATE, PT_HOURS))}, but the FTE salary is ${formatAUD(annualAt(PT_RATE))}.`,
  },
  {
    q: "How does casual loading affect the annual salary calculation?",
    a: `Casual loading of ${LOADING} is added to the base hourly rate to compensate for the absence of paid leave. A base rate of $${CASUAL_BASE}/hr becomes ${formatAUD(CASUAL_RATE, 2)}/hr with casual loading. The annual gross at ${H} hours is ${formatAUD(annualAt(CASUAL_RATE))}, but this includes compensation for ${EMPLOYMENT.annualLeaveWeeks} weeks of annual leave and ${EMPLOYMENT.personalLeaveDays} days of personal leave that casuals do not receive as paid time off.`,
  },
  {
    q: "At what hourly rate do I start paying income tax?",
    a: `The tax-free threshold is ${formatAUD(TAX_FREE_THRESHOLD)} per year. At ${H} hours per week, you start paying income tax at an hourly rate above ${formatAUD(TAX_FREE_THRESHOLD / HOURS, 2)}/hr. Every dollar of assessable income above ${formatAUD(TAX_FREE_THRESHOLD)} is taxed at the applicable marginal rate, starting at ${formatPercent(SECOND.rate, 0)} for income between ${formatAUD(SECOND.min)} and ${formatAUD(SECOND.max)} in FY${FY}.`,
  },
  {
    q: "Does my HECS-HELP debt affect this conversion?",
    a: `The hourly-to-annual conversion itself is unaffected, but HECS-HELP repayments reduce your take-home pay once annual income exceeds the compulsory repayment threshold of ${formatAUD(HECS_HELP.minimumThreshold)} for FY${FY}. At $30/hr (${H} hours) your annual salary of ${formatAUD(annualAt(30))} is below the threshold, so no repayment applies. At $40/hr it reaches ${formatAUD(annualAt(40))} and the marginal rate of ${Math.round(HECS_HELP.bands[1].marginalRate * 100)}c per dollar above the threshold applies to the excess. Use our HECS-HELP Calculator to see the exact repayment amount.`,
    links: { "HECS-HELP Calculator": "/hecs-help-calculator/" },
  },
  SALARY_TO_HOURLY_ANSWER,
  {
    q: "What is $70,000 a year hourly in Australia?",
    a: `${formatAUD(70_000)} a year is ${formatAUD(70_000 / HOURS, 2)} an hour on a standard ${H}-hour week (${formatAUD(70_000)} ÷ ${HOURS_LABEL} hours). That is ${formatAUD(70_000 / W, 2)} a week before tax, and about ${formatAUD(calculatePayBreakdown({ grossSalary: 70_000 }).takeHomePay)} a year after tax in FY${FY}.`,
  },
  {
    q: "Is $45 an hour good in Australia?",
    a: `$45 an hour full-time is ${formatAUD(annualAt(45))} a year, about ${formatAUD(netAt(45))} after tax in FY${FY}. That is well above the ${formatAUD(NMW.hourly, 2)} minimum wage but below average full-time ordinary earnings, which the ABS put at ${formatAUD(AWE_HEADLINE.fullTimeOrdinaryWeekly, 2)} a week (${formatAUD(AWOTE_ANNUAL)} a year, or ${formatAUD(AWOTE_HOURLY, 2)} an hour) in ${AWE_RELEASE.referencePeriod}.`,
  },
];
