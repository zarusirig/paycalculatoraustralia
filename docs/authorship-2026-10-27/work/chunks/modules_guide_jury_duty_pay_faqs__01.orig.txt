import type { Faq } from "./t3-shared";

// Shared by the page body and the FAQPage JSON-LD. Sources in
// lib/constants/jury-duty.ts (Fair Work Ombudsman, read 24 September 2026).

export const JURY_DUTY_PAY_FAQS: Faq[] = [
  {
    q: "Does my employer have to pay me for jury duty in Australia?",
    a: "If you are full-time or part-time, yes, for the first 10 days you are absent from work because of jury duty. Your employer pays your base pay for the ordinary hours you would have worked, or only the difference between that and the court payment (make-up pay) if they ask for, and you give, evidence of what the court pays.",
  },
  {
    q: "What is jury duty make-up pay?",
    a: "The difference between your base pay for the ordinary hours you would have worked and the jury payment from the court, not counting expense allowances. In the Fair Work Ombudsman's example, a $300-a-day employee paid $90 a day by the court gets $210 a day from their employer for the first 10 days.",
  },
  {
    q: "Do casuals get paid for jury duty?",
    a: "Not by their employer under the National Employment Standards. Casuals can still take the leave, and may be paid under their award, enterprise agreement, contract or their state or territory's jury laws, as well as by the court.",
  },
  {
    q: "What happens after 10 days of jury duty?",
    a: "The NES requirement for employer pay ends after the first 10 days you are absent from work. You can still take the leave for the whole trial and the court keeps paying its daily amount. Your award, agreement, contract or state law may require your employer to keep paying.",
  },
  {
    q: "Is jury duty a type of leave?",
    a: "Yes. Jury duty, including jury selection and reasonable travel and rest time, is community service leave under the National Employment Standards. All employees, including casuals, can take it. You must tell your employer as soon as possible and give evidence of attendance if asked.",
  },
];
