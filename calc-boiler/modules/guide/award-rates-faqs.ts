// FAQ copy for /award-rates/, shared by the rendered accordion and the
// FAQPage JSON-LD in app/award-rates/page.tsx. Figures come from constants.

import { EMPLOYMENT, SITE_CONFIG, formatAUD } from "@/lib/constants";
import { AWR_2026_FLOORS, RETAIL_PENALTIES, RETAIL_RATES } from "@/lib/constants/hospitality-award";
import { AWARD_DIRECTORY } from "@/lib/constants/award-directory";
import { SECURITY_AWARD } from "@/lib/constants/modern-awards";

const low = Math.min(...AWARD_DIRECTORY.map((a) => a.headlineHourly));
const high = Math.max(...AWARD_DIRECTORY.map((a) => a.headlineHourly));

export const AWARD_HUB_FAQS: readonly { q: string; a: string }[] = [
  {
    q: `What are the award rates for ${SITE_CONFIG.financialYear}?`,
    a: `From the first full pay period on or after 1 July 2026, adult Level 1 rates in the major modern awards run from ${formatAUD(low, 2)} to ${formatAUD(high, 2)} an hour — for example ${AWARD_DIRECTORY.map((a) => `${a.name.replace(/ Award 20\d\d$/, "")} ${formatAUD(a.headlineHourly, 2)}`).slice(0, 4).join(", ")}. Higher classifications pay more, and casuals receive a 25% loading.`,
  },
  {
    q: "What is a modern award?",
    a: "A modern award is a legally binding instrument made by the Fair Work Commission that sets minimum pay rates, penalty rates, overtime, allowances and some leave and hours rules for employees in an industry or occupation. There are more than 120 modern awards.",
  },
  {
    q: "How often do award rates change?",
    a: `Once a year, after the Fair Work Commission's Annual Wage Review decided each June. New rates apply from the first full pay period starting on or after 1 July. The ${SITE_CONFIG.financialYear} increase was ${(AWR_2026_FLOORS.increase * 100).toFixed(2)}%, subject to floors of ${formatAUD(AWR_2026_FLOORS.ongoingWeekly, 2)} a week (ongoing) and ${formatAUD(AWR_2026_FLOORS.entryLevelWeekly, 2)} (entry level), so the lowest classifications in some awards were lifted to the floor instead.`,
  },
  {
    q: "What is the minimum wage in Australia?",
    a: `The national minimum wage for ${SITE_CONFIG.financialYear} is ${formatAUD(EMPLOYMENT.minimumWageHourly, 2)} an hour, or ${formatAUD(EMPLOYMENT.minimumWageWeekly, 2)} for a ${EMPLOYMENT.standardWeeklyHours}-hour week. It applies directly to employees not covered by an award or agreement; award-covered employees must be paid at least their award classification rate.`,
  },
  {
    q: "Do award rates differ by state?",
    a: "No. Modern award rates are set nationally and are the same in every state and territory for national system employees. State public sector employees and some others are covered by state instruments instead.",
  },
  {
    q: "How much is casual loading?",
    a: `25% on top of the minimum hourly rate in most awards. Retail Level 1 is ${formatAUD(RETAIL_RATES[0].hourly, 2)} an hour, so a casual receives ${formatAUD(Math.round(RETAIL_RATES[0].hourly * 125) / 100, 2)}. In most awards casual penalty rates add the loading rather than multiplying by it — casual Sunday in retail is ${Math.round(RETAIL_PENALTIES.casualSunday * 100)}%, not 150% x 1.25 — but the Manufacturing award compounds, applying penalties to the casual rate.`,
  },
  {
    q: "Do junior employees get lower award rates?",
    a: "In many awards, yes, as a percentage of the adult rate — but the scales differ. Hospitality reaches the adult rate at 20; retail, fast food, pharmacy and clerks at 21. The Security and SCHADS awards have no junior rates, so a young employee gets the full adult rate. From 1 December 2026 retail, fast food and pharmacy rates for 18–20 year olds with more than 6 months' service begin rising towards the adult rate.",
  },
  {
    q: "Are penalty rates the same in every award?",
    a: `No. Sunday is 150% in retail and hospitality but ${Math.round(SECURITY_AWARD.penalties.find((p) => p.label === "Sunday")!.fullTime * 100)}% in the security and clerks awards, and only 125% for a fast food Level 1 employee. Hospitality evening work is a flat cash amount per hour, and pharmacy rates change with the time of day. Always check your own award.`,
  },
  {
    q: "How do I find which award covers me?",
    a: "Use the Fair Work Ombudsman's Find My Award tool at calculate.fairwork.gov.au, or call the Fair Work Infoline on 13 13 94. Coverage depends on your employer's industry and the work you do, not your job title.",
  },
  {
    q: "Is superannuation included in award rates?",
    a: "No. The 12% superannuation guarantee is paid by the employer on top of award wages. From 1 July 2026 it must be paid with each pay rather than quarterly.",
  },
];
