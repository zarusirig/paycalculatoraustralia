import { LITO, SITE_CONFIG, TAX_BRACKETS_2025_26, TAX_BRACKETS_2026_27, TAX_FREE_THRESHOLD, formatAUD } from "@/lib/constants";
import { TFT_WITHHOLDING_STARTS_ABOVE } from "@/lib/constants/tax-free-threshold";
import { litoBreakdown, nilTaxIncomeOnScale } from "@/lib/constants/tax-rates-reference";

// Shared by the page body and the FAQPage JSON-LD so the two cannot disagree.
// Every figure is derived from lib/constants (ATO QC105020 cited in
// tax-rates-reference.ts).

const FY = SITE_CONFIG.financialYear;
const PREV = SITE_CONFIG.previousFinancialYear;
const m = (n: number) => formatAUD(n);
export const LITO_MID = LITO.maxOffset - (LITO.phaseOut1.end - LITO.fullOffsetCeiling) * LITO.phaseOut1.rate;
export const NIL_NOW = nilTaxIncomeOnScale(TAX_BRACKETS_2026_27);
export const NIL_PREV = nilTaxIncomeOnScale(TAX_BRACKETS_2025_26);
const l50 = litoBreakdown(50_000);

export const LITO_FAQS: readonly { q: string; a: string }[] = [
  {
    q: `How much is the low income tax offset for ${FY}?`,
    a: `Up to ${m(LITO.maxOffset)}. You get the full ${m(LITO.maxOffset)} if your taxable income is ${m(LITO.fullOffsetCeiling)} or less. It then reduces by 5 cents for each dollar above ${m(LITO.fullOffsetCeiling)} to ${m(LITO_MID)} at ${m(LITO.phaseOut1.end)}, then by 1.5 cents per dollar until it runs out at ${m(LITO.nilOffsetIncome)}.`,
  },
  {
    q: "At what income does LITO cut out?",
    a: `LITO is nil once taxable income reaches ${m(LITO.nilOffsetIncome)}. The ATO's wording is that you may be eligible if you earn up to ${m(LITO.nilOffsetIncome)}.`,
  },
  {
    q: "Do I need to claim LITO?",
    a: "No. There is nothing to fill in. The ATO works out the offset after you lodge your tax return and shows it on your notice of assessment under non-refundable tax offsets.",
  },
  {
    q: "How much can I earn before paying tax with LITO?",
    a: `${m(NIL_NOW)} in ${FY}. The first ${m(TAX_FREE_THRESHOLD)} is tax-free, and the ${m(LITO.maxOffset)} offset cancels the ${Math.round(TAX_BRACKETS_2026_27[1].rate * 100)}% tax on the next slice of income. In ${PREV}, when that rate was ${Math.round(TAX_BRACKETS_2025_26[1].rate * 100)}%, the figure was ${m(NIL_PREV)}, which is why you'll still see ${m(NIL_PREV)} quoted. The Medicare levy is separate.`,
  },
  {
    q: "Is LITO included in my pay?",
    a: `Partly. The ATO's withholding tables build in some of the offset, which is why tax isn't withheld until you earn more than ${m(TFT_WITHHOLDING_STARTS_ABOVE.weekly)} a week with the tax-free threshold claimed. The rest reaches you as part of your refund, or reduces your bill, when you lodge.`,
  },
  {
    q: "Can LITO give me a refund if I owe no tax?",
    a: "No. LITO is non-refundable: it can reduce your tax to $0 but any unused amount is not paid to you. You get a refund only when your employer withheld more than your final tax.",
  },
  {
    q: "Do non-residents get LITO?",
    a: "No. LITO is only for Australian residents for tax purposes. Foreign residents pay tax from the first dollar with no tax-free threshold and no LITO.",
  },
  {
    q: "What happened to LMITO?",
    a: "The low and middle income tax offset (LMITO) was a temporary offset that applied for the 2018-19 to 2021-22 income years and was not extended. LITO is the only broad low-income offset now.",
  },
  {
    q: "Does LITO apply if I have two jobs?",
    a: `Yes. LITO is worked out on your total taxable income from all jobs and other income, not per job. With two jobs your employers can't know your total, so the result is settled when you lodge.`,
  },
  {
    q: "How much LITO do I get on $50,000?",
    a: `${m(l50.offset)}. $50,000 is in the second phase-out band: ${m(LITO_MID)} minus 1.5c for each of the ${m(50_000 - LITO.phaseOut1.end)} over ${m(LITO.phaseOut1.end)}.`,
  },
];
