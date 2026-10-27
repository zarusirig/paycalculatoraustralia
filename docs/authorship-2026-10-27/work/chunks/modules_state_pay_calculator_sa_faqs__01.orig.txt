// Shared FAQ copy for /pay-calculator-sa/ — rendered by the page's accordion
// and turned into FAQPage JSON-LD in app/pay-calculator-sa/page.tsx.

import { formatAUD, formatPercent } from "@/lib/constants";
import { SA_PAYROLL_TAX } from "@/lib/constants/payroll-tax";
import { STATE_PROFILES } from "@/lib/data/state-employee";
import type { FaqItem } from "@/lib/faq";
import { ABS_PERIOD, awoteLine, millions } from "./state-faqs-shared";

const PROFILE = STATE_PROFILES.SA;
const SA_RATE = formatPercent(SA_PAYROLL_TAX.rate, 2);

export const SA_FAQS: readonly FaqItem[] = [
  {
    q: "Is income tax different in South Australia?",
    a: "No. Income tax is levied by the federal government through the ATO and is identical in all 6 states and 2 territories. Your income tax brackets, the low income tax offset (LITO) and the Medicare levy are the same whether you live in Adelaide, Sydney, or Perth. There is no state-level personal income tax anywhere in Australia.",
  },
  {
    q: "What is the take-home pay on the average SA salary?",
    a: `Full-time adults in SA earn ${awoteLine(PROFILE)} (ABS, ${ABS_PERIOD}). The worked example above shows the weekly, fortnightly and monthly net figures.`,
  },
  {
    q: "Are Christmas Eve and New Year's Eve public holidays in SA?",
    a: "Both are part-day public holidays in South Australia, running from 7 pm to midnight. Hours worked before 7 pm are ordinary hours and hours after it attract public holiday entitlements, so a single evening shift can span both.",
  },
  {
    q: "Why does SA have Proclamation Day instead of Boxing Day?",
    a: "South Australia gazettes 26 December as the Proclamation Day holiday, marking the proclamation of the colony in 1836. For pay purposes it functions the same way as Boxing Day elsewhere, and an additional public holiday is observed on Monday 28 December 2026.",
  },
  {
    q: "Why is long service leave better in South Australia?",
    a: "The Long Service Leave Act 1987 (SA) sets accrual at 1.3 weeks per completed year, which produces 13 weeks at the 10-year mark. Most other states accrue about 0.867 weeks a year and reach only 8.67 weeks at 10 years. A pro-rata payment becomes available once you complete 7 years.",
  },
  {
    q: "Do SA employees pay payroll tax?",
    a: `No. Payroll tax is charged to the employer once its Australian wage bill passes ${formatAUD(SA_PAYROLL_TAX.threshold)}: a variable rate from 0% to ${SA_RATE} on payrolls between ${millions(SA_PAYROLL_TAX.threshold)} and ${millions(SA_PAYROLL_TAX.fullRateFrom)}, then ${SA_RATE}. It never appears as a deduction on an employee's payslip.`,
  },
  {
    q: "Does salary packaging change my SA take-home pay?",
    a: "Yes, and it is common in SA health and not-for-profit employment. Packaged amounts reduce your taxable income, which reduces income tax and the Medicare levy. Model it with the salary packaging guide and the salary package calculator.",
    links: { "salary packaging guide": "/salary-packaging-guide/", "salary package calculator": "/salary-package-calculator/" },
  },
];
