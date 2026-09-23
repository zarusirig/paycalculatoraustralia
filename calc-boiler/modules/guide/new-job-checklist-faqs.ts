// Shared FAQ copy for /new-job-checklist/ — rendered by the page's accordion
// and turned into FAQPage JSON-LD in app/new-job-checklist/page.tsx, so the
// structured data cannot drift from the page. Thresholds come from lib/constants.

import { formatAUD, HECS_HELP, SITE_CONFIG } from "@/lib/constants";
import type { FaqItem } from "@/lib/faq";

export const NEW_JOB_FAQS: readonly FaqItem[] = [
  {
    q: "What paperwork do I need for a new job?",
    a: "You need to complete a TFN declaration, choose a super fund (or provide your existing fund details), and provide your bank account details for salary payments.",
  },
  {
    q: "Should I claim the tax-free threshold at my new job?",
    a: "If this is your only job, always claim the tax-free threshold. If you are transitioning from one job to another with no overlap, claim it at your new employer and your old employer's withholding stops when you leave. If you are keeping two jobs simultaneously, only claim the threshold at the highest-paying one.",
  },
  {
    q: "Should I use my existing super fund or the employer's default?",
    a: "In most cases, use your existing fund to avoid creating multiple accounts that erode your balance with duplicate fees and insurance premiums. Provide your fund's name, USI (Unique Superannuation Identifier), and member number to your new employer. Compare fees before switching — if the employer's default fund has significantly lower fees, it may be worth switching.",
  },
  {
    q: "How long until I receive my first pay?",
    a: "This depends on when you start relative to the pay cycle. If you start on Monday and the pay cycle ends Friday, your first pay arrives the following pay day. In the worst case, you may wait up to 3-4 weeks for your first pay if you start just after a pay cycle ends and the employer processes the next full cycle before paying you.",
  },
  {
    q: "What happens to unused leave from my old job?",
    a: "Unused annual leave must be paid out by your old employer in your final pay. Long service leave payout depends on your state and how long you worked there. These payouts are taxable income. Sick/personal leave is not paid out — it has no cash value when you leave.",
  },
  {
    q: "Does probation affect my pay or entitlements?",
    a: "No. During probation you receive the same pay, super, and leave entitlements as after probation. The only difference is that the notice period for termination is typically shorter (usually 1 week). Your employer cannot pay you less during probation than what is specified in your contract or the applicable award.",
  },
  {
    q: "Do I need to tell my new employer about HECS-HELP debt?",
    a: `Yes. On your TFN Declaration, tick "Yes" if you have a HELP, VSL, SFSS, or TSL debt. Your employer withholds additional amounts once your income exceeds the compulsory repayment threshold (${formatAUD(HECS_HELP.minimumThreshold)} for FY${SITE_CONFIG.financialYear}). If you do not declare your debt, you may face a lump sum repayment when you lodge your tax return.`,
  },
];
