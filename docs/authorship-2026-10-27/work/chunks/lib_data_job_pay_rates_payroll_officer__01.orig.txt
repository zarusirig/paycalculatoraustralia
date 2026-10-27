// Payroll officer — Clerks—Private Sector Award 2020 [MA000002] (J8, 9 Oct
// 2026). Search demand: "payroll officer salary" 480 a month (AU).
//
// The award has no payroll officer title. Its Schedule A duty lists place
// payroll work at four levels — read from the consolidated award
// (awards.fairwork.gov.au/MA000002.html, "incorporates all amendments up to
// and including 1 July 2026 (PR799280 …)") on 9 October 2026:
//   Level 2, A.3.2(f)(v) and (g)(iv): "maintenance of records or journals …
//     including initial processing and recording relating to … payroll data";
//     computer applications including an "accounting or payroll file".
//   Level 3, A.4.2(a): "calculating and maintaining wage and salary records".
//   Level 4, A.6.2(b)–(c): "calculate costings, wage or salary requirements;
//     complete personnel or payroll data for authorisation"; advising on
//     "employment conditions", "workers compensation procedures and
//     regulations", "superannuation entitlements, procedures and regulations".
//   Level 5, A.7.2(d): "administering individual executive salary packages,
//     travel expenses, allowances and company transport; administering salary
//     and payroll requirements of the organisation".
// Characteristics: Level 3 needs only general guidance (A.4.1), Level 4
// limited guidance and often supervises (A.6.1), Level 5 broad guidance and
// may hold relevant post-secondary qualifications (A.7.1).
//
// Rates, penalties, overtime and allowances come from CLERKS_AWARD via
// ./clerks-common.ts (the data behind /clerks-award-rates/ and the bookkeeper
// and receptionist pages).
//
// Median: Jobs and Skills Australia, ANZSCO 5513 Payroll Clerks, $1,606 a week
// / $44 an hour (ABS SEEH May 2025), read 9 October 2026.

import {
  ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  ANNUAL_WAGE_REVIEW_2026,
  FWO_PAY_GUIDES,
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
import { annual52, money0, money2 } from "./j8-common";
import type { MedianEarnings, Occupation } from "./types";

const PAYROLL_MEDIAN: MedianEarnings = {
  anzscoCode: "5513",
  anzscoTitle: "Payroll Clerks",
  medianWeekly: 1_606,
  medianHourly: 44,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("5513-payroll-clerks"),
};

export const PO_L2Y1 = clerksRow("Level 2 — Year 1", "Payroll data entry and initial processing");
export const PO_L2Y2 = clerksRow("Level 2 — Year 2");
export const PO_L3 = clerksRow("Level 3", "Calculates and maintains wage and salary records");
export const PO_L4 = clerksRow("Level 4", "Calculates wage requirements; prepares payroll for authorisation; advises on conditions and super");
export const PO_L5 = clerksRow("Level 5", "Administers the organisation's salary and payroll requirements");

export const PAYROLL_OFFICER: Occupation = {
  slug: "payroll-officer",
  name: "Payroll Officer",
  metaTerm: "salary",
  plural: "payroll officers",
  metaTitle: `Payroll Officer Salary Australia 2026 - ${money2(PO_L3.hourly)}/hr Award Minimum`,
  award: CLERKS_AWARD_REF,
  headline: {
    tableId: "payroll",
    label: PO_L3.label,
    why: "a payroll officer who calculates and maintains wage and salary records, a duty the award lists at Level 3",
  },
  coverage: [
    "Payroll officers and payroll clerks employed by private sector businesses are covered by the Clerks—Private Sector Award 2020 [MA000002], unless their employer's own industry award has clerical classifications.",
    "The award has no payroll officer classification. It classifies by duties, and payroll appears at four levels. Initial processing and recording of payroll data, and working in a payroll file, is Level 2 (Schedule A.3.2). Calculating and maintaining wage and salary records is Level 3 (A.4.2(a)). Calculating wage or salary requirements, completing payroll data for authorisation, and advising on employment conditions, workers compensation and superannuation is Level 4 (A.6.2). Administering the organisation's salary and payroll requirements, including executive salary packages and allowances, is Level 5 (A.7.2).",
    "The level also depends on supervision: Level 3 works with only general guidance, Level 4 with limited guidance and often supervises others, and Level 5 under broad direction with responsibility for others' work (A.4.1, A.6.1, A.7.1).",
    CLERKS_COVERAGE_EXCLUSION,
  ],
  tables: [
    {
      id: "payroll",
      title: "Payroll officer pay rates by Clerks Award level, 2026–27",
      intro:
        "Clerks—Private Sector Award cl 16.1, Table 3, from the first full pay period on or after 1 July 2026. Casual is the hourly rate plus the 25% casual loading. The duty notes are the payroll tasks Schedule A lists at each level.",
      rows: [PO_L2Y1, PO_L2Y2, PO_L3, PO_L4, PO_L5],
    },
  ],
  penalties: CLERKS_PENALTY_ROWS,
  penaltiesNote: CLERKS_PENALTIES_NOTE,
  overtime: CLERKS_OVERTIME_LINES,
  allowances: CLERKS_ALLOWANCES,
  median: PAYROLL_MEDIAN,
  notices: [
    "Payroll officers in hospitals, aged care, hotels, councils and the public service are usually paid under a different award or an agreement, because those industries have their own clerical classifications.",
  ],
  notShown: [
    "Junior rates (cl 16.4) and annualised wage arrangements (cl 18): see the Clerks Award page.",
    "Payroll manager salaries above Level 5, which are set by contract.",
    "Industry awards with their own clerical scales, such as the Health Professionals and Support Services Award and the Local Government Industry Award.",
  ],
  lede: `A payroll officer who calculates and maintains wage and salary records is Level 3 under the Clerks Award: at least ${money2(PO_L3.hourly)} an hour or ${money2(PO_L3.weekly)} a week from 1 July 2026, with Level 4 at ${money2(PO_L4.hourly)} for payroll that is prepared for authorisation and Level 5 at ${money2(PO_L5.hourly)} for running the organisation's payroll. The award has no payroll officer title; it places payroll duties at four levels, and the median payroll clerk earns well above all of them.`,
  sections: [
    {
      id: "year-ahead",
      heading: "Payroll in 2026-27: what changed on 1 July and what comes next",
      paragraphs: [
        "The 2026-27 year rewrote more of a payroll officer's reference material than most. From 1 July 2026 the superannuation guarantee must be paid with each pay run under Payday Super, rather than within 28 days of the end of each quarter, so the SG line moves from a quarterly reconciliation to a per-pay calculation on the same cycle as PAYG withholding. On the same date the ATO reissued all 15 withholding schedules and 12 tax tables to carry the Treasury Laws Amendment (More Cost of Living Relief) Act 2025: the 16% rate on income between $18,201 and $45,000 fell to 15%, the Medicare levy low-income thresholds rose, and the repayment income thresholds for study and training support loans were indexed. A pay dated on or after 1 July 2026 takes the new tables even where the work was done in June.",
        "The study loan tables are where payroll most often goes wrong. The 2026-27 fortnightly study and training support loans table (NAT 2185) applies a loan component only once fortnightly income reaches $2,674 for a payee who claims the tax-free threshold, or $1,974 for one who does not; the weekly table (NAT 2173) starts at $1,337 and $987, and the monthly table (NAT 2186) at $5,793.67 and $4,277.00. The component is withheld on all earnings including taxable allowances, bonuses and commissions, but not from lump sum termination payments. Schedule 5, the table for back payments, commissions and bonuses, was reissued at the same time.",
        "Two dates are already in the 2026-27 diary. From the first full pay period on or after 1 December 2026, employees aged 18 to 20 with more than six months' service under the retail, fast food and pharmacy awards move onto a new junior rate schedule, the first step of a phase-in to the adult rate. And from 1 July 2027 the 15% rate falls to 14% and a $250 Working Australians Tax Offset starts, which means another full reissue of the withholding schedules twelve months after this one.",
      ],
    },
    {
      id: "workforce",
      heading: "How many payroll officers there are, and where they work",
      paragraphs: [
        "Jobs and Skills Australia's profile for unit group 5513, Payroll Clerks, counts 51,700 people employed on the ABS Labour Force Survey's 2025 four-quarter average, with annual employment growth of about 1,100. It is a part-time friendly occupation: 71% work full-time hours and the part-time share is 29%, against 69% and 31% for all occupations, and the average full-time week is 41 hours, three hours shorter than the all-occupations 44. Women are 84% of payroll clerks against 48% of all workers, and the median age is 46 against 39.",
        "The $1,606 median above is the full-time employee median on the May 2025 Survey of Employee Earnings and Hours, and the median hourly rate is $44, three dollars below the all-occupations $47. The biggest employing industries are health care and social assistance, public administration and safety, and construction, which is also why so many payroll officers are paid under an industry award or agreement rather than the Clerks Award. By state the work is concentrated in New South Wales (28.3%), Queensland (27.9%) and Victoria (23.0%), with Western Australia at 10.3%, South Australia at 6.5% and Tasmania at 1.6%. Jobs and Skills Australia lists interpreting industrial awards among the occupation's core tasks, alongside preparing payroll from timesheets, processing wages and salaries, and maintaining superannuation and deduction records.",
      ],
    },
  ],
  faqs: [
    {
      q: "Is payroll officer a growing occupation?",
      a: "Jobs and Skills Australia projects employment of payroll clerks to grow by about 1,100 a year from a base of 51,700 (ABS Labour Force Survey, 2025 four-quarter average). The occupation is 84% female with a median age of 46, 71% of payroll clerks work full-time hours, and the biggest employing industries are health care and social assistance, public administration and safety, and construction.",
    },
    {
      q: "What changed for payroll on 1 July 2026?",
      a: "Payday Super began, so the superannuation guarantee is paid with each pay run instead of quarterly, and the ATO reissued all 15 withholding schedules and 12 tax tables to carry the 15% rate on income between $18,201 and $45,000, higher Medicare levy low-income thresholds and indexed study loan repayment thresholds. A pay dated on or after 1 July 2026 uses the new tables, and the 2026-27 fortnightly study loan table starts withholding at $2,674 of fortnightly income for a payee who claims the tax-free threshold.",
    },
    {
      q: "What is the award rate for a payroll officer in 2026?",
      a: `A payroll officer who calculates and maintains wage and salary records is Level 3 under the Clerks—Private Sector Award: at least ${money2(PO_L3.hourly)} an hour or ${money2(PO_L3.weekly)} a week from the first full pay period on or after 1 July 2026, about ${money0(annual52(PO_L3.weekly))} a year full-time before tax. Level 4 payroll work pays at least ${money2(PO_L4.hourly)} an hour and Level 5 ${money2(PO_L5.hourly)}.`,
    },
    {
      q: "What is the casual rate for a payroll officer?",
      a: `A casual Level 3 payroll officer earns at least ${money2(PO_L3.casualHourly ?? 0)} an hour, the ${money2(PO_L3.hourly)} rate plus the 25% casual loading.`,
    },
    {
      q: "Which Clerks Award level is a payroll officer?",
      a: "It depends on the payroll duties. Entering and processing payroll data is Level 2; calculating and maintaining wage and salary records is Level 3; calculating wage requirements, preparing payroll for authorisation and advising on employment conditions, workers compensation and super is Level 4; administering the organisation's whole salary and payroll function is Level 5.",
    },
    {
      q: "Is a payroll officer in a hospital or council paid under the Clerks Award?",
      a: "Usually not. The Clerks Award does not apply where the employer's industry award has its own clerical classifications, such as health, aged care and hospitality, and council and public service payroll staff are generally paid under their own award or enterprise agreement.",
    },
    {
      q: "What do payroll officers actually earn?",
      a: `Jobs and Skills Australia reports median full-time earnings of $1,606 a week for payroll clerks (ABS, May 2025), about ${money0(annual52(1_606))} a year before tax, above the award's Level 5 minimum of ${money2(PO_L5.weekly)} a week.`,
    },
  ],
  sources: [
    { title: CLERKS_SOURCE_TITLE, publisher: "Fair Work Commission", url: CLERKS_AWARD_REF.url },
    FWO_PAY_GUIDES,
    ANNUAL_WAGE_REVIEW_2026,
    jsaSource(PAYROLL_MEDIAN),
  ],
  verifiedOn: "9 October 2026",
  related: [
    { href: "/clerks-award-rates/", label: "Clerks Award Pay Rates" },
    { href: "/job-pay-rates/bookkeeper/", label: "Bookkeeper Pay Rates" },
    { href: "/payg-withholding-tables/", label: "PAYG Withholding Tables" },
  ],
};
