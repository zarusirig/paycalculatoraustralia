// Shared FAQ copy for /extra-super-vs-hecs-repayment/ — rendered by the page's
// accordion and turned into FAQPage JSON-LD in the page file, so the structured
// data cannot drift from the page. Rates come from lib/constants.

import { HECS_HELP, MEDICARE_LEVY, SUPER_GUARANTEE, TAX_BRACKETS, formatAUD } from "@/lib/constants";
import { CONTRIBUTIONS_TAX_RATE, DIVISION_293 } from "@/lib/constants/super-contributions";
import type { FaqItem } from "@/lib/faq";

const CONTRIBUTIONS_TAX = CONTRIBUTIONS_TAX_RATE;
const pct = (r: number) => `${Math.round(r * 1000) / 10}%`;
const cents = (r: number) => `${Math.round(r * 100)}c`;
const taxedBrackets = TAX_BRACKETS.filter((b) => b.rate > 0);
const savings = taxedBrackets
  .map((b) => `${cents(b.rate - CONTRIBUTIONS_TAX)} at the ${pct(b.rate)} bracket`)
  .join(", ");
const TOP = taxedBrackets[taxedBrackets.length - 1].rate;
const MONTHLY = 500;
const EXAMPLE_RATE = 0.37;
const exampleSaving = MONTHLY * 12 * (EXAMPLE_RATE + MEDICARE_LEVY.rate - CONTRIBUTIONS_TAX);

export const EXTRA_SUPER_VS_HECS_FAQS: readonly FaqItem[] = [
  {
    q: "Is it better to pay off HECS or put extra into super?",
    a: `Our view: for most young workers with 20+ years to retirement, extra super contributions give better long-term value than paying off HECS. That is because contributions are taxed at ${pct(CONTRIBUTIONS_TAX)} instead of your marginal rate, and they compound over those years. If your HECS balance is large (over $50,000) and indexation is high, paying it down faster can be worthwhile for the certain return and improved cash flow.`,
  },
  {
    q: "How is HECS-HELP debt indexed?",
    a: `HECS-HELP debt is indexed annually on 1 June to the lower of the Consumer Price Index (CPI) or the Wage Price Index (WPI). This cap was legislated in 2024, applying from 1 June 2023, to prevent debt growing faster than wages. Indexation on ${HECS_HELP.indexationDate} was ${pct(HECS_HELP.indexationRate)}. Read the full breakdown in our HECS-HELP Guide.`,
    links: { "HECS-HELP Guide": "/hecs-help-calculator/" },
  },
  {
    q: "Do voluntary HECS repayments reduce my compulsory repayments?",
    a: "Voluntary repayments reduce your outstanding balance. While you still owe money and your repayment income is above the minimum repayment income, they do not change your compulsory repayment, which is worked out from your repayment income, not your balance. Once your HECS balance reaches zero, compulsory repayments stop. Give your employer a new Withholding declaration (NAT 3093) saying you no longer have a loan, so they stop withholding the extra amount and your take-home pay rises.",
  },
  {
    q: "What tax benefit do I get from extra super contributions?",
    a: `Salary sacrifice or personal deductible contributions are taxed at ${pct(CONTRIBUTIONS_TAX)} inside super instead of your marginal rate. The income tax saving per dollar is ${savings}, plus the ${pct(MEDICARE_LEVY.rate)} Medicare levy you no longer pay on that dollar (up to ${cents(TOP + MEDICARE_LEVY.rate - CONTRIBUTIONS_TAX)} in total at the top rate). If your income for Division 293 purposes plus your concessional contributions is over ${formatAUD(DIVISION_293.threshold)}, Division 293 tax adds another ${pct(DIVISION_293.rate)} on the lesser of your concessional contributions and the amount over that threshold. Those contributions are taxed at ${pct(CONTRIBUTIONS_TAX + DIVISION_293.rate)} in total, so the saving on them at the top rate falls to ${cents(TOP + MEDICARE_LEVY.rate - CONTRIBUTIONS_TAX - DIVISION_293.rate)}. For a worker in the ${pct(EXAMPLE_RATE)} bracket contributing ${formatAUD(MONTHLY)}/month, the annual saving including Medicare levy is about ${formatAUD(exampleSaving)}.`,
  },
  {
    q: "Can I do both extra super and voluntary HECS payments?",
    a: `Yes. You can split surplus cash between extra super and voluntary HECS repayments. Our view: salary sacrifice up to the concessional cap (${formatAUD(SUPER_GUARANTEE.concessionalCap)} including employer SG) first, because that is where the tax benefit is, then put remaining surplus into voluntary HECS repayments. Use the Salary Sacrifice Calculator and HECS Calculator to model your options.`,
    links: { "Salary Sacrifice Calculator": "/salary-sacrifice-calculator/", "HECS Calculator": "/hecs-help-calculator/" },
  },
];
