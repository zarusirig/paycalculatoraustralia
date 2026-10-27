import { LITO, MEDICARE_LEVY, TAX_BRACKETS_2026_27, formatAUD } from "@/lib/constants";
import { marginalRateAt } from "@/lib/constants/marginal-rates";
import type { Faq } from "./t3-shared";

// Shared by the page body and the FAQPage JSON-LD. Rates are the ATO 2026-27
// resident scale (ato.gov.au, "Tax rates – Australian resident", last updated
// 13 August 2026); the all-in bands are derived from them in
// lib/constants/marginal-rates.ts.

const B = TAX_BRACKETS_2026_27;
const m = (n: number) => formatAUD(n);
/** A rate as a whole or one-decimal percentage: 0.3 -> "30%", 0.335 -> "33.5%". */
const p = (r: number) => `${Number((r * 100).toFixed(1))}%`;
/** A rate as cents per $1: 0.05 -> "5c", 0.015 -> "1.5c". */
const c = (r: number) => `${Number((r * 100).toFixed(1))}c`;
const LEVY = p(MEDICARE_LEVY.rate);
const MLS_SINGLE = m(MEDICARE_LEVY.surcharge.tier1.min - 1);

export const MARGINAL_TAX_RATES_FAQS: Faq[] = [
  {
    q: "What is a marginal tax rate?",
    a: `Your marginal tax rate is the tax rate on your next dollar of taxable income: the rate of the bracket your income finishes in. In 2026-27 the resident scale is ${p(B[0].rate)} to ${m(B[0].max)}, ${p(B[1].rate)} to ${m(B[1].max)}, ${p(B[2].rate)} to ${m(B[2].max)}, ${p(B[3].rate)} to ${m(B[3].max)} and ${p(B[4].rate)} above that, before the ${LEVY} Medicare levy. Only the dollars inside each bracket are taxed at that bracket's rate.`,
  },
  {
    q: "What is the difference between marginal and average tax rate?",
    a: "The marginal rate is what you pay on the next dollar. The average (effective) rate is your total tax divided by your total income. Because the lower bands are taxed at lower rates, your average rate is always below your marginal rate. On $90,000 the marginal rate is 30% plus 2% Medicare, but the average rate including Medicare is only about 21%.",
  },
  {
    q: "Can a pay rise push me into a higher bracket and reduce my take-home pay?",
    a: `Not through the tax brackets. Moving into a higher bracket only taxes the part of your income above the threshold at the higher rate. Your existing income is taxed exactly as before, so crossing a bracket never lowers take-home pay. The exception is the Medicare levy surcharge: without private hospital cover, a single who goes over ${MLS_SINGLE} pays it on their whole income, not just the part above ${MLS_SINGLE}, so a small raise across that line lowers take-home pay. Tax, the Medicare levy and HELP repayments together can also make a raise feel small.`,
  },
  {
    q: "How much of a $10,000 raise do I keep?",
    a: "On $85,000 you keep $6,800 of a $10,000 raise, because the whole raise sits inside the 30% bracket, where tax and Medicare take 32%. A raise at another income, or across a bracket threshold, keeps a different share. If a HELP debt applies, the repayment adds 15c per $1 above the threshold, so you keep less. Enter your income and the raise in the calculator above to see your own figure.",
  },
  {
    q: "Is a bonus taxed at a higher rate than my normal pay?",
    a: "No. A bonus is added to your income for the year and taxed at your marginal rate, the same as a raise. It can look higher because your employer withholds tax on the bonus using the ATO's method for bonuses and back payments, which estimates the tax by spreading the payment across the year's pay periods. The withholding is only an estimate; any over-withholding comes back when you lodge your tax return.",
  },
  {
    q: "Why does the next dollar cost more than the bracket rate at lower incomes?",
    a: `Two things stack on top of the scale rate between ${m(MEDICARE_LEVY.lowIncomeThreshold)} and ${m(LITO.nilOffsetIncome)}: the Medicare levy phases in at ${c(MEDICARE_LEVY.shadeInRate)} per $1 above ${m(MEDICARE_LEVY.lowIncomeThreshold)} until it reaches the full ${LEVY}, and the low income tax offset is withdrawn at ${c(LITO.phaseOut1.rate)} per $1 from ${m(LITO.fullOffsetCeiling)} to ${m(LITO.phaseOut1.end)} and ${c(LITO.phaseOut2.rate)} per $1 from ${m(LITO.phaseOut1.end)} to ${m(LITO.nilOffsetIncome)}. The all-in marginal rate in those ranges is ${p(marginalRateAt(MEDICARE_LEVY.lowIncomeThreshold))}, ${p(marginalRateAt(LITO.fullOffsetCeiling))} and ${p(marginalRateAt(LITO.phaseOut1.end))}.`,
  },
  {
    q: "What is my marginal tax rate at $100,000?",
    a: `At $100,000 taxable income your scale rate is ${p(B[2].rate)}, and with the ${LEVY} Medicare levy the all-in marginal rate is ${p(marginalRateAt(100_000))}. Your average rate is lower, around 22% including Medicare. Without private hospital cover, crossing ${MLS_SINGLE} adds the Medicare levy surcharge on your whole income.`,
  },
  {
    q: "Does salary sacrifice save tax at my marginal rate?",
    a: "Yes. Salary sacrificed into super is taken from your pre-tax pay, so you avoid your marginal rate on it and pay 15% contributions tax in the fund instead. The higher your marginal rate, the bigger the saving. Employer concessional contributions are subject to the annual cap, so check it before sacrificing a large amount.",
  },
  {
    q: "Where can I see the full tax brackets?",
    a: "The full 2026-27 scale, with the tax payable at each threshold and the change from 2025-26, is on the tax brackets page. This page is about the other question: what the tax system takes from a raise, bonus or extra shifts.",
  },
];
