import { SUPER_GUARANTEE, formatAUD, formatPercent } from "@/lib/constants";
import { payslipFromGross } from "@/lib/constants/gross-vs-net";
import type { Faq } from "./t3-shared";

// Shared by the page body and the FAQPage JSON-LD. Example figures are
// computed from the ATO Schedule 1 withholding engine.

const EX = payslipFromGross({ gross: 3_000, frequency: "fortnightly" });
const SG = formatPercent(SUPER_GUARANTEE.rate, 0);

export const GROSS_VS_NET_FAQS: Faq[] = [
  {
    q: "What is the difference between gross and net pay?",
    a: `Gross pay is what you earn before anything is taken out. Net pay is what's left and paid into your bank account after tax withheld, any study loan repayment and other deductions. On ${formatAUD(3_000)} gross a fortnight with the tax-free threshold, ${formatAUD(EX.paygWithheld)} is withheld and net pay is ${formatAUD(EX.net, 2)}.`,
  },
  {
    q: "What is a gross payment?",
    a: "A gross payment is the total paid to you before tax. On your income statement, 'Gross payments' is the total salary and wages from that employer for the year, and it's the figure you put at item 1 (salary or wages) of your tax return.",
  },
  {
    q: "Is super included in gross pay?",
    a: `No. Your employer's ${SG} super guarantee is paid on top of your gross pay into your super fund. It shows on your payslip but isn't part of gross or net pay. A salary 'package' or total remuneration figure usually does include it.`,
  },
  {
    q: "Is net pay the same as take-home pay?",
    a: "Yes. Net pay, take-home pay and 'pay in hand' all mean the amount paid into your account after tax and other deductions.",
  },
  {
    q: "Is gross income the same as taxable income?",
    a: "Not always. Taxable income is your assessable income, including gross salary, minus deductions you claim in your tax return. Salary sacrificed to super also comes off before tax, so it reduces taxable income.",
  },
  {
    q: "Does my payslip have to show gross and net pay?",
    a: "Yes. The Fair Work Ombudsman says a payslip must include gross and net pay, along with any loadings, allowances, penalty rates and bonuses that can be separated out, each deduction, and the super contributions paid for you.",
  },
];
