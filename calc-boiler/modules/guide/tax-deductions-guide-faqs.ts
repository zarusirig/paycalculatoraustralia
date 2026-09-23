// Shared FAQ copy for /tax-deductions-guide/ — rendered by the page's accordion
// and turned into FAQPage JSON-LD in app/tax-deductions-guide/page.tsx, so the
// structured data cannot drift from the page. Marginal rates come from
// TAX_BRACKETS (current year) and the WFH fixed rate from RETURN_2026.

import { MEDICARE_LEVY, TAX_BRACKETS, TAX_BRACKETS_2025_26, formatAUD } from "@/lib/constants";
import { RETURN_2026 } from "@/lib/constants/tax-return-2025-26";
import type { FaqItem } from "@/lib/faq";

const pct = (r: number) => `${Math.round(r * 1000) / 10}%`;
const DEDUCTION = 1_000;
const taxedRates = TAX_BRACKETS.filter((b) => b.rate > 0).map((b) => b.rate);
const savings = taxedRates.map((r) => `${formatAUD(DEDUCTION * r)} at ${pct(r)}`);
const savingsList = `${savings.slice(0, -1).join(", ")}, or ${savings[savings.length - 1]}`;
const thirty = TAX_BRACKETS.find((b) => b.rate === 0.3)!.rate;

export const TAX_DEDUCTIONS_FAQS: readonly FaqItem[] = [
  {
    q: "What is the $300 no-receipt threshold?",
    a: "If your total work-related expense claims are $300 or less, you do not need to provide written evidence such as receipts or invoices. However, you must still be able to explain to the ATO how you calculated the amount and demonstrate that the expenses were work-related. This threshold applies to the total of all work-related expenses, not $300 per category.",
  },
  {
    q: "Can I claim deductions without receipts?",
    a: "Below the $300 total work-related threshold, written records are not mandatory. Above $300, you need receipts, invoices, or bank/credit card statements. Laundry of eligible work clothing allows claims up to $150 without written records. The ATO accepts digital records — photos of receipts and accounting apps are valid evidence.",
  },
  {
    q: "How do I claim deductions?",
    a: "You claim deductions when you lodge your annual tax return, either through myTax (the ATO's free online tool) or through a registered tax agent. Deductions are entered in the \"Deductions\" section of your return. Your employer does not need to approve them — they are assessed by the ATO.",
  },
  {
    q: "Do deductions reduce my tax or my taxable income?",
    a: `Deductions reduce your taxable income, which then reduces the amount of tax calculated on that income. A ${formatAUD(DEDUCTION)} deduction does not save you ${formatAUD(DEDUCTION)} in tax — it saves you ${formatAUD(DEDUCTION)} multiplied by your marginal tax rate. At the ${pct(thirty)} bracket, a ${formatAUD(DEDUCTION)} deduction saves ${formatAUD(DEDUCTION * thirty)} in tax.`,
  },
  {
    q: "How much tax do deductions save?",
    a: `Deductions save tax at your marginal rate. Under the current resident rates, a ${formatAUD(DEDUCTION)} deduction saves ${savingsList}, plus the ${pct(MEDICARE_LEVY.rate)} Medicare levy on that amount if you pay it. On a 2025-26 return the lowest taxed rate was ${pct(TAX_BRACKETS_2025_26[1].rate)}, so the same deduction saved ${formatAUD(DEDUCTION * TAX_BRACKETS_2025_26[1].rate)} in that bracket.`,
  },
  {
    q: "Can I claim working from home and car expenses together?",
    a: `Yes. Working from home deductions and car expenses are separate categories. You can claim both in the same tax return. For example, you might claim ${RETURN_2026.wfhFixedRateCents} cents per hour for days worked from home and cents-per-kilometre for work-related driving on office days. Each claim must be separately substantiated.`,
  },
  {
    q: "Can I claim a laptop purchased for work?",
    a: "Yes, if you use it for work. If the laptop costs $300 or less, claim the full work-use percentage as an immediate deduction. If it costs more than $300, depreciate it over its effective life (typically 2-4 years). If you use the laptop 60% for work and 40% personal, only 60% of the cost or depreciation is deductible.",
  },
  {
    q: "Are union fees tax deductible?",
    a: "Yes. Membership fees for trade unions and professional associations related to your current employment are fully deductible. This includes unions such as the CFMEU, NSWNMA, AEU, and professional bodies like CPA Australia, the Law Society, and medical registration boards.",
  },
  {
    q: "Can I claim charitable donations as a deduction?",
    a: "Gifts to organisations registered as Deductible Gift Recipients (DGRs) are tax deductible, and the old $2 minimum no longer applies to gifts made from 1 July 2024 (ATO, gifts and donations, updated 6 July 2026). Most major Australian charities hold DGR status. Donations to crowdfunding campaigns, political parties (above $1,500), and overseas organisations without DGR status are not deductible. Keep donation receipts as evidence.",
  },
];
