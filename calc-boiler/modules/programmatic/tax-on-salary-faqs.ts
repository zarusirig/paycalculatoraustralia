// Shared FAQ copy for /tax-on/[salary]/ — rendered by the TaxOnSalary
// accordion and turned into FAQPage JSON-LD by the page, so the structured
// data cannot drift from the visible answers. Every figure is computed from
// the tax engine, lib/constants and the ABS data in lib/data/average-salary.
//
// 10 Oct 2026 (second pass): three answers per page, chosen by salary. The
// total-tax answer is always first; the other two come from the rules that
// apply at this salary (taxOnFaqIds in lib/data/salary-pages/tax-on-ranges.ts):
// the Low Income Tax Offset and the Medicare levy reduction on low incomes, a
// bracket edge when one is within $5,000, Division 293, the surcharge and
// HECS-HELP higher up, then where the salary ranks and the thresholds nearby.
// A $20,000 page no longer answers a surcharge question that cannot apply.

import { formatAUD, SITE_CONFIG } from "@/lib/constants/australian-tax";
import { salaryFacts } from "@/lib/data/salary-pages";
import { taxOnFaqIds, type TaxOnFaqId } from "@/lib/data/salary-pages/tax-on-ranges";
import type { FaqItem } from "@/lib/faq";
import { placementFaqAnswer, thresholdsFaqAnswer } from "@/modules/programmatic/tax-on-salary-copy";
import {
  div293FaqAnswer,
  edgeFaqAnswer,
  edgeFaqQuestion,
  hecsFaqAnswer,
  litoFaqAnswer,
  medicareFaqAnswer,
  mlsFaqAnswer,
} from "@/modules/programmatic/tax-on-salary-range-copy";

const pct1 = (r: number) => `${(r * 100).toFixed(1)}%`;

function faq(id: TaxOnFaqId, salary: number): FaqItem {
  const s = formatAUD(salary);
  switch (id) {
    case "total": {
      // Headline figures exclude HECS-HELP, matching the page title.
      const b = salaryFacts(salary).breakdown;
      const totalTax = b.netIncomeTax + b.medicareLevy;
      return {
        q: `How much tax do I pay on ${s}?`,
        a: `${formatAUD(totalTax)} in ${SITE_CONFIG.financialYear}: ${formatAUD(b.netIncomeTax)} income tax plus ${formatAUD(b.medicareLevy)} Medicare levy, ${pct1(totalTax / salary)} of the salary, leaving ${formatAUD(b.takeHomePay)} a year (${formatAUD(b.weekly)} a week). ATO resident rates, no HECS-HELP.`,
      };
    }
    case "lito":
      return { q: `How much Low Income Tax Offset do I get on ${s}?`, a: litoFaqAnswer(salary) };
    case "medicare":
      return { q: `Do I pay the Medicare levy on ${s}?`, a: medicareFaqAnswer(salary) };
    case "edge":
      return { q: edgeFaqQuestion(salary), a: edgeFaqAnswer(salary) };
    case "div293":
      return { q: `Does Division 293 tax apply on ${s}?`, a: div293FaqAnswer(salary) };
    case "mls":
      return { q: `Do I pay the Medicare Levy Surcharge on ${s}?`, a: mlsFaqAnswer(salary) };
    case "hecs":
      return { q: `How much HECS-HELP do I repay on ${s}?`, a: hecsFaqAnswer(salary) };
    case "placement":
      return { q: `Is ${s} a high salary in Australia?`, a: placementFaqAnswer(salary) };
    case "thresholds":
      return { q: `Which tax thresholds are close to ${s}?`, a: thresholdsFaqAnswer(salary) };
  }
}

export function taxOnSalaryFaqs(salary: number): FaqItem[] {
  return taxOnFaqIds(salary).map((id) => faq(id, salary));
}
