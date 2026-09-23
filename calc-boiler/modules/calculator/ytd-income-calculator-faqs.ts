// Shared FAQ copy for /ytd-income-calculator/ — rendered by the calculator's
// accordion and turned into FAQPage JSON-LD in app/ytd-income-calculator/page.tsx,
// so the structured data cannot drift from the page.

import { SITE_CONFIG, SUPER_GUARANTEE, formatAUD, formatPercent } from "@/lib/constants";
import type { FaqItem } from "@/lib/faq";

const EX_PAY = 2_000;
const EX_PAYS = 13;
const MID_PAY = 2_500;
const MID_PAYS = 8;

export const YTD_FAQS: readonly FaqItem[] = [
  {
    q: "What does YTD mean on a payslip?",
    a: "YTD means year to date. It is the running total of your earnings, tax withheld, and superannuation from 1 July (the start of the Australian financial year) up to that payslip. Every YTD column resets to zero with the first pay after 1 July.",
  },
  {
    q: "What is the difference between YTD gross and YTD net?",
    a: "YTD gross is your total before-tax earnings for the financial year so far, including overtime, bonuses, and allowances. YTD net is the total that actually reached your bank account after PAYG tax, study loan withholding, and other deductions. Lenders and the ATO work from the gross figure.",
  },
  {
    q: "How do you calculate YTD income?",
    a: `Multiply your gross pay per period by the number of pays you have received since 1 July. For example, ${EX_PAYS} fortnightly pays of ${formatAUD(EX_PAY)} gives a YTD gross income of ${formatAUD(EX_PAY * EX_PAYS)}. To annualise a YTD figure, divide it by the pays received and multiply by the number of pays in a full year (52 weekly, 26 fortnightly, or 12 monthly).`,
  },
  {
    q: "Does YTD gross include superannuation?",
    a: `No. Employer superannuation guarantee contributions (${formatPercent(SUPER_GUARANTEE.rate, 0)} in FY${SITE_CONFIG.financialYear}) are paid on top of your gross salary and tracked in a separate YTD super column. YTD gross only covers your own earnings — salary, overtime, bonuses, allowances, and leave payments.`,
  },
  {
    q: "Why doesn't my YTD match my own calculation?",
    a: "The usual culprits are pays that landed just before or after 1 July, a mid-year pay rise (so not every pay was the same amount), one-off payments like bonuses or leave loading, or unpaid leave reducing a pay cycle. Count the actual payslips issued since 1 July and add each gross amount — the running total should reconcile exactly. If it still doesn't, ask payroll to check.",
  },
  {
    q: "Does YTD reset on 1 July?",
    a: "Yes. Australian payroll systems reset all YTD totals to zero at the start of the financial year on 1 July. Your first July payslip will show YTD figures equal to just that single pay. Your final June payslip holds the full-year totals that flow into your income statement in myGov.",
  },
  {
    q: "How do banks use YTD income on loan applications?",
    a: "Lenders annualise the YTD gross on your most recent payslips — dividing by the number of pay cycles elapsed and multiplying out to a full year — and cross-check the result against your stated salary and employment contract. Early in the financial year, many lenders will also ask for last year's income statement because a small YTD sample is less reliable.",
  },
  {
    q: "I started my job part-way through the year — how do I annualise?",
    a: `Count pays from your first payslip rather than from 1 July. If you have received ${MID_PAYS} fortnightly pays of ${formatAUD(MID_PAY)} since starting, your annualised income is ${formatAUD(MID_PAY)} × 26 = ${formatAUD(MID_PAY * 26)} even though your YTD shows only ${formatAUD(MID_PAY * MID_PAYS)}. Enter the actual number of pays you have received into the calculator above and it handles this correctly.`,
  },
];
