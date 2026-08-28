// FAQ copy for /jobseeker-payment-calculator/. Figures come from
// lib/constants/centrelink-income-test.ts (verified at Services Australia).
import { formatAUD } from "@/lib/constants";
import { JOBSEEKER, jobseekerFortnightly, jobseekerReduction } from "@/lib/constants/centrelink-income-test";

const J = JOBSEEKER;
const AT_600 = jobseekerFortnightly(J.maxFortnightly.single, 600);

export interface JobseekerFaq { q: string; a: string }

export const JOBSEEKER_FAQS: readonly JobseekerFaq[] = [
  {
    q: "How much can I earn before JobSeeker reduces?",
    a: `${formatAUD(J.incomeTest.freeArea)} a fortnight. Above that your payment reduces by 50 cents for each dollar up to ${formatAUD(J.incomeTest.band1End)}, then 60 cents for each dollar over ${formatAUD(J.incomeTest.band1End)}. Working credits, built up in fortnights when you earn under ${formatAUD(J.incomeTest.workingCreditThreshold)}, can cover some income before the test applies.`,
  },
  {
    q: "How much JobSeeker do I get if I work part-time?",
    a: `Single with no children on the ${formatAUD(J.maxFortnightly.single)} maximum rate, earning ${formatAUD(600)} a fortnight: the reduction is ${formatAUD(jobseekerReduction(600))} (${formatAUD(53)} on the first band plus ${formatAUD(0.6 * 344)} at 60 cents), so you keep ${formatAUD(AT_600)} of JobSeeker plus your ${formatAUD(600)} wages.`,
  },
  {
    q: "What is the JobSeeker cut-off point?",
    a: `${formatAUD(J.publishedCutOff.single)} a fortnight for a single person with no children, ${formatAUD(J.publishedCutOff.singleOver55LongTerm)} if you are 55 or older after 9 months on payment, and ${formatAUD(J.publishedCutOff.principalCarer)} for a single principal carer. Earn more than that in a fortnight and you are paid $0 for it — unless working credits cover part of the income.`,
  },
  {
    q: "What is the maximum JobSeeker Payment?",
    a: `From ${J.ratesFrom}: ${formatAUD(J.maxFortnightly.single)} a fortnight single with no children; ${formatAUD(J.maxFortnightly.singleWithChildren)} single with a dependent child, aged 55+ after 9 months, or with a partial capacity to work; ${formatAUD(J.maxFortnightly.partnered)} partnered; ${formatAUD(J.maxFortnightly.principalCarerExempt)} for a single principal carer exempt from mutual obligations. Rates are indexed on ${J.indexedOn}.`,
  },
  {
    q: "Does my partner's income affect my JobSeeker?",
    a: `Yes. If your partner does not get a pension, your payment reduces by 60 cents for each dollar they earn over ${formatAUD(J.partnerIncomeLimit.partner22ToPensionAge)} a fortnight (${formatAUD(J.partnerIncomeLimit.partnerUnder22NoChildren)} if they are under 22 with no children, ${formatAUD(J.partnerIncomeLimit.partnerUnder22WithChildren)} under 22 with children). Your own income is tested separately.`,
  },
  {
    q: "Is JobSeeker taxable?",
    a: "Yes. JobSeeker Payment is taxable income. Services Australia can withhold tax from it if you ask, which helps avoid a bill at tax time when you also have wages.",
  },
  {
    q: "Do I report gross or net wages to Centrelink?",
    a: "Gross — your pay before tax, and in the fortnight it is paid. The calculator uses the same gross fortnightly figure. If you are paid weekly, add the two pays that fall in the reporting fortnight.",
  },
];
