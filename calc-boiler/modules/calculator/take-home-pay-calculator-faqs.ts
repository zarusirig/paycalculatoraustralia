// Shared FAQ copy for /take-home-pay-calculator/ — rendered by the page's
// accordion and turned into FAQPage JSON-LD in
// app/take-home-pay-calculator/page.tsx, so the structured data cannot drift
// from the page. Every figure is computed from the tax engine in lib/constants.

import {
  HECS_HELP,
  MEDICARE_LEVY,
  SITE_CONFIG,
  SUPER_GUARANTEE,
  calculatePayBreakdown,
  formatAUD,
  formatPercent,
} from "@/lib/constants";
import { NO_TFN_RATES } from "@/lib/constants/payg-withholding";
import { PRESERVATION_AGE_TABLE } from "@/lib/constants/pension-age";
import { CONTRIBUTIONS_TAX_RATE } from "@/lib/constants/super-contributions";
import type { FaqItem } from "@/lib/faq";

const FY = SITE_CONFIG.financialYear;
const EX40 = calculatePayBreakdown({ grossSalary: 40_000 });
const EX80 = calculatePayBreakdown({ grossSalary: 80_000 });
const EX80_HECS = calculatePayBreakdown({ grossSalary: 80_000, includeHECS: true });
const EX90 = calculatePayBreakdown({ grossSalary: 90_000 });
const EX100 = calculatePayBreakdown({ grossSalary: 100_000 });
const EX150 = calculatePayBreakdown({ grossSalary: 150_000 });
const pct = (r: number) => `${Math.round(r * 10_000) / 100}%`;
const keep = (b: { takeHomePay: number }, gross: number) => `${((b.takeHomePay / gross) * 100).toFixed(1)}%`;
const MLS = MEDICARE_LEVY.surcharge;
// Salary sacrifice $10,000 on $100,000: income tax + Medicare saved, less the
// contributions tax paid inside the fund.
const SACRIFICE = 10_000;
const SACRIFICE_SAVING =
  EX100.netIncomeTax + EX100.medicareLevy - (EX90.netIncomeTax + EX90.medicareLevy) - SACRIFICE * CONTRIBUTIONS_TAX_RATE;
const PRESERVATION_AGE = PRESERVATION_AGE_TABLE[PRESERVATION_AGE_TABLE.length - 1].years;

export const TAKE_HOME_PAY_FAQS: readonly FaqItem[] = [
  {
    q: "How is take-home pay calculated in Australia?",
    a: `Take-home pay equals your gross salary minus income tax, the ${pct(MEDICARE_LEVY.rate)} Medicare levy, and any HECS-HELP repayments. Your employer withholds these amounts each pay cycle through the PAYG system and remits them to the ATO. Superannuation is paid separately by your employer and does not reduce your take-home.`,
  },
  {
    q: "What percentage of my salary do I actually take home?",
    a: `The percentage varies by income level. In FY${FY}, at $40,000 you retain ${keep(EX40, 40_000)} (${formatAUD(EX40.takeHomePay)}). At $80,000, you retain ${keep(EX80, 80_000)} (${formatAUD(EX80.takeHomePay)}). At $150,000, you retain ${keep(EX150, 150_000)} (${formatAUD(EX150.takeHomePay)}). The percentage decreases as income rises because Australia's progressive tax brackets apply higher marginal rates to each additional dollar earned.`,
  },
  {
    q: "Is superannuation deducted from my take-home pay?",
    a: `No. Your employer pays the ${formatPercent(SUPER_GUARANTEE.rate, 0)} superannuation guarantee on top of your gross salary. It does not reduce the amount deposited into your bank account. If you voluntarily salary sacrifice additional amounts into super, those pre-tax contributions reduce your taxable income and take-home pay.`,
    links: { "salary sacrifice": "/salary-sacrifice-calculator/" },
  },
  {
    q: "How much take-home pay do I get on $100,000?",
    a: `On a $100,000 salary in FY${FY}, you take home ${formatAUD(EX100.takeHomePay)} per year (${formatAUD(EX100.weekly, 2)} per week). Total deductions are ${formatAUD(EX100.totalDeductions)}, comprising ${formatAUD(EX100.netIncomeTax)} in income tax and ${formatAUD(EX100.medicareLevy)} in Medicare levy. Use our Income Tax Calculator for a bracket-by-bracket view.`,
    links: { "Income Tax Calculator": "/income-tax-calculator/" },
  },
  {
    q: "Why is my first pay smaller than expected?",
    a: `If you have not submitted a Tax File Number (TFN) declaration to your employer, PAYG withholding applies at ${pct(NO_TFN_RATES.resident)} for residents — the top marginal rate plus the Medicare levy. Submit your TFN declaration immediately to ensure the correct tax rate applies from your next pay cycle.`,
  },
  {
    q: "How much does HECS-HELP reduce my take-home pay?",
    a: `HECS-HELP repayments begin above ${formatAUD(HECS_HELP.minimumThreshold)} under the FY${FY} marginal system. On $80,000, the compulsory repayment is ${formatAUD(EX80_HECS.hecsRepayment)} per year (${formatAUD(EX80_HECS.hecsRepayment / 52, 2)} per week), reducing take-home from ${formatAUD(EX80.takeHomePay)} to ${formatAUD(EX80_HECS.takeHomePay)}. The marginal rate of ${pct(HECS_HELP.bands[1].marginalRate)} applies only to income above ${formatAUD(HECS_HELP.minimumThreshold)}, not your entire salary.`,
  },
  {
    q: "Does salary sacrifice increase take-home pay?",
    a: `Salary sacrifice reduces your taxable income and total income tax, but the sacrificed amount goes into super rather than your bank account. The net effect is a lower take-home pay combined with higher retirement savings. On $100,000, sacrificing ${formatAUD(SACRIFICE)} saves ${formatAUD(SACRIFICE_SAVING)} in tax overall. The trade-off is that super funds are locked until preservation age (${PRESERVATION_AGE} for most Australians).`,
  },
  {
    q: "Do I pay the Medicare Levy Surcharge?",
    a: `The Medicare Levy Surcharge (MLS) applies to singles earning ${formatAUD(MLS.tier1.min)} or more who do not hold private hospital insurance. In FY${FY} the surcharge is ${pct(MLS.tier1.rate)} for incomes between ${formatAUD(MLS.tier1.min)} and ${formatAUD(MLS.tier1.max)}, ${pct(MLS.tier2.rate)} for ${formatAUD(MLS.tier2.min)} to ${formatAUD(MLS.tier2.max)}, and ${pct(MLS.tier3.rate)} for incomes above ${formatAUD(MLS.tier3.min - 1)}. Holding private hospital cover eliminates the MLS entirely.`,
  },
];
