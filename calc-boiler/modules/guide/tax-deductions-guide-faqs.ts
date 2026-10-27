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
    q: "What can I claim on tax?",
    a: "You can claim a work-related expense if you paid for it yourself and were not reimbursed, it directly relates to earning your income, and you have a record, usually a receipt. Common claims are working from home, car and travel, uniforms, tools, self-education, union fees and donations. Private costs such as the daily commute and lunch are not deductible.",
  },
  {
    q: "What is the $300 no-receipt threshold?",
    a: "For 2025-26 and earlier income years, if your total work-related expense claims are $300 or less (not counting car, travel and overtime meal allowance expenses), you do not need to provide written evidence such as receipts or invoices. However, you must still be able to explain to the ATO how you calculated the amount and demonstrate that the expenses were work-related. This threshold applies to the total of all work-related expenses, not $300 per category. The exception ends from the 2026-27 income year: if you claim more than your maximum standard deduction (up to $1,000), you need written evidence for every work-related expense you claim.",
  },
  {
    q: "Can I claim deductions without receipts?",
    a: "For 2025-26 and earlier income years, written records are not mandatory below the $300 total work-related threshold. Above $300, you need receipts, invoices, or bank/credit card statements. A laundry claim for eligible work clothing of $150 or less needs no written evidence, even when your total work-related claim is over $300. Both exceptions end from the 2026-27 income year. The ATO accepts digital records: photos of receipts and accounting apps are valid evidence.",
  },
  {
    q: "How do I claim deductions?",
    a: "You claim deductions when you lodge your annual tax return, either through myTax (the ATO's free online tool) or through a registered tax agent. Deductions are entered in the \"Deductions\" section of your return. Your employer does not need to approve them, as they are assessed by the ATO.",
  },
  {
    q: "Do deductions reduce my tax or my taxable income?",
    a: `Deductions reduce your taxable income, which then reduces the amount of tax calculated on that income. A ${formatAUD(DEDUCTION)} deduction does not save you ${formatAUD(DEDUCTION)} in tax. It saves you ${formatAUD(DEDUCTION)} multiplied by your marginal tax rate. At the ${pct(thirty)} bracket, a ${formatAUD(DEDUCTION)} deduction saves ${formatAUD(DEDUCTION * thirty)} in tax.`,
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
    a: "Yes, if you use it for work. If the laptop costs $300 or less, claim the full work-use percentage as an immediate deduction. If it costs more than $300, depreciate it over its effective life. The ATO uses the Commissioner's effective life of 2 years for a laptop. If you use the laptop 60% for work and 40% personal, only 60% of the cost or depreciation is deductible.",
  },
  {
    q: "Are union fees tax deductible?",
    a: "Yes. You can claim union fees and subscriptions to trade, business or professional associations for the industry you work in. This includes unions such as the CFMEU, NSWNMA and AEU, and professional bodies like CPA Australia and the Law Society. A subscription to an association that does not directly relate to your current job is deductible only up to $42 per subscription each income year. Registration fees are a separate deduction: you can claim the cost of renewing a registration or practising certificate you need for your current job (for example nurse, teacher or doctor registration), but not the initial cost of getting it.",
  },
  {
    q: "Can I claim charitable donations as a deduction?",
    a: "Gifts to organisations registered as Deductible Gift Recipients (DGRs) are tax deductible, and the old $2 minimum no longer applies to gifts made from 1 July 2024 (ATO, gifts and donations, updated 6 July 2026). Not all charities are DGRs, so check the organisation's status on ABN Lookup before you claim. Gifts of $2 or more to registered political parties and independent candidates are deductible up to $1,500 an income year for all political parties combined, plus a separate $1,500 for independent candidates and members. Donations to crowdfunding campaigns and to organisations without DGR status, including overseas organisations, are not deductible. Keep donation receipts as evidence.",
  },
];
