// Teacher aide — Educational Services (Schools) General Staff Award 2020
// [MA000076], for non-government (independent and Catholic) schools.
//
// Source: awards.fairwork.gov.au/MA000076.html, "incorporates all amendments
// up to and including 1 July 2026 (PR799280)". Read 23 September 2026.
// cl 17.1 prints annual salary, weekly and hourly for each pay point; casual =
// Schedule B.2.1 ordinary hours column exactly. The annual salary is weekly x
// 52.18 (cl 17.1 footnote), so it is stored in `annual`.
//
// Classification (Schedule A, cl 17.2(c)): "Classroom support services grade 1"
// commences at Level 1.3 and grade 2 at Level 2.1; both list "Occupational
// equivalent: teacher aide/assistant, integration aide/assistant". Grade 3
// (Level 3.1) is the student services co-ordinator level. Level 2 duties
// typically require Year 12, or a Certificate I or II with work-related
// experience (A.2.2(d)).
//
// Government school teacher aides (education assistants, school learning
// support officers) are state public servants under state instruments, which
// this award does not cover.
//
// ⚠️ TERM-TIME PAY: cl 12.2 lets a contract provide for leave without pay in
// non-term weeks, with an adjusted annual salary of annual x (working weeks + 4)
// / 52.18. The award's own example: Level 3.1, 39.4 term weeks → $48,601.
//
// Median: Jobs and Skills Australia, ANZSCO 4221 Education Aides, $1,342 a week
// / $37 an hour (ABS SEEH May 2025), read 23 September 2026.

import {
  ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  ANNUAL_WAGE_REVIEW_2026,
  FWO_PAY_GUIDES,
  JOB_PAY_VERIFIED_ON,
  awardTextUrl,
  jsaSource,
  jsaUrl,
} from "./common";
import type { MedianEarnings, Occupation, RateRow } from "./types";

const MEDIAN: MedianEarnings = {
  anzscoCode: "4221",
  anzscoTitle: "Education Aides",
  medianWeekly: 1_342,
  medianHourly: 37,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("4221-education-aides"),
};

function lvl(label: string, annual: number, weekly: number, hourly: number, casualHourly: number, note?: string): RateRow {
  return { label, annual, weekly, hourly, casualHourly, ...(note ? { note } : {}) };
}

export const TEACHER_AIDE: Occupation = {
  slug: "teacher-aide",
  name: "Teacher Aide",
  plural: "teacher aides",
  award: {
    name: "Educational Services (Schools) General Staff Award 2020",
    code: "MA000076",
    url: awardTextUrl("MA000076"),
    consolidatedTo: "1 July 2026",
  },
  headline: {
    tableId: "classroom-support",
    label: "Level 2.1",
    why: "a teacher aide in a non-government school at classroom support services grade 2",
  },
  coverage: [
    "Teacher aides, integration aides and classroom assistants in non-government schools — independent and Catholic — are covered by the Educational Services (Schools) General Staff Award 2020 [MA000076]. The award calls the role classroom support services.",
    "A teacher aide starts at Level 1.3 (classroom support grade 1: general assistance to teachers under direct supervision) or Level 2.1 (grade 2: helping with the educational program with some discretion; typically Year 12, or a Certificate I or II with relevant experience). Level 3 covers more senior roles such as a student services co-ordinator. Staff move up a pay point within a level after each year, subject to a performance review (cl 17.2).",
    "Teacher aides in government schools — called education assistants, school learning support officers or teacher assistants depending on the state — are state public sector employees paid under their state's own award or agreement, which this award does not cover.",
    "Many schools employ aides for school terms only. The award allows a contract to provide unpaid leave in non-term weeks, with the annual salary reduced in proportion to the weeks worked plus 4 weeks' annual leave (cl 12.2).",
  ],
  tables: [
    {
      id: "classroom-support",
      title: "Teacher aide pay rates — non-government schools, 2026–27",
      intro:
        "Clause 17.1: annual salary (weekly x 52.18), weekly and hourly minimums exactly as published. Casual rates are Schedule B.2.1 exactly.",
      rows: [
        lvl("Level 1.3", 55_582, 1065.2, 28.03, 35.04, "Classroom support grade 1 — starting point"),
        lvl("Level 2.1", 55_994, 1073.1, 28.24, 35.3, "Classroom support grade 2 — starting point"),
        lvl("Level 2.2", 57_722, 1106.2, 29.11, 36.39),
        lvl("Level 3.1", 58_436, 1119.9, 29.47, 36.84, "Classroom support grade 3"),
        lvl("Level 3.2", 59_480, 1139.9, 30.0, 37.5),
        lvl("Level 4.1", 61_682, 1182.1, 31.11, 38.89),
        lvl("Level 4.2", 64_776, 1241.4, 32.67, 40.84),
      ],
    },
  ],
  penalties: [
    { when: "Saturday (ordinary hours)", permanent: "150%", casual: "175%" },
    { when: "Sunday (ordinary hours)", permanent: "200%", casual: "225%" },
    { when: "Public holiday", permanent: "250%", casual: "275%" },
  ],
  penaltiesNote:
    "Percentages of the minimum hourly rate from Schedule B.1.1 and B.2.1 (the column for employees other than cooking/catering and boarding staff).",
  overtime: [
    "Monday to Friday: 150% for the first 3 hours, then 200% (Schedule B.1.3).",
    "Saturday: 150% for the first 3 hours, then 200%. Sunday: 200%. Public holiday: 250%.",
  ],
  allowances: [],
  median: MEDIAN,
  notices: [
    "Paid for school terms only? Under cl 12.2 your adjusted salary is the annual rate x (weeks worked + 4 weeks' leave) / 52.18. The award's example: Level 3.1 over 39.4 term weeks is $48,601 a year, not $58,436.",
  ],
  notShown: [
    "Government school teacher aide scales, which are set by each state.",
    "Levels 5 to 8 (senior administration and specialist roles) and junior rates.",
  ],
  faqs: [
    {
      q: "What is the award rate for a teacher aide in 2026?",
      a: "In a non-government school, a teacher aide at classroom support grade 2 (Level 2.1) must be paid at least $28.24 an hour, or $1,073.10 a week, from the first full pay period on or after 1 July 2026 — $55,994 a year full-time over 52.18 weeks. A grade 1 aide starts at Level 1.3, $28.03 an hour.",
    },
    {
      q: "What is the casual rate for a teacher aide?",
      a: "A casual Level 2.1 teacher aide earns at least $35.30 an hour, the $28.24 rate plus the 25% casual loading (Schedule B.2.1).",
    },
    {
      q: "Do teacher aides get paid in the school holidays?",
      a: "It depends on the contract. Under the award a school can employ an aide on a term-time basis with unpaid leave in non-term weeks, in which case the annual salary is reduced to reflect the weeks worked plus 4 weeks' paid annual leave (cl 12.2). Otherwise the aide is paid all year.",
    },
    {
      q: "Are government school teacher aides paid under this award?",
      a: "No. Teacher aides in government schools are state public sector employees paid under their state's award or enterprise agreement. This award covers independent and Catholic schools.",
    },
    {
      q: "What do teacher aides actually earn in Australia?",
      a: "Jobs and Skills Australia reports median full-time earnings of $1,342 a week for education aides (ABS, May 2025). Many aides work part-time or term-time only, so their annual pay is lower.",
    },
  ],
  sources: [
    { title: "Educational Services (Schools) General Staff Award 2020 [MA000076] — consolidated to 1 July 2026", publisher: "Fair Work Commission", url: awardTextUrl("MA000076") },
    FWO_PAY_GUIDES,
    ANNUAL_WAGE_REVIEW_2026,
    jsaSource(MEDIAN),
  ],
  verifiedOn: JOB_PAY_VERIFIED_ON,
  related: [
    { href: "/teacher-pay-australia/", label: "Teacher Pay Australia" },
    { href: "/public-service-pay-scales/", label: "Public Service Pay Scales" },
    { href: "/pro-rata-salary-calculator/", label: "Pro Rata Salary Calculator" },
  ],
};
