// Electrical engineer — a discipline page under /job-pay-rates/engineer/.
//
// Award: Professional Employees Award 2020 [MA000065], rows read from the
// engineer table (see professional-common.ts), re-read 9 October 2026. The
// award covers professional engineers in any industry (cl 4.1(a)) but not
// employees covered by the Electrical Power Industry Award 2020 (cl 4.2(c)),
// the Rail Industry Award (cl 4.2(f)) or the other awards listed in cl 4.2.
// Penalty rates: cl 18.4 / Schedule C — 125% before 6 am or after 10 pm
// Monday to Saturday, 150% Sundays and public holidays.
//
// ATO: Taxation statistics 2023–24, Individuals Table 15A (data.gov.au,
// ts24individual15occupationsex.xlsx), Total rows, read 9 October 2026:
//   233311 Electrical engineer   34,797 | avg TI 141,415 | med TI 132,349 | avg S/W 134,110 | med S/W 130,630
//   233411 Electronics engineer   7,595 | avg TI 130,290 | med TI 115,546 | avg S/W 118,230 | med S/W 113,202
//
// JSA: ANZSCO 2333 Electrical Engineers, median full-time earnings $2,553 a
// week, $67 an hour (ABS SEEH May 2025), all occupations $1,852;
// jobsandskills.gov.au/.../2333-electrical-engineers, read 9 October 2026.

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
  anzscoCode: "2333",
  anzscoTitle: "Electrical Engineers",
  medianWeekly: 2_553,
  medianHourly: 67,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("2333-electrical-engineers"),
};

export const ELECTRICAL_ENGINEER_ATO: AtoOccupationStats = {
  incomeYear: ATO_TAXSTATS_INCOME_YEAR,
  intro:
    "Electronics engineers have their own ATO code and their own ANZSCO unit group (2334), so they are shown separately for comparison.",
  rows: [
    { code: "233311", title: "Electrical engineer", individuals: 34_797, avgTaxableIncome: 141_415, medianTaxableIncome: 132_349, avgSalary: 134_110, medianSalary: 130_630 },
    { code: "233411", title: "Electronics engineer", individuals: 7_595, avgTaxableIncome: 130_290, medianTaxableIncome: 115_546, avgSalary: 118_230, medianSalary: 113_202 },
  ],
};

const GRAD = peaRow(PEA.grad45, "Graduate electrical engineer (4 or 5-year degree recognised by Engineers Australia)");
const L2 = peaRow(PEA.level2, "Experienced engineer");
const L3 = peaRow(PEA.level3);
const ATO_MEDIAN = ELECTRICAL_ENGINEER_ATO.rows[0].medianSalary;
const ATO_AVERAGE = ELECTRICAL_ENGINEER_ATO.rows[0].avgSalary;
const JSA_ANNUAL = MEDIAN.medianWeekly * 52;

export const ELECTRICAL_ENGINEER: Occupation = {
  slug: "electrical-engineer",
  name: "Electrical Engineer",
  plural: "electrical engineers",
  award: PROFESSIONAL_AWARD,
  headline: {
    tableId: "electrical-professional",
    label: PEA.grad45,
    why: "a graduate electrical engineer with a 4 or 5-year degree recognised by Engineers Australia",
  },
  heading: "Electrical Engineer Salary Australia 2026 — Median Pay, Award Minimum & Take-Home",
  metaTitle: `Electrical Engineer Salary 2026 — ${aud(ATO_MEDIAN)} Median, ${aud2(GRAD.hourly)}/hr Min`,
  metaDescription: `Electrical engineers' median salary was ${aud(ATO_MEDIAN)} on 2023–24 tax returns and $2,553 a week full-time (JSA). Graduate award minimum ${aud(GRAD.annual!)}; take-home on each.`,
  lede: `Electrical engineers had a median salary of ${aud(ATO_MEDIAN)} on 2023–24 tax returns, higher than civil ($120,000) or mechanical engineers ($115,872), according to the ATO; Jobs and Skills Australia puts their median full-time pay at $2,553 a week (May 2025). The award floor for a graduate is ${aud(GRAD.annual!)} a year, ${aud2(GRAD.hourly)} an hour. On the ${aud(ATO_MEDIAN)} median, take-home pay is about ${aud(netAnnual(ATO_MEDIAN))} a year after tax.`,
  parent: {
    href: "/job-pay-rates/engineer/",
    label: "Engineer Pay Rates",
    blurb: "which lists every Professional Employees Award pay point and the rules all engineers share",
  },
  coverage: [
    "An electrical engineer whose duties need qualifications at least equal to a graduate member of Engineers Australia is a professional engineer under the Professional Employees Award 2020 [MA000065], in any industry (cl 4.1(a)).",
    "The award does not cover employees who are covered by the Electrical Power Industry Award 2020 (cl 4.2(c)). If you work for an electricity generation, transmission or distribution business, check whether that award or an enterprise agreement sets your pay. Engineers covered by the Rail Industry, Black Coal Mining, Airport Employees, Water Industry or State Government Agencies awards are excluded too (cl 4.2).",
    "Electricians are tradespeople, not professional engineers, and have a different award and different minimums: see the electrician page.",
    "Graduates start at Level 1 pay point 1.1 and move up a pay point each anniversary (Schedule A.1.3). Level 2 is an experienced engineer: a member of Engineers Australia, or someone with 4 years' professional engineering experience after qualifying.",
  ],
  tables: [
    {
      id: "electrical-professional",
      title: "Electrical engineer minimum salaries by level, 2026–27",
      intro:
        "Annual wages from clause 14.1, the award's weekly conversion (annual x 6/313), and the hourly and casual rates exactly as Schedule C publishes them. A graduate engineer needs a 4 or 5-year degree, so the 3-year degree rate is not shown.",
      rows: [GRAD, peaRow(PEA.pp12), peaRow(PEA.pp13), peaRow(PEA.pp14), L2, L3, peaRow(PEA.level4)],
    },
  ],
  penalties: PEA_PENALTIES,
  penaltiesNote: PEA_PENALTIES_NOTE,
  overtime: [
    `Overtime beyond 38 hours a week is paid at the minimum hourly rate (cl 18.2(a)), including call-backs and work done remotely — ${aud2(L2.hourly)} an hour at Level 2.`,
    `None of the overtime, penalty or record-keeping clauses apply if your contract salary is at least 25% above your level's minimum (cl 18.6): ${aud2(exemptionThreshold(GRAD.annual!))} for a graduate at pay point 1.1, ${aud(exemptionThreshold(L2.annual!))} at Level 2, ${aud2(exemptionThreshold(L3.annual!))} at Level 3.`,
  ],
  allowances: PEA_ALLOWANCES,
  median: MEDIAN,
  ato: ELECTRICAL_ENGINEER_ATO,
  notices: [
    "Electrical engineers covered by the Electrical Power Industry Award 2020 are outside the Professional Employees Award, so the rates below are not their minimums (cl 4.2(c)).",
  ],
  payslipNotes: [
    `Night and weekend hours: below the cl 18.6 salary line, hours you are directed to work before 6 am or after 10 pm Monday to Saturday are paid at 125%, and Sunday and public holiday hours at 150% (cl 18.4) — $43.21 and $51.86 an hour for a pay point 1.1 graduate (Schedule C.1). Penalty pay must be shown as its own amount on the payslip (Fair Work Ombudsman, pay slips).`,
    "Your pay point should rise on each anniversary as a graduate, from 1.1 to 1.4, unless your employer defers it in writing (Schedule A.1.3–A.1.4).",
    "Vehicle allowance: agreed use of your own car on the employer's business is paid at least $1.00 a kilometre (cl 16.3), shown separately from salary.",
    PAYSLIP_SUPER_AND_DEDUCTIONS,
  ],
  notShown: [
    "Rates under the Electrical Power Industry Award 2020 and electricity network enterprise agreements.",
    "Electrician and electrical trade rates, which are on the electrician page.",
    "Recruiter salary surveys by seniority: they are not official figures.",
  ],
  faqs: [
    {
      q: "How much does an electrical engineer earn in Australia?",
      a: `The 34,797 people who gave their occupation as electrical engineer on 2023–24 tax returns had a median salary or wage income of ${aud(ATO_MEDIAN)} and an average of ${aud(ATO_AVERAGE)} (ATO). Jobs and Skills Australia puts median full-time earnings for electrical engineers at $2,553 a week, about ${aud(JSA_ANNUAL)} a year (May 2025).`,
    },
    {
      q: "What is the graduate electrical engineer salary in 2026?",
      a: `The award minimum is ${aud(GRAD.annual!)} a year, or ${aud2(GRAD.hourly)} an hour, for a graduate with a 4 or 5-year degree recognised by Engineers Australia (Professional Employees Award, Level 1 pay point 1.1, from 1 July 2026). It is only a floor: half of all electrical engineers on 2023–24 tax returns earned more than ${aud(ATO_MEDIAN)}.`,
    },
    {
      q: "What is an electrical engineer's take-home pay?",
      a: `About ${aud(netAnnual(ATO_MEDIAN))} a year, or ${aud(netFortnightly(ATO_MEDIAN))} a fortnight, on the ${aud(ATO_MEDIAN)} ATO median salary after 2026–27 income tax and the Medicare levy, with no HECS-HELP and with private hospital cover. On the ${aud(JSA_ANNUAL)} JSA full-time median it is about ${aud(netAnnual(JSA_ANNUAL))} a year.`,
    },
    {
      q: "Is an electrical engineer at a power company on the Professional Employees Award?",
      a: "Not if the Electrical Power Industry Award 2020 covers them: the Professional Employees Award excludes employees covered by that award (cl 4.2(c)). Check your employment contract or enterprise agreement for the instrument that applies.",
    },
    {
      q: "Do electrical engineers earn more than electronics engineers?",
      a: "On 2023–24 tax returns, yes: the median salary or wage income was $130,630 for electrical engineers and $113,202 for electronics engineers. Both are professional engineers under the same award, so the minimums are identical.",
    },
    {
      q: "Is an electrical engineer paid the same award as an electrician?",
      a: "No. Electrical engineers doing professional engineering work are under the Professional Employees Award, which sets annual salaries. Electricians are tradespeople with their own award and hourly minimums, shown on the electrician page.",
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
    { href: "/job-pay-rates/electrician/", label: "Electrician Pay Rates" },
    { href: "/job-pay-rates/civil-engineer/", label: "Civil Engineer Salary" },
    { href: "/job-pay-rates/mechanical-engineer/", label: "Mechanical Engineer Salary" },
  ],
};
