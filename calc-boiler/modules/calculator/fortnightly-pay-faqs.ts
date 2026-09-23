// Shared FAQ copy for /fortnightly-pay-calculator/.
//
// Read by BOTH the rendered accordion (plus its sr-only crawlable mirror) in
// modules/calculator/fortnightly-pay-calculator.tsx and the FAQPage JSON-LD in
// app/fortnightly-pay-calculator/page.tsx, so the structured data cannot drift
// from the visible answers. Before this file the two held different question
// sets; this is their union plus the People Also Ask questions from the live
// Google AU SERP (docs/seo/2026-09-24-paa-optimisation.md). Every figure is
// derived from lib/constants or the ATO schedule metadata.

import {
  calculatePayBreakdown,
  formatAUD,
  formatPercent,
  HECS_HELP,
  MEDICARE_LEVY,
  SITE_CONFIG,
  SUPER_GUARANTEE,
  TAX_BRACKETS,
  TAX_BRACKETS_2025_26,
  TAX_FREE_THRESHOLD,
} from "@/lib/constants";
import { calculatePAYGWithholding, PAY_PERIODS } from "@/lib/constants/payg-withholding";
import { ATO_FORTNIGHTLY, FORTNIGHTLY_EXTRA_PAY } from "@/modules/tax-tables/ato-schedules";
import { hecsBandsSentence } from "@/modules/calculator/fy-rate-copy";

export interface FortnightlyFaq {
  q: string;
  a: string;
}

const FY = SITE_CONFIG.financialYear;
const N = PAY_PERIODS.fortnightly;
const MEDICARE = formatPercent(MEDICARE_LEVY.rate, 0);
const SG = formatPercent(SUPER_GUARANTEE.rate, 0);

const AT_80K = calculatePayBreakdown({ grossSalary: 80_000, includeHECS: false, hasPrivateHealth: true });
const AT_85K = calculatePayBreakdown({ grossSalary: 85_000, includeHECS: false, hasPrivateHealth: true });

/** Fortnightly gross amounts used in the "tax taken out each fortnight" table and FAQ. */
export const FORTNIGHTLY_WITHHOLDING_AMOUNTS = [1_000, 1_500, 2_000, 2_500, 3_000, 4_000, 5_000] as const;
export const FORTNIGHTLY_WITHHOLDING_ROWS = FORTNIGHTLY_WITHHOLDING_AMOUNTS.map((gross) => {
  const r = calculatePAYGWithholding(gross, "fortnightly");
  return { gross, withheld: r.totalWithheld, net: r.netPerPeriod, annual: gross * N };
});
const W = (gross: number) => FORTNIGHTLY_WITHHOLDING_ROWS.find((r) => r.gross === gross)!;

const RATE_NOW = formatPercent(TAX_BRACKETS[1].rate, 0);
const RATE_BEFORE = formatPercent(TAX_BRACKETS_2025_26[1].rate, 0);

export const FORTNIGHTLY_FAQS: readonly FortnightlyFaq[] = [
  {
    q: "How is fortnightly pay calculated in Australia?",
    a: `Fortnightly pay is your gross annual salary divided by ${N}, the number of fortnights in a year. Your employer then withholds PAYG income tax (which includes the ${MEDICARE} Medicare levy) and any HECS-HELP repayment using the ATO's fortnightly tax table. What is left is your fortnightly take-home pay.`,
  },
  {
    q: "How much tax do I pay if I get paid fortnightly?",
    a: `It depends on your gross pay each fortnight. If you claim the tax-free threshold, the ATO's ${FY} fortnightly tax table withholds ${formatAUD(W(2_000).withheld)} from ${formatAUD(2_000)}, ${formatAUD(W(3_000).withheld)} from ${formatAUD(3_000)} and ${formatAUD(W(4_000).withheld)} from ${formatAUD(4_000)}. The amount already includes the Medicare levy. A HECS-HELP debt adds a separate repayment on top.`,
  },
  {
    q: "How much is $80,000 a fortnight?",
    a: `An $80,000 salary is ${formatAUD(80_000 / N, 2)} a fortnight before tax (${formatAUD(80_000)} ÷ ${N}). After income tax and the ${MEDICARE} Medicare levy for ${FY}, you take home about ${formatAUD(AT_80K.fortnightly, 2)} a fortnight, or ${formatAUD(AT_80K.takeHomePay)} a year. That assumes you claim the tax-free threshold and have no HECS-HELP debt.`,
  },
  {
    q: "How much is an $85,000 salary fortnightly after tax?",
    a: `An $85,000 annual salary equals ${formatAUD(85_000 / N, 2)} gross per fortnight before tax. After income tax and the ${MEDICARE} Medicare levy for FY${FY}, the net fortnightly take-home is ${formatAUD(AT_85K.fortnightly, 2)} (for a resident claiming the tax-free threshold, no HECS-HELP, with private hospital cover).`,
  },
  {
    q: "What is the fortnightly tax table for 2026-27?",
    a: `The ATO's fortnightly tax table is ${ATO_FORTNIGHTLY.nat}. The current edition was published on ${ATO_FORTNIGHTLY.published} and applies to payments made from 1 July 2026. It withholds less than last year's table because the second income tax rate fell from ${RATE_BEFORE} to ${RATE_NOW}. Employers use it, or the ATO's formula behind it, to work out tax on each fortnightly pay.`,
  },
  {
    q: "How is fortnightly tax calculated in Australia?",
    a: `Fortnightly tax in Australia is calculated by dividing your gross annual salary by ${N} (the number of fortnights in a year), then applying the ATO PAYG fortnightly tax table. The table accounts for the ${TAX_BRACKETS.length} income tax brackets, the ${MEDICARE} Medicare levy, and the Low Income Tax Offset (LITO) so the correct amount reaches the ATO across the financial year.`,
  },
  {
    q: "How many fortnights are in a year?",
    a: `There are ${N} fortnights in a year (52 weeks ÷ 2), so fortnightly pay is annual salary ÷ ${N}. Because ${N} fortnights cover only 364 days, about every 11 to 12 years a financial year contains ${FORTNIGHTLY_EXTRA_PAY.extraPayCount} fortnightly pay days.`,
  },
  {
    q: "Are there 26 or 27 fortnightly pays in a year?",
    a: `A standard year has ${FORTNIGHTLY_EXTRA_PAY.standardPayCount} fortnightly pay periods (${N} x 14 = 364 days). Because a calendar year has 365 or 366 days, every 11 to 12 years a financial year contains ${FORTNIGHTLY_EXTRA_PAY.extraPayCount} fortnightly pay days. When this occurs, employers can withhold a small extra amount each pay to avoid an end-of-year tax shortfall.`,
  },
  {
    q: "Why is my fortnightly pay different from monthly divided by 2?",
    a: `Because a year has ${N} fortnights but 12 months. Fortnightly pay = annual salary ÷ ${N} (${formatAUD(85_000 / N, 2)} on $85,000). Monthly pay = annual salary ÷ 12 (${formatAUD(85_000 / 12, 2)} on $85,000). Dividing monthly by 2 gives ${formatAUD(85_000 / 24, 2)} — which is ${formatAUD(85_000 / 24 - 85_000 / N, 2)} higher than the real fortnightly amount. Two months each year contain 3 fortnightly pays instead of 2.`,
  },
  {
    q: "Is superannuation deducted from my fortnightly pay?",
    a: `No. Your employer pays superannuation at ${SG} on top of your gross salary. It is not deducted from your fortnightly take-home pay unless your contract is a 'total package inclusive of super'. Since Payday Super commenced on 1 July 2026, the contribution must reach your fund within 7 business days of each payday.`,
  },
  {
    q: "Is fortnightly pay better than monthly pay?",
    a: `Annual take-home pay is identical under both frequencies. Fortnightly pay provides ${N} paychecks instead of 12, producing 2 months per year with 3 pay periods. This extra fortnight helps employees accelerate mortgage repayments, build savings, or manage cash flow more closely than a monthly cycle.`,
  },
  {
    q: "Will I get a tax refund if I am paid fortnightly?",
    a: "The PAYG system withholds the estimated correct amount of tax regardless of pay frequency. Refunds commonly occur when employees claim work-related deductions, work part of the year, or have income that fluctuates between fortnights. Lodge your tax return after 30 June to reconcile the actual tax owed against total PAYG withheld during the financial year.",
  },
  {
    q: "How does HECS-HELP affect fortnightly take-home pay?",
    a: `HECS-HELP repayments reduce fortnightly take-home pay once repayment income exceeds ${formatAUD(HECS_HELP.minimumThreshold)} per year. The FY${FY} marginal system charges ${hecsBandsSentence()}. The repayment is divided across ${N} fortnights by the employer.`,
  },
  {
    q: "What is the difference between gross fortnightly pay and net fortnightly pay?",
    a: `Gross fortnightly pay is your annual salary divided by ${N} before any deductions. Net fortnightly pay (also called take-home pay) is the amount deposited into your bank account after PAYG tax, Medicare levy, and any HECS repayments are withheld. On an $85,000 salary, gross fortnightly pay is ${formatAUD(85_000 / N, 2)} and net fortnightly pay is ${formatAUD(AT_85K.fortnightly, 2)}.`,
  },
  {
    q: `Does the ${formatAUD(TAX_FREE_THRESHOLD)} tax-free threshold apply to fortnightly pay?`,
    a: `Yes. The ${formatAUD(TAX_FREE_THRESHOLD)} tax-free threshold is built into the ATO's fortnightly tax table. Employees who claim the threshold on their Tax File Number Declaration have the first ${formatAUD(TAX_FREE_THRESHOLD / N)} of each fortnightly gross pay (${formatAUD(TAX_FREE_THRESHOLD)} / ${N}) effectively tax-free. Employees who do not claim the threshold pay tax on every dollar from the first fortnightly pay period.`,
  },
];
