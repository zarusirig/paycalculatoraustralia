import type { Faq } from "./t3-shared";

// Shared by the page body and the FAQPage JSON-LD. Legal points are sourced
// in lib/constants/ote-salary.ts (ATO, FWC, FWO; read 24 September 2026).

export const OTE_SALARY_FAQS: Faq[] = [
  {
    q: "What does OTE mean in a salary?",
    a: "OTE means on-target earnings: your base salary plus the commission or bonus you would earn if you hit 100% of your sales target. A job advertised at $120,000 OTE with an $80,000 base pays $80,000 guaranteed and up to $40,000 more at target. It is not a guaranteed amount.",
  },
  {
    q: "Is OTE the same as salary?",
    a: "No. Your salary is the base, which you are paid regardless of results. OTE adds the variable pay you are expected to earn at 100% of target, so you can earn less than OTE in a bad year and more in a good one if commission is uncapped.",
  },
  {
    q: "What is a good OTE split?",
    a: "There is no legal standard. The split is simply base divided by OTE: $80,000 base on $120,000 OTE is 67:33. The higher the base share, the more of your pay is guaranteed and the more counts for things based on fixed earnings, like the Fair Work high income threshold.",
  },
  {
    q: "Is super paid on commission in Australia?",
    a: "Yes. The ATO lists commission payments as ordinary time earnings, so the 12% super guarantee applies to commission as well as base salary. From 1 July 2026 super is calculated on qualifying earnings, which also include commission for work done entirely outside ordinary hours.",
  },
  {
    q: "What does OTE mean for super?",
    a: "In super, OTE means ordinary time earnings: what you are paid for your ordinary hours of work, including commissions and shift loadings. It is a different term from on-target earnings, even though both are shortened to OTE.",
  },
  {
    q: "Does commission count towards the high income threshold?",
    a: "No. The Fair Work Commission says earnings for the $190,100 high income threshold exclude payments that can't be determined in advance, such as commissions, incentive payments and bonuses. Only your base and other guaranteed pay count.",
  },
  {
    q: "Can I be paid commission only?",
    a: "Only if your award or enterprise agreement allows commission-only pay. If no award or agreement covers you, you can be paid commission but must still receive at least the National Minimum Wage, according to the Fair Work Ombudsman.",
  },
];
