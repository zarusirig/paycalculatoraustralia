// Business analyst — salary page; spoke of /tech-salary-guide-australia/.
//
// Coverage: no modern award names business analysts. The ATO codes the job as
// "Business analyst - IT" (261111) in unit group 2611 IT business or systems
// analyst. The Professional Employees Award's IT stream covers employers
// principally in the IT industry — defined to include "system analysis
// services" and computer consultancy (cl 2.3) — for duties needing an
// ACS-accredited degree or ACS Certified Professional standing (cl 4.1(b),
// cl 2.3); awards.fairwork.gov.au/MA000065.html, read 9 October 2026. Whether
// a given BA is covered turns on the employer and the duties, so the page
// shows the National Minimum Wage Order 2026 (PR799279) as the floor.
//
// ATO: Taxation statistics 2023–24, Individuals Table 15A (data.gov.au,
// ts24individual15occupationsex.xlsx), Total rows, read 9 October 2026:
//   261111 Business analyst - IT                       46,789 | avg TI 127,551 | med TI 119,408 | avg S/W 123,441 | med S/W 119,229
//   261112 Computing professional - systems analyst    13,055 | avg TI 132,331 | med TI 120,585 | avg S/W 125,940 | med S/W 119,204
//
// JSA: ANZSCO 2611 ICT Business and Systems Analysts, median full-time
// earnings $2,697 a week, $72 an hour (ABS SEEH May 2025), all occupations
// $1,852; jobsandskills.gov.au/.../2611-ict-business-and-systems-analysts,
// read 9 October 2026.

import { ALL_OCCUPATIONS_MEDIAN_WEEKLY, ATO_TABLE_15, ATO_TAXSTATS_INCOME_YEAR, jsaSource, jsaUrl } from "./common";
import {
  DEPENDS_OVERTIME,
  DEPENDS_PENALTIES_NOTE,
  FWO_PAY_SLIPS,
  NMW_ORDER_2026,
  PAYSLIP_BONUSES,
  PAYSLIP_SUPER_AND_DEDUCTIONS,
  PAYSLIP_TIMING,
  PROFESSIONAL_AWARD,
  PROFESSIONAL_VERIFIED_ON,
  aud,
  netAnnual,
  netFortnightly,
  nmwTable,
} from "./professional-common";
import type { AtoOccupationStats, MedianEarnings, Occupation } from "./types";

const MEDIAN: MedianEarnings = {
  anzscoCode: "2611",
  anzscoTitle: "ICT Business and Systems Analysts",
  medianWeekly: 2_697,
  medianHourly: 72,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("2611-ict-business-and-systems-analysts"),
};

export const BUSINESS_ANALYST_ATO: AtoOccupationStats = {
  incomeYear: ATO_TAXSTATS_INCOME_YEAR,
  intro:
    "The ATO codes business analysts as an IT occupation. Systems analysts share the same unit group and are shown for comparison; a business analyst who described the job differently on their return may be counted elsewhere.",
  rows: [
    { code: "261111", title: "Business analyst - IT", individuals: 46_789, avgTaxableIncome: 127_551, medianTaxableIncome: 119_408, avgSalary: 123_441, medianSalary: 119_229 },
    { code: "261112", title: "Computing professional - systems analyst", individuals: 13_055, avgTaxableIncome: 132_331, medianTaxableIncome: 120_585, avgSalary: 125_940, medianSalary: 119_204 },
  ],
};

const BA = BUSINESS_ANALYST_ATO.rows[0];
const JSA_ANNUAL = MEDIAN.medianWeekly * 52;

export const BUSINESS_ANALYST: Occupation = {
  slug: "business-analyst",
  name: "Business Analyst",
  plural: "business analysts",
  award: null,
  headline: null,
  coverageMode: "depends",
  heading: "Business Analyst Salary Australia 2026 — Median Pay & Take-Home",
  metaTitle: `Business Analyst Salary Australia 2026 — ${aud(BA.medianSalary)} Median`,
  metaDescription: `Business analysts' median salary was ${aud(BA.medianSalary)} on 2023–24 tax returns; full-time ICT analysts' median is $2,697 a week. Take-home pay and award coverage.`,
  lede: `Business analysts reported a median salary of ${aud(BA.medianSalary)} and an average of ${aud(BA.avgSalary)} on 2023–24 tax returns (ATO), and full-time ICT business and systems analysts had median pay of $2,697 a week in May 2025 (Jobs and Skills Australia). On the ${aud(BA.medianSalary)} median, take-home pay is about ${aud(netAnnual(BA.medianSalary))} a year after tax. No award names the job; whether one covers you depends on your employer.`,
  coverage: [
    "No modern award names business analysts. The nearest is the information technology stream of the Professional Employees Award 2020 [MA000065], whose definition of the IT industry includes system analysis services and computer consultancy (cl 2.3). It applies only where your employer is principally engaged in the IT, telecommunications services or quality auditing industry, and only to work that needs a degree with a science or IT major accredited by the Australian Computer Society, or ACS Certified Professional standing (cl 4.1(b), cl 2.3).",
    "If you meet that test, the award minimums are the ones on the software engineer page. If you work as a business analyst in a bank, a government agency or another non-IT business, that stream does not apply; check your employer's industry award or enterprise agreement. If no award covers you, the National Minimum Wage and the National Employment Standards are the legal floor.",
  ],
  tables: [nmwTable("business analysts")],
  penalties: [],
  penaltiesNote: DEPENDS_PENALTIES_NOTE,
  overtime: DEPENDS_OVERTIME,
  allowances: [],
  median: MEDIAN,
  ato: BUSINESS_ANALYST_ATO,
  notices: [
    "The ATO's occupation code is \"Business analyst - IT\": business analysts working outside IT may have given a different occupation and are not necessarily in these figures.",
  ],
  payslipNotes: [PAYSLIP_TIMING, PAYSLIP_BONUSES, PAYSLIP_SUPER_AND_DEDUCTIONS],
  notShown: [
    "An award rate for business analysts: none names the job, and coverage depends on your employer and duties.",
    "Contractor day rates: awards and the minimum wage apply to employees, not to independent contractors.",
    "Recruiter salary bands by seniority: they are not official figures.",
  ],
  faqs: [
    {
      q: "How much does a business analyst earn in Australia?",
      a: `On 2023–24 tax returns, the 46,789 people coded as IT business analysts had a median salary or wage income of ${aud(BA.medianSalary)} and an average of ${aud(BA.avgSalary)} (ATO). Jobs and Skills Australia's full-time median for ICT business and systems analysts is $2,697 a week, about ${aud(JSA_ANNUAL)} a year (May 2025).`,
    },
    {
      q: "What is a business analyst's take-home pay?",
      a: `On the ${aud(BA.medianSalary)} median, about ${aud(netAnnual(BA.medianSalary))} a year or ${aud(netFortnightly(BA.medianSalary))} a fortnight after 2026–27 income tax and the Medicare levy, with no HECS-HELP and with private hospital cover. On the ${aud(JSA_ANNUAL)} full-time median, about ${aud(netAnnual(JSA_ANNUAL))} a year.`,
    },
    {
      q: "Is there an award for business analysts?",
      a: "No award names the job. A business analyst at an employer principally in the IT industry, in a role needing an ACS-accredited degree, may be covered by the Professional Employees Award; elsewhere it depends on the employer's industry award, and if none applies you are award-free with the National Minimum Wage as the floor.",
    },
    {
      q: "Do business analysts earn more than systems analysts?",
      a: "About the same. On 2023–24 tax returns the median salary or wage income was $119,229 for business analysts and $119,204 for systems analysts, though systems analysts' average was higher ($125,940 against $123,441).",
    },
    {
      q: "Do business analysts get paid overtime?",
      a: "Not automatically. Without an award, there is no overtime rate: the National Employment Standards allow reasonable additional hours, and whether they are paid depends on your contract. If the Professional Employees Award covers you, it pays overtime at the ordinary hourly rate until your salary is 25% above your level's minimum.",
    },
  ],
  sources: [
    ATO_TABLE_15,
    jsaSource(MEDIAN),
    { title: "Professional Employees Award 2020 [MA000065] — coverage, cl 4.1(b) and cl 2.3", publisher: "Fair Work Commission", url: PROFESSIONAL_AWARD.url },
    NMW_ORDER_2026,
    FWO_PAY_SLIPS,
  ],
  verifiedOn: PROFESSIONAL_VERIFIED_ON,
  dateModified: "2026-10-09",
  related: [
    { href: "/tech-salary-guide-australia/", label: "Tech Salary Guide" },
    { href: "/job-pay-rates/data-analyst/", label: "Data Analyst Salary" },
    { href: "/job-pay-rates/software-engineer/", label: "Software Engineer Salary" },
  ],
};
