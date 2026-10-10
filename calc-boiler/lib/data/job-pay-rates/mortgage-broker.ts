// Mortgage broker — salary page.
//
// Occupation code: ABS, ANZSCO 2022 unit group 2221 Financial Brokers, read
// 9 October 2026: "222112 Finance Broker — Operates as an independent agent
// in the course of financial negotiations and arranges loans of money on
// behalf of clients. Registration or licensing is required. Specialisations:
// Lease Broker; Mortgage Broker." So mortgage brokers are in ATO code 222112.
//
// Coverage: no modern award names mortgage brokers. The Banking, Finance and
// Insurance Award 2020 [MA000019] (awards.fairwork.gov.au/MA000019.html,
// consolidated to 1 July 2026, read 9 October 2026) covers employers in the
// banking, finance and insurance industry — which cl 4.2 defines to include
// lending, providing credit, "financial intermediaries" and services "such as
// broking" — "in respect of work by their employees in a classification in
// this award" (cl 4.1). Whether a broker's role fits a classification depends
// on the duties, so the page does not say, and shows the National Minimum Wage
// Order 2026 (PR799279) as the floor for employees.
//
// ATO: Taxation statistics 2023–24, Individuals Table 15A (data.gov.au,
// ts24individual15occupationsex.xlsx), Total rows, read 9 October 2026:
//   222112 Broker - finance     11,049 | avg TI 107,599 | med TI 84,652 | avg S/W  97,205 | med S/W 81,587
//   222113 Broker - insurance    9,005 | avg TI 137,597 | med TI 99,309 | avg S/W 119,714 | med S/W 96,439
//
// JSA: ANZSCO 2221 Financial Brokers, median full-time earnings $2,576 a week,
// $70 an hour (ABS SEEH May 2025), all occupations $1,852, read 9 October
// 2026. The group includes commodities traders and insurance brokers; JSA's
// 222112 Finance Brokers page prints "N/A" for median earnings.

import { ALL_OCCUPATIONS_MEDIAN_WEEKLY, ATO_TABLE_15, ATO_TAXSTATS_INCOME_YEAR, jsaSource, jsaUrl } from "./common";
import {
  DEPENDS_OVERTIME,
  DEPENDS_PENALTIES_NOTE,
  FWO_PAY_SLIPS,
  NMW_ORDER_2026,
  PAYSLIP_BONUSES,
  PAYSLIP_SUPER_AND_DEDUCTIONS,
  PROFESSIONAL_VERIFIED_ON,
  aud,
  netAnnual,
  netFortnightly,
  nmwTable,
} from "./professional-common";
import type { AtoOccupationStats, MedianEarnings, Occupation } from "./types";

const MEDIAN: MedianEarnings = {
  anzscoCode: "2221",
  anzscoTitle: "Financial Brokers",
  medianWeekly: 2_576,
  medianHourly: 70,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("2221-financial-brokers"),
};

export const MORTGAGE_BROKER_ATO: AtoOccupationStats = {
  incomeYear: ATO_TAXSTATS_INCOME_YEAR,
  intro:
    "Mortgage brokers are a specialisation of the finance broker occupation, so they are counted in the ATO's \"Broker - finance\" code along with lease brokers. Insurance brokers are shown for comparison.",
  rows: [
    { code: "222112", title: "Broker - finance", individuals: 11_049, avgTaxableIncome: 107_599, medianTaxableIncome: 84_652, avgSalary: 97_205, medianSalary: 81_587 },
    { code: "222113", title: "Broker - insurance", individuals: 9_005, avgTaxableIncome: 137_597, medianTaxableIncome: 99_309, avgSalary: 119_714, medianSalary: 96_439 },
  ],
};

const FIN = MORTGAGE_BROKER_ATO.rows[0];
const BFI_URL = "https://awards.fairwork.gov.au/MA000019.html";
const ABS_2221_URL =
  "https://www.abs.gov.au/statistics/classifications/anzsco-australian-and-new-zealand-standard-classification-occupations/2022/browse-classification/2/22/222/2221";

export const MORTGAGE_BROKER: Occupation = {
  slug: "mortgage-broker",
  name: "Mortgage Broker",
  plural: "mortgage brokers",
  award: null,
  headline: null,
  coverageMode: "depends",
  heading: "Mortgage Broker Salary Australia 2026 — Tax-Return Figures, Commission & Take-Home",
  metaTitle: `Mortgage Broker Salary 2026 — ${aud(FIN.medianSalary)} Median & Take-Home`,
  metaDescription: `Finance brokers, the ATO code that includes mortgage brokers, had an ${aud(FIN.medianSalary)} median salary in 2023–24. Take-home pay, commission on payslips, award coverage.`,
  lede: `Mortgage brokers are counted by the ATO as finance brokers. On 2023–24 tax returns, finance brokers who earned wages had a median salary of ${aud(FIN.medianSalary)} and an average of ${aud(FIN.avgSalary)}, while their average taxable income — which includes business income — was ${aud(FIN.avgTaxableIncome)}. On the ${aud(FIN.medianSalary)} median, take-home pay is about ${aud(netAnnual(FIN.medianSalary))} a year after tax. No award names the job.`,
  coverage: [
    "No modern award names mortgage brokers. The Banking, Finance and Insurance Award 2020 [MA000019] covers employers in banking, lending and finance — its definition of the industry includes financial intermediaries and services such as broking (cl 4.2) — but only for employees whose work fits one of its classifications (cl 4.1). Whether a broker's role fits depends on the duties, and this page does not decide it.",
    "The official occupation description is of a finance broker who operates as an independent agent and arranges loans on behalf of clients (ABS, ANZSCO). Awards and the minimum wage apply to employees, not to a broker who runs their own business. A broker employed by a brokerage or a lender is an employee: if no award covers the role, the National Minimum Wage and the National Employment Standards are the floor.",
  ],
  tables: [nmwTable("employed mortgage brokers")],
  penalties: [],
  penaltiesNote: DEPENDS_PENALTIES_NOTE,
  overtime: DEPENDS_OVERTIME,
  allowances: [],
  median: MEDIAN,
  ato: MORTGAGE_BROKER_ATO,
  notices: [
    "The ATO salary figures count only finance brokers who reported salary or wages; business income from running a brokerage shows up in taxable income instead. Jobs and Skills Australia's $2,576 a week is a full-time median for all financial brokers, including insurance brokers and commodities traders.",
  ],
  payslipNotes: [
    PAYSLIP_BONUSES,
    "Commission and tax: commission paid to an employee comes through the payslip like other pay; the commission tax calculator shows the tax on a commission payment.",
    PAYSLIP_SUPER_AND_DEDUCTIONS,
  ],
  notShown: [
    "Commission splits, trail commission and aggregator fees: they are set by contract and no official source publishes them.",
    "An award rate: no award names the job.",
    "Licensing and registration requirements: outside this site's pay focus.",
  ],
  faqs: [
    {
      q: "How much does a mortgage broker earn in Australia?",
      a: `The ATO counts mortgage brokers as finance brokers. On 2023–24 tax returns, the 11,049 finance brokers had a median salary or wage income of ${aud(FIN.medianSalary)} and an average of ${aud(FIN.avgSalary)}; their average taxable income, which includes business income, was ${aud(FIN.avgTaxableIncome)}.`,
    },
    {
      q: "What is a mortgage broker's take-home pay?",
      a: `On the ${aud(FIN.medianSalary)} median salary, about ${aud(netAnnual(FIN.medianSalary))} a year or ${aud(netFortnightly(FIN.medianSalary))} a fortnight after 2026–27 income tax and the Medicare levy, with no HECS-HELP and with private hospital cover.`,
    },
    {
      q: "Is there an award for mortgage brokers?",
      a: "No award names mortgage brokers. The Banking, Finance and Insurance Award covers lending and broking businesses, but only for employees whose work fits one of its classifications. If no award covers an employed broker, the National Minimum Wage and the National Employment Standards apply.",
    },
    {
      q: "Do insurance brokers earn more than mortgage brokers?",
      a: "On 2023–24 tax returns, insurance brokers' median salary or wage income was $96,439, against $81,587 for finance brokers, the code that includes mortgage brokers.",
    },
  ],
  sources: [
    ATO_TABLE_15,
    { title: "ANZSCO 2022 — Unit Group 2221 Financial Brokers (222112 Finance Broker, specialisation Mortgage Broker)", publisher: "Australian Bureau of Statistics", url: ABS_2221_URL },
    jsaSource(MEDIAN),
    { title: "Banking, Finance and Insurance Award 2020 [MA000019] — coverage, cl 4.1–4.2", publisher: "Fair Work Commission", url: BFI_URL },
    NMW_ORDER_2026,
    FWO_PAY_SLIPS,
  ],
  verifiedOn: PROFESSIONAL_VERIFIED_ON,
  dateModified: "2026-10-09",
  related: [
    { href: "/commission-tax-calculator/", label: "Commission Tax Calculator" },
    { href: "/job-pay-rates/real-estate-agent/", label: "Real Estate Agent Pay Rates" },
    { href: "/job-pay-rates/accountant/", label: "Accountant Pay Rates" },
  ],
};
