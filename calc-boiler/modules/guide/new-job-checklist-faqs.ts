// Shared FAQ copy for /new-job-checklist/ — rendered by the page's accordion
// and turned into FAQPage JSON-LD in app/new-job-checklist/page.tsx, so the
// structured data cannot drift from the page. Thresholds come from lib/constants.

import { formatAUD, HECS_HELP, SITE_CONFIG } from "@/lib/constants";
import { NES_NOTICE_BANDS } from "@/lib/constants/notice-pilon";
import type { FaqItem } from "@/lib/faq";

export const NEW_JOB_FAQS: readonly FaqItem[] = [
  {
    q: "What paperwork do I need for a new job?",
    a: "You need to complete a TFN declaration, choose a super fund (or provide your existing fund details), and provide your bank account details for salary payments.",
  },
  {
    q: "Should I claim the tax-free threshold at my new job?",
    a: "If this is your only job, claim the tax-free threshold. If you are moving from one job to another with no overlap, claim it at your new employer and your old employer's withholding stops when you leave. If you are keeping two jobs at the same time, only claim the threshold at the highest-paying one.",
  },
  {
    q: "Should I use my existing super fund or the employer's default?",
    a: "If you are eligible to choose your super fund, your employer must give you a Superannuation standard choice form within 28 days of your start date. To keep your existing fund, fill it in with your fund's name, USI (Unique Superannuation Identifier) and member number. If you do not choose a fund, your employer must pay your super into your stapled super fund (an existing account that follows you from job to job), which it looks up with the ATO. Only if the ATO says you have no stapled fund can your employer use its default fund. Each extra account charges its own fees and insurance premiums, so compare fees and insurance before you switch.",
  },
  {
    q: "How long until I receive my first pay?",
    a: "Your first pay date depends on where your start date falls in your employer's pay cycle. If you start on a Monday and the pay cycle ends that Friday, your first pay arrives on the following pay day.",
  },
  {
    q: "What happens to unused leave from my old job?",
    a: "Unused annual leave must be paid out by your old employer in your final pay. Long service leave payout depends on your state and how long you worked there. These payouts are taxable income. Unused sick/personal leave is not paid out when you leave.",
  },
  {
    q: "Does probation affect my pay or entitlements?",
    a: `No. During probation you receive the same pay, super, and leave entitlements as after probation. Probation does not set your notice period: under the National Employment Standards it depends on how long you have worked for the employer, and it is at least ${NES_NOTICE_BANDS[0].weeks} week if you have worked there for 1 year or less. Time served also decides unfair dismissal: you can apply only after 6 months with the employer, or 12 months if it is a small business with fewer than 15 employees. Your employer cannot pay you less during probation than what is specified in your contract or the applicable award.`,
  },
  {
    q: "Do I need to tell my new employer about HECS-HELP debt?",
    a: `Yes. On your TFN Declaration, tick "Yes" at Question 10 if you have a Higher Education Loan Program (HELP), VET Student Loan (VSL), Financial Supplement (FS), Student Start-up Loan (SSL) or Australian Apprenticeship Support Loan (AASL, formerly Trade Support Loan) debt. Your employer withholds additional amounts once your income exceeds the compulsory repayment threshold (${formatAUD(HECS_HELP.minimumThreshold)} for FY${SITE_CONFIG.financialYear}). If you do not declare your debt, you may face a lump sum repayment when you lodge your tax return.`,
  },
];
