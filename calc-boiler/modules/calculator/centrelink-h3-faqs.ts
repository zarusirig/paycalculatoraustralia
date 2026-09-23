// FAQ copy for the H3 Centrelink pages (assets test, deeming, DSP, Child Care
// Subsidy, Commonwealth Seniors Health Card). Every figure is read from
// lib/constants/centrelink-means-test.ts, child-care-subsidy.ts or
// centrelink-income-test.ts (verified 24 September 2026). These strings are
// also each page's FAQPage JSON-LD, so the structured data cannot drift from
// the visible answers.
import { formatAUD } from "@/lib/constants";
import {
  CSHC,
  DEEMING,
  DSP,
  PCC,
  PENSION_ASSETS_TEST,
  PENSION_RATES_NOW,
  assetsTestRate,
  deemedIncomeAnnual,
} from "@/lib/constants/centrelink-means-test";
import { CCS, ccsHigherPercent, ccsStandardPercent } from "@/lib/constants/child-care-subsidy";
import { AGE_PENSION_INCOME_TEST, WORK_BONUS } from "@/lib/constants/centrelink-income-test";
import type { W3Faq } from "./centrelink-w3-faqs";

const AT = PENSION_ASSETS_TEST;
const R = PENSION_RATES_NOW.maxFortnightly;
const IT = AGE_PENSION_INCOME_TEST;
const pct = (r: number) => `${(r * 100).toFixed(2)}%`;

export const ASSETS_TEST_FAQS: readonly W3Faq[] = [
  {
    q: "What is the Age Pension assets test limit in 2026?",
    a: `For a full Age Pension your assets (not counting your home) must be no more than ${formatAUD(AT.fullPensionLimit.single.homeowner)} if you are a single homeowner, ${formatAUD(AT.fullPensionLimit.single.nonHomeowner)} single non-homeowner, ${formatAUD(AT.fullPensionLimit.couple.homeowner)} for a homeowner couple combined and ${formatAUD(AT.fullPensionLimit.couple.nonHomeowner)} for a non-homeowner couple. From ${AT.ratesFrom} a part pension stops above ${formatAUD(AT.partPensionCutOff.single.homeowner)} (single homeowner), ${formatAUD(AT.partPensionCutOff.single.nonHomeowner)} (single non-homeowner), ${formatAUD(AT.partPensionCutOff.couple.homeowner)} (couple homeowner) and ${formatAUD(AT.partPensionCutOff.couple.nonHomeowner)} (couple non-homeowner).`,
  },
  {
    q: "How much does the Age Pension reduce for assets over the limit?",
    a: `$${AT.taperPerThousand.single} a fortnight for every $1,000 over the full-pension limit if you are single, and $${AT.taperPerThousand.coupleEach.toFixed(2)} a fortnight each for a couple (on your combined assets). For example, a single homeowner with ${formatAUD(433_000)} of assessable assets is ${formatAUD(100_000)} over the limit, so the pension drops by ${formatAUD(300)} to ${formatAUD(assetsTestRate(433_000, "single", "homeowner"), 2)} a fortnight under the assets test.`,
  },
  {
    q: "Does the income test or the assets test apply?",
    a: "Both are worked out and you are paid the lower result. People with modest savings and some part-time work tend to be on the income test; people with larger savings, an investment property or a big super balance past Age Pension age tend to be on the assets test. The calculator on this page runs both and shows which one is setting your pension.",
  },
  {
    q: "Is my home counted in the assets test?",
    a: "No. Your principal home, and generally up to 2 hectares of the land it is on, is exempt. That is why homeowners have a lower limit than non-homeowners — the gap between them is the same at every level. Everything else counts at market value less any debt secured against it: bank accounts, shares, super once you are Age Pension age, investment property, cars, caravans, boats and home contents.",
  },
  {
    q: "Does working reduce the Age Pension under the assets test?",
    a: `No. Wages are income, not assets, so they only go through the income test — where the Work Bonus disregards the first ${formatAUD(WORK_BONUS.fortnightlyCredit)} a fortnight. Money you save out of your wages does become an asset once it sits in the bank, and it is also deemed to earn income.`,
  },
  {
    q: "When do the assets test limits change?",
    a: `The Department of Social Services reviews the limits in ${AT.reviewedIn}. The full-pension limits did not change on 20 September 2026; the cut-offs move whenever the pension rate does (20 March and 20 September) because they are built from it. On 20 September 2026 the single homeowner cut-off rose from ${formatAUD(AT.previousPartPensionCutOff.single.homeowner)} to ${formatAUD(AT.partPensionCutOff.single.homeowner)}.`,
  },
];

export const DEEMING_FAQS: readonly W3Faq[] = [
  {
    q: "What are the current Centrelink deeming rates?",
    a: `From ${DEEMING.ratesFrom}: ${pct(DEEMING.lowerRate)} on the first ${formatAUD(DEEMING.thresholds.single)} of financial assets for a single person (${formatAUD(DEEMING.thresholds.pensionerCouple)} combined for a couple where at least one gets a pension), and ${pct(DEEMING.upperRate)} on everything above. The rates were ${pct(0.0125)} and ${pct(0.0325)} from 20 March 2026 to 19 September 2026.`,
  },
  {
    q: "How is deemed income calculated?",
    a: `Centrelink assumes your financial assets earn the deeming rates, whatever they actually earn. A single person with ${formatAUD(100_000)} in the bank is deemed to earn ${formatAUD(deemedIncomeAnnual(100_000, "single"), 2)} a year: ${pct(DEEMING.lowerRate)} of ${formatAUD(DEEMING.thresholds.single)} plus ${pct(DEEMING.upperRate)} of the rest. That is about ${formatAUD(deemedIncomeAnnual(100_000, "single") / 26, 2)} a fortnight, added to any wages and other income for the income test.`,
  },
  {
    q: "What counts as a financial asset for deeming?",
    a: "Bank, building society and credit union accounts, term deposits, cash, managed investments, listed shares and securities, loans you have made, some gifts, account-based income streams (such as an account-based pension) and superannuation once you are Age Pension age. Your home, car and household contents are assets for the assets test but are not deemed.",
  },
  {
    q: "Does deeming affect my wages or Family Tax Benefit?",
    a: "Deemed income is added to your employment income for the income test of pensions and allowances, but it does not change your wages. Family Tax Benefit is not affected by deeming because it uses your taxable income, which already includes the interest you actually earn.",
  },
  {
    q: "What if my investments earn more than the deeming rate?",
    a: "The extra is not counted. Only the deemed amount is assessed, so returns above the deeming rates do not reduce your payment. The reverse also holds: if your savings earn less than the deeming rate, Centrelink still counts the deemed amount.",
  },
  {
    q: "When do deeming rates and thresholds change?",
    a: `The Minister for Social Services sets the rates and the thresholds index on 1 July. The last three rate changes took effect on 20 September 2025, 20 March 2026 and 20 September 2026. The thresholds rose to ${formatAUD(DEEMING.thresholds.single)} / ${formatAUD(DEEMING.thresholds.pensionerCouple)} on ${DEEMING.thresholdsFrom}, and the rates rose to ${pct(DEEMING.lowerRate)} / ${pct(DEEMING.upperRate)} on ${DEEMING.ratesFrom}.`,
  },
];

export const DSP_FAQS: readonly W3Faq[] = [
  {
    q: "How much is the Disability Support Pension per fortnight?",
    a: `From ${DSP.ratesFrom}, if you are 21 or older the maximum DSP is ${formatAUD(R.single.total, 2)} a fortnight single and ${formatAUD(R.coupleEach.total, 2)} each for a couple (${formatAUD(R.coupleCombined.total, 2)} combined), including the Pension Supplement and Energy Supplement — the same as the Age Pension. Under 21 with no children, the maximum is ${formatAUD(DSP.under21.under18Dependent, 2)} (under 18, dependent) to ${formatAUD(DSP.under21.age18to20Independent, 2)} (independent).`,
  },
  {
    q: "How many hours can I work on the Disability Support Pension?",
    a: `Up to ${DSP.maxWorkHoursPerWeek} hours a week of paid work without losing DSP, as long as you meet the income test. If you work ${DSP.suspensionHoursPerWeek} or more hours a week on an ongoing basis, DSP is suspended — not cancelled — for up to ${DSP.suspensionYears} years, and you keep your Pensioner Concession Card. Work in an Australian Disability Enterprise, under the Supported Wage System or with ongoing Inclusive Employment Australia support does not trigger the suspension.`,
  },
  {
    q: "How much can I earn on DSP?",
    a: `DSP uses the pension income test. A single person can have ${formatAUD(IT.single.freeArea)} a fortnight of income before the pension reduces; above that it drops 50 cents per dollar. For a couple the free area is ${formatAUD(IT.couple.freeArea)} combined and each pension drops 25 cents per combined dollar. The payment stops at ${formatAUD(DSP.publishedCutOff.single21Plus, 2)} a fortnight (single, 21+) or ${formatAUD(DSP.publishedCutOff.couple21PlusCombined, 2)} combined (couple).`,
  },
  {
    q: "What happens if my wages go over the DSP cut-off?",
    a: `Your DSP is paid at $0 for that fortnight — a nil rate period. If income stays over the cut-off for more than ${DSP.nilRateFortnights} fortnights in a row, DSP is suspended for up to ${DSP.suspensionYears} years, so you can ask for it to be restored if your hours or pay drop, without a new claim. Keep reporting your income every fortnight during a nil rate period.`,
  },
  {
    q: "Is DSP taxable?",
    a: "DSP is not taxable if you are under Age Pension age. It becomes taxable once you reach Age Pension age. Tax-free DSP still counts towards your adjusted taxable income for family payments and Carer Allowance.",
  },
  {
    q: "What are the DSP assets limits?",
    a: `The same as the Age Pension: a full pension with assets up to ${formatAUD(AT.fullPensionLimit.single.homeowner)} (single homeowner) or ${formatAUD(AT.fullPensionLimit.single.nonHomeowner)} (single non-homeowner), reducing $3 a fortnight per $1,000 above that; a part pension stops above ${formatAUD(AT.partPensionCutOff.single.homeowner)} and ${formatAUD(AT.partPensionCutOff.single.nonHomeowner)} from ${AT.ratesFrom}. Under 21s with no children have their own cut-offs.`,
  },
];

const ccsEx = 130_000;
export const CCS_FAQS: readonly W3Faq[] = [
  {
    q: "How much Child Care Subsidy will I get in 2026-27?",
    a: `Families earning up to ${formatAUD(CCS.standard.lowerThreshold)} get ${CCS.standard.maxPercent}% of the lower of their hourly fee and the hourly rate cap. Above that the percentage falls by 1 point for every ${formatAUD(CCS.standard.step)} of family income, reaching 0% at ${formatAUD(CCS.standard.cutOut)}. On ${formatAUD(ccsEx)} the subsidy is ${ccsStandardPercent(ccsEx).toFixed(2)}%.`,
  },
  {
    q: "What is the 3 Day Guarantee?",
    a: `From ${CCS.hours.guaranteeFrom} the CCS activity test was replaced. Every eligible family gets at least ${CCS.hours.guaranteed} hours of subsidised care per child each fortnight — about three days a week — whatever their work hours. You get ${CCS.hours.higher} hours if you and your partner each do more than ${CCS.hours.participationThreshold} hours of recognised participation a fortnight (paid work, looking for work, volunteering and the other recognised types), have an exemption, or for an Aboriginal or Torres Strait Islander child.`,
  },
  {
    q: "What are the CCS hourly rate caps for 2026-27?",
    a: `For children below school age: ${formatAUD(CCS.hourlyRateCap.belowSchool.cbdc, 2)} an hour for centre-based day care and outside school hours care, ${formatAUD(CCS.hourlyRateCap.belowSchool.fdc, 2)} for family day care and ${formatAUD(CCS.hourlyRateCap.belowSchool.ihc, 2)} per family for in home care. For school-age children the centre-based and OSHC cap is ${formatAUD(CCS.hourlyRateCap.schoolAge.oshc, 2)}. Your percentage applies to the lower of your fee and the cap, so fees above the cap are paid in full by you.`,
  },
  {
    q: "Do I get a higher CCS for a second child?",
    a: `Yes, if you have more than one child aged 5 or under in care and family income is under ${formatAUD(CCS.higher.incomeLimit)}. The eldest is the standard-rate child; each younger one gets the higher rate: ${CCS.higher.maxPercent}% up to ${formatAUD(CCS.higher.band1Start)}, falling to ${CCS.higher.plateauPercent}% by ${formatAUD(CCS.higher.band1End)}, then to ${CCS.higher.floorPercent}% by ${formatAUD(CCS.higher.band2End)}. On ${formatAUD(ccsEx)} that is ${ccsHigherPercent(ccsEx)}% for the younger child.`,
  },
  {
    q: "What family income does Centrelink use for CCS?",
    a: "Your family income estimate for the financial year: combined adjusted taxable income of you and your partner — taxable income (wages, overtime, bonuses, business and investment income) plus reportable fringe benefits, reportable super contributions, net investment losses and some tax-free pensions. At the end of the year Services Australia balances your CCS against your actual income.",
  },
  {
    q: "Why is 5% of my CCS withheld?",
    a: `Services Australia withholds ${CCS.defaultWithholding * 100}% of your subsidy each fortnight to reduce the chance of a debt if your income ends up higher than your estimate. The withheld amount is paid to you when your CCS is balanced after the financial year if you were not overpaid. You can change the percentage online twice a financial year.`,
  },
];

export const CSHC_FAQS: readonly W3Faq[] = [
  {
    q: "What is the Commonwealth Seniors Health Card income limit?",
    a: `From ${CSHC.limitsFrom} your adjusted taxable income must be less than ${formatAUD(CSHC.incomeLimit.single)} a year if you are single, ${formatAUD(CSHC.incomeLimit.couple)} combined for a couple, or ${formatAUD(CSHC.incomeLimit.coupleSeparated)} for a couple separated by illness, respite care or prison. Add ${formatAUD(CSHC.perChild, 2)} for each child in your care. The limits were ${formatAUD(CSHC.previousIncomeLimit.single)} and ${formatAUD(CSHC.previousIncomeLimit.couple)} until 19 September 2026.`,
  },
  {
    q: "Is there an assets test for the Commonwealth Seniors Health Card?",
    a: "No. Only income is tested. Your savings, shares and property do not count as assets — but an account-based income stream (such as an account-based pension) is deemed to earn income, and that deemed amount is added to your adjusted taxable income.",
  },
  {
    q: "Can I get the Commonwealth Seniors Health Card if I still work?",
    a: `Yes. There is no work test — you need to be Age Pension age, not getting an income support payment, and under the income limit. Your wages count in full as taxable income, so a single person with taxable income under ${formatAUD(CSHC.incomeLimit.single)} and no other assessed income is under the limit. Employer fringe benefits count only above ${formatAUD(CSHC.fringeBenefitsThreshold)}.`,
  },
  {
    q: "How is the account-based pension deemed for the CSHC?",
    a: `At the deeming rates: ${pct(DEEMING.lowerRate)} on the first ${formatAUD(DEEMING.thresholds.single)} for a single person (${formatAUD(DEEMING.thresholds.nonPensionerCouple)} for each member of a couple), and ${pct(DEEMING.upperRate)} above that. Deeming applies if you bought or changed the income stream on or after 1 January 2015, if your card was granted after 31 December 2014, or if it belongs to your partner and they are 60 or older. Older grandfathered streams are not deemed.`,
  },
  {
    q: "What is the difference between the CSHC and the Pensioner Concession Card?",
    a: `The Pensioner Concession Card comes automatically with a pension (${PCC.automaticWith.join(", ")}) and some long-term payments; it has no income test of its own. The Commonwealth Seniors Health Card is for people of Age Pension age who do not get a pension — usually because their income or assets are too high — and it has its own income test. Both give cheaper PBS medicines; the PCC also helps with hearing services.`,
  },
  {
    q: "When are the CSHC income limits indexed?",
    a: `Each year on ${CSHC.indexedOn}, in line with the Consumer Price Index. The ${CSHC.limitsFrom} increase was ${formatAUD(CSHC.incomeLimit.single - CSHC.previousIncomeLimit.single)} for singles and ${formatAUD(CSHC.incomeLimit.couple - CSHC.previousIncomeLimit.couple)} for couples.`,
  },
];
