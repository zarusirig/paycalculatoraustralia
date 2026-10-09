// Surveyor — Surveying Award 2020 [MA000066].
//
// Source: awards.fairwork.gov.au/MA000066.html, "incorporates all amendments
// up to and including 1 July 2026 (PR799280, PR799346 and PR799502)", read
// 9 October 2026. An occupational award: it covers employers who employ
// professional surveyors and other employees in its Schedule A classifications
// "to the exclusion of any other modern award" (cl 4.1); not local government
// employees covered by another award (cl 4.5). "Professional surveyor"
// includes graduate and licensed/registered surveyors (cl 4.2).
//
// cl 17.1 weekly/hourly (from the first full pay period on or after 1 July 2026):
//   Level 8 Survey Technician Level II 1283.10/33.77 — graduate entry, 3-year course (A.15.2(a))
//   Level 7 Surveying Technician Level III 1309.50/34.46 — graduate entry, 4-year course (A.15.2(b))
//   Level 6 Surveyor Level I 1344.50/35.38
//   Level 5 Surveyor Level II 1415.00/37.24
//   Level 4 Surveyor Level III 1450.20/38.16 — graduates progress to here (A.15.2)
//   Level 3 Surveyor Level IV 1513.70/39.83 — includes licensed/registered surveyor (A.12)
//   Level 2 Surveyor Level V 1654.40/43.54
//   Level 1 Surveyor Level VI 1865.60/49.09
// Casual: Schedule B.2 125% column — 42.21, 43.08, 44.23, 46.55, 47.70, 49.79, 54.43, 61.36.
// Overtime cl 21.1: 150% first 3 hours, 200% after (casual 187.5% / 250%, cl 21.2);
// Sunday 200% / casual 250%, public holiday 250% / casual 312.5% (cl 21.4).
// Ordinary hours between 6 am and 6 pm Monday to Friday (cl 14.1).
// Allowances: meal $16.62 (cl 19.2), fares (cl 19.3), travelling time counted
// as working time (cl 19.5), living away from home (cl 19.6), vehicle at least
// $1.00/km (cl 19.7). Pay weekly or fortnightly, or monthly by agreement
// (cl 18.1). Annual leave loading 17.5% (cl 22.2). Graduates advance on
// demonstrated competence, not by anniversary (cl 17.4, A.15.2).
//
// ATO: Taxation statistics 2023–24, Individuals Table 15A (data.gov.au,
// ts24individual15occupationsex.xlsx), Total rows, read 9 October 2026:
//   232212 Scientist - surveyor                       9,869 | avg TI 126,763 | med TI 117,972 | avg S/W 116,834 | med S/W 114,639
//   232214 Geographic information systems manager     1,855 | avg TI 110,845 | med TI 105,351 | avg S/W 106,771 | med S/W 104,899
//   232213 Cartographer                                 661 | avg TI 107,029 | med TI 101,425 | avg S/W 101,028 | med S/W  98,416
//   233213 Quantity surveyor                          4,991 | avg TI 136,623 | med TI 117,714 | avg S/W 129,708 | med S/W 115,999
//
// JSA: ANZSCO 2322 Surveyors and Spatial Scientists, median full-time earnings
// $2,300 a week, $56 an hour (ABS SEEH May 2025), all occupations $1,852;
// jobsandskills.gov.au/.../2322-surveyors-and-spatial-scientists, read 9 October 2026.

import {
  ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  ANNUAL_WAGE_REVIEW_2026,
  ATO_TABLE_15,
  ATO_TAXSTATS_INCOME_YEAR,
  awardTextUrl,
  jsaSource,
  jsaUrl,
} from "./common";
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
  anzscoCode: "2322",
  anzscoTitle: "Surveyors and Spatial Scientists",
  medianWeekly: 2_300,
  medianHourly: 56,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("2322-surveyors-and-spatial-scientists"),
};

export const SURVEYOR_ATO: AtoOccupationStats = {
  incomeYear: ATO_TAXSTATS_INCOME_YEAR,
  intro:
    "GIS managers and cartographers are spatial occupations in the same group as surveyors. Quantity surveyors are a different job, coded by the ATO with civil engineering professionals, and are shown because the titles are often confused.",
  rows: [
    { code: "232212", title: "Scientist - surveyor", individuals: 9_869, avgTaxableIncome: 126_763, medianTaxableIncome: 117_972, avgSalary: 116_834, medianSalary: 114_639 },
    { code: "232214", title: "Geographic information systems manager", individuals: 1_855, avgTaxableIncome: 110_845, medianTaxableIncome: 105_351, avgSalary: 106_771, medianSalary: 104_899 },
    { code: "232213", title: "Cartographer", individuals: 661, avgTaxableIncome: 107_029, medianTaxableIncome: 101_425, avgSalary: 101_028, medianSalary: 98_416 },
    { code: "233213", title: "Quantity surveyor", individuals: 4_991, avgTaxableIncome: 136_623, medianTaxableIncome: 117_714, avgSalary: 129_708, medianSalary: 115_999 },
  ],
};

export const SURVEYOR_GRAD_LABEL = "Level 8 — Survey Technician Level II";

const SURVEY_ROWS: RateRow[] = [
  { label: SURVEYOR_GRAD_LABEL, weekly: 1283.1, hourly: 33.77, casualHourly: 42.21, note: "Graduate entry point, 3-year course (A.15.2(a))" },
  { label: "Level 7 — Surveying Technician Level III", weekly: 1309.5, hourly: 34.46, casualHourly: 43.08, note: "Graduate entry point, 4-year course (A.15.2(b))" },
  { label: "Level 6 — Surveyor Level I", weekly: 1344.5, hourly: 35.38, casualHourly: 44.23 },
  { label: "Level 5 — Surveyor Level II", weekly: 1415, hourly: 37.24, casualHourly: 46.55, note: "Includes a party leader" },
  { label: "Level 4 — Surveyor Level III", weekly: 1450.2, hourly: 38.16, casualHourly: 47.7, note: "Top of the graduate progression (A.15.2)" },
  { label: "Level 3 — Surveyor Level IV", weekly: 1513.7, hourly: 39.83, casualHourly: 49.79, note: "Includes a licensed or registered surveyor (A.12)" },
  { label: "Level 2 — Surveyor Level V", weekly: 1654.4, hourly: 43.54, casualHourly: 54.43, note: "Senior surveyor; includes a project or specialist manager" },
  { label: "Level 1 — Surveyor Level VI", weekly: 1865.6, hourly: 49.09, casualHourly: 61.36, note: "Includes a business or specialist manager" },
];

const GRAD = SURVEY_ROWS[0];
const LICENSED = SURVEY_ROWS[5];
const GRAD_ANNUAL = Math.round(GRAD.weekly * 52);
const LICENSED_ANNUAL = Math.round(LICENSED.weekly * 52);
const SURV = SURVEYOR_ATO.rows[0];
const JSA_ANNUAL = MEDIAN.medianWeekly * 52;

export const SURVEYOR: Occupation = {
  slug: "surveyor",
  name: "Surveyor",
  plural: "surveyors",
  award: {
    name: "Surveying Award 2020",
    code: "MA000066",
    url: awardTextUrl("MA000066"),
    consolidatedTo: "1 July 2026",
  },
  headline: {
    tableId: "surveying",
    label: SURVEYOR_GRAD_LABEL,
    why: "a graduate surveyor with a 3-year degree, who enters at Level 8",
  },
  heading: "Surveyor Salary Australia 2026 — Surveying Award Rates, Median Pay & Take-Home",
  metaTitle: `Surveyor Salary Australia 2026 — ${aud2(GRAD.hourly)}/hr Award, ${aud(SURV.medianSalary)} Median`,
  metaDescription: `Surveyor pay in Australia: Surveying Award minimums from ${aud2(GRAD.hourly)} an hour for graduates to ${aud2(LICENSED.hourly)} licensed, ${aud(SURV.medianSalary)} median on 2023–24 tax returns, and take-home.`,
  lede: `Surveyors have their own award. Under the Surveying Award a graduate surveyor starts on at least ${aud2(GRAD.hourly)} an hour (${aud(GRAD_ANNUAL)} a year) with a 3-year degree, and a licensed or registered surveyor at Level 3 on ${aud2(LICENSED.hourly)} (${aud(LICENSED_ANNUAL)} a year), from 1 July 2026. On 2023–24 tax returns surveyors reported a median salary of ${aud(SURV.medianSalary)} (ATO), which leaves about ${aud(netFortnightly(SURV.medianSalary))} a fortnight after tax.`,
  coverage: [
    "The Surveying Award 2020 [MA000066] is an occupational award: it covers any employer who employs professional surveyors and other employees in its classifications, in any industry, to the exclusion of any other modern award (cl 4.1). Professional surveyors include graduate surveyors and licensed or registered surveyors (cl 4.2). It does not cover local government employees covered by another award (cl 4.5).",
    "The award defines surveying as determining the form, contour, position, area, height or depth of the earth's surface, or of features on, below or above it, including mapping and spatial data work by employees in its classifications (Schedule A.1). Quantity surveyors are a different occupation, which the ATO codes with civil engineering professionals; check that definition against your own duties before relying on this award.",
    "A graduate surveyor enters at Level 8 (Survey Technician Level II) after a 3-year course or Level 7 (Surveying Technician Level III) after a 4-year course, and advances through the levels to Level 4 as they demonstrate competence — not automatically each year (cl 17.4, Schedule A.15.2). A licensed or registered surveyor is included at Level 3, Surveyor Level IV.",
    "Survey assistants (Levels 10 to 12) and survey technicians (Levels 7 to 9) are covered by the same award.",
  ],
  tables: [
    {
      id: "surveying",
      title: "Surveyor award rates by level, 2026–27",
      intro:
        "Clause 17.1 minimum weekly and hourly rates from the first full pay period on or after 1 July 2026; annual is the weekly rate x 52. Casual rates are Schedule B.2 (125%) exactly. Level 1 is the most senior.",
      rows: SURVEY_ROWS,
    },
  ],
  penalties: [
    { when: "Overtime Monday–Saturday — first 3 hours", permanent: "150%", casual: "187.5%" },
    { when: "Overtime Monday–Saturday — after 3 hours", permanent: "200%", casual: "250%" },
    { when: "Sunday", permanent: "200%", casual: "250%" },
    { when: "Public holiday", permanent: "250%", casual: "312.5%" },
  ],
  penaltiesNote:
    "Ordinary hours fall between 6 am and 6 pm Monday to Friday (cl 14.1). Work outside that spread, including Saturdays, is overtime (cl 21.1–21.2); Sunday and public holiday rates are in cl 21.4.",
  overtime: [
    "Overtime is 150% of the minimum hourly rate for the first 3 hours and 200% after that; casuals get 187.5% and then 250% (cl 21.1–21.2).",
    `For a graduate at Level 8 that is $50.66 an hour for the first 3 hours and $67.54 after (Schedule B.1.2).`,
    "Working more than 2 hours past your usual finishing time earns a $16.62 meal allowance, or a meal (cl 19.2).",
  ],
  allowances: [
    { name: "Meal allowance", amount: "$16.62", note: "Working more than 2 hours after the usual finishing time, or more than 4 hours on a Sunday or public holiday, unless a meal is supplied (cl 19.2)." },
    { name: "Vehicle allowance", amount: "At least $1.00 per km", note: "Agreed use of your own vehicle on the employer's business (cl 19.7)." },
    { name: "Fares", amount: "Reasonable fares", note: "Extra fares when directed to work away from your usual workplace, economy class (cl 19.3)." },
    { name: "Living away from home", amount: "Fares and reasonable expenses", note: "Board and lodging when you must sleep away from home, plus paid travel time up to 7.6 hours in 24 (cl 19.6)." },
  ],
  median: MEDIAN,
  ato: SURVEYOR_ATO,
  notices: [
    "Graduate surveyors move up on demonstrated competence, not on each anniversary, so two graduates with the same start date can be on different levels (cl 17.4, Schedule A.15.2).",
  ],
  payslipNotes: [
    "Travel to other sites: when you are directed to work away from your usual place of employment, extra travelling time is working time (cl 19.5) and extra fares must be paid (cl 19.3). Check those hours and amounts appear on your payslip.",
    "Meal and vehicle allowances: the $16.62 meal allowance and any vehicle allowance must be shown separately from your wages (Fair Work Ombudsman, pay slips).",
    "Pay cycle: wages are paid weekly or fortnightly at the employer's choice, or monthly if you both agree (cl 18.1).",
    "Annual leave loading: 17.5% on top of the pay for your ordinary hours while you are on annual leave (cl 22.2).",
    PAYSLIP_SUPER_AND_DEDUCTIONS,
  ],
  notShown: [
    "Survey assistant and Survey Technician Level I rates (Levels 9 to 12), and junior rates.",
    "The phase-in percentages for diploma and advanced diploma holders without experience (cl 17.5).",
    "Quantity surveyor award rates: a different occupation.",
  ],
  faqs: [
    {
      q: "What is the award rate for a graduate surveyor in 2026?",
      a: `${aud2(GRAD.hourly)} an hour, or ${aud2(GRAD.weekly)} a week (${aud(GRAD_ANNUAL)} a year), for a graduate with a 3-year degree, who enters at Level 8 under the Surveying Award. A graduate from a 4-year course enters at Level 7, $34.46 an hour. These apply from the first full pay period on or after 1 July 2026.`,
    },
    {
      q: "How much does a licensed surveyor earn?",
      a: `The award minimum for Level 3, Surveyor Level IV — which includes a licensed or registered surveyor — is ${aud2(LICENSED.hourly)} an hour, ${aud2(LICENSED.weekly)} a week or ${aud(LICENSED_ANNUAL)} a year. On 2023–24 tax returns, surveyors as a whole had a median salary or wage income of ${aud(SURV.medianSalary)} (ATO).`,
    },
    {
      q: "How much do surveyors earn in Australia?",
      a: `The 9,869 surveyors on 2023–24 tax returns had a median salary or wage income of ${aud(SURV.medianSalary)} and an average of ${aud(SURV.avgSalary)} (ATO). Jobs and Skills Australia's full-time median for surveyors and spatial scientists is $2,300 a week, about ${aud(JSA_ANNUAL)} a year (May 2025).`,
    },
    {
      q: "What is a surveyor's take-home pay?",
      a: `On the ${aud(SURV.medianSalary)} median, about ${aud(netAnnual(SURV.medianSalary))} a year or ${aud(netFortnightly(SURV.medianSalary))} a fortnight after 2026–27 income tax and the Medicare levy, with no HECS-HELP and with private hospital cover. On the graduate minimum of ${aud(GRAD_ANNUAL)}, about ${aud(netAnnual(GRAD_ANNUAL))} a year.`,
    },
    {
      q: "Do surveyors get paid overtime?",
      a: "Yes. Under the Surveying Award, work outside 6 am to 6 pm Monday to Friday, including Saturdays, is overtime at 150% for the first 3 hours and 200% after; Sundays are 200% and public holidays 250%. Casuals get 187.5% for the first 3 hours of overtime and 250% after, 250% on Sundays and 312.5% on public holidays.",
    },
    {
      q: "Is a quantity surveyor covered by the Surveying Award?",
      a: "Not just because of the job title. The award's definition of surveying is about determining the form, position and dimensions of the earth's surface and features on it, so compare it with your duties. The ATO codes quantity surveyors as a separate occupation; on 2023–24 tax returns their median salary or wage income was $115,999.",
    },
  ],
  sources: [
    { title: "Surveying Award 2020 [MA000066] — consolidated to 1 July 2026", publisher: "Fair Work Commission", url: awardTextUrl("MA000066") },
    ATO_TABLE_15,
    jsaSource(MEDIAN),
    FWO_PAY_SLIPS,
    ANNUAL_WAGE_REVIEW_2026,
  ],
  verifiedOn: PROFESSIONAL_VERIFIED_ON,
  dateModified: "2026-10-09",
  related: [
    { href: "/job-pay-rates/civil-engineer/", label: "Civil Engineer Salary" },
    { href: "/job-pay-rates/architect/", label: "Architect Pay Rates" },
    { href: "/overtime-pay-calculator/", label: "Overtime Pay Calculator" },
  ],
};
