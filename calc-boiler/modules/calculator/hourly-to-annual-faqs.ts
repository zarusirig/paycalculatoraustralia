// Shared FAQ copy for /hourly-to-annual-salary-calculator/.
//
// Read by BOTH the rendered accordion (plus its sr-only crawlable mirror) in
// modules/calculator/hourly-to-annual-salary-calculator.tsx and the FAQPage
// JSON-LD in app/hourly-to-annual-salary-calculator/page.tsx. Before this file
// the two held different question sets with hardcoded dollar figures; this is
// their union plus People Also Ask questions from the live Google AU SERP
// (docs/seo/2026-09-24-paa-optimisation.md). Every figure is derived from
// lib/constants.

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
import { AWE_HEADLINE, AWE_RELEASE, annualise } from "@/lib/data/average-salary";
import { NMW } from "@/lib/constants/minimum-wage";
import { SALARY_TO_HOURLY_SALARIES } from "@/lib/data/salary-pages";

export interface HourlyToAnnualFaq {
  q: string;
  a: string;
}

const FY = SITE_CONFIG.financialYear;
const H = EMPLOYMENT.standardWeeklyHours;
const WK = EMPLOYMENT.weeksPerYear;
const HOURS = EMPLOYMENT.hoursPerYear;
const HOURS_LABEL = HOURS.toLocaleString("en-AU");
const SG = formatPercent(SUPER_GUARANTEE.rate, 0);
const CASUAL = formatPercent(EMPLOYMENT.casualLoading, 0);

export const annualAt = (rate: number, hours: number = H) => Math.round(rate * hours * WK * 100) / 100;
export const netAt = (rate: number) => calculatePayBreakdown({ grossSalary: annualAt(rate) }).takeHomePay;

const PT_RATE = 35;
const PT_HOURS = 20;
const CASUAL_BASE = 30;
const CASUAL_RATE = CASUAL_BASE * (1 + EMPLOYMENT.casualLoading);
const TAX_START_HOURLY = TAX_FREE_THRESHOLD / HOURS;
const HECS_FIRST = HECS_HELP.bands[1];

/** Salary → hourly reverse table (PAA: "How do I work out my hourly rate based on salary?"). */
export const SALARY_TO_HOURLY_ROWS = [50_000, 60_000, 70_000, 80_000, 90_000, 100_000, 120_000, 150_000].map((salary) => ({
  salary,
  hourly: salary / HOURS,
  href: SALARY_TO_HOURLY_SALARIES.includes(salary) ? `/salary-to-hourly/${salary}/` : null,
}));
const AWOTE_ANNUAL = annualise(AWE_HEADLINE.fullTimeOrdinaryWeekly);
const AWOTE_HOURLY = AWE_HEADLINE.fullTimeOrdinaryWeekly / H;

export const HOURLY_TO_ANNUAL_FAQS: readonly HourlyToAnnualFaq[] = [
  {
    q: "How do you calculate annual salary from an hourly rate?",
    a: `Multiply your hourly rate by the hours you work each week, then multiply that by ${WK} (the weeks in a year). For example, $40/hr × ${H} hours × ${WK} weeks = ${formatAUD(annualAt(40))} gross per year. For a full-time ${H}-hour week, that is the same as multiplying the hourly rate by ${HOURS_LABEL}.`,
  },
  {
    q: "$40 an hour is how much a year in Australia?",
    a: `$40/hr full-time (${H}h/week, ${WK} weeks) = ${formatAUD(annualAt(40))} gross per year, ${formatAUD(netAt(40))} after tax (FY${FY}).`,
  },
  {
    q: "$25 an hour is how much per year?",
    a: `$25/hr = ${formatAUD(annualAt(25))} gross per year, ${formatAUD(netAt(25))} after tax (FY${FY}).`,
  },
  {
    q: "$50 an hour is how much per year?",
    a: `$50/hr = ${formatAUD(annualAt(50))} gross per year, ${formatAUD(netAt(50))} after tax (FY${FY}).`,
  },
  {
    q: "How many working hours are in a year in Australia?",
    a: `A full-time employee is paid for ${HOURS_LABEL} hours a year: ${H} ordinary hours a week × ${WK} weeks. A 40-hour week is ${(40 * WK).toLocaleString("en-AU")} hours and a 37.5-hour week is ${(37.5 * WK).toLocaleString("en-AU")}. A calendar year has ${(365 * 24).toLocaleString("en-AU")} hours in total (${(366 * 24).toLocaleString("en-AU")} in a leap year).`,
  },
  {
    q: "What is a standard working week in Australia?",
    a: `The National Employment Standards (NES) set maximum ordinary hours at ${H} hours per week for full-time employees. That is ${(H / 5).toFixed(1)} hours a day over a 5-day week, or ${HOURS_LABEL} ordinary hours a year.`,
  },
  {
    q: "Does my hourly rate include superannuation?",
    a: `No. For permanent employees, the employer pays an extra ${SG} Superannuation Guarantee on top of your ordinary time earnings. Casual employees also get ${SG} super on top of their hourly rate, which already includes the ${CASUAL} casual loading.`,
  },
  {
    q: "Should I include overtime in my annual salary calculation?",
    a: "The standard conversion (hourly × hours × 52) covers only ordinary time earnings. Overtime is usually paid at penalty rates of 1.5x or 2x and is not guaranteed each week, so calculate it separately and add it to your base annual salary. Superannuation is generally calculated on ordinary time earnings only, not on overtime hours.",
  },
  {
    q: "How do I convert a part-time hourly rate to a full-time equivalent?",
    a: `The hourly rate does not change between part-time and full-time. To find the full-time equivalent (FTE) salary, multiply your hourly rate by ${H} hours × ${WK} weeks. A part-time worker on $${PT_RATE}/hr at ${PT_HOURS} hours a week earns ${formatAUD(annualAt(PT_RATE, PT_HOURS))} a year, but the FTE salary is ${formatAUD(annualAt(PT_RATE))}.`,
  },
  {
    q: "How does casual loading affect the annual salary calculation?",
    a: `Casual loading of ${CASUAL} is added to the base hourly rate to make up for having no paid leave. A base rate of $${CASUAL_BASE}/hr becomes ${formatAUD(CASUAL_RATE, 2)}/hr with loading. At ${H} hours a week that is ${formatAUD(annualAt(CASUAL_RATE))} a year, but it includes pay in place of the annual and personal leave that casuals do not get as paid time off.`,
  },
  {
    q: "At what hourly rate do I start paying income tax?",
    a: `The tax-free threshold is ${formatAUD(TAX_FREE_THRESHOLD)} a year. At ${H} hours a week, you start paying income tax above about ${formatAUD(TAX_START_HOURLY, 2)}/hr. Every dollar above ${formatAUD(TAX_FREE_THRESHOLD)} is taxed at your marginal rate, starting at ${formatPercent(TAX_BRACKETS[1].rate, 0)} for income between ${formatAUD(TAX_BRACKETS[1].min)} and ${formatAUD(TAX_BRACKETS[1].max)} in FY${FY}.`,
  },
  {
    q: "Does my HECS-HELP debt affect this conversion?",
    a: `The conversion itself is unaffected, but HECS-HELP repayments reduce take-home pay once income passes ${formatAUD(HECS_HELP.minimumThreshold)} in FY${FY}. At $30/hr (${H} hours) the salary of ${formatAUD(annualAt(30))} is below that, so nothing is repaid. At $40/hr it reaches ${formatAUD(annualAt(40))} and ${Math.round(HECS_FIRST.marginalRate * 100)}c per dollar applies to the part above the threshold.`,
  },
  {
    q: "How do I work out my hourly rate based on salary?",
    a: `Divide your annual salary by ${HOURS_LABEL}, the paid hours in a full-time year (${H} hours × ${WK} weeks). For example, ${formatAUD(70_000)} ÷ ${HOURS_LABEL} = ${formatAUD(70_000 / HOURS, 2)} an hour. If your contract is for different weekly hours, divide by those hours × ${WK} instead.`,
  },
  {
    q: "What is $70,000 a year hourly in Australia?",
    a: `${formatAUD(70_000)} a year is ${formatAUD(70_000 / HOURS, 2)} an hour on a standard ${H}-hour week (${formatAUD(70_000)} ÷ ${HOURS_LABEL} hours). That is ${formatAUD(70_000 / WK, 2)} a week before tax, and about ${formatAUD(calculatePayBreakdown({ grossSalary: 70_000 }).takeHomePay)} a year after tax in FY${FY}.`,
  },
  {
    q: "Is $45 an hour good in Australia?",
    a: `$45 an hour full-time is ${formatAUD(annualAt(45))} a year, about ${formatAUD(netAt(45))} after tax in FY${FY}. That is well above the ${formatAUD(NMW.hourly, 2)} minimum wage but below average full-time ordinary earnings, which the ABS put at ${formatAUD(AWE_HEADLINE.fullTimeOrdinaryWeekly, 2)} a week (${formatAUD(AWOTE_ANNUAL)} a year, or ${formatAUD(AWOTE_HOURLY, 2)} an hour) in ${AWE_RELEASE.referencePeriod}.`,
  },
];
