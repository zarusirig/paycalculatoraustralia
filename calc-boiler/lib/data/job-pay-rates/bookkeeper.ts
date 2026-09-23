// Bookkeeper — Clerks—Private Sector Award 2020 [MA000002] (T5, wave 3;
// "bookkeeper pay rate" 590/mo, KD 6; "bookkeeper salary" 590/mo AU).
//
// The award has no "bookkeeper" title. Its Schedule A duty lists place
// bookkeeping work across levels: Level 2 (A.3.2(f)) — initial processing and
// recording for reconciliation of accounts, cheques, invoices, payroll data
// and petty cash; Level 3 (A.4.2(a)) — preparing cash payment summaries,
// banking reports and bank statements, maintaining wage and salary records,
// posting journals to ledgers; Level 4 (A.6.2(b)) — preparing financial or tax
// schedules, calculating costings and wage requirements, reconciling accounts
// to balance. Rates from CLERKS_AWARD via ./clerks-common.ts.
//
// Median: Jobs and Skills Australia, ANZSCO 5512 Bookkeepers, $1,400 a week /
// $37 an hour (ABS SEEH May 2025), read 23 September 2026.

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
  anzscoCode: "5512",
  anzscoTitle: "Bookkeepers",
  medianWeekly: 1_400,
  medianHourly: 37,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("5512-bookkeepers"),
};

export const BOOKKEEPER: Occupation = {
  slug: "bookkeeper",
  name: "Bookkeeper",
  plural: "bookkeepers",
  award: CLERKS_AWARD_REF,
  headline: {
    tableId: "clerks",
    label: "Level 3",
    why: "a bookkeeper posting journals to ledgers, preparing bank statements and maintaining wage records — duties the award lists at Level 3",
  },
  coverage: [
    "Bookkeepers employed by private sector businesses — as distinct from self-employed bookkeepers and BAS agents working for their own clients — are covered by the Clerks—Private Sector Award 2020 [MA000002].",
    "The award has no bookkeeper classification; it classifies by duties. Initial processing and recording of account reconciliations, invoices, payroll data and petty cash is Level 2 (Schedule A.3.2(f)). Preparing cash payment summaries, banking reports and bank statements, maintaining wage and salary records and posting journals to ledgers is Level 3 (A.4.2(a)). Preparing financial or tax schedules, calculating costings and wage requirements and reconciling accounts to balance is Level 4 (A.6.2(b)).",
    "Level 3 employees work with only general guidance and can train Level 1 and 2 staff; Level 4 employees need only limited guidance and often supervise lower levels (Schedule A.4.1, A.6.1).",
    CLERKS_COVERAGE_EXCLUSION,
  ],
  tables: [
    {
      id: "clerks",
      title: "Bookkeeper pay rates by Clerks Award level, 2026–27",
      intro:
        "Clerks—Private Sector Award cl 16.1, Table 3, from the first full pay period on or after 1 July 2026. Casual is the hourly rate plus the 25% casual loading.",
      rows: [
        clerksRow("Level 2 — Year 1", "Initial processing and recording of accounts"),
        clerksRow("Level 2 — Year 2"),
        clerksRow("Level 3", "Ledgers, bank statements, wage records"),
        clerksRow("Level 4", "Financial or tax schedules, reconciliations"),
        clerksRow("Level 5"),
      ],
    },
  ],
  penalties: CLERKS_PENALTY_ROWS,
  penaltiesNote: CLERKS_PENALTIES_NOTE,
  overtime: CLERKS_OVERTIME_LINES,
  allowances: CLERKS_ALLOWANCES,
  median: MEDIAN,
  notices: [
    "Self-employed bookkeepers and BAS agents set their own fees; the award applies only to employees.",
  ],
  notShown: [
    "Junior rates (cl 16.4) and annualised wage arrangements (cl 18) — see the Clerks Award page.",
    "Level 5 duty definitions in full (Schedule A.7).",
  ],
  faqs: [
    {
      q: "What is the award rate for a bookkeeper in 2026?",
      a: "A bookkeeper doing Level 3 work under the Clerks—Private Sector Award — posting journals to ledgers, preparing bank statements, maintaining wage records — must be paid at least $31.11 an hour, or $1,182.10 a week, from the first full pay period on or after 1 July 2026. That is $61,469 a year full-time before tax. Level 4 work pays at least $32.67 an hour.",
    },
    {
      q: "What is the casual rate for a bookkeeper?",
      a: "A casual Level 3 bookkeeper earns at least $38.89 an hour, the $31.11 rate plus the 25% casual loading.",
    },
    {
      q: "Which Clerks Award level is a bookkeeper?",
      a: "It depends on the duties. Initial processing of invoices, payroll data and reconciliations is Level 2; posting journals to ledgers and preparing bank statements is Level 3; preparing financial or tax schedules and reconciling accounts to balance is Level 4.",
    },
    {
      q: "Does the award apply to a freelance bookkeeper?",
      a: "No. Awards cover employees. A self-employed bookkeeper or BAS agent working for their own clients sets their own rates.",
    },
    {
      q: "What do bookkeepers actually earn?",
      a: "Jobs and Skills Australia reports median full-time earnings of $1,400 a week for bookkeepers (ABS Survey of Employee Earnings and Hours, May 2025), about $72,800 a year.",
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
    { href: "/job-pay-rates/accountant/", label: "Accountant Pay Rates" },
    { href: "/job-pay-rates/receptionist/", label: "Receptionist Pay Rates" },
    { href: "/contractor-pay-calculator/", label: "Contractor Pay Calculator" },
  ],
};
