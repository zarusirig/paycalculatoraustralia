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

const FY = SITE_CONFIG.financialYear;
const EX_SALARY = 80_000;
const EX = calculatePayBreakdown({ grossSalary: EX_SALARY, includeHECS: false, hasPrivateHealth: true });
const GROSS_WEEKLY = EX_SALARY / 52;
const THRESHOLD_WEEKLY = TAX_FREE_THRESHOLD / 52;

export const WEEKLY_PAY_FAQS: readonly FaqItem[] = [
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
