// Cyber security — salary page; spoke of /tech-salary-guide-australia/.
//
// Award: Professional Employees Award 2020 [MA000065], information technology
// stream (same coverage test as software engineers: cl 4.1(b) employer
// principally in the IT, telecommunications services or quality auditing
// industry; cl 2.3 professional IT duties needing an ACS-accredited degree or
// ACS Certified Professional standing). Penalty rates cl 18.4 / Schedule C.1:
// pay point 1.1 (3 year degree) $33.71 ordinary, $42.14 at 125%, $50.57 at
// 150%. Re-read 9 October 2026.
//
// ATO: Taxation statistics 2023–24, Individuals Table 15A (data.gov.au,
// ts24individual15occupationsex.xlsx), Total rows, read 9 October 2026. The
// 2023–24 coding has seven cyber occupations across two unit groups (2613
// software and applications programmers; 2621 database or systems
// administrator, or IT security specialist):
//   262116 Cyber security analyst                              4,070 | avg TI 113,408 | med TI 100,511 | avg S/W 108,663 | med S/W  99,733
//   261315 Cyber security engineer                             2,003 | avg TI 145,753 | med TI 132,485 | avg S/W 135,653 | med S/W 133,128
//   262115 Cyber security advice and assessment specialist     1,454 | avg TI 160,984 | med TI 148,824 | avg S/W 153,217 | med S/W 147,590
//   262114 Cyber governance risk and compliance specialist     1,404 | avg TI 138,649 | med TI 127,182 | avg S/W 136,572 | med S/W 127,109
//   262117 Cyber security architect                              664 | avg TI 186,239 | med TI 179,676 | avg S/W 181,966 | med S/W 180,327
//   262118 Cyber security operations coordinator                 531 | avg TI 138,173 | med TI 125,750 | avg S/W 133,502 | med S/W 124,224
//   261317 Penetration tester                                    121 | avg TI 104,473 | med TI  95,756 | avg S/W 104,205 | med S/W  99,239
//
// JSA: ANZSCO 2621 Database and Systems Administrators, and ICT Security
// Specialists, median full-time earnings $2,461 a week, $66 an hour (ABS SEEH
// May 2025), all occupations $1,852, read 9 October 2026. JSA's ANZSCO 2013
// profile has a single "ICT Security Specialists (262112)" occupation.

import {
  ANNUAL_WAGE_REVIEW_2026,
  ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  ATO_TABLE_15,
  ATO_TAXSTATS_INCOME_YEAR,
  jsaSource,
  jsaUrl,
} from "./common";
import {
  FWO_PAY_SLIPS,
  PAYSLIP_SUPER_AND_DEDUCTIONS,
  PEA,
  PEA_ALLOWANCES,
  PEA_PENALTIES,
  PEA_PENALTIES_NOTE,
  PROFESSIONAL_AWARD,
  PROFESSIONAL_VERIFIED_ON,
  aud,
  aud2,
  exemptionThreshold,
  netAnnual,
  netFortnightly,
  peaRow,
} from "./professional-common";
import type { AtoOccupationStats, MedianEarnings, Occupation } from "./types";

const MEDIAN: MedianEarnings = {
  anzscoCode: "2621",
  anzscoTitle: "Database and Systems Administrators, and ICT Security Specialists",
  medianWeekly: 2_461,
  medianHourly: 66,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("2621-database-and-systems-administrators-and-ict-security-specialists"),
};

export const CYBER_SECURITY_ATO: AtoOccupationStats = {
  incomeYear: ATO_TAXSTATS_INCOME_YEAR,
  intro:
    "The ATO's 2023–24 coding splits cyber security into seven occupations, from analysts to architects. Analysts are the largest group, so the page leads with them; all seven are below.",
  rows: [
    { code: "262116", title: "Cyber security analyst", individuals: 4_070, avgTaxableIncome: 113_408, medianTaxableIncome: 100_511, avgSalary: 108_663, medianSalary: 99_733 },
    { code: "261315", title: "Cyber security engineer", individuals: 2_003, avgTaxableIncome: 145_753, medianTaxableIncome: 132_485, avgSalary: 135_653, medianSalary: 133_128 },
    { code: "262115", title: "Cyber security advice and assessment specialist", individuals: 1_454, avgTaxableIncome: 160_984, medianTaxableIncome: 148_824, avgSalary: 153_217, medianSalary: 147_590 },
    { code: "262114", title: "Cyber governance risk and compliance specialist", individuals: 1_404, avgTaxableIncome: 138_649, medianTaxableIncome: 127_182, avgSalary: 136_572, medianSalary: 127_109 },
    { code: "262117", title: "Cyber security architect", individuals: 664, avgTaxableIncome: 186_239, medianTaxableIncome: 179_676, avgSalary: 181_966, medianSalary: 180_327 },
    { code: "262118", title: "Cyber security operations coordinator", individuals: 531, avgTaxableIncome: 138_173, medianTaxableIncome: 125_750, avgSalary: 133_502, medianSalary: 124_224 },
    { code: "261317", title: "Penetration tester", individuals: 121, avgTaxableIncome: 104_473, medianTaxableIncome: 95_756, avgSalary: 104_205, medianSalary: 99_239 },
  ],
  takeHomeRows: 3,
};

const GRAD3 = peaRow(PEA.grad3, "Graduate IT employee, 3-year ACS-accredited degree");
const L2 = peaRow(PEA.level2, "Experienced IT employee");
const L3 = peaRow(PEA.level3);
const ROWS = CYBER_SECURITY_ATO.rows;
const ANALYST = ROWS[0];
const ENGINEER_ROW = ROWS[1];
const ARCHITECT = ROWS[4];
const PEOPLE = ROWS.reduce((n, r) => n + r.individuals, 0);

export const CYBER_SECURITY: Occupation = {
  slug: "cyber-security",
  name: "Cyber Security Professional",
  plural: "cyber security professionals",
  award: PROFESSIONAL_AWARD,
  headline: {
    tableId: "cyber-it-professional",
    label: PEA.grad3,
    why: "a graduate cyber security professional with a 3-year ACS-accredited degree at an IT-industry employer",
  },
  heading: "Cyber Security Salary Australia 2026 — Seven Roles From Tax Returns, With Take-Home",
  metaTitle: `Cyber Security Salary 2026 — ${aud(ANALYST.medianSalary)}–${aud(ARCHITECT.medianSalary)} Median, ${aud2(GRAD3.hourly)}/hr`,
  metaDescription: `Cyber security salaries from 2023–24 tax returns: analysts ${aud(ANALYST.medianSalary)} median, engineers ${aud(ENGINEER_ROW.medianSalary)}, architects ${aud(ARCHITECT.medianSalary)}. Award floor and take-home pay on each.`,
  lede: `Cyber security pay depends heavily on the role. On 2023–24 tax returns the median salary was ${aud(ANALYST.medianSalary)} for cyber security analysts, ${aud(ENGINEER_ROW.medianSalary)} for cyber security engineers and ${aud(ARCHITECT.medianSalary)} for cyber security architects (ATO). At an employer principally in the IT industry, the Professional Employees Award sets a graduate floor of ${aud(GRAD3.annual!)} a year (${aud2(GRAD3.hourly)} an hour). An analyst on the median takes home about ${aud(netFortnightly(ANALYST.medianSalary))} a fortnight after tax.`,
  coverage: [
    "No award names cyber security roles. Their award coverage, if any, comes through the information technology stream of the Professional Employees Award 2020 [MA000065], which applies only where the employer is principally engaged in the IT, telecommunications services or quality auditing industry (cl 4.1(b)), and only to work needing an ACS-accredited degree or equivalent standing as an ACS Certified Professional (cl 2.3).",
    "A security analyst at a bank, an insurer, a hospital or a government department is outside that stream. Check the award for the employer's industry or your enterprise agreement; if none applies, the National Minimum Wage and the National Employment Standards are the legal floor.",
    "Where the award does apply, a graduate starts at Level 1 pay point 1.1 and an experienced IT employee — 4 years' professional IT experience after the degree — is Level 2. Roles that are wholly or principally managerial are not classified under the award (Schedule A).",
  ],
  tables: [
    {
      id: "cyber-it-professional",
      title: "Cyber security award minimums (IT-industry employers), 2026–27",
      intro:
        "Professional Employees Award clause 14.1 annual wages, the award's weekly conversion (annual x 6/313), and Schedule C hourly and casual rates. They apply only where the award covers you.",
      rows: [GRAD3, peaRow(PEA.grad45), peaRow(PEA.pp12), peaRow(PEA.pp13), peaRow(PEA.pp14), L2, L3, peaRow(PEA.level4)],
    },
  ],
  penalties: PEA_PENALTIES,
  penaltiesNote: PEA_PENALTIES_NOTE,
  overtime: [
    "Work beyond 38 hours a week, including call-backs and incident work done remotely on a device, is overtime paid at the ordinary minimum hourly rate (cl 18.2(a)).",
    `The overtime, penalty and record-keeping clauses do not apply once your salary is at least 25% above your level's minimum (cl 18.6): ${aud2(exemptionThreshold(GRAD3.annual!))} for a 3-year-degree graduate, ${aud(exemptionThreshold(L2.annual!))} at Level 2, ${aud2(exemptionThreshold(L3.annual!))} at Level 3.`,
  ],
  allowances: PEA_ALLOWANCES,
  median: MEDIAN,
  ato: CYBER_SECURITY_ATO,
  notices: [
    `The ATO figures cover ${PEOPLE.toLocaleString("en-AU")} people across seven cyber security occupations in 2023–24. Jobs and Skills Australia's median is for a wider group that also includes database and systems administrators.`,
  ],
  payslipNotes: [
    "Night and weekend incident work: below the cl 18.6 salary line, hours worked at your employer's direction before 6 am or after 10 pm Monday to Saturday are paid at 125% — $42.14 an hour for a graduate on the 3-year rate — and Sundays and public holidays at 150%, $50.57 (cl 18.4, Schedule C.1). They must be shown separately from your ordinary pay (Fair Work Ombudsman, pay slips).",
    "Records: below that line your employer must record hours over 38 a week, before 6 am or after 10 pm, and on Sundays and public holidays (cl 18.5).",
    PAYSLIP_SUPER_AND_DEDUCTIONS,
  ],
  notShown: [
    "Security clearance allowances and public sector cyber security pay scales.",
    "Contractor day rates: awards and the minimum wage apply to employees, not to independent contractors.",
    "Recruiter salary surveys: they are not official figures.",
  ],
  faqs: [
    {
      q: "How much do cyber security professionals earn in Australia?",
      a: `It depends on the role. On 2023–24 tax returns the median salary or wage income was ${aud(ANALYST.medianSalary)} for cyber security analysts, ${aud(ENGINEER_ROW.medianSalary)} for cyber security engineers, $147,590 for advice and assessment specialists and ${aud(ARCHITECT.medianSalary)} for cyber security architects (ATO Taxation statistics 2023–24).`,
    },
    {
      q: "What is a cyber security analyst's salary?",
      a: `The 4,070 cyber security analysts on 2023–24 tax returns had a median salary or wage income of ${aud(ANALYST.medianSalary)} and an average of ${aud(ANALYST.avgSalary)}. On the median, take-home pay is about ${aud(netAnnual(ANALYST.medianSalary))} a year after 2026–27 income tax and the Medicare levy.`,
    },
    {
      q: "Is there an award for cyber security jobs?",
      a: "Only at some employers. The Professional Employees Award covers IT professionals at businesses principally in the IT or telecommunications services industry, for work needing an ACS-accredited degree or equivalent. Elsewhere, check the award for your employer's industry or your enterprise agreement.",
    },
    {
      q: "What is the minimum salary for a graduate in cyber security?",
      a: `Where the award applies, ${aud(GRAD3.annual!)} a year (${aud2(GRAD3.hourly)} an hour) for a graduate with a 3-year accredited degree, at Level 1 pay point 1.1 from 1 July 2026. If no award covers the role, the legal minimum is the National Minimum Wage.`,
    },
    {
      q: "What does a cyber security engineer take home?",
      a: `On the ${aud(ENGINEER_ROW.medianSalary)} median salary, about ${aud(netAnnual(ENGINEER_ROW.medianSalary))} a year or ${aud(netFortnightly(ENGINEER_ROW.medianSalary))} a fortnight after 2026–27 income tax and the Medicare levy, with no HECS-HELP and with private hospital cover.`,
    },
    {
      q: "Are cyber security staff paid for after-hours incidents?",
      a: `Under the Professional Employees Award, call-backs and remote work count as overtime at the ordinary hourly rate, and night and weekend hours attract 125% to 150% — but only while your salary is less than 25% above your level's minimum (${aud(exemptionThreshold(L2.annual!))} at Level 2). Otherwise your contract or agreement decides.`,
    },
  ],
  sources: [
    { title: "Professional Employees Award 2020 [MA000065] — consolidated to 1 July 2026", publisher: "Fair Work Commission", url: PROFESSIONAL_AWARD.url },
    ATO_TABLE_15,
    jsaSource(MEDIAN),
    FWO_PAY_SLIPS,
    ANNUAL_WAGE_REVIEW_2026,
  ],
  verifiedOn: PROFESSIONAL_VERIFIED_ON,
  dateModified: "2026-10-09",
  related: [
    { href: "/tech-salary-guide-australia/", label: "Tech Salary Guide" },
    { href: "/job-pay-rates/software-engineer/", label: "Software Engineer Salary" },
    { href: "/overtime-pay-calculator/", label: "Overtime Pay Calculator" },
  ],
};
