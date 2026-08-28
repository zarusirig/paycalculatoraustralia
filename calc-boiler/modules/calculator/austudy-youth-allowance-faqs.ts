// FAQ copy for /austudy-youth-allowance-calculator/. Figures from
// lib/constants/centrelink-income-test.ts (verified at Services Australia).
import { formatAUD } from "@/lib/constants";
import { AUSTUDY, STUDENT_INCOME_TEST, YOUTH_ALLOWANCE_STUDENT, studentFortnightly, studentReduction } from "@/lib/constants/centrelink-income-test";

const T = STUDENT_INCOME_TEST;
export interface StudentFaq { q: string; a: string }

export const STUDENT_FAQS: readonly StudentFaq[] = [
  {
    q: "How much can I earn on Austudy or Youth Allowance before it reduces?",
    a: `${formatAUD(T.freeArea)} a fortnight, before tax. Between ${formatAUD(T.freeArea)} and ${formatAUD(T.band1End)} the payment reduces by 50 cents per dollar; over ${formatAUD(T.band1End)} it is ${formatAUD(T.band1Reduction, 2)} plus 60 cents for each dollar. Income Bank credits, built up in fortnights you earn under ${formatAUD(T.freeArea)}, are used first.`,
  },
  {
    q: "What is the Austudy income test taper rate?",
    a: `50 cents in the dollar from ${formatAUD(T.freeArea)} to ${formatAUD(T.band1End)} a fortnight, then 60 cents in the dollar above ${formatAUD(T.band1End)}. Youth Allowance for students and Australian Apprentices uses the same bands.`,
  },
  {
    q: "How much Austudy do I get if I earn $800 a fortnight?",
    a: `Single with no children on the ${formatAUD(AUSTUDY.maxFortnightly.singleNoChildren)} rate: the reduction is ${formatAUD(studentReduction(800), 2)} (${formatAUD(T.band1Reduction, 2)} on the first band plus 60 cents on the ${formatAUD(800 - T.band1End)} over ${formatAUD(T.band1End)}), leaving ${formatAUD(studentFortnightly(AUSTUDY.maxFortnightly.singleNoChildren, 800), 2)} of Austudy plus your wages.`,
  },
  {
    q: "What is the Austudy cut-off?",
    a: `${formatAUD(AUSTUDY.publishedCutOff.singleOrCoupleNoChildren)} a fortnight for a single or partnered student with no children, ${formatAUD(AUSTUDY.publishedCutOff.coupleWithChildren)} for a member of a couple with children and ${formatAUD(AUSTUDY.publishedCutOff.singleWithChildren)} for a single with children. The long-term income support rate cuts off at ${formatAUD(AUSTUDY.publishedCutOff.longTermSingleNoChildren)} single.`,
  },
  {
    q: "What is the maximum Austudy and Youth Allowance rate?",
    a: `From ${AUSTUDY.ratesFrom}: Austudy ${formatAUD(AUSTUDY.maxFortnightly.singleNoChildren)} single or partnered with no children, ${formatAUD(AUSTUDY.maxFortnightly.singleWithChildren)} single with children, ${formatAUD(AUSTUDY.maxFortnightly.coupleWithChildren)} partnered with children. Youth Allowance (students) ranges from ${formatAUD(YOUTH_ALLOWANCE_STUDENT.maxFortnightly.under18AtHome)} for a single under 18 living at home to ${formatAUD(YOUTH_ALLOWANCE_STUDENT.maxFortnightly.awayFromHome)} living away from home and ${formatAUD(YOUTH_ALLOWANCE_STUDENT.maxFortnightly.singleWithChildren)} single with children. Rates are indexed on ${AUSTUDY.indexedOn}.`,
  },
  {
    q: "What happens if my income keeps the payment at $0?",
    a: `If the income test reduces your payment to $0 for ${T.cancelAfterZeroFortnights} fortnights in a row, the payment is cancelled and you have to reapply if your income later drops.`,
  },
  {
    q: "Are Austudy and Youth Allowance taxable?",
    a: "Yes, for students and apprentices 16 or older. Both are taxable Centrelink payments and count with your wages in your tax return; the tax-free threshold usually covers most or all of it, but check with the take-home pay calculator if you also work.",
  },
];
