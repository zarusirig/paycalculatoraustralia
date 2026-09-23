// Shared FAQ copy for /employee-vs-sole-trader-vs-company/ — rendered by the
// page's accordion and turned into FAQPage JSON-LD in
// app/employee-vs-sole-trader-vs-company/page.tsx, so the structured data
// cannot drift from the page. Rates and caps come from lib/constants.

import { formatAUD, MEDICARE_LEVY, SITE_CONFIG, SUPER_GUARANTEE, TAX_BRACKETS } from "@/lib/constants";
import type { FaqItem } from "@/lib/faq";

const pct = (r: number) => `${Math.round(r * 1000) / 10}%`;
const FY = SITE_CONFIG.financialYear;
const TOP = pct(TAX_BRACKETS[TAX_BRACKETS.length - 1].rate);
const ML = pct(MEDICARE_LEVY.rate);
/** Base rate entity company tax rate (aggregated turnover under $50 million). */
const COMPANY_RATE = "25%";

export const SOLE_TRADER_COMPANY_FAQS: readonly FaqItem[] = [
  {
    q: "When should I switch from sole trader to a company?",
    a: `Consider switching when your taxable income consistently exceeds $120,000-$135,000, when you need asset protection from business liabilities, or when you want to retain profits in the business at the ${COMPANY_RATE} company tax rate rather than paying individual marginal rates up to ${TOP}. The additional compliance costs ($3,000-$5,000/year for accounting and ASIC fees) mean the switch is not worthwhile at lower income levels.`,
  },
  {
    q: "Do sole traders pay the same tax as employees?",
    a: `Yes. Sole traders pay individual income tax at the same marginal rates as employees (0% to ${TOP} plus the ${ML} Medicare levy). The difference is that sole traders can deduct business expenses before tax, must self-manage PAYG instalments and BAS lodgment (and GST once turnover reaches $75,000), and are responsible for their own superannuation contributions.`,
  },
  {
    q: "What is the company tax rate in Australia?",
    a: `The base rate entity company tax rate is ${COMPANY_RATE} for companies with aggregated turnover under $50 million and no more than 80% passive income (FY${FY}); other companies pay 30%. This flat rate applies to all taxable company income, compared to individual marginal rates that range from 0% to ${TOP} plus the ${ML} Medicare levy. When profits are distributed as franked dividends, the shareholder receives a franking credit for the company tax already paid, avoiding double taxation.`,
  },
  {
    q: "When do I need to register for GST?",
    a: "GST registration is mandatory when your annual turnover reaches $75,000 (or $150,000 for non-profit organisations). Below the threshold, registration is optional but can be beneficial if your business purchases include significant GST that you could claim back as input tax credits. Once registered, you must lodge BAS and charge 10% GST on taxable supplies.",
  },
  {
    q: "Do sole traders have to pay super?",
    a: `No, super contributions are optional for sole traders — but strongly recommended. You can contribute up to ${formatAUD(SUPER_GUARANTEE.concessionalCap)} per year in concessional (tax-deductible) contributions in FY${FY} and claim the full amount as a deduction on your tax return. This reduces your taxable income while building retirement savings. Without employer SG, sole traders must proactively fund their own retirement.`,
  },
  {
    q: "How much does it cost to set up each structure?",
    a: "Sole trader: Free — ABN registration is instant and no-cost through the Australian Business Register. Company: ASIC charges a registration fee and an annual review fee, both indexed each 1 July (check asic.gov.au for the current amounts), plus initial accounting setup, compared to $0 for a sole trader.",
  },
];
