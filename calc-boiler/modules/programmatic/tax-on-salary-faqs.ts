// Shared FAQ copy for /tax-on/[salary]/ — rendered by the TaxOnSalary
// accordion and turned into FAQPage JSON-LD by the page, so the structured
// data cannot drift from the visible answers. Every figure is computed from
// the tax engine, lib/constants and the ABS data in lib/data/average-salary.
//
// 10 Oct 2026: cut from eight answers to four. Two were the same on every
// page (state income tax, marginal vs effective) and four repeated a table
// already on the page (super, per week, marginal rate, Stage 3). The two new
// ones are salary-specific: thresholds near this salary and where it ranks
// among Australian earners.

import { formatAUD, MEDICARE_LEVY, SITE_CONFIG } from "@/lib/constants/australian-tax";
import { salaryFacts } from "@/lib/data/salary-pages";
import type { FaqItem } from "@/lib/faq";
import { placementFaqAnswer, thresholdsFaqAnswer } from "@/modules/programmatic/tax-on-salary-copy";

const pct1 = (r: number) => `${(r * 100).toFixed(1)}%`;

export function taxOnSalaryFaqs(salary: number): FaqItem[] {
  const fy = SITE_CONFIG.financialYear;
  const s = formatAUD(salary);
  // Headline figures exclude HECS-HELP, matching the page title.
  const facts = salaryFacts(salary);
  const b = facts.breakdown;
  const totalTax = b.netIncomeTax + b.medicareLevy;
  const mlsRate = Number((facts.mls.rate * 100).toFixed(2));

  return [
    {
      q: `How much tax do I pay on ${s}?`,
      a: `${formatAUD(totalTax)} in ${fy}: ${formatAUD(b.netIncomeTax)} income tax plus ${formatAUD(b.medicareLevy)} Medicare levy, ${pct1(totalTax / salary)} of the salary, leaving ${formatAUD(b.takeHomePay)} a year (${formatAUD(b.weekly)} a week). ATO resident rates, no HECS-HELP.`,
    },
    {
      q: `Do I pay the Medicare Levy Surcharge on ${s}?`,
      a:
        facts.mls.tier > 0
          ? `Only if you are single with no private hospital cover. ${s} is in MLS tier ${facts.mls.tier} for ${fy}, so the surcharge would be ${mlsRate}% of income for MLS purposes: ${formatAUD(facts.mls.amount)} a year.`
          : `No. For ${fy} the surcharge starts at ${formatAUD(MEDICARE_LEVY.surcharge.tier1.min)} of income for MLS purposes (singles without private hospital cover), ${formatAUD(MEDICARE_LEVY.surcharge.tier1.min - salary)} above ${s}.`,
    },
    {
      q: `Which tax thresholds are close to ${s}?`,
      a: thresholdsFaqAnswer(salary),
    },
    {
      q: `Is ${s} a high salary in Australia?`,
      a: placementFaqAnswer(salary),
    },
  ];
}
