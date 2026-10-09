// Civil engineer — a discipline page under /job-pay-rates/engineer/.
//
// Award: Professional Employees Award 2020 [MA000065], rows read from the
// engineer table (see professional-common.ts), re-read 9 October 2026 at
// awards.fairwork.gov.au/MA000065.html: civil engineers doing professional
// engineering duties are covered in any industry (cl 4.1(a)) unless excluded by
// cl 4.2 (incl. Water Industry, Rail Industry, Port Authorities, Airport
// Employees and State Government Agencies awards) or cl 4.3 (local government
// employees covered by another award).
//
// ATO: Taxation statistics 2023–24, Individuals Table 15A (data.gov.au,
// ts24individual15occupationsex.xlsx), Total rows, read 9 October 2026:
//   233211 Civil engineer             50,761 | avg TI 136,604 | med TI 120,637 | avg S/W 131,274 | med S/W 120,000
//   233212 Engineer - geotechnical     4,127 | avg TI 138,695 | med TI 120,396 | avg S/W 130,823 | med S/W 118,380
//   233214 Engineer - structural       8,190 | avg TI 126,275 | med TI 113,704 | avg S/W 120,847 | med S/W 113,231
//   233215 Engineer - transport        3,179 | avg TI 139,020 | med TI 125,789 | avg S/W 132,594 | med S/W 124,537
//
// JSA: ANZSCO 2332 Civil Engineering Professionals, median full-time earnings
// $2,217 a week, $59 an hour (ABS SEEH May 2025), all occupations $1,852;
// jobsandskills.gov.au/.../2332-civil-engineering-professionals, read 9 October 2026.

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
  anzscoCode: "2332",
  anzscoTitle: "Civil Engineering Professionals",
  medianWeekly: 2_217,
  medianHourly: 59,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("2332-civil-engineering-professionals"),
};

export const CIVIL_ENGINEER_ATO: AtoOccupationStats = {
  incomeYear: ATO_TAXSTATS_INCOME_YEAR,
  intro:
    "The ATO codes geotechnical, structural and transport engineers separately from civil engineers, though all four sit in the same civil engineering professionals group. Their figures are shown for comparison.",
  rows: [
    { code: "233211", title: "Civil engineer", individuals: 50_761, avgTaxableIncome: 136_604, medianTaxableIncome: 120_637, avgSalary: 131_274, medianSalary: 120_000 },
    { code: "233212", title: "Engineer - geotechnical", individuals: 4_127, avgTaxableIncome: 138_695, medianTaxableIncome: 120_396, avgSalary: 130_823, medianSalary: 118_380 },
    { code: "233214", title: "Engineer - structural", individuals: 8_190, avgTaxableIncome: 126_275, medianTaxableIncome: 113_704, avgSalary: 120_847, medianSalary: 113_231 },
    { code: "233215", title: "Engineer - transport", individuals: 3_179, avgTaxableIncome: 139_020, medianTaxableIncome: 125_789, avgSalary: 132_594, medianSalary: 124_537 },
  ],
};

const GRAD = peaRow(PEA.grad45, "Graduate civil engineer (4 or 5-year degree recognised by Engineers Australia)");
const L2 = peaRow(PEA.level2, "Experienced engineer: Engineers Australia member, or 4 years' experience after qualifying");
const L4 = peaRow(PEA.level4);
const ATO_MEDIAN = CIVIL_ENGINEER_ATO.rows[0].medianSalary;
const ATO_AVERAGE = CIVIL_ENGINEER_ATO.rows[0].avgSalary;

export const CIVIL_ENGINEER: Occupation = {
  slug: "civil-engineer",
  name: "Civil Engineer",
  plural: "civil engineers",
  award: PROFESSIONAL_AWARD,
  headline: {
    tableId: "civil-professional",
    label: PEA.grad45,
    why: "a graduate civil engineer with a 4 or 5-year degree recognised by Engineers Australia",
  },
  heading: "Civil Engineer Salary Australia 2026 — Award Minimum, Median & Take-Home",
  metaTitle: `Civil Engineer Salary 2026 — ${aud(ATO_MEDIAN)} Median, ${aud2(GRAD.hourly)}/hr Award`,
  metaDescription: `Civil engineer pay in Australia: ${aud(ATO_MEDIAN)} median and ${aud(ATO_AVERAGE)} average salary on 2023–24 tax returns, the ${aud(GRAD.annual!)} graduate award minimum, and take-home.`,
  lede: `Civil engineers who lodged 2023–24 tax returns had a median salary of ${aud(ATO_MEDIAN)} and an average of ${aud(ATO_AVERAGE)}, according to the ATO. The legal floor is far lower: a graduate civil engineer must be paid at least ${aud(GRAD.annual!)} a year (${aud2(GRAD.hourly)} an hour) under the Professional Employees Award from 1 July 2026. On the ${aud(ATO_MEDIAN)} median, take-home pay is about ${aud(netAnnual(ATO_MEDIAN))} a year, or ${aud(netFortnightly(ATO_MEDIAN))} a fortnight.`,
  parent: {
    href: "/job-pay-rates/engineer/",
    label: "Engineer Pay Rates",
    blurb: "which lists every Professional Employees Award pay point and the rules all engineers share",
  },
  coverage: [
    "A civil engineer doing professional engineering work — duties that need qualifications at least equal to a graduate member of Engineers Australia — is covered by the Professional Employees Award 2020 [MA000065] whatever industry the employer is in (cl 4.1(a)).",
    "The award has exclusions that matter for civil engineers. It does not cover employees who are covered by the Water Industry, Rail Industry, Port Authorities, Airport Employees or State Government Agencies awards (cl 4.2), or local government employees covered by another award (cl 4.3). If you work for a water utility, a rail operator, a port, an airport, a council or a state agency, check whether one of those awards or an enterprise agreement sets your pay instead.",
    "A graduate engineer starts at Level 1 pay point 1.1 and moves up one pay point on each anniversary to 1.4 (Schedule A.1.3). An experienced engineer — a member of Engineers Australia, or someone with 4 years' professional engineering experience after qualifying — is Level 2, and Levels 3 and 4 cover engineers with more independence and responsibility.",
  ],
  tables: [
    {
      id: "civil-professional",
      title: "Civil engineer minimum salaries by level, 2026–27",
      intro:
        "Annual wages from clause 14.1; weekly is the award's own conversion (annual x 6/313); hourly and casual rates are exactly as Schedule C publishes them. The 3-year degree rate does not apply to a graduate engineer, whose degree must be 4 or 5 years.",
      rows: [
        GRAD,
        peaRow(PEA.pp12),
        peaRow(PEA.pp13),
        peaRow(PEA.pp14),
        L2,
        peaRow(PEA.level3),
        L4,
      ],
    },
  ],
  penalties: PEA_PENALTIES,
  penaltiesNote: PEA_PENALTIES_NOTE,
  overtime: [
    `Hours beyond 38 a week (or an agreed average) are paid at the minimum hourly rate, not time and a half — ${aud2(GRAD.hourly)} an hour for a graduate at pay point 1.1 (cl 18.2(a)).`,
    `The overtime, penalty and record-keeping clauses stop applying once your contract salary is at least 25% above the minimum for your level (cl 18.6): ${aud2(exemptionThreshold(GRAD.annual!))} for a pay point 1.1 graduate, ${aud(exemptionThreshold(L2.annual!))} at Level 2 and ${aud2(exemptionThreshold(L4.annual!))} at Level 4.`,
    "Below that line, time off instead of overtime pay can be agreed hour for hour (cl 18.3).",
  ],
  allowances: PEA_ALLOWANCES,
  median: MEDIAN,
  ato: CIVIL_ENGINEER_ATO,
  notices: [
    `Overtime under this award is paid at the ordinary hourly rate, and not at all once your salary is 25% or more above your level's minimum — for a graduate, ${aud2(exemptionThreshold(GRAD.annual!))} (cl 18.2(a), cl 18.6).`,
    "A quantity surveyor is coded with civil engineers in ATO statistics but is a different job; see the surveyor page for land surveyors.",
  ],
  payslipNotes: [
    `Pay point rises: as a graduate you move up one pay point on each anniversary — from ${aud(GRAD.annual!)} at 1.1 to ${aud(peaRow(PEA.pp12).annual!)}, ${aud(peaRow(PEA.pp13).annual!)} and ${aud(peaRow(PEA.pp14).annual!)} — unless your employer defers it, and either way it must be confirmed in writing (Schedule A.1.3–A.1.4). If your rate has not changed after an anniversary, ask why.`,
    "Vehicle allowance: if you agree to use your own car for site visits or other work travel, the award requires at least $1.00 a kilometre (cl 16.3), and it must appear as its own line on the payslip, not folded into salary (Fair Work Regulations reg 3.46(1)(g), noted in cl 16).",
    "Recorded hours: below the cl 18.6 salary line your employer must keep records of hours over 38 a week, before 6 am or after 10 pm, and on Sundays and public holidays (cl 18.5) — the hours any overtime or penalty line on your payslip is paid for.",
    PAYSLIP_SUPER_AND_DEDUCTIONS,
  ],
  notShown: [
    "Public sector and enterprise agreement scales for civil engineers at councils, road and water agencies.",
    "Pay by state: the ATO's state table (Table 15D) covers only the wider civil engineering professionals group, so it is not shown here.",
    "Recruiter salary bands from graduate to principal: they are not official figures.",
  ],
  faqs: [
    {
      q: "How much does a civil engineer earn in Australia?",
      a: `The 50,761 people who gave their occupation as civil engineer on 2023–24 tax returns had a median salary or wage income of ${aud(ATO_MEDIAN)} and an average of ${aud(ATO_AVERAGE)} (ATO Taxation statistics 2023–24). Jobs and Skills Australia puts median full-time pay for civil engineering professionals at $2,217 a week (May 2025), about $115,284 a year.`,
    },
    {
      q: "What is the minimum salary for a graduate civil engineer in 2026?",
      a: `${aud(GRAD.annual!)} a year, or ${aud2(GRAD.hourly)} an hour, at Level 1 pay point 1.1 for a graduate with a 4 or 5-year degree recognised by Engineers Australia, under the Professional Employees Award from the first full pay period on or after 1 July 2026. It rises a pay point each anniversary, to ${aud(peaRow(PEA.pp14).annual!)} at pay point 1.4.`,
    },
    {
      q: "What is a civil engineer's take-home pay?",
      a: `On the ATO median salary of ${aud(ATO_MEDIAN)}, take-home pay is about ${aud(netAnnual(ATO_MEDIAN))} a year (${aud(netFortnightly(ATO_MEDIAN))} a fortnight) after income tax and the Medicare levy at 2026–27 rates, with no HECS-HELP. On the ${aud(GRAD.annual!)} graduate minimum it is about ${aud(netAnnual(GRAD.annual!))} a year.`,
    },
    {
      q: "Do civil engineers get paid overtime?",
      a: `Only below a salary line. Under the Professional Employees Award, hours over 38 a week are paid at the ordinary minimum hourly rate — no time and a half — and that stops applying once your salary is at least 25% above your level's minimum, which is ${aud2(exemptionThreshold(GRAD.annual!))} for a graduate and ${aud(exemptionThreshold(L2.annual!))} at Level 2. Above it, overtime depends on your contract.`,
    },
    {
      q: "Do structural and geotechnical engineers earn more than civil engineers?",
      a: "Not on 2023–24 tax returns. The median salary or wage income was $113,231 for structural engineers, $118,380 for geotechnical engineers and $124,537 for transport engineers, against $120,000 for civil engineers. All four sit in the same civil engineering professionals group and under the same award.",
    },
    {
      q: "Is a civil engineer at a council or water utility on this award?",
      a: "Not necessarily. The Professional Employees Award excludes employees covered by the Water Industry, Rail Industry, Port Authorities, Airport Employees and State Government Agencies awards, and local government employees covered by another award (cl 4.2–4.3). Check your employer's award or enterprise agreement.",
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
    { href: "/job-pay-rates/surveyor/", label: "Surveyor Salary" },
    { href: "/job-pay-rates/mechanical-engineer/", label: "Mechanical Engineer Salary" },
    { href: "/graduate-salary-australia/", label: "Graduate Salary Australia" },
  ],
};
