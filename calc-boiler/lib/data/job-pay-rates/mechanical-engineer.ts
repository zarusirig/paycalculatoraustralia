// Mechanical engineer — a discipline page under /job-pay-rates/engineer/.
//
// Award: Professional Employees Award 2020 [MA000065], rows read from the
// engineer table (see professional-common.ts), re-read 9 October 2026.
// "Professional engineering duties" are duties needing qualifications at least
// equal to a graduate member of Engineers Australia (cl 2.2), so technicians
// and draftspersons are outside these classifications. Exclusions in cl 4.2
// include the Black Coal Mining Industry and Airport Employees awards.
// Annual leave loading 17.5% (cl 19.2); time off instead of overtime hour for
// hour (cl 18.3).
//
// ATO: Taxation statistics 2023–24, Individuals Table 15A (data.gov.au,
// ts24individual15occupationsex.xlsx), Total rows, read 9 October 2026:
//   233512 Engineer - mechanical                          42,582 | avg TI 129,531 | med TI 116,735 | avg S/W 123,198 | med S/W 115,872
//   233511 Engineer - industrial                           3,716 | avg TI 128,624 | med TI 112,798 | avg S/W 121,194 | med S/W 111,613
//   233513 Engineer - production or plant                  7,395 | avg TI 115,643 | med TI 100,030 | avg S/W 109,115 | med S/W 100,176
//   312512 Mechanical engineering technician or associate  8,193 | avg TI 110,740 | med TI 100,591 | avg S/W 106,439 | med S/W 100,450
//
// JSA: ANZSCO 2335 Industrial, Mechanical and Production Engineers, median
// full-time earnings $2,614 a week, $67 an hour (ABS SEEH May 2025), all
// occupations $1,852; jobsandskills.gov.au/.../2335-industrial-mechanical-and-production-engineers,
// read 9 October 2026.

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
  anzscoCode: "2335",
  anzscoTitle: "Industrial, Mechanical and Production Engineers",
  medianWeekly: 2_614,
  medianHourly: 67,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("2335-industrial-mechanical-and-production-engineers"),
};

export const MECHANICAL_ENGINEER_ATO: AtoOccupationStats = {
  incomeYear: ATO_TAXSTATS_INCOME_YEAR,
  intro:
    "Industrial and production or plant engineers share the mechanical engineers' ANZSCO unit group. Mechanical engineering technicians are a separate, non-professional occupation, shown because the job titles are easily confused.",
  rows: [
    { code: "233512", title: "Engineer - mechanical", individuals: 42_582, avgTaxableIncome: 129_531, medianTaxableIncome: 116_735, avgSalary: 123_198, medianSalary: 115_872 },
    { code: "233511", title: "Engineer - industrial", individuals: 3_716, avgTaxableIncome: 128_624, medianTaxableIncome: 112_798, avgSalary: 121_194, medianSalary: 111_613 },
    { code: "233513", title: "Engineer - production or plant", individuals: 7_395, avgTaxableIncome: 115_643, medianTaxableIncome: 100_030, avgSalary: 109_115, medianSalary: 100_176 },
    { code: "312512", title: "Mechanical engineering technician or associate", individuals: 8_193, avgTaxableIncome: 110_740, medianTaxableIncome: 100_591, avgSalary: 106_439, medianSalary: 100_450 },
  ],
};

const GRAD = peaRow(PEA.grad45, "Graduate mechanical engineer (4 or 5-year degree recognised by Engineers Australia)");
const PP14 = peaRow(PEA.pp14);
const L2 = peaRow(PEA.level2, "Experienced engineer");
const ATO_MEDIAN = MECHANICAL_ENGINEER_ATO.rows[0].medianSalary;
const ATO_AVERAGE = MECHANICAL_ENGINEER_ATO.rows[0].avgSalary;
const JSA_ANNUAL = MEDIAN.medianWeekly * 52;

export const MECHANICAL_ENGINEER: Occupation = {
  slug: "mechanical-engineer",
  name: "Mechanical Engineer",
  plural: "mechanical engineers",
  award: PROFESSIONAL_AWARD,
  headline: {
    tableId: "mechanical-professional",
    label: PEA.grad45,
    why: "a graduate mechanical engineer with a 4 or 5-year degree recognised by Engineers Australia",
  },
  heading: "Mechanical Engineer Salary Australia 2026 — Median, Award Minimum & Take-Home",
  metaTitle: `Mechanical Engineer Salary 2026 — ${aud(ATO_MEDIAN)} Median, ${aud2(GRAD.hourly)}/hr`,
  metaDescription: `Mechanical engineer salary: ${aud(ATO_MEDIAN)} median on 2023–24 tax returns, $2,614 a week full-time median, ${aud(GRAD.annual!)} graduate award minimum, and take-home on each.`,
  lede: `The 42,582 mechanical engineers on 2023–24 tax returns had a median salary of ${aud(ATO_MEDIAN)} and an average of ${aud(ATO_AVERAGE)} (ATO). Full-time employees in the wider industrial, mechanical and production engineering group had median pay of $2,614 a week in May 2025 (Jobs and Skills Australia). The legal minimum for a graduate is ${aud(GRAD.annual!)} a year (${aud2(GRAD.hourly)} an hour), and on the ${aud(ATO_MEDIAN)} median take-home pay is about ${aud(netFortnightly(ATO_MEDIAN))} a fortnight.`,
  parent: {
    href: "/job-pay-rates/engineer/",
    label: "Engineer Pay Rates",
    blurb: "which lists every Professional Employees Award pay point and the rules all engineers share",
  },
  coverage: [
    "A mechanical engineer doing professional engineering duties — work that needs qualifications at least equal to a graduate member of Engineers Australia (cl 2.2) — is covered by the Professional Employees Award 2020 [MA000065] in any industry (cl 4.1(a)).",
    "Mechanical engineering technicians and draftspersons are not doing professional engineering duties as the award defines them, so these classifications and minimums are not theirs; which award covers them, if any, depends on the employer's industry.",
    "The award does not cover employees who are covered by the Black Coal Mining Industry, Airport Employees, Rail Industry, Electrical Power Industry, Water Industry, Port Authorities or State Government Agencies awards (cl 4.2).",
    "A graduate engineer enters at Level 1 pay point 1.1 and moves up one pay point each anniversary to 1.4 (Schedule A.1.3); Level 2 is an experienced engineer.",
  ],
  tables: [
    {
      id: "mechanical-professional",
      title: "Mechanical engineer minimum salaries by level, 2026–27",
      intro:
        "Annual wages from clause 14.1, the award's weekly conversion (annual x 6/313), and Schedule C hourly and casual rates. The 3-year degree rate is left out because a graduate engineer holds a 4 or 5-year degree.",
      rows: [GRAD, peaRow(PEA.pp12), peaRow(PEA.pp13), PP14, L2, peaRow(PEA.level3), peaRow(PEA.level4)],
    },
  ],
  penalties: PEA_PENALTIES,
  penaltiesNote: PEA_PENALTIES_NOTE,
  overtime: [
    `Hours over 38 a week are paid at the ordinary minimum hourly rate (cl 18.2(a)) — ${aud2(PP14.hourly)} an hour at pay point 1.4 — or taken as time off hour for hour by agreement (cl 18.3).`,
    `Those rules fall away once your salary is at least 25% above your level's minimum (cl 18.6): ${aud2(exemptionThreshold(GRAD.annual!))} at pay point 1.1, ${aud2(exemptionThreshold(PP14.annual!))} at pay point 1.4 and ${aud(exemptionThreshold(L2.annual!))} at Level 2.`,
  ],
  allowances: PEA_ALLOWANCES,
  median: MEDIAN,
  ato: MECHANICAL_ENGINEER_ATO,
  notices: [
    "If your job title is mechanical engineering technician or draftsperson, the Professional Employees Award rates on this page do not apply to you.",
  ],
  payslipNotes: [
    "Annual leave loading: when you take annual leave you must also be paid a 17.5% loading on your base rate (cl 19.2), unless your salary already includes an equivalent benefit. A loading has to be shown separately on the payslip (Fair Work Ombudsman, pay slips).",
    "Time off instead of overtime: if you agree to bank overtime as time off, it is taken hour for hour (cl 18.3); it should not also appear as paid overtime.",
    `Graduate pay points: from ${aud(GRAD.annual!)} at 1.1 your salary should step up on each anniversary to ${aud(PP14.annual!)} at 1.4, unless your employer defers it in writing (Schedule A.1.3–A.1.4).`,
    PAYSLIP_SUPER_AND_DEDUCTIONS,
  ],
  notShown: [
    "Award rates for mechanical engineering technicians and draftspersons, which depend on the employer's industry award.",
    "Enterprise agreement pay scales.",
    "Recruiter salary bands: they are not official figures.",
  ],
  faqs: [
    {
      q: "How much do mechanical engineers earn in Australia?",
      a: `On 2023–24 tax returns, mechanical engineers had a median salary or wage income of ${aud(ATO_MEDIAN)} and an average of ${aud(ATO_AVERAGE)} (ATO). Jobs and Skills Australia's full-time median for industrial, mechanical and production engineers is $2,614 a week, about ${aud(JSA_ANNUAL)} a year (May 2025).`,
    },
    {
      q: "What is the starting salary for a graduate mechanical engineer?",
      a: `The legal minimum is ${aud(GRAD.annual!)} a year, ${aud2(GRAD.hourly)} an hour, at Professional Employees Award Level 1 pay point 1.1 for a graduate with a 4 or 5-year degree recognised by Engineers Australia, from the first full pay period on or after 1 July 2026.`,
    },
    {
      q: "What does a mechanical engineer take home after tax?",
      a: `On the ${aud(ATO_MEDIAN)} ATO median, about ${aud(netAnnual(ATO_MEDIAN))} a year or ${aud(netFortnightly(ATO_MEDIAN))} a fortnight after 2026–27 income tax and the Medicare levy (no HECS-HELP). On the ${aud(GRAD.annual!)} graduate minimum, about ${aud(netAnnual(GRAD.annual!))} a year.`,
    },
    {
      q: "Is a mechanical engineering technician paid the engineer award rate?",
      a: "No. The Professional Employees Award covers professional engineering duties — work needing qualifications at least equal to a graduate member of Engineers Australia. Technicians fall outside it; which award covers them depends on the employer's industry. On 2023–24 tax returns their median salary was $100,450, against $115,872 for mechanical engineers.",
    },
    {
      q: "Do mechanical engineers get paid overtime?",
      a: `Below a salary line, yes, but at the ordinary hourly rate rather than time and a half (cl 18.2(a)), or as time off hour for hour. Once your salary is at least 25% above your level's minimum — ${aud2(exemptionThreshold(GRAD.annual!))} for a graduate — the award's overtime clause no longer applies and your contract decides.`,
    },
    {
      q: "Do industrial engineers earn the same as mechanical engineers?",
      a: "Slightly less. On 2023–24 tax returns the median salary or wage income was $111,613 for industrial engineers and $100,176 for production or plant engineers, against $115,872 for mechanical engineers. All three are professional engineers under the same award minimums.",
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
    { href: "/job-pay-rates/electrical-engineer/", label: "Electrical Engineer Salary" },
    { href: "/job-pay-rates/civil-engineer/", label: "Civil Engineer Salary" },
    { href: "/graduate-salary-australia/", label: "Graduate Salary Australia" },
  ],
};
