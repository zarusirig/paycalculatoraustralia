// Shared FAQ copy for /second-job-tax-calculator/.
//
// Read by BOTH the rendered accordion (plus its sr-only crawlable mirror) in
// modules/calculator/second-job-tax-calculator.tsx and the FAQPage JSON-LD in
// app/second-job-tax-calculator/page.tsx. Before this file the two held
// different copies of the same questions; this is their union plus People Also
// Ask questions from the live Google AU SERP
// (docs/seo/2026-09-24-paa-optimisation.md). Every figure comes from the
// withholding scales and tax engine in lib/constants.

import {
  calculatePayBreakdown,
  formatAUD,
  formatPercent,
  SITE_CONFIG,
  SUPER_GUARANTEE,
  TAX_FREE_THRESHOLD,
} from "@/lib/constants";
import { NO_TFN_RATES, PAY_PERIODS, SCALE_1_NO_TFT, withholdingForPeriod } from "@/lib/constants/payg-withholding";
import type { FaqItem } from "@/lib/faq";


const FY = SITE_CONFIG.financialYear;
const FN = PAY_PERIODS.fortnightly;
const SG = formatPercent(SUPER_GUARANTEE.rate, 0);

/** First coefficient of the current "no tax-free threshold" scale (Schedule 1, scale 1). */
export const NO_TFT_START_RATE = formatPercent(SCALE_1_NO_TFT[0].a ?? 0, 0);

/** Annual PAYG withheld on a job paid fortnightly, with or without the tax-free threshold. */
export function annualWithholding(annual: number, scale: "tft" | "noTft"): number {
  if (annual <= 0) return 0;
  return withholdingForPeriod(annual / FN, "fortnightly", scale) * FN;
}

/** Tax + Medicare levy actually payable on a full year's income (after LITO). */
const taxOn = (income: number) => calculatePayBreakdown({ grossSalary: income }).totalDeductions;

// Worked example used by several answers: $60,000 main job + $20,000 second job.
export const MAIN_JOB = 60_000;
export const SECOND_JOB = 20_000;
export const SECOND_JOB_WITHHELD = annualWithholding(SECOND_JOB, "noTft");
export const SECOND_JOB_ACTUAL_TAX = taxOn(MAIN_JOB + SECOND_JOB) - taxOn(MAIN_JOB);
const SECOND_JOB_KEPT = SECOND_JOB - SECOND_JOB_ACTUAL_TAX;
/**
 * Year-end position across BOTH jobs (threshold claimed on the main job):
 * positive = refund, negative = amount owed. The no-threshold scale treats the
 * second job as if it were the only income above the threshold, so once the
 * main job reaches a higher bracket it usually under-withholds.
 */
export const EXAMPLE_BALANCE =
  annualWithholding(MAIN_JOB, "tft") + SECOND_JOB_WITHHELD - taxOn(MAIN_JOB + SECOND_JOB);
const balanceText = (b: number) =>
  b < 0 ? `you would owe about ${formatAUD(-b)} at tax time` : `you would get about ${formatAUD(b)} back at tax time`;

// A small second job: effective no-threshold withholding rate on $500 a fortnight.
const SMALL_FN = 500;
const SMALL_WITHHELD = withholdingForPeriod(SMALL_FN, "fortnightly", "noTft");

// Claiming the threshold at both of two $20,000 jobs.
export const BOTH_JOB = 20_000;
export const BOTH_TFT_WITHHELD = annualWithholding(BOTH_JOB, "tft") * 2;
export const BOTH_TFT_DEBT = taxOn(BOTH_JOB * 2) - BOTH_TFT_WITHHELD;

export const SECOND_JOB_FAQS: readonly FaqItem[] = [
  {
    q: "Why is my second job taxed more?",
    a: `It isn't taxed at a higher rate; more is withheld. You can claim the ${formatAUD(TAX_FREE_THRESHOLD)} tax-free threshold from only one employer, so your second employer withholds from the first dollar using the 'no tax-free threshold' scale, which starts at ${NO_TFT_START_RATE} in ${FY}. At tax time the ATO works out tax on your combined income: too much withheld comes back as a refund, too little becomes a bill.`,
  },
  {
    q: "Do you get taxed 50% on your second job?",
    a: `No. There is no 50% rate. With no tax-free threshold, ${formatAUD(SMALL_FN)} a fortnight has ${formatAUD(SMALL_WITHHELD)} withheld (${formatPercent(SMALL_WITHHELD / SMALL_FN)}), and a ${formatAUD(SECOND_JOB)} second job on top of a ${formatAUD(MAIN_JOB)} salary adds ${formatAUD(SECOND_JOB_ACTUAL_TAX)} in tax (${formatPercent(SECOND_JOB_ACTUAL_TAX / SECOND_JOB)}). Only if you give no tax file number does the employer withhold ${formatPercent(NO_TFN_RATES.resident, 0)}.`,
  },
  {
    q: "How much tax will I pay on a second job?",
    a: `Your second job's income is taxed at your marginal rate on combined income. On a ${formatAUD(MAIN_JOB)} main salary, a ${formatAUD(SECOND_JOB)} second job adds ${formatAUD(SECOND_JOB_ACTUAL_TAX)} to your tax for ${FY}. The second employer withholds only about ${formatAUD(SECOND_JOB_WITHHELD)} across the year, so ${balanceText(EXAMPLE_BALANCE)} unless you ask for extra to be withheld.`,
  },
  {
    q: "Is it worth getting a second job in Australia?",
    a: `Financially, you keep most of it. On top of a ${formatAUD(MAIN_JOB)} salary, a ${formatAUD(SECOND_JOB)} second job leaves ${formatAUD(SECOND_JOB_KEPT)} after tax and Medicare levy, and the second employer also pays ${SG} super on your ordinary earnings. Higher earners keep less of each extra dollar, and a HECS-HELP debt takes a further cut once combined income passes the repayment threshold.`,
  },
  {
    q: "Should I claim the tax-free threshold on my higher-paying job?",
    a: "Yes. Always claim the tax-free threshold on the job that pays more. This reduces withholding on your largest income source and minimises the chance of a tax debt at the end of the financial year.",
  },
  {
    q: "Will I get a tax refund from my second job?",
    a: `Not usually, unless both jobs are small. The 'no tax-free threshold' scale withholds as if the second job were your only income above the threshold, so when your main job already reaches a higher bracket it withholds too little. With a ${formatAUD(MAIN_JOB)} main job and a ${formatAUD(SECOND_JOB)} second job, ${balanceText(EXAMPLE_BALANCE)}. You can ask the second employer to withhold extra to avoid a bill.`,
  },
  {
    q: "Do I need to declare my second job to the ATO?",
    a: "Yes. All income from every employer must be reported on your tax return. Each employer reports your earnings to the ATO through Single Touch Payroll, so the ATO already has records of both jobs. You do not need to notify the ATO separately, but you must include both when you lodge.",
  },
  {
    q: "Will my employer know if I have a second job?",
    a: "Not through the tax system. Your second employer can tell from your TFN declaration that you are not claiming the tax-free threshold, but the ATO does not tell your main employer about your other job. Check your employment contract, though: some require you to disclose other work or avoid conflicts of interest.",
  },
  {
    q: "What happens if I claim the tax-free threshold on both jobs?",
    a: `Both employers withhold too little, and you usually get a tax bill when you lodge. With two ${formatAUD(BOTH_JOB)} jobs both claiming the threshold, only ${formatAUD(BOTH_TFT_WITHHELD)} is withheld all year, but tax and Medicare levy on ${formatAUD(BOTH_JOB * 2)} come to ${formatAUD(taxOn(BOTH_JOB * 2))}, leaving about ${formatAUD(BOTH_TFT_DEBT)} to pay.`,
  },
  {
    q: "Does my second employer pay superannuation?",
    a: `Yes. Both employers must pay the ${SG} Superannuation Guarantee on your ordinary time earnings, regardless of whether you claim the tax-free threshold with them.`,
  },
];
