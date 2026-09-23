// Shared FAQ copy for /fortnightly-pay-calculator/ — rendered by the
// calculator's accordion and turned into FAQPage JSON-LD in the page file, so
// the structured data cannot drift from the page. Every figure is computed
// from lib/constants (tax engine, SG rate, HECS bands, tax-free threshold).

import {
  calculatePayBreakdown,
  formatAUD,
  formatPercent,
  HECS_HELP,
  MEDICARE_LEVY,
  SITE_CONFIG,
  SUPER_GUARANTEE,
  SUPER_GUARANTEE_CHARGE,
  TAX_FREE_THRESHOLD,
} from "@/lib/constants";
import type { FaqItem } from "@/lib/faq";
import { hecsBandsSentence } from "@/modules/calculator/fy-rate-copy";
import { FORTNIGHTLY_EXTRA_PAY } from "@/modules/tax-tables/ato-schedules";

const FY = SITE_CONFIG.financialYear;
const N = FORTNIGHTLY_EXTRA_PAY.standardPayCount;
const EXTRA = FORTNIGHTLY_EXTRA_PAY.extraPayCount;
const EXAMPLE = 85_000;
/** Worked example shared by the FAQ and the page copy. */
export const FORTNIGHTLY_EXAMPLE = calculatePayBreakdown({ grossSalary: EXAMPLE, includeHECS: false, hasPrivateHealth: true });
const grossFn = EXAMPLE / N;
const grossMonth = EXAMPLE / 12;
const ML = formatPercent(MEDICARE_LEVY.rate, 0);
const TFT = formatAUD(TAX_FREE_THRESHOLD);

export const FORTNIGHTLY_FAQS: readonly FaqItem[] = [
  {
    q: "How is fortnightly pay calculated in Australia?",
    a: `Fortnightly pay is calculated by dividing your gross annual salary by ${N} (the number of fortnights in a year). The employer then deducts PAYG income tax, the ${ML} Medicare levy, and any HECS-HELP repayments using the ATO's fortnightly tax table. The remaining amount is your fortnightly take-home pay.`,
  },
  {
    q: `How much is an ${formatAUD(EXAMPLE)} salary fortnightly after tax?`,
    a: `An ${formatAUD(EXAMPLE)} annual salary equals ${formatAUD(grossFn, 2)} gross per fortnight before tax. After income tax and the ${ML} Medicare levy for FY${FY}, the net fortnightly take-home is ${formatAUD(FORTNIGHTLY_EXAMPLE.fortnightly, 2)} (for a resident claiming the tax-free threshold, no HECS-HELP, with private hospital cover).`,
  },
  {
    q: "How many fortnights are in a year?",
    a: `There are ${N} fortnights in a year (52 weeks ÷ 2), so fortnightly pay is annual salary ÷ ${N}. Because ${N} fortnights cover only 364 days, about every 11 to 12 years a financial year contains ${EXTRA} fortnightly pay days.`,
  },
  {
    q: "How is fortnightly tax calculated in Australia?",
    a: `Fortnightly tax is worked out with the ATO's PAYG fortnightly tax table, which turns the annual tax scale into a per-fortnight amount. It builds in the resident tax brackets, the ${ML} Medicare levy and the Low Income Tax Offset (LITO), so the tax withheld over ${N} fortnights lands close to your actual tax for the year.`,
  },
  {
    q: "Why is my fortnightly pay different from monthly divided by 2?",
    a: `Because a year has ${N} fortnights but 12 months. Fortnightly pay = annual salary ÷ ${N} (${formatAUD(grossFn, 2)} on ${formatAUD(EXAMPLE)}). Monthly pay = annual salary ÷ 12 (${formatAUD(grossMonth, 2)} on ${formatAUD(EXAMPLE)}). Dividing monthly by 2 gives ${formatAUD(grossMonth / 2, 2)} — which is ${formatAUD(grossMonth / 2 - grossFn, 2)} higher than the real fortnightly amount. Two months each year contain 3 fortnightly pays instead of 2.`,
  },
  {
    q: "Is superannuation deducted from my fortnightly pay?",
    a: `No. Your employer pays superannuation at ${formatPercent(SUPER_GUARANTEE.rate, 0)} on top of your gross salary. It is not deducted from your fortnightly take-home pay unless your contract is a total package inclusive of super. The SG contribution is paid directly into your nominated super fund, and since Payday Super commenced on ${SUPER_GUARANTEE.paydaySuperStart} it must be received there within ${SUPER_GUARANTEE_CHARGE.current.businessDaysToPay} business days of each payday.`,
  },
  {
    q: "Are there 26 or 27 fortnightly pays in a year?",
    a: `A standard year has ${N} fortnightly pay periods (${N} x 14 = 364 days). Because a calendar year has 365 or 366 days, every 11 to 12 years a financial year contains ${EXTRA} fortnightly pay days. The ATO publishes extra amounts that can be withheld from each pay in those years so the additional pay does not leave you with a tax shortfall at year-end.`,
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
    a: `Gross fortnightly pay is your annual salary divided by ${N} before any deductions. Net fortnightly pay (also called take-home pay) is the amount deposited into your bank account after PAYG tax, Medicare levy, and any HECS repayments are withheld. On an ${formatAUD(EXAMPLE)} salary, gross fortnightly pay is ${formatAUD(grossFn, 2)} and net fortnightly pay is ${formatAUD(FORTNIGHTLY_EXAMPLE.fortnightly, 2)}.`,
  },
  {
    q: `Does the ${TFT} tax-free threshold apply to fortnightly pay?`,
    a: `Yes. The ${TFT} tax-free threshold is built into the ATO's fortnightly tax table. Employees who claim the threshold on their Tax File Number Declaration have the first ${formatAUD(TAX_FREE_THRESHOLD / N)} of each fortnightly gross pay (${TFT} / ${N}) effectively tax-free. Employees who do not claim the threshold pay tax on every dollar from the first fortnightly pay period.`,
  },
];
