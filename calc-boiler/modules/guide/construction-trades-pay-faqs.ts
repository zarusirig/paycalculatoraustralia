// Shared FAQ copy for /construction-trades-pay/ — rendered by the page's
// accordion and turned into FAQPage JSON-LD in app/construction-trades-pay/
// page.tsx, so the structured data cannot drift from the page.

import { EMPLOYMENT, formatAUD } from "@/lib/constants";
import { INDUSTRY_ALLOWANCE } from "@/lib/data/job-pay-rates/building-construction-common";
import type { FaqItem } from "@/lib/faq";

// Apprentice electrician minimums, Electrical, Electronic and Communications
// Contracting Award [MA000025] Schedule B.4.5 (completed Year 12, started on
// or after 1 Jan 2014), as transcribed in lib/data/job-pay-rates/apprentice-electrician.ts.
// The old table claimed 55/65/80/95% and $44k-$86k, which no award supports.
export const APPRENTICE_ELECTRICIAN = [
  { year: "Year 1", pct: 0.55, hourly: 17.97 },
  { year: "Year 2", pct: 0.65, hourly: 21.13 },
  { year: "Year 3", pct: 0.7, hourly: 22.71 },
  { year: "Year 4", pct: 0.82, hourly: 26.5 },
] as const;

const pctList = APPRENTICE_ELECTRICIAN.map((r) => `${Math.round(r.pct * 100)}%`);
const annual = (hourly: number) => formatAUD(hourly * EMPLOYMENT.hoursPerYear);

export const CONSTRUCTION_TRADES_FAQS: readonly FaqItem[] = [
  {
    q: "How much do tradies earn in Australia?",
    a: "Qualified tradies earn between $65,000 and $120,000 depending on trade, experience, and overtime. Electricians ($80K–$110K), plumbers ($75K–$105K) and boilermakers ($85K–$120K) are among the highest-paid trades. Self-employed tradies with their own business can gross $150K–$250K+ but have higher business costs.",
  },
  {
    q: "How much do apprentices get paid?",
    a: `Apprentice wages are a percentage of the qualified trade rate that rises each year, and each award sets its own scale. Under the Electrical award, an apprentice electrician who completed Year 12 gets ${pctList.slice(0, -1).join(", ")} and ${pctList[pctList.length - 1]} of the qualified rate: about ${annual(APPRENTICE_ELECTRICIAN[0].hourly)} a year in Year 1, rising to ${annual(APPRENTICE_ELECTRICIAN[APPRENTICE_ELECTRICIAN.length - 1].hourly)} in Year 4 at the award minimum. Adult apprentices receive higher minimum rates.`,
  },
  {
    q: "What are the overtime rates in construction?",
    a: "Under the Building and Construction General On-site Award, overtime is time-and-a-half for the first 2 hours and double time thereafter on weekdays. Saturday is time-and-a-half for the first 2 hours then double time (and all Saturday work after 12 noon is double time). Sunday is double time for all hours. Public holidays are double time and a half (2.5x).",
  },
  {
    q: "What is a site allowance?",
    a: `A site allowance is paid to construction workers to compensate for the conditions of working on a construction site, including noise, dust, and lack of permanent amenities. Under the Building and Construction General On-site Award the industry allowance is ${formatAUD(INDUSTRY_ALLOWANCE.general, 2)} a week in general building and civil construction (${formatAUD(INDUSTRY_ALLOWANCE.residential, 2)} in residential building), paid for all purposes; enterprise agreement site allowances on major projects are often much higher.`,
  },
  {
    q: "Is the tool allowance taxable?",
    a: "Yes, the tool allowance is assessable income and included in your gross earnings for tax purposes. However, you can claim a deduction for the cost of tools you purchase for work. If an individual tool costs $300 or less, you can claim an immediate deduction. Tools costing more than $300 must be depreciated over their effective life.",
  },
  {
    q: "What is the highest-paid trade in Australia?",
    a: "Boilermakers and electricians are typically the highest-paid trades, with qualified workers earning $85K–$120K. Electricians working in mining or oil and gas can earn $130K–$170K+. Crane operators, while not a traditional trade, can earn $100K–$150K+ on major construction projects due to their specialised skills and the high demand for certified operators.",
  },
];
