// Shared FAQ copy for /stsl-on-payslip/ — rendered by the page's accordion and
// turned into FAQPage JSON-LD in app/stsl-on-payslip/page.tsx, so the
// structured data cannot drift from the page. The repayment threshold comes
// from HECS_HELP in lib/constants.

import { HECS_HELP, SITE_CONFIG, formatAUD } from "@/lib/constants";
import type { FaqItem } from "@/lib/faq";

const THRESHOLD = formatAUD(HECS_HELP.minimumThreshold);
const FY = `FY${SITE_CONFIG.financialYear}`;

export const STSL_FAQS: readonly FaqItem[] = [
  {
    q: "What does STSL mean on a payslip?",
    a: `STSL stands for Study and Training Support Loans. It is the extra PAYG amount your employer withholds each pay cycle to cover the compulsory repayment of your HECS-HELP, FEE-HELP, VET Student Loan, or other government study loan. It only applies once your earnings pass the repayment threshold (${THRESHOLD} for ${FY}).`,
  },
  {
    q: "Is STSL the same as HECS?",
    a: "Effectively yes for most people. STSL (Study and Training Support Loans) is the ATO's umbrella term covering HECS-HELP, FEE-HELP, VET Student Loans, SA-HELP, and apprenticeship loans. If your only loan is HECS, the STSL line on your payslip is your HECS withholding.",
  },
  {
    q: "Why did STSL suddenly appear on my payslip?",
    a: `Usually because a pay rise, extra hours, or a bonus pushed your per-pay earnings above the repayment threshold (annualised ${THRESHOLD} for ${FY}), or because you updated your TFN declaration to declare a study loan.`,
  },
  {
    q: "What happens if too much STSL is withheld?",
    a: "The excess is refunded when you lodge your tax return. STSL withholding is a prepayment estimate — your actual repayment is calculated on full-year repayment income at assessment, and any overpayment comes back as part of your refund.",
  },
  {
    q: "Does STSL withholding reduce my HELP debt straight away?",
    a: "No. Withheld STSL sits as a credit with the ATO until your tax return is assessed. Your loan balance — including 1 June indexation — is only reduced at assessment. Voluntary repayments are the only way to reduce the balance mid-year.",
  },
  {
    q: "How do I stop STSL deductions after paying off my HECS?",
    a: "Give your employer a withholding declaration (or update their payroll portal) stating you no longer have a study loan debt. The ATO does not notify employers automatically. Any extra STSL withheld in the meantime is refunded when you lodge your tax return.",
  },
  {
    q: "Why is no STSL withheld at my second job?",
    a: "STSL schedules apply per employer. If each job individually pays under the threshold, neither withholds STSL — but your combined repayment income may still trigger a compulsory repayment at tax time. Budget for this or ask one employer to withhold extra.",
  },
];
