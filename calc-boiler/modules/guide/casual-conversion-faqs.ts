import type { Faq } from "./t3-shared";

// Shared by the page body and the FAQPage JSON-LD. Every statement is sourced
// in lib/constants/casual-conversion.ts (Fair Work Ombudsman "Becoming a
// permanent employee", content last updated 7 August 2026; "Casual employees").

export const CASUAL_CONVERSION_FAQS: Faq[] = [
  {
    q: "How do I convert from casual to permanent in Australia?",
    a: "You give your employer written notice under the employee choice pathway. You can do this if you have been employed for at least 6 months (12 months if your employer is a small business) and you believe you no longer meet the definition of a casual employee. You can also change to permanent at any time if you and your employer agree.",
  },
  {
    q: "How long does my employer have to respond?",
    a: "The employer must consult with you first, then respond in writing within 21 days of receiving your notice, either accepting the change or not accepting it. If accepted, the response must say whether you will be full-time or part-time, your new hours, and when the change takes effect.",
  },
  {
    q: "Can my employer refuse to make me permanent?",
    a: "Only for limited reasons, and they must give the reasons in writing: you still meet the definition of a casual employee; there are fair and reasonable operational grounds, such as substantial changes needed to how work is organised or significant impacts on the business; or accepting would mean not complying with a legally required recruitment or selection process.",
  },
  {
    q: "When does the change to permanent take effect?",
    a: "From the first day of your first full pay period starting after your employer gives their response, unless you and your employer agree another day.",
  },
  {
    q: "What am I no longer paid when I become permanent?",
    a: "Your casual loading, usually 25% on top of the base rate, stops. In return you get paid annual leave, paid sick and carer's leave, paid public holidays when you would have worked, and notice and redundancy entitlements, subject to your award or agreement.",
  },
  {
    q: "Is a regular roster enough to make me permanent?",
    a: "No. A regular pattern of work on its own does not make an employee permanent. A casual employee is one with no firm advance commitment to ongoing work, who is also paid a casual loading or casual rate. Whether there is a firm advance commitment depends on the real substance of the arrangement, including whether you can accept or reject shifts and whether permanent staff do the same work.",
  },
  {
    q: "Can I be sacked or have my hours cut for asking?",
    a: "No. An employer cannot reduce or vary your hours, change your pattern of work or terminate your employment to avoid your right to change to permanent employment. Casuals are also protected against adverse action for giving notice, receiving a written response or taking part in a dispute.",
  },
  {
    q: "Is it better to stay casual or become permanent?",
    a: "It depends on how many weeks you are paid in a year. With a 25% loading, a full-time casual needs to be paid for about 41.6 weeks of the year to earn as much as a permanent employee on the same base rate who is paid for all 52 weeks, including leave. If you work steady hours all year, permanent usually gives you more security for similar pay; if you take unpaid time off or your hours vary, casual loading can pay more.",
  },
  {
    q: "I started casual before August 2024. Does that count?",
    a: "Employment before 26 August 2024 is not counted when working out whether you meet the 6 or 12 month requirement under the employee choice pathway. Different pathways applied to some casuals up to 26 August 2025; the Fair Work Ombudsman explains the transitional rules.",
  },
];
