// Actuary — salary page.
//
// Coverage: no modern award names actuaries. The Banking, Finance and
// Insurance Award 2020 [MA000019] (awards.fairwork.gov.au/MA000019.html,
// consolidated to 1 July 2026, read 9 October 2026) covers employers in the
// banking, finance and insurance industry "in respect of work by their
// employees in a classification in this award" (cl 4.1); the industry includes
// insurance, superannuation and investment (cl 4.2). The award text does not
// mention actuaries. So the page does not say which award, if any, applies,
// and shows the National Minimum Wage Order 2026 (PR799279) as the floor.
//
// ATO: Taxation statistics 2023–24, Individuals Table 15A (data.gov.au,
// ts24individual15occupationsex.xlsx), Total rows, read 9 October 2026:
//   224111 Actuary         2,927 | avg TI 208,520 | med TI 172,265 | avg S/W 193,788 | med S/W 166,678
//   224116 Statistician    2,345 | avg TI 132,219 | med TI 114,300 | avg S/W 119,835 | med S/W 111,413
//   224112 Mathematician     680 | avg TI 136,970 | med TI 117,730 | avg S/W 122,478 | med S/W 115,374
//
// JSA: ANZSCO 2241 Actuaries, Mathematicians and Statisticians, median
// full-time earnings $2,072 a week, $56 an hour (ABS SEEH May 2025), all
// occupations $1,852; jobsandskills.gov.au/.../2241-actuaries-mathematicians-and-statisticians,
// read 9 October 2026. JSA's 224111 Actuaries page has no separate median.
// JSA lists Financial and Insurance Services first among the industries
// employing unit group 2241. ABS/JSA describe actuaries as analysing data "to predict and assess the
// long-term risk involved in financial decisions and planning".

import { ALL_OCCUPATIONS_MEDIAN_WEEKLY, ATO_TABLE_15, ATO_TAXSTATS_INCOME_YEAR, jsaSource, jsaUrl } from "./common";
import {
  DEPENDS_OVERTIME,
  DEPENDS_PENALTIES_NOTE,
  FWO_PAY_SLIPS,
  NMW_ORDER_2026,
  PAYSLIP_BONUSES,
  PAYSLIP_SUPER_AND_DEDUCTIONS,
  PAYSLIP_TIMING,
  PROFESSIONAL_VERIFIED_ON,
  aud,
  netAnnual,
  netFortnightly,
  nmwTable,
} from "./professional-common";
import type { AtoOccupationStats, MedianEarnings, Occupation } from "./types";

const MEDIAN: MedianEarnings = {
  anzscoCode: "2241",
  anzscoTitle: "Actuaries, Mathematicians and Statisticians",
  medianWeekly: 2_072,
  medianHourly: 56,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("2241-actuaries-mathematicians-and-statisticians"),
};

export const ACTUARY_ATO: AtoOccupationStats = {
  incomeYear: ATO_TAXSTATS_INCOME_YEAR,
  intro:
    "Statisticians and mathematicians share the actuaries' occupation group, and their figures are shown for comparison. The gap matters: the Jobs and Skills Australia median below covers all three.",
  rows: [
    { code: "224111", title: "Actuary", individuals: 2_927, avgTaxableIncome: 208_520, medianTaxableIncome: 172_265, avgSalary: 193_788, medianSalary: 166_678 },
    { code: "224116", title: "Statistician", individuals: 2_345, avgTaxableIncome: 132_219, medianTaxableIncome: 114_300, avgSalary: 119_835, medianSalary: 111_413 },
    { code: "224112", title: "Mathematician", individuals: 680, avgTaxableIncome: 136_970, medianTaxableIncome: 117_730, avgSalary: 122_478, medianSalary: 115_374 },
  ],
};

const ACT = ACTUARY_ATO.rows[0];
const BFI_URL = "https://awards.fairwork.gov.au/MA000019.html";

export const ACTUARY: Occupation = {
  slug: "actuary",
  name: "Actuary",
  plural: "actuaries",
  award: null,
  headline: null,
  coverageMode: "depends",
  heading: "Actuary Salary Australia 2026 — Median Pay From Tax Returns & Take-Home",
  metaTitle: `Actuary Salary Australia 2026 — ${aud(ACT.medianSalary)} Median, ${aud(ACT.avgSalary)} Average`,
  metaDescription: `Actuaries' median salary was ${aud(ACT.medianSalary)} and average ${aud(ACT.avgSalary)} on 2023–24 tax returns (ATO). Take-home pay on each, the Medicare levy surcharge and award coverage.`,
  lede: `Actuaries reported a median salary of ${aud(ACT.medianSalary)} and an average of ${aud(ACT.avgSalary)} on 2023–24 tax returns, according to the ATO — well above statisticians (${aud(ACTUARY_ATO.rows[1].medianSalary)}) and mathematicians (${aud(ACTUARY_ATO.rows[2].medianSalary)}). On the median, take-home pay is about ${aud(netAnnual(ACT.medianSalary))} a year, or ${aud(netFortnightly(ACT.medianSalary))} a fortnight, after income tax and the Medicare levy. No award names the job.`,
  coverage: [
    "No modern award names actuaries. Jobs and Skills Australia lists financial and insurance services first among the industries that employ them, and the award for that industry is the Banking, Finance and Insurance Award 2020 [MA000019] — but it covers those employers only for work in one of its own classifications (cl 4.1), and its text does not mention actuaries. Whether an actuary's role fits one of its classifications depends on the duties.",
    "If no award covers you, you are award-free: the National Minimum Wage and the National Employment Standards are your legal floor, and your contract or enterprise agreement sets your pay above it.",
  ],
  tables: [nmwTable("actuaries")],
  penalties: [],
  penaltiesNote: DEPENDS_PENALTIES_NOTE,
  overtime: DEPENDS_OVERTIME,
  allowances: [],
  median: MEDIAN,
  ato: ACTUARY_ATO,
  notices: [
    "Jobs and Skills Australia's full-time median ($2,072 a week) is for actuaries, mathematicians and statisticians together, so it sits well below the ATO figures for actuaries alone.",
  ],
  payslipNotes: [
    PAYSLIP_TIMING,
    PAYSLIP_BONUSES,
    PAYSLIP_SUPER_AND_DEDUCTIONS,
  ],
  notShown: [
    "An award rate: no award names actuaries, and we do not guess which classification, if any, fits your role.",
    "Pay by fellowship stage or seniority: no official source publishes it.",
  ],
  faqs: [
    {
      q: "How much does an actuary earn in Australia?",
      a: `The 2,927 people who gave their occupation as actuary on 2023–24 tax returns had a median salary or wage income of ${aud(ACT.medianSalary)} and an average of ${aud(ACT.avgSalary)}. Their average taxable income was ${aud(ACT.avgTaxableIncome)} (ATO Taxation statistics 2023–24).`,
    },
    {
      q: "What is an actuary's take-home pay?",
      a: `On the ${aud(ACT.medianSalary)} median, about ${aud(netAnnual(ACT.medianSalary))} a year or ${aud(netFortnightly(ACT.medianSalary))} a fortnight after 2026–27 income tax and the Medicare levy, assuming private hospital cover. Without it, a single person with that income for surcharge purposes also pays the Medicare levy surcharge.`,
    },
    {
      q: "Is there an award for actuaries?",
      a: "No award names actuaries. The Banking, Finance and Insurance Award covers insurers and super funds only for work in its own classifications, and its text does not mention actuaries; whether your role fits depends on your duties. If no award applies, you are award-free and the National Minimum Wage is the legal floor.",
    },
    {
      q: "Do actuaries earn more than statisticians?",
      a: `On 2023–24 tax returns, yes: the median salary or wage income was ${aud(ACT.medianSalary)} for actuaries, $111,413 for statisticians and $115,374 for mathematicians.`,
    },
    {
      q: "Why is the Jobs and Skills Australia figure for actuaries lower than the ATO's?",
      a: "Because it measures something different. Jobs and Skills Australia's $2,072 a week is the median full-time pay of non-managerial employees across actuaries, mathematicians and statisticians combined (May 2025). The ATO figures are for people who wrote actuary on their 2023–24 return.",
    },
  ],
  sources: [
    ATO_TABLE_15,
    jsaSource(MEDIAN),
    { title: "Banking, Finance and Insurance Award 2020 [MA000019] — coverage, cl 4.1–4.2", publisher: "Fair Work Commission", url: BFI_URL },
    NMW_ORDER_2026,
    FWO_PAY_SLIPS,
  ],
  verifiedOn: PROFESSIONAL_VERIFIED_ON,
  dateModified: "2026-10-09",
  related: [
    { href: "/bonus-tax-calculator/", label: "Bonus Tax Calculator" },
    { href: "/medicare-levy-surcharge-calculator/", label: "Medicare Levy Surcharge Calculator" },
    { href: "/job-pay-rates/accountant/", label: "Accountant Pay Rates" },
  ],
};
