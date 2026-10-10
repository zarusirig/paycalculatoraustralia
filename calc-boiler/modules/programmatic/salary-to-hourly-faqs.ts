// Shared FAQ copy for /salary-to-hourly/[amount]/ — rendered by the
// SalaryToHourly accordion and turned into FAQPage JSON-LD by the page, so the
// structured data cannot drift from the visible answers. Every figure comes
// from the salary-pages facts module (lib/data/salary-pages), the tax engine,
// EMPLOYMENT, the ABS average-earnings module, the award rate index, the pay
// scale index and the minimum wage and super constants; nothing is typed in.
//
// 10 Oct 2026: "How do you convert" and "per day" went (they repeated the
// calculation line and the table word for word), and so did "a week and a
// fortnight after tax" (the /take-home-pay-on/ page answers it and SalaryNav
// links it). The award question is new.
//
// Second pass, 10 Oct 2026: "How much is $X per hour" went too (the H1 and the
// hero answer it). Three or four questions now depend on the salary: the
// minimum wage (under a full-time casual minimum) or the super-inclusive rate,
// whether the hourly figure is legal (under the adult minimum), the award
// minimums near it (or the nearest either side), and the published pay scale
// points near the salary; above or below average fills a short list.

import { EMPLOYMENT, formatAUD, formatPercent, SUPER_GUARANTEE } from "@/lib/constants/australian-tax";
import { NMW, NMW_DECISION } from "@/lib/constants/minimum-wage";
import { salaryFacts } from "@/lib/data/salary-pages";
import { AWE_HEADLINE, annualise } from "@/lib/data/average-salary";
import { AWARD_RATE_MAX, AWARD_RATE_MIN, awardLabel } from "@/lib/data/award-rate-index";
import {
  CASUAL_MINIMUM_FULL_TIME,
  nearestAwardRates,
  salaryPageAwardRates,
  salaryPageAwardWindow,
  salaryPageHalfWindow,
  salaryPagePayScalePoints,
} from "@/lib/data/hourly-rate-context";
import { awardRatesFaqAnswer } from "@/modules/programmatic/award-rates-near";
import { payScaleFaq } from "@/modules/programmatic/pay-scale-faq";
import { legality } from "@/modules/programmatic/hourly-to-salary-faqs";
import type { FaqItem } from "@/lib/faq";

const HOURS_PER_WEEK = EMPLOYMENT.standardWeeklyHours;
const WEEKS_PER_YEAR = EMPLOYMENT.weeksPerYear;
const HOURS_PER_YEAR = EMPLOYMENT.hoursPerYear;
const money = (n: number) => formatAUD(n, 2);
/** "50c" / "$1.26". */
const windowText = (w: number) => (w < 1 ? `${Math.round(w * 100)}c` : money(w));

/** Under a full-time casual minimum: what the salary is in minimum-wage hours. */
function minimumWageQuestion(salary: number, s: string, hourlyLabel: string): FaqItem {
  const weekly = salary / WEEKS_PER_YEAR;
  const atAdult = (weekly / NMW.hourly).toFixed(1);
  const atCasual = (weekly / NMW.casualHourly).toFixed(1);
  if (salary < NMW.annual) {
    return {
      q: `Is ${s} a year below the minimum wage?`,
      a: `As a full-time salary, yes: ${s} is ${hourlyLabel} an hour over ${HOURS_PER_WEEK} hours, under the ${money(NMW.hourly)} adult minimum from ${NMW_DECISION.operativeFrom} (${formatAUD(NMW.annual)} a year full time). As part-time pay it is ${atAdult} hours a week at the adult minimum, or ${atCasual} hours at the ${money(NMW.casualHourly)} casual minimum.`,
    };
  }
  return {
    q: `How many hours a week is ${s} at the minimum wage?`,
    a: `${atAdult} hours a week at the ${money(NMW.hourly)} adult minimum, which is more than a ${HOURS_PER_WEEK}-hour week, or ${atCasual} hours at the ${money(NMW.casualHourly)} casual minimum (the adult rate plus 25%).`,
  };
}

function packageQuestion(salary: number, s: string): FaqItem {
  const f = salaryFacts(salary);
  const sg = f.employerSuper;
  return {
    q: `What is ${s} a year per hour including super?`,
    a: `${money((salary + sg) / HOURS_PER_YEAR)} an hour: ${money(salary / HOURS_PER_YEAR)} of salary plus ${money(sg / HOURS_PER_YEAR)} of employer super (${formatAUD(sg)} a year${f.superCapped ? `, capped because the Super Guarantee is only owed on earnings up to ${formatAUD(SUPER_GUARANTEE.maxContributionBaseAnnual)}` : `, ${formatPercent(SUPER_GUARANTEE.rate, 0)} of salary`}).`,
  };
}

function averageQuestion(salary: number, hourlyLabel: string): FaqItem {
  const grossHourly = salary / HOURS_PER_YEAR;
  const averageHourly = annualise(AWE_HEADLINE.fullTimeOrdinaryWeekly) / HOURS_PER_YEAR;
  const vsAverage = grossHourly / averageHourly;
  const vsMinimum = grossHourly / NMW.hourly;
  const minWage = money(NMW.hourly);
  return {
    q: `Is ${hourlyLabel}/hour above or below average in Australia?`,
    a:
      vsAverage >= 1
        ? `At ${hourlyLabel}/hour, you earn ${((vsAverage - 1) * 100).toFixed(0)}% above the average full-time hourly rate of ${money(averageHourly)}/hour (based on ABS Average Weekly Earnings). Your rate is also ${vsMinimum.toFixed(1)}x the national minimum wage of ${minWage}/hour.`
        : `At ${hourlyLabel}/hour, you earn ${((1 - vsAverage) * 100).toFixed(0)}% below the average full-time hourly rate of ${money(averageHourly)}/hour (based on ABS Average Weekly Earnings). ${
            grossHourly < NMW.hourly
              ? `It is also below the national minimum wage of ${minWage}/hour, so as a full-time salary it is less than an adult employee must be paid (junior, apprentice and supported wages aside).`
              : `Your rate is ${vsMinimum.toFixed(1)}x the national minimum wage of ${minWage}/hour.`
          }`,
  };
}

/** Award rows in the page's window, or the nearest either side; null below or above every award. */
function awardQuestion(salary: number, hourlyLabel: string): FaqItem | null {
  const grossHourly = salary / HOURS_PER_YEAR;
  const window = salaryPageAwardWindow(salary);
  const near = salaryPageAwardRates(salary);
  if (near.matches.length > 0) {
    return {
      q: `Which award classifications have a minimum rate near ${hourlyLabel} an hour?`,
      a: awardRatesFaqAnswer(near, hourlyLabel),
    };
  }
  if (grossHourly < AWARD_RATE_MIN.hourly || grossHourly > AWARD_RATE_MAX.hourly) return null;
  const { below, above } = nearestAwardRates(grossHourly);
  const side = (m: NonNullable<typeof below>, word: string) =>
    `the nearest ${word} is ${money(m.hourly)} (${awardLabel(m)}, ${m.classifications.join(" and ")})`;
  const sides = [below && side(below, "below"), above && side(above, "above")].filter(Boolean).join("; ");
  return {
    q: `Which award minimums are closest to ${hourlyLabel} an hour?`,
    a: `No adult award minimum we track is within ${windowText(window)} of ${hourlyLabel}: ${sides}. Award minimums are legal floors for ordinary hours, not typical pay.`,
  };
}

/** Above every award minimum, with no pay scale point near the salary either. */
function aboveAwardsQuestion(salary: number, hourlyLabel: string): FaqItem | null {
  const grossHourly = salary / HOURS_PER_YEAR;
  if (grossHourly <= AWARD_RATE_MAX.hourly) return null;
  return {
    q: `Is ${hourlyLabel} an hour above award rates?`,
    a: `Yes. The highest adult award minimum we track is ${money(AWARD_RATE_MAX.hourly)} an hour (${awardLabel(AWARD_RATE_MAX)}, ${AWARD_RATE_MAX.classification}, from ${AWARD_RATE_MAX.effectiveLabel}), ${money(grossHourly - AWARD_RATE_MAX.hourly)} under ${hourlyLabel}. Pay at this level is set by an enterprise agreement, a contract or an individual salary rather than an award minimum.`,
  };
}

export function salaryToHourlyFaqs(salary: number): FaqItem[] {
  const s = formatAUD(salary);
  const hourlyLabel = money(salary / HOURS_PER_YEAR);
  const lowSalary = salary < CASUAL_MINIMUM_FULL_TIME;
  const scales = payScaleFaq(salaryPagePayScalePoints(salary), salary, salaryPageHalfWindow(salary));

  const grossHourly = salary / HOURS_PER_YEAR;
  const items = [
    lowSalary ? minimumWageQuestion(salary, s, hourlyLabel) : packageQuestion(salary, s),
    grossHourly < NMW.hourly ? legality(grossHourly, hourlyLabel) : null,
    awardQuestion(salary, hourlyLabel) ?? (scales ? null : aboveAwardsQuestion(salary, hourlyLabel)),
    scales,
  ]
    .filter((f): f is FaqItem => f !== null)
    .slice(0, 4);
  // At least three: where fewer facts apply, above or below average, then the super-inclusive rate.
  for (const fill of [averageQuestion(salary, hourlyLabel), lowSalary ? packageQuestion(salary, s) : null]) {
    if (items.length < 3 && fill) items.push(fill);
  }
  return items.slice(0, 4);
}
