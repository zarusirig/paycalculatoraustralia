// Shared FAQ copy for /non-resident-tax/ — rendered by the page's accordion and
// turned into FAQPage JSON-LD in app/non-resident-tax/page.tsx, so the
// structured data cannot drift from the page. Rates come from lib/constants.

import {
  formatAUD,
  HECS_HELP,
  MEDICARE_LEVY,
  NON_RESIDENT_TAX_BRACKETS,
  SITE_CONFIG,
  SUPER_GUARANTEE,
  TAX_FREE_THRESHOLD,
} from "@/lib/constants";
import { NO_TFN_RATES } from "@/lib/constants/payg-withholding";
import { WHM_TAX_BRACKETS_2025_26 } from "@/lib/constants/tax-rates-reference";
import type { FaqItem } from "@/lib/faq";

const pct = (r: number) => `${Math.round(r * 1000) / 10}%`;
const [NR1, NR2, NR3] = NON_RESIDENT_TAX_BRACKETS;
const WHM1 = WHM_TAX_BRACKETS_2025_26[0];
const FY = SITE_CONFIG.financialYear;

export const NON_RESIDENT_FAQS: readonly FaqItem[] = [
  {
    q: "What is the non-resident tax rate?",
    a: `For FY${FY}, non-residents pay ${pct(NR1.rate)} on taxable income up to ${formatAUD(NR1.max)}, ${pct(NR2.rate)} from ${formatAUD(NR2.min)} to ${formatAUD(NR2.max)}, and ${pct(NR3.rate)} above ${formatAUD(NR3.min - 1)}. There is no tax-free threshold, so tax applies from the first dollar.`,
  },
  {
    q: "Do non-residents pay Medicare levy?",
    a: `No. Non-residents are exempt from the ${pct(MEDICARE_LEVY.rate)} Medicare levy. However, this also means you cannot access Medicare services. If you need medical care, you'll need private health insurance or pay out of pocket. Citizens of the 11 RHCA countries (including the UK, Ireland, and New Zealand) receive limited Medicare access for essential treatment.`,
  },
  {
    q: "Can non-residents claim work-related deductions?",
    a: "Yes, non-residents can claim work-related deductions in the same way as residents. The deductions reduce your taxable income, which then has non-resident rates applied. Common deductions include uniforms, tools, work-related travel, self-education, and union fees.",
  },
  {
    q: "What if my residency status changes mid-year?",
    a: `Your tax return is split into resident and non-resident periods. Resident rates apply to income earned during the resident period, and non-resident rates to income during the non-resident period. The ${formatAUD(TAX_FREE_THRESHOLD)} tax-free threshold is pro-rated based on the number of months you were a resident.`,
  },
  {
    q: "Do non-residents receive superannuation?",
    a: `Yes. Employers must pay the ${pct(SUPER_GUARANTEE.rate)} superannuation guarantee on top of gross salary for all employees, regardless of residency status. Non-residents who leave Australia permanently can apply for a Departing Australia Superannuation Payment (DASP). The tax rate on DASP is 35% for non-residents (65% for working holiday makers).`,
  },
  {
    q: "Do non-residents need a Tax File Number?",
    a: `Yes. Without a TFN, your employer must withhold tax at ${pct(NO_TFN_RATES.foreignResident)} from every dollar of income paid to a foreign resident. Non-residents can apply for a TFN online through the ATO website once they are in Australia on a valid visa.`,
  },
  {
    q: "Do non-residents pay tax on Australian rental income?",
    a: `Yes. Rental income from Australian property is Australian-sourced income and is taxable at non-resident rates (${pct(NR1.rate)} from the first dollar). Non-residents can claim the same rental deductions as residents, including interest, repairs, depreciation, and property management fees. Capital gains on the sale of Australian property are also taxable with no 50% CGT discount.`,
  },
  {
    q: "Can I avoid double taxation on Australian income?",
    a: "Yes, if your home country has a Double Tax Agreement (DTA) with Australia. Australia has more than 40 DTAs that allocate taxing rights and provide mechanisms to claim foreign income tax offsets. You can claim a credit for Australian tax paid against your home country tax liability, or vice versa, preventing the same income from being taxed twice.",
  },
  {
    q: "Do non-residents get the 50% CGT discount?",
    a: "No. Non-residents do not receive the 50% capital gains tax discount on gains accrued after 8 May 2012 on taxable Australian property, such as real estate. A non-resident selling an Australian investment property held for 3 years pays CGT on the full capital gain at their non-resident rates, with no discount applied. Most portfolio shareholdings in Australian companies are not taxable Australian property, so gains on them are generally outside Australian CGT for non-residents.",
  },
  {
    q: "Do non-residents have to repay HECS-HELP debts?",
    a: `Yes. Since 1 July 2017, Australians living overseas with a HECS-HELP debt must lodge an overseas travel notification and report their worldwide income to the ATO, and make compulsory repayments based on it. The minimum repayment threshold is ${formatAUD(HECS_HELP.minimumThreshold)} for FY${FY}. Most international students pay full tuition fees upfront and do not have HECS-HELP debts.`,
  },
  {
    q: "How do I confirm my residency status with the ATO?",
    a: "Request a private ruling from the ATO at no cost. A private ruling provides a binding determination of your residency status for the relevant financial year. You can apply online through the ATO website by providing details of your living arrangements, family ties, economic connections, and intention to remain in or return to Australia.",
  },
  {
    q: "Is a working holiday maker a non-resident?",
    a: `Not for tax purposes. Working holiday makers (subclass 417/462) have their own tax schedule with a ${pct(WHM1.rate)} rate on the first ${formatAUD(WHM1.max)}. Standard non-resident rates (${pct(NR1.rate)} from dollar one) only apply if the employer has not registered as an employer of working holiday makers with the ATO. WHMs are treated as a distinct taxpayer category, separate from both residents and standard non-residents.`,
  },
  {
    q: "Do I need to lodge a tax return after leaving Australia?",
    a: "Yes. If you earned any Australian income during the financial year, you must lodge a tax return. Lodge a departure return covering 1 July to your departure date. You can lodge from overseas through myTax. If you continue to earn Australian-sourced income (such as rental income) after departure, you must lodge a return each financial year that income is received.",
  },
];
