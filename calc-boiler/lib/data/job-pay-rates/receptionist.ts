// Receptionist — Clerks—Private Sector Award 2020 [MA000002] (T5, wave 3;
// "receptionist salary" / "receptionist pay rate" 480/mo AU each).
//
// Classification: Schedule A.2.2(a) puts "reception or switchboard duties"
// (directing callers, issuing standard forms, relaying information, greeting
// visitors) at Level 1; A.3.2(a) puts those duties plus responding to enquiries
// using knowledge of the organisation's operations at Level 2. Level 1 and 2
// progress by year of service (cl 16.2). Rates from CLERKS_AWARD via
// ./clerks-common.ts.
//
// Medical receptionists have their own page (HPSS award).
//
// Median: Jobs and Skills Australia, ANZSCO 5421 Receptionists, $1,229 a week /
// $32 an hour (ABS SEEH May 2025), read 23 September 2026.

import {
  ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  ANNUAL_WAGE_REVIEW_2026,
  FWO_PAY_GUIDES,
  JOB_PAY_VERIFIED_ON,
  jsaSource,
  jsaUrl,
} from "./common";
import {
  CLERKS_ALLOWANCES,
  CLERKS_AWARD_REF,
  CLERKS_COVERAGE_EXCLUSION,
  CLERKS_OVERTIME_LINES,
  CLERKS_PENALTIES_NOTE,
  CLERKS_PENALTY_ROWS,
  CLERKS_SOURCE_TITLE,
  clerksRow,
} from "./clerks-common";
import type { MedianEarnings, Occupation } from "./types";

const MEDIAN: MedianEarnings = {
  anzscoCode: "5421",
  anzscoTitle: "Receptionists",
  medianWeekly: 1_229,
  medianHourly: 32,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("5421-receptionists"),
};

export const RECEPTIONIST: Occupation = {
  slug: "receptionist",
  name: "Receptionist",
  plural: "receptionists",
  award: CLERKS_AWARD_REF,
  headline: {
    tableId: "clerks",
    label: "Level 1 — Year 1",
    why: "a receptionist in their first year, doing the reception and switchboard duties the award lists at Level 1",
  },
  coverage: [
    "Receptionists in offices, professional firms and other private sector businesses are covered by the Clerks—Private Sector Award 2020 [MA000002].",
    "The award lists reception and switchboard duties — directing callers, issuing and receiving standard forms, relaying internal information and greeting visitors — at Level 1 (Schedule A.2.2). A receptionist who also responds to enquiries using knowledge of the organisation's operations and services is Level 2 (Schedule A.3.2). Receptionists who screen calls, manage appointments and itineraries for others, or give specialised advice can be Level 3.",
    "Levels 1 and 2 go up by year of service. Reception or clerical experience with a previous employer counts towards a year (cl 16.2), so an experienced receptionist does not start again at Year 1.",
    CLERKS_COVERAGE_EXCLUSION,
  ],
  tables: [
    {
      id: "clerks",
      title: "Receptionist pay rates, 2026–27",
      intro:
        "Clerks—Private Sector Award cl 16.1, Table 3, from the first full pay period on or after 1 July 2026. Casual is the hourly rate plus the 25% casual loading.",
      rows: [
        clerksRow("Level 1 — Year 1", "Reception, switchboard, greeting visitors"),
        clerksRow("Level 1 — Year 2"),
        clerksRow("Level 1 — Year 3"),
        clerksRow("Level 2 — Year 1", "Reception plus responding to enquiries"),
        clerksRow("Level 2 — Year 2"),
        clerksRow("Level 3", "Screening calls, appointments, specialised advice"),
      ],
    },
  ],
  penalties: CLERKS_PENALTY_ROWS,
  penaltiesNote: CLERKS_PENALTIES_NOTE,
  overtime: CLERKS_OVERTIME_LINES,
  allowances: CLERKS_ALLOWANCES,
  median: MEDIAN,
  notices: [
    "A receptionist at a medical, dental or allied health practice is covered by a different award. See the medical receptionist page.",
  ],
  notShown: [
    "Junior rates (cl 16.4) — see the Clerks Award page.",
    "Shiftwork rates (Part 6) and call centre classifications.",
  ],
  faqs: [
    {
      q: "What is the award rate for a receptionist in 2026?",
      a: "A first-year receptionist (Clerks Award Level 1, Year 1) must be paid at least $26.97 an hour, or $1,024.70 a week, from the first full pay period on or after 1 July 2026 — $53,284 a year full-time before tax. It rises to $29.11 an hour by Level 1 Year 3, and a Level 2 receptionist starts on $29.45.",
    },
    {
      q: "What is the casual rate for a receptionist?",
      a: "A casual Level 1 Year 1 receptionist earns at least $33.71 an hour, the $26.97 rate plus the 25% casual loading. On Saturday a casual gets 150% of the minimum hourly rate ($40.46).",
    },
    {
      q: "Does previous experience count for a receptionist's pay level?",
      a: "Yes. Under the Clerks Award, service at the classification level — including administrative and clerical experience with a previous employer — counts towards a year of service (cl 16.2). So a receptionist with two years of prior Level 1 experience would be in their third year at Level 1, not the first.",
    },
    {
      q: "Are medical receptionists paid under the Clerks Award?",
      a: "No. Receptionists at medical and health practices are covered by the Health Professionals and Support Services Award, which has its own rates. See the medical receptionist page.",
    },
    {
      q: "What do receptionists actually earn?",
      a: "Jobs and Skills Australia reports median full-time earnings of $1,229 a week for receptionists (ABS Survey of Employee Earnings and Hours, May 2025), about $63,908 a year.",
    },
  ],
  sources: [
    { title: CLERKS_SOURCE_TITLE, publisher: "Fair Work Commission", url: CLERKS_AWARD_REF.url },
    FWO_PAY_GUIDES,
    ANNUAL_WAGE_REVIEW_2026,
    jsaSource(MEDIAN),
  ],
  verifiedOn: JOB_PAY_VERIFIED_ON,
  related: [
    { href: "/clerks-award-rates/", label: "Clerks Award Pay Rates" },
    { href: "/job-pay-rates/medical-receptionist/", label: "Medical Receptionist Pay Rates" },
    { href: "/job-pay-rates/bookkeeper/", label: "Bookkeeper Pay Rates" },
    { href: "/weekly-pay-calculator/", label: "Weekly Pay Calculator" },
  ],
};
