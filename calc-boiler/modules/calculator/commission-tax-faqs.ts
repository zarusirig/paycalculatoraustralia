// Shared FAQ copy for /commission-tax-calculator/.
//
// Read by the rendered accordion, its crawlable mirror and the FAQPage JSON-LD
// in app/commission-tax-calculator/page.tsx, so the structured data cannot
// drift from the visible page. Every figure is computed by the same engines
// that run the calculator — none are typed as literals here.

import {
  calculatePayBreakdown,
  formatAUD,
  formatPercent,
  HECS_HELP,
  MEDICARE_LEVY,
  SITE_CONFIG,
  SUPER_GUARANTEE,
  TAX_BRACKETS,
} from "@/lib/constants";
import { calculateSchedule5MethodB, PAY_PERIODS, SCHEDULE_5_WITHHOLDING_LIMIT } from "@/lib/constants/payg-withholding";

const TOP = TAX_BRACKETS[TAX_BRACKETS.length - 1];

// Worked example: $80,000 base, $5,000 commission paid in one fortnightly pay.
export const EX_BASE_SALARY = 80_000;
export const EX_COMMISSION = 5_000;
const EX_WITHOUT = calculatePayBreakdown({ grossSalary: EX_BASE_SALARY });
const EX_WITH = calculatePayBreakdown({ grossSalary: EX_BASE_SALARY, bonus: EX_COMMISSION });
export const EX_ANNUAL_TAX = EX_WITH.totalDeductions - EX_WITHOUT.totalDeductions;
export const EX_WITHHOLDING = calculateSchedule5MethodB(EX_BASE_SALARY / PAY_PERIODS.fortnightly, EX_COMMISSION, "fortnightly");

export interface CommissionTaxFaq {
  q: string;
  a: string;
}

export const COMMISSION_TAX_FAQS: readonly CommissionTaxFaq[] = [
  {
    q: "How is commission taxed in Australia?",
    a: `Commission is ordinary assessable income. It is added to your salary and taxed at your marginal rate for the year — there is no separate or flat commission tax rate. On a ${formatAUD(EX_BASE_SALARY)} salary, a ${formatAUD(EX_COMMISSION)} commission adds ${formatAUD(EX_ANNUAL_TAX)} to your ${SITE_CONFIG.financialYear} tax (${formatPercent(EX_ANNUAL_TAX / EX_COMMISSION)} of the commission), including the ${formatPercent(MEDICARE_LEVY.rate, 0)} Medicare levy.`,
  },
  {
    q: "How much tax is withheld from a commission payment?",
    a: `Your employer withholds under ATO Schedule 5 (back payments, commissions, bonuses and similar payments). The commission is apportioned across the pay periods in the year, the extra withholding on one period is worked out, and that is multiplied back out. A ${formatAUD(EX_COMMISSION)} commission paid in one fortnight on a ${formatAUD(EX_BASE_SALARY)} salary has ${formatAUD(EX_WITHHOLDING.withheldFromAdditionalPayment)} withheld (${formatPercent(EX_WITHHOLDING.effectiveRate)}), leaving ${formatAUD(EX_WITHHOLDING.netAdditionalPayment)} in hand.`,
  },
  {
    q: "Why was so much tax taken out of my commission?",
    a: `Because withholding is an estimate made from one pay period, while your real tax is assessed on the whole year. The two usually differ by a small amount, and the difference is settled when you lodge — over-withholding comes back as part of your refund, under-withholding is added to your bill. Schedule 5 also caps withholding on any commission at ${formatPercent(SCHEDULE_5_WITHHOLDING_LIMIT, 0)} of the payment.`,
  },
  {
    q: "Are commissions taxed differently from bonuses?",
    a: "No. The ATO treats commissions, bonuses, back pay and similar one-off payments identically: all are assessable income taxed at your marginal rate, and all are withheld under Schedule 5 when paid on top of normal earnings. The only difference is the label on your payslip.",
  },
  {
    q: "Is superannuation paid on commission?",
    a: `Yes. Commission earned for work performed is ordinary time earnings, so your employer must pay the ${formatPercent(SUPER_GUARANTEE.rate, 0)} Superannuation Guarantee on it in addition to the commission itself. A ${formatAUD(EX_COMMISSION)} commission attracts ${formatAUD(EX_COMMISSION * SUPER_GUARANTEE.rate)} of super, up to the maximum contribution base.`,
  },
  {
    q: "How is commission taxed if I am commission-only?",
    a: `The same way — it is your assessable income for the year and is taxed through the ordinary brackets, from ${formatPercent(TAX_BRACKETS[1].rate, 0)} above the tax-free threshold to ${formatPercent(TOP.rate, 0)} plus Medicare at the top. Enter a base salary of $0 in the calculator to see the annual tax on commission alone. Because commission-only income is irregular, withholding and the assessed amount can differ more than for salaried workers.`,
  },
  {
    q: "Do contractors pay tax on commission?",
    a: "Yes. Commission earned under an ABN is business income: you include it in your tax return, register for and charge GST once your turnover passes $75,000, and may need to pay PAYG instalments during the year. No tax is withheld by the payer unless you have not quoted an ABN. Use the contractor pay calculator to see the take-home after tax and GST.",
  },
  {
    q: "Does commission affect my HECS-HELP repayment?",
    a: `Yes. Compulsory repayments are worked out on repayment income, which includes commission. If a commission takes your repayment income above the ${formatAUD(HECS_HELP.minimumThreshold)} threshold for ${SITE_CONFIG.financialYear}, or into a higher repayment band, the repayment rises with it — and STSL is withheld from the commission payment under Schedule 5 too.`,
  },
  {
    q: "What is the withholding limit on a commission payment?",
    a: `${formatPercent(SCHEDULE_5_WITHHOLDING_LIMIT, 0)} of the commission, including any study and training support loan component. If the Schedule 5 calculation produces more than that, the employer withholds ${formatPercent(SCHEDULE_5_WITHHOLDING_LIMIT, 0)} and the rest is settled at tax time.`,
  },
];
