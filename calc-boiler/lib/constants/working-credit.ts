// =============================================================================
// Centrelink Working Credit — accrual, maximum balance and depletion.
//
// SOURCES (read 23 September 2026):
//   Services Australia, "Working Credit" (QC 29721, page last updated
//   3 July 2026), JobSeeker context:
//     https://www.servicesaustralia.gov.au/working-credit?context=51411
//     - For Youth Allowance (job seeker), JobSeeker Payment, Parenting
//       Payment, Disability Support Pension, Carer Payment.
//     - Credits build when total income is under $48 a fortnight; up to
//       48 credits a fortnight; income includes work and investments, not
//       Centrelink payments.
//     - Maximum 1,000 credits (JobSeeker, Parenting, DSP, Carer); 3,500 for
//       Youth Allowance as a job seeker.
//     - "We use each Working Credit you have to offset $1 of employment income."
//     - Concession card etc. may be kept for up to 12 fortnights after payment
//       stops.
//   DSS Social Security Guide 3.1.11.20 "Working credit accrual" (reviewed
//   1 July 2024): fortnightly accrual = $48 − fortnightly ordinary income;
//   daily accrual = that ÷ 14 (max 3.4285 a day).
//   DSS Social Security Guide 3.1.11.30 "Working credit depletion" (reviewed
//   4 November 2024): the depletion amount is the LEAST of (a) employment
//   income, (b) total ordinary income above the income free area, (c) the
//   balance. Only EMPLOYMENT income can use credits. Worked example: JobSeeker,
//   $300 pay, $150 free area, 500 credits → deplete 150 → 350 left.
//   DSS 3.1.11.10: not available at or over Age Pension age, to students or
//   apprentices on Austudy/YA (they have the Income Bank instead), or on
//   Special Benefit.
//
// ⚠️ The Services Australia "Janine" example (1,000 credits, $1,600 pay →
// "$600" counted) skips the income free area. The DSS guide — the one the
// decision-maker applies — deducts only the income ABOVE the free area. Our
// calculator follows DSS, so it keeps more credits than that example implies.
//
// The JobSeeker income test (free area $150, 50c to $256, 60c after) and rates
// come from centrelink-income-test.ts; they are not restated here.
// =============================================================================

import { JOBSEEKER_INCOME_TEST, jobseekerFortnightly } from "./centrelink-income-test";

export const WORKING_CREDIT_VERIFIED_ON = "23 September 2026";

export const WORKING_CREDIT_SOURCES = {
  servicesAustralia: "https://www.servicesaustralia.gov.au/working-credit?context=51411",
  dssAccrual: "https://guides.dss.gov.au/social-security-guide/3/1/11/20",
  dssDepletion: "https://guides.dss.gov.au/social-security-guide/3/1/11/30",
  dssEligibility: "https://guides.dss.gov.au/social-security-guide/3/1/11/10",
} as const;

export const WORKING_CREDIT = {
  /** Credits accrue while fortnightly income is below this. */
  accrualThreshold: JOBSEEKER_INCOME_TEST.workingCreditThreshold, // $48
  maxPerFortnight: 48,
  /** JobSeeker, Parenting Payment, DSP, Carer Payment. */
  maxBalance: 1_000,
  /** Youth Allowance (job seeker, not full-time student or apprentice). */
  maxBalanceYouthAllowanceJobSeeker: 3_500,
  /** Concession cards etc. may continue this long after payment stops. */
  concessionFortnights: 12,
} as const;

/** Payments that can use Working Credit, and their maximum balance. */
export const WORKING_CREDIT_PAYMENTS: readonly { name: string; maxBalance: number; href?: string }[] = [
  { name: "JobSeeker Payment", maxBalance: WORKING_CREDIT.maxBalance, href: "/jobseeker-payment-calculator/" },
  { name: "Youth Allowance (job seeker)", maxBalance: WORKING_CREDIT.maxBalanceYouthAllowanceJobSeeker },
  { name: "Parenting Payment", maxBalance: WORKING_CREDIT.maxBalance, href: "/parenting-payment-calculator/" },
  { name: "Disability Support Pension", maxBalance: WORKING_CREDIT.maxBalance },
  { name: "Carer Payment", maxBalance: WORKING_CREDIT.maxBalance, href: "/carer-payment-calculator/" },
];

/** Credits earned in a fortnight with this much ordinary income. */
export function workingCreditAccrual(fortnightlyIncome: number): number {
  const income = Math.max(0, fortnightlyIncome);
  if (income >= WORKING_CREDIT.accrualThreshold) return 0;
  return Math.round((WORKING_CREDIT.accrualThreshold - income) * 100) / 100;
}

/** Balance after `fortnights` fortnights at the same income, capped at the maximum. */
export function accrueWorkingCredit(startBalance: number, fortnightlyIncome: number, fortnights: number, maxBalance: number = WORKING_CREDIT.maxBalance): number {
  const perFortnight = workingCreditAccrual(fortnightlyIncome);
  const n = Math.max(0, Math.floor(fortnights));
  return Math.min(maxBalance, Math.max(0, startBalance) + perFortnight * n);
}

/** Fortnights with no income needed to reach the maximum balance from zero. */
export function fortnightsToMaxBalance(maxBalance: number = WORKING_CREDIT.maxBalance): number {
  return Math.ceil(maxBalance / WORKING_CREDIT.maxPerFortnight);
}

export interface DepletionInput {
  balance: number;
  /** Fortnightly employment income (gross wages). */
  employmentIncome: number;
  /** Other ordinary income this fortnight (e.g. deemed investment income). */
  otherIncome?: number;
  /** Income free area for the payment ($150 for JobSeeker). */
  incomeFreeArea?: number;
}

export interface DepletionResult {
  totalIncome: number;
  /** Credits used this fortnight. */
  depleted: number;
  /** Income the income test counts after credits. */
  assessableIncome: number;
  balanceAfter: number;
}

/** DSS 3.1.11.30: depletion = least of employment income, income over the free area, balance. */
export function depleteWorkingCredit(input: DepletionInput): DepletionResult {
  const employment = Math.max(0, input.employmentIncome);
  const other = Math.max(0, input.otherIncome ?? 0);
  const freeArea = Math.max(0, input.incomeFreeArea ?? JOBSEEKER_INCOME_TEST.freeArea);
  const balance = Math.max(0, input.balance);
  const totalIncome = employment + other;
  const overFreeArea = Math.max(0, totalIncome - freeArea);
  const depleted = Math.min(employment, overFreeArea, balance);
  return {
    totalIncome,
    depleted,
    assessableIncome: Math.round((totalIncome - depleted) * 100) / 100,
    balanceAfter: Math.round((balance - depleted) * 100) / 100,
  };
}

export interface FortnightProjection {
  fortnight: number;
  balanceStart: number;
  depleted: number;
  assessableIncome: number;
  paymentWithCredit: number;
  paymentWithoutCredit: number;
  balanceEnd: number;
}

/**
 * JobSeeker fortnight by fortnight: the same wages each fortnight, credits
 * used until they run out. `maxRate` is the JobSeeker rate for the person's
 * circumstances (from JOBSEEKER_RATES), so this stays in step with indexation.
 */
export function projectJobseekerWithCredit(
  balance: number,
  fortnightlyWages: number,
  maxRate: number,
  fortnights: number,
  principalCarer = false,
): FortnightProjection[] {
  const out: FortnightProjection[] = [];
  let bal = Math.max(0, balance);
  for (let i = 1; i <= Math.max(0, Math.floor(fortnights)); i++) {
    const d = depleteWorkingCredit({ balance: bal, employmentIncome: fortnightlyWages });
    out.push({
      fortnight: i,
      balanceStart: bal,
      depleted: d.depleted,
      assessableIncome: d.assessableIncome,
      paymentWithCredit: jobseekerFortnightly(maxRate, d.assessableIncome, principalCarer),
      paymentWithoutCredit: jobseekerFortnightly(maxRate, fortnightlyWages, principalCarer),
      balanceEnd: d.balanceAfter,
    });
    bal = d.balanceAfter;
  }
  return out;
}
