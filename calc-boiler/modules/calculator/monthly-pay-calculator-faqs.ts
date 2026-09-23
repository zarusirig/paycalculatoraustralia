// Shared FAQ copy for /monthly-pay-calculator/ — rendered by the page's
// accordion and turned into FAQPage JSON-LD in app/monthly-pay-calculator/page.tsx,
// so the structured data cannot drift from the page. Rates come from lib/constants.

import { formatAUD, formatPercent, HECS_HELP, SITE_CONFIG, SUPER_GUARANTEE } from "@/lib/constants";
import { hecsBandsSentence } from "@/modules/calculator/fy-rate-copy";
import type { FaqItem } from "@/lib/faq";

const FY = SITE_CONFIG.financialYear;

export const MONTHLY_PAY_FAQS: readonly FaqItem[] = [
  {
    q: "How is monthly pay calculated in Australia?",
    a: `Monthly pay is calculated by dividing your gross annual salary by 12, then subtracting PAYG income tax, the Medicare levy, and any HECS-HELP repayments. The ATO publishes specific monthly withholding tables that employers apply during the FY${FY} financial year.`,
  },
  {
    q: "Is super deducted from my monthly pay?",
    a: `No. Your employer pays superannuation at ${formatPercent(SUPER_GUARANTEE.rate, 0)} on top of your gross salary. The SG contribution does not reduce your monthly take-home pay. Since Payday Super commenced on ${SUPER_GUARANTEE.paydaySuperStart}, employers remit super every payday and the contribution must reach your fund within 7 business days.`,
  },
  {
    q: "Why is my monthly pay the same every month?",
    a: "Salaried employees receive 1/12 of their annual salary each month, regardless of whether the month has 28, 30, or 31 days. The calculation divides by 12 calendar months, not by the number of working days.",
  },
  {
    q: "Is monthly pay the same as 4 weeks' pay?",
    a: "No. Four weeks equals 28 days, but an average calendar month has 30.44 days. Monthly gross pay is annual salary divided by 12, which is approximately 8.3% higher than 4 weeks' pay (annual divided by 13).",
  },
  {
    q: "How does HECS-HELP affect my monthly take-home?",
    a: `HECS-HELP repayments reduce monthly take-home pay for employees earning above ${formatAUD(HECS_HELP.minimumThreshold)} per year. The FY${FY} marginal system charges ${hecsBandsSentence()}. Use our HECS-HELP Calculator to estimate your annual and monthly repayment.`,
    links: { "HECS-HELP Calculator": "/hecs-help-calculator/" },
  },
  {
    q: "Should I align my mortgage repayments with my monthly pay?",
    a: "Matching mortgage repayments to your pay cycle simplifies cash flow management. Employees paid monthly benefit from a single monthly mortgage debit. Switching to fortnightly mortgage repayments (even while paid monthly) produces 26 half-payments — equivalent to 13 full payments per year — which reduces total interest over the life of the loan.",
  },
  {
    q: "How does salary packaging affect my monthly take-home?",
    a: "Salary packaging reduces your taxable income before PAYG withholding is calculated, resulting in less tax withheld and a higher net monthly deposit. Common packaged items include additional superannuation contributions, novated vehicle leases, and portable electronic devices. Our Salary Sacrifice Calculator gives a side-by-side comparison.",
    links: { "Salary Sacrifice Calculator": "/salary-sacrifice-calculator/" },
  },
  {
    q: "Will I get a tax refund if I'm paid monthly?",
    a: "A tax refund depends on the difference between PAYG tax withheld during the year and your actual tax liability at lodgement. Monthly PAYG withholding uses the ATO's monthly tax table, which assumes a constant income across all 12 months. Overtime, bonuses, or periods of leave without pay create discrepancies that result in either a refund or a balance owing.",
  },
];
