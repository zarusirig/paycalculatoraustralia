// Shared FAQ copy for /retail-award-rates/.
//
// Read by both the rendered accordion and the FAQPage JSON-LD in
// app/retail-award-rates/page.tsx so the structured data cannot drift from the
// visible page. Every figure is interpolated from
// lib/constants/hospitality-award.ts, which carries both awards.

import { formatAUD } from "@/lib/constants";
import {
  AWR_2026_FLOORS,
  RETAIL_AWARD,
  RETAIL_JUNIOR_LEVEL_RESTRICTION,
  RETAIL_JUNIOR_SCALE,
  RETAIL_OVERTIME,
  RETAIL_PENALTIES,
  RETAIL_RATES,
} from "@/lib/constants/hospitality-award";
import { casualHourly, findRate } from "@/modules/guide/hospitality-award-faqs";

const L1 = findRate(RETAIL_RATES, "Level 1");
const L4 = findRate(RETAIL_RATES, "Level 4");
const L8 = findRate(RETAIL_RATES, "Level 8");

const LOADING = RETAIL_AWARD.casualLoading;
const pct = (v: number) => `${(v * 100).toFixed((v * 100) % 1 === 0 ? 0 : 1)}%`;

const STANDARD_HOURS = 38;
const AGE_16 = RETAIL_JUNIOR_SCALE.find((b) => b.age === "16")!;
const cents = (v: number) => Math.round(v * 100 + Number.EPSILON) / 100;

// Junior figures derive from the WEEKLY rate then divide by standard hours —
// the order that reproduces Fair Work's published dollars. Applying the
// percentage to the hourly rate instead lands a cent out at several bands.
const AGE_16_WEEKLY = cents(L1.weekly * AGE_16.percentage);
const AGE_16_HOURLY = cents((L1.weekly * AGE_16.percentage) / STANDARD_HOURS);

export interface RetailFaq {
  q: string;
  a: string;
}

export const RETAIL_FAQS: readonly RetailFaq[] = [
  {
    q: "What are the retail award rates for 2026-27?",
    a: `Under the ${RETAIL_AWARD.name} (${RETAIL_AWARD.code}), adult rates run from ${formatAUD(L1.hourly, 2)} an hour (${formatAUD(L1.weekly, 2)} a week) at retail employee level 1 to ${formatAUD(L8.hourly, 2)} an hour (${formatAUD(L8.weekly, 2)} a week) at level 8. Most shop assistants are level 1. Rates apply from the first full pay period starting on or after ${RETAIL_AWARD.operativeFrom}.`,
  },
  {
    q: "What is the casual retail rate?",
    a: `Casuals receive a ${pct(LOADING)} loading, making level 1 ${formatAUD(casualHourly(L1.hourly, LOADING), 2)} an hour and level 4 ${formatAUD(casualHourly(L4.hourly, LOADING), 2)}. Casual weekend and public holiday penalties are additive rather than compounded — casual Sunday is ${pct(RETAIL_PENALTIES.casualSunday)} of the base rate, being ${pct(RETAIL_PENALTIES.sunday)} plus the ${pct(LOADING)} loading, not ${pct(RETAIL_PENALTIES.sunday)} multiplied by the loading.`,
  },
  {
    q: "What are the retail penalty rates?",
    a: `For permanent employees: after 6pm Monday to Friday ${pct(RETAIL_PENALTIES.eveningAfter6pm)}, Saturday ${pct(RETAIL_PENALTIES.saturday)}, Sunday ${pct(RETAIL_PENALTIES.sunday)} and public holidays ${pct(RETAIL_PENALTIES.publicHoliday)}. For casuals the same four are ${pct(RETAIL_PENALTIES.casualEveningAfter6pm)}, ${pct(RETAIL_PENALTIES.casualSaturday)}, ${pct(RETAIL_PENALTIES.casualSunday)} and ${pct(RETAIL_PENALTIES.casualPublicHoliday)}. These are the rates for non-shiftworkers — employees specifically engaged to work shifts are covered by a separate part of the award.`,
  },
  {
    q: "Do retail casuals get the casual loading on overtime?",
    a: `Yes — and this is where retail differs from hospitality. The award's own note to the overtime table says the casual overtime rates were calculated by adding the casual loading to the full-time rates. So casual overtime for the first three hours is ${pct(RETAIL_OVERTIME.casualWeekdayFirst3Hours)} against ${pct(RETAIL_OVERTIME.weekdayFirst3Hours)} for a permanent employee. In the Hospitality Industry (General) Award the loading is excluded from overtime entirely, so casual and full-time overtime dollars are identical there. One payroll rule cannot serve both awards.`,
  },
  {
    q: "What is the retail overtime rate?",
    a: `${pct(RETAIL_OVERTIME.weekdayFirst3Hours)} for the first three hours and ${pct(RETAIL_OVERTIME.weekdayAfter3Hours)} after that — and note the band is Monday to Saturday, not Monday to Friday. Sunday overtime is ${pct(RETAIL_OVERTIME.sunday)} and public holiday overtime is ${pct(RETAIL_OVERTIME.publicHoliday)}. For casuals each of those becomes ${pct(RETAIL_OVERTIME.casualWeekdayFirst3Hours)}, ${pct(RETAIL_OVERTIME.casualWeekdayAfter3Hours)}, ${pct(RETAIL_OVERTIME.casualSunday)} and ${pct(RETAIL_OVERTIME.casualPublicHoliday)}.`,
  },
  {
    q: "What are the junior rates in the retail award?",
    a: `As a percentage of the adult rate: ${RETAIL_JUNIOR_SCALE.map((b) => `${b.age} — ${pct(b.percentage)}`).join(", ")}. Two features are unusual. The 20-year-old band splits on length of service, so a 20-year-old reaches the full adult rate after more than six months with the same employer. And ${RETAIL_JUNIOR_LEVEL_RESTRICTION.charAt(0).toLowerCase() + RETAIL_JUNIOR_LEVEL_RESTRICTION.slice(1)}`,
  },
  {
    q: "What is the minimum wage for a 16 year old in retail?",
    a: `A 16-year-old retail employee at level 1 receives ${pct(AGE_16.percentage)} of the adult rate. On the level 1 rate of ${formatAUD(L1.weekly, 2)} a week that works out to ${formatAUD(AGE_16_WEEKLY, 2)} a week, or ${formatAUD(AGE_16_HOURLY, 2)} an hour before the casual loading. Note this differs from the Fast Food Industry Award, which pays a different percentage at under-16, and from the National Minimum Wage junior scale that applies to employees covered by no award at all.`,
  },
  {
    q: "Is the retail evening rate a percentage or a flat amount?",
    a: `A percentage. Retail pays ${pct(RETAIL_PENALTIES.eveningAfter6pm)} for ordinary hours after 6pm Monday to Friday, and ${pct(RETAIL_PENALTIES.casualEveningAfter6pm)} for casuals. This is worth stating because the Hospitality Industry (General) Award does the opposite — it adds a flat cash amount per hour for evening and night work rather than a multiplier. Applying one award's method to the other is a common payroll error in venues that run both a shop and a food business.`,
  },
  {
    q: "Was the 4.75% increase applied to every retail rate?",
    a: `The ${(AWR_2026_FLOORS.increase * 100).toFixed(2)}% Annual Wage Review increase was subject to two floors — ${formatAUD(AWR_2026_FLOORS.ongoingWeekly, 2)} a week for ongoing employment and ${formatAUD(AWR_2026_FLOORS.entryLevelWeekly, 2)} for an entry-level rate in the first six months. Retail level 1 at ${formatAUD(L1.weekly, 2)} already sits above the ongoing floor, so it took the full increase. But do not assume that holds for every award: in hospitality the two lowest classifications were lifted to the floor instead, so inflating last year's figures gives wrong answers there.`,
  },
  {
    q: "When did the new retail rates take effect?",
    a: `From the first full pay period starting on or after ${RETAIL_AWARD.operativeFrom} — not universally 1 July. If your pay period began before that date, the previous rate lawfully applies to the whole of it and the increase starts with your next one. That is the most common reason a July payslip looks wrong when it is not.`,
  },
];
