// Project manager — salary page; spoke of /tech-salary-guide-australia/.
//
// Coverage: no modern award names project managers. The Professional
// Employees Award's classifications do not apply to an employee "employed in
// a wholly or principally managerial position" (Schedule A preamble;
// awards.fairwork.gov.au/MA000065.html, read 9 October 2026). The page does
// not say which award, if any, applies, and shows the National Minimum Wage
// Order 2026 (PR799279) as the floor.
//
// ATO: Taxation statistics 2023–24, Individuals Table 15A (data.gov.au,
// ts24individual15occupationsex.xlsx), Total rows, read 9 October 2026. The
// title spans three codes:
//   133111 Builder - construction project manager       74,999 | avg TI 141,215 | med TI 122,139 | avg S/W 131,433 | med S/W 120,744
//   135112 Computing professional - project manager     34,693 | avg TI 157,401 | med TI 145,302 | avg S/W 150,394 | med S/W 145,168
//   511112 Administrator - program                     284,325 | avg TI  81,887 | med TI  74,287 | avg S/W  77,095 | med S/W  72,911
// (511112 sits in unit group 5111 "Contract, program or project administrator";
// JSA names the occupation "Program and Project Administrators (511112)".)
//
// JSA: no single median is used. The nearest profiles are for wider unit
// groups — 1331 Construction Managers ($3,751 a week), 1351 ICT Managers
// ($3,310) and 5111 Contract, Program and Project Administrators ($2,130),
// ABS SEEH May 2025, read 9 October 2026 — each of which mixes project managers
// with other occupations, so none is presented as a project manager median.

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

export const PROJECT_MANAGER_ATO: AtoOccupationStats = {
  incomeYear: ATO_TAXSTATS_INCOME_YEAR,
  intro:
    "\"Project manager\" covers three different ATO occupations: construction project managers, IT project managers, and program or project administrators. Find the one that matches your job; each has its own take-home line below.",
  rows: [
    { code: "133111", title: "Builder - construction project manager", individuals: 74_999, avgTaxableIncome: 141_215, medianTaxableIncome: 122_139, avgSalary: 131_433, medianSalary: 120_744 },
    { code: "135112", title: "Computing professional - project manager", individuals: 34_693, avgTaxableIncome: 157_401, medianTaxableIncome: 145_302, avgSalary: 150_394, medianSalary: 145_168 },
    { code: "511112", title: "Administrator - program", individuals: 284_325, avgTaxableIncome: 81_887, medianTaxableIncome: 74_287, avgSalary: 77_095, medianSalary: 72_911 },
  ],
  takeHomeRows: 3,
};

const [CONSTRUCTION, ICT, ADMIN] = PROJECT_MANAGER_ATO.rows;
const JSA_SOURCES = [
  { title: "Construction Managers (ANZSCO 1331) occupation profile", publisher: "Jobs and Skills Australia", url: "https://www.jobsandskills.gov.au/data/occupation-and-industry-profiles/occupations-anzsco/1331-construction-managers" },
  { title: "ICT Managers (ANZSCO 1351) occupation profile", publisher: "Jobs and Skills Australia", url: "https://www.jobsandskills.gov.au/data/occupation-and-industry-profiles/occupations-anzsco/1351-ict-managers" },
  { title: "Contract, Program and Project Administrators (ANZSCO 5111) occupation profile", publisher: "Jobs and Skills Australia", url: "https://www.jobsandskills.gov.au/data/occupation-and-industry-profiles/occupations-anzsco/5111-contract-program-and-project-administrators" },
];

export const PROJECT_MANAGER: Occupation = {
  slug: "project-manager",
  name: "Project Manager",
  plural: "project managers",
  award: null,
  headline: null,
  coverageMode: "depends",
  heading: "Project Manager Salary Australia 2026 — Construction, IT & Program Roles, With Take-Home",
  metaTitle: `Project Manager Salary 2026 — ${aud(CONSTRUCTION.medianSalary)} to ${aud(ICT.medianSalary)} Median`,
  metaDescription: `Project manager salaries from 2023–24 tax returns: construction ${aud(CONSTRUCTION.medianSalary)} median, IT ${aud(ICT.medianSalary)}, program administrators ${aud(ADMIN.medianSalary)}. Take-home pay on each.`,
  lede: `What a project manager earns depends on what they manage. On 2023–24 tax returns the median salary was ${aud(CONSTRUCTION.medianSalary)} for construction project managers and ${aud(ICT.medianSalary)} for IT project managers, against ${aud(ADMIN.medianSalary)} for program and project administrators (ATO). A construction project manager on the median takes home about ${aud(netFortnightly(CONSTRUCTION.medianSalary))} a fortnight after tax; an IT project manager about ${aud(netFortnightly(ICT.medianSalary))}.`,
  coverage: [
    "No modern award names project managers. The Professional Employees Award, which covers professional engineers and IT staff, says its classifications do not apply to anyone employed in a wholly or principally managerial position (Schedule A), so an engineer or IT professional who moves into a mainly managerial project role can leave that award's coverage.",
    "Whether another award covers you depends on your employer's industry and how much of your work is managerial. If none does, you are award-free: the National Minimum Wage and the National Employment Standards are your legal floor, and your contract or enterprise agreement sets everything above it.",
  ],
  tables: [nmwTable("project managers")],
  penalties: [],
  penaltiesNote: DEPENDS_PENALTIES_NOTE,
  overtime: DEPENDS_OVERTIME,
  allowances: [],
  median: null,
  ato: PROJECT_MANAGER_ATO,
  notices: [
    "The three ATO occupations are very different jobs. Program and project administrators are by far the largest group, and their figures are much lower than either kind of project manager.",
  ],
  payslipNotes: [PAYSLIP_TIMING, PAYSLIP_BONUSES, PAYSLIP_SUPER_AND_DEDUCTIONS],
  notShown: [
    "A single Jobs and Skills Australia median: its profiles cover construction managers, ICT managers, and contract, program and project administrators as wider groups that mix project managers with other jobs, so none is a project manager figure.",
    "An award rate: no award names the job.",
    "Bonuses and allowances: no official source publishes them for project managers.",
  ],
  faqs: [
    {
      q: "How much does a project manager earn in Australia?",
      a: `It depends on the field. On 2023–24 tax returns, construction project managers had a median salary or wage income of ${aud(CONSTRUCTION.medianSalary)} (average ${aud(CONSTRUCTION.avgSalary)}) and IT project managers ${aud(ICT.medianSalary)} (average ${aud(ICT.avgSalary)}), according to the ATO. Program and project administrators had a median of ${aud(ADMIN.medianSalary)}.`,
    },
    {
      q: "What does an IT project manager take home after tax?",
      a: `On the ${aud(ICT.medianSalary)} median, about ${aud(netAnnual(ICT.medianSalary))} a year or ${aud(netFortnightly(ICT.medianSalary))} a fortnight after 2026–27 income tax and the Medicare levy, with no HECS-HELP and with private hospital cover.`,
    },
    {
      q: "What does a construction project manager take home after tax?",
      a: `On the ${aud(CONSTRUCTION.medianSalary)} median, about ${aud(netAnnual(CONSTRUCTION.medianSalary))} a year or ${aud(netFortnightly(CONSTRUCTION.medianSalary))} a fortnight after 2026–27 income tax and the Medicare levy, with no HECS-HELP and with private hospital cover.`,
    },
    {
      q: "Is there an award for project managers?",
      a: "No award names the job. The Professional Employees Award, for example, excludes anyone in a wholly or principally managerial position. Whether another award applies depends on your employer's industry and duties; if none does, you are award-free and the National Minimum Wage is the floor.",
    },
    {
      q: "Do project managers get paid overtime?",
      a: "Only if your contract, an enterprise agreement or an award provides for it. Award-free employees have no award overtime rate, and the National Employment Standards allow an employer to require reasonable additional hours. If an award does cover your role, its overtime clause applies.",
    },
  ],
  sources: [ATO_TABLE_15, ...JSA_SOURCES, { title: "Professional Employees Award 2020 [MA000065] — Schedule A", publisher: "Fair Work Commission", url: PROFESSIONAL_AWARD.url }, NMW_ORDER_2026, FWO_PAY_SLIPS],
  verifiedOn: PROFESSIONAL_VERIFIED_ON,
  dateModified: "2026-10-09",
  related: [
    { href: "/tech-salary-guide-australia/", label: "Tech Salary Guide" },
    { href: "/construction-trades-pay/", label: "Construction & Trades Pay" },
    { href: "/job-pay-rates/business-analyst/", label: "Business Analyst Salary" },
  ],
};
