// FAQ copy for /jobseeker-payment-calculator/. Figures come from
// lib/constants/centrelink-income-test.ts (verified at Services Australia and,
// for the 20 September 2026 set, the DSS rates list).
//
// These strings are also the page's FAQPage JSON-LD, which is generated at
// build time on a static export — so they must not depend on the clock. Every
// answer that quotes a rate carries BOTH dated figures instead, which reads
// correctly on either side of 20 September 2026.
import { formatAUD } from "@/lib/constants";
import {
  JOBSEEKER_INCOME_TEST,
  JOBSEEKER_RATES,
  MARCH_2026,
  SEPTEMBER_2026,
  jobseekerFortnightly,
  jobseekerReduction,
} from "@/lib/constants/centrelink-income-test";

const T = JOBSEEKER_INCOME_TEST;
const MAR = JOBSEEKER_RATES[MARCH_2026];
const SEP = JOBSEEKER_RATES[SEPTEMBER_2026];
const AT_600_MAR = jobseekerFortnightly(MAR.maxFortnightly.single, 600);
const AT_600_SEP = jobseekerFortnightly(SEP.maxFortnightly.single, 600);

export interface JobseekerFaq { q: string; a: string }

export const JOBSEEKER_FAQS: readonly JobseekerFaq[] = [
  {
    q: "How much can I earn before JobSeeker reduces?",
    a: `${formatAUD(T.freeArea)} a fortnight. Above that your payment reduces by 50 cents for each dollar up to ${formatAUD(T.band1End)}, then 60 cents for each dollar over ${formatAUD(T.band1End)}. The free area and the tapers are unchanged by the 20 September 2026 indexation. Working credits, built up in fortnights when you earn under ${formatAUD(T.workingCreditThreshold)}, can cover some income before the test applies.`,
  },
  {
    q: "How much JobSeeker do I get if I work part-time?",
    a: `Single with no children earning ${formatAUD(600)} a fortnight: the reduction is ${formatAUD(jobseekerReduction(600))} (${formatAUD(53)} on the first band plus ${formatAUD(0.6 * 344)} at 60 cents). On the ${formatAUD(MAR.maxFortnightly.single)} maximum paid to 19 September 2026 you keep ${formatAUD(AT_600_MAR)} of JobSeeker; on the ${formatAUD(SEP.maxFortnightly.single)} maximum from 20 September 2026 you keep ${formatAUD(AT_600_SEP)}. Your ${formatAUD(600)} wages are on top either way.`,
  },
  {
    q: "What is the JobSeeker cut-off point?",
    a: `To 19 September 2026: ${formatAUD(MAR.publishedCutOff.single)} a fortnight for a single person with no children, ${formatAUD(MAR.publishedCutOff.singleOver55LongTerm)} if you are 55 or older after 9 months on payment, and ${formatAUD(MAR.publishedCutOff.principalCarer)} for a single principal carer. From 20 September 2026 those become ${formatAUD(SEP.publishedCutOff.single)}, ${formatAUD(SEP.publishedCutOff.singleOver55LongTerm)} and ${formatAUD(SEP.publishedCutOff.principalCarer)}. Earn more than that in a fortnight and you are paid $0 for it — unless working credits cover part of the income.`,
  },
  {
    q: "How much will JobSeeker go up on 20 September 2026?",
    a: `A single person with no children goes from ${formatAUD(MAR.maxFortnightly.single)} to ${formatAUD(SEP.maxFortnightly.single)} a fortnight, up ${formatAUD(SEP.maxFortnightly.single - MAR.maxFortnightly.single, 2)}. Single with a dependent child, aged 55+ after 9 months, or with a partial capacity to work: ${formatAUD(MAR.maxFortnightly.singleWithChildren)} to ${formatAUD(SEP.maxFortnightly.singleWithChildren)}. Partnered (each): ${formatAUD(MAR.maxFortnightly.partnered)} to ${formatAUD(SEP.maxFortnightly.partnered)}. Single principal carers exempt from mutual obligations: ${formatAUD(MAR.maxFortnightly.principalCarerExempt)} to ${formatAUD(SEP.maxFortnightly.principalCarerExempt)}. The first payment at the new rate covers the fortnight that starts on or after 20 September.`,
  },
  {
    q: "What is the maximum JobSeeker Payment?",
    a: `To 19 September 2026: ${formatAUD(MAR.maxFortnightly.single)} a fortnight single with no children; ${formatAUD(MAR.maxFortnightly.singleWithChildren)} single with a dependent child, aged 55+ after 9 months, or with a partial capacity to work; ${formatAUD(MAR.maxFortnightly.partnered)} partnered; ${formatAUD(MAR.maxFortnightly.principalCarerExempt)} for a single principal carer exempt from mutual obligations. From 20 September 2026: ${formatAUD(SEP.maxFortnightly.single)}, ${formatAUD(SEP.maxFortnightly.singleWithChildren)}, ${formatAUD(SEP.maxFortnightly.partnered)} and ${formatAUD(SEP.maxFortnightly.principalCarerExempt)}. Rates are indexed on 20 March and 20 September.`,
  },
  {
    q: "Does my partner's income affect my JobSeeker?",
    a: `Yes. If your partner does not get a pension, your payment reduces by 60 cents for each dollar they earn over ${formatAUD(MAR.partnerIncomeLimit.partner22ToPensionAge)} a fortnight, rising to ${formatAUD(SEP.partnerIncomeLimit.partner22ToPensionAge)} from 20 September 2026. The under-22 limits do not change on 20 September: ${formatAUD(MAR.partnerIncomeLimit.partnerUnder22NoChildren)} if they are under 22 with no children, ${formatAUD(MAR.partnerIncomeLimit.partnerUnder22WithChildren)} under 22 with children. Your own income is tested separately.`,
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
