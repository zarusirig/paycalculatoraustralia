// Shared FAQ copy for /schedule-5-tax-table/ (ATO NAT 3348).
//
// Read by BOTH the rendered accordion (plus its sr-only crawlable mirror) and
// the FAQPage JSON-LD, so the structured data cannot drift from the page.

import { formatAUD, formatPercent } from "@/lib/constants";
import { calculateSchedule5MethodB, NO_TFN_RATES } from "@/lib/constants/payg-withholding";
import type { TaxTableFaq } from "./weekly-tax-table-faqs";
import { ATO_SCHEDULE_5, SCHEDULE_5_WITHHOLDING_LIMIT } from "./ato-schedules";

const worked = calculateSchedule5MethodB(2_000, 5_000, "fortnightly");

export const SCHEDULE_5_FAQS: readonly TaxTableFaq[] = [
  {
    q: "What is the Schedule 5 tax table NAT number?",
    a: `Schedule 5 is published by the ATO as ${ATO_SCHEDULE_5.nat} — "Tax table for back payments, commissions, bonuses and similar payments". The current edition was published on ${ATO_SCHEDULE_5.published} and applies to payments made from 1 July 2026. Unlike the weekly, fortnightly and monthly tables, Schedule 5 is a set of calculation methods rather than a look-up grid, so the ATO publishes it as web content with no printable PDF for 2026-27.`,
  },
  {
    q: "Is there a flat tax rate on bonuses in Australia?",
    a: "No. A bonus is ordinary assessable income taxed at your marginal rate like any other income. Schedule 5 only governs how much is withheld at the time it is paid; your final tax is settled in your annual return, where any over- or under-withholding washes out. There is no separate, higher 'bonus tax rate' — the feeling that there is comes from withholding at your top marginal rate rather than your average rate.",
  },
  {
    q: "Which method will my employer use — A or B?",
    a: "Method A can be used for any additional payment, whatever year it relates to, and is the simpler of the two. Method B is more complex but produces withholding closer to the payee's actual tax. Method B(i) is used for back payments applied to specific periods in the current financial year; Method B(ii) is used for back payments relating to a prior financial year, and for any additional payment that does not relate to a single pay period. Both methods are acceptable to the ATO.",
  },
  {
    q: "How does the Method A calculation actually work?",
    a: `In six steps: find the gross earnings for the current pay period ignoring cents; look up the withholding on that amount in the normal tax table; divide the additional payment by the number of pay periods in the year (52, 26 or 12) and ignore cents; add that slice to the gross earnings and look up the withholding on the combined amount; subtract the first withholding figure from the second; multiply the difference by the number of pay periods. Worked through on ${formatAUD(2_000)} a fortnight with a ${formatAUD(5_000)} bonus, the apportioned slice is ${formatAUD(worked.apportionedAmount)}, the per-pay difference is ${formatAUD(worked.perPeriodDifference)}, and withholding on the bonus is ${formatAUD(worked.withheldFromAdditionalPayment)} — an effective rate of ${formatPercent(worked.effectiveRate)}.`,
  },
  {
    q: "Is there a maximum amount that can be withheld from a bonus?",
    a: `Yes. Under Method A and Method B(ii) the ATO caps withholding on an additional payment at ${SCHEDULE_5_WITHHOLDING_LIMIT * 100}% of that payment. If the calculated amount — including any study loan component — comes out above ${SCHEDULE_5_WITHHOLDING_LIMIT * 100}%, the employer must reduce it to exactly ${SCHEDULE_5_WITHHOLDING_LIMIT * 100}%. The cap applies only to the additional payment, not to the normal earnings in that pay period. Because the cap can leave some high earners under-withheld, the ATO allows a payee to arrange an upwards variation with their employer.`,
  },
  {
    q: "What is the difference between Method B(i) and Method B(ii)?",
    a: "Method B(i) applies to back payments that relate to specific earlier pay periods in the current financial year. It recalculates the withholding for each affected period: add the back pay for that period to what was actually paid, look up the withholding on the new total, and subtract what was already withheld. Method B(ii) applies to back payments relating to a prior financial year and to additional payments that do not belong to a single pay period. It uses your average total earnings for the year to date rather than the current period's earnings.",
  },
  {
    q: "How is back pay for a previous financial year withheld?",
    a: "Under Method B(ii). The payment is averaged across the pay periods in the year and applied to your average total earnings to date, which keeps the withholding close to your real marginal rate rather than spiking it. If you are paid back pay covering both the current and a previous financial year, the employer apportions it between the two years and uses the applicable method for each part. You may also qualify for a lump sum in arrears tax offset in your return so that receiving old income in one hit does not push you into a higher bracket.",
  },
  {
    q: "Which payments use Schedule 5 and which do not?",
    a: "Schedule 5 covers back payments and arrears, commissions, bonuses and similar lump sums, and lump-sum leave loading — provided the payment relates to more than one pay period or to an undefined period. It does not cover a payment relating to a single pay period, which is simply added to that period's earnings and withheld from the ordinary table. It also does not cover unused leave paid out on termination (Schedule 7, NAT 3351) or employment termination payments such as redundancy (Schedule 11, NAT 70980).",
  },
  {
    q: "Does HECS-HELP (STSL) apply to Schedule 5 payments?",
    a: `Yes. If the payee has a HELP, VET Student Loan, Financial Supplement, Student Start-up Loan or Australian Apprenticeship Support Loan debt, a study loan component must also be withheld from the additional payment, using the same method chosen for the income tax component. If the two are calculated separately, the ${SCHEDULE_5_WITHHOLDING_LIMIT * 100}% withholding limit is tested against their combined total, not against each one on its own.`,
  },
  {
    q: "Why does my bonus look so heavily taxed?",
    a: "Because it is withheld at your marginal rate, and your marginal rate is higher than the average rate applied across your normal pay. Your salary has already used up the tax-free threshold and the lower brackets, so every bonus dollar sits in your top bracket — 30%, 37% or 45%, plus the Medicare levy and any study loan repayment. Schedule 5 actually reduces the withholding compared with running the lump sum through the ordinary tax table, which would annualise it and withhold far more.",
  },
  {
    q: "What if the employee has not provided a TFN?",
    a: `The no-TFN rates override Schedule 5. Withhold ${NO_TFN_RATES.resident * 100}% from a resident payee and ${NO_TFN_RATES.foreignResident * 100}% from a foreign resident, ignoring cents, and do not apply tax offsets, Medicare levy adjustments or a study loan component.`,
  },
  {
    q: "Is superannuation paid on a bonus?",
    a: "Usually yes. Performance and incentive bonuses are generally ordinary time earnings, so the 12% superannuation guarantee applies on top of the gross bonus. Bonuses tied specifically to overtime can be excluded. Schedule 5 governs only the PAYG withholding — it says nothing about super, which is calculated and paid separately by your employer.",
  },
] as const;
