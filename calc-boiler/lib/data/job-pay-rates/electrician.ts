// Electrician — Electrical, Electronic and Communications Contracting Award 2020 [MA000025].
//
// Source: FWC consolidated award text, awards.fairwork.gov.au/MA000025.html,
// "incorporates all amendments up to and including 1 July 2026 (PR799280,
// PR799306 and PR799463)". Read 23 September 2026.
//
// ⚠️ THE ELECTRICAL AWARD'S "RATE" IS AN ALL-PURPOSE RATE.
// Clause 16.3 makes the all-purpose rate the cl 16.2 minimum PLUS the industry
// allowance (cl 18.3(a), $41.41/wk, payable to all employees per Schedule B
// footnote 1) PLUS, for grade 5 and above, the tool allowance (cl 18.3(g),
// $22.31/wk). Schedule B's "ordinary hourly rate" is that sum divided by 38.
// Quoting the bare cl 16.2 figure ($29.45 for grade 5) understates an
// electrician's minimum by $1.68 an hour.
//
// So the `weekly` column below is OUR sum of three published figures, and the
// `hourly` and `casualHourly` columns are Schedule B.2.1 and B.3.1 exactly.
// Tests assert weekly / 38 reproduces Schedule B's hourly to the cent.
//
// Base (cl 16.2) weekly rates, for the record:
//   G1 1004.90  G2 1013.10  G3 1046.90  G4 1080.60  G5 1119.10
//   G6 1154.30  G7 1221.10  G8 1283.10  G9 1309.50  G10 1415.00
//
// The tool allowance line reads "[18.3(g) varied by … PR774078 ppc 01Jul24]" —
// it was not varied in 2025 or 2026 in the consolidated text. We quote it as
// printed.

import {
  ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  ANNUAL_WAGE_REVIEW_2026,
  CONSOLIDATED_TO,
  FWO_PAY_GUIDES,
  JOB_PAY_VERIFIED_ON,
  awardTextUrl,
  jsaSource,
  jsaUrl,
} from "./common";
import type { MedianEarnings, Occupation } from "./types";

const MEDIAN: MedianEarnings = {
  anzscoCode: "3411",
  anzscoTitle: "Electricians",
  medianWeekly: 2_191,
  medianHourly: 55,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("3411-electricians"),
};

export const ELECTRICIAN: Occupation = {
  slug: "electrician",
  name: "Electrician",
  plural: "electricians",
  award: {
    name: "Electrical, Electronic and Communications Contracting Award 2020",
    code: "MA000025",
    url: awardTextUrl("MA000025"),
    consolidatedTo: CONSOLIDATED_TO,
  },
  headline: {
    tableId: "electrical-workers",
    label: "Electrical worker grade 5",
    why: "a qualified electrician who has completed their apprenticeship",
  },
  coverage: [
    "Electricians working for electrical contractors are covered by the Electrical, Electronic and Communications Contracting Award 2020 [MA000025]. The award grades electrical workers from 1 to 10. Grade 5 is the qualified tradesperson level; grades 6 to 10 are grade 5 electricians who hold further qualifications or experience set out in Schedule A.",
    "An electrician's minimum is more than the bare wage in the award. Clause 16.3 builds an \"all-purpose\" rate from the grade's minimum wage plus the industry allowance ($41.41 a week, paid to all employees) and, from grade 5 up, the tool allowance ($22.31 a week). That all-purpose rate is what overtime, penalties and leave are calculated on.",
    "An electrician who holds an unrestricted electrical licence and may be required to use it gets a further all-purpose licence allowance of $40.29 a week (cl 18.3(b)), which is not included in the table.",
    "Electricians employed outside electrical contracting — in mining, manufacturing or by an electricity supplier, for example — may be covered by a different award or an enterprise agreement.",
  ],
  tables: [
    {
      id: "electrical-workers",
      title: "Electrician pay rates by grade, 2026–27",
      intro:
        "Weekly = the clause 16.2 minimum + industry allowance ($41.41) + tool allowance ($22.31, grades 5–10). Hourly and casual rates are exactly as published in the award's Schedule B, which already include those allowances.",
      rows: [
        { label: "Electrical worker grade 1", weekly: 1046.31, hourly: 27.53, casualHourly: 34.41, note: "Labourer" },
        { label: "Electrical worker grade 2", weekly: 1054.51, hourly: 27.75, casualHourly: 34.69, note: "Assists a tradesperson" },
        { label: "Electrical worker grade 3", weekly: 1088.31, hourly: 28.64, casualHourly: 35.8, note: "Works under direction" },
        { label: "Electrical worker grade 4", weekly: 1122.01, hourly: 29.53, casualHourly: 36.91, note: "Includes restricted B class licensed workers" },
        { label: "Electrical worker grade 5", weekly: 1182.82, hourly: 31.13, casualHourly: 38.91, note: "Qualified tradesperson" },
        { label: "Electrical worker grade 6", weekly: 1218.02, hourly: 32.05, casualHourly: 40.06 },
        { label: "Electrical worker grade 7", weekly: 1284.82, hourly: 33.81, casualHourly: 42.26 },
        { label: "Electrical worker grade 8", weekly: 1346.82, hourly: 35.44, casualHourly: 44.3 },
        { label: "Electrical worker grade 9", weekly: 1373.22, hourly: 36.14, casualHourly: 45.18 },
        { label: "Electrical worker grade 10", weekly: 1478.72, hourly: 38.91, casualHourly: 48.64 },
      ],
    },
  ],
  penalties: [
    { when: "Ordinary hours (Monday–Friday, 6 am–6 pm spread)", permanent: "100%", casual: "125%" },
    { when: "Public holiday", permanent: "250%", casual: "312.5%" },
  ],
  penaltiesNote:
    "Ordinary hours for day workers are Monday to Friday (cl 13), so weekend work is paid as overtime rather than as a weekend penalty. Percentages are of the all-purpose ordinary hourly rate (Schedule B.2.1 and B.3.1).",
  overtime: [
    "Monday to Saturday: 150% for the first 2 hours, then 200% (Schedule B.2.2).",
    "Sunday: 200%. Public holiday: 250%.",
    "Overtime is calculated on the all-purpose rate, so the industry, tool and any licence allowance are included before the multiplier is applied.",
  ],
  allowances: [
    { name: "Industry allowance", amount: "$41.41 per week", note: "All-purpose, paid to all employees (cl 18.3(a)); included in the table." },
    { name: "Tool allowance", amount: "$22.31 per week", note: "All-purpose, grade 5 and above (cl 18.3(g)); included in the table." },
    { name: "Electrician's licence allowance", amount: "$40.29 per week", note: "All-purpose, for an electrical mechanic who holds an unrestricted licence and may be required to use it (cl 18.3(b)); NOT included in the table." },
    { name: "Nominee allowance", amount: "$102.96 per week", note: "For an electrician who acts as the licence nominee for an electrical contractor (cl 18.3(d))." },
    { name: "Leading hand allowance", amount: "$48.12 to $90.65 per week", note: "Depends on how many employees are in the leading hand's charge (cl 18.3(c))." },
  ],
  median: MEDIAN,
  notices: [
    "An electrician who holds an unrestricted licence and may be required to use it must also get the $40.29 weekly licence allowance on top of the grade 5 rate — an all-purpose minimum of $1,223.11 a week.",
  ],
  notShown: [
    "Apprentice rates, which are percentages of the grade 5 rate set by year and start date — see the construction and trades pay guide.",
    "Shiftwork rates and special site allowances such as the multistorey allowance.",
    "Rates under enterprise agreements, which replace the award for employers that have one.",
  ],
  faqs: [
    {
      q: "What is the award rate for an electrician in Australia in 2026?",
      a: "A qualified electrician (Electrical worker grade 5) must be paid at least $31.13 an hour, or $1,182.82 a week, under the Electrical, Electronic and Communications Contracting Award from the first full pay period on or after 1 July 2026. That includes the industry and tool allowances and works out to $61,507 a year before tax.",
    },
    {
      q: "How much does a licensed electrician get paid per hour?",
      a: "A grade 5 electrician who holds an unrestricted licence and may be required to use it also gets the $40.29 weekly licence allowance, taking the all-purpose minimum to $1,223.11 a week, about $32.19 an hour.",
    },
    {
      q: "What is the casual rate for an electrician?",
      a: "A casual grade 5 electrician earns at least $38.91 an hour, which is the $31.13 all-purpose rate plus the 25% casual loading. Casuals get 312.5% on a public holiday.",
    },
    {
      q: "Do electricians get paid penalty rates on weekends?",
      a: "Ordinary hours under this award run Monday to Friday, so weekend work is overtime: 150% for the first 2 hours on Saturday then 200%, and 200% all day Sunday.",
    },
    {
      q: "What do electricians actually earn in Australia?",
      a: "Jobs and Skills Australia reports a median of $2,191 a week for full-time electricians (ABS Survey of Employee Earnings and Hours, May 2025) — about $1,000 a week above the grade 5 award minimum. The median counts electricians on enterprise agreements and above-award pay, so it is a market figure, not an entitlement.",
    },
  ],
  sources: [
    { title: "Electrical, Electronic and Communications Contracting Award 2020 [MA000025] — consolidated to 1 July 2026", publisher: "Fair Work Commission", url: awardTextUrl("MA000025") },
    FWO_PAY_GUIDES,
    ANNUAL_WAGE_REVIEW_2026,
    jsaSource(MEDIAN),
  ],
  verifiedOn: JOB_PAY_VERIFIED_ON,
  related: [
    { href: "/construction-trades-pay/", label: "Construction & Trades Pay" },
    { href: "/manufacturing-award-rates/", label: "Manufacturing Award Pay Rates" },
    { href: "/overtime-pay-calculator/", label: "Overtime Pay Calculator" },
  ],
};
