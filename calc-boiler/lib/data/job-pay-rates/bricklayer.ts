// Bricklayer — Building and Construction General On-site Award 2020 [MA000020]
// (J8, 9 Oct 2026). Search demand: "bricklayer salary" 720 a month (AU).
// See building-construction-common.ts for the all-purpose allowance rule.
//
// Award text re-read 9 October 2026 (awards.fairwork.gov.au/MA000020.html,
// "incorporates all amendments up to and including 1 July 2026 (PR799301 …)"):
//   - Schedule A, CW/ECW3 (d): "The CW/ECW3 classification incorporates the
//     following broadbanded award classifications: … Bricklayer …".
//   - Schedule A, CW/ECW5 (d) lists "Refractory bricklayer".
//   - cl 21.1(a) (varied by PR799458 ppc 01Jul26): tool allowance "Refractory
//     bricklayer or bricklayer | 29.26" per week, "paid for all purposes".
//   - cl 19.1(a): CW3 $1,119.10, CW5 $1,189.60. cl 22.1: industry allowance
//     $67.15 (general building, civil, metal and engineering construction) or
//     $53.72 (residential), all purposes (cl 22.3).
//   - cl 19.3(a): daily hire hourly = (sum x 52/50.4, to the cent) / 38.
//   - cl 12.3: casuals are paid for at least 4 hours per engagement.
//   - cl 23.10(b)(i): computing quantities allowance $6.86 per day.
//   - cl 24.7: time lost to inclement weather paid at the ordinary hourly rate,
//     up to 32 hours in any 4-week period.
//   - cl 25.3(a)(i): living away from home, the greater of $102.92 a day or full
//     reimbursement of reasonable accommodation and meal expenses.
//
// Median: Jobs and Skills Australia, ANZSCO 3311 Bricklayers and Stonemasons,
// $2,317 a week / $53 an hour (ABS SEEH May 2025), read 9 October 2026.

import {
  BUILDING_AWARD,
  BUILDING_BASE_WEEKLY,
  BUILDING_OVERTIME,
  BUILDING_PENALTIES,
  BUILDING_PENALTIES_NOTE,
  BUILDING_SOURCE_TITLE,
  INDUSTRY_ALLOWANCE,
  MULTISTOREY_ALLOWANCE,
  buildingRow,
  dailyHireHourly,
} from "./building-construction-common";
import { ALL_OCCUPATIONS_MEDIAN_WEEKLY, ANNUAL_WAGE_REVIEW_2026, FWO_PAY_GUIDES, jsaSource, jsaUrl, toCents } from "./common";
import { annual52, money0, money2 } from "./j8-common";
import type { MedianEarnings, Occupation, RateRow } from "./types";

/** cl 21.1(a) tool allowance for a bricklayer or refractory bricklayer, per week, all purposes. */
export const BRICKLAYER_TOOL_ALLOWANCE = 29.26;

const BRICKLAYER_MEDIAN: MedianEarnings = {
  anzscoCode: "3311",
  anzscoTitle: "Bricklayers and Stonemasons",
  medianWeekly: 2_317,
  medianHourly: 53,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("3311-bricklayers-and-stonemasons"),
};

const { general, residential } = INDUSTRY_ALLOWANCE;
const tool = BRICKLAYER_TOOL_ALLOWANCE;

export const BRICK_RESIDENTIAL = buildingRow("Bricklayer (CW3) — residential building", "CW/ECW 3", [residential, tool], "Single or dual occupancy homes");
export const BRICK_GENERAL = buildingRow("Bricklayer (CW3) — general building and construction", "CW/ECW 3", [general, tool], "Commercial, multi-unit and civil work");
export const BRICK_REFRACTORY = buildingRow("Refractory bricklayer (CW5) — general building", "CW/ECW 5", [general, tool], "Refractory brickwork");

/** A daily hire row: the weekly-hire sum loaded by 52/50.4 (cl 19.3(a)). No casual daily hire rate exists. */
function dailyHireRow(label: string, weeklySum: number, note: string): RateRow {
  const loaded = toCents((weeklySum * 52) / 50.4);
  return { label, weekly: loaded, hourly: dailyHireHourly(weeklySum), casualHourly: null, note };
}

export const BRICK_DAILY_RESIDENTIAL = dailyHireRow("Daily hire bricklayer — residential", BRICK_RESIDENTIAL.weekly, "38 hours at the daily hire rate");
export const BRICK_DAILY_GENERAL = dailyHireRow("Daily hire bricklayer — general building", BRICK_GENERAL.weekly, "38 hours at the daily hire rate");

const CW3 = BUILDING_BASE_WEEKLY["CW/ECW 3"];

export const BRICKLAYER: Occupation = {
  slug: "bricklayer",
  name: "Bricklayer",
  plural: "bricklayers",
  metaTitle: `Bricklayer Salary Australia 2026 — ${money2(BRICK_GENERAL.hourly)}/hr Award Minimum`,
  award: { ...BUILDING_AWARD, awardPageHref: "/building-and-construction-award-rates/" },
  headline: {
    tableId: "bricklayer",
    label: BRICK_GENERAL.label,
    why: "a qualified bricklayer on a commercial, multi-unit or civil construction site",
  },
  coverage: [
    "Bricklayers employed by builders and bricklaying contractors are covered by the Building and Construction General On-site Award 2020 [MA000020]. Schedule A lists bricklayer as one of the broadbanded trades at Construction Worker Level 3 (CW3); a refractory bricklayer is graded higher, at CW5.",
    `A bricklayer's minimum is the CW3 rate of ${money2(CW3)} a week plus two allowances the award pays for all purposes: the industry allowance (${money2(general)} a week on general building and civil work, ${money2(residential)} on single and dual occupancy homes) and the bricklayer's tool allowance of ${money2(tool)} a week (cl 21.1(a)). The bricklayer tool allowance is lower than a carpenter's, so a bricklayer's minimum is ${money2(toCents(41.22 - tool))} a week below a carpenter's on the same site.`,
    "Most of the rates below are for weekly hire employees. A daily hire bricklayer, who is engaged to follow the work from job to job, is paid a higher hourly rate because the award loads the weekly amount by 52/50.4 to cover time between jobs (cl 19.3(a)).",
    "A bricklayer who is genuinely self-employed and subcontracts on an ABN has no award minimum. An enterprise agreement, where one applies, replaces these rates.",
  ],
  tables: [
    {
      id: "bricklayer",
      title: "Bricklayer pay rates by sector, 2026–27 (weekly hire)",
      intro: `Weekly = the cl 19.1 classification rate + industry allowance + the ${money2(tool)} bricklayer tool allowance, all paid for all purposes. Hourly is that weekly amount over 38 hours; casual adds the 25% loading (cl 12.4).`,
      rows: [BRICK_RESIDENTIAL, BRICK_GENERAL, BRICK_REFRACTORY],
    },
    {
      id: "daily-hire",
      title: "Daily hire bricklayer rates, 2026–27",
      intro:
        "Clause 19.3(a): the weekly-hire sum above is multiplied by 52/50.4 and rounded to the cent (the weekly figure here), then divided by 38 for the hourly rate. There is no casual daily hire rate.",
      rows: [BRICK_DAILY_RESIDENTIAL, BRICK_DAILY_GENERAL],
    },
  ],
  penalties: BUILDING_PENALTIES,
  penaltiesNote: BUILDING_PENALTIES_NOTE,
  overtime: BUILDING_OVERTIME,
  allowances: [
    { name: "Industry allowance", amount: `${money2(general)} per week (residential ${money2(residential)})`, note: "All purposes, paid to every employee (cl 22.1); included in the tables." },
    { name: "Bricklayer tool allowance", amount: `${money2(tool)} per week`, note: "All purposes, for a bricklayer or refractory bricklayer (cl 21.1(a)); included in the tables." },
    { name: "Computing quantities allowance", amount: "$6.86 per day", note: "If you are regularly required to compute or estimate quantities of materials for other employees' work, unless you are paid as a leading hand (cl 23.10(b))." },
    MULTISTOREY_ALLOWANCE,
    { name: "Living away from home", amount: "$102.92 per day", note: "Or full reimbursement of reasonable accommodation and meal costs if that is more, when the job is too far from home to return each night (cl 25.3(a))." },
  ],
  median: BRICKLAYER_MEDIAN,
  notices: [
    "Time lost because of inclement weather is paid at the ordinary hourly rate, up to 32 hours in any 4-week period, provided the award's inclement weather procedure is followed (cl 24.7).",
    "A casual bricklayer must be paid for at least 4 hours each time they are engaged (cl 12.3).",
  ],
  notShown: [
    "Apprentice bricklayer rates, which are on the apprentice bricklayer page.",
    "Leading hand rates (cl 19.2), fares and travel allowances (cl 26) and the special rates for hot, wet or confined work.",
    "Enterprise agreement rates, which cover much of the commercial construction workforce.",
  ],
  faqs: [
    {
      q: "What is the award rate for a bricklayer in 2026?",
      a: `A qualified bricklayer (CW3) on a general building or civil site must be paid at least ${money2(BRICK_GENERAL.hourly)} an hour, or ${money2(BRICK_GENERAL.weekly)} a week, under the Building and Construction General On-site Award from the first full pay period on or after 1 July 2026 — ${money0(annual52(BRICK_GENERAL.weekly))} a year full-time before tax. On single or dual occupancy homes the minimum is ${money2(BRICK_RESIDENTIAL.hourly)} an hour.`,
    },
    {
      q: "What is the casual rate for a bricklayer?",
      a: `A casual bricklayer on a general building site earns at least ${money2(BRICK_GENERAL.casualHourly ?? 0)} an hour (${money2(BRICK_RESIDENTIAL.casualHourly ?? 0)} on residential work), the ordinary hourly rate plus the 25% casual loading, with a 4-hour minimum each engagement.`,
    },
    {
      q: "How much is the bricklayer tool allowance?",
      a: `${money2(tool)} a week from 1 July 2026 (cl 21.1(a)). It is paid for all purposes, so it is added to the hourly rate before overtime and penalties are worked out, and it is already included in the rates on this page.`,
    },
    {
      q: "How much does a daily hire bricklayer get paid?",
      a: `A daily hire bricklayer on a general building site gets at least ${money2(BRICK_DAILY_GENERAL.hourly)} an hour, because the award loads the weekly amount by 52/50.4 for time lost between jobs. On residential work it is ${money2(BRICK_DAILY_RESIDENTIAL.hourly)} an hour.`,
    },
    {
      q: "What do bricklayers actually earn?",
      a: `Jobs and Skills Australia reports median full-time earnings of $2,317 a week for bricklayers and stonemasons (ABS, May 2025), about ${money0(annual52(2_317))} a year before tax. The median includes overtime, above-award pay and enterprise agreement rates, so it sits well above the award minimum.`,
    },
  ],
  sources: [
    { title: BUILDING_SOURCE_TITLE, publisher: "Fair Work Commission", url: BUILDING_AWARD.url },
    FWO_PAY_GUIDES,
    ANNUAL_WAGE_REVIEW_2026,
    jsaSource(BRICKLAYER_MEDIAN),
  ],
  verifiedOn: "9 October 2026",
  related: [
    { href: "/apprentice-pay/bricklayer/", label: "Apprentice Bricklayer Pay" },
    { href: "/building-and-construction-award-rates/", label: "Building & Construction Award Rates" },
    { href: "/job-pay-rates/carpenter/", label: "Carpenter Pay Rates" },
    { href: "/construction-trades-pay/", label: "Construction & Trades Pay" },
  ],
};
