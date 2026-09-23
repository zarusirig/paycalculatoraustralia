import { calculatePayBreakdown, SITE_CONFIG, SUPER_GUARANTEE } from "@/lib/constants/australian-tax";
import {
  AWE_BY_INDUSTRY,
  AWE_BY_STATE,
  AWE_HEADLINE,
  AWE_RELEASE,
  EE_MEDIAN,
  EE_PERCENTILES_ALL,
  EE_RELEASE,
  HEADLINE,
  annualise,
  dollars,
  dollarsCents,
} from "@/lib/data/average-salary";

/** Resident, no HECS, FY take-home on a gross salary — the same engine as /take-home-pay-on/N/. */
export function takeHome(annual: number): number {
  return calculatePayBreakdown({ grossSalary: annual }).takeHomePay;
}

const byWeeklyDesc = <T extends { weekly: number }>(rows: T[]) => [...rows].sort((a, b) => b.weekly - a.weekly);

const topState = byWeeklyDesc(AWE_BY_STATE)[0];
const secondState = byWeeklyDesc(AWE_BY_STATE)[1];
const lowState = byWeeklyDesc(AWE_BY_STATE).at(-1)!;
const topIndustry = byWeeklyDesc(AWE_BY_INDUSTRY)[0];
const lowIndustry = byWeeklyDesc(AWE_BY_INDUSTRY).at(-1)!;
const p75 = EE_PERCENTILES_ALL.find((p) => p.percentile === 75)!;
const p90 = EE_PERCENTILES_ALL.find((p) => p.percentile === 90)!;
const genderGapPct =
  Math.round(
    ((AWE_HEADLINE.maleFullTimeOrdinaryWeekly - AWE_HEADLINE.femaleFullTimeOrdinaryWeekly) /
      AWE_HEADLINE.maleFullTimeOrdinaryWeekly) *
      1000,
  ) / 10;

export const AVERAGE_SALARY_GENDER_GAP_PCT = genderGapPct;

export const AVERAGE_SALARY_FAQS: { q: string; a: string }[] = [
  {
    q: "What is the average salary in Australia?",
    a: `The average full-time salary in Australia is ${dollars(HEADLINE.averageAnnual)} a year, or ${dollarsCents(AWE_HEADLINE.fullTimeOrdinaryWeekly)} a week. That is the ABS's full-time adult average weekly ordinary time earnings for ${AWE_RELEASE.referencePeriod} (released ${AWE_RELEASE.released}), up ${AWE_HEADLINE.fullTimeOrdinaryAnnualChangePct}% in a year. Including overtime it is ${dollars(HEADLINE.averageFullTimeTotalAnnual)}; averaged across all employees, part-time included, it is ${dollars(HEADLINE.averageAllEmployeesAnnual)}.`,
  },
  {
    q: "What is the median salary in Australia?",
    a: `The median full-time salary is ${dollars(HEADLINE.medianFullTimeAnnual)} a year (${dollars(EE_MEDIAN.fullTime)} a week), and the median across all employees, including part-time workers, is ${dollars(HEADLINE.medianAllAnnual)} a year (${dollars(EE_MEDIAN.allEmployees)} a week). Both are from the ABS Employee Earnings survey for ${EE_RELEASE.referencePeriod}, released ${EE_RELEASE.released}. Half of employees earn more than the median and half earn less.`,
  },
  {
    q: "Why is the average salary higher than the median?",
    a: `Because earnings are skewed: a minority of very high earners pull the mean up, while the median is simply the middle person. The full-time average of ${dollars(HEADLINE.averageAnnual)} is about ${dollars(HEADLINE.averageAnnual - HEADLINE.medianFullTimeAnnual)} above the full-time median of ${dollars(HEADLINE.medianFullTimeAnnual)}. The two figures also come from different ABS surveys and dates — the average from employers in ${AWE_RELEASE.referencePeriod}, the median from households in ${EE_RELEASE.referencePeriod}.`,
  },
  {
    q: "What is the average salary in Australia after tax?",
    a: `On the average full-time salary of ${dollars(HEADLINE.averageAnnual)}, take-home pay is about ${dollars(takeHome(HEADLINE.averageAnnual))} a year for ${SITE_CONFIG.financialYear} — an Australian resident with no HECS debt and no Medicare levy surcharge, after income tax and the 2% Medicare levy. On the full-time median of ${dollars(HEADLINE.medianFullTimeAnnual)} it is about ${dollars(takeHome(HEADLINE.medianFullTimeAnnual))}.`,
  },
  {
    q: "What is a good salary in Australia?",
    a: `Measured against every employee, a salary of ${dollars(annualise(p75.weekly))} a year (${dollars(p75.weekly)} a week) put you in the top 25% in ${EE_RELEASE.referencePeriod}, and ${dollars(annualise(p90.weekly))} (${dollars(p90.weekly)} a week) put you in the top 10%. Anything above the full-time median of ${dollars(HEADLINE.medianFullTimeAnnual)} is more than half of full-time workers earn.`,
  },
  {
    q: "Which state has the highest average salary?",
    a: `${topState.label} has the highest full-time average at ${dollarsCents(topState.weekly)} a week (${dollars(annualise(topState.weekly))} a year), followed by ${secondState.label} at ${dollarsCents(secondState.weekly)} (${dollars(annualise(secondState.weekly))}). ${lowState.label} is lowest at ${dollarsCents(lowState.weekly)} (${dollars(annualise(lowState.weekly))}). Source: ABS Average Weekly Earnings, ${AWE_RELEASE.referencePeriod}, original series.`,
  },
  {
    q: "What is the highest-paying industry in Australia?",
    a: `${topIndustry.label} — full-time adults average ${dollarsCents(topIndustry.weekly)} a week, or ${dollars(annualise(topIndustry.weekly))} a year. ${lowIndustry.label} is the lowest at ${dollarsCents(lowIndustry.weekly)} a week (${dollars(annualise(lowIndustry.weekly))}). Source: ABS Average Weekly Earnings, ${AWE_RELEASE.referencePeriod}.`,
  },
  {
    q: "What is the average salary for men and women in Australia?",
    a: `Full-time men average ${dollarsCents(AWE_HEADLINE.maleFullTimeOrdinaryWeekly)} a week (${dollars(annualise(AWE_HEADLINE.maleFullTimeOrdinaryWeekly))} a year) and full-time women ${dollarsCents(AWE_HEADLINE.femaleFullTimeOrdinaryWeekly)} (${dollars(annualise(AWE_HEADLINE.femaleFullTimeOrdinaryWeekly))}), a gap of ${genderGapPct}% on this measure (ABS, ${AWE_RELEASE.referencePeriod}, seasonally adjusted). The median full-time weekly figures are ${dollars(EE_MEDIAN.maleFullTime)} for men and ${dollars(EE_MEDIAN.femaleFullTime)} for women (${EE_RELEASE.referencePeriod}).`,
  },
  {
    q: "Do average salary figures include superannuation?",
    a: `No. ABS earnings figures are gross pay before tax and exclude the superannuation your employer pays on top. On the average full-time salary of ${dollars(HEADLINE.averageAnnual)}, the ${Math.round(SUPER_GUARANTEE.rate * 100)}% Superannuation Guarantee adds roughly another ${dollars(HEADLINE.averageAnnual * SUPER_GUARANTEE.rate)} to your total package.`,
  },
  {
    q: "What is the average weekly wage in Australia?",
    a: `${dollarsCents(AWE_HEADLINE.fullTimeOrdinaryWeekly)} a week for full-time adults (ordinary time, ${AWE_RELEASE.referencePeriod}). The median weekly wage is ${dollars(EE_MEDIAN.fullTime)} for full-time employees and ${dollars(EE_MEDIAN.allEmployees)} across all employees, and the median hourly rate is $${EE_MEDIAN.hourlyAll.toFixed(2)} (${EE_RELEASE.referencePeriod}).`,
  },
];
