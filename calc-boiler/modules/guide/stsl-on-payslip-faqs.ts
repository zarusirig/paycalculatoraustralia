// Shared FAQ copy for /stsl-on-payslip/ — rendered by the page's accordion and
// turned into FAQPage JSON-LD in app/stsl-on-payslip/page.tsx, so the
// structured data cannot drift from the page. The repayment threshold comes
// from HECS_HELP in lib/constants.

import { HECS_HELP, SITE_CONFIG, formatAUD } from "@/lib/constants";
import { STSL_NO_TFT, STSL_TFT } from "@/lib/constants/payg-withholding";
import type { FaqItem } from "@/lib/faq";

const THRESHOLD = formatAUD(HECS_HELP.minimumThreshold);
const FY = `FY${SITE_CONFIG.financialYear}`;
// Schedule 8 weekly earnings at which STSL withholding starts.
const WEEKLY_TFT = formatAUD(STSL_TFT[0].lessThan);
const WEEKLY_NO_TFT = formatAUD(STSL_NO_TFT[0].lessThan);

export const STSL_FAQS: readonly FaqItem[] = [
  {
    q: "What does STSL mean on a payslip?",
    a: `STSL stands for Study and Training Support Loans. It is the extra PAYG amount your employer withholds each pay cycle to cover the compulsory repayment of your HECS-HELP, FEE-HELP, VET Student Loan, or other government study loan. It only applies once your earnings pass the repayment threshold (${THRESHOLD} for ${FY}), or ${WEEKLY_NO_TFT} a week at a job where you do not claim the tax-free threshold.`,
  },
  {
    q: "Is STSL the same as HECS?",
    a: "Yes, if HECS-HELP is your only study loan. STSL (Study and Training Support Loans) is the ATO's umbrella term covering HECS-HELP, FEE-HELP, VET Student Loans, SA-HELP, and apprenticeship loans. If your only loan is HECS, the STSL line on your payslip is your HECS withholding.",
  },
  {
    q: "Why did STSL suddenly appear on my payslip?",
    a: `STSL usually appears because a pay rise, extra hours, or a bonus pushed your per-pay earnings above the repayment threshold (annualised ${THRESHOLD} for ${FY}), or because you updated your TFN declaration to declare a study loan.`,
  },
  {
    q: "What happens if too much STSL is withheld?",
    a: "The excess is refunded when you lodge your tax return. STSL withholding is a prepayment estimate. Your actual repayment is calculated on full-year repayment income at assessment, and any overpayment comes back as part of your refund.",
  },
  {
    q: "Does STSL withholding reduce my HELP debt straight away?",
    a: "No. Withheld STSL sits as a credit with the ATO until your tax return is assessed. Your loan balance (including 1 June indexation) is only reduced at assessment. Voluntary repayments are the only way to reduce the balance mid-year.",
  },
  {
    q: "How do I stop STSL deductions after paying off my HECS?",
    a: "Give your employer a withholding declaration (or update their payroll portal) stating you no longer have a study loan debt. The ATO does not notify employers automatically. Any extra STSL withheld in the meantime is refunded when you lodge your tax return.",
  },
  {
    q: "Why is no STSL withheld at my second job?",
    a: `STSL schedules apply per employer, and the starting point depends on the tax-free threshold. A job where you claim it withholds STSL from ${WEEKLY_TFT} a week. A second job, where you do not claim it, withholds from ${WEEKLY_NO_TFT} a week, as long as you declared your study loan to that employer. So your second job withholds no STSL if it pays you under ${WEEKLY_NO_TFT} a week or does not know about your loan. Your combined repayment income can still trigger a compulsory repayment at tax time. Budget for this or ask one employer to withhold extra.`,
  },
];
