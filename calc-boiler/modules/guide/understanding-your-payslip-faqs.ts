// Shared FAQ copy for /understanding-your-payslip/ — rendered by the page's
// accordion and turned into FAQPage JSON-LD in
// app/understanding-your-payslip/page.tsx, so the structured data cannot drift
// from the page. Every figure is computed from lib/constants.

import {
  EMPLOYMENT,
  HECS_HELP,
  SITE_CONFIG,
  SUPER_GUARANTEE,
  SUPER_GUARANTEE_CHARGE,
  calculateIncomeTax,
  calculateLITO,
  calculateMedicareLevy,
  formatAUD,
  formatPercent,
} from "@/lib/constants";
import { PENALTY_UNIT } from "@/lib/constants/tax-calendar-2026-27";
import type { FaqItem } from "@/lib/faq";

const FY = SITE_CONFIG.financialYear;
const SG = formatPercent(SUPER_GUARANTEE.rate, 0);
const EX_SALARY = 85_000;
const exTax = Math.max(0, calculateIncomeTax(EX_SALARY) - calculateLITO(EX_SALARY)) + calculateMedicareLevy(EX_SALARY);
const exNet = EX_SALARY - exTax;
// Fair Work Act civil penalty (standard contravention): 60 penalty units for an
// individual, five times that for a body corporate.
const FW_PENALTY_INDIVIDUAL = 60 * PENALTY_UNIT.amount;
const FW_PENALTY_COMPANY = 5 * FW_PENALTY_INDIVIDUAL;
const SUPER_EX_SALARY = 100_000;
const SUPER_MISSED_MONTH = (SUPER_EX_SALARY * SUPER_GUARANTEE.rate) / 12;
const SACRIFICE = 500;
const fortnightly = EX_SALARY / 26;

export const PAYSLIP_FAQS: readonly FaqItem[] = [
  {
    q: "What is the difference between Gross and Net Pay?",
    a: `Gross pay is your total earnings before any deductions. Net pay is the amount deposited into your bank account after PAYG withholding (income tax + Medicare Levy), HECS-HELP repayments, salary sacrifice, and any other authorised deductions are subtracted. On an ${formatAUD(EX_SALARY)} gross salary in FY${FY}, net pay is approximately ${formatAUD(exNet)}.`,
  },
  {
    q: "What must be legally included on an Australian payslip?",
    a: "Under the Fair Work Regulations, a payslip must include the employer's name and ABN, the employee's name, the pay period and date of payment, gross and net pay, the ordinary hourly rate and hours for hourly workers, any loadings, allowances, bonuses or penalty rates, each deduction (including PAYG tax), and the superannuation contribution with the name of the fund it was paid to.",
  },
  {
    q: "What is PAYG Withholding?",
    a: "Pay As You Go (PAYG) withholding is the amount of income tax your employer legally deducts from your gross salary and sends directly to the ATO on your behalf. This ensures you gradually pay your income tax throughout the year rather than facing a massive bill at tax time.",
  },
  {
    q: "When must my employer give me my payslip?",
    a: `Under the Fair Work Act 2009, your employer must provide a payslip within 1 working day of paying your wage. The payslip can be delivered electronically (email, payroll portal) or as a printed document. Failure to comply carries penalties of up to ${formatAUD(FW_PENALTY_INDIVIDUAL)} per breach for individuals.`,
  },
  {
    q: "Does my HECS-HELP repayment show separately on my payslip?",
    a: `Often not. If you ticked "Yes" to having a study/training loan on your TFN Declaration, your employer withholds extra tax to cover your HECS-HELP repayment, and many payslips bundle this amount into the PAYG withholding line. The FY${FY} repayment threshold is ${formatAUD(HECS_HELP.minimumThreshold)}. Below this income level, no repayment is withheld.`,
    links: { "HECS-HELP": "/hecs-help-calculator/" },
  },
  {
    q: "How do I check if my employer is actually paying my super?",
    a: `Log into your super fund's online portal (or use the ATO's myGov link) and check your transaction history. Since Payday Super started on ${SUPER_GUARANTEE.paydaySuperStart}, your employer's contribution must reach your fund within ${SUPER_GUARANTEE_CHARGE.current.businessDaysToPay} business days of each payday. If contributions are missing, lodge a complaint with the ATO. At the current ${SG} SG rate, a month of missed super on a ${formatAUD(SUPER_EX_SALARY)} salary is ${formatAUD(SUPER_MISSED_MONTH)} of lost retirement savings.`,
  },
  {
    q: "Should overtime appear separately on my payslip?",
    a: "Yes. The Fair Work Act requires employers to itemise each component of pay separately — including base hours, overtime hours, penalty rate loadings, and any allowances. If your overtime is combined with standard hours, ask payroll to itemise it. This is especially important for verifying Award Rates compliance and correct penalty rate calculations.",
    links: { "Award Rates": "/award-rates/" },
  },
  {
    q: "What should I do if my employer does not give me a payslip?",
    a: `Request your payslip in writing first. If your employer continues to withhold payslips, lodge a complaint with the Fair Work Ombudsman at fairwork.gov.au or call 13 13 94. Failing to provide payslips is a breach of the Fair Work Act carrying penalties of up to ${formatAUD(FW_PENALTY_COMPANY)} per breach for companies. You can also lodge an anonymous tip if you prefer not to be identified.`,
  },
  {
    q: "Is an electronic payslip as valid as a paper payslip?",
    a: "Yes. Electronic payslips (PDF, email, payroll portal access) carry the same legal weight as printed payslips under the Fair Work Act. The employer must ensure the electronic payslip is accessible to the employee and contains all the mandatory items. Most Australian employers now use electronic payslips through STP-compliant payroll software.",
  },
  {
    q: "Do casual employees receive payslips?",
    a: `Yes. Casual employees are entitled to a payslip within 1 working day of being paid, the same as full-time and part-time employees. A casual payslip must show the hourly rate including the ${EMPLOYMENT.casualLoading * 100}% casual loading, hours worked, PAYG withholding, and super contributions. Super is payable on casual earnings at the ${SG} SG rate regardless of hours worked.`,
  },
  {
    q: "How long should I keep my payslips?",
    a: "The ATO recommends keeping payslips for a minimum of 5 years from the date you lodge the relevant tax return. Employers must retain payroll records for 7 years. Storing payslips digitally (scanned PDFs or payroll portal exports) satisfies record-keeping requirements and provides evidence in the event of a Fair Work dispute.",
  },
  {
    q: "Do I need payslips to lodge my tax return?",
    a: "No. Since the introduction of Single Touch Payroll (STP), your employer reports your income and tax data directly to the ATO each pay cycle, and must finalise it by 14 July each year so your income statement in myGov is marked tax ready. Payslips serve as a backup verification tool rather than a primary lodgement document. Cross-check your final YTD payslip figures against your Income Statement before lodging.",
  },
  {
    q: "How does salary sacrifice appear on a payslip?",
    a: `Salary sacrifice amounts appear as a pre-tax deduction between gross pay and taxable income. The payslip shows your gross salary, then subtracts the salary sacrifice amount, resulting in a lower taxable income. PAYG withholding is then calculated on this reduced figure. For example, sacrificing ${formatAUD(SACRIFICE)} per fortnight into super on an ${formatAUD(EX_SALARY)} salary reduces fortnightly taxable income from ${formatAUD(fortnightly)} to ${formatAUD(fortnightly - SACRIFICE)}, lowering the PAYG withholding accordingly.`,
  },
  {
    q: "How do I compare payslips before and after a pay rise?",
    a: "Compare the gross pay, PAYG withholding, and net pay lines between your old and new payslips. Only the extra income is taxed at your marginal rate, and a rise can push part of it into a higher bracket, so the net increase is smaller than the gross increase. Use the Pay Rise Calculator to model the exact before-and-after impact on your take-home pay, super contributions, and effective tax rate.",
    links: { "Pay Rise Calculator": "/pay-rise-calculator/" },
  },
];
