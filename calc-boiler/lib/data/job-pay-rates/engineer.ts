// Engineer — Professional Employees Award 2020 [MA000065].
//
// Source: awards.fairwork.gov.au/MA000065.html, "incorporates all amendments
// up to and including 1 July 2026 (PR799345)". Read 23 September 2026.
//
// This award sets ANNUAL wages (cl 14.1) and derives the hourly rate as
// (annual x 6/313) / 38 (cl 14.2). We store the award's annual wage in
// `annual`, the award's own weekly equivalent (annual x 6/313, to the cent) in
// `weekly`, and the hourly and casual rates exactly as Schedule C.1 and C.2
// print them. Tests assert the chain.
//
// Classification: a "Graduate engineer" (4 or 5 year degree recognised by
// Engineers Australia, cl 2.2) is Level 1 — Graduate professional, entering at
// pay point 1.1 (4 or 5 year degree). An "Experienced engineer" (membership of
// Engineers Australia, or 4 years' experience after qualifying) sits at level 2
// and above.
//
// ⚠️ Overtime under this award is paid at the ORDINARY minimum hourly rate
// (cl 18.2(a)) — no time-and-a-half. Penalty rates apply only to hours worked
// before 6 am or after 10 pm, on Sundays and on public holidays (cl 18.4).
//
// Median: Jobs and Skills Australia, ANZSCO 2332 Civil Engineering
// Professionals, $2,217 a week / $59 an hour (ABS SEEH May 2025), read
// 23 September 2026. "Engineer" spans several ANZSCO groups; the page names the
// group the median belongs to.

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
  anzscoCode: "2332",
  anzscoTitle: "Civil Engineering Professionals",
  medianWeekly: 2_217,
  medianHourly: 59,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("2332-civil-engineering-professionals"),
};

/** The award's weekly equivalent of an annual wage: annual x 6/313 (cl 14.2). */
export function professionalWeekly(annual: number): number {
  return toCents((annual * 6) / 313);
}

function pro(label: string, annual: number, hourly: number, casualHourly: number, note?: string): RateRow {
  return { label, annual, weekly: professionalWeekly(annual), hourly, casualHourly, ...(note ? { note } : {}) };
}

export const ENGINEER: Occupation = {
  slug: "engineer",
  name: "Engineer",
  plural: "engineers",
  award: {
    name: "Professional Employees Award 2020",
    code: "MA000065",
    url: awardTextUrl("MA000065"),
    consolidatedTo: "1 July 2026",
  },
  headline: {
    tableId: "professional",
    label: "Level 1 Graduate professional — pay point 1.1 (4 or 5 year degree)",
    why: "a graduate engineer with a 4 or 5-year degree recognised by Engineers Australia",
  },
  coverage: [
    "Employees doing professional engineering work are covered by the Professional Employees Award 2020 [MA000065], whichever industry their employer is in. The award covers graduate and experienced engineers, as well as scientists, IT professionals and quality auditors.",
    "A graduate engineer — someone with a 4 or 5-year degree recognised by Engineers Australia — starts at Level 1 pay point 1.1 and moves through pay points 1.2 to 1.4. An experienced engineer (a member of Engineers Australia, or 4 years' professional experience after qualifying) is Level 2, and Levels 3 and 4 cover engineers with greater independence, responsibility and seniority (Schedule A).",
    "The award sets annual salaries. It does not cover engineers in industries with their own award that excludes it — for example electricity, water, rail, black coal mining or state government agencies (cl 4.2) — nor engineers in state or local government covered by another award.",
    "Engineering technicians and draftspersons are not professional engineers and are usually covered by the Manufacturing award or an industry award instead.",
  ],
  tables: [
    {
      id: "professional",
      title: "Engineer pay rates by level, 2026–27",
      intro:
        "Annual wages from clause 14.1. Weekly is the award's own conversion (annual x 6/313); hourly and casual rates are exactly as published in Schedule C.",
      rows: [
        pro("Level 1 Graduate professional — pay point 1.1 (3 year degree)", 66_825, 33.71, 42.14),
        pro("Level 1 Graduate professional — pay point 1.1 (4 or 5 year degree)", 68_538, 34.57, 43.21, "Graduate engineer"),
        pro("Level 1 Graduate professional — pay point 1.2", 69_688, 35.15, 43.94),
        pro("Level 1 Graduate professional — pay point 1.3", 72_590, 36.62, 45.78),
        pro("Level 1 Graduate professional — pay point 1.4", 76_267, 38.47, 48.09),
        pro("Level 2 Experienced professional", 78_836, 39.77, 49.71, "Experienced engineer"),
        pro("Level 3 Professional", 86_157, 43.46, 54.33),
        pro("Level 4 Professional", 97_173, 49.02, 61.28),
      ],
    },
  ],
  penalties: [
    { when: "Monday–Saturday before 6 am or after 10 pm", permanent: "125%", casual: "150%" },
    { when: "Sunday", permanent: "150%", casual: "175%" },
    { when: "Public holiday", permanent: "150%", casual: "175%" },
  ],
  penaltiesNote:
    "Percentages of the minimum hourly rate for hours worked at the employer's direction (cl 18.4, Schedule C). There is no Saturday daytime penalty under this award.",
  overtime: [
    "Hours beyond 38 a week (or an agreed average) are paid at the minimum hourly rate — not time and a half (cl 18.2(a)). Casuals likewise get their casual hourly rate.",
    "Overtime includes call-backs and work done remotely on electronic devices, which must be recorded on a timesheet (cl 18.2).",
    "Time off instead of payment for overtime can be agreed hour for hour (cl 18.3).",
  ],
  allowances: [],
  median: MEDIAN,
  notices: [
    "Overtime under the Professional Employees Award is paid at the ordinary minimum hourly rate, not time and a half (cl 18.2(a)).",
  ],
  notShown: [
    "Level 5 (medical research employees only) and Schedule B medical research classifications.",
    "Enterprise agreement and public service engineer scales.",
  ],
  faqs: [
    {
      q: "What is the award rate for a graduate engineer in 2026?",
      a: "A graduate engineer with a 4 or 5-year degree recognised by Engineers Australia must be paid at least $68,538 a year — $34.57 an hour — under the Professional Employees Award from the first full pay period on or after 1 July 2026. A 3-year degree graduate professional starts at $66,825.",
    },
    {
      q: "What is the minimum salary for an experienced engineer?",
      a: "An experienced engineer (Level 2) must be paid at least $78,836 a year, or $39.77 an hour. Level 3 is $86,157 and Level 4 is $97,173.",
    },
    {
      q: "Do engineers get paid overtime?",
      a: "Under the Professional Employees Award, hours beyond 38 a week must be paid, but only at the ordinary minimum hourly rate — there is no time-and-a-half. Hours worked before 6 am or after 10 pm attract 125%, and Sundays and public holidays 150%.",
    },
    {
      q: "What is the casual rate for an engineer?",
      a: "A casual graduate engineer at pay point 1.1 (4 or 5-year degree) earns at least $43.21 an hour, the $34.57 minimum plus the 25% casual loading (Schedule C.2).",
    },
    {
      q: "What do engineers actually earn in Australia?",
      a: "Jobs and Skills Australia reports median full-time earnings of $2,217 a week for civil engineering professionals (ABS, May 2025), about $115,284 a year — far above the award, because most engineers are paid market salaries. Other engineering disciplines have their own medians.",
    },
  ],
  sources: [
    { title: "Professional Employees Award 2020 [MA000065] — consolidated to 1 July 2026", publisher: "Fair Work Commission", url: awardTextUrl("MA000065") },
    FWO_PAY_GUIDES,
    ANNUAL_WAGE_REVIEW_2026,
    jsaSource(MEDIAN),
  ],
  verifiedOn: JOB_PAY_VERIFIED_ON,
  related: [
    { href: "/tech-salary-guide-australia/", label: "Tech Salary Guide" },
    { href: "/average-salary-australia/", label: "Average Salary Australia" },
    { href: "/salary-vs-hourly/", label: "Salary vs Hourly" },
  ],
};
