// Software engineer — salary page; spoke of /tech-salary-guide-australia/.
//
// Award: Professional Employees Award 2020 [MA000065], information technology
// stream, re-read 9 October 2026 at awards.fairwork.gov.au/MA000065.html.
// Coverage is narrower than for engineers: cl 4.1(b) covers only employers
// "principally engaged in the information technology industry, the quality
// auditing industry or the telecommunications services industry". The IT
// industry (cl 2.3) includes the design and manufacture of computer software,
// computer programming, computer consultancy and system analysis services.
// "Graduate information technology employee": a 3, 4 or 5-year degree with a
// science or IT major accredited by the ACS at professional level, or enough
// qualifications and experience to be an ACS Certified Professional (cl 2.3).
// "Experienced IT employee": that degree plus 4 years' professional IT
// experience (cl 2.3) — Level 2. Pay point 1.1 is the entry point for a 3, 4
// or 5-year accredited qualification (Sch A.1.2(a)); cl 14.1 sets a lower
// 1.1 rate for a 3-year degree. Overtime includes call-backs and work done on
// electronic devices or remotely (cl 18.2(a)). Schedule A does not apply to a
// wholly or principally managerial position.
//
// ATO: Taxation statistics 2023–24, Individuals Table 15A (data.gov.au,
// ts24individual15occupationsex.xlsx), Total rows, read 9 October 2026:
//   261313 Computing professional - software engineer      84,585 | avg TI 148,516 | med TI 134,370 | avg S/W 135,788 | med S/W 132,758
//   261312 Applications programmer                          47,545 | avg TI 130,623 | med TI 119,893 | avg S/W 122,258 | med S/W 117,992
//   261311 Computing professional - analyst programmer       8,581 | avg TI 131,497 | med TI 123,030 | avg S/W 126,060 | med S/W 122,234
//   261314 Computing professional - software tester          7,771 | avg TI 108,021 | med TI 105,729 | avg S/W 107,317 | med S/W 106,142
//   261316 Devops engineer                                      666 | avg TI 110,170 | med TI 108,541 | avg S/W 108,034 | med S/W 109,093
//
// JSA: ANZSCO 2613 Software and Applications Programmers, median full-time
// earnings $2,537 a week, $67 an hour (ABS SEEH May 2025), all occupations
// $1,852, read 9 October 2026. JSA's 261313 Software Engineers page prints
// "N/A" for median earnings and lists the main employing industries as
// Professional, Scientific and Technical Services; Financial and Insurance
// Services; Information Media and Telecommunications.

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
  anzscoCode: "2613",
  anzscoTitle: "Software and Applications Programmers",
  medianWeekly: 2_537,
  medianHourly: 67,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("2613-software-and-applications-programmers"),
};

export const SOFTWARE_ENGINEER_ATO: AtoOccupationStats = {
  incomeYear: ATO_TAXSTATS_INCOME_YEAR,
  intro:
    "Developers who described themselves differently on their return were coded to the neighbouring software occupations below, which are shown for comparison.",
  rows: [
    { code: "261313", title: "Computing professional - software engineer", individuals: 84_585, avgTaxableIncome: 148_516, medianTaxableIncome: 134_370, avgSalary: 135_788, medianSalary: 132_758 },
    { code: "261312", title: "Applications programmer", individuals: 47_545, avgTaxableIncome: 130_623, medianTaxableIncome: 119_893, avgSalary: 122_258, medianSalary: 117_992 },
    { code: "261311", title: "Computing professional - analyst programmer", individuals: 8_581, avgTaxableIncome: 131_497, medianTaxableIncome: 123_030, avgSalary: 126_060, medianSalary: 122_234 },
    { code: "261314", title: "Computing professional - software tester", individuals: 7_771, avgTaxableIncome: 108_021, medianTaxableIncome: 105_729, avgSalary: 107_317, medianSalary: 106_142 },
    { code: "261316", title: "Devops engineer", individuals: 666, avgTaxableIncome: 110_170, medianTaxableIncome: 108_541, avgSalary: 108_034, medianSalary: 109_093 },
  ],
  takeHomeRows: 2,
};

const IT_GRAD_NOTE = "Graduate IT employee with a 3-year ACS-accredited degree";
const GRAD3 = peaRow(PEA.grad3, IT_GRAD_NOTE);
const GRAD45 = peaRow(PEA.grad45, "Graduate IT employee with a 4 or 5-year degree");
const L2 = peaRow(PEA.level2, "Experienced IT employee: degree plus 4 years' professional IT experience");
const L4 = peaRow(PEA.level4);
const ATO_MEDIAN = SOFTWARE_ENGINEER_ATO.rows[0].medianSalary;
const ATO_AVERAGE = SOFTWARE_ENGINEER_ATO.rows[0].avgSalary;
const JSA_ANNUAL = MEDIAN.medianWeekly * 52;

export const SOFTWARE_ENGINEER: Occupation = {
  slug: "software-engineer",
  name: "Software Engineer",
  plural: "software engineers",
  award: PROFESSIONAL_AWARD,
  headline: {
    tableId: "it-professional",
    label: PEA.grad3,
    why: "a graduate software engineer with a 3-year ACS-accredited degree working for an IT-industry employer",
  },
  heading: "Software Engineer Salary Australia 2026 — What Tax Returns Show & Take-Home",
  metaTitle: `Software Engineer Salary 2026 — ${aud(ATO_MEDIAN)} Median, ${aud2(GRAD3.hourly)}/hr Award`,
  metaDescription: `Software engineers' median salary was ${aud(ATO_MEDIAN)} on 2023–24 tax returns (ATO). When the IT award applies, its graduate floor and take-home pay on each figure.`,
  lede: `The 84,585 people who gave their occupation as software engineer on 2023–24 tax returns had a median salary of ${aud(ATO_MEDIAN)} and an average of ${aud(ATO_AVERAGE)}, according to the ATO. Whether any award minimum applies depends on your employer: the Professional Employees Award covers IT professionals only at businesses principally in the IT or telecommunications industry, where a graduate's floor is ${aud(GRAD3.annual!)} a year (${aud2(GRAD3.hourly)} an hour). On the ${aud(ATO_MEDIAN)} median, take-home pay is about ${aud(netFortnightly(ATO_MEDIAN))} a fortnight.`,
  coverage: [
    "The Professional Employees Award 2020 [MA000065] covers software engineers only through its information technology stream, and only where the employer is principally engaged in the IT industry or the telecommunications services industry (cl 4.1(b)). The award defines the IT industry to include designing software, computer programming, computer consultancy and system analysis services (cl 2.3).",
    "Within such an employer, the classifications apply to professional IT duties: work that needs a 3, 4 or 5-year degree with a science or IT major accredited by the Australian Computer Society at professional level, or the qualifications and experience to be an ACS Certified Professional (cl 2.3). A graduate starts at Level 1 pay point 1.1; with 4 years' professional IT experience after graduating you are an experienced IT employee at Level 2.",
    "Not every software engineer works in the IT industry: Jobs and Skills Australia lists financial and insurance services among the industries that employ them. A software engineer at a bank, retailer or government agency is not covered by this stream; check the award for that employer's industry or your enterprise agreement, and if none applies the National Minimum Wage and the National Employment Standards are the floor.",
    "The classifications do not apply to anyone employed in a wholly or principally managerial position (Schedule A).",
  ],
  tables: [
    {
      id: "it-professional",
      title: "Software engineer award minimums (IT-industry employers), 2026–27",
      intro:
        "Professional Employees Award annual wages from clause 14.1, the award's weekly conversion (annual x 6/313), and Schedule C hourly and casual rates. They apply only where the award covers you; see above.",
      rows: [GRAD3, GRAD45, peaRow(PEA.pp12), peaRow(PEA.pp13), peaRow(PEA.pp14), L2, peaRow(PEA.level3), L4],
    },
  ],
  penalties: PEA_PENALTIES,
  penaltiesNote: PEA_PENALTIES_NOTE,
  overtime: [
    "Overtime beyond 38 hours a week includes call-backs and work done on electronic devices or remotely, and is paid at the ordinary minimum hourly rate (cl 18.2(a)).",
    `It stops applying once your contract salary is at least 25% above your level's minimum (cl 18.6): ${aud2(exemptionThreshold(GRAD3.annual!))} for a 3-year-degree graduate, ${aud(exemptionThreshold(L2.annual!))} at Level 2 and ${aud2(exemptionThreshold(L4.annual!))} at Level 4.`,
  ],
  allowances: PEA_ALLOWANCES,
  median: MEDIAN,
  ato: SOFTWARE_ENGINEER_ATO,
  notices: [
    "The award rates on this page apply only if your employer is principally in the IT or telecommunications services industry and your role needs an ACS-accredited degree or equivalent (cl 4.1(b), cl 2.3).",
  ],
  payslipNotes: [
    "After-hours and remote work: under the award, answering a call-back or working remotely on a device counts as overtime (cl 18.2(a)). Below the cl 18.6 salary line those hours must be recorded (cl 18.5) and paid, and overtime has to appear as its own amount on the payslip (Fair Work Ombudsman, pay slips).",
    `Salary line: compare your contract salary with 125% of your level's minimum. A graduate on ${aud2(exemptionThreshold(GRAD3.annual!))} or more (3-year degree) is outside the overtime and penalty clauses, so no overtime lines are owed under the award.`,
    PAYSLIP_SUPER_AND_DEDUCTIONS,
  ],
  notShown: [
    "Equity and RSU values: this page shows salary or wage income as people reported it on their tax returns and does not estimate equity.",
    "Contractor day rates: awards and the minimum wage apply to employees, not to independent contractors.",
    "Salary by state or seniority: ATO occupation figures are not published that way for software engineers alone.",
  ],
  faqs: [
    {
      q: "How much does a software engineer earn in Australia?",
      a: `On 2023–24 tax returns, the 84,585 people who gave their occupation as software engineer had a median salary or wage income of ${aud(ATO_MEDIAN)} and an average of ${aud(ATO_AVERAGE)} (ATO Taxation statistics 2023–24). Jobs and Skills Australia's full-time median for software and applications programmers is $2,537 a week, about ${aud(JSA_ANNUAL)} a year (May 2025).`,
    },
    {
      q: "Is there an award for software engineers?",
      a: "Only at some employers. The Professional Employees Award covers IT professionals whose employer is principally in the IT or telecommunications services industry, and whose role needs an ACS-accredited degree or equivalent. A software engineer at a bank or government agency is outside that stream.",
    },
    {
      q: "What is the minimum salary for a graduate software engineer?",
      a: `Where the award applies, ${aud(GRAD3.annual!)} a year (${aud2(GRAD3.hourly)} an hour) for a graduate with a 3-year accredited degree, or ${aud(GRAD45.annual!)} with a 4 or 5-year degree, at Level 1 pay point 1.1 from 1 July 2026. Elsewhere the legal floor is the National Minimum Wage.`,
    },
    {
      q: "What is a software engineer's take-home pay?",
      a: `On the ${aud(ATO_MEDIAN)} ATO median, about ${aud(netAnnual(ATO_MEDIAN))} a year or ${aud(netFortnightly(ATO_MEDIAN))} a fortnight after 2026–27 income tax and the Medicare levy, with no HECS-HELP and with private hospital cover. On the ${aud(ATO_AVERAGE)} average, about ${aud(netAnnual(ATO_AVERAGE))} a year.`,
    },
    {
      q: "Do software engineers get paid for on-call or after-hours work?",
      a: `Under the Professional Employees Award, call-backs and remote work on devices count as overtime, paid at the ordinary hourly rate — but only while your salary is less than 25% above your level's minimum (${aud(exemptionThreshold(L2.annual!))} at Level 2). Above that, and for employees outside the award, your contract decides.`,
    },
    {
      q: "Do software engineers earn more than developers and testers?",
      a: "On 2023–24 tax returns the median salary or wage income was $132,758 for software engineers, $117,992 for applications programmers, $122,234 for analyst programmers and $106,142 for software testers (ATO).",
    },
  ],
  sources: [
    { title: "Professional Employees Award 2020 [MA000065] — consolidated to 1 July 2026", publisher: "Fair Work Commission", url: PROFESSIONAL_AWARD.url },
    ATO_TABLE_15,
    jsaSource(MEDIAN),
    { title: "Software Engineers (ANZSCO 261313) occupation profile", publisher: "Jobs and Skills Australia", url: jsaUrl("261313-software-engineers") },
    FWO_PAY_SLIPS,
    ANNUAL_WAGE_REVIEW_2026,
  ],
  verifiedOn: PROFESSIONAL_VERIFIED_ON,
  dateModified: "2026-10-09",
  related: [
    { href: "/tech-salary-guide-australia/", label: "Tech Salary Guide" },
    { href: "/job-pay-rates/cyber-security/", label: "Cyber Security Salary" },
    { href: "/contractor-vs-employee-calculator/", label: "Contractor vs Employee" },
  ],
};
