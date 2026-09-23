// Shared FAQ copy for /take-home-pay-on/[salary]/ — rendered by the
// TakeHomePayOnSalary accordion and turned into FAQPage JSON-LD by the page,
// so the structured data cannot drift from the visible answers. Every figure
// is computed from the tax engine and lib/constants.

import {
  calculatePayBreakdown,
  EMPLOYMENT,
  formatAUD,
  SITE_CONFIG,
  SUPER_GUARANTEE,
} from "@/lib/constants/australian-tax";
import { salaryFacts } from "@/lib/data/salary-pages";
import type { FaqItem } from "@/lib/faq";

export function takeHomePayOnSalaryFaqs(salary: number): FaqItem[] {
  const fy = SITE_CONFIG.financialYear;
  const s = formatAUD(salary);
  const b = calculatePayBreakdown({ grossSalary: salary });
  const withHecs = calculatePayBreakdown({ grossSalary: salary, includeHECS: true });
  const sacrifice = salaryFacts(salary).sacrificeThousand;
  const hours = EMPLOYMENT.hoursPerYear;
  const hourlyGross = salary / hours;
  const hourlyNet = b.takeHomePay / hours;
  const effectiveRate = (((b.netIncomeTax + b.medicareLevy) / salary) * 100).toFixed(1);

  return [
    {
      q: `What is the take-home pay on ${s} in Australia?`,
      a: `On a ${s} salary, your take-home pay is ${formatAUD(b.takeHomePay)} per year after income tax of ${formatAUD(b.netIncomeTax)} and Medicare levy of ${formatAUD(b.medicareLevy)}. That equals ${formatAUD(b.weekly)} per week or ${formatAUD(b.monthly)} per month. This uses ATO tax rates for FY${fy}.`,
    },
    {
      q: `How much is ${s} per week after tax?`,
      a: `A ${s} annual salary equals ${formatAUD(b.weekly)} per week after tax, ${formatAUD(b.fortnightly)} per fortnight, and ${formatAUD(b.monthly)} per month. These figures include income tax and Medicare levy deductions but exclude voluntary salary sacrifice or HECS-HELP repayments.`,
    },
    {
      q: `What is the effective hourly rate on ${s}?`,
      a: `Based on a standard ${EMPLOYMENT.standardWeeklyHours}-hour week (${hours.toLocaleString("en-AU")} hours a year), your gross hourly rate is ${formatAUD(hourlyGross, 2)} and your after-tax hourly rate is ${formatAUD(hourlyNet, 2)}. The effective tax rate is ${effectiveRate}%, so for every hour you work you take home ${formatAUD(hourlyNet, 2)} after income tax and the Medicare levy.`,
    },
    {
      q: `How much is ${s} after tax with a HECS debt?`,
      a:
        withHecs.hecsRepayment > 0
          ? `With a HECS-HELP debt, the compulsory repayment on ${s} is ${formatAUD(withHecs.hecsRepayment)} a year, so take-home pay falls to ${formatAUD(withHecs.takeHomePay)} (${formatAUD(withHecs.weekly)} a week) in ${fy}.`
          : `${s} is below the ${fy} compulsory HECS-HELP repayment threshold, so a study loan does not change take-home pay of ${formatAUD(b.takeHomePay)}.`,
    },
    {
      q: `How can I increase my take-home pay on ${s}?`,
      a: `${
        sacrifice.netGain > 150
          ? `Salary sacrifice to superannuation is the most direct lever on ${s}: each $1,000 sacrificed costs ${formatAUD(sacrifice.takeHomeCost)} of take-home pay and puts ${formatAUD(sacrifice.intoSuper)} into super after contributions tax.`
          : `On ${s}, salary sacrifice saves little or no tax (each $1,000 costs ${formatAUD(sacrifice.takeHomeCost)} of take-home for ${formatAUD(sacrifice.intoSuper)} in super).`
      } Concessional contributions are capped at ${formatAUD(SUPER_GUARANTEE.concessionalCap)} a year, employer SG included. Maximising work-related deductions also reduces your taxable income. Use our Salary Sacrifice Calculator to model exact savings.`,
      links: { "Salary Sacrifice Calculator": "/salary-sacrifice-calculator/" },
    },
  ];
}
