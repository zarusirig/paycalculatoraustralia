// Carpenter — Building and Construction General On-site Award 2020 [MA000020].
// See building-construction-common.ts for the clauses and the all-purpose
// allowance trap (the cl 19.1 CW3 rate of $1,119.10 is NOT a carpenter's
// minimum).
//
// A carpenter is a CW/ECW 3 classification: Schedule A.2.3(d) lists
// "Carpenter" among the broadbanded classifications at CW3. A carpenter's
// weekly-hire minimum = cl 19.1 CW3 ($1,119.10) + industry allowance
// (general $67.15 or residential $53.72, cl 22.1) + carpenter tool allowance
// ($41.22, cl 21.1(a)), all three paid for all purposes.
//
// Median: Jobs and Skills Australia, ANZSCO 3312 Carpenters and Joiners,
// $1,760 a week / $45 an hour (ABS SEEH May 2025), read 23 September 2026.

import {
  BUILDING_AWARD,
  BUILDING_BASE_WEEKLY,
  BUILDING_OVERTIME,
  BUILDING_PENALTIES,
  BUILDING_PENALTIES_NOTE,
  BUILDING_SOURCE_TITLE,
  CARPENTER_TOOL_ALLOWANCE,
  INDUSTRY_ALLOWANCE,
  MULTISTOREY_ALLOWANCE,
  buildingRow,
  dailyHireHourly,
} from "./building-construction-common";
import {
  ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  ANNUAL_WAGE_REVIEW_2026,
  FWO_PAY_GUIDES,
  JOB_PAY_VERIFIED_ON,
  jsaSource,
  jsaUrl,
  toCents,
} from "./common";
import { formatAUD } from "../../constants/australian-tax";
import { annual52, money0, money2 } from "./j8-common";
import type { MedianEarnings, Occupation } from "./types";

const MEDIAN: MedianEarnings = {
  anzscoCode: "3312",
  anzscoTitle: "Carpenters and Joiners",
  medianWeekly: 1_760,
  medianHourly: 45,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("3312-carpenters-and-joiners"),
};

const { general, residential } = INDUSTRY_ALLOWANCE;
const tool = CARPENTER_TOOL_ALLOWANCE;
const CW3 = BUILDING_BASE_WEEKLY["CW/ECW 3"];
const CW3_HOURLY = toCents(CW3 / 38);

const CARP_RESIDENTIAL = buildingRow("Carpenter (CW3) — residential building", "CW/ECW 3", [residential, tool], "Single or dual occupancy homes");
const CARP_GENERAL = buildingRow("Carpenter (CW3) — general building and construction", "CW/ECW 3", [general, tool], "Commercial, multi-unit and civil work");

export const CARPENTER: Occupation = {
  slug: "carpenter",
  name: "Carpenter",
  plural: "carpenters",
  award: BUILDING_AWARD,
  headline: {
    tableId: "carpenter",
    label: "Carpenter (CW3) — general building and construction",
    why: "a qualified carpenter on a general building or civil construction site",
  },
  coverage: [
    "Carpenters employed by builders and construction contractors are covered by the Building and Construction General On-site Award 2020 [MA000020]. The award classifies a qualified carpenter as a Construction Worker Level 3 (CW3).",
    `A carpenter's minimum is more than the CW3 rate printed in clause 19.1. The award adds an industry allowance (${money2(general)} a week in general building and civil construction, ${money2(residential)} on single and dual occupancy residential jobs) and a ${money2(tool)} carpenter's tool allowance, and says both are paid for all purposes. Quoting the bare ${formatAUD(CW3, 2)} CW3 rate understates a carpenter's minimum by up to ${money2(toCents(general + tool))} a week.`,
    "The rates below are for weekly hire employees. Daily hire employees, who follow the job, get a higher hourly rate because the award multiplies their weekly amount by 52/50.4 to cover time between jobs (cl 19.3(a)).",
    "Carpenters working for a joinery or cabinet-making business, or in manufacturing, may be covered by a different award such as the Joinery and Building Trades Award.",
  ],
  tables: [
    {
      id: "carpenter",
      title: "Carpenter pay rates by sector, 2026–27 (weekly hire)",
      intro:
        `The weekly rate is the CW3 minimum (${formatAUD(CW3, 2)}) plus the industry allowance and the carpenter tool allowance (${money2(tool)}), all paid for all purposes. The hourly rate is that weekly amount divided by 38 hours, and the casual rate adds the 25% loading (cl 12.4).`,
      rows: [CARP_RESIDENTIAL, CARP_GENERAL],
    },
    {
      id: "construction-levels",
      title: "Construction worker levels, general building (weekly hire, without tool allowance)",
      intro: `Each rate is the clause 19.1 minimum plus the ${money2(general)} general building industry allowance. A carpenter classified above CW3 still receives the ${money2(tool)} tool allowance on top of these figures.`,
      rows: [
        buildingRow("CW/ECW 1 (level a) — new entrant", "CW/ECW 1 (level a)", [general]),
        buildingRow("CW/ECW 2", "CW/ECW 2", [general]),
        buildingRow("CW/ECW 3 — tradesperson", "CW/ECW 3", [general]),
        buildingRow("CW/ECW 4", "CW/ECW 4", [general]),
        buildingRow("CW/ECW 5", "CW/ECW 5", [general]),
        buildingRow("CW/ECW 6", "CW/ECW 6", [general]),
        buildingRow("CW/ECW 7", "CW/ECW 7", [general]),
        buildingRow("CW/ECW 8", "CW/ECW 8", [general]),
      ],
    },
  ],
  penalties: BUILDING_PENALTIES,
  penaltiesNote: BUILDING_PENALTIES_NOTE,
  overtime: BUILDING_OVERTIME,
  allowances: [
    { name: "Industry allowance", amount: `${money2(general)} per week (residential ${money2(residential)})`, note: "All purposes, paid to every employee (cl 22.1); included in the table." },
    { name: "Carpenter tool allowance", amount: `${money2(tool)} per week`, note: "All purposes, for a carpenter and/or joiner (cl 21.1(a)); included in the carpenter table." },
    MULTISTOREY_ALLOWANCE,
    { name: "In charge of plant", amount: "$52.60 per week", note: "When you are in charge of plant (cl 23.9)." },
    { name: "Underground allowance", amount: "$20.14 per week", note: "All purposes, when required to work underground (cl 23.2)." },
  ],
  median: MEDIAN,
  notices: [
    `A daily hire carpenter on a general building site has a higher ordinary hourly rate: (${formatAUD(CARP_GENERAL.weekly, 2)} x 52/50.4) / 38 = ${money2(dailyHireHourly(CARP_GENERAL.weekly))} an hour (cl 19.3(a)).`,
  ],
  notShown: [
    "Apprentice carpenter rates, which are percentages of the CW3 standard rate by stage and whether the apprentice finished Year 12 (cl 19.7), plus the allowances.",
    "Leading hand rates, fares and travel allowances, and special rates for work in wet, hot or confined conditions (cl 23.10).",
    "Rates under enterprise agreements, which cover much of the commercial construction workforce.",
  ],
  faqs: [
    {
      q: "What is the award rate for a carpenter in 2026?",
      a: `A qualified carpenter (CW3) on a general building or civil site must be paid at least ${money2(CARP_GENERAL.hourly)} an hour, or ${formatAUD(CARP_GENERAL.weekly, 2)} a week, under the Building and Construction General On-site Award from the first full pay period on or after 1 July 2026. That includes the industry and tool allowances and is ${money0(annual52(CARP_GENERAL.weekly))} a year full-time before tax. On residential housing work the minimum is ${money2(CARP_RESIDENTIAL.hourly)} an hour.`,
    },
    {
      q: "What is the casual rate for a carpenter?",
      a: `A casual carpenter on a general building site earns at least ${money2(CARP_GENERAL.casualHourly ?? 0)} an hour, the ${money2(CARP_GENERAL.hourly)} ordinary hourly rate plus the 25% casual loading. Casuals get 175% of the ordinary rate for the first 2 hours of Saturday overtime, 225% after that, after 12 noon on Saturday and on Sundays, and 275% on public holidays (cl 12.5, 12.6).`,
    },
    {
      q: "Why is the carpenter award rate higher than $29.45 an hour?",
      a: `${money2(CW3_HOURLY)} is the bare CW3 classification rate in clause 19.1. The award requires an industry allowance and, for carpenters, a tool allowance to be added for all purposes, which takes the ordinary hourly rate to ${money2(CARP_GENERAL.hourly)} on general building sites.`,
    },
    {
      q: "Do carpenters get paid more on weekends?",
      a: "Yes. Ordinary hours are Monday to Friday, so Saturday work is overtime at 150% for the first 2 hours and 200% after that (and after 12 noon), and Sunday work is 200% all day.",
    },
    {
      q: "What do carpenters actually earn in Australia?",
      a: `Jobs and Skills Australia reports median full-time earnings of ${money0(MEDIAN.medianWeekly)} a week for carpenters and joiners (ABS, May 2025), about ${money0(annual52(MEDIAN.medianWeekly))} a year. The median includes carpenters on enterprise agreements and above-award rates, so it is a market figure, not a minimum.`,
    },
  ],
  sources: [
    { title: BUILDING_SOURCE_TITLE, publisher: "Fair Work Commission", url: BUILDING_AWARD.url },
    FWO_PAY_GUIDES,
    ANNUAL_WAGE_REVIEW_2026,
    jsaSource(MEDIAN),
  ],
  verifiedOn: JOB_PAY_VERIFIED_ON,
  related: [
    { href: "/construction-trades-pay/", label: "Construction & Trades Pay" },
    { href: "/building-and-construction-award-rates/", label: "Building & Construction Award Rates" },
    { href: "/overtime-pay-calculator/", label: "Overtime Pay Calculator" },
    { href: "/job-pay-rates/electrician/", label: "Electrician Pay Rates" },
  ],
};
