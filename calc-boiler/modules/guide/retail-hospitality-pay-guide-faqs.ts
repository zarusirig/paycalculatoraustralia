// Shared FAQ copy for /retail-hospitality-pay-guide/ — rendered by the page's
// accordion and turned into FAQPage JSON-LD in
// app/retail-hospitality-pay-guide/page.tsx. Rates and multipliers come from
// lib/constants/hospitality-award.ts (FWC pay guides, 1 July 2026).

import { formatAUD } from "@/lib/constants";
import {
  HOSPITALITY_AWARD,
  HOSPITALITY_JUNIOR_SCALE,
  HOSPITALITY_PENALTIES,
  RETAIL_AWARD,
  RETAIL_JUNIOR_SCALE,
  RETAIL_PENALTIES,
  RETAIL_RATES,
} from "@/lib/constants/hospitality-award";
import { JUNIOR_PHASE_IN } from "@/lib/constants/modern-awards";
import type { FaqItem } from "@/lib/faq";

const pct = (r: number) => `${Math.round(r * 1000) / 10}%`;
const hr = (n: number) => `${formatAUD(n, 2)}/hr`;
const L1 = RETAIL_RATES[0].hourly;
const CASUAL = RETAIL_AWARD.casualLoading;
const L1_CASUAL = L1 * (1 + CASUAL);

const scale = (s: readonly { age: string; percentage: number }[]) =>
  s.filter((b) => b.percentage < 1).map((b) => `${pct(b.percentage)} (${b.age.toLowerCase().replace(/ \((.*)\)/, ", $1")})`).join(", ");
const HOSP_ADULT_AGE = HOSPITALITY_JUNIOR_SCALE.find((b) => b.percentage === 1)?.age ?? "20 and over";

export const RETAIL_HOSPITALITY_FAQS: readonly FaqItem[] = [
  {
    q: "What is the casual loading rate?",
    a: `Casual employees under both the ${RETAIL_AWARD.name} and the ${HOSPITALITY_AWARD.name} receive a ${pct(CASUAL)} loading on top of the base hourly rate. This loading compensates for the lack of paid annual leave, personal leave, notice of termination, and redundancy pay. A Level 1 retail casual earns ${hr(L1_CASUAL)} compared to ${hr(L1)} for a full-time employee.`,
  },
  {
    q: "What are the weekend penalty rates in retail?",
    a: `Under the ${RETAIL_AWARD.name}, full-time and part-time employees are paid ${pct(RETAIL_PENALTIES.saturday)} of the base rate on Saturdays and ${pct(RETAIL_PENALTIES.sunday)} on Sundays, so a Level 1 worker on ${hr(L1)} earns ${hr(L1 * RETAIL_PENALTIES.saturday)} on Saturday and ${hr(L1 * RETAIL_PENALTIES.sunday)} on Sunday. Casuals get ${pct(RETAIL_PENALTIES.casualSaturday)} on Saturday and ${pct(RETAIL_PENALTIES.casualSunday)} on Sunday: the penalty and the ${pct(CASUAL)} casual loading are added together, not compounded, so a Level 1 casual earns ${hr(L1 * RETAIL_PENALTIES.casualSunday)} on a Sunday.`,
  },
  {
    q: "What is the minimum shift length?",
    a: "Under the General Retail Industry Award, casual and part-time employees must be engaged for at least 3 hours per shift (a school student can be engaged for 1.5 hours in limited circumstances). Under the Hospitality Industry Award the casual minimum engagement is 2 hours. If you are sent home early, you must still be paid for the minimum engagement period.",
  },
  {
    q: "Can I convert from casual to permanent?",
    a: "Yes. Since 26 August 2024, casual conversion works through the \"employee choice\" pathway in the Fair Work Act. A casual who has worked for at least 6 months (12 months with a small business employer of fewer than 15 employees) and believes they no longer meet the definition of a casual employee can notify their employer in writing that they want to change to full-time or part-time employment. The employer must respond in writing within 21 days and can refuse only on limited grounds. Employers are no longer required to offer conversion themselves.",
  },
  {
    q: "Do workers under 21 get paid less?",
    a: `Yes, but the two awards use different junior scales, each a percentage of the adult rate. Retail: ${scale(RETAIL_JUNIOR_SCALE)}; full adult rates apply from 21, or from 20 after more than 6 months with the employer. Hospitality: ${scale(HOSPITALITY_JUNIOR_SCALE)}; full adult rates apply from age ${HOSP_ADULT_AGE.replace(" and over", "")}. Hospitality juniors working as liquor service employees must be paid the adult rate. From ${JUNIOR_PHASE_IN.commences}, retail 18 and 19-year-olds with more than 6 months' service start moving towards the adult rate in stages under ${JUNIOR_PHASE_IN.principalDecision}.`,
  },
  {
    q: "What is the public holiday pay rate?",
    a: `Under the retail award, full-time and part-time employees working on a public holiday receive ${pct(RETAIL_PENALTIES.publicHoliday)} of the base rate, so a Level 1 retail worker on ${hr(L1)} receives ${hr(L1 * RETAIL_PENALTIES.publicHoliday)}. Casual employees receive ${pct(RETAIL_PENALTIES.casualPublicHoliday)}. The hospitality award uses the same rates (${pct(HOSPITALITY_PENALTIES.publicHoliday)} full-time and part-time, ${pct(HOSPITALITY_PENALTIES.casualPublicHoliday)} casual). Full-time employees who don't work on the public holiday are entitled to their ordinary pay for the day.`,
  },
];
