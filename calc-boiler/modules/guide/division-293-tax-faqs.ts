// Shared FAQ copy for /division-293-tax/ — rendered by the page's accordion and
// turned into FAQPage JSON-LD in app/division-293-tax/page.tsx, so the
// structured data cannot drift from the page. Threshold and rates come from
// lib/constants.

import { formatAUD, MEDICARE_LEVY, TAX_BRACKETS } from "@/lib/constants";
import {
  CONTRIBUTIONS_TAX_RATE,
  DIVISION_293,
  DIVISION_296,
  division293Estimate,
} from "@/lib/constants/super-contributions";
import type { FaqItem } from "@/lib/faq";

const pct = (r: number) => `${Math.round(r * 1000) / 10}%`;
const THRESHOLD = formatAUD(DIVISION_293.threshold);
const RATE = pct(DIVISION_293.rate);
const BASE_RATE = pct(CONTRIBUTIONS_TAX_RATE);
const COMBINED = CONTRIBUTIONS_TAX_RATE + DIVISION_293.rate;
const TOP_RATE = TAX_BRACKETS[TAX_BRACKETS.length - 1].rate + MEDICARE_LEVY.rate;

// Worked example: taxable income plus employer contributions just over the line.
const EX_INCOME = 230_000;
const EX_SUPER = 30_000;
const EX_EXCESS = EX_INCOME + EX_SUPER - DIVISION_293.threshold;
const EX_TAX = division293Estimate(EX_INCOME, EX_SUPER);

export const DIVISION_293_FAQS: readonly FaqItem[] = [
  {
    q: "What is Division 293 tax?",
    a: `Division 293 is an additional ${RATE} tax on concessional (before-tax) super contributions for individuals whose income plus concessional super contributions exceed ${THRESHOLD}. It effectively doubles the tax on those contributions from ${BASE_RATE} to ${pct(COMBINED)} for high-income earners, partially closing the gap between the concessional super tax rate and the top marginal rate.`,
  },
  {
    q: "How is Division 293 tax calculated?",
    a: `The ATO adds your income for Division 293 purposes (taxable income plus reportable fringe benefits and net investment losses) to your low tax contributions (concessional super contributions). If the total exceeds ${THRESHOLD}, you pay an extra ${RATE} on the lesser of your concessional contributions or the amount over ${THRESHOLD}.`,
  },
  {
    q: "Do I have to pay Division 293 if my salary is under $250K?",
    a: `Yes, potentially. Division 293 looks at your combined income and concessional super contributions. If your taxable income is ${formatAUD(EX_INCOME)} and your employer pays ${formatAUD(EX_SUPER)} in SG contributions, your combined total is ${formatAUD(EX_INCOME + EX_SUPER)} — above the ${THRESHOLD} threshold. You would owe Division 293 tax on ${formatAUD(EX_EXCESS)} of super contributions (${formatAUD(EX_TAX)}).`,
  },
  {
    q: "Can I pay Division 293 from my super fund?",
    a: "Yes. When you receive your Division 293 notice of assessment, you can elect to release the amount from your super fund by giving the ATO a release authority within 60 days of the notice being issued. You can also choose to pay from personal funds instead. The tax is due 21 days after the notice is issued, and general interest charge applies to unpaid amounts.",
  },
  {
    q: "Does salary sacrifice into super trigger Division 293?",
    a: "Salary sacrifice reduces your taxable income but the sacrificed amount is added as a concessional super contribution. Since Division 293 adds income + super contributions, salary sacrifice does not help you avoid the threshold. The total of taxable income plus super remains the same. However, the net tax benefit of salary sacrifice is still positive even with Division 293.",
  },
  {
    q: "Is the $250,000 threshold indexed?",
    a: `No. The ${THRESHOLD} Division 293 threshold is not indexed to inflation or wage growth. It has remained at ${THRESHOLD} since 1 July 2017 (reduced from $300,000). Over time, wage growth means more taxpayers will cross this threshold. Any change would require new legislation.`,
  },
  {
    q: "Is it still worth contributing to super with Division 293?",
    a: `Yes, for most people. Even with Division 293, super contributions are taxed at ${pct(COMBINED)} total, compared to a top marginal rate of ${pct(TOP_RATE)} (including Medicare levy). That's still a ${pct(TOP_RATE - COMBINED)} tax saving on each dollar contributed. Investment earnings inside super are also taxed at a maximum of ${BASE_RATE} in accumulation phase, compared to your marginal rate outside super (unless your total super balance exceeds ${formatAUD(DIVISION_296.largeBalanceThreshold)}, where Division 296 tax applies from ${DIVISION_296.start}).`,
  },
];
