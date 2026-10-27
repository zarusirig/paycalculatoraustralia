// Shared FAQ copy for /pay-calculator-qld/ — rendered by the page's accordion
// and turned into FAQPage JSON-LD in app/pay-calculator-qld/page.tsx.

import { formatAUD } from "@/lib/constants";
import { QLD_PAYROLL_TAX } from "@/lib/constants/payroll-tax";
import { STATE_PROFILES } from "@/lib/data/state-employee";
import type { FaqItem } from "@/lib/faq";
import { ABS_PERIOD, awoteLine, millions } from "./state-faqs-shared";

const PROFILE = STATE_PROFILES.QLD;

export const QLD_FAQS: readonly FaqItem[] = [
  {
    q: "Is income tax different in Queensland compared to other states?",
    a: "No. Income tax in Australia is levied by the federal government through the ATO. The income tax brackets, Medicare levy, and HECS-HELP repayment rates are identical in Queensland, New South Wales, Victoria, and every other state and territory.",
  },
  {
    q: "What is the take-home pay on the average Queensland salary?",
    a: `Full-time adults in Queensland earn ${awoteLine(PROFILE)} (ABS, ${ABS_PERIOD}). Including overtime the figure rises to ${formatAUD(PROFILE.awote.personsFullTimeTotal, 2)} a week. The worked example above shows the net result.`,
  },
  {
    q: "Is the Ekka a public holiday for the whole of Queensland?",
    a: "No. The Royal Queensland Show public holiday on Wednesday 12 August 2026 applies to the Brisbane area only. Other parts of Queensland hold their own local show holidays on different dates, declared regionally.",
  },
  {
    q: "Is Christmas Eve a public holiday in Queensland?",
    a: "Partly. Christmas Eve is a part-day public holiday in Queensland from 6 pm to midnight. Hours worked before 6 pm are ordinary hours; hours after it attract public holiday entitlements. Queensland's 6 pm start is an hour earlier than South Australia's and the Northern Territory's.",
  },
  {
    q: "When do I get long service leave in Queensland?",
    a: "After 10 years of continuous service you can take 8.6667 weeks of paid leave under the Industrial Relations Act 2016, rising to 13 weeks at 15 years. Between 7 and 10 years a proportionate payment is owed only in defined circumstances; at 10 years the payment on termination becomes automatic.",
  },
  {
    q: "Do employees pay for WorkCover in QLD?",
    a: "No. WorkCover Queensland insurance premiums are an employer-only expense. They do not reduce your gross salary and do not affect your take-home pay or net pay after tax.",
  },
  {
    q: "Does the Queensland mental health levy come out of my wages?",
    a: `No. The mental health levy is charged to employers with Australian wages above ${millions(QLD_PAYROLL_TAX.mentalHealthLevy.firstThreshold)}, on top of payroll tax. It is not deducted from employee pay and does not appear on a payslip.`,
  },
];
