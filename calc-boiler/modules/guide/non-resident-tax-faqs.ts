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
import { PART_YEAR_TFT } from "@/lib/constants/tax-free-threshold";
import { WHM_TAX_BRACKETS_2025_26 } from "@/lib/constants/tax-rates-reference";
import type { FaqItem } from "@/lib/faq";

const pct = (r: number) => `${Math.round(r * 1000) / 10}%`;
const [NR1, NR2, NR3] = NON_RESIDENT_TAX_BRACKETS;
// The 2025-26 WHM scale is unchanged for 2026-27: ATO Schedule 15 (published
// 17 June 2026, applies to payments from 1 July 2026), Table A "Working holiday
// makers income tax rates for 2026-27": "$0 - $45,000 | 15% on each $1".
const WHM1 = WHM_TAX_BRACKETS_2025_26[0];
/**
 * DASP tax rates. ATO "Departing Australia superannuation payment (DASP)",
 * last updated 21 April 2026, table "DASP tax rates": tax-free component nil;
 * taxable component taxed element 35% (non-WHM) / 65% (WHM); untaxed element
 * 45% (non-WHM) / 65% (WHM). Read 27 October 2026.
 */
const DASP_RATES = { taxedElement: 0.35, untaxedElement: 0.45, whm: 0.65 } as const;
const FY = SITE_CONFIG.financialYear;

export const NON_RESIDENT_FAQS: readonly FaqItem[] = [
  {
    q: "What is the non-resident tax rate?",
    a: `For FY${FY}, non-residents pay ${pct(NR1.rate)} on taxable income up to ${formatAUD(NR1.max)}, ${pct(NR2.rate)} from ${formatAUD(NR2.min)} to ${formatAUD(NR2.max)}, and ${pct(NR3.rate)} above ${formatAUD(NR3.min - 1)}. There is no tax-free threshold, so tax applies from the first dollar.`,
  },
  {
    q: "Do non-residents pay Medicare levy?",
    a: `No. Non-residents are exempt from the ${pct(MEDICARE_LEVY.rate)} Medicare levy. Non-residents are also not eligible for Medicare services, so you pay for medical care through private health insurance or out of pocket. Citizens of the 11 RHCA countries (including the UK, Ireland, and New Zealand) receive limited Medicare access for essential treatment.`,
  },
  {
    q: "Can non-residents claim work-related deductions?",
    a: "Yes, non-residents can claim work-related deductions in the same way as residents. The deductions reduce your taxable income, and non-resident rates apply to the taxable income that remains. Common deductions include uniforms, tools, work-related travel, self-education, and union fees.",
  },
  {
    q: "What if my residency status changes mid-year?",
    a: `You become a part-year resident, and resident tax rates apply to your taxable income for the year. Your tax-free threshold is reduced: a flat ${formatAUD(PART_YEAR_TFT.flat)}, plus ${formatAUD(PART_YEAR_TFT.proRata)} divided by 12 and multiplied by the months you were a resident (counting the month you arrived or left). Only a full 12 months as a resident gives the full ${formatAUD(TAX_FREE_THRESHOLD)}. In your tax return you give the date your residency changed and the number of months you were a resident, and the ATO works out your threshold.`,
  },
  {
    q: "Do non-residents receive superannuation?",
    a: `Yes. Employers must pay the ${pct(SUPER_GUARANTEE.rate)} superannuation guarantee on top of gross salary, regardless of your residency status. If you worked here on a temporary visa, you can claim your super as a Departing Australia Superannuation Payment (DASP) once you have left Australia and your visa has ended. Australian and New Zealand citizens and permanent residents cannot claim a DASP. The fund withholds DASP tax of ${pct(DASP_RATES.taxedElement)} on the taxed element and ${pct(DASP_RATES.untaxedElement)} on the untaxed element of the taxable component. If the payment includes super from contributions made while you held a working holiday visa (subclass 417 or 462), ${pct(DASP_RATES.whm)} applies to the whole taxable component.`,
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
    a: "Yes, if your home country has a Double Tax Agreement (DTA) with Australia. Australia has more than 40 DTAs that allocate taxing rights and provide mechanisms to claim foreign income tax offsets. You can claim a credit for Australian tax paid against your home country tax liability, or the reverse, so the same income is not taxed twice.",
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
    a: `A working holiday maker (subclass 417 or 462) can be either an Australian resident or a foreign resident for tax purposes, and the ATO says most are foreign residents. For most WHMs, residency does not change the tax: working holiday maker rates apply either way, starting at ${pct(WHM1.rate)} on the first ${formatAUD(WHM1.max)} for FY${FY}. The exception is a WHM who is an Australian resident for tax purposes and comes from a non-discrimination article (NDA) country, who can be taxed like a resident Australian national. If your employer is not registered with the ATO as a WHM employer, it must withhold at foreign resident rates (${pct(NR1.rate)} from the first dollar). That changes only the tax taken from each pay, not the WHM rates your income is assessed at in your tax return.`,
  },
  {
    q: "Do I need to lodge a tax return after leaving Australia?",
    a: "Yes. If you earned any Australian income during the financial year, you must lodge a tax return. Lodge a departure return covering 1 July to your departure date. You can lodge from overseas through myTax. If you continue to earn Australian-sourced income (such as rental income) after departure, you must lodge a return each financial year that income is received.",
  },
];
