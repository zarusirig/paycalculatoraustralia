// Shared FAQ copy for /hospitality-award-rates/.
//
// Read by both the rendered accordion and the FAQPage JSON-LD in
// app/hospitality-award-rates/page.tsx so the structured data cannot drift
// from the visible page.
//
// Every figure is interpolated from lib/constants/hospitality-award.ts.

import { formatAUD } from "@/lib/constants";
import {
  AWR_2026_FLOORS,
  HOSPITALITY_AWARD,
  HOSPITALITY_JUNIOR_SCALE,
  HOSPITALITY_OVERTIME,
  HOSPITALITY_PENALTIES,
  HOSPITALITY_RATES,
  type AwardRate,
} from "@/lib/constants/hospitality-award";

export function findRate(rows: readonly AwardRate[], level: string): AwardRate {
  const found = rows.find((r) => r.level === level);
  if (!found) throw new Error(`unknown award level: ${level}`);
  return found;
}

/** Round half up to the cent, matching how Fair Work publishes derived rates. */
export function toCents(value: number): number {
  return Math.round(value * 100 + Number.EPSILON) / 100;
}

export function casualHourly(hourly: number, loading: number): number {
  return toCents(hourly * (1 + loading));
}

const INTRO = findRate(HOSPITALITY_RATES, "Introductory");
const L1 = findRate(HOSPITALITY_RATES, "Level 1");
const L4 = findRate(HOSPITALITY_RATES, "Level 4");
const L6 = findRate(HOSPITALITY_RATES, "Level 6");

const pct = (v: number) => `${(v * 100).toFixed((v * 100) % 1 === 0 ? 0 : 1)}%`;
const age19 = HOSPITALITY_JUNIOR_SCALE.find((b) => b.age === "19")!;

export interface HospitalityFaq {
  q: string;
  a: string;
}

export const HOSPITALITY_FAQS: readonly HospitalityFaq[] = [
  {
    q: "What are the hospitality award rates for 2026-27?",
    a: `Under the ${HOSPITALITY_AWARD.name} (${HOSPITALITY_AWARD.code}), adult rates run from ${formatAUD(INTRO.hourly, 2)} an hour (${formatAUD(INTRO.weekly, 2)} a week) at the introductory level to ${formatAUD(L6.hourly, 2)} an hour (${formatAUD(L6.weekly, 2)} a week) at Level 6. Level 1, the standard entry classification, is ${formatAUD(L1.hourly, 2)} an hour. Rates apply from the first full pay period starting on or after ${HOSPITALITY_AWARD.operativeFrom}.`,
  },
  {
    q: "What is the hospitality casual rate?",
    a: `Casuals receive a ${pct(HOSPITALITY_AWARD.casualLoading)} loading, so Level 1 becomes ${formatAUD(casualHourly(L1.hourly, HOSPITALITY_AWARD.casualLoading), 2)} an hour and Level 4 becomes ${formatAUD(casualHourly(L4.hourly, HOSPITALITY_AWARD.casualLoading), 2)}. Weekend and public holiday penalties for casuals are additive rather than compounded — casual Sunday is ${pct(HOSPITALITY_PENALTIES.casualSunday)} of the base rate, being the ${pct(HOSPITALITY_PENALTIES.sunday)} Sunday rate plus the ${pct(HOSPITALITY_AWARD.casualLoading)} loading, not ${pct(HOSPITALITY_PENALTIES.sunday)} multiplied by the loading.`,
  },
  {
    q: "What are the hospitality penalty rates?",
    a: `For permanent employees: Saturday ${pct(HOSPITALITY_PENALTIES.saturday)}, Sunday ${pct(HOSPITALITY_PENALTIES.sunday)} and public holidays ${pct(HOSPITALITY_PENALTIES.publicHoliday)} of the ordinary rate. For casuals: Saturday ${pct(HOSPITALITY_PENALTIES.casualSaturday)}, Sunday ${pct(HOSPITALITY_PENALTIES.casualSunday)} and public holidays ${pct(HOSPITALITY_PENALTIES.casualPublicHoliday)}. Evening and night work are handled differently — see the next question. Where more than one penalty could apply to the same hours, only the highest is paid.`,
  },
  {
    q: "How do hospitality evening and night rates work?",
    a: `They are flat cash amounts per hour, not percentage multipliers — this is where most hospitality pay calculators get it wrong. You are paid your ordinary rate plus ${formatAUD(HOSPITALITY_PENALTIES.eveningPerHour, 2)} an hour for evening work, or plus ${formatAUD(HOSPITALITY_PENALTIES.nightPerHour, 2)} an hour for night work. On the Level 1 rate of ${formatAUD(L1.hourly, 2)}, an evening hour is ${formatAUD(L1.hourly + HOSPITALITY_PENALTIES.eveningPerHour, 2)} and a night hour is ${formatAUD(L1.hourly + HOSPITALITY_PENALTIES.nightPerHour, 2)}. Because the amount is fixed, it is worth proportionally more on lower classifications. Retail works the opposite way, using a percentage.`,
  },
  {
    q: "Do casuals get the casual loading on overtime in hospitality?",
    a: `No. In hospitality the overtime clause operates on the "ordinary hourly rate", and the award's definitions clause excludes the casual loading from that term. The practical result is that a casual and a full-time employee on the same classification are paid identical overtime dollars. This is the opposite of the General Retail Industry Award, where the loading is included and casual overtime is ${pct(1.75)} against ${pct(1.5)} for permanents. One payroll rule cannot serve both awards.`,
  },
  {
    q: "What is the hospitality overtime rate?",
    a: `${pct(HOSPITALITY_OVERTIME.weekdayFirst2Hours)} for the first two hours on a normal day and ${pct(HOSPITALITY_OVERTIME.weekdayAfter2Hours)} after that. Overtime worked on a weekend is ${pct(HOSPITALITY_OVERTIME.weekend)}, as is overtime on a rostered day off. These percentages apply to the ordinary hourly rate, which for casuals excludes the ${pct(HOSPITALITY_AWARD.casualLoading)} loading.`,
  },
  {
    q: "What are the junior rates in the hospitality award?",
    a: `Junior rates are a percentage of the adult rate for the classification: ${HOSPITALITY_JUNIOR_SCALE.map((b) => `${b.age} — ${pct(b.percentage)}`).join(", ")}. Note that 19-year-olds receive ${pct(age19.percentage)} in hospitality where the retail award pays 80%, and that hospitality reaches the full adult rate at 20 rather than 21. Junior office employees are on a different scale again. Juniors with a trade qualification, and any junior working as a liquor service employee, must be paid the full adult rate regardless of age.`,
  },
  {
    q: "Is there a food and beverage attendant grade 5?",
    a: "No. The food and beverage stream runs grades 1 to 4 only. Level 5 in the pay table is 'food and beverage supervisor', which is a different classification, not a fifth grade of attendant. Any rate table showing a food and beverage attendant grade 5 has invented a classification that does not exist in the award.",
  },
  {
    q: "Was the 4.75% increase applied to every hospitality rate?",
    a: `No, and this is the trap in working out this year's rates. The ${(AWR_2026_FLOORS.increase * 100).toFixed(2)}% Annual Wage Review increase was subject to two floors: ${formatAUD(AWR_2026_FLOORS.ongoingWeekly, 2)} a week for ongoing employment and ${formatAUD(AWR_2026_FLOORS.entryLevelWeekly, 2)} for an entry-level rate applying in the first six months. The hospitality introductory rate and Level 1 sit exactly on those two floors — they were lifted to the floor, not escalated by ${(AWR_2026_FLOORS.increase * 100).toFixed(2)}%. Calculating this year's figures by inflating last year's gives the wrong numbers for those classifications.`,
  },
  {
    q: "What is a cook paid under the hospitality award?",
    a: `It depends on the grade. A cook grade 1 sits at Level 2, grade 2 at Level 3, a tradesperson cook grade 3 at Level 4 (${formatAUD(L4.hourly, 2)} an hour), grade 4 at Level 5 and grade 5 at Level 6 (${formatAUD(L6.hourly, 2)} an hour). The word "chef" does not appear as a classification — what matters is the grade in the award's classification structure, and whether the role is a trade-qualified one.`,
  },
  {
    q: "When did the new hospitality rates take effect?",
    a: `${HOSPITALITY_AWARD.effectiveNote} That is not universally 1 July. If your pay period began before ${HOSPITALITY_AWARD.operativeFrom}, the previous rate lawfully applies to that whole period and the increase starts with your next one — the most common reason a July payslip looks wrong when it is not. The award was varied by determination ${HOSPITALITY_AWARD.determination}, and the Fair Work Ombudsman published the updated pay guide on ${HOSPITALITY_AWARD.payGuidePublished}.`,
  },
];
