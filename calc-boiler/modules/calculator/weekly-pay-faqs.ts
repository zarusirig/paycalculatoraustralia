// Shared FAQ copy for /weekly-pay-calculator/.
//
// Read by BOTH the rendered accordion (plus its sr-only crawlable mirror) in
// modules/calculator/weekly-pay-calculator.tsx and the FAQPage JSON-LD in
// app/weekly-pay-calculator/page.tsx. Before this file the JSON-LD carried 3
// short answers against 9 visible questions; this is the full set plus People
// Also Ask questions from the live Google AU SERP for "weekly pay calculator"
// and "weekly pay after tax calculator" (docs/seo/2026-09-24-paa-optimisation.md).

import {
  calculatePayBreakdown,
  EMPLOYMENT,
  formatAUD,
  formatPercent,
  MEDICARE_LEVY,
  SITE_CONFIG,
  SUPER_GUARANTEE,
  TAX_FREE_THRESHOLD,
} from "@/lib/constants";
import { calculatePAYGWithholding, PAY_PERIODS } from "@/lib/constants/payg-withholding";
import { AWE_HEADLINE, AWE_RELEASE } from "@/lib/data/average-salary";
import { WEEKLY_EXTRA_PAY } from "@/modules/tax-tables/ato-schedules";

export interface WeeklyFaq {
  q: string;
  a: string;
}

const FY = SITE_CONFIG.financialYear;
const WK = PAY_PERIODS.weekly;
const H = EMPLOYMENT.standardWeeklyHours;
const MEDICARE = formatPercent(MEDICARE_LEVY.rate, 0);
const EX = calculatePayBreakdown({ grossSalary: 80_000, includeHECS: false, hasPrivateHealth: true });

/** Weekly gross amounts for the "tax taken out each week" table and FAQs (PAA: $750, $1,200, $1,500). */
export const WEEKLY_WITHHOLDING_AMOUNTS = [500, 750, 1_000, 1_200, 1_500, 2_000, 2_500] as const;
export const WEEKLY_WITHHOLDING_ROWS = WEEKLY_WITHHOLDING_AMOUNTS.map((gross) => {
  const r = calculatePAYGWithholding(gross, "weekly");
  return { gross, withheld: r.totalWithheld, net: r.netPerPeriod, annual: gross * WK };
});
const W = (gross: number) => WEEKLY_WITHHOLDING_ROWS.find((r) => r.gross === gross)!;

export const WEEKLY_FAQS: readonly WeeklyFaq[] = [
  {
    q: "How do I calculate my weekly pay?",
    a: `If you're paid by the hour, multiply your hourly rate by the hours you work in the week: $27 × ${H} hours = ${formatAUD(27 * H)}. If you're on a salary, divide it by ${WK}: ${formatAUD(80_000)} ÷ ${WK} = ${formatAUD(80_000 / WK, 2)}. That is your gross weekly pay; tax withheld comes off it to give your take-home pay.`,
  },
  {
    q: "How much tax will I pay on $1,200 a week?",
    a: `If you claim the tax-free threshold, the ATO's ${FY} weekly tax table withholds ${formatAUD(W(1_200).withheld)} from ${formatAUD(1_200)} a week, leaving ${formatAUD(W(1_200).net)}. That covers income tax and the ${MEDICARE} Medicare levy. ${formatAUD(1_200)} a week is ${formatAUD(W(1_200).annual)} a year. A HECS-HELP debt adds a separate repayment.`,
  },
  {
    q: "How much tax do I pay if I earn $1,500 a week?",
    a: `${formatAUD(W(1_500).withheld)} a week if you claim the tax-free threshold, so you take home ${formatAUD(W(1_500).net)} (ATO weekly tax table, ${FY}). On ${formatAUD(750)} a week the figure is ${formatAUD(W(750).withheld)}, and on ${formatAUD(2_000)} it is ${formatAUD(W(2_000).withheld)}. Without the threshold, for example at a second job, more is withheld.`,
  },
  {
    q: "Is $1,200 a week good in Australia?",
    a: `It is above the minimum wage but below average full-time pay. The National Minimum Wage is ${formatAUD(EMPLOYMENT.minimumWageWeekly, 2)} a week for ${H} hours, while the ABS put average full-time ordinary earnings at ${formatAUD(AWE_HEADLINE.fullTimeOrdinaryWeekly, 2)} a week in ${AWE_RELEASE.referencePeriod}. After tax, ${formatAUD(1_200)} a week is about ${formatAUD(W(1_200).net)}.`,
  },
  {
    q: "How is weekly pay calculated in Australia?",
    a: `Weekly pay is your gross annual salary divided by ${WK}, less PAYG income tax (including the ${MEDICARE} Medicare levy) and any HECS-HELP repayment. On ${formatAUD(80_000)} a year the gross weekly pay is ${formatAUD(80_000 / WK, 2)}; after ${formatAUD(EX.netIncomeTax / WK, 2)} income tax and ${formatAUD(EX.medicareLevy / WK, 2)} Medicare levy, take-home pay is ${formatAUD(EX.weekly, 2)} in ${FY}.`,
  },
  {
    q: "Is superannuation deducted from my weekly pay?",
    a: `No. Your employer pays the ${formatPercent(SUPER_GUARANTEE.rate, 0)} Superannuation Guarantee on top of your salary, so it does not reduce your weekly take-home pay. The exception is voluntary salary sacrifice, where you choose to send part of your pre-tax pay into super.`,
  },
  {
    q: "Why did my weekly pay change on 1 July?",
    a: `New PAYG withholding tables take effect on 1 July each year. For ${FY}, the lower second income tax rate and the new HECS-HELP repayment thresholds changed how much employers withhold from each weekly pay. A pay rise from the Annual Wage Review, also from 1 July, changes it too.`,
  },
  {
    q: "What is the difference between gross weekly pay and net weekly pay?",
    a: `Gross weekly pay is your annual salary divided by ${WK} before deductions. Net weekly pay, or take-home pay, is what reaches your bank account after PAYG tax, Medicare levy and any HECS-HELP repayment. On ${formatAUD(80_000)}, gross is ${formatAUD(80_000 / WK)} and net is ${formatAUD(EX.weekly)}, a difference of ${formatAUD(80_000 / WK - EX.weekly)} a week.`,
  },
  {
    q: "Why do we divide by 52 and not 48?",
    a: `Full-time employees get 4 weeks of paid annual leave and 10 days of paid personal leave a year, and that paid leave is part of the annual salary, which covers all ${WK} weeks. Dividing by 48 would overstate weekly pay by about ${formatPercent(WK / 48 - 1)}.`,
  },
  {
    q: "Are there 52 or 53 weekly pays in a year?",
    a: `Usually ${WEEKLY_EXTRA_PAY.standardPayCount}. Fifty-two weeks cover 364 days, so pay day drifts later each year, and every few years a financial year contains ${WEEKLY_EXTRA_PAY.extraPayCount} weekly pay days. Your salary is then spread over one more pay, and the ATO's weekly tax table lists an optional extra amount you can ask your employer to withhold so you are not short at tax time.`,
  },
  {
    q: "How do casual workers calculate weekly pay?",
    a: `Casual workers multiply their hourly rate by the hours worked that week. Under most modern awards the hourly rate already includes a ${formatPercent(EMPLOYMENT.casualLoading, 0)} casual loading. Tax is withheld on each week's gross pay, so when hours change from week to week, the tax withheld changes too.`,
  },
  {
    q: `Do I pay tax if my weekly pay is below ${formatAUD(TAX_FREE_THRESHOLD / WK)}?`,
    a: `${formatAUD(TAX_FREE_THRESHOLD / WK)} a week is ${formatAUD(TAX_FREE_THRESHOLD)} a year, the tax-free threshold. If your income from all sources stays at or below that, no income tax is payable. If you have more than one job, only one employer can apply the threshold, and tax is worked out on your combined income at the end of the year.`,
  },
  {
    q: "How should I budget on weekly pay?",
    a: `A common rule of thumb is 50/30/20: 50% of after-tax pay to needs such as rent, groceries and transport, 30% to wants and 20% to savings and debt repayment. On ${formatAUD(EX.weekly)} a week (an ${formatAUD(80_000)} salary) that is ${formatAUD(EX.weekly * 0.5)} for needs, ${formatAUD(EX.weekly * 0.3)} for wants and ${formatAUD(EX.weekly * 0.2)} for savings.`,
  },
];
