import { formatAUD } from "@/lib/constants";
import { DOMESTIC_TABLES, OVERTIME_MEAL_REASONABLE, PUBLISHED_DAILY_TOTALS, TD_2026_4 } from "@/lib/constants/travel-allowance";
import type { Faq } from "./t3-shared";

// Shared by the page body and the FAQPage JSON-LD. Figures come from
// TD 2026/4 via lib/constants/travel-allowance.ts; withholding rules from the
// ATO pages cited there (read 23 September 2026).

const SYD = PUBLISHED_DAILY_TOTALS[1].Sydney!;
const T1 = DOMESTIC_TABLES[1];

export const TRAVEL_ALLOWANCE_FAQS: Faq[] = [
  {
    q: "What is the ATO travel allowance rate for 2026-27?",
    a: `The ATO doesn't set a rate employers must pay. It publishes "reasonable amounts" in ${TD_2026_4.id}. For a salary of $153,210 or less, the daily amount is ${formatAUD(SYD, 2)} in Sydney (${formatAUD(T1.accommodation.Sydney)} accommodation, ${formatAUD(T1.meals.breakfast + T1.meals.lunch + T1.meals.dinner, 2)} meals and ${formatAUD(T1.incidentals, 2)} incidentals), and it varies by city and salary band.`,
  },
  {
    q: "Is a travel allowance taxed?",
    a: "Not up front if it's within the reasonable amount and the employer expects you to spend all of it on accommodation, food, drink or incidentals, records it separately, and it isn't for overseas accommodation. Above the reasonable amount, tax is withheld from the excess. The allowance is still income: if it's shown on your income statement you declare it and claim what you spent.",
  },
  {
    q: "What is the overtime meal allowance for 2026-27?",
    a: `The ATO's reasonable amount for an overtime meal in 2026-27 is ${formatAUD(OVERTIME_MEAL_REASONABLE)}. An award overtime meal allowance up to that amount isn't withheld from and isn't reported on your income statement.`,
  },
  {
    q: "Do I need receipts if I get a travel allowance?",
    a: "Not if you claim no more than the reasonable amount, you received and declared an allowance for that expense, and the expense is deductible. You still need to show how you worked out the claim, for example with a diary and bank records. Claim more than the reasonable amount and you must keep receipts for the whole claim, not just the excess.",
  },
  {
    q: "What are per diems in Australia?",
    a: "A per diem is a daily allowance for meals, incidentals and sometimes accommodation while travelling for work. In Australia it's usually called a travel allowance, and the ATO's reasonable amounts are the benchmark for how it's taxed.",
  },
  {
    q: "Is travel allowance paid for day trips?",
    a: "The travel allowance rules and reasonable amounts cover travel away from home overnight. An allowance for part-day travel with no overnight absence is taxed as ordinary income: it's included in your gross payments and tax is withheld.",
  },
];
