// Shared FAQ copy for /take-home-pay-on/[salary]/ — rendered by the
// TakeHomePayOnSalary accordion and turned into FAQPage JSON-LD by the page,
// so the structured data cannot drift from the visible answers. Every figure
// is computed from the tax engine, lib/data/average-salary and
// lib/data/occupation-medians.
//
// Oct 2026: four questions, two of them about this salary in particular (the
// jobs paid about this much and where it sits against the median), instead of
// five that restated the tables above them.

import { calculatePayBreakdown, formatAUD, SITE_CONFIG } from "@/lib/constants/australian-tax";
import { EE_MEDIAN, EE_RELEASE, HEADLINE } from "@/lib/data/average-salary";
import { MEDIAN_SOURCE_NAME, MEDIAN_SOURCE_PERIOD, groupName, medianRank, occupationsNear } from "@/lib/data/occupation-medians";
import type { FaqItem } from "@/lib/faq";

function list(items: string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

export function takeHomePayOnSalaryFaqs(salary: number): FaqItem[] {
  const fy = SITE_CONFIG.financialYear;
  const s = formatAUD(salary);
  const b = calculatePayBreakdown({ grossSalary: salary });
  const withHecs = calculatePayBreakdown({ grossSalary: salary, includeHECS: true });

  const near = occupationsNear(salary).slice(0, 3);
  const rank = medianRank(salary);
  const jobs = list(near.map((o) => `${groupName(o.anzscoTitle)} (${formatAUD(o.annual)})`));

  // ABS full-time median (Employee Earnings). The percentile is in the body
  // (EarningsPosition), so the answer adds the median instead of repeating it.
  const median = HEADLINE.medianFullTimeAnnual;
  const vsMedian = salary - median;
  const rankSentence =
    rank.below === 0
      ? `It is also below the median full-time pay of all ${rank.total} occupation groups we track.`
      : rank.above === 0
        ? `It is also above the median full-time pay of all ${rank.total} occupation groups we track.`
        : `It is also above the median full-time pay in ${rank.below} of the ${rank.total} occupation groups we track.`;

  return [
    {
      q: `What is the take-home pay on ${s} in Australia?`,
      a: `On a ${s} salary, your take-home pay is ${formatAUD(b.takeHomePay)} a year after income tax of ${formatAUD(b.netIncomeTax)} and Medicare levy of ${formatAUD(b.medicareLevy)}: ${formatAUD(b.monthly)} a month, ${formatAUD(b.fortnightly)} a fortnight or ${formatAUD(b.weekly)} a week. This uses ATO resident tax rates for FY${fy} and excludes HECS-HELP and salary sacrifice.`,
    },
    {
      q: `How much is ${s} after tax with a HECS debt?`,
      a:
        withHecs.hecsRepayment > 0
          ? `With a HECS-HELP debt, the compulsory repayment on ${s} is ${formatAUD(withHecs.hecsRepayment)} a year, so take-home pay falls to ${formatAUD(withHecs.takeHomePay)} (${formatAUD(withHecs.fortnightly)} a fortnight, ${formatAUD(withHecs.weekly)} a week) in ${fy}.`
          : `${s} is below the ${fy} compulsory HECS-HELP repayment threshold, so a study loan does not change take-home pay of ${formatAUD(b.takeHomePay)}.`,
    },
    {
      q: `What jobs pay about ${s} in Australia?`,
      a: `On ${MEDIAN_SOURCE_NAME} figures (${MEDIAN_SOURCE_PERIOD}), the occupation groups whose median full-time pay is closest to ${s} are ${jobs}. These are medians, so half the full-time employees in each group earn more and half less. Our pay rates by job pages show the after-tax pay for each occupation, and the award minimum where one applies.`,
      links: { "pay rates by job": "/job-pay-rates/" },
    },
    {
      q: `Is ${s} above the median salary in Australia?`,
      a:
        vsMedian === 0
          ? `${s} is the median full-time salary in Australia (${formatAUD(EE_MEDIAN.fullTime)} a week in the ABS ${EE_RELEASE.title}, ${EE_RELEASE.referencePeriod}). ${rankSentence}`
          : `${vsMedian > 0 ? "Yes" : "No"}. ${s} is ${formatAUD(Math.abs(vsMedian))} ${vsMedian > 0 ? "above" : "below"} the median full-time salary of ${formatAUD(median)} a year (${formatAUD(EE_MEDIAN.fullTime)} a week in the ABS ${EE_RELEASE.title}, ${EE_RELEASE.referencePeriod}), so ${vsMedian > 0 ? "more than half of full-time employees earn less" : "more than half of full-time employees earn more"}. ${rankSentence}`,
    },
  ];
}
