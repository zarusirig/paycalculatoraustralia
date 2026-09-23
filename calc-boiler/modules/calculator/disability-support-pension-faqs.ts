// FAQ copy for /disability-support-pension-calculator/ (G3, wave 4). Every
// figure is read from lib/constants/disability-support-pension.ts (Services
// Australia, read 24 September 2026). Also the page's FAQPage JSON-LD.
import { formatAUD } from "@/lib/constants";
import { DSP, DSP_ASSETS, DSP_CUT_OFFS_21_PLUS, DSP_INCOME_TEST, DSP_RATES_21_PLUS, DSP_UNDER_21 } from "@/lib/constants/disability-support-pension";
import type { W3Faq } from "./centrelink-w3-faqs";

const R = DSP_RATES_21_PLUS.maxFortnightly;
const IT = DSP_INCOME_TEST;

export const DSP_FAQS: W3Faq[] = [
  {
    q: "How much is the Disability Support Pension per fortnight?",
    a: `From ${DSP.ratesFrom}, the maximum DSP for a single person 21 or older is ${formatAUD(R.single.total, 2)} a fortnight (basic rate ${formatAUD(R.single.basic, 2)} plus the Pension Supplement and Energy Supplement). Each member of a couple gets up to ${formatAUD(R.coupleEach.total, 2)}, or ${formatAUD(R.coupleCombined.total, 2)} combined. Under-21s without children get lower youth rates.`,
  },
  {
    q: "How much can I earn on DSP?",
    a: `A single person can earn ${formatAUD(IT.single.freeArea)} a fortnight before DSP reduces. Above that, it drops 50 cents for each extra dollar and stops at ${formatAUD(DSP_CUT_OFFS_21_PLUS.single, 2)} a fortnight. Couples can earn ${formatAUD(IT.couple.freeArea)} combined, then each payment drops 25 cents per dollar, to a cut-off of ${formatAUD(DSP_CUT_OFFS_21_PLUS.coupleCombined, 2)} combined.`,
  },
  {
    q: "How many hours can I work on the Disability Support Pension?",
    a: `Up to ${DSP.maxWeeklyWorkHours} hours a week without losing DSP, as long as you still meet the income test. If you work ${DSP.suspensionWeeklyHours} or more hours a week on an ongoing basis, or your income is over the cut-off for more than ${DSP.nilRateFortnights} fortnights in a row, DSP can be suspended for up to ${DSP.suspensionYears} years and restored if your hours or income drop.`,
  },
  {
    q: "Is the Disability Support Pension the same as the Age Pension rate?",
    a: `For people 21 and over, yes: the maximum rates (${formatAUD(R.single.total, 2)} single, ${formatAUD(R.coupleEach.total, 2)} each for couples) and the income test are the same as the Age Pension. Both are adjusted on ${DSP.indexation.adult}.`,
  },
  {
    q: "What is the DSP rate for under 21s?",
    a: `If you are under 21 with no children, the maximum ranges from ${formatAUD(DSP_UNDER_21[0].maxFortnightly, 2)} a fortnight (single, under 18, living at home) to ${formatAUD(DSP_UNDER_21[1].maxFortnightly, 2)} (independent, or a couple). These include the Youth Disability Supplement and are updated on ${DSP.indexation.youth}. Your parents' income doesn't affect it.`,
  },
  {
    q: "What is the DSP assets limit?",
    a: `For a full pension, assets up to ${formatAUD(DSP_ASSETS.fullPension.singleHomeowner)} for a single homeowner or ${formatAUD(DSP_ASSETS.fullPension.singleNonHomeowner)} for a single non-homeowner (couples combined: ${formatAUD(DSP_ASSETS.fullPension.coupleHomeowner)} / ${formatAUD(DSP_ASSETS.fullPension.coupleNonHomeowner)}). Above that, DSP reduces by $3 a fortnight per $1,000 (single) and stops at ${formatAUD(DSP_ASSETS.cutOff.singleHomeowner)} / ${formatAUD(DSP_ASSETS.cutOff.singleNonHomeowner)}.`,
  },
  {
    q: "Is the Disability Support Pension taxable?",
    a: "Services Australia lists DSP as a taxable Centrelink payment once you are Age Pension age. If you also work, your wages are taxed as usual, so check your withholding with a take-home pay calculator.",
  },
];
