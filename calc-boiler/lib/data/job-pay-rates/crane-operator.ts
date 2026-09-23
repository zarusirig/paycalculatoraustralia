// Crane operator — Mobile Crane Hiring Award 2020 [MA000032], with the
// Building and Construction General On-site Award 2020 [MA000020] crane
// classifications for operators employed by builders.
//
// MA000032 source: awards.fairwork.gov.au/MA000032.html, "incorporates all
// amendments up to and including 1 July 2026 (PR799280 …)". Read 23 September
// 2026. Clause 16.1 minimum weekly rates + an all-purpose industry allowance of
// $63.79 a week (cl 16.2). Schedule B.2.1 / B.3.1 print the ordinary and casual
// hourly rates INCLUDING that allowance; those are used verbatim below. Note
// Schedule B computes hourly as (cl 16.1 hourly + $63.79/38), so for MCE5 it
// prints $35.45 where our weekly sum / 38 gives $35.444 — a sub-cent
// difference in the Commission's own method, which we follow by quoting it.
//
// Classifications (Schedule A.1): MCE1 up to 20t slew crane / dogger; MCE2
// 21–60t slew crane and non-slew (Franna) operator; MCE3 61–100t; MCE4
// 101–200t; MCE5 201–300t; MCE6 301–400t; MCE7 401t and over.
//
// MA000032 does not cover an employer bound by the Building and Construction
// General On-site Award (cl 4.3(b)), so a crane operator employed by a builder
// is under MA000020, where cranes are classified by type and capacity in
// Schedule A (CW3 cranes up to 5t; CW4 mobile cranes up to 15t; CW5 mobile and
// other cranes 10/15–100t; CW6 mobile cranes 100–180t; CW7 tower crane and
// mobile cranes over 180t) — see building-construction-common.ts.
//
// Median: Jobs and Skills Australia, ANZSCO 7121 Crane, Hoist and Lift
// Operators, $3,411 a week / $83 an hour (ABS SEEH May 2025), read 23 September
// 2026. The JSA slug is 7121-crane-hoist-and-lift-operators.

import {
  BUILDING_AWARD,
  BUILDING_SOURCE_TITLE,
  INDUSTRY_ALLOWANCE,
  buildingRow,
} from "./building-construction-common";
import {
  ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  ANNUAL_WAGE_REVIEW_2026,
  FWO_PAY_GUIDES,
  JOB_PAY_VERIFIED_ON,
  awardTextUrl,
  jsaSource,
  jsaUrl,
  toCents,
} from "./common";
import type { MedianEarnings, Occupation, RateRow } from "./types";

const MEDIAN: MedianEarnings = {
  anzscoCode: "7121",
  anzscoTitle: "Crane, Hoist and Lift Operators",
  medianWeekly: 3_411,
  medianHourly: 83,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("7121-crane-hoist-and-lift-operators"),
};

/** cl 16.2 all-purpose industry allowance, per week. */
export const MOBILE_CRANE_INDUSTRY_ALLOWANCE = 63.79;

function mce(label: string, base: number, hourly: number, casualHourly: number, note: string): RateRow {
  return { label, weekly: toCents(base + MOBILE_CRANE_INDUSTRY_ALLOWANCE), hourly, casualHourly, note };
}

export const CRANE_OPERATOR: Occupation = {
  slug: "crane-operator",
  name: "Crane Operator",
  plural: "crane operators",
  award: {
    name: "Mobile Crane Hiring Award 2020",
    code: "MA000032",
    url: awardTextUrl("MA000032"),
    consolidatedTo: "1 July 2026",
  },
  headline: {
    tableId: "mobile-crane-hire",
    label: "Mobile crane employee level 2 (MCE2)",
    why: "a crane hire operator licensed for 21–60 tonne slew cranes or non-slew (Franna) cranes",
  },
  coverage: [
    "Which award covers a crane operator depends on who employs them. Operators employed by a crane hire company are covered by the Mobile Crane Hiring Award 2020 [MA000032], which grades them from MCE1 to MCE7 by the size and type of crane they are licensed and required to operate.",
    "That award does not apply to an employer covered by the Building and Construction General On-site Award. A crane operator employed directly by a builder or construction contractor is classified under that award instead, from CW3 for small cranes to CW7 for tower cranes and the largest mobile cranes.",
    "Both awards add an all-purpose industry allowance to the classification rate ($63.79 a week under the Mobile Crane Hiring Award, $67.15 in general building), so the rates below include it.",
    "Crane operators on major projects and in mining are very often paid under enterprise agreements, which is why the market median is far above either award.",
  ],
  tables: [
    {
      id: "mobile-crane-hire",
      title: "Crane operator pay rates — Mobile Crane Hiring Award (crane hire companies)",
      intro:
        "Weekly = clause 16.1 minimum + the $63.79 all-purpose industry allowance. Hourly and casual rates are exactly as published in Schedule B.2.1 and B.3.1.",
      rows: [
        mce("Mobile crane employee level 1 (MCE1)", 1119.1, 31.13, 38.91, "Slew crane up to 20t, dogger"),
        mce("Mobile crane employee level 2 (MCE2)", 1154.3, 32.06, 40.08, "Slew crane 21–60t, Franna (non-slew)"),
        mce("Mobile crane employee level 3 (MCE3)", 1189.4, 32.98, 41.23, "Slew crane 61–100t"),
        mce("Mobile crane employee level 4 (MCE4)", 1221.1, 33.81, 42.26, "Slew crane 101–200t"),
        mce("Mobile crane employee level 5 (MCE5)", 1283.1, 35.45, 44.31, "Slew crane 201–300t"),
        mce("Mobile crane employee level 6 (MCE6)", 1309.5, 36.14, 45.18, "Slew crane 301–400t"),
        mce("Mobile crane employee level 7 (MCE7)", 1344.5, 37.06, 46.33, "Slew crane 401t and over"),
      ],
    },
    {
      id: "building-cranes",
      title: "Crane operator pay rates — Building and Construction Award (employed by a builder)",
      intro:
        "Clause 19.1 minimum + the $67.15 general building industry allowance, weekly hire. The award publishes no hourly schedule, so hourly is the weekly amount over 38 hours and casual adds the 25% loading (cl 12.4).",
      rows: [
        buildingRow("CW3 — cranes up to 5 tonnes", "CW/ECW 3", [INDUSTRY_ALLOWANCE.general]),
        buildingRow("CW4 — mobile cranes up to 15 tonnes", "CW/ECW 4", [INDUSTRY_ALLOWANCE.general]),
        buildingRow("CW5 — mobile and other cranes up to 100 tonnes", "CW/ECW 5", [INDUSTRY_ALLOWANCE.general]),
        buildingRow("CW6 — mobile cranes over 100 up to 180 tonnes", "CW/ECW 6", [INDUSTRY_ALLOWANCE.general]),
        buildingRow("CW7 — tower crane; mobile cranes over 180 tonnes", "CW/ECW 7", [INDUSTRY_ALLOWANCE.general]),
      ],
    },
  ],
  penalties: [
    { when: "Ordinary hours (Monday–Friday, 6 am–6 pm)", permanent: "100%", casual: "125%" },
    { when: "Saturday before 12 noon — first 2 hours", permanent: "150%", casual: "175%" },
    { when: "Saturday after 2 hours or after 12 noon; Sunday", permanent: "200%", casual: "225%" },
    { when: "Public holiday", permanent: "250%", casual: "275%" },
  ],
  penaltiesNote:
    "Mobile Crane Hiring Award: percentages of the ordinary hourly rate including the industry allowance. Ordinary hours are Monday to Friday (cl 12.1), so weekend work is overtime (cl 22.3); casual rates include the loading (cl 9.4). The Building and Construction Award uses the same percentages.",
  overtime: [
    "Monday to Friday and Saturday before 12 noon: 150% for the first 2 hours, then 200% (cl 22.3, Schedule B.2.3).",
    "Saturday after 12 noon and Sunday: 200%. Public holiday: 250%. Casuals: 175%, 225% and 275% (cl 9.4).",
    "Minimum of 4 hours for overtime on a Saturday, Sunday or public holiday (cl 22.5). Travel between depot and site outside ordinary hours is paid at overtime rates (cl 22.6).",
  ],
  allowances: [
    { name: "Industry allowance (crane hire)", amount: "$63.79 per week", note: "All purposes, all employees (cl 16.2); included in the first table." },
    { name: "Industry allowance (building)", amount: "$67.15 per week", note: "All purposes, general building and construction (MA000020 cl 22.1); included in the second table." },
    { name: "Mobile crane capacity adjustment (building)", amount: "$26.86 per week", note: "Added for each extra 40 tonnes over 100 tonnes lifting capacity, CW5 and above (MA000020 cl 19.5); not included." },
  ],
  median: MEDIAN,
  notices: [
    "The Jobs and Skills Australia median of $3,411 a week is more than double the award minimum — most crane operators on major construction and resources projects are paid under enterprise agreements.",
  ],
  notShown: [
    "Shiftwork rates (Schedule B.2.2), standby and call-back payments, and trainee rates.",
    "Building award crane capacity adjustments above 100 tonnes, and allowances such as the multistorey allowance.",
    "Enterprise agreement rates, which cover most large crane hire and construction employers.",
  ],
  faqs: [
    {
      q: "What is the award rate for a crane operator in 2026?",
      a: "A crane hire operator licensed for 21–60 tonne slew cranes or Franna (non-slew) cranes is MCE2 under the Mobile Crane Hiring Award, with a minimum of $32.06 an hour, or $1,218.09 a week including the industry allowance, from the first full pay period on or after 1 July 2026. Rates rise to $37.06 an hour for cranes over 400 tonnes (MCE7).",
    },
    {
      q: "What is the casual rate for a crane operator?",
      a: "A casual MCE2 crane operator earns at least $40.08 an hour including the 25% casual loading (Schedule B.3.1). Casuals must be engaged for at least 4 hours a day.",
    },
    {
      q: "How much does a tower crane operator earn under the award?",
      a: "A tower crane driver employed by a builder is CW7 under the Building and Construction General On-site Award: $1,256.30 a week plus the $67.15 industry allowance, which is $1,323.45 a week or $34.83 an hour for a weekly hire employee.",
    },
    {
      q: "Which award covers crane operators?",
      a: "Crane hire companies are covered by the Mobile Crane Hiring Award. That award does not apply to employers covered by the Building and Construction General On-site Award, so crane operators employed by builders are covered by the building award. Mining and manufacturing have their own awards.",
    },
    {
      q: "What do crane operators actually earn in Australia?",
      a: "Jobs and Skills Australia reports median full-time earnings of $3,411 a week for crane, hoist and lift operators (ABS, May 2025), about $177,372 a year — far above the award, because most work under enterprise agreements with long hours and project allowances.",
    },
  ],
  sources: [
    { title: "Mobile Crane Hiring Award 2020 [MA000032] — consolidated to 1 July 2026", publisher: "Fair Work Commission", url: awardTextUrl("MA000032") },
    { title: BUILDING_SOURCE_TITLE, publisher: "Fair Work Commission", url: BUILDING_AWARD.url },
    FWO_PAY_GUIDES,
    ANNUAL_WAGE_REVIEW_2026,
    jsaSource(MEDIAN),
  ],
  verifiedOn: JOB_PAY_VERIFIED_ON,
  related: [
    { href: "/construction-trades-pay/", label: "Construction & Trades Pay" },
    { href: "/mining-fifo-pay-guide/", label: "Mining & FIFO Pay Guide" },
    { href: "/job-pay-rates/truck-driver/", label: "Truck Driver Pay Rates" },
  ],
};
