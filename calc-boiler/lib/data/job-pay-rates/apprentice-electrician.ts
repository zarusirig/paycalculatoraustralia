// Apprentice electrician — Electrical, Electronic and Communications
// Contracting Award 2020 [MA000025], clause 16.4 and Schedule B.4.
//
// Source: awards.fairwork.gov.au/MA000025.html, "incorporates all amendments
// up to and including 1 July 2026 (PR799280 …)". Read 23 September 2026.
//
// An apprentice's weekly ALL-PURPOSE rate (cl 16.4(a)(iv), (b)(vii)) is:
//   the percentage of the grade 5 minimum (cl 16.2, $1,119.10)
//   + the FULL tool allowance (cl 18.3(g), $22.31)
//   + the same percentage of the industry allowance (cl 18.3(a), $41.41)
//   + the same percentage of the electrician's licence allowance (cl 18.3(b), $40.29).
// Adult apprentices who started on or after 1 January 2014 get 80% of grade 5
// in year 1 and the grade 1 (EW1) minimum, $1,004.90, from year 2, with 80% then
// 87% of the industry and licence allowances (cl 16.4(b)(v)–(vii)).
// Schedule B.4 footnote: "Apprentice hourly rate includes the industry
// allowance, tool allowance and electricians licence allowance".
//
// `weekly` is our sum of those published components; `hourly` is Schedule
// B.4.5 (junior, commenced on or after 1 Jan 2014) and B.4.1 (adult) exactly.
// Tests re-derive every hourly rate from the formula, to the cent.
//
// Schedule B contains NO casual apprentice rates, so casualHourly is null.
// Apprentice wages are not bound by the National Minimum Wage order, so the
// tables carry `belowMinimumWage`.

import {
  ANNUAL_WAGE_REVIEW_2026,
  FWO_PAY_GUIDES,
  JOB_PAY_VERIFIED_ON,
  awardTextUrl,
  toCents,
} from "./common";
import type { Occupation, RateRow } from "./types";

/** Clause 16.2 and 18.3 figures the apprentice rate is built from, per week. */
export const ELECTRICAL_APPRENTICE_INPUTS = {
  grade5: 1119.1,
  grade1: 1004.9,
  toolAllowance: 22.31,
  industryAllowance: 41.41,
  licenceAllowance: 40.29,
} as const;

const I = ELECTRICAL_APPRENTICE_INPUTS;

/** Weekly all-purpose apprentice rate: wage + full tool allowance + pct of industry and licence allowances. */
export function apprenticeWeekly(wage: number, allowancePct: number): number {
  return toCents(wage + I.toolAllowance + allowancePct * (I.industryAllowance + I.licenceAllowance));
}

function junior(label: string, pct: number, hourly: number, note?: string): RateRow {
  return { label, weekly: apprenticeWeekly(pct * I.grade5, pct), hourly, casualHourly: null, ...(note ? { note } : {}) };
}

const NOT_NMW = "Apprentice wages under a training contract are set by the award, not the National Minimum Wage order.";

export const APPRENTICE_ELECTRICIAN: Occupation = {
  slug: "apprentice-electrician",
  name: "Apprentice Electrician",
  plural: "apprentice electricians",
  award: {
    name: "Electrical, Electronic and Communications Contracting Award 2020",
    code: "MA000025",
    url: awardTextUrl("MA000025"),
    consolidatedTo: "1 July 2026",
  },
  headline: {
    tableId: "junior-year-12",
    label: "1st year — completed Year 12",
    why: "a first-year apprentice electrician who has completed Year 12",
  },
  coverage: [
    "Apprentice electricians employed by electrical contractors are covered by the Electrical, Electronic and Communications Contracting Award 2020 [MA000025]. Their pay is a percentage of the qualified electrician (grade 5) minimum that rises each year of the 4-year apprenticeship.",
    "For apprentices who started on or after 1 January 2014 the percentages are 50%, 60%, 70% and 82% of the grade 5 rate — or 55% and 65% in the first two years for an apprentice who completed Year 12 (cl 16.4(a)(ii)).",
    "On top of that percentage the award adds the full $22.31 weekly tool allowance and the same percentage of the industry allowance ($41.41) and the electrician's licence allowance ($40.29). The total is an all-purpose rate, so overtime, penalties and leave are paid on it. Quoting 50% of the grade 5 wage alone ($14.73 an hour) understates a first-year apprentice without Year 12 by $1.66 an hour.",
    "An adult apprentice (as defined in the award) who started on or after 1 January 2014 gets 80% of the grade 5 rate in first year and at least the grade 1 rate from second year (cl 16.4(b)(v)). An existing employee who becomes an adult apprentice cannot have their pay cut (cl 16.4(b)(i)).",
  ],
  tables: [
    {
      id: "junior-year-12",
      title: "Apprentice electrician pay rates — completed Year 12 (started on or after 1 January 2014)",
      intro:
        "Weekly = percentage of the $1,119.10 grade 5 wage + $22.31 tool allowance + the same percentage of the industry and licence allowances. Hourly rates are exactly as published in Schedule B.4.5. The award sets no casual apprentice rate.",
      belowMinimumWage: NOT_NMW,
      rows: [
        junior("1st year — completed Year 12", 0.55, 17.97, "55% of grade 5"),
        junior("2nd year — completed Year 12", 0.65, 21.13, "65% of grade 5"),
        junior("3rd year — completed Year 12", 0.7, 22.71, "70% of grade 5"),
        junior("4th year — completed Year 12", 0.82, 26.5, "82% of grade 5"),
      ],
    },
    {
      id: "junior-no-year-12",
      title: "Apprentice electrician pay rates — did not complete Year 12",
      intro: "Same formula at 50%, 60%, 70% and 82% of grade 5. Hourly rates are Schedule B.4.5 exactly.",
      belowMinimumWage: NOT_NMW,
      rows: [
        junior("1st year — not completed Year 12", 0.5, 16.39, "50% of grade 5"),
        junior("2nd year — not completed Year 12", 0.6, 19.55, "60% of grade 5"),
        junior("3rd year — not completed Year 12", 0.7, 22.71, "70% of grade 5"),
        junior("4th year — not completed Year 12", 0.82, 26.5, "82% of grade 5"),
      ],
    },
    {
      id: "adult",
      title: "Adult apprentice electrician pay rates (started on or after 1 January 2014)",
      intro:
        "Year 1: 80% of grade 5, plus the tool allowance and 80% of the industry and licence allowances. Years 2–4: the grade 1 minimum ($1,004.90), plus the tool allowance and 87% of those allowances. Hourly rates are Schedule B.4.1 exactly.",
      belowMinimumWage: NOT_NMW,
      rows: [
        { label: "Adult apprentice — 1st year", weekly: apprenticeWeekly(0.8 * I.grade5, 0.8), hourly: 25.87, casualHourly: null, note: "80% of grade 5" },
        { label: "Adult apprentice — 2nd to 4th year", weekly: apprenticeWeekly(I.grade1, 0.87), hourly: 28.9, casualHourly: null, note: "Grade 1 (EW1) rate" },
      ],
    },
  ],
  penalties: [
    { when: "Ordinary hours (Monday–Friday)", permanent: "100%", casual: "—" },
    { when: "Public holiday", permanent: "250%", casual: "—" },
  ],
  penaltiesNote:
    "Percentages of the apprentice's all-purpose hourly rate (Schedule B.4). Ordinary hours for day workers are Monday to Friday, so weekend work is overtime.",
  overtime: [
    "Overtime is paid on the apprentice's all-purpose hourly rate: 150% for the first 2 hours Monday to Saturday, then 200%; Sunday 200%; public holiday 250% (Schedule B.4).",
    "An apprentice under 18 cannot be required to work overtime or shiftwork unless they want to, and no apprentice may be rostered for overtime that stops them attending training (cl 12.11).",
    "Time at TAFE or other training in the training contract counts as time worked and is paid (cl 12.4).",
  ],
  allowances: [
    { name: "Tool allowance", amount: "$22.31 per week", note: "Paid in full to apprentices, all purposes (cl 16.4(a)(iii), 18.3(g)); included." },
    { name: "Industry allowance", amount: "Same % of $41.41 per week", note: "All purposes (cl 18.3(a)); included." },
    { name: "Electrician's licence allowance", amount: "Same % of $40.29 per week", note: "All purposes (cl 18.3(b)); included, as the Schedule B.4 hourly rates are." },
    { name: "Training fees and textbooks", amount: "Reimbursed", note: "The employer must reimburse TAFE/RTO fees and prescribed textbooks (cl 12.8)." },
  ],
  median: null,
  notices: [
    "Started your apprenticeship before 1 January 2014? Different percentages apply (40%, 52%, 70%, 82% for juniors — cl 16.4(a)(i)); see Schedule B.4.9 of the award.",
  ],
  notShown: [
    "Rates for apprentices who began before 1 January 2014, school-based apprentices (Schedule D) and apprentice shiftworkers.",
    "A market median: Jobs and Skills Australia's electrician median ($2,191 a week) is for qualified adult employees and does not describe apprentice pay.",
  ],
  faqs: [
    {
      q: "How much does a first-year apprentice electrician earn in 2026?",
      a: "A first-year apprentice electrician who completed Year 12 must be paid at least $17.97 an hour ($682.75 a week) under the Electrical, Electronic and Communications Contracting Award from the first full pay period on or after 1 July 2026. Without Year 12 the first-year minimum is $16.39 an hour. Both figures include the tool, industry and licence allowances.",
    },
    {
      q: "What does a fourth-year apprentice electrician get paid?",
      a: "A fourth-year apprentice electrician (82% of the grade 5 rate plus allowances) must be paid at least $26.50 an hour, or $1,006.97 a week, whether or not they finished Year 12.",
    },
    {
      q: "What do adult apprentice electricians get paid?",
      a: "An adult apprentice who started on or after 1 January 2014 gets at least $25.87 an hour in first year and $28.90 an hour from second year, including allowances. An existing employee of at least 6 months (full-time) who becomes an adult apprentice cannot have their minimum wage reduced by starting the apprenticeship (cl 16.4(b)(i)).",
    },
    {
      q: "Can apprentice electricians be casual?",
      a: "The award's schedule of apprentice rates contains no casual apprentice rates. Apprentices are employed under a registered training contract, normally full-time.",
    },
    {
      q: "What does an electrician earn after finishing the apprenticeship?",
      a: "A qualified electrician (grade 5) must be paid at least $31.13 an hour including the industry and tool allowances, or $32.19 with the licence allowance. See the electrician pay rates page for every grade.",
    },
  ],
  sources: [
    { title: "Electrical, Electronic and Communications Contracting Award 2020 [MA000025] — consolidated to 1 July 2026", publisher: "Fair Work Commission", url: awardTextUrl("MA000025") },
    FWO_PAY_GUIDES,
    ANNUAL_WAGE_REVIEW_2026,
  ],
  verifiedOn: JOB_PAY_VERIFIED_ON,
  related: [
    { href: "/job-pay-rates/electrician/", label: "Electrician Pay Rates" },
    { href: "/junior-pay-rates/", label: "Junior Pay Rates" },
    { href: "/first-job-pay-guide/", label: "First Job Pay Guide" },
  ],
};
