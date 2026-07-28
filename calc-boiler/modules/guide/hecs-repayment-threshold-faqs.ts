// Shared FAQ copy for /hecs-repayment-threshold/.
//
// Read by both the rendered accordion and the FAQPage JSON-LD so the structured
// data cannot drift from the visible page. Every figure is derived from
// HECS_HELP in lib/constants — never hardcode a threshold here.

import { HECS_HELP, calculateHECS, formatAUD } from "@/lib/constants";

const T = HECS_HELP.minimumThreshold;
const B2 = HECS_HELP.bands[2];
const B3 = HECS_HELP.bands[3];

export interface ThresholdFaq {
  q: string;
  a: string;
}

export const HECS_THRESHOLD_FAQS: readonly ThresholdFaq[] = [
  {
    q: "What is the HECS repayment threshold for 2026-27?",
    a: `${formatAUD(T)}. Repayment income at or below ${formatAUD(T)} attracts no compulsory repayment. Above it you repay 15c for each $1 over ${formatAUD(T)}, rising to ${formatAUD(B2.base)} plus 17c per $1 over ${formatAUD(B2.min - 1)}, then ${B3.marginalRate * 100}% of total repayment income from ${formatAUD(B3.min)}.`,
  },
  {
    q: "Is the threshold based on my salary?",
    a: `No — on repayment income, which is wider. It adds reportable fringe benefits, net investment loss, reportable super contributions and exempt foreign employment income to your taxable income, so salary sacrificing does not push you under it.`,
  },
  {
    q: "Which loans use this threshold?",
    a: `All of them. One set of thresholds and rates covers HELP (including HECS-HELP and FEE-HELP), VET Student Loans, SFSS, Student Start-up Loans, ABSTUDY SSL and the Australian Apprenticeship Support Loan.`,
  },
  {
    q: "How much do I repay just over the threshold?",
    a: `Very little. At ${formatAUD(75_000)} the repayment is ${formatAUD(calculateHECS(75_000))} for the year. The marginal system charges 15c only on income above ${formatAUD(T)}, so crossing the line no longer triggers a repayment on your whole income.`,
  },
];
