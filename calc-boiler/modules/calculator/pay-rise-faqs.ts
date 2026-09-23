// Shared FAQ copy for /pay-rise-calculator/.
//
// Read by BOTH the rendered accordion (plus its sr-only crawlable mirror) in
// modules/calculator/pay-rise-calculator.tsx and the FAQPage JSON-LD in
// app/pay-rise-calculator/page.tsx. Before this file the JSON-LD carried three
// of the eight visible questions with shorter answers; this is the full set
// plus People Also Ask questions from the live Google AU SERP for "pay rise
// calculator" and "salary increase calculator"
// (docs/seo/2026-09-24-paa-optimisation.md). Every figure is derived.

import {
  calculateMedicareSurcharge,
  calculatePayBreakdown,
  formatAUD,
  HECS_HELP,
  MEDICARE_LEVY,
  SITE_CONFIG,
  SUPER_GUARANTEE,
  TAX_BRACKETS,
  TAX_BRACKETS_2025_26,
} from "@/lib/constants";
import { EMPLOYMENT } from "@/lib/constants";
import { NMW_DECISION } from "@/lib/constants/minimum-wage";
import { hecsBandsSentence } from "@/modules/calculator/fy-rate-copy";

export interface PayRiseFaq {
  q: string;
  a: string;
}

// ABS Wage Price Index, June quarter 2026 (released 19 Aug 2026): 3.2% over
// the year, seasonally adjusted.
export const WPI_ANNUAL = 0.032;
// ABS media release "CPI rose 3.8% in the year to June 2026" (quarterly CPI).
export const CPI_ANNUAL = 0.038;

const FY = SITE_CONFIG.financialYear;
const pct0 = (r: number) => `${Math.round(r * 100)}%`;
const pct = (r: number) => `${Math.round(r * 10_000) / 100}%`;
const net = (gross: number, includeHECS = false) => calculatePayBreakdown({ grossSalary: gross, includeHECS }).takeHomePay;
export const raiseNet = (base: number, raise: number) => net(base + raise) - net(base);

const B2 = TAX_BRACKETS[2];
const B3 = TAX_BRACKETS[3];
const MLS = MEDICARE_LEVY.surcharge;
const MLS_110K = calculateMedicareSurcharge(110_000, false);
const HECS_65_TO_70 =
  calculatePayBreakdown({ grossSalary: 70_000, includeHECS: true }).hecsRepayment -
  calculatePayBreakdown({ grossSalary: 65_000, includeHECS: true }).hecsRepayment;
const RAISE_5K_ON_80K = raiseNet(80_000, 5_000);
const RAISE_5K_ON_150K = raiseNet(150_000, 5_000);
const AWR = NMW_DECISION.awardIncrease;

/** Percentage pay rises on an $80,000 salary, for the "how to calculate" table and FAQ. */
export const RAISE_BASE = 80_000;
export const RAISE_PERCENTAGES = [0.03, AWR, 0.05, 0.1] as const;
export const RAISE_ROWS = RAISE_PERCENTAGES.map((rate) => {
  const extra = Math.round(RAISE_BASE * rate);
  const afterTax = raiseNet(RAISE_BASE, extra);
  return { rate, newSalary: RAISE_BASE + extra, extra, afterTax, weekly: afterTax / 52 };
});
const ROW_5 = RAISE_ROWS.find((r) => r.rate === 0.05)!;

// Salary sacrifice of $5,000: saving is (marginal + Medicare) − 15% contributions tax.
const SS_LOW = Math.round(5_000 * (TAX_BRACKETS[1].rate + MEDICARE_LEVY.rate - 0.15));
const SS_HIGH = Math.round(5_000 * (TAX_BRACKETS[4].rate + MEDICARE_LEVY.rate - 0.15));
// Stage 3: a $10,000 raise on $125,000 under 2023-24 rates (37% above $120,000) vs now.
const STAGE3_EXTRA = Math.round(10_000 * (0.37 - B2.rate));

export const PAY_RISE_FAQS: readonly PayRiseFaq[] = [
  {
    q: "How do I calculate my pay rise?",
    a: `Divide the increase by your old salary and multiply by 100. A rise from ${formatAUD(RAISE_BASE)} to ${formatAUD(ROW_5.newSalary)} is ${formatAUD(ROW_5.extra)} ÷ ${formatAUD(RAISE_BASE)} = 5%. To go the other way, multiply your salary by 1 plus the percentage. After tax in ${FY}, that ${formatAUD(ROW_5.extra)} rise is worth ${formatAUD(ROW_5.afterTax)} a year, or ${formatAUD(ROW_5.weekly, 2)} a week.`,
  },
  {
    q: "Are Australians getting a pay rise in 2026?",
    a: `Award and minimum wage workers are. The Fair Work Commission's ${NMW_DECISION.name} lifted award rates and the National Minimum Wage by ${pct(AWR)} from ${NMW_DECISION.operativeFrom}, taking the minimum to ${formatAUD(EMPLOYMENT.minimumWageHourly, 2)} an hour. Across all jobs, the ABS Wage Price Index rose ${pct(WPI_ANNUAL)} in the year to June 2026. Everyone else depends on their agreement or employer.`,
  },
  {
    q: `Who gets the ${pct(AWR)} pay increase?`,
    a: `Employees paid under a modern award, and award-free employees on the National Minimum Wage, got the ${pct(AWR)} increase from the first full pay period starting on or after ${NMW_DECISION.operativeFrom} (${NMW_DECISION.citation}). People on enterprise agreements or above-award salaries get whatever their agreement or employer sets, but their base pay can never fall below the new award rate.`,
  },
  {
    q: "Is a 3% raise good in 2026?",
    a: `It is a little below average. Wages across Australia rose ${pct(WPI_ANNUAL)} in the year to June 2026 (ABS Wage Price Index) and prices rose ${pct(CPI_ANNUAL)} (CPI), so a 3% rise is a small real pay cut. On ${formatAUD(RAISE_BASE)}, 3% is ${formatAUD(RAISE_ROWS[0].extra)} before tax and ${formatAUD(RAISE_ROWS[0].afterTax)} after tax for the year.`,
  },
  {
    q: "Why is my pay rise taxed so highly?",
    a: `Your pay rise is taxed at your marginal tax rate, the rate on the top slice of your income, which is usually well above your average tax rate. Between ${formatAUD(B2.min)} and ${formatAUD(B2.max)} the marginal rate is ${pct0(B2.rate)} plus the ${pct0(MEDICARE_LEVY.rate)} Medicare levy, ${pct0(B2.rate + MEDICARE_LEVY.rate)} in total. Between ${formatAUD(B3.min)} and ${formatAUD(B3.max)} it is ${pct0(B3.rate + MEDICARE_LEVY.rate)}.`,
  },
  {
    q: "Does my employer pay extra super on my pay rise?",
    a: `Yes. Under the Superannuation Guarantee your employer pays ${pct0(SUPER_GUARANTEE.rate)} super on your qualifying earnings in ${FY}, so a $10,000 base pay rise also adds ${formatAUD(10_000 * SUPER_GUARANTEE.rate)} a year to your super fund. Under Payday Super the maximum super contribution base is an annual ${formatAUD(SUPER_GUARANTEE.maxContributionBaseAnnual)}.`,
  },
  {
    q: "Can a pay rise push me into a higher tax bracket and leave me worse off?",
    a: `No. Only the part of your income above each threshold is taxed at the higher rate. A rise from $134,000 to $136,000 applies the ${pct0(B3.rate)} rate only to the $1,000 above ${formatAUD(B2.max)}, not to the whole salary. You always take home more money after a pay rise.`,
  },
  {
    q: "Can salary sacrifice boost my pay rise benefit?",
    a: `Yes. Salary sacrificing part of a pay rise into super avoids your marginal rate on that part; inside the fund it is taxed at 15% (30% above $250,000 under Division 293). Sacrificing $5,000 saves roughly ${formatAUD(SS_LOW)} to ${formatAUD(SS_HIGH)} in tax depending on your bracket. The concessional contributions cap is ${formatAUD(SUPER_GUARANTEE.concessionalCap)} for ${FY}.`,
  },
  {
    q: "How does a pay rise affect my HECS-HELP repayments?",
    a: `A pay rise increases your repayment income. The ${FY} repayment threshold is ${formatAUD(HECS_HELP.minimumThreshold)}; below it nothing is repaid, and above it you repay ${hecsBandsSentence()}. A rise from $65,000 to $70,000 adds a HECS repayment of ${formatAUD(HECS_65_TO_70)} a year.`,
  },
  {
    q: "How much extra per week is a $5,000 pay rise?",
    a: `It depends on your marginal rate. On $80,000 (${pct0(B2.rate + MEDICARE_LEVY.rate)} combined marginal rate) a $5,000 rise is ${formatAUD(RAISE_5K_ON_80K)} a year after tax, or ${formatAUD(RAISE_5K_ON_80K / 52, 2)} a week. On $150,000 (${pct0(B3.rate + MEDICARE_LEVY.rate)}) it is ${formatAUD(RAISE_5K_ON_150K)} after tax, or ${formatAUD(RAISE_5K_ON_150K / 52, 2)} a week.`,
  },
  {
    q: "Does a pay rise affect the Medicare Levy Surcharge?",
    a: `Yes, if you don't hold private hospital cover. In ${FY} singles pay the surcharge from ${formatAUD(MLS.tier1.min)}: ${pct(MLS.tier1.rate)} of total income up to ${formatAUD(MLS.tier1.max)}, ${pct(MLS.tier2.rate)} up to ${formatAUD(MLS.tier2.max)} and ${pct(MLS.tier3.rate)} above that. On $110,000 without hospital cover it adds ${formatAUD(MLS_110K)} a year.`,
  },
  {
    q: "Did the Stage 3 tax cuts change how pay rises are taxed?",
    a: `Yes. From 1 July 2024 the second tax rate fell from 19% to ${pct0(TAX_BRACKETS_2025_26[1].rate)} (and to ${pct0(TAX_BRACKETS[1].rate)} from 1 July 2026), and the ${pct0(B2.rate)} bracket was extended from $120,000 to ${formatAUD(B2.max)}. Someone on $125,000 now pays ${pct0(B2.rate)} rather than 37% on a pay rise, so a $10,000 raise keeps about ${formatAUD(STAGE3_EXTRA)} more than before Stage 3.`,
  },
];
