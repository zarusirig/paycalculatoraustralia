// Shared FAQ copy for /employee-vs-sole-trader-vs-company/ — rendered by the
// page's accordion and turned into FAQPage JSON-LD in
// app/employee-vs-sole-trader-vs-company/page.tsx, so the structured data
// cannot drift from the page. Rates and caps come from lib/constants; company
// tax, GST and PSI facts from lib/constants/company-tax.ts (ATO, cited there).

import { formatAUD, MEDICARE_LEVY, SITE_CONFIG, SUPER_GUARANTEE, TAX_BRACKETS } from "@/lib/constants";
import { COMPANY_TAX, GST_RATE, GST_REGISTRATION } from "@/lib/constants/company-tax";
import type { FaqItem } from "@/lib/faq";

const pct = (r: number) => `${Math.round(r * 1000) / 10}%`;
const FY = SITE_CONFIG.financialYear;
const TOP = pct(TAX_BRACKETS[TAX_BRACKETS.length - 1].rate);
const ML = pct(MEDICARE_LEVY.rate);
/** First individual bracket taxed above the company rate (30% from $45,001). */
const ABOVE_COMPANY = TAX_BRACKETS.find((b) => b.rate > COMPANY_TAX.baseRateEntityRate)!;
const COMPANY_RATE = pct(COMPANY_TAX.baseRateEntityRate);
const FULL_RATE = pct(COMPANY_TAX.fullRate);
const TURNOVER = `$${COMPANY_TAX.aggregatedTurnoverThreshold / 1_000_000} million`;

export const SOLE_TRADER_COMPANY_FAQS: readonly FaqItem[] = [
  {
    q: "When should I switch from sole trader to a company?",
    a: `It depends on more than income. A base rate entity company pays ${COMPANY_RATE} on its taxable income, against individual marginal rates of ${pct(ABOVE_COMPANY.rate)} to ${TOP} (plus the ${ML} Medicare levy) on income above ${formatAUD(ABOVE_COMPANY.min - 1)}. Profit paid out as a franked dividend is topped up to your own marginal rate, so the saving is on profit kept in the company. If your income is produced mainly from your own skills or effort, it is personal services income (PSI), and if the PSI rules apply the company must attribute it to you, taxed at your marginal rates. Weigh any saving against the company's accounting and ASIC costs and your need for asset protection. The take-home comparison on this page shows the tax at three income levels.`,
  },
  {
    q: "Do sole traders pay the same tax as employees?",
    a: `Yes. Sole traders pay individual income tax at the same marginal rates as employees (0% to ${TOP} plus the ${ML} Medicare levy). The difference is that sole traders can deduct business expenses before tax, must self-manage PAYG instalments and BAS lodgment (and GST once GST turnover reaches ${formatAUD(GST_REGISTRATION.threshold)}), and are responsible for their own superannuation contributions.`,
  },
  {
    q: "What is the company tax rate in Australia?",
    a: `The base rate entity company tax rate is ${COMPANY_RATE} for companies with aggregated turnover under ${TURNOVER} and no more than ${pct(COMPANY_TAX.maxPassiveIncomeShare)} of assessable income from passive sources such as interest, rent and dividends; other companies pay ${FULL_RATE}. The ATO applies these rates from ${COMPANY_TAX.firstYear} onwards. This flat rate applies to all taxable company income, compared to individual marginal rates that range from 0% to ${TOP} plus the ${ML} Medicare levy. When profits are distributed as franked dividends, the shareholder receives a franking credit for the company tax already paid, avoiding double taxation.`,
  },
  {
    q: "When do I need to register for GST?",
    a: `GST registration is mandatory when your GST turnover reaches ${formatAUD(GST_REGISTRATION.threshold)} (or ${formatAUD(GST_REGISTRATION.nonProfitThreshold)} for non-profit organisations), and you must register within ${GST_REGISTRATION.daysToRegister} days. Below the threshold, registration is optional but can be beneficial if your business purchases include significant GST that you could claim back as input tax credits. Once registered, you must lodge BAS and charge ${pct(GST_RATE)} GST on taxable supplies.`,
  },
  {
    q: "Do sole traders have to pay super?",
    a: `No, super contributions are optional for sole traders — but strongly recommended. You can contribute up to ${formatAUD(SUPER_GUARANTEE.concessionalCap)} per year in concessional (tax-deductible) contributions in FY${FY} and claim the full amount as a deduction on your tax return. This reduces your taxable income while building retirement savings. Without employer SG, sole traders must proactively fund their own retirement.`,
  },
  {
    q: "How much does it cost to set up each structure?",
    a: "Sole trader: the Australian Business Register describes it as the simplest and cheapest business structure, and a successful online ABN application gives you your ABN immediately. Company: ASIC charges a registration fee and an annual review fee, both indexed each 1 July (check asic.gov.au for the current amounts), plus initial accounting setup and ongoing accounting fees for the company's tax return and records.",
  },
];
