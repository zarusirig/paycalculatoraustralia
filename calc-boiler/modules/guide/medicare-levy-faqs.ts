// Shared FAQ copy for /medicare-levy/.
//
// Read by both the rendered accordion and the FAQPage JSON-LD so the
// structured data cannot drift from the visible page. Every figure is
// interpolated from constants — none are typed as literals here.

import { MEDICARE_LEVY, formatAUD, formatPercent } from "@/lib/constants";
import {
  MEDICARE_LEVY_INCOME_YEAR,
  MEDICARE_LEVY_SENIORS,
  MLS_CHILD_INCREMENT,
  MLS_INCOME_YEAR,
  calculateMedicareLevyDetailed,
  familyLowerThreshold,
  upperThreshold,
} from "@/lib/constants/medicare-levy-extra";

const RATE = formatPercent(MEDICARE_LEVY.rate, 0);
const SHADE = formatPercent(MEDICARE_LEVY.shadeInRate, 0);
const LOWER = formatAUD(MEDICARE_LEVY.lowIncomeThreshold);
const UPPER = formatAUD(MEDICARE_LEVY.shadeInThreshold);
const FAMILY = formatAUD(MEDICARE_LEVY.familyThreshold);
const FAMILY_UPPER = formatAUD(upperThreshold(MEDICARE_LEVY.familyThreshold));
const CHILD = formatAUD(MEDICARE_LEVY.additionalChild);
const SENIOR_SINGLE = formatAUD(MEDICARE_LEVY_SENIORS.singleThreshold);
const SENIOR_SINGLE_UPPER = formatAUD(upperThreshold(MEDICARE_LEVY_SENIORS.singleThreshold));
const SENIOR_FAMILY = formatAUD(MEDICARE_LEVY_SENIORS.familyThreshold);
const MLS_BASE = formatAUD(MEDICARE_LEVY.surcharge.tier1.min - 1);
const MLS_FAMILY_BASE = formatAUD(MEDICARE_LEVY.surcharge.familyTier1.min - 1);

// Worked answers come out of the engine, so they cannot contradict the
// calculator sitting above them on the page.
const ANGIE = calculateMedicareLevyDetailed({
  taxableIncome: 29_000,
  hasSpouse: false,
  spouseTaxableIncome: 0,
  dependentChildren: 0,
  seniorPensioner: false,
});
const AT_100K = calculateMedicareLevyDetailed({
  taxableIncome: 100_000,
  hasSpouse: false,
  spouseTaxableIncome: 0,
  dependentChildren: 0,
  seniorPensioner: false,
});

export interface MedicareLevyFaq {
  q: string;
  a: string;
}

export const MEDICARE_LEVY_FAQS: readonly MedicareLevyFaq[] = [
  {
    q: "How do I calculate the Medicare levy?",
    a: `Start with your taxable income, not your gross salary. If it is at or under ${LOWER} you pay nothing. If it is between ${LOWER} and ${UPPER} you pay ${SHADE} of the amount over ${LOWER} — the shade-in. Above ${UPPER} you pay the full ${RATE}. On ${formatAUD(100_000)} that is ${formatAUD(AT_100K.levy)}. The calculator at the top of this page runs the same steps, including the family and seniors thresholds.`,
  },
  {
    q: "How much is the Medicare levy on $29,000?",
    a: `${formatAUD(ANGIE.levy, 2)}, not ${formatAUD(29_000 * MEDICARE_LEVY.rate)}. This is the ATO's own worked example. ${formatAUD(29_000)} sits inside the shade-in band, so the levy is ${SHADE} of the ${formatAUD(29_000 - MEDICARE_LEVY.lowIncomeThreshold)} above the ${LOWER} threshold. Any calculator that charges a flat ${RATE} from the first dollar overstates the levy for everyone earning between ${LOWER} and ${UPPER}.`,
  },
  {
    q: "What income do you start paying the Medicare levy at?",
    a: `${LOWER} of taxable income for most people. Between ${LOWER} and ${UPPER} you pay a reduced levy; the full ${RATE} only applies above ${UPPER}. If you are entitled to the seniors and pensioners tax offset the thresholds are ${SENIOR_SINGLE} and ${SENIOR_SINGLE_UPPER}. Families are tested on combined taxable income against ${FAMILY}, plus ${CHILD} for each dependent child.`,
  },
  {
    q: "What is the Medicare levy family threshold?",
    a: `${FAMILY} of combined family taxable income, rising by ${CHILD} for each dependent child. Below it no levy is payable by either partner. Between ${FAMILY} and ${FAMILY_UPPER} a family reduction cuts the levy, and it is applied on top of any low-income reduction you already qualify for individually. A family with two children has a threshold of ${formatAUD(familyLowerThreshold(2, false))}.`,
  },
  {
    q: "Do pensioners pay the Medicare levy?",
    a: `Often not. If you are entitled to at least $1 of the seniors and pensioners tax offset (SAPTO), your Medicare levy threshold rises to ${SENIOR_SINGLE} single or ${SENIOR_FAMILY} for a family, well above the ${LOWER} that applies to everyone else. The catch is that the concession follows SAPTO entitlement, not age: SAPTO for singles cuts out at ${formatAUD(MEDICARE_LEVY_SENIORS.saptoSingleCutOut)} of rebate income, and once your entitlement reaches zero you fall back to the ordinary thresholds.`,
  },
  {
    q: "Is the Medicare levy the same as the Medicare levy surcharge?",
    a: `No, and they are charged for different reasons. The Medicare levy is ${RATE} and almost every Australian resident pays it. The Medicare levy surcharge is an extra 1%, 1.25% or 1.5% charged only to higher earners who do not hold private patient hospital cover — above ${MLS_BASE} for singles and ${MLS_FAMILY_BASE} for families in ${MLS_INCOME_YEAR}. You can owe both at once. Buying hospital cover removes the surcharge and changes the levy by nothing at all.`,
  },
  {
    q: "How do I avoid the Medicare levy surcharge?",
    a: `Hold a compliant private patient hospital policy for the whole income year. Extras-only cover does not count — it must include hospital treatment. The surcharge is worked out day by day, so a policy that starts in October still leaves you liable for July to September. Nothing removes the ${RATE} levy itself; the surcharge is the only part hospital cover touches.`,
  },
  {
    q: "What income counts for the Medicare levy surcharge?",
    a: `Income for surcharge purposes is wider than taxable income. It adds reportable fringe benefits, total net investment losses including negative gearing, and reportable super contributions. That is why salary sacrificing into super does not get you under the threshold — the sacrificed amount is added straight back. If you have a spouse, the tier is decided on your combined income, and the family threshold rises by ${formatAUD(MLS_CHILD_INCREMENT)} for each dependent child after the first.`,
  },
  {
    q: "Who is exempt from the Medicare levy?",
    a: `Three groups. Blind pensioners and holders of a DVA Gold Card or equivalent Defence Force entitlement claim a Category 1 medical exemption. Foreign residents pay nothing for any period they were not an Australian resident for tax purposes. Temporary residents not entitled to Medicare benefits can get a Medicare Entitlement Statement from Services Australia and claim an exemption. People from reciprocal health care agreement countries such as the UK, New Zealand and Ireland are entitled to Medicare and do pay the levy.`,
  },
  {
    q: "What is a half Medicare levy exemption?",
    a: `A Category 1 medical exemption drops from full to half where you have at least one dependant — usually a spouse — who is neither in an exemption category nor liable for the levy themselves. You then pay half the levy you otherwise would. Where both partners would be liable and one is exempt, a signed family agreement decides who claims the full exemption and who claims the half. Shared care splits by day: half for days you had care of the child, full for days you did not.`,
  },
  {
    q: "Does the Medicare levy come out of my pay?",
    a: `Yes, but not as its own line. Employers use the ATO's PAYG withholding tables, which bundle the ${RATE} levy into the single "tax withheld" figure on your payslip. The surcharge is different — it is not withheld at all unless you ask for an upward variation, so people who cross the ${MLS_BASE} threshold without hospital cover usually meet it as a bill at lodgment.`,
  },
  {
    q: "Which income year do these Medicare levy thresholds apply to?",
    a: `The low-income, family and seniors thresholds on this page are the ATO's ${MEDICARE_LEVY_INCOME_YEAR} figures — the return being lodged now — and are the most recent published. ${MLS_INCOME_YEAR} levy thresholds had not been released when this page was last verified. The surcharge tiers are different: they are published for ${MLS_INCOME_YEAR} and are shown on that basis. The ${RATE} rate itself has not changed since 1 July 2014.`,
  },
] as const;
