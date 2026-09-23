// Shared FAQ copy for /extra-super-vs-hecs-repayment/ — rendered by the page's
// accordion and turned into FAQPage JSON-LD in the page file, so the structured
// data cannot drift from the page. Rates come from lib/constants.

import { HECS_HELP, MEDICARE_LEVY, SUPER_GUARANTEE, TAX_BRACKETS, formatAUD } from "@/lib/constants";
import type { FaqItem } from "@/lib/faq";

const CONTRIBUTIONS_TAX = 0.15;
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
    a: `For most young workers with 20+ years to retirement, extra super contributions provide better long-term value due to the tax benefit (${pct(CONTRIBUTIONS_TAX)} vs your marginal rate) and compound growth. However, if your HECS balance is large (over $50,000) and indexation is high, paying it down faster can be worthwhile for the guaranteed return and improved cash flow.`,
  },
  {
    q: "How is HECS-HELP debt indexed?",
    a: `HECS-HELP debt is indexed annually on 1 June to the lower of the Consumer Price Index (CPI) or the Wage Price Index (WPI). The lower-of cap applies from the 2023 indexation onwards, so debt can no longer grow faster than wages. Indexation on ${HECS_HELP.indexationDate} was ${pct(HECS_HELP.indexationRate)}. Read the full breakdown in our HECS-HELP Guide.`,
    links: { "HECS-HELP Guide": "/hecs-help-calculator/" },
  },
  {
    q: "Do voluntary HECS repayments reduce my compulsory repayments?",
    a: "Voluntary repayments reduce your outstanding balance but do not change the compulsory repayment percentage applied to your income. However, if your voluntary payments bring the balance to zero, compulsory repayments cease entirely — immediately boosting your take-home pay.",
  },
  {
    q: "What tax benefit do I get from extra super contributions?",
    a: `Salary sacrifice or personal deductible contributions are taxed at ${pct(CONTRIBUTIONS_TAX)} inside super instead of your marginal rate. The income tax saving per dollar is ${savings}, plus the ${pct(MEDICARE_LEVY.rate)} Medicare levy you no longer pay on that dollar (up to ${cents(TOP + MEDICARE_LEVY.rate - CONTRIBUTIONS_TAX)} in total at the top rate). For a worker in the ${pct(EXAMPLE_RATE)} bracket contributing ${formatAUD(MONTHLY)}/month, the annual saving including Medicare levy is about ${formatAUD(exampleSaving)}.`,
  },
  {
    q: "Can I do both extra super and voluntary HECS payments?",
    a: `Yes. If you have sufficient surplus cash flow, you can split between both. A common approach is to salary sacrifice up to the concessional cap (${formatAUD(SUPER_GUARANTEE.concessionalCap)} including employer SG) for the tax benefit, then direct remaining surplus to voluntary HECS repayments. Use the Salary Sacrifice Calculator and HECS Calculator to model your options.`,
    links: { "Salary Sacrifice Calculator": "/salary-sacrifice-calculator/", "HECS Calculator": "/hecs-help-calculator/" },
  },
];
