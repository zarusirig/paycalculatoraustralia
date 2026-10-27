// Pharmacist — Pharmacy Industry Award 2020 [MA000012].
//
// Source: FWC consolidated award text, awards.fairwork.gov.au/MA000012.html,
// "incorporates all amendments up to and including 1 July 2026 (PR810422,
// PR799280, PR799293 and PR799450)". Read 23 September 2026.
//   - Weekly and hourly: cl 16.1 Table 3 (varied by PR799293 ppc 01Jul26),
//     READ FROM lib/constants/modern-awards.ts (PHARMACY_AWARD) so this page
//     and /pharmacy-award-rates/ share one copy. Independently re-read on
//     23 September 2026 and identical.
//   - Casual ordinary hourly: hourly + 25%, which matches Schedule B.2.1's
//     "Ordinary hours Monday to Friday between 8.00 am and 7.00 pm" column to
//     the cent (asserted in tests: Pharmacist $52.18).
//   - Penalties: cl 22.3 Table 6. Overtime: cl 21.4 Table 5.
//   - HMR/RMMR allowance: cl 19 ($106.40 per week).
//
// The award covers community pharmacy only. Hospital pharmacists are paid under
// state public-sector instruments. Since 23 October 2026 this page shows them
// in its "Public hospital pay by state" section, read from
// lib/data/public-health-allied-pay (NSW, VIC, QLD, WA and SA), and leads with
// "pharmacist salary" wording: GSC, 28 days to 21 Oct 2026, 4,142 impressions,
// 37 clicks, CTR 0.89%, position 7.0.
//
// ATO: Taxation statistics 2023-24, Individuals Table 15A, Total rows, read
// 23 October 2026 from ts24individual15occupationsex.xlsx: 251511 Hospital
// pharmacist, 251513 Chemist - pharmacy (retail), 251512 Industrial pharmacist.
//
// Junior rates in this award apply to pharmacy assistants levels 1 and 2 only
// (cl 16.2) and are changing from 1 December 2026 (PR813656). They do not apply
// to pharmacists and are covered on the pharmacy award page, not here.

import { PHARMACY_AWARD } from "../../constants/modern-awards";
import {
  ANNUAL_WAGE_REVIEW_2026,
  CONSOLIDATED_TO,
  FWO_PAY_GUIDES,
  JOB_PAY_VERIFIED_ON,
  awardTextUrl,
  jsaSource,
  jsaUrl,
  ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  rowFromModernAward,
} from "./common";
import {
  ATO_TABLE_15,
  ATO_TAXSTATS_INCOME_YEAR,
} from "./common";
import {
  HOSPITAL_PAGES_MODIFIED,
  allStarts,
  aud,
  aud2,
  hospitalMetaDescription,
  hospitalSalaryTitle,
  medianAnnual,
  startRangeWords,
  stateRangeWords,
  stepPay,
  stepWeekly,
  takeHome,
} from "./public-hospital-common";
import type { AtoOccupationStats, MedianEarnings, Occupation } from "./types";

const MEDIAN: MedianEarnings = {
  anzscoCode: "2515",
  anzscoTitle: "Pharmacists",
  medianWeekly: 1_956,
  medianHourly: 52,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("2515-pharmacists"),
};

export const PHARMACIST_ATO: AtoOccupationStats = {
  incomeYear: ATO_TAXSTATS_INCOME_YEAR,
  intro:
    "The ATO codes hospital, retail and industrial pharmacists separately. Retail pharmacists are listed under the code the ATO calls \"Chemist - pharmacy\".",
  takeHomeRows: 2,
  rows: [
    { code: "251511", title: "Hospital pharmacist", individuals: 6_939, avgTaxableIncome: 97_458, medianTaxableIncome: 96_680, avgSalary: 92_327, medianSalary: 94_928 },
    { code: "251513", title: "Chemist - pharmacy", individuals: 23_316, avgTaxableIncome: 90_162, medianTaxableIncome: 79_868, avgSalary: 72_910, medianSalary: 71_507 },
    { code: "251512", title: "Industrial pharmacist", individuals: 1_232, avgTaxableIncome: 123_261, medianTaxableIncome: 106_499, avgSalary: 112_533, medianSalary: 104_147 },
  ],
};

const AWARD_ROW = rowFromModernAward(PHARMACY_AWARD, "Pharmacist", "Pharmacist", "Registered pharmacist");
const MEDIAN_YEAR = medianAnnual(MEDIAN);
const MEDIAN_NET = takeHome(MEDIAN_YEAR);

export const PHARMACIST: Occupation = {
  slug: "pharmacist",
  name: "Pharmacist",
  plural: "pharmacists",
  award: {
    name: "Pharmacy Industry Award 2020",
    code: "MA000012",
    url: awardTextUrl("MA000012"),
    consolidatedTo: CONSOLIDATED_TO,
    awardPageHref: "/pharmacy-award-rates/",
  },
  headline: {
    tableId: "pharmacists",
    label: "Pharmacist",
    why: "a registered pharmacist with less than 4 years' community pharmacy experience",
  },
  coverage: [
    "Pharmacists employed in community (retail) pharmacies are covered by the Pharmacy Industry Award 2020 [MA000012]. The award has four pharmacist classifications, and which one you are on depends on experience and responsibility, not on your job title.",
    "A Pharmacist is registered under the Health Practitioner Regulation National Law. An Experienced pharmacist has at least 4 years' full-time (or part-time equivalent) experience in a community pharmacy. A Pharmacist in charge assumes responsibility for the day-to-day supervision and functioning of the pharmacy. A Pharmacist manager is responsible to the owner for all aspects of the business (award Schedule A, A.7 to A.10).",
    "Hospital pharmacists are not covered by this award. Public hospital pharmacists are paid under their state's health award or agreement, which has its own grades and rates; those are in the public hospital section above.",
  ],
  tables: [
    {
      id: "pharmacists",
      title: "Pharmacist minimum pay rates 2026–27",
      intro:
        "These are the minimum rates in clause 16.1, Table 3 of the Pharmacy Industry Award. Casual rates are the award's own Schedule B figures for ordinary hours between 8 am and 7 pm, Monday to Friday.",
      rows: [
        rowFromModernAward(PHARMACY_AWARD, "Pharmacist", "Pharmacist", "Registered pharmacist"),
        rowFromModernAward(PHARMACY_AWARD, "Experienced pharmacist", "Experienced pharmacist", "4+ years' community pharmacy experience"),
        rowFromModernAward(PHARMACY_AWARD, "Pharmacist in charge", "Pharmacist in charge", "Runs the pharmacy day to day"),
        rowFromModernAward(PHARMACY_AWARD, "Pharmacist manager", "Pharmacist manager", "Responsible to the owner for the whole business"),
      ],
    },
    {
      id: "interns",
      title: "Pharmacy student and intern rates",
      intro: "These are the Table 3 rates for pharmacy students and for interns completing their supervised practice.",
      rows: [
        rowFromModernAward(PHARMACY_AWARD, "Pharmacy student — 1st year of course"),
        rowFromModernAward(PHARMACY_AWARD, "Pharmacy student — 2nd year of course"),
        rowFromModernAward(PHARMACY_AWARD, "Pharmacy student — 3rd year of course"),
        rowFromModernAward(PHARMACY_AWARD, "Pharmacy student — 4th year of course"),
        rowFromModernAward(PHARMACY_AWARD, "Pharmacy intern — 1st half of training"),
        rowFromModernAward(PHARMACY_AWARD, "Pharmacy intern — 2nd half of training"),
      ],
    },
  ],
  penalties: [
    { when: "Monday–Friday, 7 am to 8 am", permanent: "150%", casual: "175%" },
    { when: "Monday–Friday, 7 pm to 9 pm", permanent: "125%", casual: "150%" },
    { when: "Monday–Friday, 9 pm to midnight", permanent: "150%", casual: "175%" },
    { when: "Saturday, 8 am to 6 pm", permanent: "125%", casual: "150%" },
    { when: "Saturday, 7 am to 8 am", permanent: "200%", casual: "225%" },
    { when: "Saturday, 6 pm to 9 pm", permanent: "150%", casual: "175%" },
    { when: "Saturday, 9 pm to midnight", permanent: "175%", casual: "200%" },
    { when: "Sunday, 7 am to 9 pm", permanent: "150%", casual: "175%" },
    { when: "Sunday, before 7 am or after 9 pm", permanent: "200%", casual: "225%" },
    { when: "Public holiday", permanent: "225%", casual: "250%" },
  ],
  penaltiesNote:
    "The table shows percentages of the minimum hourly rate (clause 22.3, Table 6). Casual percentages already include the 25% casual loading. Penalty rates are not added on top of overtime rates (cl 22.2).",
  overtime: [
    "Monday to Saturday: 150% for the first 2 hours, then 200% (cl 21.4, Table 5).",
    "Sunday: 200% all day. Public holiday: 250% all day.",
    "Overtime applies to hours over 38 a week (or 76 over two weeks), over 12 hours in a day, between midnight and 7 am, or outside the agreed roster.",
    "A casual working overtime is paid the overtime rate without the 25% casual loading (cl 21.4(c)).",
  ],
  allowances: [
    {
      name: "Home medicines review / residential medication management review allowance",
      amount: "$106.40 per week",
      note: "For a pharmacist of any classification who is required by the employer to perform HMRs or RMMRs (cl 19).",
    },
  ],
  median: MEDIAN,
  notices: [
    "These award rates are legal minimums for community pharmacy. An employer can pay more. Hospital pharmacists are paid under the state scales above instead.",
  ],
  notShown: [
    "Pharmacy assistant junior rates, which change from 1 December 2026; see the pharmacy award page.",
    "Annualised salary arrangements under clause 18, which must be reconciled against the rates above.",
  ],
  faqs: [
    {
      q: "How much do pharmacists make in Australia?",
      a: `Full-time pharmacists earn a median of ${aud(MEDIAN.medianWeekly)} a week, about ${aud(MEDIAN_YEAR)} a year (Jobs and Skills Australia, May 2025). On 2023-24 tax returns, hospital pharmacists had an average taxable income of ${aud(PHARMACIST_ATO.rows[0].avgTaxableIncome)} and retail pharmacists ${aud(PHARMACIST_ATO.rows[1].avgTaxableIncome)}. In public hospitals, state scales start ${startRangeWords("pharmacist")}. The award minimum in community pharmacy is ${aud2(AWARD_ROW.hourly)} an hour.`,
    },
    {
      q: "What is a 1st year pharmacist salary?",
      a: `In a public hospital, the first qualified step on each state's scale is ${allStarts("pharmacist")} a year. Where a job needs a four-year degree, the start is higher: HP3.1 in Queensland, ${stepPay("pharmacist", "QLD", "HP3.1")}; P-1.2 in WA, ${stepPay("pharmacist", "WA", "P-1.2")}; and AHP-1, increment 2 in SA, ${stepPay("pharmacist", "SA", "AHP-1, increment 2 (4-year degree start)")}. In community pharmacy the award minimum is ${aud2(AWARD_ROW.hourly)} an hour, ${aud(Math.round(AWARD_ROW.weekly * 52))} a year full-time. Before registration, a NSW Health graduate pharmacist is paid ${stepPay("pharmacist", "NSW", "Graduate pharmacist (unregistered)")} a year.`,
    },
    {
      q: "What is the hospital pharmacist award rate in NSW?",
      a: `NSW Health pharmacists are paid under the Health Employees' Pharmacists (State) Award 2025. From the first full pay period on or after 1 July 2026, Grade 1 runs from ${stepWeekly("pharmacist", "NSW", "Grade 1, year 1")} a week (${stepPay("pharmacist", "NSW", "Grade 1, year 1")} a year) in year 1 to ${stepPay("pharmacist", "NSW", "Grade 1, year 5")} in year 5. Grade 2 starts at ${stepPay("pharmacist", "NSW", "Grade 2, year 1")}, and a Group 1 hospital's Director of Pharmacy earns up to ${stepPay("pharmacist", "NSW", "Grade 7, Group B, year 2")}. The award runs for two years from 1 July 2025 and sets no further rise.`,
    },
    {
      q: "How much does a hospital pharmacist earn in each state?",
      a: `From the first registered step to the top of the scale: NSW ${stateRangeWords("pharmacist", "NSW")}; Victoria ${stateRangeWords("pharmacist", "VIC")}; Queensland ${stateRangeWords("pharmacist", "QLD")}; WA ${stateRangeWords("pharmacist", "WA")}; SA ${stateRangeWords("pharmacist", "SA")}. Victoria's rates have not risen since December 2024: a new agreement was announced on 20 August 2026 but had not been approved as at 19 October 2026.`,
    },
    {
      q: "How much does a pharmacist earn in Perth?",
      a: `WA Health pharmacists are on the Professional Division scale of the WA Health System - HSUWA - PACTS Industrial Agreement 2024. From 1 July 2026 a three-year degree starts on P-1.1, ${stepPay("pharmacist", "WA", "P-1.1")} a year, and a four-year degree on P-1.2, ${stepPay("pharmacist", "WA", "P-1.2")}. The agreement expires on 30 June 2027.`,
    },
    {
      q: "What is a pharmacist's salary after tax?",
      a: `On the ${aud(MEDIAN_YEAR)} median, a full-time pharmacist takes home about ${aud(MEDIAN_NET.year)} a year, or ${aud(MEDIAN_NET.fortnight)} a fortnight, at 2026-27 resident tax rates with the Medicare levy and no HECS-HELP. The public hospital tables on this page show take-home pay for every grade.`,
    },
    {
      q: "What is the minimum pay rate for a pharmacist in Australia in 2026?",
      a: "Under the Pharmacy Industry Award 2020, a registered pharmacist must be paid at least $41.74 an hour, or $1,586.30 for a full-time 38-hour week, from the first full pay period on or after 1 July 2026. That is $82,488 a year before tax.",
    },
    {
      q: "How much does an experienced pharmacist earn under the award?",
      a: "An Experienced pharmacist (4 or more years' full-time experience in community pharmacy) has a minimum of $45.72 an hour or $1,737.40 a week, about $90,345 a year. A Pharmacist manager's minimum is $52.15 an hour or $1,981.60 a week.",
    },
    {
      q: "What is the casual pay rate for a pharmacist?",
      a: "A casual pharmacist earns at least $52.18 an hour for ordinary weekday hours between 8 am and 7 pm, which is the $41.74 minimum plus the 25% casual loading. Evenings, weekends and public holidays attract higher casual rates.",
    },
    {
      q: "What do pharmacists actually earn in Australia?",
      a: "Jobs and Skills Australia reports median full-time earnings of $1,956 a week for pharmacists (ABS Survey of Employee Earnings and Hours, May 2025). That is about $370 a week above the award minimum for a Pharmacist and about $220 above the Experienced pharmacist minimum. The median covers community and hospital pharmacists together.",
    },
    {
      q: "Are hospital pharmacists covered by the Pharmacy Industry Award?",
      a: "No. The award covers community pharmacy. Public hospital pharmacists are paid under their state's health award or agreement, which has its own grades and rates. This page shows them for NSW, Victoria, Queensland, WA and SA.",
    },
  ],
  sources: [
    { title: "Pharmacy Industry Award 2020 [MA000012], consolidated to 1 July 2026", publisher: "Fair Work Commission", url: awardTextUrl("MA000012") },
    FWO_PAY_GUIDES,
    ANNUAL_WAGE_REVIEW_2026,
    jsaSource(MEDIAN),
    ATO_TABLE_15,
  ],
  verifiedOn: JOB_PAY_VERIFIED_ON,
  metaTitle: hospitalSalaryTitle("Pharmacist", MEDIAN),
  heading: "Pharmacist Salary Australia 2026: Hospital Pay by State and Award Rates",
  metaDescription: hospitalMetaDescription("Pharmacist", "pharmacist", MEDIAN),
  lede: `Full-time pharmacists earn a median of ${aud(MEDIAN.medianWeekly)} a week, about ${aud(MEDIAN_YEAR)} a year (Jobs and Skills Australia). Hospital pharmacists are paid on state scales that start ${startRangeWords("pharmacist")} and rise to director of pharmacy rates. In community pharmacy the Pharmacy Industry Award minimum is ${aud2(AWARD_ROW.hourly)} an hour.`,
  answerQuestion: "How much does a pharmacist earn in Australia?",
  ato: PHARMACIST_ATO,
  publicHospital: {
    profession: "pharmacist",
    intro:
      "Hospital pharmacists are not covered by the Pharmacy Industry Award. Each state's public health service pays them under its own award or agreement, from a newly registered pharmacist to director of pharmacy. These are the rates in force on 23 October 2026.",
  },
  dateModified: HOSPITAL_PAGES_MODIFIED,
  related: [
    { href: "/pharmacy-award-rates/", label: "Pharmacy Award Pay Rates" },
    { href: "/retail-award-rates/", label: "Retail Award Pay Rates" },
    { href: "/healthcare-worker-pay/", label: "Healthcare Worker Pay" },
  ],
};
