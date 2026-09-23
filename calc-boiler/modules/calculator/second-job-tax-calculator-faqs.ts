// Shared FAQ copy for /second-job-tax-calculator/ — rendered by the page's
// accordion and turned into FAQPage JSON-LD in
// app/second-job-tax-calculator/page.tsx, so the structured data cannot drift
// from the page. Figures come from the tax engine in lib/constants.

import {
  SITE_CONFIG,
  SUPER_GUARANTEE,
  TAX_FREE_THRESHOLD,
  calculateIncomeTax,
  calculateLITO,
  calculateMedicareLevy,
  formatAUD,
} from "@/lib/constants";
import { SCALE_1_NO_TFT } from "@/lib/constants/payg-withholding";
import type { FaqItem } from "@/lib/faq";

const pct = (r: number) => `${Math.round(r * 1000) / 10}%`;
const TFT = formatAUD(TAX_FREE_THRESHOLD);
const NO_TFT_START_RATE = pct(SCALE_1_NO_TFT[0].a ?? 0);

// Two $30,000 jobs, threshold claimed on both: each is taxed as if it were the
// only income, so the tax on the combined $60,000 goes unpaid until lodgement.
const JOB = 30_000;
const annualTax = (income: number) =>
  Math.max(0, calculateIncomeTax(income) - calculateLITO(income)) + calculateMedicareLevy(income);
const SHORTFALL = Math.round((annualTax(JOB * 2) - 2 * annualTax(JOB)) / 10) * 10;

export const SECOND_JOB_FAQS: readonly FaqItem[] = [
  {
    q: "Why is my second job taxed more?",
    a: `Your second job is not actually taxed at a higher rate. The tax-free threshold (${TFT}) is only claimed on your primary job, so your second employer withholds tax from the first dollar at the "no tax-free threshold" rate, which starts at ${NO_TFT_START_RATE} in ${SITE_CONFIG.financialYear}. That makes each pay packet smaller. At tax time, the ATO calculates your actual liability on combined income — you often receive a refund.`,
  },
  {
    q: "Should I claim the tax-free threshold on my higher-paying job?",
    a: `Yes. Always claim the threshold on the job that pays the most. This ensures the largest portion of your income benefits from the ${TFT} tax-free amount, reducing the chance of a tax debt.`,
  },
  {
    q: "Will I get a tax refund from my second job?",
    a: "Possibly. The \"no tax-free threshold\" withholding rate often over-withholds tax from your second job. When you lodge your return, if total withholding exceeds your actual liability, you receive a refund. Use the Tax Return Calculator to estimate your refund.",
    links: { "Tax Return Calculator": "/tax-return-calculator/" },
  },
  {
    q: "Do I need to declare my second job to the ATO?",
    a: "Yes. All income must be reported on your tax return. Each employer reports your earnings via Single Touch Payroll (STP), so the ATO already has records of both jobs. You do not need to separately notify the ATO, but you must declare both sources when lodging your return.",
  },
  {
    q: "What happens if I claim the tax-free threshold on both jobs?",
    a: `Both employers withhold as if their job were your only income, so too little tax is withheld overall. At tax time, the ATO combines your income and calculates the correct tax, and you will usually owe the difference. With two ${formatAUD(JOB)} jobs, the shortfall is about ${formatAUD(SHORTFALL)} in ${SITE_CONFIG.financialYear}, and it grows as your combined income rises.`,
  },
  {
    q: "Does my second employer pay superannuation?",
    a: `Yes. Both employers must pay the ${pct(SUPER_GUARANTEE.rate)} superannuation guarantee on your ordinary time earnings, regardless of whether you claim the tax-free threshold. Use the Superannuation Calculator to check contributions from each job.`,
    links: { "Superannuation Calculator": "/superannuation-calculator/" },
  },
];
