// Shared FAQ copy for /annual-pay-calculator/ — rendered by the page's
// accordion and turned into FAQPage JSON-LD in app/annual-pay-calculator/
// page.tsx, so the structured data cannot drift from the page. Every figure
// comes from the tax engine and lib/constants.

import {
  calculatePayBreakdown,
  formatAUD,
  formatPercent,
  HECS_HELP,
  MEDICARE_LEVY,
  SITE_CONFIG,
  SUPER_GUARANTEE,
} from "@/lib/constants";
import type { FaqItem } from "@/lib/faq";
import { bracketRatesSentence, hecsBandsSentence } from "@/modules/calculator/fy-rate-copy";

const FY = SITE_CONFIG.financialYear;
const pct = (r: number) => `${Math.round(r * 10_000) / 100}%`;
const net = (salary: number) => calculatePayBreakdown({ grossSalary: salary, includeHECS: false, hasPrivateHealth: true });
const at80k = net(80_000);
const at100k = net(100_000);
const EFF100 = (((at100k.netIncomeTax + at100k.medicareLevy) / 100_000) * 100).toFixed(1);
const SG = formatPercent(SUPER_GUARANTEE.rate, 0);
const MLS = MEDICARE_LEVY.surcharge;

// ABS Average Weekly Earnings, May 2026 (released Aug 2026): full-time adult
// ordinary time earnings, seasonally adjusted, $2,083.70 a week.
// https://www.abs.gov.au/statistics/labour/earnings-and-working-conditions/average-weekly-earnings-australia/latest-release
const AWOTE_WEEKLY = 2_083.7;
const AWOTE_ANNUAL = Math.round(AWOTE_WEEKLY * 52);

export const ANNUAL_PAY_FAQS: readonly FaqItem[] = [
  {
    q: "What is $80,000 a year after tax in Australia?",
    a: `A gross annual salary of $80,000 in Australia for FY${FY} results in approximately ${formatAUD(at80k.takeHomePay)} in annual take-home pay after ${formatAUD(at80k.netIncomeTax)} in income tax and ${formatAUD(at80k.medicareLevy)} Medicare levy. Your employer pays an additional ${formatAUD(at80k.superContribution)} into super on top.`,
  },
  {
    q: "What is $100,000 a year after tax in Australia?",
    a: `A gross annual salary of $100,000 in Australia for FY${FY} results in approximately ${formatAUD(at100k.takeHomePay)} in annual take-home pay after ${formatAUD(at100k.netIncomeTax)} in income tax and ${formatAUD(at100k.medicareLevy)} Medicare levy. The effective rate of tax plus Medicare levy is ${EFF100}%.`,
  },
  {
    q: "How is annual pay calculated in Australia?",
    a: `Annual take-home pay equals your gross yearly salary minus income tax, the ${pct(MEDICARE_LEVY.rate)} Medicare levy, and any HECS-HELP repayments for the financial year running 1 July to 30 June. The ATO applies progressive income tax brackets — ${bracketRatesSentence()} — meaning only the portion of income within each bracket is taxed at that bracket's marginal rate.`,
  },
  {
    q: "What is the annual salary calculator used for?",
    a: "The annual salary calculator converts a yearly gross figure into a single annual take-home number for budgeting, salary comparisons, loan applications, and tax return verification. It is preferred over per-cycle calculators when you negotiate a yearly package or compare two job offers.",
  },
  {
    q: "Does my annual pay include superannuation?",
    a: `Generally no. Your employer pays an additional ${SG} superannuation guarantee on top of your gross annual salary into your nominated super fund. The total of gross salary plus super equals your total remuneration package. Check your contract: if it quotes a "package including super", your base salary is lower than the package figure.`,
  },
  {
    q: "Why does my annual pay differ from my tax return?",
    a: "Your tax return includes work-related deductions, investment income, bank interest, rental income, and other assessable income sources. This calculator estimates standard PAYG withholding on salary income only. The ATO reconciles all income and deductions when you lodge your annual return.",
  },
  {
    q: "What is the average annual salary in Australia?",
    a: `Average full-time adult ordinary time earnings were ${formatAUD(AWOTE_WEEKLY, 2)} a week in May 2026 (ABS, seasonally adjusted) — about ${formatAUD(AWOTE_ANNUAL)} a year. At that salary, annual take-home pay is approximately ${formatAUD(net(AWOTE_ANNUAL).takeHomePay)} in FY${FY}. The average is pulled up by high earners, so most full-time workers earn less than it.`,
  },
  {
    q: "How is tax calculated if I only worked part of the year?",
    a: "The PAYG system withholds tax as if you earn that same salary for the full 12 months. Starting or leaving a job mid-year typically results in over-withholding. The ATO recalculates your actual tax based on your total income for the year when you lodge your return and refunds any excess.",
  },
  {
    q: "What is the difference between base salary and total package?",
    a: `Base salary is your gross annual pay before deductions. Total package (also called "total remuneration") includes base salary plus employer superannuation contributions. A $100,000 base salary with ${SG} super has a total package of ${formatAUD(100_000 * (1 + SUPER_GUARANTEE.rate))}. Some packages also include car allowances, bonuses, and fringe benefits.`,
  },
  {
    q: "At what annual salary do HECS-HELP repayments start?",
    a: `Compulsory HECS-HELP repayments begin when your repayment income exceeds ${formatAUD(HECS_HELP.minimumThreshold)} for FY${FY}. Repayment income includes taxable income plus any net investment losses, reportable fringe benefits, and reportable super contributions. Under the marginal system the repayment is ${hecsBandsSentence()}.`,
  },
  {
    q: "Do I pay the Medicare Levy Surcharge on top of the Medicare levy?",
    a: `The Medicare Levy Surcharge (MLS) is a separate charge of ${pct(MLS.tier1.rate)} to ${pct(MLS.tier3.rate)} applied in FY${FY} to singles with income for MLS purposes over ${formatAUD(MLS.tier1.min - 1)} (or ${formatAUD(MLS.familyTier1.min - 1)} for families) who do not hold an eligible private hospital insurance policy. The standard ${pct(MEDICARE_LEVY.rate)} Medicare levy applies to Australian residents above the low-income threshold, regardless of private health insurance status.`,
  },
];
