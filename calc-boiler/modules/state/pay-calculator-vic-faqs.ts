// Shared FAQ copy for /pay-calculator-vic/ — rendered by the page's accordion
// and turned into FAQPage JSON-LD in app/pay-calculator-vic/page.tsx.

import { formatAUD, formatPercent } from "@/lib/constants";
import { VIC_PAYROLL_TAX } from "@/lib/constants/payroll-tax";
import { STATE_PROFILES } from "@/lib/data/state-employee";
import type { FaqItem } from "@/lib/faq";
import { ABS_PERIOD, awoteLine, millions } from "./state-faqs-shared";

const PROFILE = STATE_PROFILES.VIC;

export const VIC_FAQS: readonly FaqItem[] = [
  {
    q: "Is income tax different in Victoria compared to other states?",
    a: "No. Personal income tax in Australia is levied by the federal government through the ATO. The income tax brackets, Medicare levy, and HECS-HELP repayment thresholds are identical in Victoria, New South Wales, Queensland, and every other state and territory.",
  },
  {
    q: "What is the take-home pay on the average Victorian salary?",
    a: `A full-time adult in Victoria earns ${awoteLine(PROFILE)} (ABS, ${ABS_PERIOD}). The worked example above shows exactly what is left after income tax and the Medicare levy, per week, fortnight and month.`,
  },
  {
    q: "Which public holidays are unique to Victoria?",
    a: "Victoria gazettes Labour Day in March, the Friday before the AFL Grand Final in September and Melbourne Cup Day in November — none of which are national. Some regional areas hold the Melbourne Cup holiday on a different date. Working one of these attracts public holiday penalty rates under most awards.",
  },
  {
    q: "When do I get long service leave in Victoria?",
    a: "After 7 years of continuous service with one employer, under the Long Service Leave Act 2018. Leave accrues at one week for every 60 weeks of service. Past 7 years the accrued balance is paid out however the employment ends, including resignation.",
  },
  {
    q: "Do employees pay VIC payroll tax?",
    a: `No. Payroll tax is charged to the employer once its Australian wage bill passes ${formatAUD(VIC_PAYROLL_TAX.threshold)}. It is never deducted from an employee's salary and never appears on a payslip.`,
  },
  {
    q: "Do employees pay the Mental Health and Wellbeing Surcharge?",
    a: `No. The Mental Health and Wellbeing Surcharge is paid exclusively by employers whose national payroll exceeds ${millions(VIC_PAYROLL_TAX.surcharge.firstThreshold)}. It does not reduce your personal salary or affect your take-home pay calculation.`,
  },
  {
    q: "Do regional Victorian workers pay less tax?",
    a: `No. Regional Victorian workers pay exactly the same federal income tax as Melbourne workers. Regional employers benefit from a reduced payroll tax rate of ${formatPercent(VIC_PAYROLL_TAX.regionalRate, 4)} (compared to ${formatPercent(VIC_PAYROLL_TAX.rate, 2)} in metro areas), but this employer saving does not affect employee tax deductions or net pay.`,
  },
  {
    q: "How does HECS-HELP affect my VIC take-home pay?",
    a: "HECS-HELP repayments are a federal obligation applied identically across all states. Tick the HECS-HELP box in the calculator above and it will show the repayment withheld at your salary and the reduced take-home figure, per pay cycle.",
  },
];
