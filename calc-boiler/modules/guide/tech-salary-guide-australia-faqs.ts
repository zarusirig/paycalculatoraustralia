// Shared FAQ copy for /tech-salary-guide-australia/ — rendered by the page's
// accordion and turned into FAQPage JSON-LD in
// app/tech-salary-guide-australia/page.tsx, so the structured data cannot drift
// from the page. CGT figures come from lib/constants/capital-gains-tax.ts.

import { CGT_DISCOUNT_RATES, CGT_REFORM_2027 } from "@/lib/constants/capital-gains-tax";
import type { FaqItem } from "@/lib/faq";

const DISCOUNT = `${CGT_DISCOUNT_RATES.individual * 100}%`;

export const TECH_SALARY_FAQS: readonly FaqItem[] = [
  {
    q: "How much do software developers earn in Australia?",
    a: "Junior developers earn $65K–$80K, mid-level developers $90K–$120K, senior developers $130K–$170K, and lead/principal engineers $160K–$200K. These are base salaries — total compensation at larger companies includes equity (RSUs), bonuses, and benefits that can add $10K–$80K+ per year.",
  },
  {
    q: "Is it better to be a contractor or permanent employee in tech?",
    a: "Contractors typically earn 30–50% more in gross terms but miss out on paid leave, the superannuation guarantee, and job security. The break-even point depends on your day rate, how many weeks a year you are actually billing, and whether you operate as a sole trader or through a Pty Ltd company. Use the Contractor vs Employee Calculator to compare the two at your own rate.",
    links: { "Contractor vs Employee Calculator": "/contractor-vs-employee-calculator/" },
  },
  {
    q: "What day rate equals a $150K permanent salary?",
    a: "To match a $150K permanent salary (including 4 weeks leave, 10 sick days, super, and other benefits), you need a contractor day rate of approximately $900–$1,000 per day. This accounts for the ~230 billable days per year, self-funded super, insurance, and no paid leave. Use the Contractor vs Employee Calculator for an exact comparison.",
    links: { "Contractor vs Employee Calculator": "/contractor-vs-employee-calculator/" },
  },
  {
    q: "How do tech salaries vary by city in Australia?",
    a: "Sydney pays about 10–15% above Melbourne, which is the usual baseline. Brisbane is around 5–10% below Melbourne, Perth varies with mining-tech demand (those roles pay a premium, general tech less), and remote roles are moving towards parity as more companies pay location-agnostic salaries.",
  },
  {
    q: "How are RSUs taxed in Australia?",
    a: `RSUs are generally taxed as ordinary income at your marginal tax rate when they vest. The taxable amount is the market value of the shares at the vesting date. If you sell immediately, there is no further capital gains tax. If you hold the shares after vesting and they increase in value, you pay CGT on the gain when you sell, with the ${DISCOUNT} CGT discount available if held for more than 12 months. From ${CGT_REFORM_2027.startDate}, the discount is replaced by cost base indexation and a ${CGT_REFORM_2027.minimumTaxRate * 100}% minimum tax rate for gains accruing from that date.`,
  },
  {
    q: "Should I contract through ABN or Pty Ltd?",
    a: "For contractors earning under $120K–$130K, an ABN (sole trader) is usually simpler and cheaper. Above that level, a Pty Ltd company allows you to retain profits at the 25% company tax rate and distribute income more strategically. However, Pty Ltd involves $2,000–$5,000/year in accounting costs. The break-even point depends on your specific circumstances — use the Entity Structure Comparison on this site.",
    links: { "Entity Structure Comparison": "/employee-vs-sole-trader-vs-company/" },
  },
  {
    q: "How much do cybersecurity professionals earn?",
    a: "Cybersecurity analysts earn $100K–$150K, security engineers $120K–$170K, and CISOs/security directors $180K–$280K. The sector has acute talent shortages, driving salaries higher than equivalent seniority levels in general software development. Government and defence sector cybersecurity roles may also include security clearance bonuses.",
  },
  {
    q: "Do remote tech workers earn less?",
    a: "Increasingly no. Many Australian tech companies now pay location-agnostic salaries, meaning a developer in Brisbane or regional Australia earns the same as one in Sydney. Some companies still apply city-based pay bands, but the trend is towards parity. International remote roles may offer different rates depending on the company's compensation philosophy.",
  },
];
