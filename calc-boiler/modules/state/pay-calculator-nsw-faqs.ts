// Shared FAQ copy for /pay-calculator-nsw/ — rendered by the page's accordion
// and turned into FAQPage JSON-LD in app/pay-calculator-nsw/page.tsx.

import { STATE_PROFILES } from "@/lib/data/state-employee";
import type { FaqItem } from "@/lib/faq";
import { ABS_PERIOD, awoteLine } from "./state-faqs-shared";

const PROFILE = STATE_PROFILES.NSW;

export const NSW_FAQS: readonly FaqItem[] = [
  {
    q: "Is income tax different in NSW compared to other states?",
    a: "No. Income tax in Australia is levied by the federal government through the ATO. The tax brackets, Medicare levy, and HECS-HELP repayment rates are exactly the same in NSW as they are in Victoria, Queensland, Western Australia, or any other state and territory. There is no state-level income tax anywhere in Australia.",
  },
  {
    q: "What is the take-home pay on the average NSW salary?",
    a: `Full-time adults in NSW earn ${awoteLine(PROFILE)} (ABS, ${ABS_PERIOD}). The worked example above breaks that down to weekly, fortnightly and monthly net pay.`,
  },
  {
    q: "How many public holidays does NSW have?",
    a: "Thirteen state-wide public holidays in 2026, the fewest of any state or territory. NSW adds a day when Anzac Day and Boxing Day fall on a weekend but has no equivalent of Melbourne Cup Day, Canberra Day or the Royal Queensland Show. Regional show days are declared locally and sit outside the state-wide list.",
  },
  {
    q: "When do I get long service leave in NSW?",
    a: "After 10 years of continuous service with the same employer you are entitled to 8.67 weeks — two months — of paid leave under the Long Service Leave Act 1955, then 4.33 weeks for each further 5 years. Between 5 and 10 years a pro-rata payment is only owed in defined circumstances.",
  },
  {
    q: "Do employees pay payroll tax or workers compensation premiums?",
    a: "No. Both payroll tax and workers compensation (iCare in NSW) are employer expenses. These costs do not appear on your payslip and do not reduce your gross salary or take-home pay. Employers factor these on-costs into total hiring budgets, which indirectly influences salary offers.",
  },
  {
    q: "Do I pay the Medicare levy surcharge in NSW?",
    a: "The Medicare levy surcharge applies identically across all states. Untick \"I hold private hospital cover\" in the calculator above and it will add the surcharge at your income level so you can see the difference in dollars.",
  },
  {
    q: "How does HECS-HELP change my NSW take-home pay?",
    a: "HECS-HELP repayment thresholds are federal and identical in every state. Tick the HECS-HELP box in the calculator to see the repayment withheld at your salary and what your fortnightly pay drops to.",
  },
];
