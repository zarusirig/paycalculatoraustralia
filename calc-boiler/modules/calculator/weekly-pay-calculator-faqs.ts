// Shared FAQ copy for /weekly-pay-calculator/ — rendered by the calculator's
// accordion and turned into FAQPage JSON-LD in app/weekly-pay-calculator/page.tsx,
// so the structured data cannot drift from the page. Every figure is computed
// from lib/constants.

import {
  EMPLOYMENT,
  MEDICARE_LEVY,
  SITE_CONFIG,
  SUPER_GUARANTEE,
  TAX_FREE_THRESHOLD,
  calculatePayBreakdown,
  formatAUD,
  formatPercent,
} from "@/lib/constants";
import { WEEKLY_EXTRA_PAY } from "@/modules/tax-tables/ato-schedules";
import type { FaqItem } from "@/lib/faq";
import { calculatePAYGWithholding } from "@/lib/constants/payg-withholding";
import { AWE_HEADLINE, AWE_RELEASE } from "@/lib/data/average-salary";

const FY = SITE_CONFIG.financialYear;
const EX_SALARY = 80_000;
const EX = calculatePayBreakdown({ grossSalary: EX_SALARY, includeHECS: false, hasPrivateHealth: true });
const GROSS_WEEKLY = EX_SALARY / 52;
const THRESHOLD_WEEKLY = TAX_FREE_THRESHOLD / 52;

// People Also Ask (Google AU, Sept 2026) for "weekly pay calculator" and
// "weekly pay after tax calculator": docs/seo/2026-09-24-paa-optimisation.md.
const H = EMPLOYMENT.standardWeeklyHours;
const ML = formatPercent(MEDICARE_LEVY.rate, 0);
/** Weekly gross amounts for the "tax taken out each week" table and FAQs. */
export const WEEKLY_WITHHOLDING_AMOUNTS = [500, 750, 1_000, 1_200, 1_500, 2_000, 2_500] as const;
export const WEEKLY_WITHHOLDING_ROWS = WEEKLY_WITHHOLDING_AMOUNTS.map((gross) => {
  const r = calculatePAYGWithholding(gross, "weekly");
  return { gross, withheld: r.totalWithheld, net: r.netPerPeriod, annual: gross * 52 };
});
const WH = (gross: number) => WEEKLY_WITHHOLDING_ROWS.find((r) => r.gross === gross)!;

/** PAA answer reused as the lead of the "tax taken out of my weekly pay" section. */
export const WEEKLY_TAX_ANSWER: FaqItem = {
  q: "How much tax will I pay on $1,200 a week?",
  a: `If you claim the tax-free threshold, the ATO's ${FY} weekly tax table withholds ${formatAUD(WH(1_200).withheld)} from ${formatAUD(1_200)} a week, leaving ${formatAUD(WH(1_200).net)}. That covers income tax and the ${ML} Medicare levy. ${formatAUD(1_200)} a week is ${formatAUD(WH(1_200).annual)} a year. A HECS-HELP debt adds a separate repayment.`,
};

export const WEEKLY_PAY_FAQS: readonly FaqItem[] = [
  {
    q: "How do I calculate my weekly pay?",
    a: `If you're paid by the hour, multiply your hourly rate by the hours you work in the week: $27 × ${H} hours = ${formatAUD(27 * H)}. If you're on a salary, divide it by 52: ${formatAUD(EX_SALARY)} ÷ 52 = ${formatAUD(GROSS_WEEKLY, 2)}. That is your gross weekly pay; tax withheld comes off it to give your take-home pay.`,
  },
  WEEKLY_TAX_ANSWER,
  {
    q: "How much tax do I pay if I earn $1,500 a week?",
    a: `${formatAUD(WH(1_500).withheld)} a week if you claim the tax-free threshold, so you take home ${formatAUD(WH(1_500).net)} (ATO weekly tax table, ${FY}). On ${formatAUD(750)} a week the figure is ${formatAUD(WH(750).withheld)}, and on ${formatAUD(2_000)} it is ${formatAUD(WH(2_000).withheld)}. Without the threshold, for example at a second job, more is withheld.`,
  },
  {
    q: "Is $1,200 a week good in Australia?",
    a: `It is above the minimum wage but below average full-time pay. The National Minimum Wage is ${formatAUD(EMPLOYMENT.minimumWageWeekly, 2)} a week for ${H} hours, while the ABS put average full-time ordinary earnings at ${formatAUD(AWE_HEADLINE.fullTimeOrdinaryWeekly, 2)} a week in ${AWE_RELEASE.referencePeriod}. After tax, ${formatAUD(1_200)} a week is about ${formatAUD(WH(1_200).net)}.`,
  },
  {
    q: "How is weekly pay calculated in Australia?",
    a: `Weekly pay is calculated by dividing your gross annual salary by 52 weeks, then subtracting PAYG income tax, the Medicare levy (${formatPercent(MEDICARE_LEVY.rate, 0)}), and any HECS-HELP repayments. An employee earning ${formatAUD(EX_SALARY)} per year receives gross weekly pay of ${formatAUD(GROSS_WEEKLY, 2)}. After ${formatAUD(EX.netIncomeTax / 52, 2)} in income tax and ${formatAUD(EX.medicareLevy / 52, 2)} in Medicare levy, the weekly take-home pay is ${formatAUD(EX.weekly, 2)} in FY${FY}.`,
  },
  {
    q: "Is superannuation deducted from my weekly pay?",
    a: `No. Your employer pays the super guarantee of ${formatPercent(SUPER_GUARANTEE.rate, 0)} on top of your salary. This amount does not reduce your weekly take-home pay. The only exception is voluntary salary sacrifice contributions, where you choose to redirect part of your pre-tax salary into super to reduce your taxable income.`,
  },
  {
    q: "Why did my weekly pay change on 1 July?",
    a: `Weekly pay changes at the start of each financial year (1 July) because updated PAYG withholding tables take effect. For FY${FY}, changes to income tax brackets and HECS-HELP repayment thresholds affect the amount your employer withholds from each weekly payment.`,
  },
  {
    q: "What is the difference between gross weekly pay and net weekly pay?",
    a: `Gross weekly pay is your annual salary divided by 52 before any deductions. Net weekly pay (also called take-home pay) is the amount deposited into your bank account after PAYG tax, Medicare levy, and any HECS-HELP repayments are withheld. On an ${formatAUD(EX_SALARY)} salary, gross weekly pay is ${formatAUD(GROSS_WEEKLY)} and net weekly pay is ${formatAUD(EX.weekly)} — a difference of ${formatAUD(GROSS_WEEKLY - EX.weekly)} per week.`,
  },
  {
    q: "Why do we divide by 52 and not 48?",
    a: `Full-time employees in Australia receive ${EMPLOYMENT.annualLeaveWeeks} weeks of paid annual leave and ${EMPLOYMENT.personalLeaveDays} days of paid personal leave per year. These paid leave entitlements are included in the annual salary, which covers all 52 weeks. Dividing by 48 would overstate weekly pay by approximately ${((52 / 48 - 1) * 100).toFixed(1)}%.`,
  },
  {
    q: "Are there 52 or 53 weekly pays in a year?",
    a: `Usually ${WEEKLY_EXTRA_PAY.standardPayCount}. Fifty-two weeks cover 364 days, so pay day drifts a day or two later each year, and every few years a financial year contains ${WEEKLY_EXTRA_PAY.extraPayCount} weekly pay days. Your salary is then spread over one more pay. The ATO's weekly tax table publishes an optional extra amount you can ask your employer to withhold that year so you are not short at tax time. 2026-27 is one of those years if you're paid on a Wednesday: see pay periods in 2026-27.`,
    links: { "weekly tax table": "/weekly-tax-table/", "pay periods in 2026-27": "/fortnights-in-a-year/" },
  },
  {
    q: "How do casual workers calculate weekly pay?",
    a: `Casual workers multiply their hourly rate by the number of hours worked in the week. A casual loading of ${EMPLOYMENT.casualLoading * 100}% is already included in the hourly rate under most Modern Awards. Weekly PAYG tax is then calculated based on the annualised equivalent of that weekly gross amount. Casual income varies week to week, so the tax withheld each pay period also fluctuates.`,
  },
  {
    q: `Do I pay tax if my weekly pay is below ${formatAUD(THRESHOLD_WEEKLY)}?`,
    a: `Earning ${formatAUD(THRESHOLD_WEEKLY)} per week is equivalent to ${formatAUD(TAX_FREE_THRESHOLD)} per year, which is the tax-free threshold. If your total annual income from all sources stays at or below ${formatAUD(TAX_FREE_THRESHOLD)}, no income tax is payable. However, if you hold multiple jobs and your combined income exceeds the threshold, tax applies on the combined total. Only one employer can apply the tax-free threshold — your second job is taxed from the first dollar.`,
  },
  {
    q: "How should I budget on weekly pay?",
    a: `Financial advisors typically recommend the 50/30/20 rule: allocate 50% of your after-tax weekly pay to needs (rent, groceries, transport), 30% to wants (dining out, entertainment), and 20% to savings and debt repayment. On a net weekly income of ${formatAUD(EX.weekly)} (from an ${formatAUD(EX_SALARY)} salary), that equals ${formatAUD(EX.weekly * 0.5)} for needs, ${formatAUD(EX.weekly * 0.3)} for wants, and ${formatAUD(EX.weekly * 0.2)} for savings.`,
  },
];
