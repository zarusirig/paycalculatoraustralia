// Shared FAQ copy for /working-holiday-tax/ — rendered by the page's accordion
// and turned into FAQPage JSON-LD in app/working-holiday-tax/page.tsx, so the
// structured data cannot drift from the page. Rates come from lib/constants
// (WHM scale in tax-rates-reference.ts, no-TFN rates in payg-withholding.ts).

import { MEDICARE_LEVY, TAX_FREE_THRESHOLD, formatAUD } from "@/lib/constants";
import { NO_TFN_RATES } from "@/lib/constants/payg-withholding";
import { NON_RESIDENT_TAX_BRACKETS, WHM_TABLE_YEAR, WHM_TAX_BRACKETS_2025_26 } from "@/lib/constants/tax-rates-reference";
import { RETURN_2026 } from "@/lib/constants/tax-return-2025-26";
import type { FaqItem } from "@/lib/faq";

const pct = (r: number) => `${Math.round(r * 1000) / 10}%`;
const [whm1, whm2, whm3, whm4] = WHM_TAX_BRACKETS_2025_26;
const WHM_RATE = pct(whm1.rate);
const WHM_CAP = formatAUD(whm1.max);
const FOREIGN_RATE = pct(NON_RESIDENT_TAX_BRACKETS[0].rate);
/** DASP withholding rate for working holiday makers (ATO, DASP tax rates). */
const DASP_WHM_RATE = "65%";

export const WORKING_HOLIDAY_TAX_FAQS: readonly FaqItem[] = [
  {
    q: "What tax rate do working holiday makers pay?",
    a: `Working holiday makers (visa subclass 417 or 462) pay ${WHM_RATE} on the first ${WHM_CAP} of taxable income. Above that the rates are ${pct(whm2.rate)} up to ${formatAUD(whm2.max)}, ${pct(whm3.rate)} up to ${formatAUD(whm3.max)} and ${pct(whm4.rate)} above ${formatAUD(whm4.min - 1)} (ATO table for ${WHM_TABLE_YEAR}). There is no tax-free threshold.`,
  },
  {
    q: "Do I need a Tax File Number as a working holiday maker?",
    a: `Yes. Apply for a TFN when you arrive in Australia. Without one, your employer must withhold tax at ${pct(NO_TFN_RATES.foreignResident)} from your first dollar of income. You can apply online through the ATO website with your passport, and the ATO says to allow up to 28 days for your TFN to arrive.`,
  },
  {
    q: "Do I need to lodge a tax return if I leave Australia?",
    a: "Yes. You must lodge a tax return for each financial year in which you earned Australian income, even after leaving the country. Lodge through myTax online. The deadline is 31 October following the end of the financial year. You can also appoint a registered tax agent to lodge on your behalf.",
  },
  {
    q: "How do I claim back my superannuation after leaving Australia?",
    a: `Apply for a "Departing Australia Superannuation Payment" (DASP) through the ATO online portal after you have left Australia and your visa has expired or been cancelled. You need your passport, visa details, TFN, and super fund membership numbers. Claims are generally processed within 28 days. The tax rate on DASP for working holiday makers is ${DASP_WHM_RATE}.`,
  },
  {
    q: "Can working holiday makers claim the tax-free threshold?",
    a: `No. Working holiday makers are not entitled to the ${formatAUD(TAX_FREE_THRESHOLD)} tax-free threshold, regardless of how long they live in Australia. Every dollar earned from $1 is taxed at ${WHM_RATE}. Do not tick "yes" to the tax-free threshold question on your TFN declaration form.`,
  },
  {
    q: "Do working holiday makers pay the Medicare levy?",
    a: `Usually no. Most working holiday makers are foreign residents for tax purposes, and foreign residents do not pay the ${pct(MEDICARE_LEVY.rate)} Medicare levy. They are not eligible for Medicare benefits (with limited exceptions under reciprocal health care agreements). The Medicare Levy Surcharge also does not apply.`,
  },
  {
    q: "What happens if my employer is not registered as a WHM employer?",
    a: `An unregistered employer must withhold tax at the foreign resident rate of ${FOREIGN_RATE} from dollar one, instead of ${WHM_RATE}. This effectively doubles your tax withholding. You can recover the overpaid amount by lodging a tax return at the end of the financial year, but you experience reduced take-home pay in the meantime. Ask your employer to register with the ATO before you start work.`,
  },
  {
    q: "What happens to my tax rate if I change visa type?",
    a: `The WHM ${WHM_RATE} rate ceases on the day your 417 or 462 visa expires or you transition to a different visa subclass (e.g., student visa 500, employer-sponsored visa 482, or partner visa 820). From that date, you are taxed under standard resident or non-resident rates. Income earned while on your working holiday visa remains taxed at WHM rates for that portion of the financial year.`,
  },
  {
    q: "What if I work for two employers on a working holiday visa?",
    a: `Both employers withhold at ${WHM_RATE} independently, but the ${WHM_CAP} threshold applies to your total combined income for the financial year. If your combined earnings exceed ${WHM_CAP}, you may have a tax shortfall because each employer applies the ${WHM_RATE} rate without knowing about the other. Lodge a tax return to settle the difference — the ATO calculates the correct tax on your total WHM income.`,
  },
  {
    q: "Can working holiday makers claim tax deductions?",
    a: "Yes. WHMs can claim work-related deductions including protective clothing, tools and equipment, travel between work sites (not home-to-work), sun protection for outdoor work, and union fees. Deductions reduce your assessable income, which reduces tax payable. Keep all receipts and records for expenses over $300.",
  },
  {
    q: "Do working holiday makers pay HECS-HELP repayments?",
    a: "In practice, no. HELP loans are only available to Australian citizens and certain permanent visa holders, so someone on a 417 or 462 visa will not have a HELP debt to repay.",
  },
  {
    q: "How long does a WHM tax refund take?",
    a: `The ATO says most returns lodged online through myTax process in ${RETURN_2026.onlineProcessingBusinessDays} business days, and returns selected for review take longer. Refunds are paid by direct deposit into an Australian bank account, so keep one open until your refund arrives. Lodge electronically through myTax for the fastest processing.`,
  },
  {
    q: "Can I work as a sole trader on a working holiday visa?",
    a: `Yes. All Australian income you earn while on a 417 or 462 visa, including business income, is taxed at the working holiday maker rates when you lodge your return: ${WHM_RATE} up to ${WHM_CAP}. As an ABN contractor you usually have no tax withheld, so set money aside for the bill. Lodge a tax return to reconcile your total income and claim business deductions.`,
  },
];
