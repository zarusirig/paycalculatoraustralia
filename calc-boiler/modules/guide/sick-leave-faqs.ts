import type { Faq } from "./t3-shared";

// Shared by the page body and the FAQPage JSON-LD. Every statement is sourced
// in lib/constants/sick-leave.ts (fairwork.gov.au, read 24 September 2026).

export const SICK_LEAVE_FAQS: Faq[] = [
  {
    q: "How much sick leave do you get in Australia?",
    a: "Full-time employees get 10 days of paid sick and carer's leave a year under the National Employment Standards. Part-time employees get the same pro rata. It is calculated as 1/26 of your ordinary hours, so a 38-hour week earns 76 hours a year and a 19-hour week earns 38 hours.",
  },
  {
    q: "Is carer's leave separate from sick leave?",
    a: "No. Sick leave and carer's leave are one entitlement, called personal/carer's leave. Carer's leave to look after an immediate family or household member who is sick, injured or has an unexpected emergency comes out of the same balance as your own sick days.",
  },
  {
    q: "Do casual employees get sick leave?",
    a: "Not paid sick leave. All employees except casuals are entitled to paid sick and carer's leave. Casuals can take 2 days of unpaid carer's leave each time a family or household member needs care, and unpaid compassionate leave.",
  },
  {
    q: "Does sick leave roll over each year?",
    a: "Yes. Paid sick and carer's leave accumulates from your first day of work and any balance at the end of each year carries over to the next.",
  },
  {
    q: "Is sick leave paid out when you leave a job?",
    a: "No. The Fair Work Ombudsman says sick and carer's leave isn't paid out when employment ends, unlike annual leave. It can only be cashed out during employment under the Timber or Stevedoring award or an agreement that allows it, and you must keep at least 15 days.",
  },
  {
    q: "How much are you paid for a sick day?",
    a: "At least your base pay rate for the ordinary hours you would have worked that day. Penalty rates, loadings, allowances, bonuses and overtime are not included, so a sick day on a Sunday shift is paid at your base rate, not the Sunday rate.",
  },
  {
    q: "Can my employer ask for a medical certificate for one day off?",
    a: "Yes. An employer can ask for evidence for as little as 1 day or less off work. The evidence has to convince a reasonable person you were genuinely entitled to the leave, and a statutory declaration can be acceptable. Your award or agreement may set specific rules.",
  },
  {
    q: "Does sick leave accrue while on annual leave or unpaid leave?",
    a: "It keeps accruing while you are on paid leave, including annual leave, sick leave, long service leave and community service leave such as jury duty. It does not accrue during unpaid leave, such as unpaid parental leave or unpaid sick or carer's leave.",
  },
];
