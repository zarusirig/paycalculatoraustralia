// Shared FAQ copy for the homepage (/).
//
// Deliberately NOT inside the "use client" template: the rendered accordion,
// the sr-only crawlable mirror AND the FAQPage JSON-LD in app/page.tsx all
// read from this one array, so the structured data cannot drift from the
// visible page. Divergence between the two is what put stale figures into
// Google's index on /tax-on/.
//
// Every dollar figure below is computed by the engine or interpolated from
// lib/constants at module scope. This is a static export — running the engine
// at build time is free and can never stale-drift. Nothing is typed as a
// literal.
//
// Scope rule (anti-cannibalisation): PAY-side questions only — take-home pay,
// employment types, pay frequency, casual loading, super-in-package. Tax-side
// questions (brackets, refunds, deductions, tax-free threshold) belong to
// /income-tax-calculator/.

import {
  calculatePayBreakdown,
  formatAUD,
  formatPercent,
  hourlyToAnnual,
  EMPLOYMENT,
  HECS_HELP,
  MEDICARE_LEVY,
  SUPER_GUARANTEE,
  SITE_CONFIG,
  TAX_BRACKETS,
  TAX_BRACKETS_2025_26,
} from "@/lib/constants";

const FY = SITE_CONFIG.financialYear;

// Reference breakdowns, computed once by the engine.
const BD80 = calculatePayBreakdown({ grossSalary: 80_000 });
const BD100 = calculatePayBreakdown({ grossSalary: 100_000 });

/** Max annual saving from the 1 July 2026 second-bracket cut (16% → 15%). */
export const RATE_CUT_MAX_SAVING = Math.round(
  (TAX_BRACKETS_2025_26[1].rate - TAX_BRACKETS[1].rate) *
    (TAX_BRACKETS[1].max - TAX_BRACKETS[0].max)
);

const CASUAL_MIN_WAGE = EMPLOYMENT.minimumWageHourly * (1 + EMPLOYMENT.casualLoading);
const MIN_WAGE_ANNUAL = hourlyToAnnual(EMPLOYMENT.minimumWageHourly);
const PKG_90_BASE = Math.round(90_000 / (1 + SUPER_GUARANTEE.rate));
const PRO_RATA_25 = Math.round(80_000 * (25 / EMPLOYMENT.standardWeeklyHours));

const pct = (v: number) => `${Math.round(v * 100)}%`;

export interface HomeFaq {
  q: string;
  a: string;
}

export const HOME_FAQS: readonly HomeFaq[] = [
  {
    q: "How is take-home pay calculated in Australia?",
    a: `Take-home pay is your gross salary minus income tax, minus the ${formatPercent(MEDICARE_LEVY.rate, 0)} Medicare levy, minus any HECS-HELP repayment. Superannuation is paid on top by your employer, so it does not reduce the figure. On $80,000 in FY${FY} that works out to ${formatAUD(BD80.netIncomeTax)} income tax plus ${formatAUD(BD80.medicareLevy)} Medicare levy, leaving take-home pay of ${formatAUD(BD80.takeHomePay)} a year, or ${formatAUD(BD80.weekly, 2)} a week.`,
  },
  {
    q: "What is the take-home pay on $80,000 in Australia?",
    a: `On an $80,000 salary in FY${FY}, take-home pay is ${formatAUD(BD80.takeHomePay)} a year — ${formatAUD(BD80.weekly, 2)} a week, ${formatAUD(BD80.fortnightly, 2)} a fortnight or ${formatAUD(BD80.monthly, 2)} a month. That is after ${formatAUD(BD80.netIncomeTax)} income tax and ${formatAUD(BD80.medicareLevy)} Medicare levy. Your employer also pays ${formatAUD(BD80.superContribution)} into your super fund on top of your salary.`,
  },
  {
    q: "What is the take-home pay on $100,000 in Australia?",
    a: `On a $100,000 salary in FY${FY}, take-home pay is ${formatAUD(BD100.takeHomePay)} a year, or ${formatAUD(BD100.weekly, 2)} a week — after ${formatAUD(BD100.netIncomeTax)} income tax and ${formatAUD(BD100.medicareLevy)} Medicare levy. Your effective rate on the whole salary is ${formatPercent(BD100.effectiveTaxRate)}, and your employer pays ${formatAUD(BD100.superContribution)} in super on top.`,
  },
  {
    q: `Will I get a tax cut in ${FY}?`,
    a: `Yes. From 1 July 2026 the second marginal tax rate fell from ${formatPercent(TAX_BRACKETS_2025_26[1].rate, 0)} to ${formatPercent(TAX_BRACKETS[1].rate, 0)} on income between ${formatAUD(TAX_BRACKETS[0].max)} and ${formatAUD(TAX_BRACKETS[1].max)}. The maximum saving is about ${formatAUD(RATE_CUT_MAX_SAVING)} a year, which you receive in full once you earn ${formatAUD(TAX_BRACKETS[1].max)} or more. The other bracket rates and thresholds did not change.`,
  },
  {
    q: "What is casual loading and why do casuals get 25% extra?",
    a: `Casual loading is an extra ${pct(EMPLOYMENT.casualLoading)} on top of the base hourly rate, paid because casual employees miss out on paid annual leave, paid personal leave and notice of termination. On the ${formatAUD(EMPLOYMENT.minimumWageHourly, 2)} national minimum wage, the casual rate is ${formatAUD(CASUAL_MIN_WAGE, 2)} an hour. ${pct(EMPLOYMENT.casualLoading)} is the standard loading under most awards, but your award or agreement sets the exact figure.`,
  },
  {
    q: "When do penalty rates apply?",
    a: `Penalty rates apply when your award or agreement says so — typically weekends, public holidays, overtime and late nights. Under most awards Saturday work pays around ${pct(EMPLOYMENT.penaltyRates.saturdayMin)}–${pct(EMPLOYMENT.penaltyRates.saturdayMax)} of the base rate, Sundays ${pct(EMPLOYMENT.penaltyRates.sundayMin)}–${pct(EMPLOYMENT.penaltyRates.sundayMax)}, and public holidays ${pct(EMPLOYMENT.penaltyRates.publicHolidayMin)}–${pct(EMPLOYMENT.penaltyRates.publicHolidayMax)}. The exact percentages depend on your award, your classification and whether you are casual, so always check the award that covers your job.`,
  },
  {
    q: "Is super included in my salary, or paid on top?",
    a: `It depends on how the offer is worded. "$90,000 plus super" means you are paid $90,000 and your employer adds ${formatPercent(SUPER_GUARANTEE.rate, 0)} super on top. "$90,000 package including super" means your base salary is about ${formatAUD(PKG_90_BASE)} and the rest is the super contribution. The difference changes both your take-home pay and your super, so check the wording before comparing offers.`,
  },
  {
    q: "How much super does my employer pay?",
    a: `Employers must pay ${formatPercent(SUPER_GUARANTEE.rate, 0)} of your ordinary earnings into your super fund — on an $80,000 salary that is ${formatAUD(BD80.superContribution)} a year, paid on top of your salary rather than deducted from it. Since Payday Super began on ${SUPER_GUARANTEE.paydaySuperStart}, the contribution must be paid each payday instead of quarterly.`,
  },
  {
    q: "Is it better to be paid weekly, fortnightly or monthly?",
    a: `Your annual take-home pay is the same regardless of pay frequency — only the timing changes. An $80,000 salary pays ${formatAUD(BD80.weekly, 2)} weekly, ${formatAUD(BD80.fortnightly, 2)} fortnightly or ${formatAUD(BD80.monthly, 2)} monthly after tax in FY${FY}. Some people prefer weekly pay for budgeting; the tax you owe for the year does not change.`,
  },
  {
    q: "How do I convert an hourly rate to an annual salary?",
    a: `Multiply your hourly rate by your weekly hours, then by ${EMPLOYMENT.weeksPerYear} weeks. A standard ${EMPLOYMENT.standardWeeklyHours}-hour week is ${EMPLOYMENT.hoursPerYear.toLocaleString("en-AU")} hours a year, so the ${formatAUD(EMPLOYMENT.minimumWageHourly, 2)} minimum wage equals about ${formatAUD(MIN_WAGE_ANNUAL)} a year full-time. Going the other way, divide an annual salary by ${EMPLOYMENT.hoursPerYear.toLocaleString("en-AU")} — $80,000 is about ${formatAUD(80_000 / EMPLOYMENT.hoursPerYear, 2)} an hour.`,
  },
  {
    q: "What is the difference between gross pay and net pay?",
    a: `Gross pay is your salary before any deductions. Net pay — take-home pay — is what actually lands in your bank account after income tax, the Medicare levy and any HECS repayments come out. In FY${FY}, $80,000 gross becomes ${formatAUD(BD80.takeHomePay)} net for a resident with no HECS debt.`,
  },
  {
    q: "How is pro-rata pay calculated?",
    a: `Pro-rata pay is proportional to your hours compared with full-time. If a full-time role (${EMPLOYMENT.standardWeeklyHours} hours) pays $80,000 and you work 25 hours a week, your pro-rata salary is $80,000 × (25 ÷ ${EMPLOYMENT.standardWeeklyHours}) = ${formatAUD(PRO_RATA_25)} a year. Tax is then calculated on the pro-rata amount, so part-time workers usually pay a lower effective rate.`,
  },
  {
    q: "Why does my employer withhold more tax than this calculator shows?",
    a: `Employers withhold using the ATO's per-pay-period tables, which round conservatively and can't see your whole year — so the amount held back usually runs slightly above your true annual liability, refunded when you lodge. For the full explanation of PAYG withholding versus annual tax, see the Income Tax Calculator.`,
  },
  {
    q: "What happens to my take-home pay if my income changes during the year?",
    a: `Your employer adjusts withholding each pay based on that period's earnings, but income tax is assessed on your total income for the full financial year. If your pay rose or fell part-way through, the amount withheld across the year may not match your final liability — the difference is settled as a refund or bill when you lodge your return.`,
  },
  {
    q: "How is a second job taxed?",
    a: `You can only claim the tax-free threshold with one employer, so your second employer withholds tax from the first dollar — which is why second-job payslips look heavily taxed, even though your actual annual tax doesn't change. See the Income Tax Calculator for the full two-jobs breakdown.`,
  },
  {
    q: "Can new migrants and visa holders use this pay calculator?",
    a: `Yes — the calculator uses Australian resident tax rates, which apply to most migrants who live and work in Australia and are residents for tax purposes. Working holiday makers (417 and 462 visas) and non-residents are taxed under different rate schedules with no tax-free threshold, so their take-home pay is lower at the same salary.`,
  },
  {
    q: "How often should my employer pay super?",
    a: `On every payday. Payday Super commenced on ${SUPER_GUARANTEE.paydaySuperStart} and replaced the old quarterly deadlines — your employer's contribution must now reach your fund within 7 business days of each payday. Late payments attract the Superannuation Guarantee Charge, which adds interest compounding daily plus an administrative uplift.`,
  },
  {
    q: "Do I pay tax differently in different states?",
    a: `No. Income tax is federal — the same rates and thresholds apply in NSW, Victoria, Queensland, WA, SA, Tasmania, the ACT and the NT, so take-home pay on a given salary is identical nationwide. State differences (payroll tax) affect employers, not the tax that comes out of your pay.`,
  },
  {
    q: "How do I calculate my daily rate from an annual salary?",
    a: `Divide your annual salary by 260 working days (${EMPLOYMENT.weeksPerYear} weeks × 5 days). On $80,000, the daily rate is ${formatAUD(80_000 / 260, 2)}. For an hourly rate, divide by ${EMPLOYMENT.hoursPerYear.toLocaleString("en-AU")} hours instead — about ${formatAUD(80_000 / EMPLOYMENT.hoursPerYear, 2)} an hour on the same salary.`,
  },
  {
    q: "What deductions come out of my pay before it reaches my bank account?",
    a: `Three compulsory deductions: income tax, the ${formatPercent(MEDICARE_LEVY.rate, 0)} Medicare levy, and HECS-HELP repayments once your income passes ${formatAUD(HECS_HELP.minimumThreshold)}. Voluntary arrangements such as salary sacrifice or a novated lease also come out pre-tax if you have set them up. Superannuation is not a deduction — your employer pays it on top of your salary.`,
  },
] as const;
