// Lawyer — admitted lawyers are AWARD-FREE; law graduates and law clerks are
// covered by the Legal Services Award 2020 [MA000116].
//
// Fair Work Ombudsman, "Award coverage for lawyers and law graduates working
// in law firms" (K600646), read 23 September 2026: "A qualified lawyer working
// at a law firm is award free. They aren't covered by the Legal Services Award
// because there's no classification covering the work they do. They're not
// covered by the Miscellaneous Award because it doesn't cover professional
// employees." and "Law graduates are covered by the Legal Services Award when
// their employer provides legal and legal support services ... They're
// classified as a level 5 employee."
//
// Legal Services Award source: awards.fairwork.gov.au/MA000116.html,
// "incorporates all amendments up to and including 1 July 2026 (PR799280)".
// cl 15.1 weekly/hourly; casual = Schedule B.2.1 ordinary hours column.
// Community legal centres and Aboriginal legal services are outside the award
// (cl 4.3).
//
// The headline is the law graduate rate because it is the only award minimum
// that applies on the path to practice; the page states up front that an
// admitted lawyer's only legal floor is the National Minimum Wage.
//
// Median: Jobs and Skills Australia, ANZSCO 2713 Solicitors, $2,070 a week /
// $56 an hour (ABS SEEH May 2025), read 23 September 2026.

import { EMPLOYMENT } from "../../constants/australian-tax";
import {
  ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  ANNUAL_WAGE_REVIEW_2026,
  JOB_PAY_VERIFIED_ON,
  awardTextUrl,
  casualFromHourly,
  jsaSource,
  jsaUrl,
} from "./common";
import type { MedianEarnings, Occupation } from "./types";

const MEDIAN: MedianEarnings = {
  anzscoCode: "2713",
  anzscoTitle: "Solicitors",
  medianWeekly: 2_070,
  medianHourly: 56,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("2713-solicitors"),
};

export const LAWYER: Occupation = {
  slug: "lawyer",
  name: "Lawyer",
  plural: "lawyers",
  award: {
    name: "Legal Services Award 2020",
    code: "MA000116",
    url: awardTextUrl("MA000116"),
    consolidatedTo: "1 July 2026",
  },
  headline: {
    tableId: "legal-services",
    label: "Level 5 — Law graduate",
    why: "a law graduate doing practical legal training in a law firm (admitted lawyers are award-free)",
  },
  coverage: [
    "Admitted lawyers — solicitors, barristers and legal practitioners — are award-free. The Fair Work Ombudsman's guidance is that a qualified lawyer working at a law firm is not covered by the Legal Services Award, because it has no classification for their work, and is not covered by the Miscellaneous Award, because that award excludes professional employees.",
    "An award-free lawyer is still entitled to the National Minimum Wage and the National Employment Standards. Above that floor, pay is set by the employment contract or an enterprise agreement.",
    "Law graduates are different. A graduate working in a private law firm to complete the training required for admission is covered by the Legal Services Award 2020 [MA000116] and classified at Level 5 — Law graduate. Law clerks are Level 6, and legal secretaries and other support staff are Levels 1 to 5.",
    "The Legal Services Award does not cover community legal centres or Aboriginal legal services (cl 4.3). Lawyers in government are paid under public service agreements.",
  ],
  tables: [
    {
      id: "legal-services",
      title: "Law graduate and law clerk award rates — Legal Services Award",
      intro: "Clause 15.1, from the first full pay period on or after 1 July 2026. Casual rates are Schedule B.2.1 exactly.",
      rows: [
        { label: "Level 5 — Law graduate", weekly: 1291.8, hourly: 33.99, casualHourly: 42.49, note: "Before admission, completing practical legal training" },
        { label: "Level 6 — Law clerk", weekly: 1369.2, hourly: 36.03, casualHourly: 45.04 },
      ],
    },
    {
      id: "admitted",
      title: "The legal minimum for an admitted lawyer (award-free)",
      intro:
        "The National Minimum Wage Order 2026 (PR799279) is the only legal floor for an admitted lawyer. It is not a typical lawyer's salary.",
      rows: [
        {
          label: "National Minimum Wage (adult)",
          weekly: EMPLOYMENT.minimumWageWeekly,
          hourly: EMPLOYMENT.minimumWageHourly,
          casualHourly: casualFromHourly(EMPLOYMENT.minimumWageHourly),
          note: "Admitted lawyers — award-free",
        },
      ],
    },
  ],
  penalties: [
    { when: "Monday–Saturday until 12 noon, outside ordinary hours — first 3 hours", permanent: "150%", casual: "175%" },
    { when: "Monday–Saturday until 12 noon — after 3 hours", permanent: "200%", casual: "225%" },
    { when: "Saturday after 12 noon; Sunday", permanent: "200%", casual: "225%" },
    { when: "Public holiday", permanent: "250%", casual: "275%" },
  ],
  penaltiesNote:
    "These are the Legal Services Award rates for day workers, whose ordinary hours are 7 am to 6.30 pm Monday to Friday (cl 13.1): all other work is overtime (cl 20.2). Admitted, award-free lawyers have no award penalty or overtime rates.",
  overtime: [
    "Law graduates and other Legal Services Award day workers: overtime Monday to Saturday until 12 noon is 150% for the first 3 hours, then 200%; after 12 noon Saturday and Sunday 200%; public holidays 250%, with a 3-hour minimum on weekends and public holidays (cl 20.2).",
    "Admitted lawyers: no award overtime. The NES allows an employer to require reasonable additional hours; whether they are paid depends on the contract.",
  ],
  allowances: [],
  median: MEDIAN,
  notices: [
    "Admitted lawyers are award-free: the $33.99 an hour law graduate rate stops applying once you are admitted and practising, and the only legal floor becomes the National Minimum Wage ($26.44 an hour).",
  ],
  notShown: [
    "A graduate-to-partner salary ladder: no primary source publishes one, and we do not estimate salaries.",
    "Legal secretary and legal support rates (Legal Services Award Levels 1–5 clerical), junior rates and shiftwork rates.",
  ],
  faqs: [
    {
      q: "Is there an award for lawyers in Australia?",
      a: "Not for admitted lawyers. The Fair Work Ombudsman says a qualified lawyer working at a law firm is award-free: the Legal Services Award has no classification for their work and the Miscellaneous Award excludes professional employees. Law graduates and law clerks are covered by the Legal Services Award.",
    },
    {
      q: "What is the minimum pay for a law graduate in 2026?",
      a: "A law graduate in a private law firm is Level 5 under the Legal Services Award and must be paid at least $33.99 an hour, or $1,291.80 a week, from the first full pay period on or after 1 July 2026 — $67,174 a year full-time before tax. A casual law graduate gets at least $42.49 an hour.",
    },
    {
      q: "What is the minimum wage for an admitted lawyer?",
      a: "Because admitted lawyers are award-free, the legal minimum is the National Minimum Wage: $26.44 an hour or $1,004.90 a week for adults from the first full pay period on or after 1 July 2026, plus the National Employment Standards.",
    },
    {
      q: "Do lawyers get paid overtime?",
      a: "Admitted lawyers have no award overtime entitlement; it depends on the employment contract. Law graduates covered by the Legal Services Award get 150% for the first 3 hours of overtime and 200% after that.",
    },
    {
      q: "How much do lawyers actually earn in Australia?",
      a: "Jobs and Skills Australia reports median full-time earnings of $2,070 a week for solicitors (ABS, May 2025), about $107,640 a year. That is a market figure, not a minimum.",
    },
  ],
  sources: [
    { title: "Award coverage for lawyers and law graduates working in law firms (K600646)", publisher: "Fair Work Ombudsman", url: "https://library.fairwork.gov.au/viewer/?krn=K600646" },
    { title: "Legal Services Award 2020 [MA000116] — consolidated to 1 July 2026", publisher: "Fair Work Commission", url: awardTextUrl("MA000116") },
    { title: "National Minimum Wage Order 2026 (PR799279)", publisher: "Fair Work Commission", url: "https://www.fwc.gov.au/documents/awardsandorders/pdf/pr799279.pdf" },
    ANNUAL_WAGE_REVIEW_2026,
    jsaSource(MEDIAN),
  ],
  verifiedOn: JOB_PAY_VERIFIED_ON,
  related: [
    { href: "/minimum-wage-australia/", label: "Minimum Wage Australia" },
    { href: "/job-pay-rates/accountant/", label: "Accountant Pay Rates" },
    { href: "/average-salary-australia/", label: "Average Salary Australia" },
  ],
};
