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
  BUILDING_OVERTIME,
  BUILDING_PENALTIES,
  BUILDING_PENALTIES_NOTE,
  BUILDING_SOURCE_TITLE,
  CARPENTER_TOOL_ALLOWANCE,
  INDUSTRY_ALLOWANCE,
  MULTISTOREY_ALLOWANCE,
  buildingRow,
} from "./building-construction-common";
import {
  ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  ANNUAL_WAGE_REVIEW_2026,
  FWO_PAY_GUIDES,
  JOB_PAY_VERIFIED_ON,
  jsaSource,
  jsaUrl,
} from "./common";
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
    "A carpenter's minimum is more than the CW3 rate printed in clause 19.1. The award adds an industry allowance ($67.15 a week in general building and civil construction, $53.72 on single and dual occupancy residential jobs) and a $41.22 carpenter's tool allowance, and says both are paid for all purposes. Quoting the bare $1,119.10 CW3 rate understates a carpenter's minimum by up to $108.37 a week.",
    "The rates below are for weekly hire employees. Daily hire employees, who follow the job, get a higher hourly rate because the award multiplies their weekly amount by 52/50.4 to cover time between jobs (cl 19.3(a)).",
    "Carpenters working for a joinery or cabinet-making business, or in manufacturing, may be covered by a different award such as the Joinery and Building Trades Award.",
  ],
  tables: [
    {
      id: "carpenter",
      title: "Carpenter pay rates by sector, 2026–27 (weekly hire)",
      intro:
        "Weekly = CW3 minimum ($1,119.10) + industry allowance + carpenter tool allowance ($41.22), all paid for all purposes. Hourly is that weekly amount over 38 hours; casual adds the 25% loading (cl 12.4).",
      rows: [
        buildingRow("Carpenter (CW3) — residential building", "CW/ECW 3", [residential, CARPENTER_TOOL_ALLOWANCE], "Single or dual occupancy homes"),
        buildingRow("Carpenter (CW3) — general building and construction", "CW/ECW 3", [general, CARPENTER_TOOL_ALLOWANCE], "Commercial, multi-unit and civil work"),
      ],
    },
    {
      id: "construction-levels",
      title: "Construction worker levels, general building (weekly hire, without tool allowance)",
      intro:
        "Clause 19.1 minimum + the $67.15 general building industry allowance. A carpenter classified above CW3 still receives the $41.22 tool allowance on top of these figures.",
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
    { name: "Industry allowance", amount: "$67.15 per week (residential $53.72)", note: "All purposes, paid to every employee (cl 22.1); included in the table." },
    { name: "Carpenter tool allowance", amount: "$41.22 per week", note: "All purposes, for a carpenter and/or joiner (cl 21.1(a)); included in the carpenter table." },
    MULTISTOREY_ALLOWANCE,
    { name: "In charge of plant", amount: "$52.60 per week", note: "When you are in charge of plant (cl 23.9)." },
    { name: "Underground allowance", amount: "$20.14 per week", note: "All purposes, when required to work underground (cl 23.2)." },
  ],
  median: MEDIAN,
  notices: [
    "A daily hire carpenter on a general building site has a higher ordinary hourly rate: ($1,227.47 x 52/50.4) / 38 = $33.33 an hour (cl 19.3(a)).",
  ],
  notShown: [
    "Apprentice carpenter rates, which are percentages of the CW3 standard rate by stage and whether the apprentice finished Year 12 (cl 19.7), plus the allowances.",
    "Leading hand rates, fares and travel allowances, and special rates for work in wet, hot or confined conditions (cl 23.10).",
    "Rates under enterprise agreements, which cover much of the commercial construction workforce.",
  ],
  faqs: [
    {
      q: "What is the award rate for a carpenter in 2026?",
      a: "A qualified carpenter (CW3) on a general building or civil site must be paid at least $32.30 an hour, or $1,227.47 a week, under the Building and Construction General On-site Award from the first full pay period on or after 1 July 2026. That includes the industry and tool allowances and is $63,828 a year full-time before tax. On residential housing work the minimum is $31.95 an hour.",
    },
    {
      q: "What is the casual rate for a carpenter?",
      a: "A casual carpenter on a general building site earns at least $40.38 an hour, the $32.30 ordinary hourly rate plus the 25% casual loading. Casuals get 175% of the ordinary rate for the first 2 hours of Saturday overtime, 225% after that and on Sundays, and 275% on public holidays.",
    },
    {
      q: "Why is the carpenter award rate higher than $29.45 an hour?",
      a: "$29.45 is the bare CW3 classification rate in clause 19.1. The award requires an industry allowance and, for carpenters, a tool allowance to be added for all purposes, which takes the ordinary hourly rate to $32.30 on general building sites.",
    },
    {
      q: "Do carpenters get paid more on weekends?",
      a: "Yes. Ordinary hours are Monday to Friday, so Saturday work is overtime at 150% for the first 2 hours and 200% after that (and after 12 noon), and Sunday work is 200% all day.",
    },
    {
      q: "What do carpenters actually earn in Australia?",
      a: "Jobs and Skills Australia reports median full-time earnings of $1,760 a week for carpenters and joiners (ABS, May 2025), about $91,520 a year. The median includes carpenters on enterprise agreements and above-award rates, so it is a market figure, not a minimum.",
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
    { href: "/overtime-pay-calculator/", label: "Overtime Pay Calculator" },
    { href: "/job-pay-rates/electrician/", label: "Electrician Pay Rates" },
  ],
};
