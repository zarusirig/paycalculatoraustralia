// Shared FAQ copy for /annual-leave-guide/ — rendered by the page's accordion
// and turned into FAQPage JSON-LD in app/annual-leave-guide/page.tsx, so the
// structured data cannot drift from the page. Rates come from lib/constants.

import { EMPLOYMENT, SUPER_GUARANTEE } from "@/lib/constants";
import type { FaqItem } from "@/lib/faq";

const SG = `${Math.round(SUPER_GUARANTEE.rate * 1000) / 10}%`;
const CASUAL = `${EMPLOYMENT.casualLoading * 100}%`;
const WEEKS = EMPLOYMENT.annualLeaveWeeks;
const PT_HOURS = 25;
// Paid long service leave accrues annual leave like any other paid leave.
const LSL_WEEKS = 8.667;
const LSL_ACCRUAL = ((LSL_WEEKS / EMPLOYMENT.weeksPerYear) * WEEKS).toFixed(2);

export const ANNUAL_LEAVE_FAQS: readonly FaqItem[] = [
  {
    q: "How much annual leave do I get?",
    a: `Full-time employees get ${WEEKS} weeks (${WEEKS * 5} days) of paid annual leave per year under the National Employment Standards. Part-time employees accrue the same ${WEEKS} weeks on a pro-rata basis, and some shift workers get ${WEEKS + 1} weeks. Casual employees do not accrue annual leave.`,
  },
  {
    q: "Is annual leave paid out when I leave?",
    a: "Yes. All accrued but untaken annual leave must be paid out on termination, whether you resign, are dismissed or are made redundant. It is paid at your base rate, plus leave loading if your award or agreement would have paid loading on the leave.",
  },
  {
    q: "Do casual employees get annual leave?",
    a: `No. Casual employees do not accrue annual leave under the National Employment Standards. They receive a ${CASUAL} casual loading on their hourly rate to compensate for the absence of annual leave, personal leave, and other permanent entitlements. A casual employee who converts to permanent employment begins accruing leave from the date of conversion.`,
  },
  {
    q: "Can my employer force me to take annual leave?",
    a: "Yes, in two circumstances. Employers can direct employees to take leave during a registered shutdown period (e.g., Christmas closure) with 28 days' notice. Employers can also direct employees with an excessive balance exceeding 8 weeks to take leave, provided the direction does not reduce the balance below 6 weeks and gives at least 8 weeks' notice.",
  },
  {
    q: "Can I cash out annual leave instead of taking it?",
    a: `Some Awards and enterprise agreements permit cashing out, but only if the employee retains a minimum balance of ${WEEKS} weeks after the cash-out. The arrangement must be a genuine written agreement, and each cash-out requires a separate agreement. Not all Awards allow cashing out — check your specific Award or agreement.`,
  },
  {
    q: "Does annual leave accrue during unpaid leave?",
    a: "No. Annual leave does not accrue during periods of unpaid leave, including unpaid parental leave and unpaid personal leave. Leave continues to accrue during paid leave (annual, personal, long service), workers' compensation, and jury duty.",
  },
  {
    q: "What happens if I get sick while on annual leave?",
    a: "An employee who falls ill or is injured during annual leave can apply to have that period re-credited as personal/carer's leave instead. The employee must provide evidence such as a medical certificate. The annual leave balance is restored, and personal leave is deducted for the sick days. This provision exists in the NES and applies to all permanent employees.",
  },
  {
    q: "Do public holidays count as annual leave?",
    a: "No. If a public holiday falls during a period of annual leave, that day is treated as a public holiday, not annual leave. The employee's annual leave balance is not reduced for that day. Australia has 8 national public holidays plus additional state-specific holidays (e.g., Melbourne Cup Day in metro VIC, Royal Queensland Show in Brisbane).",
  },
  {
    q: "Can I take annual leave in advance before it accrues?",
    a: "Yes, if the employer agrees. Leave taken in advance is deducted from future accruals. If the employee resigns or is terminated before accruing enough leave to cover the advance, the employer can deduct the overpayment from the employee's final pay. The deduction must be authorised in writing and cannot reduce the final pay below zero.",
  },
  {
    q: "Is leave loading taxed?",
    a: `Yes. Leave loading is classified as ordinary time earnings and is subject to PAYG withholding at the employee's marginal tax rate. It is included in assessable income for the financial year. The ${SG} superannuation guarantee also applies to leave loading, except where the loading is paid only to compensate for overtime you would have worked — the ATO treats that portion as not ordinary time earnings.`,
  },
  {
    q: "How much annual leave does a part-time employee get?",
    a: `Part-time employees receive ${WEEKS} weeks of annual leave on a pro-rata basis. An employee working ${PT_HOURS} hours per week accrues ${PT_HOURS} × ${WEEKS} = ${PT_HOURS * WEEKS} hours of annual leave per year. The entitlement is calculated on contracted ordinary hours, not total hours including overtime.`,
  },
  {
    q: "Does annual leave continue to accrue during long service leave?",
    a: `Yes. Annual leave accrues during any period of paid long service leave. An employee taking ${LSL_WEEKS} weeks of long service leave accrues about ${LSL_ACCRUAL} weeks of annual leave during that period (${LSL_WEEKS} ÷ ${EMPLOYMENT.weeksPerYear} × ${WEEKS} = ${LSL_ACCRUAL} weeks). This is because long service leave is a period of paid leave and the NES provides for continuous accrual during paid leave.`,
  },
  {
    q: "Does my employer pay superannuation on annual leave?",
    a: `Yes. Annual leave payments taken during employment are ordinary time earnings (OTE), and the employer must pay the ${SG} superannuation guarantee on them. Leave loading attracts super too, unless it only replaces overtime you would have worked. Unused annual leave paid out on termination is not OTE, so no super guarantee is payable on that lump sum.`,
  },
  {
    q: "Is there a maximum annual leave balance?",
    a: "No. The NES does not impose a cap on annual leave accumulation. Leave carries over indefinitely from year to year. However, balances exceeding 8 weeks (10 weeks for shift workers) are classified as \"excessive,\" and the employer can take steps to direct the employee to reduce the balance. Some enterprise agreements may include specific cap provisions.",
  },
];
