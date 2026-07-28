// Shared FAQ copy for /schads-award-pay-rates/.
//
// Deliberately NOT inside the "use client" guide module: both the rendered
// accordion and the FAQPage JSON-LD in app/schads-award-pay-rates/page.tsx
// read from here, so the structured data cannot drift from the visible page.
// Divergence between the two is what put stale figures into Google's index on
// /tax-on/.
//
// Every dollar figure below is interpolated from lib/constants/schads-award.ts.
// Nothing is typed as a literal.

import { formatAUD } from "@/lib/constants";
import {
  SCHADS_AWARD,
  SCHADS_ALLOWANCES,
  SCHADS_HOME_CARE_AGED,
  SCHADS_PENALTIES,
  SCHADS_SACS,
  type SchadsRate,
} from "@/lib/constants/schads-award";

function rate(rows: readonly SchadsRate[], classification: string): SchadsRate {
  const found = rows.find((r) => r.classification === classification);
  if (!found) throw new Error(`unknown SCHADS classification: ${classification}`);
  return found;
}

/** Round half up to the cent, matching how Fair Work publishes derived rates. */
export function toCents(value: number): number {
  return Math.round(value * 100 + Number.EPSILON) / 100;
}

/** Casual rate = ordinary hourly rate plus the 25% loading (cl 10.4). */
export function schadsCasualHourly(hourly: number): number {
  return toCents(hourly * (1 + SCHADS_AWARD.casualLoading));
}

const L1 = rate(SCHADS_SACS, "Level 1 pay point 1");
const L1_TOP = rate(SCHADS_SACS, "Level 1 pay point 3");
const L2 = rate(SCHADS_SACS, "Level 2 pay point 1");
const L4 = rate(SCHADS_SACS, "Level 4 pay point 1");
const L8 = rate(SCHADS_SACS, "Level 8 pay point 3");
const AGED_ENTRY = SCHADS_HOME_CARE_AGED[0];

/**
 * The pre-ERO clause 15 figure for Level 4 pp1. Exported because the page, the
 * meta description and the FAQ all quote it — always to correct it, never as
 * the operative rate. Asserted against the ERO-inclusive rate in tests.
 */
export const CLAUSE_15_LEVEL_4 = 1_344.5;

export interface SchadsFaq {
  q: string;
  a: string;
}

export const SCHADS_FAQS: readonly SchadsFaq[] = [
  {
    q: "What are the SCHADS award pay rates for 2026-27?",
    a: `Under the social and community services stream, the SCHADS award pays from ${formatAUD(L1.weekly, 2)} a week (${formatAUD(L1.hourly, 2)} an hour) at Level 1 pay point 1 up to ${formatAUD(L8.weekly, 2)} a week (${formatAUD(L8.hourly, 2)} an hour) at Level 8 pay point 3. Rates apply from the first full pay period starting on or after ${SCHADS_AWARD.operativeFrom}, following the ${(SCHADS_AWARD.increase * 100).toFixed(2)}% Annual Wage Review increase in ${SCHADS_AWARD.decision}. All hourly rates are the weekly rate divided by ${SCHADS_AWARD.standardWeeklyHours} ordinary hours.`,
  },
  {
    q: "What is the SCHADS Level 4 pay rate?",
    a: `Level 4 pay point 1 in the social and community services stream is ${formatAUD(L4.weekly, 2)} a week, or ${formatAUD(L4.hourly, 2)} an hour. Be careful with this one: clause 15 of the award text lists ${formatAUD(CLAUSE_15_LEVEL_4, 2)} for the same classification. That is the pre-Equal Remuneration Order figure and it is not what you are owed. Equal Remuneration Order ${SCHADS_AWARD.eroReference} applies on top for Schedule B classifications, and the award's own note confirms the ERO rates form ordinary rates of pay for all purposes.`,
  },
  {
    q: "Why is my SCHADS pay rate higher than the award document says?",
    a: `Because of the Equal Remuneration Order. Social and community services and crisis accommodation classifications receive an ERO loading on top of the minimum weekly wage printed in clause 15 of the award. At Level 4 pay point 1 the difference is ${formatAUD(CLAUSE_15_LEVEL_4, 2)} against an operative ${formatAUD(L4.weekly, 2)} — the rate you are actually owed is ${((L4.weekly / CLAUSE_15_LEVEL_4 - 1) * 100).toFixed(0)}% higher than the figure printed in the clause, a gap of ${formatAUD(L4.weekly - CLAUSE_15_LEVEL_4, 2)} a week. Any SCHADS rate table that does not mention the ERO is quoting the wrong number.`,
  },
  {
    q: "Does the SCHADS award have junior rates?",
    a: "No. The SCHADS award contains no junior rates clause and no age-based percentage scale. The word 'junior' appears in the award only in transitional boilerplate. An employee under 21 covered by SCHADS is paid the full adult rate for their classification. If you have been shown a SCHADS junior percentage table, it is not from this award — check which award actually covers your role.",
  },
  {
    q: "Is there a separate SCHADS disability services pay rate?",
    a: "No. There is no standalone disability services pay stream. The old clause 17 was deleted in 2010. Disability support work now sits in one of two places: the social and community services stream in Schedule B, or the home care stream in Schedule E where the work is disability care delivered in the home. Which one applies depends on the work performed, not on the employer's name.",
  },
  {
    q: "What is the SCHADS casual rate?",
    a: `Casual employees receive a ${(SCHADS_AWARD.casualLoading * 100).toFixed(0)}% loading on the ordinary hourly rate. At Level 1 pay point 1 that makes ${formatAUD(L1.hourly, 2)} an hour become ${formatAUD(schadsCasualHourly(L1.hourly), 2)}, and at Level 4 pay point 1 ${formatAUD(L4.hourly, 2)} becomes ${formatAUD(schadsCasualHourly(L4.hourly), 2)}. Casual weekend and public holiday penalties are additive rather than compounded — casual Sunday is ${(SCHADS_PENALTIES.casualSunday * 100).toFixed(0)}% of the base rate, not ${(SCHADS_PENALTIES.sunday * 100).toFixed(0)}% multiplied by the loading.`,
  },
  {
    q: "What are the SCHADS penalty rates?",
    a: `For permanent employees: Saturday ${(SCHADS_PENALTIES.saturday * 100).toFixed(0)}%, Sunday ${(SCHADS_PENALTIES.sunday * 100).toFixed(0)}% and public holidays ${(SCHADS_PENALTIES.publicHoliday * 100).toFixed(0)}% of the ordinary rate. Afternoon shift attracts a ${(SCHADS_PENALTIES.afternoonShiftLoading * 100).toFixed(1)}% loading and night shift ${(SCHADS_PENALTIES.nightShiftLoading * 100).toFixed(0)}%. For casuals the equivalents are Saturday ${(SCHADS_PENALTIES.casualSaturday * 100).toFixed(0)}%, Sunday ${(SCHADS_PENALTIES.casualSunday * 100).toFixed(0)}% and public holiday ${(SCHADS_PENALTIES.casualPublicHoliday * 100).toFixed(0)}%. Weekend rates substitute for shift loadings rather than stacking on top of them, and public holiday pay replaces both.`,
  },
  {
    q: "How much is the SCHADS sleepover allowance?",
    a: `${formatAUD(SCHADS_ALLOWANCES.sleepover, 2)} per sleepover, set at 4.9% of the standard rate under clause 25.7(d). That payment covers the sleepover itself. If you are woken and required to work, those hours are paid separately at the applicable rate — the allowance does not buy the employer any working time.`,
  },
  {
    q: "What is the difference between the SACS stream and the home care stream?",
    a: `They are separate schedules with separate rates, and the gap is large. Social and community services (Schedule B) rates carry the Equal Remuneration Order, starting at ${formatAUD(L1.weekly, 2)} a week. Home care aged care (Schedule F) receives no ERO uplift and starts at ${formatAUD(AGED_ENTRY.weekly, 2)} a week at the introductory level. Home care disability care (Schedule E) is a third schedule again. Being classified in the wrong schedule is one of the more expensive errors in this award.`,
  },
  {
    q: "When did the new SCHADS rates start?",
    a: `${SCHADS_AWARD.effectiveNote} That distinction matters in July: if your pay period began before ${SCHADS_AWARD.operativeFrom}, the old rate lawfully applies to that whole period and the increase starts with your next one. The Fair Work Ombudsman published the updated pay guide on ${SCHADS_AWARD.payGuidePublished}, giving effect to determination ${SCHADS_AWARD.determination}.`,
  },
  {
    q: "Why is there such a jump from SCHADS Level 1 to Level 2?",
    a: `Because Level 1 receives no Equal Remuneration Order uplift and Level 2 does. Level 1 pay point 3 is ${formatAUD(L1_TOP.weekly, 2)} a week and Level 2 pay point 1 is ${formatAUD(L2.weekly, 2)} — a step of over ${formatAUD(L2.weekly - L1_TOP.weekly, 0)} a week between adjacent classifications. It looks like a typo and is not. It is the single largest reason getting your classification right is worth the argument.`,
  },
];
