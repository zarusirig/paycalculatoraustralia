// Shared FAQ copy for /payslip-generator/ — rendered by the page's accordion
// and turned into FAQPage JSON-LD in app/payslip-generator/page.tsx, so the
// structured data cannot drift from the page.

import { SITE_CONFIG } from "@/lib/constants";
import type { FaqItem } from "@/lib/faq";

export const PAYSLIP_GENERATOR_FAQS: readonly FaqItem[] = [
  {
    q: "Is it legal to make your own payslip?",
    a: "Yes — as long as the payslip is accurate. Small employers, bookkeepers and sole traders regularly create payslips manually or with tools like this one. What is illegal is creating a false payslip (for example, to inflate income on a loan application), which is fraud. Employers must also still meet Single Touch Payroll reporting obligations regardless of how the payslip itself is produced.",
  },
  {
    q: "What must a payslip include in Australia?",
    a: "At minimum: the employer's name and ABN, the employee's name, the date of payment, the pay period, gross and net pay, the hourly rate and hours worked (for hourly employees) or annual salary (for salaried employees), any loadings, allowances or bonuses as separate line items, each deduction with its purpose, and superannuation contributions with the name of the fund. The full list is set out in the Fair Work Regulations 2009 and summarised in the table on this page.",
  },
  {
    q: "How do I make a payslip for an ABN contractor?",
    a: "Genuine independent contractors invoice for their work rather than receiving payslips — they handle their own tax and (usually) their own super, so a contractor normally issues an invoice, not a payslip. If you are paying someone with an ABN but they work like an employee (set hours, your direction, your equipment), they may legally be an employee entitled to payslips and super. Check the distinction with our contractor vs employee guide and use the contractor pay calculator to compare rates.",
    links: {
      "contractor vs employee guide": "/contractor-vs-employee-calculator/",
      "contractor pay calculator": "/contractor-pay-calculator/",
    },
  },
  {
    q: "Do casual employees get payslips?",
    a: "Yes. Every employee — full-time, part-time or casual — must receive a payslip within one working day of being paid. A casual's payslip should show the ordinary hourly rate including casual loading, the hours worked, and any penalty rates as separate items.",
  },
  {
    q: "Can I use this instead of payroll software?",
    a: "For producing a compliant payslip document, yes. But employers with staff must also report each pay run to the ATO through Single Touch Payroll (STP), which requires STP-enabled software or a registered agent. This generator is ideal for one-off payslips, replacing lost payslips in your records, nannies and household employees under simplified arrangements, or checking that payroll software output looks right.",
  },
  {
    q: "How accurate is the PAYG tax estimate?",
    a: `Typically within a few dollars per pay. The generator annualises the period's earnings and applies the FY${SITE_CONFIG.financialYear} tax brackets, LITO and Medicare levy, while employers' payroll software uses the ATO's Schedule 1 withholding coefficients, which round slightly differently. If you need the exact figure, look it up in the PAYG withholding tables and enter it in the override field.`,
    links: { "PAYG withholding tables": "/payg-withholding-tables/" },
  },
];
