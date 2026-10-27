// Shared FAQ copy for /construction-trades-pay/ — rendered by the page's
// accordion and turned into FAQPage JSON-LD in app/construction-trades-pay/
// page.tsx, so the structured data cannot drift from the page.

import { EMPLOYMENT, formatAUD } from "@/lib/constants";
import { INDUSTRY_ALLOWANCE } from "@/lib/data/job-pay-rates/building-construction-common";
import { BOILERMAKER } from "@/lib/data/job-pay-rates/boilermaker";
import { BRICKLAYER } from "@/lib/data/job-pay-rates/bricklayer";
import { CARPENTER } from "@/lib/data/job-pay-rates/carpenter";
import { CRANE_OPERATOR } from "@/lib/data/job-pay-rates/crane-operator";
import { ELECTRICIAN } from "@/lib/data/job-pay-rates/electrician";
import { FITTER_AND_TURNER } from "@/lib/data/job-pay-rates/fitter-and-turner";
import { PLUMBER } from "@/lib/data/job-pay-rates/plumber";
import type { MedianEarnings, Occupation } from "@/lib/data/job-pay-rates/types";
import type { FaqItem } from "@/lib/faq";

// Apprentice electrician minimums, Electrical, Electronic and Communications
// Contracting Award [MA000025] Schedule B.4.5 (completed Year 12, started on
// or after 1 Jan 2014), as transcribed in lib/data/job-pay-rates/apprentice-electrician.ts.
// The old table claimed 55/65/80/95% and $44k-$86k, which no award supports.
export const APPRENTICE_ELECTRICIAN = [
  { year: "Year 1", pct: 0.55, hourly: 17.97 },
  { year: "Year 2", pct: 0.65, hourly: 21.13 },
  { year: "Year 3", pct: 0.7, hourly: 22.71 },
  { year: "Year 4", pct: 0.82, hourly: 26.5 },
] as const;

const pctList = APPRENTICE_ELECTRICIAN.map((r) => `${Math.round(r.pct * 100)}%`);
const annual = (hourly: number) => formatAUD(hourly * EMPLOYMENT.hoursPerYear);

// Market medians, Jobs and Skills Australia occupation profiles (ABS Survey of
// Employee Earnings and Hours, May 2025), as held in lib/data/job-pay-rates.
// The old answers quoted $65K to $250K+ ranges with no source.
const median = (o: Occupation): MedianEarnings => {
  if (!o.median) throw new Error(`No JSA median for ${o.slug}`);
  return o.median;
};
const weekly = (o: Occupation) => formatAUD(median(o).medianWeekly);
const yearly = (o: Occupation) => formatAUD(median(o).medianWeekly * 52);
const title = (o: Occupation) => median(o).anzscoTitle.toLowerCase();
const TRADES_BY_MEDIAN = [ELECTRICIAN, PLUMBER, CARPENTER, BRICKLAYER, FITTER_AND_TURNER, BOILERMAKER].sort(
  (a, b) => median(b).medianWeekly - median(a).medianWeekly,
);

export const CONSTRUCTION_TRADES_FAQS: readonly FaqItem[] = [
  {
    q: "How much do tradies earn in Australia?",
    a: `Jobs and Skills Australia reports median full-time earnings of ${weekly(ELECTRICIAN)} a week for electricians (about ${yearly(ELECTRICIAN)} a year), ${weekly(PLUMBER)} for plumbers (${yearly(PLUMBER)}), ${weekly(CARPENTER)} for carpenters and joiners (${yearly(CARPENTER)}) and ${weekly(BOILERMAKER)} for structural steel and welding trades workers, which includes boilermakers (${yearly(BOILERMAKER)}). These figures are from the ABS Survey of Employee Earnings and Hours (May 2025) and cover full-time, non-managerial adult employees before tax. They include enterprise agreement and above-award pay, so they are market figures, not minimums.`,
  },
  {
    q: "How much do apprentices get paid?",
    a: `Apprentice wages are a percentage of the qualified trade rate that rises each year, and each award sets its own scale. Under the Electrical, Electronic and Communications Contracting Award, an apprentice electrician who completed Year 12 gets ${pctList.slice(0, -1).join(", ")} and ${pctList[pctList.length - 1]} of the qualified rate. That is about ${annual(APPRENTICE_ELECTRICIAN[0].hourly)} a year in Year 1, rising to ${annual(APPRENTICE_ELECTRICIAN[APPRENTICE_ELECTRICIAN.length - 1].hourly)} in Year 4 at the award minimum. Adult apprentices receive higher minimum rates.`,
  },
  {
    q: "What are the overtime rates in construction?",
    a: "Under the Building and Construction General On-site Award, overtime is time-and-a-half for the first 2 hours and double time thereafter on weekdays. Saturday is time-and-a-half for the first 2 hours then double time (and all Saturday work after 12 noon is double time). Sunday is double time for all hours. Public holidays are double time and a half (2.5x).",
  },
  {
    q: "What is a site allowance?",
    a: `A site allowance is paid to construction workers to compensate for the conditions of working on a construction site, including noise, dust, and lack of permanent amenities. Under the Building and Construction General On-site Award the industry allowance is ${formatAUD(INDUSTRY_ALLOWANCE.general, 2)} a week in general building and civil construction (${formatAUD(INDUSTRY_ALLOWANCE.residential, 2)} in residential building), paid for all purposes; enterprise agreement site allowances on major projects are often much higher.`,
  },
  {
    q: "Is the tool allowance taxable?",
    a: "Yes, the tool allowance is assessable income and included in your gross earnings for tax purposes. However, you can claim a deduction for the cost of tools you purchase for work. If an individual tool costs $300 or less, you can claim an immediate deduction. Tools costing more than $300 must be depreciated over their effective life.",
  },
  {
    q: "What is the highest-paid trade in Australia?",
    a: `Of the trades this site covers, ${title(TRADES_BY_MEDIAN[0])} have the highest Jobs and Skills Australia median: ${weekly(TRADES_BY_MEDIAN[0])} a week full-time, about ${yearly(TRADES_BY_MEDIAN[0])} a year. Next are ${title(TRADES_BY_MEDIAN[1])} (${weekly(TRADES_BY_MEDIAN[1])} a week) and ${title(TRADES_BY_MEDIAN[2])} (${weekly(TRADES_BY_MEDIAN[2])} a week). Crane, hoist and lift operators are not a trade, but their median is ${weekly(CRANE_OPERATOR)} a week (about ${yearly(CRANE_OPERATOR)} a year). These are market medians from the ABS Survey of Employee Earnings and Hours (May 2025), not award minimums.`,
  },
];
