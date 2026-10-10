// Shared FAQ copy for /salary-to-hourly/[amount]/ — rendered by the
// SalaryToHourly accordion and turned into FAQPage JSON-LD by the page, so the
// structured data cannot drift from the visible answers. Every figure comes
// from the salary-pages facts module (lib/data/salary-pages), the tax engine,
// EMPLOYMENT, the ABS average-earnings module and the award rate index;
// nothing is typed in.
//
// 10 Oct 2026: "How do you convert" and "per day" went (they repeated the
// calculation line and the table word for word), and so did "a week and a
// fortnight after tax" (the /take-home-pay-on/ page answers it and SalaryNav
// links it). The award question is new.

import { EMPLOYMENT, formatAUD } from "@/lib/constants/australian-tax";
import { salaryFacts } from "@/lib/data/salary-pages";
import { AWE_HEADLINE, annualise } from "@/lib/data/average-salary";
import { awardRatesNear } from "@/lib/data/award-rate-index";
import { awardRatesFaqAnswer } from "@/modules/programmatic/award-rates-near";
import type { FaqItem } from "@/lib/faq";

const HOURS_PER_WEEK = EMPLOYMENT.standardWeeklyHours;
const WEEKS_PER_YEAR = EMPLOYMENT.weeksPerYear;
const HOURS_PER_YEAR = EMPLOYMENT.hoursPerYear;
const MINIMUM_WAGE_HOURLY = EMPLOYMENT.minimumWageHourly;

export function salaryToHourlyFaqs(salary: number): FaqItem[] {
  const s = formatAUD(salary);
  const facts = salaryFacts(salary);
  const b = facts.breakdown;
  const grossHourly = salary / HOURS_PER_YEAR;
  const netHourly = b.takeHomePay / HOURS_PER_YEAR;
  const averageHourly = annualise(AWE_HEADLINE.fullTimeOrdinaryWeekly) / HOURS_PER_YEAR;
  const vsAverage = grossHourly / averageHourly;
  const vsMinimum = grossHourly / MINIMUM_WAGE_HOURLY;
  const belowMinimum = grossHourly < MINIMUM_WAGE_HOURLY;
  const minWage = `$${MINIMUM_WAGE_HOURLY.toFixed(2)}`;
  const hours = HOURS_PER_YEAR.toLocaleString("en-AU");
  const hourlyLabel = formatAUD(grossHourly, 2);

  return [
    {
      q: `How much is ${s} per hour in Australia?`,
      a: `A ${s} annual salary equals ${hourlyLabel} per hour before tax, based on a standard ${HOURS_PER_WEEK}-hour work week and ${WEEKS_PER_YEAR} weeks per year (${hours} working hours). After income tax and Medicare levy, the effective hourly rate is ${formatAUD(netHourly, 2)}.`,
    },
    {
      q: `Is ${hourlyLabel}/hour above or below average in Australia?`,
      a:
        vsAverage >= 1
          ? `At ${hourlyLabel}/hour, you earn ${((vsAverage - 1) * 100).toFixed(0)}% above the average full-time hourly rate of ${formatAUD(averageHourly, 2)}/hour (based on ABS Average Weekly Earnings). Your rate is also ${vsMinimum.toFixed(1)}x the national minimum wage of ${minWage}/hour.`
          : `At ${hourlyLabel}/hour, you earn ${((1 - vsAverage) * 100).toFixed(0)}% below the average full-time hourly rate of ${formatAUD(averageHourly, 2)}/hour (based on ABS Average Weekly Earnings). ${
              belowMinimum
                ? `It is also below the national minimum wage of ${minWage}/hour, so as a full-time salary it is less than an adult employee must be paid (junior, apprentice and supported wages aside).`
                : `Your rate is ${vsMinimum.toFixed(1)}x the national minimum wage of ${minWage}/hour.`
            }`,
    },
    {
      q: `Which award classifications have a minimum rate near ${hourlyLabel} an hour?`,
      a: awardRatesFaqAnswer(awardRatesNear(grossHourly), hourlyLabel),
    },
  ];
}
