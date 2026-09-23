// Shared FAQ copy for /centrelink-income-test/ — rendered by the page's
// accordion and turned into FAQPage JSON-LD in app/centrelink-income-test/
// page.tsx, so the structured data cannot drift from the page. Free areas,
// tapers and Working Credit limits come from lib/constants.

import { formatAUD } from "@/lib/constants";
import { AGE_PENSION_INCOME_TEST, JOBSEEKER_INCOME_TEST } from "@/lib/constants/centrelink-income-test";
import { WORKING_CREDIT } from "@/lib/constants/working-credit";
import { DEEMING } from "@/lib/constants/centrelink-means-test"; // H3
import type { FaqItem } from "@/lib/faq";

const JS = JOBSEEKER_INCOME_TEST;
const AP = AGE_PENSION_INCOME_TEST;
const cents = (r: number) => `${Math.round(r * 100)} cents`;

export const CENTRELINK_INCOME_TEST_FAQS: readonly FaqItem[] = [
  {
    q: "What is the Centrelink income test?",
    a: `The income test works out how much your Centrelink payment is reduced by the income you earn. Income up to a free area does not affect your payment; above it, the payment reduces by a set amount per dollar. For JobSeeker Payment the free area is ${formatAUD(JS.freeArea)} a fortnight, with a ${cents(JS.taper1)} reduction per dollar up to ${formatAUD(JS.band1End)} and ${cents(JS.taper2)} per dollar above that. For a single Age Pensioner the reduction is ${cents(AP.single.taper)} per dollar above ${formatAUD(AP.single.freeArea)} a fortnight.`,
  },
  {
    q: "What is Working Credit?",
    a: `Working Credit lets you build up credits during fortnights when your income is low, then use them to offset employment income in higher-earning fortnights. Credits build in fortnights when your income is under ${formatAUD(WORKING_CREDIT.accrualThreshold)}: you earn one credit for each dollar below ${formatAUD(WORKING_CREDIT.accrualThreshold)}, so up to ${WORKING_CREDIT.maxPerFortnight} credits a fortnight, to a maximum balance of ${WORKING_CREDIT.maxBalance.toLocaleString("en-AU")} credits (${WORKING_CREDIT.maxBalanceYouthAllowanceJobSeeker.toLocaleString("en-AU")} for Youth Allowance job seekers). When you earn more, each credit offsets $1 of employment income above the free area before the income test is applied, which means you keep more of your Centrelink payment when you work extra hours.`,
  },
  {
    q: "Does my partner's income affect my payment?",
    a: `Yes. For partnered recipients, the income test considers combined household income. The free areas and taper rates differ for couples compared to singles. For Age Pension couples, the combined free area is ${formatAUD(AP.couple.freeArea)} per fortnight, and each partner's pension reduces by ${cents(AP.couple.taper)} for every dollar of combined income above it. For JobSeeker partnered recipients, your partner's income above their own cut-off reduces your payment.`,
  },
  {
    q: "Do I report gross or net income to Centrelink?",
    a: "You report gross income — your total pay before income tax, Medicare levy, HECS-HELP repayments, or salary sacrifice deductions are taken out. This is the higher figure on your payslip, not the amount deposited into your bank account. Reporting net (after-tax) income instead of gross is one of the most common reporting errors and leads to Centrelink debts.",
  },
  {
    q: "What is the deeming rate and how does it affect my payment?",
    // H3: moved to the 20 September 2026 settings (was the 20 March 2026 ones).
    a: `Deeming is a method Centrelink uses to assess income from financial assets (bank accounts, shares, managed funds, superannuation in pension phase). Rather than counting actual returns, Centrelink applies a fixed "deemed" rate. From ${DEEMING.ratesFrom}, for singles, the first ${formatAUD(DEEMING.thresholds.single)} is deemed at ${(DEEMING.lowerRate * 100).toFixed(2)}% and any balance above that at ${(DEEMING.upperRate * 100).toFixed(2)}%. For a couple where at least one gets a pension, the lower rate applies on the first ${formatAUD(DEEMING.thresholds.pensionerCouple)} combined. The rates were 1.25% and 3.25% from 20 March to 19 September 2026. The deemed income is added to your other assessable income for the income test. See deeming rates and calculator for the full history and your own figures.`,
    links: { "deeming rates and calculator": "/deeming-rates/" },
  },
  {
    q: "Is my superannuation balance counted for the income test?",
    a: "Before Age Pension age: your superannuation balance is generally not counted under either the income test or the assets test. After reaching Age Pension age: your super balance becomes a financial asset and is subject to deeming rules under the income test and counted in full under the assets test. This transition significantly impacts your Centrelink entitlement.",
  },
  {
    q: "Does salary sacrifice reduce my assessable income for Centrelink?",
    a: "Usually not. For most income support payments, Centrelink adds salary-sacrificed amounts back to your income, so sacrificing to super or a novated lease does not by itself increase your payment. Salary sacrificed super contributions count as reportable super contributions for Family Tax Benefit and other adjusted taxable income tests, and fringe benefits provided through salary packaging count as reportable fringe benefits. Report your gross pay before salary sacrifice.",
  },
  {
    q: "How does a one-off lump sum payment affect my Centrelink?",
    a: "One-off employment income such as a bonus or back-pay is assessed in the fortnight you earn it, which can temporarily reduce or eliminate your payment for that period. Leave paid out when a job ends (unused annual leave, long service leave) and redundancy payments can trigger an income maintenance period, which delays working-age payments such as JobSeeker for roughly the number of weeks the payment covers. Report any lump sum in the fortnight it is paid.",
  },
  {
    q: "What happens if I report my income late?",
    a: "Late reporting suspends your Centrelink payment. You do not lose eligibility permanently, but your payment for that fortnight is delayed until you submit your report. If you keep failing to report, your payment may be cancelled and you will need to re-claim. Submit your report on or before your designated reporting day to avoid disruption.",
  },
  {
    q: "Is my Centrelink payment taxable income?",
    a: "Yes. Most Centrelink income-support payments — including JobSeeker, Youth Allowance, Austudy, Age Pension, and Parenting Payment — are taxable income and must be included in your annual tax return. Centrelink withholds tax at a rate you choose (or a default rate) and issues a Centrelink Payment Summary at the end of each financial year. Non-taxable payments include Disability Support Pension (if you are under Age Pension age) and Carer Allowance.",
  },
  {
    q: "Do I still need to report if I earned no income this fortnight?",
    a: "Yes. You must submit a report every fortnight even if your employment income is $0. A nil report confirms your ongoing eligibility and triggers your payment. Failing to submit a nil report is treated the same as a late report — your payment is suspended until the report is received.",
  },
  {
    q: "Can I get my payment back if it is reduced to $0 by the income test?",
    a: "Often, yes. If employment income reduces JobSeeker Payment, Youth Allowance or Parenting Payment to $0, your claim can stay open at a nil rate for up to 12 fortnights. If your income drops back below the cut-off in that time, payment resumes without a new claim. After that period your payment is cancelled and you must lodge a new claim. You may keep your concession card while your payment is at the nil rate.",
  },
  {
    q: "How is rental income assessed for the Centrelink income test?",
    a: "Rental income is assessed as net rental income — your gross rent received minus allowable expenses such as property management fees, repairs, insurance, and loan interest. Centrelink calculates this on an annual basis, then converts it to a fortnightly figure. Unlike the ATO, Centrelink does not let a net rental loss reduce your other income for the income support income test: a loss-making property is counted as nil income. For Family Tax Benefit, net investment losses are added back to your adjusted taxable income.",
  },
];
