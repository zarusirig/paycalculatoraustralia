// Shared FAQ copy for /pension-age-australia/ — read by the rendered accordion
// and the FAQPage JSON-LD. Figures come from lib/constants/pension-age.ts,
// where every source is cited (verified 23 Sep 2026).

import {
  AGE_PENSION_AGE,
  AGE_PENSION_AGE_SINCE,
  AGE_PENSION_CLAIM_WEEKS_EARLY,
  SUPER_ACCESS_AGE_WHILE_WORKING,
} from "@/lib/constants/pension-age";

export const PENSION_AGE_FAQS: readonly { q: string; a: string }[] = [
  {
    q: "What is the pension age in Australia?",
    a: `The Age Pension age is ${AGE_PENSION_AGE}. It has applied to everyone born on or after 1 January 1957 since ${AGE_PENSION_AGE_SINCE}, and Services Australia says there are no plans to change it. Reaching ${AGE_PENSION_AGE} doesn't guarantee a payment. You also have to meet the residence rules and the income and assets tests.`,
  },
  {
    q: "What is the retirement age in Australia?",
    a: `Australia has no compulsory retirement age for most workers. You can keep working as long as you like, and an employer generally can't make you retire because of your age under the Age Discrimination Act 2004. The two ages people usually mean are the Age Pension age (${AGE_PENSION_AGE}) and your super preservation age (60 for anyone born from 1 July 1964).`,
  },
  {
    q: "Is the pension age going up to 70?",
    // Proposed in the 2014 Budget; the Morrison government scrapped it on
    // 5 Sep 2018 (theguardian.com/business/2018/sep/05/...). Never legislated.
    a: `No. A rise to 70 was proposed in the 2014 Budget but never became law, and the government dropped it in September 2018. The Age Pension age is ${AGE_PENSION_AGE}, and Services Australia says there are no plans to change it.`,
  },
  {
    q: "What is the preservation age for super?",
    a: "Preservation age is the earliest age you can generally access your super, once you retire or start a transition to retirement income stream. It is 60 for anyone born on or after 1 July 1964. For people born before then it was between 55 and 59, depending on date of birth.",
  },
  {
    q: "Can I access my super at 60 if I'm still working?",
    a: `Once you reach preservation age, you can start a transition to retirement income stream while you keep working. From age 60, leaving a job counts as retirement under the super rules. From ${SUPER_ACCESS_AGE_WHILE_WORKING} you can access your super even if you are still working.`,
  },
  {
    q: "When can I apply for the Age Pension?",
    a: `You can lodge your claim up to ${AGE_PENSION_CLAIM_WEEKS_EARLY} weeks before you reach Age Pension age. If you already receive an eligible payment, Services Australia will write to you ${AGE_PENSION_CLAIM_WEEKS_EARLY} weeks before your pension age to explain how to transfer to the Age Pension.`,
  },
  {
    q: "Is pension age the same as preservation age?",
    a: `No. They are separate rules. Preservation age (60 for most people) controls access to your super. Age Pension age (${AGE_PENSION_AGE}) controls the government pension from Services Australia. Many people use their super to cover the years between the two.`,
  },
  {
    q: "Can I work and still get the Age Pension?",
    a: "Yes. Your earnings go through the pension income test, and the Work Bonus lets part of your employment income be ignored. Use our Age Pension income test calculator to see how your wages affect your fortnightly payment.",
  },
];
