import { formatAUD } from "@/lib/constants";
import { MAX_COMBINED_GAIN, MAX_RATE_CUT_SAVING, WATO } from "@/lib/constants/tax-2027-28";
import type { Faq } from "./t3-shared";

// Shared by the page body and the FAQPage JSON-LD. Sources: ATO "Working
// Australians tax offset" (QC107797, published 23 Jul 2026), ATO "Personal
// income tax - new tax cuts for every Australian taxpayer" (QC104015, updated
// 13 May 2026) and Treasury Budget 2026-27, read 5 October 2026.

export const WATO_FAQS: Faq[] = [
  {
    q: "What is the Working Australians Tax Offset?",
    a: `It is a new non-refundable tax offset of up to ${formatAUD(WATO.maxOffset)} a year for Australian residents who earn labour income, available from the ${WATO.firstIncomeYear} income year (1 July 2027 to 30 June 2028). The ATO says the measure is now law, following Royal Assent on ${WATO.royalAssent}.`,
  },
  {
    q: "Who gets the $250 offset?",
    a: `Individuals who are Australian residents for tax purposes during the 2027-28 income year and whose net labour income (labour amounts less labour deductions) is above the tax-free threshold of ${formatAUD(WATO.incomeThreshold)}. The maximum ${formatAUD(WATO.maxOffset)} applies if the income tax payable on your net labour income is above ${formatAUD(WATO.maxOffset)}.`,
  },
  {
    q: "Is the Working Australians Tax Offset refundable?",
    a: "No. It can only reduce your tax payable to nil. Any unused amount is not refunded, and it cannot be transferred or carried forward to another year.",
  },
  {
    q: "When does the tax rate fall from 15% to 14%?",
    a: "On 1 July 2027. The 16% rate fell to 15% on 1 July 2026, and the ATO says the 15% rate will be reduced further to 14% from 1 July 2027. It applies to taxable income between $18,201 and $45,000, and the measure is now law.",
  },
  {
    q: "How much better off will I be in 2027-28?",
    a: `On the same salary, up to ${formatAUD(MAX_COMBINED_GAIN)} a year: ${formatAUD(MAX_RATE_CUT_SAVING)} from the lower rate (for anyone earning $45,000 or more) plus ${formatAUD(WATO.maxOffset)} from the offset. Someone earning $30,000 gets less from the rate cut, 1 cent for each dollar above $18,200, and may get less than ${formatAUD(WATO.maxOffset)} from the offset if their tax is low.`,
  },
  {
    q: "Is the offset the same for everyone?",
    a: `The maximum is the same, ${formatAUD(WATO.maxOffset)}, for every eligible worker whether they earn $50,000 or $250,000. Because it is a flat dollar amount, it is worth a bigger share of a lower salary. Workers whose tax payable is below ${formatAUD(WATO.maxOffset)} get less because the offset cannot go below nil.`,
  },
  {
    q: "Does the Working Australians Tax Offset apply to the 2026-27 tax year?",
    a: "No. It starts in the 2027-28 income year. The 1 July 2026 change for 2026-27 is the cut in the second tax rate from 16% to 15%, plus the $1,000 instant tax deduction, which you claim on the 2026-27 return.",
  },
  {
    q: "Will my employer pay it in my pay or will I get it at tax time?",
    a: "We have not seen the ATO say how it will be delivered, whether through PAYG withholding or when your 2027-28 return is assessed. The calculator shows the annual effect on your tax. Check the ATO's Working Australians tax offset page for updates.",
  },
  {
    q: "Does self-employed income count as labour income?",
    a: "The ATO describes the offset as being for residents who earn labour income, measured as labour amounts less labour deductions. The legal definition of labour amounts sits in the legislation, and we have not confirmed how it treats sole trader business income, so check the ATO page if most of your income is not salary or wages.",
  },
];
