// FAQ copy for /family-tax-benefit-calculator/. Every figure is read from
// lib/constants/centrelink-family-payments.ts (verified at Services Australia,
// 23 September 2026). These strings are also the page's FAQPage JSON-LD.
import { formatAUD } from "@/lib/constants";
import { FTB_A, FTB_B, ftbA } from "@/lib/constants/centrelink-family-payments";

const A = FTB_A;
const B = FTB_B;
const TWO_KIDS_100K = ftbA(100_000, { age0to12: 2, age13to19: 0 });

export interface FtbFaq { q: string; a: string }

export const FTB_FAQS: readonly FtbFaq[] = [
  {
    q: "How much is Family Tax Benefit Part A?",
    a: `For ${A.financialYear}, the maximum rate is ${formatAUD(A.maxFortnightly.age0to12, 2)} a fortnight for each child aged 0 to 12 and ${formatAUD(A.maxFortnightly.age13to19, 2)} for each child aged 13 to 15, or 16 to 19 in secondary study. The base rate is ${formatAUD(A.baseFortnightly, 2)} per child. On top, an FTB Part A supplement of up to ${formatAUD(A.supplementAnnual, 2)} per child is paid after the year is balanced, if your family income is ${formatAUD(A.supplementIncomeLimit)} or less.`,
  },
  {
    q: "What is the income limit for Family Tax Benefit Part A?",
    a: `You get the maximum rate if your family's adjusted taxable income is ${formatAUD(A.lowerThreshold)} or less. Above that it reduces by 20 cents per dollar until it reaches the base rate, then holds there until ${formatAUD(A.higherThreshold)}, above which it reduces by 30 cents per dollar. With one child, FTB Part A stops at ${formatAUD(A.publishedNilLimit.oneChild)}; with two children aged 0–12, at ${formatAUD(A.publishedNilLimit.twoChildren0to12)}; with three, at ${formatAUD(A.publishedNilLimit.threeChildren0to12)}.`,
  },
  {
    q: "How much is Family Tax Benefit Part B?",
    a: `For ${B.financialYear}, the maximum is ${formatAUD(B.maxFortnightly.youngestUnder5, 2)} a fortnight per family when the youngest child is under 5, and ${formatAUD(B.maxFortnightly.youngest5to18, 2)} when the youngest is 5 to 18. There is also a yearly FTB Part B supplement of up to ${formatAUD(B.supplementAnnual, 2)} per family.`,
  },
  {
    q: "What is the income limit for FTB Part B?",
    a: `Single parents get the maximum rate if their adjusted taxable income is ${formatAUD(B.primaryEarnerLimit)} or less, and nothing above it. Couples can only get FTB Part B while the youngest child is under ${B.coupleYoungestUnder}, and only if the higher earner earns ${formatAUD(B.primaryEarnerLimit)} or less. The lower earner can earn ${formatAUD(B.secondaryFreeArea)} a year before it reduces by 20 cents per dollar; it stops at ${formatAUD(B.publishedSecondaryLimit.youngestUnder5)} if the youngest is under 5, or ${formatAUD(B.publishedSecondaryLimit.youngest5to12)} if the youngest is 5 to 12.`,
  },
  {
    q: "How much FTB will we get on $100,000 with two kids?",
    a: `Two children aged 0–12 on a family income of ${formatAUD(100_000)}: FTB Part A is about ${formatAUD(TWO_KIDS_100K.fortnightly, 2)} a fortnight (${formatAUD(TWO_KIDS_100K.annualExSupplement)} a year), down from the ${formatAUD(2 * A.maxFortnightly.age0to12, 2)} maximum by 20 cents for every dollar over ${formatAUD(A.lowerThreshold)}. No supplement is paid over ${formatAUD(A.supplementIncomeLimit)}. FTB Part B depends on who earns the ${formatAUD(100_000)}: a single-income couple with a child under 5 would get the full ${formatAUD(B.maxFortnightly.youngestUnder5, 2)} a fortnight.`,
  },
  {
    q: "Does working more reduce Family Tax Benefit?",
    a: `It can. Between ${formatAUD(A.lowerThreshold)} and the base-rate point, every extra dollar of family income reduces Part A by 20 cents, and above ${formatAUD(A.higherThreshold)} by 30 cents. For couples, extra income earned by the lower earner above ${formatAUD(B.secondaryFreeArea)} a year also reduces Part B by 20 cents per dollar. FTB is paid on your estimate and balanced against your tax return, so update your estimate when your hours change to avoid a debt.`,
  },
  {
    q: "What is adjusted taxable income for FTB?",
    a: "Adjusted taxable income is your taxable income plus certain other amounts, such as reportable fringe benefits, reportable super contributions (including salary sacrifice), net investment losses, tax-free pensions and foreign income. For FTB Part A it is your family's combined figure. Services Australia's 'What adjusted taxable income is' page lists every component.",
  },
  {
    q: "Is Family Tax Benefit taxable?",
    a: "No. Family Tax Benefit is not taxable income, so it doesn't go in your tax return. It is still income-tested against your family's adjusted taxable income, and the year is balanced once everyone who needs to has lodged a tax return.",
  },
  {
    q: "Can I get FTB if I get Parenting Payment?",
    a: `Yes. If you or your partner get an income support payment such as Parenting Payment or JobSeeker, and it isn't reduced to $0 by employment income, you can get the maximum rate of FTB Part A without the income test. The ${formatAUD(A.supplementIncomeLimit)} income test for the supplement still applies.`,
  },
];
