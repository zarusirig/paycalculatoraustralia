// Shared FAQ copy for /pay-calculator-tas/ — rendered by the page's accordion
// and turned into FAQPage JSON-LD in app/pay-calculator-tas/page.tsx.

import { STATE_PAYROLL_TAX, formatAUD } from "@/lib/constants";
import { STATE_PROFILES } from "@/lib/data/state-employee";
import type { FaqItem } from "@/lib/faq";
import { ABS_PERIOD, awoteLine } from "./state-faqs-shared";

const PROFILE = STATE_PROFILES.TAS;

export const TAS_FAQS: readonly FaqItem[] = [
  {
    q: "Is income tax different in Tasmania?",
    a: "No. Income tax, the Medicare levy and HECS-HELP repayment thresholds are set federally by the ATO and are identical in Tasmania, on the mainland, and in both territories. There is no Tasmanian income tax.",
  },
  {
    q: "What is the take-home pay on the average Tasmanian salary?",
    a: `Full-time adults in Tasmania earn ${awoteLine(PROFILE)} (ABS, ${ABS_PERIOD}) — the lowest of any state or territory. The worked example above shows the net result per week, fortnight and month.`,
  },
  {
    q: "Do I get Royal Hobart Regatta or Recreation Day?",
    a: "One or the other, depending on where in Tasmania you work. The Regatta in February is observed in certain areas including Hobart; the areas that do not observe it get Recreation Day in early November instead. Both are Tasmanian-only public holidays.",
  },
  {
    q: "What is Eight Hours Day?",
    a: "Eight Hours Day, held on the second Monday in March, is Tasmania's version of Labour Day. It commemorates the campaign for the eight-hour working day. It attracts the same public holiday entitlements as any other gazetted holiday.",
  },
  {
    q: "When do I get long service leave in Tasmania?",
    a: "Private sector employees get 8⅔ weeks after 10 years of continuous employment under the Long Service Leave Act 1976, then 4⅓ weeks every further 5 years. A pro-rata payment may be owed on termination once you have completed 7 but fewer than 10 years. Government and TasBuild construction workers are covered by separate arrangements.",
  },
  {
    q: "Do Tasmanian employees pay payroll tax?",
    a: `No. Payroll tax is charged to employers whose Australian wages exceed ${formatAUD(STATE_PAYROLL_TAX.TAS.threshold)}. It never appears on an employee's payslip and does not reduce gross pay.`,
  },
  {
    q: "Do I pay the Medicare levy surcharge in TAS?",
    a: "The Medicare levy surcharge is federal and applies on the same income thresholds everywhere in Australia. Untick \"I hold private hospital cover\" in the calculator above to see whether it applies at your income and what it costs.",
  },
];
