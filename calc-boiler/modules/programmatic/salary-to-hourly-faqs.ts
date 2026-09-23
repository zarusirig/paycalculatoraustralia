// Shared FAQ copy for /salary-to-hourly/[amount]/ — rendered by the
// SalaryToHourly accordion and turned into FAQPage JSON-LD by the page, so the
// structured data cannot drift from the visible answers. Every figure comes
// from the salary-pages facts module (lib/data/salary-pages), the tax engine,
// EMPLOYMENT and the ABS average-earnings module; nothing is typed in.

import { EMPLOYMENT, formatAUD } from "@/lib/constants/australian-tax";
import { salaryFacts } from "@/lib/data/salary-pages";
import { AWE_HEADLINE, annualise } from "@/lib/data/average-salary";
import type { FaqItem } from "@/lib/faq";

const HOURS_PER_WEEK = EMPLOYMENT.standardWeeklyHours;
const WEEKS_PER_YEAR = EMPLOYMENT.weeksPerYear;
const HOURS_PER_YEAR = EMPLOYMENT.hoursPerYear;
const DAYS_PER_WEEK = 5;
const HOURS_PER_DAY = HOURS_PER_WEEK / DAYS_PER_WEEK; // 7.6
const WORKING_DAYS_PER_YEAR = WEEKS_PER_YEAR * DAYS_PER_WEEK; // 260
const MINIMUM_WAGE_HOURLY = EMPLOYMENT.minimumWageHourly;

export function salaryToHourlyFaqs(salary: number): FaqItem[] {
  const s = formatAUD(salary);
  const facts = salaryFacts(salary);
  const b = facts.breakdown;
  const grossHourly = salary / HOURS_PER_YEAR;
  const netHourly = b.takeHomePay / HOURS_PER_YEAR;
  const grossDaily = salary / WORKING_DAYS_PER_YEAR;
  const netDaily = b.takeHomePay / WORKING_DAYS_PER_YEAR;
  const averageHourly = annualise(AWE_HEADLINE.fullTimeOrdinaryWeekly) / HOURS_PER_YEAR;
  const vsAverage = grossHourly / averageHourly;
  const vsMinimum = grossHourly / MINIMUM_WAGE_HOURLY;
  const belowMinimum = grossHourly < MINIMUM_WAGE_HOURLY;
  const minWage = `$${MINIMUM_WAGE_HOURLY.toFixed(2)}`;
  const hours = HOURS_PER_YEAR.toLocaleString("en-AU");

  return [
    {
      q: `How much is ${s} per hour in Australia?`,
      a: `A ${s} annual salary equals ${formatAUD(grossHourly, 2)} per hour before tax, based on a standard ${HOURS_PER_WEEK}-hour work week and ${WEEKS_PER_YEAR} weeks per year (${hours} working hours). After income tax and Medicare levy, the effective hourly rate is ${formatAUD(netHourly, 2)}.`,
    },
    {
      q: `How do you convert ${s} salary to hourly rate?`,
      a: `Divide the annual salary by the total working hours per year. With a ${HOURS_PER_WEEK}-hour week: ${s} / (${HOURS_PER_WEEK} hours x ${WEEKS_PER_YEAR} weeks) = ${s} / ${hours} hours = ${formatAUD(grossHourly, 2)}/hour.`,
    },
    {
      q: `Is ${formatAUD(grossHourly, 2)}/hour above or below average in Australia?`,
      a:
        vsAverage >= 1
          ? `At ${formatAUD(grossHourly, 2)}/hour, you earn ${((vsAverage - 1) * 100).toFixed(0)}% above the average full-time hourly rate of ${formatAUD(averageHourly, 2)}/hour (based on ABS Average Weekly Earnings). Your rate is also ${vsMinimum.toFixed(1)}x the national minimum wage of ${minWage}/hour.`
          : `At ${formatAUD(grossHourly, 2)}/hour, you earn ${((1 - vsAverage) * 100).toFixed(0)}% below the average full-time hourly rate of ${formatAUD(averageHourly, 2)}/hour (based on ABS Average Weekly Earnings). ${
              belowMinimum
                ? `It is also below the national minimum wage of ${minWage}/hour, so as a full-time salary it is less than an adult employee must be paid (junior, apprentice and supported wages aside).`
                : `Your rate is ${vsMinimum.toFixed(1)}x the national minimum wage of ${minWage}/hour.`
            }`,
    },
    {
      q: `What is ${s} per day before and after tax?`,
      a: `On a ${s} salary working a standard ${HOURS_PER_DAY}-hour day, you earn ${formatAUD(grossDaily, 2)} per day before tax and ${formatAUD(netDaily, 2)} per day after tax. This is based on ${WORKING_DAYS_PER_YEAR} working days per year (${WEEKS_PER_YEAR} weeks x ${DAYS_PER_WEEK} days).`,
    },
    {
      q: `How much is ${s} a week and a fortnight after tax?`,
      a: `${s} a year is ${formatAUD(salary / WEEKS_PER_YEAR)} a week or ${formatAUD(salary / 26)} a fortnight before tax. After income tax and Medicare levy, that is ${formatAUD(b.weekly)} a week and ${formatAUD(b.fortnightly)} a fortnight, with employer super of ${formatAUD(facts.employerSuper)} a year paid on top. See the take-home pay on ${s} for the full breakdown.`,
      links: { [`take-home pay on ${s}`]: `/take-home-pay-on/${salary}/` },
    },
  ];
}
