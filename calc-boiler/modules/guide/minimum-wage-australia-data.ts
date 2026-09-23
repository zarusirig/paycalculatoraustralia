// Shared copy for /minimum-wage-australia/ — read by the page body, the
// metadata and the FAQPage JSON-LD so none of them can drift.

import { EMPLOYMENT, calculatePayBreakdown, formatAUD } from "@/lib/constants";
import { ADULT_AGE, NMW_ORDER } from "@/lib/constants/junior-rates";
import { NMW, NMW_DECISION, NMW_HISTORY, WA_STATE_MINIMUM_WAGE, roundCents } from "@/lib/constants/minimum-wage";

const money = (v: number) => formatAUD(v, 2);

/** Full-time NMW after tax: resident, tax-free threshold claimed, no HECS. */
export const NMW_AFTER_TAX = (() => {
  const b = calculatePayBreakdown({ grossSalary: Math.round(NMW.annual) });
  return {
    gross: NMW.annual,
    tax: b.totalDeductions,
    annual: b.takeHomePay,
    weekly: roundCents(b.takeHomePay / EMPLOYMENT.weeksPerYear),
    fortnightly: roundCents(b.takeHomePay / 26),
    super: b.superContribution,
  };
})();

export const NMW_PERIODS = [
  { label: "Hourly", value: NMW.hourly },
  { label: `Daily (${EMPLOYMENT.standardWeeklyHours / 5} hours)`, value: roundCents(NMW.weekly / 5) },
  { label: `Weekly (${EMPLOYMENT.standardWeeklyHours} hours)`, value: NMW.weekly },
  { label: "Fortnightly", value: NMW.fortnightly },
  { label: "Monthly", value: roundCents(NMW.annual / 12) },
  { label: "Annual (52 weeks)", value: NMW.annual },
] as const;

export const previousRow = NMW_HISTORY[NMW_HISTORY.length - 2];
export const currentRow = NMW_HISTORY[NMW_HISTORY.length - 1];

export const MW_TITLE = `Minimum Wage Australia ${currentRow.fy}: ${money(NMW.hourly)} an Hour, ${money(NMW.weekly)} a Week`;

export const MW_DESCRIPTION = `The National Minimum Wage is ${money(NMW.hourly)} an hour, ${money(NMW.weekly)} a week or ${formatAUD(NMW.annual, 2)} a year from ${NMW_DECISION.operativeFrom}, up ${currentRow.published} from ${money(NMW.previousHourly)}. Casual ${money(NMW.casualHourly)}, plus after-tax pay.`;

export interface Faq {
  q: string;
  a: string;
}

export const MW_FAQS: readonly Faq[] = [
  {
    q: "What is the minimum wage in Australia?",
    a: `From ${NMW_DECISION.operativeFrom} the National Minimum Wage is ${money(NMW.hourly)} an hour, or ${money(NMW.weekly)} for a ${EMPLOYMENT.standardWeeklyHours}-hour week, before tax. That is ${formatAUD(NMW.annual, 2)} a year for a full-time employee. It applies from the first full pay period starting on or after ${NMW_DECISION.operativeFrom} and was set by the Fair Work Commission in the ${NMW_DECISION.name} (${NMW_DECISION.citation}).`,
  },
  {
    q: "What is the minimum wage in Victoria, NSW and Queensland?",
    a: `The same as everywhere else in Australia: ${money(NMW.hourly)} an hour. The National Minimum Wage and modern award rates are set nationally by the Fair Work Commission, so there is no separate minimum wage for Victoria, Melbourne, New South Wales, Sydney, Queensland, South Australia, Tasmania, the ACT or the Northern Territory. Western Australia is the one partial exception: employees of sole traders, partnerships and some trusts there are in the WA state system, whose adult State Minimum Wage is ${money(WA_STATE_MINIMUM_WAGE.weekly)} a week (${money(WA_STATE_MINIMUM_WAGE.hourly)} an hour) from ${WA_STATE_MINIMUM_WAGE.operativeFrom}.`,
  },
  {
    q: "What is the casual minimum wage in Australia?",
    a: `An adult casual employee with no award must be paid at least ${money(NMW.casualHourly)} an hour: the ${money(NMW.hourly)} minimum plus the 25% casual loading. The loading is paid instead of the paid leave and other entitlements that permanent employees receive. Awards set their own casual rates, usually also with a 25% loading on the award rate.`,
  },
  {
    q: "How much is the minimum wage after tax?",
    a: `A full-time adult on the minimum wage earns ${formatAUD(NMW.annual, 2)} a year. After income tax and the Medicare levy, with the tax-free threshold claimed and no HECS debt, that is about ${formatAUD(NMW_AFTER_TAX.annual)} a year, or ${money(NMW_AFTER_TAX.weekly)} a week. Your employer also pays about ${formatAUD(NMW_AFTER_TAX.super)} a year in super on top.`,
  },
  {
    q: "When does the minimum wage go up next?",
    a: `The next change will come from the ${NMW_DECISION.nextReview}. Annual Wage Review outcomes operate from 1 July, so the next increase is expected to apply from the first full pay period on or after ${NMW_DECISION.nextReviewOperativeFrom}. The Commission usually announces its decision in late May or June. The 2026 decision was handed down on ${NMW_DECISION.decidedOn}.`,
  },
  {
    q: "Who gets paid the National Minimum Wage?",
    a: `Adults aged ${ADULT_AGE} and over who are not covered by a modern award or enterprise agreement. Most employees are covered by an award, which sets its own minimum for each classification. Since ${NMW_DECISION.operativeFrom} the lowest adult award rate for ongoing employment is ${money(NMW.hourly)}, and an entry-level rate for no more than the first six months must be at least ${money(NMW_DECISION.entryLevelHourly)}. Junior employees, apprentices, trainees and employees on the supported wage system have their own minimums under the ${NMW_ORDER.citation}.`,
  },
];
