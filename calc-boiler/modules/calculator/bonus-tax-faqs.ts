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
  {
    q: "Can I salary sacrifice my bonus into super?",
    a: "Yes, if your employer allows it. Directing your bonus into super as a concessional contribution means it is taxed at only 15% (instead of your marginal rate). However, the contribution counts towards your $30,000 concessional cap. See our salary sacrifice guide for details.",
  },
  {
    q: "Does my employer pay super on my bonus?",
    a: "Yes, for performance-related bonuses. Bonuses classified as \"Ordinary Time Earnings\" attract the 12% Superannuation Guarantee. A $10,000 performance bonus generates $1,200 in additional super. Sign-on bonuses, retention bonuses, and referral bonuses are generally excluded from OTE and do not attract SG.",
  },
  {
    q: "Why was so much tax taken from my bonus?",
    a: "Your bonus sits on top of your regular salary, so every dollar is taxed at your highest marginal rate. A worker earning $90,000 pays an average tax rate of about 23% on total income but the bonus is taxed at 32% (30% plus 2% Medicare levy) because it falls entirely in the top bracket. Some payroll systems also annualise the pay period containing the bonus, which can produce even higher withholding that is corrected when you lodge your return.",
  },
  {
    q: "Are commissions taxed the same as bonuses?",
    a: "Yes. The ATO treats commissions, bonuses, incentive payments, and profit-share distributions identically for PAYG withholding purposes. All are supplementary payments subject to Schedule 5 withholding at your marginal tax rate.",
  },
  {
    q: "What if I receive two bonuses in the same financial year?",
    a: "Each bonus is taxed using Schedule 5 based on your year-to-date earnings at the time of payment. The second bonus sits on top of your salary plus the first bonus, so it is taxed at a potentially higher marginal rate. A worker on $120,000 who receives two $10,000 bonuses pays 32% on the first and 32% on the second (both within the $45K\u2013$135K bracket). If the second bonus pushes total income above $135,000, the portion above $135,000 is taxed at 39%.",
  },
  {
    q: "How are bonuses taxed for part-time or casual workers?",
    a: "The same way as full-time workers. The ATO does not differentiate between employment types for bonus taxation. A part-time worker earning $30,000 per year who receives a $5,000 bonus has the bonus taxed at the 16% marginal rate (plus 2% Medicare levy) because total income of $35,000 falls in the $18,201\u2013$45,000 bracket. The lower income base means part-time workers typically face a lower marginal rate on bonuses than full-time workers.",
  },
  {
    q: "How are bonuses taxed for non-residents?",
    a: "Non-residents do not receive the $18,200 tax-free threshold and pay tax from the first dollar. The non-resident marginal rate on bonuses starts at 30% for income up to $135,000, then 37% up to $190,000, and 45% above $190,000. Non-residents do not pay the Medicare levy. See our Non-Resident Tax Guide for full rates.",
  },
  {
    q: "Does Division 293 apply if my bonus pushes income above $250,000?",
    a: "Yes. \"Division 293\" imposes an additional 15% tax on concessional super contributions when income (including super contributions) exceeds $250,000. If a bonus pushes your combined income and super above this threshold, any concessional contributions \u2014 including salary-sacrificed bonus amounts \u2014 are taxed at 30% instead of 15% inside super.",
  },
];
