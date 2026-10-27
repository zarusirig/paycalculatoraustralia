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
import { COMMON_LEAVE_LOADING } from "@/lib/constants/minimum-wage";
import { LSL_JURISDICTIONS } from "@/lib/constants/long-service-leave";
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
const PRT_RANGE = `${formatPercent(MIN_RATE_STATE[1].rate, 2)} to ${formatPercent(MAX_RATE_STATE[1].rate, 2)}`;
const LEAVE_PROVISION = formatPercent(EMPLOYMENT.annualLeaveWeeks / EMPLOYMENT.weeksPerYear, 2);
const HIGH_EARNER = 300_000;
const SGC_LATE = SUPER_GUARANTEE_CHARGE.current.latePayment;
// FBT example: a car benefit with a $15,000 taxable value, GST-creditable (type 1).
const FBT_EXAMPLE_VALUE = 15_000;
const FBT_EXAMPLE_TAX = Math.round(FBT_EXAMPLE_VALUE * FBT.grossUpType1 * FBT.rate);
// Payroll tax example: the most $100,000 employees whose wages plus super stay
// under the lowest state threshold (super counts as taxable wages).
const PT_SALARY = 100_000;
const PT_PER_HEAD = PT_SALARY + calculateSuper(PT_SALARY);
const PT_HEADCOUNT = Math.floor(MIN_THRESHOLD_STATE[1].threshold / PT_PER_HEAD);
// Long service leave, from the eight state and territory Acts (lib/constants/long-service-leave.ts).
const joinAnd = (xs: string[]) => (xs.length <= 1 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`);
const LSL_LIST = Object.values(LSL_JURISDICTIONS);
const LSL_STD = LSL_LIST.filter((j) => j.weeksPerYear < 1);
const LSL_HIGH = LSL_LIST.filter((j) => j.weeksPerYear >= 1);
const LSL_EARLY = LSL_LIST.filter((j) => j.takeAfterYears < 10);
const LSL_STD_RATE = LSL_JURISDICTIONS.nsw.weeksPerYear;
const LSL_HIGH_RATE = LSL_JURISDICTIONS.sa.weeksPerYear;
const lslWeeks10 = (rate: number) => String(Math.round(rate * 10 * 100) / 100);
const lslCost = (rate: number) => formatAUD((PT_SALARY * rate) / EMPLOYMENT.weeksPerYear);
const lslPct = (rate: number) => formatPercent(rate / EMPLOYMENT.weeksPerYear, 2);

export const EMPLOYER_COST_FAQS: readonly FaqItem[] = [
  {
    q: "How much does an employee actually cost an employer?",
    a: `On this page's assumptions the cost is about ${MULT_100K.toFixed(2)}x the base salary: for a $100,000 salary, about ${formatAUD(MULT_100K * 100_000)} once superannuation (${SG}), annual leave provisions (${LEAVE_PROVISION}), workers compensation (${formatPercent(TABLE_WORKCOVER, 1)} here; the rate depends on your industry's risk), and payroll tax (${PRT_RANGE}) are included. Recruitment, training, equipment and a higher-risk WorkCover rate push it higher.`,
  },
  {
    q: "What is payroll tax and who pays it?",
    a: `Payroll tax is a state government tax levied on employers when their total wage bill exceeds a state-specific annual threshold. Base rates range from ${formatPercent(MIN_RATE_STATE[1].rate, 2)} in ${MIN_RATE_STATE[1].name} to ${formatPercent(MAX_RATE_STATE[1].rate, 2)} in the ${MAX_RATE_STATE[0]}. It is paid by the employer, not deducted from the employee's pay. Sole traders and small businesses below the threshold pay zero payroll tax.`,
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
    a: `Yes. If you provide benefits like a company car, parking, or entertainment, Fringe Benefits Tax (FBT) applies at ${formatPercent(FBT.rate, 0)} of the grossed-up taxable value. The employer pays the FBT, not the employee. A car benefit with a ${formatAUD(FBT_EXAMPLE_VALUE)} taxable value attracts roughly ${formatAUD(FBT_EXAMPLE_TAX)} in FBT once grossed up, making the total cost of that perk about ${formatAUD(FBT_EXAMPLE_VALUE + FBT_EXAMPLE_TAX)} to the business. See our Salary Sacrifice Guide for FBT-exempt alternatives.`,
    links: { "Salary Sacrifice Guide": "/salary-sacrifice-calculator/" },
  },
  {
    q: "Is a casual employee cheaper than a permanent one?",
    a: `Not per hour. Casual employees receive a ${formatPercent(EMPLOYMENT.casualLoading, 0)} loading on their base rate to compensate for no paid leave. They also attract super (${SG}), payroll tax, and WorkCover costs. The loading makes casuals more expensive per hour worked, but with no paid sick days, annual leave or redundancy pay, casuals cost less for variable, seasonal or project-based workloads.`,
  },
  {
    q: "Is there a cap on how much super an employer pays?",
    a: `Yes. The maximum super contribution base for FY${FY} is ${formatAUD(SUPER_GUARANTEE.maxContributionBaseAnnual)} a year (an annual figure since Payday Super started on ${SUPER_GUARANTEE.paydaySuperStart}). Employers are not legally required to pay the ${SG} SG on earnings above this cap. For an employee earning ${formatAUD(HIGH_EARNER)}, the employer's mandatory super contribution is capped at about ${formatAUD(SUPER_GUARANTEE.maxSGAnnual)} a year rather than ${formatAUD(HIGH_EARNER * SUPER_GUARANTEE.rate)}.`,
  },
  {
    q: "Do small businesses pay payroll tax?",
    a: `Only when their taxable wages pass the state or territory threshold. Taxable wages include employer super, not just salaries, and a group of related businesses counts its wages together. The lowest threshold is ${formatAUD(MIN_THRESHOLD_STATE[1].threshold)} in ${MIN_THRESHOLD_STATE[1].name}, and the highest is ${formatAUD(MAX_THRESHOLD_STATE[1].threshold)} in the ${MAX_THRESHOLD_STATE[0]}. A business with ${PT_HEADCOUNT} employees on ${formatAUD(PT_SALARY)} each pays ${formatAUD(PT_HEADCOUNT * PT_SALARY)} in salaries plus ${formatAUD(PT_HEADCOUNT * (PT_PER_HEAD - PT_SALARY))} in super, ${formatAUD(PT_HEADCOUNT * PT_PER_HEAD)} in taxable wages. That is under every threshold, so it pays no payroll tax in any state or territory.`,
  },
  {
    q: "Is workers compensation insurance mandatory for all employers?",
    a: "Yes. Every employer in Australia must hold workers compensation insurance, regardless of business size or number of employees. Operating without coverage carries substantial state penalties, plus liability for the cost of any injury claim. Sole traders with no employees are the only exception in most states.",
  },
  {
    q: "What is leave loading and does every employer pay it?",
    a: `Leave loading is an extra ${formatPercent(COMMON_LEAVE_LOADING, 1)} on top of the employee's base pay rate during annual leave. It is not an entitlement under the National Employment Standards, which pay annual leave at the base rate. Leave loading applies only when the relevant modern award, enterprise agreement or employment contract provides for it. The Hospitality Award pays a flat ${formatPercent(COMMON_LEAVE_LOADING, 1)}; the Retail and Clerks awards pay the higher of ${formatPercent(COMMON_LEAVE_LOADING, 1)} or the penalty rates the employee would have earned.`,
  },
  {
    q: "How does long service leave affect employer costs?",
    a: `Each state and territory sets its own long service leave rules. In ${LSL_STD.length} of the ${LSL_LIST.length} it builds at ${lslWeeks10(LSL_STD_RATE)} weeks for 10 years of continuous service, an annual cost of about ${lslPct(LSL_STD_RATE)} of base salary (${lslCost(LSL_STD_RATE)} a year on a ${formatAUD(PT_SALARY)} salary). ${joinAnd(LSL_HIGH.map((j) => j.abbr))} give ${lslWeeks10(LSL_HIGH_RATE)} weeks for 10 years, about ${lslPct(LSL_HIGH_RATE)} (${lslCost(LSL_HIGH_RATE)}). ${joinAnd(LSL_EARLY.map((j) => j.abbr))} let employees take it after ${LSL_EARLY[0]?.takeAfterYears ?? 7} years. Service counts from the employee's first day, so the cost builds from the start even though the leave is taken years later.`,
  },
  {
    q: "What happens if I misclassify an employee as a contractor?",
    a: `The ATO can treat the worker as an employee, apply a PAYG withholding penalty for the tax you did not withhold, and assess the super guarantee charge on the super you did not pay. Payroll tax is assessed separately by your state or territory revenue office, and workers compensation premiums by your state's workers compensation insurer or regulator. The super guarantee charge includes the shortfall, notional earnings and an administrative uplift of up to ${formatPercent(SUPER_GUARANTEE_CHARGE.current.administrativeUpliftMax, 0)}, with interest at the general interest charge rate compounded daily. If an assessed charge stays unpaid after a notice to pay, a further late payment penalty of ${formatPercent(SGC_LATE.penalty, 0)} (${formatPercent(SGC_LATE.penaltyRepeatWithin24Months, 0)} for a repeat within 24 months) applies. Use our Contractor vs Employee Calculator to assess classification risk.`,
    links: { "Contractor vs Employee Calculator": "/contractor-vs-employee-calculator/" },
  },
  {
    q: "How can employers reduce total employment costs legally?",
    a: "Employers reduce costs through 5 primary strategies: (1) offering salary sacrifice arrangements that provide tax-effective benefits at lower cost, (2) maintaining strong workplace safety records, which lower experience-rated WorkCover premiums, (3) structuring the business to remain below the state payroll tax threshold, (4) using a mix of casual and part-time workers to minimise leave liability, and (5) investing in retention to reduce recruitment costs.",
  },
];
