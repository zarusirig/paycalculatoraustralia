// FAQs for /pay-rates/. Shared by the page (accordion) and the route (FAQPage
// JSON-LD) so the markup cannot drift from the visible answers. Any dollar
// figure is computed from the employer data, never typed in.

import { formatAUD } from "@/lib/constants";
import { EMPLOYERS, entryRate } from "@/lib/data/employer-pay";

const money = (v: number) => formatAUD(v, 2);

const sorted = [...EMPLOYERS].sort((a, b) => entryRate(b).hourly - entryRate(a).hourly);
const highest = sorted[0];
const lowest = sorted[sorted.length - 1];
const awardCovered = EMPLOYERS.filter((e) => e.instrument.kind === "modern-award").map((e) => e.name);

export const PAY_RATES_HUB_FAQS: { q: string; a: string }[] = [
  {
    q: "Which of these employers pays the most per hour?",
    a: `At entry level for an adult, ${highest.name} pays the most of the employers we cover: ${money(entryRate(highest).hourly)} an hour at ${entryRate(highest).level}. The lowest entry-level adult rate is ${lowest.name} at ${money(entryRate(lowest).hourly)}. Weekend and evening penalty rates, which differ between agreements, can change which job pays more for the hours you actually work.`,
  },
  {
    q: "Why do fast food jobs pay less than supermarket jobs?",
    a: `${awardCovered.length > 0 ? `${awardCovered.join(" and ")} staff are paid under a modern award rather than their own enterprise agreement. ` : ""}Awards set a minimum, and each industry's award has its own rates and junior percentages. Supermarket agreements are bargained separately and must leave staff better off overall than the award.`,
  },
  {
    q: "Do these rates include superannuation?",
    a: "No. Hourly rates are before tax and exclude super. Your employer pays the superannuation guarantee on top of your ordinary time earnings.",
  },
  {
    q: "How do I know which level I am on?",
    a: "Your level (or classification) is printed on your payslip or employment contract. Match it to the table on your employer's page. If it is missing, ask your manager or payroll, or contact the Fair Work Ombudsman on 13 13 94.",
  },
];
