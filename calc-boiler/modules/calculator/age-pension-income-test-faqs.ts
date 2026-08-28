// FAQ copy for /age-pension-income-test-calculator/. Figures from
// lib/constants/centrelink-income-test.ts (verified at Services Australia).
import { formatAUD } from "@/lib/constants";
import { AGE_PENSION, WORK_BONUS, agePensionFortnightly, assessableAfterWorkBonus } from "@/lib/constants/centrelink-income-test";

const A = AGE_PENSION;
export interface PensionFaq { q: string; a: string }

export const PENSION_FAQS: readonly PensionFaq[] = [
  {
    q: "How much can I earn before the Age Pension reduces?",
    a: `${formatAUD(A.incomeTest.single.freeArea)} a fortnight if you are single, ${formatAUD(A.incomeTest.couple.freeArea)} combined for a couple. Above that a single pension reduces by 50 cents for each dollar; each member of a couple loses 25 cents for each combined dollar. If the income is from working, the Work Bonus disregards the first ${formatAUD(WORK_BONUS.fortnightlyCredit)} a fortnight before the test.`,
  },
  {
    q: "What is the Age Pension income test cut-off?",
    a: `${formatAUD(A.publishedCutOff.single)} a fortnight single and ${formatAUD(A.publishedCutOff.coupleCombined)} combined for a couple living together (${formatAUD(A.publishedCutOff.coupleApartIllHealthCombined)} if living apart due to ill health). Above that the pension is $0 for the fortnight. The cut-off is higher if you get Rent Assistance or have Work Bonus balance, and lower if you live outside Australia.`,
  },
  {
    q: "How does the Work Bonus work?",
    a: `Every fortnight ${formatAUD(WORK_BONUS.fortnightlyCredit)} of Work Bonus credit is added to your balance, up to ${formatAUD(WORK_BONUS.maxBalance)}. When you work, the first ${formatAUD(WORK_BONUS.fortnightlyCredit)} of employment income each fortnight is disregarded, and any balance you have built up offsets what is left, before the income test applies. Earning ${formatAUD(1_000)} a fortnight with a ${formatAUD(5_000)} balance leaves ${formatAUD(assessableAfterWorkBonus(1_000, 5_000))} assessable; with no balance, ${formatAUD(assessableAfterWorkBonus(1_000, 0))}.`,
  },
  {
    q: "What is the maximum Age Pension?",
    a: `From ${A.ratesFrom}: ${formatAUD(A.maxFortnightly.single.total)} a fortnight single (${formatAUD(A.maxFortnightly.single.basic)} basic rate plus ${formatAUD(A.maxFortnightly.single.supplement)} Pension Supplement and ${formatAUD(A.maxFortnightly.single.energy)} Energy Supplement) and ${formatAUD(A.maxFortnightly.coupleEach.total)} each for a couple (${formatAUD(A.maxFortnightly.coupleCombined.total)} combined). Rates are adjusted on ${A.indexedOn}.`,
  },
  {
    q: "How much pension do I get on $1,000 a fortnight of other income?",
    a: `Single: ${formatAUD(agePensionFortnightly(1_000, "single"), 2)} a fortnight — the ${formatAUD(1_000 - A.incomeTest.single.freeArea)} over the free area reduces the ${formatAUD(A.maxFortnightly.single.total)} maximum by ${formatAUD((1_000 - A.incomeTest.single.freeArea) * 0.5, 2)}. For a couple with ${formatAUD(1_000)} combined, each partner gets ${formatAUD(agePensionFortnightly(1_000, "couple"), 2)}.`,
  },
  {
    q: "Does the calculator include the assets test and deeming?",
    a: "No. Services Australia runs both an income test and an assets test and pays the lower result, and it deems income from financial assets rather than using actual returns. Enter your deemed and other income in the 'other income' field if you know it; the assets test is outside this calculator.",
  },
  {
    q: "Is the Age Pension taxable?",
    a: "Yes. Age Pension is a taxable payment. Tax is not deducted automatically, but you can ask Services Australia to withhold it. The Seniors and Pensioners Tax Offset usually means little or no tax is payable on the pension alone.",
  },
];
