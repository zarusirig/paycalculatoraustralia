// Shared FAQ copy for /employer-cost-calculator/ — rendered by the page's
// accordion and turned into FAQPage JSON-LD in app/employer-cost-calculator/
// page.tsx, so the structured data cannot drift from the page. Rates, caps and
// thresholds come from lib/constants.

import {
  calculateSuper,
  EMPLOYMENT,
  formatAUD,
  formatPercent,
  SITE_CONFIG,
  STATE_PAYROLL_TAX,
  SUPER_GUARANTEE,
  SUPER_GUARANTEE_CHARGE,
} from "@/lib/constants";
import { FBT } from "@/lib/constants/novated-lease";
import type { FaqItem } from "@/lib/faq";

// Computed min/max across all 8 states/territories so superlative claims can never go stale.
const PAYROLL_RATE_ENTRIES = Object.entries(STATE_PAYROLL_TAX);
export const MIN_RATE_STATE = PAYROLL_RATE_ENTRIES.reduce((a, b) => (b[1].rate < a[1].rate ? b : a));
export const MAX_RATE_STATE = PAYROLL_RATE_ENTRIES.reduce((a, b) => (b[1].rate > a[1].rate ? b : a));
export const MIN_THRESHOLD_STATE = PAYROLL_RATE_ENTRIES.reduce((a, b) => (b[1].threshold < a[1].threshold ? b : a));
export const MAX_THRESHOLD_STATE = PAYROLL_RATE_ENTRIES.reduce((a, b) => (b[1].threshold > a[1].threshold ? b : a));

// Cost breakdown table, derived rather than typed: Victorian payroll tax (on
// wages + super, assuming the business is above the threshold), a 1.5%
// WorkCover premium and SG capped at the annual maximum contribution base.
export const TABLE_WORKCOVER = 0.015;
export interface CostRow { salary: number; superAmt: number; leave: number; payroll: number; workcover: number; total: number }
export const costRow = (salary: number, payrollRate = STATE_PAYROLL_TAX.VIC.rate): CostRow => {
  const superAmt = calculateSuper(salary);
  const leave = Math.round(salary * (EMPLOYMENT.annualLeaveWeeks / EMPLOYMENT.weeksPerYear));
  const payroll = Math.round((salary + superAmt) * payrollRate);
  const workcover = Math.round(salary * TABLE_WORKCOVER);
  return { salary, superAmt, leave, payroll, workcover, total: salary + superAmt + leave + payroll + workcover };
};
export const MULT_100K = costRow(100_000).total / 100_000;

const FY = SITE_CONFIG.financialYear;
const SG = formatPercent(SUPER_GUARANTEE.rate, 0);
const PRT_RANGE = `${formatPercent(MIN_RATE_STATE[1].rate, 2)}–${formatPercent(MAX_RATE_STATE[1].rate, 2)}`;
const LEAVE_PROVISION = formatPercent(EMPLOYMENT.annualLeaveWeeks / EMPLOYMENT.weeksPerYear, 2);
const HIGH_EARNER = 300_000;
const SGC_LATE = SUPER_GUARANTEE_CHARGE.current.latePayment;
// FBT example: a car benefit with a $15,000 taxable value, GST-creditable (type 1).
const FBT_EXAMPLE_VALUE = 15_000;
const FBT_EXAMPLE_TAX = Math.round(FBT_EXAMPLE_VALUE * FBT.grossUpType1 * FBT.rate);

export const EMPLOYER_COST_FAQS: readonly FaqItem[] = [
  {
    q: "How much does an employee actually cost an employer?",
    a: `On this page's assumptions the cost is about ${MULT_100K.toFixed(2)}x the base salary: for a $100,000 salary, about ${formatAUD(MULT_100K * 100_000)} once superannuation (${SG}), annual leave provisions (${LEAVE_PROVISION}), workers compensation (${formatPercent(TABLE_WORKCOVER, 1)} here; 0.3%–10% by industry), and payroll tax (${PRT_RANGE}) are included. Recruitment, training, equipment and a higher-risk WorkCover rate push it higher.`,
  },
  {
    q: "What is payroll tax and who pays it?",
    a: `Payroll tax is a state government tax levied on employers when their total wage bill exceeds a state-specific annual threshold. Rates range from ${formatPercent(MIN_RATE_STATE[1].rate, 2)} in ${MIN_RATE_STATE[1].name} to ${formatPercent(MAX_RATE_STATE[1].rate, 2)} in the ${MAX_RATE_STATE[0]}. It is paid by the employer, not deducted from the employee's pay. Sole traders and small businesses below the threshold pay zero payroll tax.`,
  },
  {
    q: "What are leave provisions?",
    a: `Leave provisions are an accounting liability for leave employees have earned but not yet taken. A full-time worker on a $100,000 salary is paid for 52 weeks but, with ${EMPLOYMENT.annualLeaveWeeks} weeks of annual leave, works about ${EMPLOYMENT.weeksPerYear - EMPLOYMENT.annualLeaveWeeks} (fewer after public holidays and personal leave). The employer pays 52 weeks of wages for fewer weeks of productive work, so leave is a real part of employment cost.`,
  },
  {
    q: "What is the current superannuation rate for employers?",
    a: `The Superannuation Guarantee rate is ${SG} for FY${FY}, unchanged since ${SUPER_GUARANTEE.effectiveDate}. That is the legislated ceiling, reached after four consecutive 0.5 percentage point annual increases from 10% in FY2021-22. Employers pay this on top of the employee's salary as a contribution to their nominated super fund, and since ${SUPER_GUARANTEE.paydaySuperStart} it must be paid each payday (Payday Super).`,
  },
  {
    q: "Do fringe benefits increase my employment cost?",
    a: `Yes. If you provide benefits like a company car, parking, or entertainment, Fringe Benefits Tax (FBT) applies at ${formatPercent(FBT.rate, 0)} of the grossed-up taxable value. The FBT is paid by the employer, not the employee, which can significantly increase the true cost. A car benefit with a ${formatAUD(FBT_EXAMPLE_VALUE)} taxable value attracts roughly ${formatAUD(FBT_EXAMPLE_TAX)} in FBT once grossed up, making the total cost of that perk about ${formatAUD(FBT_EXAMPLE_VALUE + FBT_EXAMPLE_TAX)} to the business. See our Salary Sacrifice Guide for FBT-exempt alternatives.`,
    links: { "Salary Sacrifice Guide": "/salary-sacrifice-calculator/" },
  },
  {
    q: "Is a casual employee cheaper than a permanent one?",
    a: `Not per hour. Casual employees receive a ${formatPercent(EMPLOYMENT.casualLoading, 0)} loading on their base rate to compensate for no paid leave. They also attract super (${SG}), payroll tax, and WorkCover costs. The loading makes casuals more expensive per hour worked, but the flexibility of not paying for sick days, annual leave, or redundancy makes them cheaper for variable, seasonal, or project-based workloads.`,
  },
  {
    q: "Is there a cap on how much super an employer pays?",
    a: `Yes. The maximum super contribution base for FY${FY} is ${formatAUD(SUPER_GUARANTEE.maxContributionBaseAnnual)} a year (an annual figure since Payday Super started on ${SUPER_GUARANTEE.paydaySuperStart}). Employers are not legally required to pay the ${SG} SG on earnings above this cap. For an employee earning ${formatAUD(HIGH_EARNER)}, the employer's mandatory super contribution is capped at about ${formatAUD(SUPER_GUARANTEE.maxSGAnnual)} a year rather than ${formatAUD(HIGH_EARNER * SUPER_GUARANTEE.rate)}.`,
  },
  {
    q: "Do small businesses pay payroll tax?",
    a: `Most small businesses do not. Payroll tax only applies when the total wage bill exceeds the state threshold. The lowest threshold is ${formatAUD(MIN_THRESHOLD_STATE[1].threshold)} in ${MIN_THRESHOLD_STATE[1].name}, and the highest is ${formatAUD(MAX_THRESHOLD_STATE[1].threshold)} in the ${MAX_THRESHOLD_STATE[0]}. A business with 8 employees averaging $100,000 each ($800,000 total wages) pays zero payroll tax in every state and territory.`,
  },
  {
    q: "Is workers compensation insurance mandatory for all employers?",
    a: "Yes. Every employer in Australia must hold workers compensation insurance, regardless of business size or number of employees. Operating without coverage carries substantial state penalties, plus liability for the cost of any injury claim. Sole traders with no employees are the only exception in most states.",
  },
  {
    q: "What is leave loading and does every employer pay it?",
    a: "Leave loading is an additional payment of 17.5% on top of the employee's base pay rate during annual leave. It is not a universal entitlement under the National Employment Standards. Leave loading applies only when specified in the relevant modern award, enterprise agreement, or employment contract; most modern awards include it.",
  },
  {
    q: "How does long service leave affect employer costs?",
    a: "Long service leave accrues at approximately 8.67 weeks after 10 years of continuous service in most states, equivalent to an annual provision of about 1.67% of the base salary. Employers must accrue this liability on their balance sheet from the employee's start date. For a $100,000 employee, this adds approximately $1,670 per year to the total employment cost.",
  },
  {
    q: "What happens if I misclassify an employee as a contractor?",
    a: `The ATO can reclassify the worker as an employee and issue back-payment orders for all unpaid superannuation (plus the super guarantee charge), PAYG withholding, payroll tax, and workers compensation premiums for the entire engagement period. The super guarantee charge includes the shortfall, notional earnings and an administrative uplift of up to ${formatPercent(SUPER_GUARANTEE_CHARGE.current.administrativeUpliftMax, 0)}, with interest at the general interest charge rate compounded daily. If an assessed charge stays unpaid after a notice to pay, a further late payment penalty of ${formatPercent(SGC_LATE.penalty, 0)} (${formatPercent(SGC_LATE.penaltyRepeatWithin24Months, 0)} for a repeat within 24 months) applies. Use our Contractor vs Employee Calculator to assess classification risk.`,
    links: { "Contractor vs Employee Calculator": "/contractor-vs-employee-calculator/" },
  },
  {
    q: "How can employers reduce total employment costs legally?",
    a: "Employers reduce costs through 5 primary strategies: (1) offering salary sacrifice arrangements that provide tax-effective benefits at lower cost, (2) maintaining strong workplace safety records, which lower experience-rated WorkCover premiums, (3) structuring the business to remain below the state payroll tax threshold, (4) using a mix of casual and part-time workers to minimise leave liability, and (5) investing in retention to reduce recruitment costs.",
  },
];
