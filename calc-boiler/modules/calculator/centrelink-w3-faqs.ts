// FAQ copy for the W3 Centrelink pages. Every figure is read from
// lib/constants/centrelink-carer-and-support.ts or paid-parental-leave.ts
// (verified 23 September 2026). These strings are also each page's FAQPage
// JSON-LD, so the structured data cannot drift from the visible answers.
import { formatAUD } from "@/lib/constants";
import {
  ADVANCE_LIMITS,
  ADVANCE_RULES,
  CARER_ALLOWANCE,
  CARER_PAYMENT,
  CARER_PAYMENT_RATES,
  COST_OF_LIVING_FACTS,
  CRISIS_PAYMENT,
  RESOLUTION_SCHEME,
  advanceRepayment,
  crisisPaymentAmount,
} from "@/lib/constants/centrelink-carer-and-support";
import { AGE_PENSION_INCOME_TEST, JOBSEEKER_RATES, SEPTEMBER_2026 } from "@/lib/constants/centrelink-income-test";
import { PPL_ENTITLEMENT, PPL_INCOME_TEST, PPL_RATES, PPL_RULES, PPL_WORK_TEST, pplGross } from "@/lib/constants/paid-parental-leave";

export interface W3Faq { q: string; a: string }

const CP = CARER_PAYMENT;
const R = CARER_PAYMENT_RATES.maxFortnightly;
const IT = AGE_PENSION_INCOME_TEST;
const JS = JOBSEEKER_RATES[SEPTEMBER_2026].maxFortnightly;
const PPL_NOW = PPL_ENTITLEMENT[PPL_ENTITLEMENT.length - 1];

export const CARER_PAYMENT_FAQS: readonly W3Faq[] = [
  {
    q: "How much is Carer Payment per fortnight?",
    a: `From ${CP.ratesFrom} the maximum Carer Payment is ${formatAUD(R.single.total, 2)} a fortnight for a single person and ${formatAUD(R.coupleEach.total, 2)} each for a couple (${formatAUD(R.coupleCombined.total, 2)} combined). Those totals include the Pension Supplement and Energy Supplement — the same rates as the Age Pension. Rates change on 20 March and 20 September.`,
  },
  {
    q: "How many hours can I work on Carer Payment?",
    a: `Up to ${CP.workHoursLimit} hours of paid work or self-employment in a ${CP.workHoursPeriodWeeks}-week period — an average of 25 hours a week. Travel to and from work, study, training and volunteering do not count towards the ${CP.workHoursLimit} hours. The limit is measured over 4 weeks rather than each week, so the time in any one week can vary. If you sometimes go over, you can use respite days (up to ${CP.respiteDaysPerYear} a calendar year) or have the payment suspended for up to ${CP.suspensionMonths} months.`,
  },
  {
    q: "How much can I earn on Carer Payment?",
    a: `Carer Payment uses the pension income test. A single carer can have ${formatAUD(IT.single.freeArea)} a fortnight of income before the payment reduces; above that it drops by 50 cents for each dollar. For a couple the free area is ${formatAUD(IT.couple.freeArea)} combined and each person's payment drops by 25 cents per combined dollar. The payment stops at ${formatAUD(CARER_PAYMENT_RATES.publishedCutOff.single, 2)} a fortnight (single) or ${formatAUD(CARER_PAYMENT_RATES.publishedCutOff.coupleCombined, 2)} combined (couple).`,
  },
  {
    q: "Is Carer Payment taxable?",
    a: "Only if you or the person you care for are Age Pension age or older. Otherwise Carer Payment is not taxable. Services Australia does not deduct tax automatically, but you can ask them to.",
  },
  {
    q: "What are the income and asset limits for the person I care for?",
    a: `If the person you care for doesn't get an income support payment, their income (including their partner's and dependent children's) must be under ${formatAUD(CP.careReceiverIncomeLimit)} a year and their assets under ${formatAUD(CP.careReceiverAssetsLimit)}, not counting their home. These limits index on 1 January.`,
  },
  {
    q: "Can I get Carer Payment and Carer Allowance at the same time?",
    a: `Yes. They are separate payments with separate rules, and you can make a combined claim. Carer Allowance is ${formatAUD(CARER_ALLOWANCE.fortnightly, 2)} a fortnight on top of Carer Payment, and each one also brings a ${formatAUD(CP.carerSupplementAnnual)} Carer Supplement each year.`,
  },
  {
    q: "Does the Work Bonus apply to Carer Payment?",
    a: "Only if you are Age Pension age. Then the first $300 of employment income each fortnight, and any Work Bonus balance, is taken out of the income test — you still have to stay within the 100-hour work rule.",
  },
];

export const CARER_ALLOWANCE_FAQS: readonly W3Faq[] = [
  {
    q: "How much is Carer Allowance?",
    a: `${formatAUD(CARER_ALLOWANCE.fortnightly, 2)} a fortnight — a set rate, adjusted on ${CARER_ALLOWANCE.indexedOn} each year. If you share care with another carer who is not your partner, each of you may get a part payment based on your percentage of care.`,
  },
  {
    q: "What is the income limit for Carer Allowance?",
    a: `Your and your partner's combined adjusted taxable income must be less than ${formatAUD(CARER_ALLOWANCE.incomeLimit)} per financial year. There is no assets test, and no income test for the person you care for.`,
  },
  {
    q: "Does working affect Carer Allowance?",
    a: `No, as long as combined income stays under ${formatAUD(CARER_ALLOWANCE.incomeLimit)} a year. Carer Allowance has no fortnightly income test, so your wages don't reduce it — you still need to be giving daily care. Carer Payment is different — it has an income test and a 100-hours-in-4-weeks work limit.`,
  },
  {
    q: "Is Carer Allowance taxable?",
    a: "No. Services Australia says Carer Allowance isn't part of your taxable income, so it does not go on your tax return.",
  },
  {
    q: "What is the Carer Supplement?",
    a: `An annual payment of up to ${formatAUD(CARER_ALLOWANCE.carerSupplementAnnual)} for each eligible payment, paid automatically if you get Carer Allowance (or Carer Payment) for a period that includes 1 July. Someone on both payments gets it for each.`,
  },
];

export const ADVANCE_FAQS: readonly W3Faq[] = [
  {
    q: "How much Centrelink advance can I get?",
    a: `It depends on the payment. On JobSeeker, Parenting Payment, Youth Allowance, Austudy or ABSTUDY the advance is between ${formatAUD(250)} and ${formatAUD(500)}. On Age Pension, Carer Payment or Disability Support Pension it is ${formatAUD(ADVANCE_LIMITS.pensionSingle.min ?? 0, 2)} to ${formatAUD(ADVANCE_LIMITS.pensionSingle.max, 2)} if you are single, or ${formatAUD(ADVANCE_LIMITS.pensionCouple.min ?? 0, 2)} to ${formatAUD(ADVANCE_LIMITS.pensionCouple.max, 2)} if you are a member of a couple. FTB Part A advances can't total more than ${formatAUD(ADVANCE_LIMITS.ftb.max, 2)}.`,
  },
  {
    q: "How do I pay back a Centrelink advance?",
    a: `Automatically. The advance is divided by ${ADVANCE_RULES.repaymentFortnights} and that amount is taken out of each of your next ${ADVANCE_RULES.repaymentFortnights} payments, starting from your next payday. A ${formatAUD(500)} advance costs ${formatAUD(advanceRepayment(500), 2)} a fortnight. You can choose to repay faster, or repay early.`,
  },
  {
    q: "How often can I get an advance?",
    a: `On JobSeeker, Parenting Payment, Youth Allowance, Austudy and ABSTUDY, once in 12 months. On a pension, within any 6 months you can have one advance at the highest amount, up to two smaller ones, or three at the lowest amount. You need to have been on JobSeeker, Parenting Payment, a pension or Youth Allowance (job seeker) for at least ${ADVANCE_RULES.monthsOnPaymentBeforeApplying} months first.`,
  },
  {
    q: "Why was my advance payment rejected?",
    a: "The reasons Services Australia lists: you had an advance on the same payment in the past 12 months, you are still repaying one from more than 12 months ago, you owe a debt to the Australian Government, you can't afford to repay it within 6 months, you have less than the lowest advance amount available, or you are outside Australia.",
  },
];

export const CRISIS_FAQS: readonly W3Faq[] = [
  {
    q: "How much is the Centrelink Crisis Payment?",
    a: `It equals one week's pay at the maximum basic rate of your income support payment — half the fortnightly basic rate, without supplements. For a single person on JobSeeker (basic rate ${formatAUD(JS.single, 2)} a fortnight from 20 September 2026) that works out at ${formatAUD(crisisPaymentAmount(JS.single), 2)}. Services Australia states the rule, not a dollar figure; the dollar amounts on this page are our calculation from the current basic rates.`,
  },
  {
    q: "Who can get a Crisis Payment?",
    a: "You must be getting, or eligible for, an income support payment or ABSTUDY Living Allowance, be in severe financial hardship, and be in one of the extreme circumstances: leaving home (or staying after the perpetrator leaves) because of family and domestic violence; being forced to leave home by an event such as fire, flood or community violence; arriving in Australia for the first time on an eligible humanitarian visa; or release from prison or psychiatric confinement after at least 14 days.",
  },
  {
    q: "How quickly do I need to claim a Crisis Payment?",
    a: `You must contact Services Australia within ${CRISIS_PAYMENT.contactWithinDays} days of the change (for prison release, up to ${CRISIS_PAYMENT.prisonContactDaysBeforeRelease} days before or ${CRISIS_PAYMENT.contactWithinDays} days after), then lodge the claim within ${CRISIS_PAYMENT.claimWithinDaysOfContact} days of making contact. Starting a claim online, calling your payment line or visiting a service centre all count as contact.`,
  },
  {
    q: "How many Crisis Payments can I get?",
    a: `One per incident, with up to ${CRISIS_PAYMENT.maxExtremeCircumstancesPer12Months} extreme-circumstances payments (family and domestic violence plus other extreme circumstances, combined) in any 12 months. Humanitarian entrants can get one. The prison-release payment can be paid each time you are released.`,
  },
  {
    q: "Is Crisis Payment taxable?",
    a: "No. Services Australia describes it as a one-off, non-taxable payment.",
  },
];

export const DEBT_FAQS: readonly W3Faq[] = [
  {
    q: "What is the Centrelink debt refund people are talking about?",
    a: "From late October 2025 Services Australia began contacting people who had overpaid a Centrelink debt — paid back more than they owed — and whose refunds had not been processed because of an error on its part. It calls or writes with the refund details; the refund isn't used to repay other Centrelink debts unless you ask, and no interest is added. If it hasn't contacted you and you think you overpaid, call the debt recovery line.",
  },
  {
    q: "What is the Income Apportionment Resolution Scheme?",
    a: `A one-off payment of up to ${formatAUD(RESOLUTION_SCHEME.maxPayment)} per eligible debt for people whose employment income debts between ${RESOLUTION_SCHEME.debtPeriodFrom} and ${RESOLUTION_SCHEME.debtPeriodTo} were likely affected by income apportionment. Applications opened ${RESOLUTION_SCHEME.opened} and close ${RESOLUTION_SCHEME.closes}. Debts under $200 get the full debt amount; $200–$1,999 gets $200; $2,000–$4,999 gets $400; $5,000 or more gets $600. The payment isn't taxable or counted as income.`,
  },
  {
    q: "Is income apportionment the same as Robodebt?",
    a: "No. Income apportionment divided your reported pay evenly across Centrelink fortnights when your pay period didn't line up with them (before 7 December 2020). Robodebt raised debts from averaged ATO income data between July 2015 and November 2019. The robodebt class action has its own settlement: the Federal Court approved an additional $475 million on 23 June 2026, and late registrations closed on 15 May 2026.",
  },
  {
    q: "How do I avoid a Centrelink overpayment when I work?",
    a: "Report your gross (before-tax) pay for the fortnight you are paid, as it appears on your payslip, and tell Services Australia about changes within 14 days. Since 7 December 2020 you report income for the Centrelink fortnight you got paid, not the days you worked. An overpayment happens whenever you are paid more than you're eligible for — which is what a wrong or late income report produces.",
  },
  {
    q: "What happens if I can't repay a Centrelink debt?",
    a: "If you still get a Centrelink payment, repayments are deducted from it and you can ask to change the amount. Otherwise you can repay in full or set up an arrangement by the due date (usually 28 days after the letter); no interest applies if you keep to the arrangement. Centrelink debts don't affect your credit rating. In hardship, all or part of a debt can be waived under the special circumstances waiver — even one you have already repaid.",
  },
];

export const COL_FAQS: readonly W3Faq[] = [
  {
    q: "Is there a cost of living payment in 2026?",
    a: `No Commonwealth cost of living payment exists in 2026. Services Australia says the Cost of Living Payment stopped from ${COST_OF_LIVING_FACTS.cwthCostOfLivingPaymentEnded}, and the federal Energy Bill Relief Fund ended on ${COST_OF_LIVING_FACTS.energyBillReliefEnded}. Posts promising a "$2,200" or similar 2026 Centrelink cost of living payment are not backed by any Services Australia announcement.`,
  },
  {
    q: "Is the $2,200 Centrelink cost of living payment real?",
    a: "There is no such payment on servicesaustralia.gov.au. The regular increases that do happen are indexation of existing payments on 20 March and 20 September (and 1 January or 1 July for some payments). If a site, message or caller asks for your myGov or bank details to receive a cost of living payment, check with Services Australia before giving anything — it is not how real payments are made.",
  },
  {
    q: "What help with the cost of living is actually available?",
    a: `Indexation of pensions and allowances (20 September 2026 was the latest), Rent Assistance with an eligible payment, concession cards, and state and territory rebates and concessions — for example South Australia's Cost of Living Concession of ${formatAUD(COST_OF_LIVING_FACTS.saCostOfLivingConcession2026_27, 2)} for 2026-27. energy.gov.au lists the state and territory energy rebates you may be eligible for.`,
  },
  {
    q: "Did the energy bill rebate continue into 2026?",
    a: `No. The final extension paid up to ${formatAUD(COST_OF_LIVING_FACTS.energyBillRelief2025Extension)} per household in two $75 instalments from 1 July to 31 December 2025, after up to ${formatAUD(COST_OF_LIVING_FACTS.energyBillRelief2024_25)} in 2024-25. energy.gov.au says the Energy Bill Relief Fund ended on 31 December 2025.`,
  },
];

export const PPL_FAQS: readonly W3Faq[] = [
  {
    q: "How many weeks of Paid Parental Leave do I get in 2026?",
    a: `For a child born or adopted from ${PPL_NOW.label}, your family can get up to ${PPL_NOW.days} days — ${PPL_NOW.weeks} weeks based on a 5-day week. ${PPL_NOW.reservedForPartner} of those days are reserved for a partner. For a child born or adopted from 1 July 2025 to 30 June 2026 it is 120 days (24 weeks), with 15 reserved.`,
  },
  {
    q: "How much is Paid Parental Leave per week?",
    a: `${formatAUD(PPL_RATES["2026-27"].daily, 2)} a day, or ${formatAUD(PPL_RATES["2026-27"].weekly, 2)} per 5-day week, before tax, for days taken in 2026-27. The rate is set by the financial year you take each day in, not the birth date — days taken in 2025-26 were paid ${formatAUD(PPL_RATES["2025-26"].daily, 2)} a day. The full ${PPL_NOW.days} days at the 2026-27 rate is ${formatAUD(pplGross(PPL_NOW.days, "2026-27"), 2)}.`,
  },
  {
    q: "What is the income limit for Paid Parental Leave?",
    a: `Individual adjusted taxable income of ${formatAUD(PPL_INCOME_TEST["2025-26"].individual)} or less in 2025-26 (${formatAUD(PPL_INCOME_TEST["2024-25"].individual)} in 2024-25). If you're over that, you can qualify on family income of ${formatAUD(PPL_INCOME_TEST["2025-26"].family)} or less (${formatAUD(PPL_INCOME_TEST["2024-25"].family)} in 2024-25). The year tested is the financial year before the birth or the claim date, whichever is earlier.`,
  },
  {
    q: "What is the Paid Parental Leave work test?",
    a: `You must have worked ${PPL_WORK_TEST.monthsWorked} of the ${PPL_WORK_TEST.monthsWindow} months before the birth or adoption (${PPL_WORK_TEST.daysWorkedPeriod} of ${PPL_WORK_TEST.daysWindow} days) and at least ${PPL_WORK_TEST.minHours} hours in those 10 months — about one day a week — with no gap of more than ${PPL_WORK_TEST.maxGapWeeks} weeks between work days. Paid leave counts as work.`,
  },
  {
    q: "Is super paid on Paid Parental Leave?",
    a: `Yes, for children born or adopted from 1 July 2025. The ATO pays a ${Math.round(PPL_RULES.superRate * 100)}% Paid Parental Leave Superannuation Contribution, plus an interest component, as a lump sum to your fund after the end of the financial year you were paid in. The first contributions are paid in 2026-27. You don't need to claim it.`,
  },
  {
    q: "Can I work on a Paid Parental Leave day?",
    a: `Not if you want to be paid for that day. Working ${PPL_RULES.workingDayHours} hour or more — including a keeping-in-touch meeting or training — counts as working, so you must pick another day or return that day to your balance. The birth mother must not work in the ${PPL_RULES.birthMotherNoWorkDays} days after the birth.`,
  },
  {
    q: "Is Paid Parental Leave taxed?",
    a: `Yes, it is taxable income. If Services Australia pays you, it withholds tax at ${Math.round(PPL_RULES.defaultWithholding * 100)}% unless you ask for a different rate — which may not be enough if you have other income that year. If your employer pays it, they withhold at your usual rate.`,
  },
];
