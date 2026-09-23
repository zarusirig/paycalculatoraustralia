import { SITE_CONFIG, formatAUD } from "@/lib/constants";
import { NO_TFN_RATES, PAYG_FINANCIAL_YEAR, calculatePAYGWithholding } from "@/lib/constants/payg-withholding";
import { TFT_WITHHOLDING_STARTS_ABOVE } from "@/lib/constants/tax-free-threshold";
import { estimateYearEnd } from "@/lib/constants/tax-rates-reference";

// Shared by the page body and the FAQPage JSON-LD so the two cannot disagree.
// Withholding figures come from the Schedule 1/8 engine in payg-withholding.ts
// (reproduces the ATO's sample data); year-end figures from
// tax-rates-reference.ts.

const FY = SITE_CONFIG.financialYear;
const m = (n: number) => formatAUD(n);

export const EXAMPLE = estimateYearEnd({ grossPerPeriod: 2_000, frequency: "fortnightly", claimsTaxFreeThreshold: true, hasStudyLoan: false });
const w1000 = calculatePAYGWithholding(1_000, "weekly");
const w1000NoTft = calculatePAYGWithholding(1_000, "weekly", { claimsTaxFreeThreshold: false });
const f2000Help = calculatePAYGWithholding(2_000, "fortnightly", { hasSTSL: true });

export const TAX_WITHHELD_FAQS: readonly { q: string; a: string }[] = [
  {
    q: `How much tax is withheld from $1,000 a week in ${FY}?`,
    a: `${m(w1000.totalWithheld)} if you've claimed the tax-free threshold, leaving ${m(w1000.netPerPeriod)}. Without the threshold (a second job) it's ${m(w1000NoTft.totalWithheld)}. These are the ATO's Schedule 1 amounts for payments from 1 July 2026, and they include the 2% Medicare levy.`,
  },
  {
    q: "How is PAYG tax withheld calculated?",
    a: "Your employer converts your pay to a weekly amount (ignoring cents and adding 99c), applies the ATO's Schedule 1 formula for your scale (y = a × x − b), rounds to the nearest dollar, then converts back to your pay period. The scale depends on whether you claimed the tax-free threshold, are a foreign resident, or didn't give a TFN. A study loan adds a separate Schedule 8 amount.",
  },
  {
    q: "Will I get a tax refund?",
    a: `Possibly. Withholding is an estimate paid in advance; your actual tax is worked out when you lodge. If you're paid the same all year with the threshold claimed, withholding usually comes out close to your tax, often a little over. On ${m(EXAMPLE.perPeriod.grossPerPeriod)} a fortnight, ${m(EXAMPLE.annualWithheld)} is withheld over the year against about ${m(EXAMPLE.liability)} of tax and Medicare levy. Deductions make a refund more likely; a second job or other income without tax withheld makes a bill more likely.`,
  },
  {
    q: "Why is tax withheld from my pay when I earn under $18,200?",
    a: `With the tax-free threshold claimed, tax isn't withheld until you earn more than ${m(TFT_WITHHOLDING_STARTS_ABOVE.weekly)} a week, ${m(TFT_WITHHOLDING_STARTS_ABOVE.fortnightly)} a fortnight or ${m(TFT_WITHHOLDING_STARTS_ABOVE.monthly)} a month. If tax is being taken from pays below that, you probably haven't claimed the threshold with that employer, or they're using the no-TFN rate. Anything over-withheld comes back when you lodge.`,
  },
  {
    q: "How much extra is withheld for HECS-HELP?",
    a: `It depends on your pay: nothing below the repayment threshold, then a marginal amount on the income above it. On ${m(2_000)} a fortnight with the threshold claimed the study loan component is ${m(f2000Help.stslWithheld)}. The calculator above shows your amount; the compulsory repayment itself is worked out on your full-year repayment income when you lodge.`,
  },
  {
    q: "What if I don't give my employer a TFN?",
    a: `They must withhold at ${Math.round(NO_TFN_RATES.resident * 100)}% (${Math.round(NO_TFN_RATES.foreignResident * 100)}% for a foreign resident), ignoring cents. You get the excess back when you lodge, but it's a large cash-flow hit, so give your TFN declaration to your employer when you start.`,
  },
  {
    q: "Is the tax withheld the same as the tax I pay?",
    a: "No. Tax withheld is money your employer sends to the ATO on your behalf during the year. Your tax is calculated at the end of the year on your total taxable income, after deductions and offsets. The difference is your refund or your bill.",
  },
  {
    q: `Which tax tables are used for ${FY}?`,
    a: `The ATO's Schedule 1 statement of formulas (NAT 1004) for payments made from 1 July 2026, and Schedule 8 for study and training loans. The weekly, fortnightly and monthly tax tables are printed from the same formulas. This calculator uses the ${PAYG_FINANCIAL_YEAR} coefficients.`,
  },
];
