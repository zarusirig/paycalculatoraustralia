// FAQ copy for /age-pension-income-test-calculator/. Figures from
// lib/constants/centrelink-income-test.ts (Services Australia for the
// 20 March 2026 set, the DSS rates list for the 20 September 2026 set).
//
// These strings are also the page's FAQPage JSON-LD, generated at build time on
// a static export, so they must not depend on the clock. Answers that quote a
// rate carry BOTH dated figures instead.
import { formatAUD } from "@/lib/constants";
import {
  AGE_PENSION_INCOME_TEST,
  AGE_PENSION_RATES,
  MARCH_2026,
  SEPTEMBER_2026,
  WORK_BONUS,
  agePensionFortnightly,
  assessableAfterWorkBonus,
} from "@/lib/constants/centrelink-income-test";

const IT = AGE_PENSION_INCOME_TEST;
const MAR = AGE_PENSION_RATES[MARCH_2026];
const SEP = AGE_PENSION_RATES[SEPTEMBER_2026];

export interface PensionFaq { q: string; a: string }

export const PENSION_FAQS: readonly PensionFaq[] = [
  {
    q: "How much can I earn before the Age Pension reduces?",
    a: `${formatAUD(IT.single.freeArea)} a fortnight if you are single, ${formatAUD(IT.couple.freeArea)} combined for a couple. Above that a single pension reduces by 50 cents for each dollar; each member of a couple loses 25 cents for each combined dollar. The free areas and tapers are not changed by the 20 September 2026 indexation. If the income is from working, the Work Bonus disregards the first ${formatAUD(WORK_BONUS.fortnightlyCredit)} a fortnight before the test.`,
  },
  {
    q: "What is the Age Pension income test cut-off?",
    a: `To 19 September 2026: ${formatAUD(MAR.publishedCutOff.single)} a fortnight single and ${formatAUD(MAR.publishedCutOff.coupleCombined)} combined for a couple living together (${formatAUD(MAR.publishedCutOff.coupleApartIllHealthCombined)} if living apart due to ill health). From 20 September 2026, with the higher maximum rates: ${formatAUD(SEP.publishedCutOff.single)} single and ${formatAUD(SEP.publishedCutOff.coupleCombined)} combined (${formatAUD(SEP.publishedCutOff.coupleApartIllHealthCombined)} apart due to ill health). Above the cut-off the pension is $0 for the fortnight. It is higher if you get Rent Assistance or have Work Bonus balance, and lower if you live outside Australia.`,
  },
  {
    q: "How much will the Age Pension go up on 20 September 2026?",
    a: `A single pensioner goes from ${formatAUD(MAR.maxFortnightly.single.total)} to ${formatAUD(SEP.maxFortnightly.single.total)} a fortnight, up ${formatAUD(SEP.maxFortnightly.single.total - MAR.maxFortnightly.single.total, 2)}. Each member of a couple goes from ${formatAUD(MAR.maxFortnightly.coupleEach.total)} to ${formatAUD(SEP.maxFortnightly.coupleEach.total)}, or ${formatAUD(MAR.maxFortnightly.coupleCombined.total)} to ${formatAUD(SEP.maxFortnightly.coupleCombined.total)} combined. The increase is in the basic rate (${formatAUD(MAR.maxFortnightly.single.basic)} to ${formatAUD(SEP.maxFortnightly.single.basic)} single) and the Pension Supplement; the ${formatAUD(SEP.maxFortnightly.single.energy)} Energy Supplement is flat and does not index.`,
  },
  {
    q: "How does the Work Bonus work?",
    a: `Every fortnight ${formatAUD(WORK_BONUS.fortnightlyCredit)} of Work Bonus credit is added to your balance, up to ${formatAUD(WORK_BONUS.maxBalance)}. When you work, the first ${formatAUD(WORK_BONUS.fortnightlyCredit)} of employment income each fortnight is disregarded, and any balance you have built up offsets what is left, before the income test applies. Earning ${formatAUD(1_000)} a fortnight with a ${formatAUD(5_000)} balance leaves ${formatAUD(assessableAfterWorkBonus(1_000, 5_000))} assessable; with no balance, ${formatAUD(assessableAfterWorkBonus(1_000, 0))}. The credit and the maximum balance are set in legislation and are not indexed in September.`,
  },
  {
    q: "What is the maximum Age Pension?",
    a: `To 19 September 2026: ${formatAUD(MAR.maxFortnightly.single.total)} a fortnight single (${formatAUD(MAR.maxFortnightly.single.basic)} basic rate plus ${formatAUD(MAR.maxFortnightly.single.supplement)} Pension Supplement and ${formatAUD(MAR.maxFortnightly.single.energy)} Energy Supplement) and ${formatAUD(MAR.maxFortnightly.coupleEach.total)} each for a couple (${formatAUD(MAR.maxFortnightly.coupleCombined.total)} combined). From 20 September 2026: ${formatAUD(SEP.maxFortnightly.single.total)} single (${formatAUD(SEP.maxFortnightly.single.basic)} plus ${formatAUD(SEP.maxFortnightly.single.supplement)} and ${formatAUD(SEP.maxFortnightly.single.energy)}) and ${formatAUD(SEP.maxFortnightly.coupleEach.total)} each (${formatAUD(SEP.maxFortnightly.coupleCombined.total)} combined). Rates are adjusted on 20 March and 20 September.`,
  },
  {
    q: "How much pension do I get on $1,000 a fortnight of other income?",
    a: `Single, to 19 September 2026: ${formatAUD(agePensionFortnightly(1_000, "single", MAR), 2)} a fortnight — the ${formatAUD(1_000 - IT.single.freeArea)} over the free area reduces the ${formatAUD(MAR.maxFortnightly.single.total)} maximum by ${formatAUD((1_000 - IT.single.freeArea) * 0.5, 2)}. From 20 September 2026 the same income leaves ${formatAUD(agePensionFortnightly(1_000, "single", SEP), 2)}. For a couple with ${formatAUD(1_000)} combined, each partner gets ${formatAUD(agePensionFortnightly(1_000, "couple", MAR), 2)}, or ${formatAUD(agePensionFortnightly(1_000, "couple", SEP), 2)} from 20 September.`,
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
