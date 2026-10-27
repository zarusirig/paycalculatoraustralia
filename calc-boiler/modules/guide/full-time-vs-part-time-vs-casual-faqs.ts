// Shared FAQ copy for /full-time-vs-part-time-vs-casual/ — rendered by the
// page's accordion and turned into FAQPage JSON-LD in the page file, so the
// structured data cannot drift from the page. Rates come from lib/constants.

import { EMPLOYMENT, SITE_CONFIG, SUPER_GUARANTEE, formatPercent } from "@/lib/constants";
import type { FaqItem } from "@/lib/faq";

const LOADING = formatPercent(EMPLOYMENT.casualLoading, 0);
const HOURS = EMPLOYMENT.standardWeeklyHours;

export const EMPLOYMENT_TYPE_GUIDE_FAQS: readonly FaqItem[] = [
  {
    q: `What exactly does the ${LOADING} casual loading cover?`,
    a: `The ${LOADING} casual loading compensates for the absence of paid annual leave (${EMPLOYMENT.annualLeaveWeeks} weeks), paid personal leave (${EMPLOYMENT.personalLeaveDays} days), notice of termination, and redundancy pay. It is calculated on the base rate of pay under the applicable Award or agreement. Some awards specify a different loading percentage.`,
  },
  {
    q: "When can a casual employee become permanent?",
    a: "Since 26 August 2024, casual conversion works through the \"employee choice\" pathway. A casual who has worked for at least 6 months (12 months with a small business employer of fewer than 15 employees) and believes they no longer meet the definition of a casual employee can notify their employer in writing that they want to change to full-time or part-time employment. The employer must respond in writing within 21 days and can refuse only on limited grounds. Employers are no longer required to offer conversion themselves.",
  },
  {
    q: "What are the standard hours for full-time work?",
    a: `Full-time employees work ${HOURS} ordinary hours per week under the National Employment Standards. Some awards and enterprise agreements average these hours over a longer work cycle (for example, ${HOURS * 2} hours per fortnight).`,
  },
  {
    q: "Do part-time employees get the same leave as full-time?",
    a: `Part-time employees receive the same types of leave but calculated on a pro-rata basis. For example, a part-time employee working 20 hours per week accrues annual leave at 20/${HOURS} of the full-time rate. The same principle applies to personal/carer's leave, compassionate leave, and long-service leave.`,
  },
  {
    q: "Do casual employees get superannuation?",
    a: `Yes. Since 1 July 2022, all employees, including casuals, receive the ${formatPercent(SUPER_GUARANTEE.rate, 0)} Super Guarantee (FY${SITE_CONFIG.financialYear}) regardless of how much they earn per month. The previous $450/month minimum earnings threshold was removed.`,
  },
  {
    q: "Is casual or part-time better financially?",
    a: `Casual employees earn the ${LOADING} casual loading but give up paid leave worth roughly 10 to 15% of salary when the leave is taken. For ongoing regular work, part-time employment typically gives better overall value once paid leave, notice period and redundancy protections are counted. For short-term or irregular work, the casual loading can pay more. Enter your base hourly rate and weekly hours in the Employment Type Calculator to compare full-time, part-time and casual pay side by side.`,
    links: { "Employment Type Calculator": "/employment-type-calculator/" },
  },
  {
    q: "Can a casual employee be fired without notice?",
    a: "Casual employment can end without notice from either party, because a casual has no firm advance commitment to ongoing work. However, a casual employed on a regular and systematic basis for at least 6 months (12 months with a small business) who reasonably expected that work to continue may be protected by unfair dismissal laws. The employer cannot simply stop offering shifts to avoid providing notice or redundancy pay if the worker has conversion rights.",
  },
];
