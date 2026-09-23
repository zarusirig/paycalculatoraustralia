// FAQ copy for /austudy-youth-allowance-calculator/. Figures from
// lib/constants/centrelink-income-test.ts (verified at Services Australia).
import { formatAUD } from "@/lib/constants";
import { AUSTUDY, STUDENT_INCOME_TEST, YOUTH_ALLOWANCE_JOBSEEKER, YOUTH_ALLOWANCE_STUDENT, studentFortnightly, studentReduction } from "@/lib/constants/centrelink-income-test";

const YA = YOUTH_ALLOWANCE_STUDENT.maxFortnightly;
const YJ = YOUTH_ALLOWANCE_JOBSEEKER;

const T = STUDENT_INCOME_TEST;
export interface StudentFaq { q: string; a: string }

export const STUDENT_FAQS: readonly StudentFaq[] = [
  {
    q: "How much is Youth Allowance a fortnight?",
    a: `Up to ${formatAUD(YA.under18AtHome, 2)} if you're under 18 and live at a parent's home, ${formatAUD(YA.over18AtHome, 2)} if you're 18 or older at home, ${formatAUD(YA.awayFromHome, 2)} if you live away from home, ${formatAUD(YA.singleWithChildren, 2)} single with children and ${formatAUD(YA.coupleWithChildren, 2)} in a couple with children. Student rates apply from ${YOUTH_ALLOWANCE_STUDENT.ratesFrom}; job seekers get the same rates. Your income, your partner's and (if you're dependent) your parents' can reduce it.`,
  },
  {
    q: "Who is eligible for Youth Allowance?",
    a: `Students and Australian Apprentices: 18 to 24 and studying full time, 16 to 24 in a full-time apprenticeship, or 16–17 and independent, needing to live away from home to study, or studying full time after finishing year 12. Job seekers: ${YJ.minAge} to ${YJ.maxAge}, and unemployed and looking for work, or temporarily unable to work or study because of illness or injury. Everyone must meet the residence rules and the income and assets tests.`,
  },
  {
    q: "How much can I earn on Youth Allowance as a job seeker?",
    a: `Your payment starts reducing once your income passes ${formatAUD(YJ.freeArea)} a fortnight. It reaches $0 at ${formatAUD(YJ.publishedCutOff.under18AtHome, 2)} a fortnight if you're under 18 at home, ${formatAUD(YJ.publishedCutOff.over18AtHome, 2)} if you're 18 or older at home, and ${formatAUD(YJ.publishedCutOff.awayFromHome, 2)} if you live away from home. Students have a much bigger free area — ${formatAUD(T.freeArea)} a fortnight.`,
  },
  {
    q: "Do my parents' incomes affect my Youth Allowance?",
    a: "Yes, if Services Australia assesses you as dependent — a parental means test then applies alongside your own income test, and your parents' taxable income is reassessed each year. If you're independent, your parents' income doesn't count — for example, Services Australia treats a job seeker as independent once they have lived with a partner for 12 months. This calculator covers your own income only.",
  },
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
