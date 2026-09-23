import type { Faq } from "./t3-shared";

// Shared by the page body and the FAQPage JSON-LD. Every statement is sourced
// in lib/constants/time-in-lieu.ts (award clauses read 23 September 2026).

export const TIME_IN_LIEU_FAQS: Faq[] = [
  {
    q: "What is time in lieu?",
    a: "Time in lieu (TOIL, or time off in lieu) is paid time off you take instead of being paid for overtime. It isn't in the National Employment Standards. You only get it if your award, enterprise agreement or contract allows it and you and your employer agree to it.",
  },
  {
    q: "Is time in lieu hour for hour or time and a half?",
    a: "It depends on the award. The Clerks, Hospitality, Manufacturing, Security and SCHADS awards give one hour off for each overtime hour. The Retail, Fast Food and Pharmacy awards give time off equal to the overtime payment, so 2 hours at time and a half buys 3 hours off.",
  },
  {
    q: "Can my employer make me take time in lieu instead of overtime pay?",
    a: "No. Under every award clause we checked, TOIL needs an agreement between you and your employer, and the employer must not use undue influence or pressure. Without an agreement, overtime is paid at the overtime rate.",
  },
  {
    q: "Does time in lieu need to be in writing?",
    a: "The Clerks, Hospitality, Manufacturing, Security, SCHADS and Retail awards say the agreement must be in writing. The Clerks, Hospitality, Manufacturing, Security and SCHADS clauses also need a separate agreement for each pay period's overtime. An exchange of emails is enough. The Fast Food and Pharmacy clauses just say the parties may agree.",
  },
  {
    q: "What happens to time in lieu I don't use?",
    a: "If you don't take it within 6 months (3 months under the SCHADS award), your employer must pay it in the next pay period at the overtime rate for when you worked it. You can also ask to be paid out at any time, and it must be paid in the next pay period.",
  },
  {
    q: "Is time in lieu paid out when I leave?",
    a: "Yes. Under each award clause, TOIL you haven't taken when your job ends must be paid at the overtime rate that applied when you worked the overtime. It is part of your final pay.",
  },
  {
    q: "Do award-free employees get time in lieu?",
    a: "Only if their employment contract gives it. The Fair Work Ombudsman says award and agreement free employees are not entitled to a higher rate of pay for overtime under the Fair Work Act, so any overtime pay or TOIL for them comes from the contract.",
  },
];
