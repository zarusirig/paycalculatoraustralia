import type { Faq } from "./t3-shared";

// Shared by the page body and the FAQPage JSON-LD. Medians are the Jobs and
// Skills Australia occupation-profile figures (ABS Survey of Employee Earnings
// and Hours, May 2025) read for each page in lib/data/job-pay-rates/.

export const HIGHEST_PAYING_FAQS: Faq[] = [
  {
    q: "What does the median weekly pay in this ranking mean?",
    a: "It is the middle weekly pay for full-time, non-managerial adult employees in that occupation before tax and salary sacrifice, from the ABS Survey of Employee Earnings and Hours (May 2025), published by Jobs and Skills Australia. Half the people in the occupation earn more and half earn less. It is what employers actually pay, so it is a market figure, not a legal minimum.",
  },
  {
    q: "Is this a ranking of every job in Australia?",
    a: "No. It ranks only the occupations that have a pay-rate page on this site and a published median. Jobs we do not cover, such as most managers, executives and many professionals, are not in it, so a job missing from the list is not necessarily lower paid.",
  },
  {
    q: "Why is the take-home pay so much lower than the median?",
    a: "The median is a before-tax figure. The take-home column applies the 2026-27 resident tax rates, the low income tax offset and the Medicare levy to the median weekly pay multiplied by 52. It assumes no HELP debt and private hospital cover. Higher medians lose a larger share to tax because of the progressive rates.",
  },
  {
    q: "How is the median different from the award minimum wage for the job?",
    a: "The award minimum is the lowest rate an employer can lawfully pay for a classification; the median is what full-time workers in the occupation actually earn, which includes enterprise agreements, above-award pay and higher classifications. Each occupation page shows both side by side.",
  },
  {
    q: "Why do some jobs show the same median?",
    a: "Where several jobs on this site fall into the same ANZSCO occupation group, for example radiographers and sonographers, Jobs and Skills Australia publishes one median for the group. Those rows are marked as sharing a median.",
  },
  {
    q: "How can I see what my own pay comes to after tax?",
    a: "Use the take-home pay calculator for an annual salary, or the net pay calculator to start from your hourly rate and hours. The marginal tax rates page shows how much of a raise or bonus you keep.",
  },
];
