// Retail worker — General Retail Industry Award 2020 [MA000004] (T5, wave 3).
//
// Rates, penalties, overtime and allowances are READ FROM
// lib/constants/hospitality-award.ts (RETAIL_RATES, RETAIL_PENALTIES,
// RETAIL_OVERTIME, RETAIL_ALLOWANCES), the same constants the
// /retail-award-rates/ page uses. Re-checked against the consolidated award
// ("incorporates all amendments up to and including 1 July 2026 (PR799280,
// PR799285 …)") on 23 September 2026: cl 17.1 Table 4, cl 22.1 Table 12 and
// cl 21.2(c) Table 11 match.
//
// Classifications: Schedule A.1–A.4 (indicative job titles quoted below).
//
// Median: Jobs and Skills Australia, ANZSCO 6211 Sales Assistants (General),
// $1,241 a week / $32 an hour (ABS SEEH May 2025), read 23 September 2026.

import {
  RETAIL_ALLOWANCES,
  RETAIL_AWARD,
  RETAIL_OVERTIME,
  RETAIL_PENALTIES,
  RETAIL_RATES,
} from "../../constants/hospitality-award";
import {
  ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  ANNUAL_WAGE_REVIEW_2026,
  CONSOLIDATED_TO,
  FWO_PAY_GUIDES,
  JOB_PAY_VERIFIED_ON,
  awardTextUrl,
  casualFromHourly,
  jsaSource,
  jsaUrl,
} from "./common";
import type { MedianEarnings, Occupation, RateRow } from "./types";

const MEDIAN: MedianEarnings = {
  anzscoCode: "6211",
  anzscoTitle: "Sales Assistants (General)",
  medianWeekly: 1_241,
  medianHourly: 32,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("6211-sales-assistants-general"),
};

const NOTES: Record<string, string> = {
  "Level 1": "Shop assistant, checkout operator, store worker, trolley collector",
  "Level 2": "Forklift or ride-on equipment operator",
  "Level 3": "Senior salesperson, second-in-charge of a department",
  "Level 4": "Department manager (up to 2 staff), trade-qualified butcher, baker or florist",
};

/** Retail Employee Levels 1–8, from the shared retail constants. */
export function retailRow(level: string, note?: string): RateRow {
  const r = RETAIL_RATES.find((x) => x.level === level);
  if (!r) throw new Error(`retail-worker: no ${level}`);
  return { label: `Retail Employee ${level}`, weekly: r.weekly, hourly: r.hourly, casualHourly: casualFromHourly(r.hourly), ...(note ? { note } : {}) };
}

const pct = (x: number) => `${Math.round(x * 1000) / 10}%`;
const money = (x: number) => `$${x.toFixed(2)}`;

export const RETAIL_WORKER: Occupation = {
  slug: "retail-worker",
  name: "Retail Worker",
  plural: "retail workers",
  award: {
    name: RETAIL_AWARD.name,
    code: RETAIL_AWARD.code,
    url: awardTextUrl(RETAIL_AWARD.code),
    consolidatedTo: CONSOLIDATED_TO,
    awardPageHref: "/retail-award-rates/",
  },
  headline: {
    tableId: "retail",
    label: "Retail Employee Level 1",
    why: "a shop assistant or checkout operator — the award's own indicative Level 1 job titles",
  },
  coverage: [
    "Retail workers in shops, supermarkets, department stores and other retail businesses are covered by the General Retail Industry Award 2020 [MA000004], unless the business is covered by a more specific award — pharmacies (Pharmacy Award), fast food outlets (Fast Food Award), and motor vehicle retailing (Vehicle Repair, Services and Retail Award) have their own.",
    "Most shop assistants, checkout operators, store workers, trolley collectors and merchandisers are Retail Employee Level 1 (Schedule A.1.3). Forklift and ride-on equipment operators are Level 2. Senior salespeople and second-in-charge of a department are Level 3, and a department manager with up to 2 staff, a shift or nightfill supervisor, or a butcher, baker or florist using a trade qualification is Level 4.",
    "Large supermarket and department store chains usually pay under an enterprise agreement. The employer pages linked on this site set out what Coles, Woolworths, Kmart and Bunnings agreements pay.",
  ],
  tables: [
    {
      id: "retail",
      title: "Retail worker pay rates by level, 2026–27",
      intro:
        "General Retail Industry Award cl 17.1, Table 4, from the first full pay period on or after 1 July 2026. Casual is the hourly rate plus the 25% casual loading (cl 11.1).",
      rows: RETAIL_RATES.map((r) => retailRow(r.level, NOTES[r.level])),
    },
  ],
  penalties: [
    { when: "Monday–Friday after 6 pm", permanent: pct(RETAIL_PENALTIES.eveningAfter6pm), casual: pct(RETAIL_PENALTIES.casualEveningAfter6pm) },
    { when: "Saturday", permanent: pct(RETAIL_PENALTIES.saturday), casual: pct(RETAIL_PENALTIES.casualSaturday) },
    { when: "Sunday", permanent: pct(RETAIL_PENALTIES.sunday), casual: pct(RETAIL_PENALTIES.casualSunday) },
    { when: "Public holiday", permanent: pct(RETAIL_PENALTIES.publicHoliday), casual: pct(RETAIL_PENALTIES.casualPublicHoliday) },
  ],
  penaltiesNote:
    "Percentages of the minimum hourly rate for ordinary hours (cl 22.1, Table 12). Casual percentages include the 25% casual loading. Shiftworkers have separate rates that are not shown here.",
  overtime: [
    `Full-time and part-time: ${pct(RETAIL_OVERTIME.weekdayFirst3Hours)} for the first 3 hours Monday to Saturday, then ${pct(RETAIL_OVERTIME.weekdayAfter3Hours)}; Sunday ${pct(RETAIL_OVERTIME.sunday)}; public holiday ${pct(RETAIL_OVERTIME.publicHoliday)} (cl 21.2(c), Table 11).`,
    `Casual: ${pct(RETAIL_OVERTIME.casualWeekdayFirst3Hours)} for the first 3 hours Monday to Saturday, then ${pct(RETAIL_OVERTIME.casualWeekdayAfter3Hours)}; Sunday ${pct(RETAIL_OVERTIME.casualSunday)}; public holiday ${pct(RETAIL_OVERTIME.casualPublicHoliday)} — the casual loading is included.`,
  ],
  allowances: RETAIL_ALLOWANCES.filter((a) => /Meal allowance \(|Laundry of special clothing — full-time|First aid|Liquor licence|Motor vehicle/.test(a.name)).map((a) => ({
    name: a.name,
    amount: `${money(a.amount)} ${a.unit}`,
    note: `${a.note ? `${a.note} ` : ""}(${a.clause})`,
  })),
  median: MEDIAN,
  notices: [
    "Junior rates apply only to Retail Employee Levels 1 to 3 (cl 17.2), and the percentages for 18- and 19-year-olds with more than 6 months with their employer rise in steps from the first full pay period on or after 1 December 2026 ([2026] FWCFB 75; determination PR813655). See the junior pay rates page for the schedule.",
  ],
  notShown: [
    "Junior percentages and the phase-in schedule — see the junior pay rates page.",
    "Shiftworker penalty rates and baking production early-morning rates.",
    "Retail Employee Levels 5 to 8 duty definitions (Schedule A.5–A.8).",
  ],
  faqs: [
    {
      q: "What is the award rate for a retail worker in 2026?",
      a: "A shop assistant or checkout operator (Retail Employee Level 1) must be paid at least $27.81 an hour, or $1,056.80 a week, under the General Retail Industry Award from the first full pay period on or after 1 July 2026 — $54,954 a year full-time before tax.",
    },
    {
      q: "What is the casual rate for a retail worker?",
      a: "A casual Level 1 retail worker earns at least $34.76 an hour on weekdays before 6 pm, the $27.81 rate plus the 25% casual loading. Casuals get 150% after 6 pm on weekdays and on Saturday ($41.72), 175% on Sunday ($48.67) and 250% on public holidays ($69.53).",
    },
    {
      q: "How much do retail workers get paid on a Sunday?",
      a: "Full-time and part-time retail workers get 150% of the minimum hourly rate on Sunday — $41.72 an hour at Level 1. Casuals get 175%, $48.67 an hour.",
    },
    {
      q: "Do supermarket workers get the retail award rate?",
      a: "The award is the legal minimum. Coles, Woolworths and other large chains pay under enterprise agreements, which must leave employees better off overall than the award. See the employer pay pages for their agreement rates.",
    },
    {
      q: "What do retail workers actually earn?",
      a: "Jobs and Skills Australia reports median full-time earnings of $1,241 a week for general sales assistants (ABS Survey of Employee Earnings and Hours, May 2025), about $64,532 a year.",
    },
  ],
  sources: [
    { title: "General Retail Industry Award 2020 [MA000004] — consolidated to 1 July 2026", publisher: "Fair Work Commission", url: awardTextUrl(RETAIL_AWARD.code) },
    FWO_PAY_GUIDES,
    ANNUAL_WAGE_REVIEW_2026,
    jsaSource(MEDIAN),
  ],
  verifiedOn: JOB_PAY_VERIFIED_ON,
  related: [
    { href: "/retail-award-rates/", label: "Retail Award Pay Rates" },
    { href: "/pay-rates/", label: "Employer Pay Rates" },
    { href: "/junior-pay-rates/", label: "Junior Pay Rates" },
    { href: "/retail-hospitality-pay-guide/", label: "Retail & Hospitality Pay Guide" },
  ],
};
