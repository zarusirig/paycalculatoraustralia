// Shared FAQ copy for /final-pay-calculator/ — rendered by the calculator's
// accordion and turned into FAQPage JSON-LD in the page file, so the structured
// data cannot drift from the page. Rates come from lib/constants.

import { SUPER_GUARANTEE, formatPercent } from "@/lib/constants";
import { COMMON_LEAVE_LOADING } from "@/lib/constants/leave-loading";
import type { FaqItem } from "@/lib/faq";

export const FINAL_PAY_FAQS: readonly FaqItem[] = [
  {
    q: "When must my employer pay my final pay?",
    a: "Most awards require final pay within 7 days after your last day of employment. Check your award or enterprise agreement; if it has no rule, the Fair Work Act requires pay at least monthly, and payment in lieu of notice has its own timing rules. Final pay includes outstanding wages, accrued leave, and any notice period pay.",
  },
  {
    q: "Is leave loading included in my final pay?",
    a: `Yes, if you would have received annual leave loading (typically ${formatPercent(COMMON_LEAVE_LOADING)}) when taking leave during employment, it must be paid on your unused annual leave balance when employment ends — the Fair Work Ombudsman says this applies even where the award, agreement or contract says it is not payable on termination.`,
  },
  {
    q: "Do I get long service leave in my final pay?",
    a: "Long service leave entitlements vary by state. In most states, you become eligible after 7-10 years of continuous service with the same employer. Some states provide a pro-rata entitlement if you are terminated after 5-7 years. Use the Leave Calculator to estimate your balance.",
    links: { "Leave Calculator": "/leave-calculator/" },
  },
  {
    q: "How is my final pay taxed?",
    a: "Outstanding wages and notice pay are taxed at your normal marginal rate. Unused annual leave accrued after 17 August 1993 is taxed at your marginal rate; leave accrued before 18 August 1993, or paid because of a genuine redundancy, is taxed at a maximum of 32%. Long service leave has concessional treatment for pre-1978 accrual. Genuine redundancy pay receives a tax-free component.",
  },
  {
    q: "Does my employer pay super on my final pay?",
    a: `Employers must pay the ${formatPercent(SUPER_GUARANTEE.rate, 0)} SG on ordinary time earnings up to your last day, and on any payment in lieu of notice — the ATO treats it as ordinary time earnings for every termination reason. Super is not payable on unused leave payouts (including leave loading) or genuine redundancy payments. Use the Superannuation Calculator to verify.`,
    links: { "Superannuation Calculator": "/superannuation-calculator/" },
  },
  {
    q: "What if my employer does not pay my final entitlements?",
    a: "Contact the Fair Work Ombudsman on 13 13 94 or lodge a complaint online at fairwork.gov.au. The FWO can investigate, mediate, and take legal action against employers who fail to pay final entitlements. You have 6 years from the date of underpayment to make a claim.",
  },
];
