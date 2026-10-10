// Data analyst — salary page; spoke of /tech-salary-guide-australia/.
//
// Coverage: no modern award names data analysts. The ATO's Table 15A coding
// puts them (224114) in unit group 2241 with actuaries, mathematicians and
// statisticians, not with ICT professionals. The Professional Employees Award's IT stream reaches only
// employers principally in the IT, telecommunications services or quality
// auditing industry, for duties needing an ACS-accredited degree (cl 4.1(b),
// cl 2.3; awards.fairwork.gov.au/MA000065.html, read 9 October 2026) — so the
// page does not say which award, if any, applies, and shows the National
// Minimum Wage Order 2026 (PR799279) as the floor.
//
// ATO: Taxation statistics 2023–24, Individuals Table 15A (data.gov.au,
// ts24individual15occupationsex.xlsx), Total rows, read 9 October 2026:
//   224114 Data analyst     14,837 | avg TI  92,904 | med TI  89,839 | avg S/W  90,970 | med S/W  89,634
//   224115 Data scientist    3,332 | avg TI 113,326 | med TI 105,640 | avg S/W 107,277 | med S/W 105,143
//   224116 Statistician      2,345 | avg TI 132,219 | med TI 114,300 | avg S/W 119,835 | med S/W 111,413
//
// JSA: no median is used. JSA's ANZSCO profiles use ANZSCO 2013, whose unit
// group 2241 page (read 9 October 2026) lists only Actuaries, Mathematicians
// and Statisticians — the data analyst code did not exist — so its $2,072
// median is not a data analyst figure.

import { ATO_TABLE_15, ATO_TAXSTATS_INCOME_YEAR } from "./common";
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
import type { AtoOccupationStats, Occupation } from "./types";

export const DATA_ANALYST_ATO: AtoOccupationStats = {
  incomeYear: ATO_TAXSTATS_INCOME_YEAR,
  intro:
    "Data scientists and statisticians are separate codes in the same ATO occupation group as data analysts; their figures are shown for comparison.",
  rows: [
    { code: "224114", title: "Data analyst", individuals: 14_837, avgTaxableIncome: 92_904, medianTaxableIncome: 89_839, avgSalary: 90_970, medianSalary: 89_634 },
    { code: "224115", title: "Data scientist", individuals: 3_332, avgTaxableIncome: 113_326, medianTaxableIncome: 105_640, avgSalary: 107_277, medianSalary: 105_143 },
    { code: "224116", title: "Statistician", individuals: 2_345, avgTaxableIncome: 132_219, medianTaxableIncome: 114_300, avgSalary: 119_835, medianSalary: 111_413 },
  ],
  takeHomeRows: 2,
};

const ANALYST = DATA_ANALYST_ATO.rows[0];
const SCIENTIST = DATA_ANALYST_ATO.rows[1];

export const DATA_ANALYST: Occupation = {
  slug: "data-analyst",
  name: "Data Analyst",
  plural: "data analysts",
  award: null,
  headline: null,
  coverageMode: "depends",
  heading: "Data Analyst Salary Australia 2026 — Median Pay From Tax Returns & Take-Home",
  metaTitle: `Data Analyst Salary Australia 2026 — ${aud(ANALYST.medianSalary)} Median & Take-Home`,
  metaDescription: `Data analysts' median salary was ${aud(ANALYST.medianSalary)} on 2023–24 tax returns, data scientists' ${aud(SCIENTIST.medianSalary)}. Take-home pay on each, award coverage and the legal minimum.`,
  lede: `The 14,837 people who gave their occupation as data analyst on 2023–24 tax returns had a median salary of ${aud(ANALYST.medianSalary)} and an average of ${aud(ANALYST.avgSalary)}, according to the ATO; data scientists' median was ${aud(SCIENTIST.medianSalary)}. On the analyst median, take-home pay is about ${aud(netAnnual(ANALYST.medianSalary))} a year, or ${aud(netFortnightly(ANALYST.medianSalary))} a fortnight, after tax. No award names the job, so the legal floor depends on your employer.`,
  coverage: [
    "No modern award names data analysts, and the ATO's occupation coding puts them with actuaries, mathematicians and statisticians rather than with ICT professionals. That matters because the Professional Employees Award, which covers professional engineers, scientists and IT staff, reaches IT staff only at employers principally in the IT, telecommunications services or quality auditing industry, and only for work needing an ACS-accredited degree or equivalent (cl 4.1(b), cl 2.3).",
    "So whether an award covers you turns on your employer's industry and your duties. This page does not decide that; the Fair Work Ombudsman can help you check. If no award applies, you are award-free: the National Minimum Wage and the National Employment Standards (leave, notice, redundancy and the rest) are your legal floor, and above that your contract or enterprise agreement sets the pay.",
  ],
  tables: [nmwTable("data analysts")],
  penalties: [],
  penaltiesNote: DEPENDS_PENALTIES_NOTE,
  overtime: DEPENDS_OVERTIME,
  allowances: [],
  median: null,
  ato: DATA_ANALYST_ATO,
  notices: [
    "There is no Jobs and Skills Australia median for data analysts: its occupation profiles still use the 2013 classification, which had no data analyst occupation.",
  ],
  payslipNotes: [PAYSLIP_TIMING, PAYSLIP_BONUSES, PAYSLIP_SUPER_AND_DEDUCTIONS],
  notShown: [
    "An award rate for data analysts: none names the job, and we do not guess which industry award applies to you.",
    "A full-time median from Jobs and Skills Australia, for the reason above.",
    "Salary by seniority or city: no official source publishes it for data analysts.",
  ],
  faqs: [
    {
      q: "How much does a data analyst earn in Australia?",
      a: `The 14,837 people who gave their occupation as data analyst on 2023–24 tax returns had a median salary or wage income of ${aud(ANALYST.medianSalary)} and an average of ${aud(ANALYST.avgSalary)} (ATO Taxation statistics 2023–24). Those figures include part-time and part-year workers.`,
    },
    {
      q: "What is a data analyst's take-home pay?",
      a: `On the ${aud(ANALYST.medianSalary)} median, about ${aud(netAnnual(ANALYST.medianSalary))} a year or ${aud(netFortnightly(ANALYST.medianSalary))} a fortnight after 2026–27 income tax and the Medicare levy, with no HECS-HELP. A HECS-HELP debt adds a compulsory repayment on top.`,
    },
    {
      q: "Do data scientists earn more than data analysts?",
      a: `On 2023–24 tax returns, yes: data scientists' median salary or wage income was ${aud(SCIENTIST.medianSalary)}, against ${aud(ANALYST.medianSalary)} for data analysts. Statisticians' median was $111,413.`,
    },
    {
      q: "Is there an award for data analysts?",
      a: "No award names the job. Whether one covers you depends on your employer's industry and your duties: the Professional Employees Award's IT stream, for example, applies only at employers principally in the IT or telecommunications services industry. If no award applies, you are award-free and the National Minimum Wage is the legal floor.",
    },
    {
      q: "What is the minimum wage for a data analyst?",
      a: "If no award covers you, the National Minimum Wage: $26.44 an hour or $1,004.90 a week for adults from the first full pay period on or after 1 July 2026. It is a floor, far below what data analysts typically report.",
    },
  ],
  sources: [
    ATO_TABLE_15,
    { title: "Professional Employees Award 2020 [MA000065] — coverage, cl 4.1(b) and cl 2.3", publisher: "Fair Work Commission", url: PROFESSIONAL_AWARD.url },
    NMW_ORDER_2026,
    FWO_PAY_SLIPS,
  ],
  verifiedOn: PROFESSIONAL_VERIFIED_ON,
  dateModified: "2026-10-09",
  related: [
    { href: "/tech-salary-guide-australia/", label: "Tech Salary Guide" },
    { href: "/job-pay-rates/business-analyst/", label: "Business Analyst Salary" },
    { href: "/hecs-help-calculator/", label: "HECS-HELP Calculator" },
  ],
};
