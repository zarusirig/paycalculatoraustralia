// Shared FAQ copy for /bonus-tax-calculator/.
//
// Read by both the rendered accordion (via an sr-only crawlable mirror) and
// the FAQPage JSON-LD in app/bonus-tax-calculator/page.tsx, so the structured
// data cannot drift from the visible page. Every figure is interpolated from
// lib/constants — none are typed as literals here.

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

const SECOND = TAX_BRACKETS[1];
const MIDDLE = TAX_BRACKETS[2];
const TOP = TAX_BRACKETS[TAX_BRACKETS.length - 1];
const MEDICARE = formatPercent(MEDICARE_LEVY.rate, 0);

// Worked figures come out of the engine, so they cannot contradict the
// calculator sitting above them on the page.
const AT_90K = calculatePayBreakdown({ grossSalary: 90_000 });

export interface BonusTaxFaq {
  q: string;
  a: string;
}

export const BONUS_TAX_FAQS: readonly BonusTaxFaq[] = [
  {
    q: "How is a bonus taxed in Australia?",
    a: `Bonuses are taxed at your marginal tax rate as part of your annual income. Because the bonus sits on top of your regular salary, it is taxed at whatever bracket your total income falls into — from ${formatPercent(SECOND.rate, 0)} (for incomes between ${formatAUD(SECOND.min)} and ${formatAUD(SECOND.max)}) to ${formatPercent(TOP.rate, 0)} (for incomes above ${formatAUD(TOP.min - 1)}), plus the ${MEDICARE} Medicare levy. Your employer may withhold tax from the bonus paycheque using the ATO's Schedule 5 method, but the tax you actually owe on the bonus is settled when you lodge your annual return.`,
  },
  {
    q: "Why is my bonus smaller than expected?",
    a: `Because the bonus is taxed at your marginal rate, not your effective rate. If your salary puts you in the ${formatPercent(MIDDLE.rate, 0)} bracket, ${formatPercent(MIDDLE.rate + MEDICARE_LEVY.rate, 0)} (${formatPercent(MIDDLE.rate, 0)} + ${MEDICARE} Medicare) applies to every dollar of the bonus — even though the overall effective tax rate on a ${formatAUD(90_000)} salary is only about ${formatPercent(AT_90K.effectiveTaxRate)}. The tax-free threshold and lower brackets are already used up by your regular income.`,
  },
  {
    q: "Do I get superannuation on my bonus?",
    a: `Generally yes. Performance, Christmas, sign-on and referral bonuses all count as qualifying earnings under Payday Super, so they attract the ${formatPercent(SUPER_GUARANTEE.rate, 0)} Superannuation Guarantee. The main exception is a bonus paid solely for work performed entirely outside your ordinary hours, which is excluded. Check your employment contract or ask your payroll department to confirm how your specific bonus is treated.`,
  },
  {
    q: "Will I get the tax on my bonus back at tax time?",
    a: `Only the difference, if your employer withheld more from the bonus paycheque than the tax the bonus actually added to your year. This calculator shows that actual annual figure. The Schedule 5 withholding method is designed to land close to it, so any refund attributable to a bonus is typically small — usually under ${formatAUD(200)} for a ${formatAUD(10_000)} bonus.`,
  },
  {
    q: "Is there a flat tax rate on bonuses in Australia?",
    a: `No. Australia does not have a flat bonus tax rate. Unlike some countries (the US uses a 22% flat supplemental rate), Australia adds bonuses to your annual assessable income and taxes them at your marginal tax rate. The rate depends entirely on your total income for the financial year.`,
  },
  {
    q: "How can I reduce tax on my bonus?",
    a: `Salary sacrifice part of your bonus into superannuation as a concessional contribution, taxed at only 15% inside super instead of your marginal rate of up to ${formatPercent(TOP.rate + MEDICARE_LEVY.rate, 0)}. The concessional contributions cap is ${formatAUD(SUPER_GUARANTEE.concessionalCap)} per year for FY${SITE_CONFIG.financialYear} (including employer SG). Alternatively, claim all eligible work-related deductions to reduce your total taxable income and potentially lower the marginal rate applied to the bonus.`,
  },
  {
    q: "Does a bonus affect my HECS-HELP repayment?",
    a: `Yes. HECS-HELP repayments are based on your total repayment income, which includes your salary plus any bonuses, commissions, and fringe benefits. A bonus that pushes your repayment income above the ${formatAUD(HECS_HELP.minimumThreshold)} minimum threshold triggers a compulsory repayment. The marginal repayment rate starts at ${formatPercent(HECS_HELP.bands[1].marginalRate, 0)} on income above ${formatAUD(HECS_HELP.minimumThreshold)} under the FY${SITE_CONFIG.financialYear} marginal system.`,
  },
  {
    q: "Does it matter when my bonus is paid during the financial year?",
    a: `The timing within a financial year does not change your total tax liability — your annual tax is calculated on total income regardless of when it is received. However, if your employer can defer a bonus payment to the next financial year (e.g., from June to July), it shifts the income into a different tax year and could result in a lower marginal rate if your income is lower in that year.`,
  },
];
