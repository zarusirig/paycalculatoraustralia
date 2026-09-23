// Early childhood teacher — Educational Services (Teachers) Award 2020 [MA000077].
//
// Source: awards.fairwork.gov.au/MA000077.html, "incorporates all amendments
// up to and including 1 July 2026 (PR799280)". Read 23 September 2026.
//
// cl 17.1 prints, per level, a weekly rate and annual salary for "preschools
// and schools" and a separate, 4% higher, weekly rate and annual salary for
// "long day care centres" (services open at least 8 hours a day, 48+ weeks a
// year — cl 17.2). Both weekly and annual figures are transcribed verbatim.
// The award prints no permanent hourly rate: hourly = weekly / 38 (ordinary
// hours are 38 a week, Schedule A.1.1), rounded to the cent.
//
// Casual rates: the award pays casuals by day or by 2-hour/4-hour blocks
// (cl 17.5). The per-hour casual figure below is the award's own 2-hour rate
// halved — Schedule B.1.4 (long day care) and B.1.3 (services open fewer than
// 48 weeks). cl 17.5(c) NOTE 2: the "appropriate hourly rate is calculated by
// dividing the relevant full day rate by 7.6", which gives the same figures.
//
// The award has no Sunday or public holiday penalty rate of its own; public
// holidays are dealt with by the NES (cl 28.1). Long day care shift rates are
// Schedule A.5.2.
//
// Median: Jobs and Skills Australia, ANZSCO 2411 Early Childhood (Pre-primary
// School) Teachers, $1,906 a week / $50 an hour (ABS SEEH May 2025), read
// 23 September 2026.

import {
  ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  ANNUAL_WAGE_REVIEW_2026,
  FWO_PAY_GUIDES,
  JOB_PAY_VERIFIED_ON,
  awardTextUrl,
  hourlyFromWeekly,
  jsaSource,
  jsaUrl,
} from "./common";
import type { MedianEarnings, Occupation, RateRow } from "./types";

const MEDIAN: MedianEarnings = {
  anzscoCode: "2411",
  anzscoTitle: "Early Childhood (Pre-primary School) Teachers",
  medianWeekly: 1_906,
  medianHourly: 50,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("2411-early-childhood-pre-primary-school-teachers"),
};

/** weekly and annual from cl 17.1; casual = the award's 2-hour casual rate / 2. */
function t(label: string, weekly: number, annual: number, twoHourCasual: number, note?: string): RateRow {
  return {
    label,
    weekly,
    annual,
    hourly: hourlyFromWeekly(weekly),
    casualHourly: Math.round((twoHourCasual / 2) * 100) / 100,
    ...(note ? { note } : {}),
  };
}

export const EARLY_CHILDHOOD_TEACHER: Occupation = {
  slug: "early-childhood-teacher",
  name: "Early Childhood Teacher",
  plural: "early childhood teachers",
  award: {
    name: "Educational Services (Teachers) Award 2020",
    code: "MA000077",
    url: awardTextUrl("MA000077"),
    consolidatedTo: "1 July 2026",
  },
  headline: {
    tableId: "long-day-care",
    label: "Level 1 — long day care",
    why: "a graduate early childhood teacher in a long day care centre",
  },
  coverage: [
    "University-qualified early childhood teachers in long day care centres, kindergartens and preschools run by national-system employers are covered by the Educational Services (Teachers) Award 2020 [MA000077]. The award expressly excludes aides, assistants and directors in childcare, preschools and long day care who are not university-qualified early childhood teachers (cl 4.4(c)); most of them are covered by the Children's Services Award 2010.",
    "Teachers are classified by accreditation: Level 1 for graduates and teachers with provisional or conditional registration; Level 2 on reaching proficient registration; Levels 3 and 4 after each further 3 years of satisfactory service; Level 5 for Highly Accomplished or Lead Teacher accreditation.",
    "The award pays teachers in long day care 4% more than teachers in preschools and schools, because long day care teachers work year-round and are not covered by the school hours clause (cl 17.2). Both scales are below.",
    "Teachers in government preschools and kindergartens, and in services covered by an enterprise agreement, are paid under that instrument instead.",
  ],
  tables: [
    {
      id: "long-day-care",
      title: "Early childhood teacher pay rates — long day care centres",
      intro:
        "Clause 17.1 long day care weekly rates and annual salaries (services open at least 8 hours a day for 48 weeks or more). Hourly is the weekly rate over 38 hours; casual is the award's 2-hour casual rate halved (Schedule B.1.4).",
      rows: [
        t("Level 1 — long day care", 1513.6, 78_979, 99.58, "Graduate / provisional registration"),
        t("Level 2 — long day care", 1654.4, 86_324, 108.84, "Proficient registration"),
        t("Level 3 — long day care", 1801.0, 93_976, 118.48, "Proficient + 3 years at Level 2"),
        t("Level 4 — long day care", 1947.7, 101_629, 128.14, "Proficient + 3 years at Level 3"),
        t("Level 5 — long day care", 2094.3, 109_279, 137.78, "Highly Accomplished / Lead Teacher"),
      ],
    },
    {
      id: "preschool",
      title: "Early childhood teacher pay rates — preschools and kindergartens",
      intro:
        "Clause 17.1 preschools and schools weekly rates and annual salaries. Casual is the award's 2-hour casual rate for services operating fewer than 48 weeks a year, halved (Schedule B.1.3).",
      rows: [
        t("Level 1 — preschool", 1455.4, 75_941, 95.76),
        t("Level 2 — preschool", 1590.7, 83_004, 104.66),
        t("Level 3 — preschool", 1731.7, 90_362, 113.92),
        t("Level 4 — preschool", 1872.7, 97_720, 123.2),
        t("Level 5 — preschool", 2013.7, 105_076, 132.48),
      ],
    },
  ],
  penalties: [
    { when: "Long day care: early morning shift (starts 5–6 am)", permanent: "110%", casual: "137.5%" },
    { when: "Long day care: afternoon shift (finishes after 6.30 pm)", permanent: "115%", casual: "143.75%" },
    { when: "Long day care: Saturday", permanent: "125%", casual: "156.25%" },
  ],
  penaltiesNote:
    "Percentages of the minimum hourly rate (Schedule A.5.2). A casual's shift and Saturday rate is the same percentage of the casual rate (Schedule B.1.1), shown here as a percentage of the minimum hourly rate. The award sets no separate Sunday or public holiday penalty; public holidays are an NES entitlement (cl 28.1).",
  overtime: [
    "Long day care teachers: 150% for the first 3 hours outside or beyond rostered hours, then 200% (Schedule A.4.1).",
    "A part-time teacher who agrees to extra hours during the service's ordinary opening hours is paid at ordinary time for up to 8 hours a day (A.4.1(b)).",
    "Casuals engaged for fewer than 5 consecutive days are paid no higher than the Level 3 rate (cl 17.5(a)).",
  ],
  allowances: [
    { name: "Director's allowance", amount: "$8,733.22 to $13,137.79 a year", note: "For a full-time teacher appointed director, by number of places — up to 39, 40–59, or more (cl 19.2(b))." },
    { name: "Educational leader allowance", amount: "$4,784.28 a year", note: "For a teacher appointed educational leader (cl 19.4(c))." },
  ],
  median: MEDIAN,
  notices: [
    "Work in long day care? You are entitled to the long day care rate, 4% above the preschool rate — $1,513.60 a week at Level 1, not $1,455.40.",
  ],
  notShown: [
    "Government preschool and kindergarten teacher scales, set by each state.",
    "The Children's Services Award rates for diploma and certificate III educators.",
    "Leadership allowances other than the director and educational leader allowances.",
  ],
  faqs: [
    {
      q: "What is the award rate for an early childhood teacher in 2026?",
      a: "A graduate (Level 1) early childhood teacher in a long day care centre must be paid at least $1,513.60 a week — $78,979 a year, about $39.83 an hour — under the Educational Services (Teachers) Award from the first full pay period on or after 1 July 2026. In a preschool or kindergarten the Level 1 minimum is $1,455.40 a week ($75,941 a year).",
    },
    {
      q: "What is the casual rate for an early childhood teacher?",
      a: "In long day care a casual Level 1 teacher earns at least $99.58 for a 2-hour engagement, or $49.79 an hour (Schedule B.1.4). In services open fewer than 48 weeks a year the Level 1 casual rate is $47.88 an hour.",
    },
    {
      q: "How does an early childhood teacher move up the pay scale?",
      a: "Level 2 ($1,654.40 a week in long day care) applies once you gain proficient teacher registration or accreditation. Levels 3 and 4 follow after each 3 years of satisfactory service, and Level 5 requires Highly Accomplished or Lead Teacher accreditation.",
    },
    {
      q: "Why do long day care teachers get paid more than preschool teachers?",
      a: "The award adds 4% to the preschool and school rates for teachers in services open at least 8 hours a day for 48 weeks or more, because they are not covered by the school hours provisions (cl 17.2).",
    },
    {
      q: "What do early childhood teachers actually earn in Australia?",
      a: "Jobs and Skills Australia reports median full-time earnings of $1,906 a week for early childhood (pre-primary school) teachers (ABS, May 2025), about $99,112 a year. That includes teachers on state and enterprise agreements.",
    },
  ],
  sources: [
    { title: "Educational Services (Teachers) Award 2020 [MA000077] — consolidated to 1 July 2026", publisher: "Fair Work Commission", url: awardTextUrl("MA000077") },
    FWO_PAY_GUIDES,
    ANNUAL_WAGE_REVIEW_2026,
    jsaSource(MEDIAN),
  ],
  verifiedOn: JOB_PAY_VERIFIED_ON,
  related: [
    { href: "/teacher-pay-australia/", label: "Teacher Pay Australia" },
    { href: "/job-pay-rates/teacher-aide/", label: "Teacher Aide Pay Rates" },
    { href: "/salary-packaging-guide/", label: "Salary Packaging Guide" },
  ],
};
