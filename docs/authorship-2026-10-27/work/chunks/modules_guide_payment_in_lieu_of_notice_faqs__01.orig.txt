import type { Faq } from "./t3-shared";

// Shared by the page body and the FAQPage JSON-LD. Every statement is sourced
// in lib/constants/notice-pilon.ts (Fair Work Ombudsman "Dismissal", content
// last updated 28 August 2026; ATO ETP and qualifying earnings pages, read 5
// October 2026).

export const PILON_FAQS: Faq[] = [
  {
    q: "What is payment in lieu of notice?",
    a: "Payment in lieu of notice (PILON) is what an employer pays when it ends your employment on the day it gives notice, instead of making you work out the notice period. You are paid what you would have been paid if you had worked until the end of the notice period. Your employment ends on your last working day and you stop accruing leave.",
  },
  {
    q: "How much notice must an employer give in Australia?",
    a: "Under the National Employment Standards: 1 week if you have 1 year of continuous service or less; 2 weeks for more than 1 year and up to 3 years; 3 weeks for more than 3 years and up to 5 years; and 4 weeks for more than 5 years. Employees over 45 with at least 2 years of continuous service get an extra week. An award, agreement or contract can require longer notice.",
  },
  {
    q: "What must a payment in lieu of notice include?",
    a: "It must equal the full amount you would have been paid if you had worked the notice period. That includes incentive-based payments and bonuses, loadings, monetary allowances, overtime, penalty rates and any other separately identifiable amounts you would normally have earned, not just base pay.",
  },
  {
    q: "How is payment in lieu of notice taxed?",
    a: "The ATO treats a payment in lieu of notice as a non-excluded employment termination payment (ETP). It is taxed at a concessional rate up to the smaller of the ETP cap and the whole-of-income cap ($180,000, reduced by your other taxable income in the year): 17% if you have reached preservation age and 32% if you have not, including the Medicare levy. Amounts above the cap are taxed at the top rate of 45% plus 2% Medicare levy.",
  },
  {
    q: "Is super paid on a payment in lieu of notice?",
    a: "Yes. The ATO treats a payment in lieu of notice, for all termination reasons, as ordinary time earnings and qualifying earnings, so the employer must pay super guarantee on it. The ATO's own example is $10,000 in lieu of notice with 12% super of $1,200. Unused annual leave and long service leave on termination, by contrast, do not attract super.",
  },
  {
    q: "Is payment in lieu of notice the same as redundancy pay?",
    a: "No. Notice, or payment in lieu of it, is separate from redundancy pay. A redundancy payment under the NES is based on years of service and is paid in addition to notice. Final pay also includes any unused annual leave and, in some cases, long service leave. See the final pay and redundancy pay calculators for the whole entitlement.",
  },
  {
    q: "Can I choose to leave early during my notice period?",
    a: "If you have been dismissed, your employer can agree to shorten the notice period. If you cannot agree, you can choose to resign and give your own minimum notice instead. Any time you have already worked in the notice period does not count towards the notice you would owe as a resigning employee.",
  },
  {
    q: "Do casual employees get notice or payment in lieu?",
    a: "Not under the NES in the same way. Certain employees, including casuals, are not entitled to written notice of termination under the National Employment Standards, and time worked as a casual usually does not count towards continuous service for notice. Employees dismissed for serious misconduct are also not entitled to notice. Check your award or agreement.",
  },
  {
    q: "Does the over-45 extra week change the amount?",
    a: "Yes. An employee who is over 45 years old and has at least 2 years of continuous service gets one more week of notice, so a payment in lieu includes that week as well. For example, 6 years of service is 4 weeks, but over 45 it is 5 weeks.",
  },
];
