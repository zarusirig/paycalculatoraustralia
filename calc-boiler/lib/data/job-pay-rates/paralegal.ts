// Paralegal — Legal Services Award 2020 [MA000116].
//
// Occupation: ABS, OSCA 2024 v1.0, "521234 Law Clerk — Performs specialised
// clerical work associated with legal practice and law courts. Alternative
// titles: Legal Assistant; Paralegal." Read 9 October 2026. The ATO's 2023–24
// coding (ANZSCO-based) has the same occupation as "599214 Clerk - law".
//
// Award: awards.fairwork.gov.au/MA000116.html, "incorporates all amendments up
// to and including 1 July 2026 (PR799280, PR799396 and PR799551)", read
// 9 October 2026. The award does not use the word "paralegal". It covers
// employers in the legal services industry ("providing legal and legal support
// services", cl 4.2) except community legal centres, Aboriginal legal services
// and employers whose primary activity is not legal services (cl 4.3).
// cl 2 "law clerk": "a clerk who is engaged for the major part of their time in
// interviewing clients, preparing documents and general work assisting a
// barrister or solicitor in their practice", excluding account clerks, law
// graduates, titles office clerks, receptionists and employees principally
// engaged in word processing, filing, document delivery or routine duties.
// cl 15.1 weekly/hourly (from the first full pay period on or after 1 July
// 2026):
//   Level 1–5 Legal clerical and administrative employee 1073.10/28.24,
//   1119.10/29.45, 1182.10/31.11, 1241.40/32.67, 1291.80/33.99;
//   Level 6 Law clerk 1369.20/36.03.
// Casual = Schedule B.2.1 125% column: 35.30, 36.81, 38.89, 40.84, 42.49, 45.04.
// cl 16.1 paid fortnightly unless otherwise agreed; cl 17 annualised wage
// (written, reconciled each 12 months, shortfall paid within 14 days);
// cl 18.2 meal allowance $20.75 (+$16.54 after 4 hours of overtime);
// cl 18.3 uniform allowance $3.75 a week; cl 18.4 vehicle $1.00/km car,
// $0.34/km motorcycle; cl 20.2 overtime 150% first 3 hours then 200%,
// Saturday after noon and Sunday 200%, public holiday 250% (casual +25%);
// cl 20.3(b) part-hours rounded to the half hour; cl 22.5 17.5% leave loading.
//
// ATO: Taxation statistics 2023–24, Individuals Table 15A (data.gov.au,
// ts24individual15occupationsex.xlsx), Total rows, read 9 October 2026:
//   599214 Clerk - law          13,221 | avg TI 71,193 | med TI 63,617 | avg S/W 66,297 | med S/W 62,615
//   599112 Legal executive      12,004 | avg TI 75,872 | med TI 61,205 | avg S/W 69,848 | med S/W 60,265
//   521212 Legal secretary      12,072 | avg TI 66,205 | med TI 64,413 | avg S/W 62,076 | med S/W 63,448
//
// JSA: ANZSCO 5992 Court and Legal Clerks, median full-time earnings $1,345 a
// week, $35 an hour (ABS SEEH May 2025), all occupations $1,852, read
// 9 October 2026. The group includes clerks of court, bailiffs, court
// orderlies and trust officers as well as law clerks.

import {
  ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  ANNUAL_WAGE_REVIEW_2026,
  ATO_TABLE_15,
  ATO_TAXSTATS_INCOME_YEAR,
  awardTextUrl,
  jsaSource,
  jsaUrl,
} from "./common";
import { LAWYER } from "./lawyer";
import {
  FWO_PAY_SLIPS,
  PAYSLIP_SUPER_AND_DEDUCTIONS,
  PROFESSIONAL_VERIFIED_ON,
  aud,
  aud2,
  netAnnual,
  netFortnightly,
} from "./professional-common";
import type { AtoOccupationStats, MedianEarnings, Occupation, RateRow } from "./types";

const MEDIAN: MedianEarnings = {
  anzscoCode: "5992",
  anzscoTitle: "Court and Legal Clerks",
  medianWeekly: 1_345,
  medianHourly: 35,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("5992-court-and-legal-clerks"),
};

export const PARALEGAL_ATO: AtoOccupationStats = {
  incomeYear: ATO_TAXSTATS_INCOME_YEAR,
  intro:
    "The ABS lists paralegal as another title for law clerk, which the ATO codes as \"Clerk - law\". Legal executives and legal secretaries do overlapping work in many firms and are shown for comparison.",
  rows: [
    { code: "599214", title: "Clerk - law", individuals: 13_221, avgTaxableIncome: 71_193, medianTaxableIncome: 63_617, avgSalary: 66_297, medianSalary: 62_615 },
    { code: "599112", title: "Legal executive", individuals: 12_004, avgTaxableIncome: 75_872, medianTaxableIncome: 61_205, avgSalary: 69_848, medianSalary: 60_265 },
    { code: "521212", title: "Legal secretary", individuals: 12_072, avgTaxableIncome: 66_205, medianTaxableIncome: 64_413, avgSalary: 62_076, medianSalary: 63_448 },
  ],
};

export const LAW_CLERK_LABEL = "Level 6 — Law clerk";

const LEGAL_ROWS: RateRow[] = [
  { label: "Level 1 — Legal clerical and administrative employee", weekly: 1073.1, hourly: 28.24, casualHourly: 35.3 },
  { label: "Level 2 — Legal clerical and administrative employee", weekly: 1119.1, hourly: 29.45, casualHourly: 36.81 },
  { label: "Level 3 — Legal clerical and administrative employee", weekly: 1182.1, hourly: 31.11, casualHourly: 38.89 },
  { label: "Level 4 — Legal clerical and administrative employee", weekly: 1241.4, hourly: 32.67, casualHourly: 40.84 },
  { label: "Level 5 — Legal clerical and administrative employee", weekly: 1291.8, hourly: 33.99, casualHourly: 42.49 },
  {
    label: LAW_CLERK_LABEL,
    weekly: 1369.2,
    hourly: 36.03,
    casualHourly: 45.04,
    note: "Mostly interviewing clients, preparing documents and assisting a solicitor or barrister (cl 2)",
  },
];

const L6 = LEGAL_ROWS[5];
const L6_ANNUAL = Math.round(L6.weekly * 52);
const CLERK = PARALEGAL_ATO.rows[0];

export const PARALEGAL: Occupation = {
  slug: "paralegal",
  name: "Paralegal",
  plural: "paralegals",
  award: {
    name: "Legal Services Award 2020",
    code: "MA000116",
    url: awardTextUrl("MA000116"),
    consolidatedTo: "1 July 2026",
    awardPageHref: "/legal-services-award-rates/",
  },
  headline: {
    tableId: "legal-services",
    label: LAW_CLERK_LABEL,
    why: "a paralegal in a law firm whose work meets the award's law clerk definition",
  },
  heading: "Paralegal Salary Australia 2026 — Award Rates, Median Pay & Take-Home",
  metaTitle: `Paralegal Salary Australia 2026 — ${aud2(L6.hourly)}/hr Award, ${aud(CLERK.medianSalary)} Median`,
  metaDescription: `Paralegal pay in Australia: Legal Services Award law clerk minimum ${aud2(L6.hourly)} an hour (${aud(L6_ANNUAL)} a year), ${aud(CLERK.medianSalary)} median on 2023–24 tax returns, and take-home pay.`,
  lede: `A paralegal in a law firm whose work fits the Legal Services Award's law clerk definition must be paid at least ${aud2(L6.hourly)} an hour — ${aud2(L6.weekly)} a week, ${aud(L6_ANNUAL)} a year full-time — from 1 July 2026, with lower levels for more routine legal support work. On 2023–24 tax returns, law clerks had a median salary of ${aud(CLERK.medianSalary)} (ATO). A full-timer on the law clerk minimum takes home about ${aud(netFortnightly(L6_ANNUAL))} a fortnight after tax.`,
  coverage: [
    "The Legal Services Award 2020 [MA000116] does not use the word paralegal. The Australian Bureau of Statistics lists paralegal as another title for a law clerk, and the award defines a law clerk as a clerk engaged for the major part of their time in interviewing clients, preparing documents and general work assisting a barrister or solicitor (cl 2). A law clerk is Level 6.",
    "If your work is more routine — the award's definition excludes employees principally engaged in word processing, filing, document delivery or other routine duties — you are classified at one of Levels 1 to 5, legal clerical and administrative employee, according to your skills and duties (Schedule A).",
    "The award covers employers in the legal services industry: businesses providing legal and legal support services (cl 4.2). It does not cover community legal centres, Aboriginal legal services, or employers whose primary activity is not legal services, such as an in-house legal team in a company (cl 4.3).",
  ],
  tables: [
    {
      id: "legal-services",
      title: "Paralegal and legal support award rates — Legal Services Award, 2026–27",
      intro: "Clause 15.1 adult rates from the first full pay period on or after 1 July 2026. Casual rates are Schedule B.2.1 (125%) exactly.",
      rows: LEGAL_ROWS,
    },
  ],
  penalties: LAWYER.penalties,
  penaltiesNote:
    "Day workers' ordinary hours fall between 7 am and 6.30 pm Monday to Friday (cl 13.1(c)); work outside that span is overtime at these rates (cl 20.2). Overtime after noon on Saturday, on a Sunday or on a public holiday carries a 3-hour minimum payment.",
  overtime: [
    "Monday to Saturday until 12 noon: 150% for the first 3 hours, then 200%; after 12 noon Saturday and on Sunday, 200%; public holidays, 250%. Casuals get 25 percentage points more (cl 20.2).",
    "Overtime is worked out on the weekly rate divided by 38, and part-hours are rounded: up to 30 minutes counts as half an hour, more than 30 minutes as an hour (cl 20.3).",
    "On the law clerk rate, the first 3 hours of weekday overtime are worth $54.05 an hour: 150% of $36.03 (cl 20.2(a); Schedule B.1.3 prints the same figure).",
  ],
  allowances: [
    { name: "Overtime meal allowance", amount: "$20.75, then $16.54", note: "One hour or more of weekday overtime finishing 1.5 hours after normal finishing time; a further $16.54 if overtime passes 4 hours; different triggers apply at weekends (cl 18.2). Not payable if a meal is supplied." },
    { name: "Uniform allowance", amount: "$3.75 per week", note: "When you must wear a special uniform the employer does not supply and launder (cl 18.3)." },
    { name: "Vehicle allowance", amount: "$1.00 per km", note: "When the employer requires you to use your own car; $0.34 per km for a motorcycle (cl 18.4)." },
  ],
  median: MEDIAN,
  ato: PARALEGAL_ATO,
  notices: [
    "Whether you are Level 6 or a lower level turns on your actual duties, not your job title. A paralegal who mainly does word processing, filing or routine work is not a law clerk under the award.",
    "Jobs and Skills Australia's median ($1,345 a week) covers all court and legal clerks, including court staff who are not on this award.",
  ],
  payslipNotes: [
    "Annualised salary: if you are paid a salary instead of the award's separate rates, your employer must tell you in writing which clauses it covers and how it was calculated, keep a record of your start and finish times, and each 12 months check it was at least what the award would have paid — paying any shortfall within 14 days (cl 17).",
    "Overtime meal money: a meal allowance of $20.75 for qualifying overtime (cl 18.2) must appear as its own line, as must any uniform or vehicle allowance (Fair Work Regulations reg 3.46(1)(g), noted at cl 16 and cl 18).",
    "Pay cycle: you are paid fortnightly unless you and your employer agree otherwise (cl 16.1).",
    PAYSLIP_SUPER_AND_DEDUCTIONS,
  ],
  notShown: [
    "Junior rates and shiftwork rates under the Legal Services Award.",
    "Public sector paralegal pay scales.",
    "Law graduate and admitted lawyer pay, which is on the lawyer page.",
  ],
  faqs: [
    {
      q: "What is the award rate for a paralegal in 2026?",
      a: `A paralegal whose work meets the Legal Services Award's law clerk definition is Level 6 and must be paid at least ${aud2(L6.hourly)} an hour, or ${aud2(L6.weekly)} a week, from the first full pay period on or after 1 July 2026. More routine legal support work is Levels 1 to 5, from $28.24 to $33.99 an hour.`,
    },
    {
      q: "How much do paralegals earn in Australia?",
      a: `On 2023–24 tax returns, the 13,221 people coded as law clerks — the occupation that includes paralegals — had a median salary or wage income of ${aud(CLERK.medianSalary)} and an average of ${aud(CLERK.avgSalary)} (ATO). Those figures include part-time and part-year workers.`,
    },
    {
      q: "What is a paralegal's take-home pay?",
      a: `On the law clerk award minimum of ${aud(L6_ANNUAL)} a year, about ${aud(netAnnual(L6_ANNUAL))} a year or ${aud(netFortnightly(L6_ANNUAL))} a fortnight after 2026–27 income tax and the Medicare levy, with no HECS-HELP. On the ${aud(CLERK.medianSalary)} ATO median, about ${aud(netAnnual(CLERK.medianSalary))} a year.`,
    },
    {
      q: "What is the casual rate for a paralegal?",
      a: `At least ${aud2(L6.casualHourly!)} an hour at Level 6 law clerk, the ${aud2(L6.hourly)} minimum plus the 25% casual loading (Schedule B.2.1). At Levels 1 to 5 the casual minimum is $35.30 to $42.49 an hour.`,
    },
    {
      q: "Do paralegals get paid overtime?",
      a: "Yes, under the Legal Services Award: from Monday to noon Saturday, 150% for the first 3 hours and 200% after that; 200% after noon Saturday and on Sunday; 250% on public holidays. An annualised salary can absorb overtime, but only up to the limits written into the arrangement, and it must not leave you worse off over the year.",
    },
    {
      q: "Is an in-house paralegal covered by the Legal Services Award?",
      a: "No. The award does not cover employers whose primary activity is not legal services, nor community legal centres or Aboriginal legal services (cl 4.3). An in-house paralegal's award, if any, depends on the employer's industry.",
    },
  ],
  sources: [
    { title: "Legal Services Award 2020 [MA000116] — consolidated to 1 July 2026", publisher: "Fair Work Commission", url: awardTextUrl("MA000116") },
    {
      title: "OSCA 2024 — 521234 Law Clerk (alternative titles: Legal Assistant; Paralegal)",
      publisher: "Australian Bureau of Statistics",
      url: "https://www.abs.gov.au/statistics/classifications/osca-occupation-standard-classification-australia/2024-version-1-0/browse-classification/5/52/521/5212/521234",
    },
    ATO_TABLE_15,
    jsaSource(MEDIAN),
    FWO_PAY_SLIPS,
    ANNUAL_WAGE_REVIEW_2026,
  ],
  verifiedOn: PROFESSIONAL_VERIFIED_ON,
  dateModified: "2026-10-09",
  related: [
    { href: "/job-pay-rates/lawyer/", label: "Lawyer Pay Rates" },
    { href: "/job-pay-rates/receptionist/", label: "Receptionist Pay Rates" },
    { href: "/overtime-pay-calculator/", label: "Overtime Pay Calculator" },
  ],
};
