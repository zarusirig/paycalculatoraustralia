// Shared FAQ copy for /tax-on/[salary]/ — rendered by the TaxOnSalary
// accordion and turned into FAQPage JSON-LD by the page, so the structured
// data cannot drift from the visible answers. Every figure is computed from
// the tax engine and lib/constants.

import {
  calculatePayBreakdown,
  formatAUD,
  MEDICARE_LEVY,
  SITE_CONFIG,
  SUPER_GUARANTEE,
  TAX_BRACKETS,
} from "@/lib/constants/australian-tax";
import { salaryFacts } from "@/lib/data/salary-pages";
import type { FaqItem } from "@/lib/faq";

const pct1 = (r: number) => `${(r * 100).toFixed(1)}%`;

export function taxOnSalaryFaqs(salary: number): FaqItem[] {
  const fy = SITE_CONFIG.financialYear;
  const s = formatAUD(salary);
  // Headline figures exclude HECS-HELP, matching the page title.
  const b = calculatePayBreakdown({ grossSalary: salary });
  const facts = salaryFacts(salary);
  const totalTax = b.netIncomeTax + b.medicareLevy;
  const totalRate = pct1(totalTax / salary);
  const marginal = pct1(b.marginalTaxRate);
  const medicarePct = `${Math.round(MEDICARE_LEVY.rate * 100)}%`;
  const sgPct = `${Math.round(SUPER_GUARANTEE.rate * 1000) / 10}%`;
  const taxFree = formatAUD(TAX_BRACKETS[0].max);
  const first = TAX_BRACKETS[1];
  const second = TAX_BRACKETS[2];
  const firstRate = Math.round(first.rate * 100);
  const firstSavingVs2023_24 = Math.round((first.max - (first.min - 1)) * (0.19 - first.rate));
  const mlsRate = (facts.mls.rate * 100).toFixed(2).replace(/0$/, "");

  return [
    {
      q: `How much tax do I pay on ${s}?`,
      a: `On ${s} in ${fy}, you pay ${formatAUD(b.netIncomeTax)} in income tax plus ${formatAUD(b.medicareLevy)} in Medicare levy: ${formatAUD(totalTax)} in total, or ${totalRate} of your salary. Your take-home pay is ${formatAUD(b.takeHomePay)} per year or ${formatAUD(b.weekly)} per week. This uses the ATO resident tax rates for FY${fy}.`,
    },
    {
      q: `What is my marginal tax rate on ${s}?`,
      a: `Your marginal tax rate on ${s} is ${marginal} (including the ${medicarePct} Medicare levy). This means each additional dollar you earn above ${s} is taxed at ${(b.marginalTaxRate * 100).toFixed(1)}c. Your effective rate is lower at ${totalRate} because the first ${taxFree} is tax-free.`,
    },
    {
      q: `How much superannuation does my employer pay on ${s}?`,
      a: facts.superCapped
        ? `Your employer contributes ${formatAUD(facts.employerSuper)} per year to your super fund, the super guarantee maximum for FY${fy}: earnings above the ${formatAUD(SUPER_GUARANTEE.maxContributionBaseAnnual)} maximum contribution base attract no compulsory super. This is paid on top of your ${s} gross salary, not deducted from it. Your total remuneration package including super is ${formatAUD(salary + facts.employerSuper)}.`
        : `Your employer contributes ${formatAUD(facts.employerSuper)} per year to your super fund at the ${sgPct} super guarantee rate for FY${fy}. This is paid on top of your ${s} gross salary, not deducted from it. Your total remuneration package including super is ${formatAUD(salary + facts.employerSuper)}.`,
    },
    {
      q: `What is ${s} per week after tax?`,
      a: `A ${s} annual salary equals ${formatAUD(b.weekly)} per week after tax, ${formatAUD(b.fortnightly)} per fortnight, and ${formatAUD(b.monthly)} per month. These figures include income tax and Medicare levy deductions but exclude voluntary salary sacrifice or HECS-HELP repayments.`,
    },
    {
      q: `Do I pay the Medicare Levy Surcharge on ${s}?`,
      a:
        facts.mls.tier > 0
          ? `Yes, if you are single and have no private hospital cover. A ${s} salary falls in MLS tier ${facts.mls.tier} for ${fy}, so the Medicare Levy Surcharge is ${mlsRate}% of income for MLS purposes: ${formatAUD(facts.mls.amount)} a year. Holding private hospital insurance exempts you from the MLS.`
          : `No. For ${fy} the Medicare Levy Surcharge applies to singles from ${formatAUD(MEDICARE_LEVY.surcharge.tier1.min)} of income for MLS purposes without private hospital cover. At ${s}, you are below this threshold and are not liable for the surcharge.`,
    },
    {
      q: `How did the Stage 3 tax cuts affect ${s}?`,
      a: `The Stage 3 tax cuts effective 1 July 2024 reduced the second bracket rate from 19% to 16% and expanded the 30% bracket ceiling from $120,000 to ${formatAUD(second.max)}, and a further cut took that rate to ${firstRate}% from 1 July 2026. On ${s}, these changes reduced income tax compared to the FY2023-24 rates. The ${firstRate}% rate applies to income between ${formatAUD(first.min)} and ${formatAUD(first.max)}, saving up to ${formatAUD(firstSavingVs2023_24)} a year in that bracket alone against the old 19% rate.`,
    },
    {
      q: "Is income tax calculated differently in different states?",
      a: "No. Income tax is a federal tax in Australia and is calculated identically across all states and territories including NSW, Victoria, Queensland, Western Australia, South Australia, Tasmania, ACT, and the Northern Territory. The same ATO tax brackets apply regardless of your state of residence. State-level payroll tax is paid by employers, not employees.",
    },
    {
      q: "What is the difference between marginal and effective tax rate?",
      a: `The marginal tax rate of ${marginal} is the rate applied to each additional dollar earned. The effective tax rate of ${totalRate} is the share of your ${s} salary paid in income tax and Medicare levy. The effective rate is lower because the first ${taxFree} is tax-free and income in the lower brackets is taxed at lower rates before your marginal rate applies.`,
    },
  ];
}
