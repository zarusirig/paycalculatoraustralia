// =============================================================================
// Centrelink income tests and maximum rates — JobSeeker, Austudy, Youth
// Allowance (students/apprentices), Age Pension, Work Bonus.
//
// Every figure below was read from the Services Australia page named next to
// it on 28 August 2026 (CENTRELINK_SOURCES). Rates are indexed on the dates
// each block records; re-verify after those dates. Nothing here is estimated.
//
// Two things the source pages do NOT say, and the code does not assume:
//   - The published cut-offs for JobSeeker and the student payments are
//     slightly higher than the maximum rate implies, because they include an
//     Energy Supplement that the rates pages leave out. We show the published
//     cut-off and compute payment from the maximum rate; the tests reconcile
//     the two. Age Pension totals already include the supplement.
//   - Assets tests, deeming, Rent Assistance and the parental means test are
//     out of scope. The calculators cover the personal (and partner) income
//     test only.
// =============================================================================

export const CENTRELINK_SOURCES = {
  verifiedOn: "28 August 2026",
  jobseekerIncomeTest: "https://www.servicesaustralia.gov.au/income-test-for-jobseeker-payment",
  jobseekerRates: "https://www.servicesaustralia.gov.au/how-much-jobseeker-payment-you-can-get",
  austudyIncomeTest: "https://www.servicesaustralia.gov.au/income-tests-for-austudy",
  austudyRates: "https://www.servicesaustralia.gov.au/how-much-austudy-you-can-get",
  youthAllowanceIncomeTest: "https://www.servicesaustralia.gov.au/what-personal-income-test-for-youth-allowance-for-students-and-australian-apprentices",
  youthAllowanceRates: "https://www.servicesaustralia.gov.au/how-much-youth-allowance-for-students-and-apprentices-you-can-get",
  agePensionIncomeTest: "https://www.servicesaustralia.gov.au/income-test-for-age-pension",
  agePensionRates: "https://www.servicesaustralia.gov.au/how-much-age-pension-you-can-get",
  workBonus: "https://www.servicesaustralia.gov.au/how-work-bonus-works",
} as const;

// ---------- JobSeeker Payment ----------
export const JOBSEEKER = {
  ratesFrom: "20 March 2026",
  indexedOn: "20 March and 20 September",
  /** "Your maximum fortnightly payment from 20 March 2026". */
  maxFortnightly: {
    single: 808.70,
    singleWithChildren: 866.00,
    singleOver55LongTerm: 866.00,
    partialCapacity: 866.00,
    partnered: 740.30,
    principalCarerExempt: 1_047.30,
  },
  incomeTest: {
    freeArea: 150,
    band1End: 256,
    taper1: 0.5,
    taper2: 0.6,
    /** Single principal carer of a dependent child under 16: 40c over $150. */
    principalCarerTaper: 0.4,
    /** Working credits accrue when income is below this. */
    workingCreditThreshold: 48,
  },
  /** Your payment reduces 60c for each dollar your partner earns over these. */
  partnerIncomeLimit: {
    partner22ToPensionAge: 1_415.00,
    partnerUnder22NoChildren: 1_307.00,
    partnerUnder22WithChildren: 1_402.00,
    taper: 0.6,
  },
  /** "Maximum income before your payment reduces to $0" (single). */
  publishedCutOff: {
    single: 1_530.17,
    singleOver55LongTerm: 1_638.50,
    partialCapacity: 1_638.50,
    principalCarer: 2_356.25,
    principalCarerExempt: 2_815.75,
    singleWithChildNotCarer: 1_626.84,
  },
} as const;

/** Fortnightly reduction from the recipient's own income. */
export function jobseekerReduction(income: number, principalCarer = false): number {
  const i = Math.max(0, income);
  const t = JOBSEEKER.incomeTest;
  if (principalCarer) return Math.max(0, i - t.freeArea) * t.principalCarerTaper;
  const band1 = Math.min(Math.max(0, i - t.freeArea), t.band1End - t.freeArea) * t.taper1;
  const band2 = Math.max(0, i - t.band1End) * t.taper2;
  return band1 + band2;
}

/** Fortnightly JobSeeker after the income test (own income, optional partner income). */
export function jobseekerFortnightly(
  maxRate: number,
  income: number,
  principalCarer = false,
  partnerIncome = 0,
  partnerLimit: number = JOBSEEKER.partnerIncomeLimit.partner22ToPensionAge,
): number {
  const own = jobseekerReduction(income, principalCarer);
  const partner = Math.max(0, partnerIncome - partnerLimit) * JOBSEEKER.partnerIncomeLimit.taper;
  return Math.max(0, Math.round((maxRate - own - partner) * 100) / 100);
}

// ---------- Student payments: Austudy and Youth Allowance (students / apprentices) ----------
/** Personal income test shared by Austudy and Youth Allowance for students. */
export const STUDENT_INCOME_TEST = {
  freeArea: 539,
  band1End: 646,
  taper1: 0.5,
  taper2: 0.6,
  /** Reduction at the top of band 1, as the source states it: "$53.50 plus 60 cents…". */
  band1Reduction: 53.50,
  partnerTaper: 0.6,
  /** Payment cancelled after this many consecutive fortnights at $0 from income. */
  cancelAfterZeroFortnights: 12,
} as const;

export const AUSTUDY = {
  ratesFrom: "1 January 2026",
  indexedOn: "1 January",
  maxFortnightly: {
    singleNoChildren: 677.20,
    singleWithChildren: 854.20,
    coupleNoChildren: 677.20,
    coupleWithChildren: 733.20,
    /** Long-term income support / English course rates. */
    longTermSingleNoChildren: 799.70,
    longTermCoupleNoChildren: 733.20,
  },
  publishedCutOff: {
    singleOrCoupleNoChildren: 1_697.17,
    coupleWithChildren: 1_791.67,
    singleWithChildren: 1_995.84,
    longTermSingleNoChildren: 1_904.00,
    longTermCoupleNoChildren: 1_791.67,
  },
} as const;

export const YOUTH_ALLOWANCE_STUDENT = {
  ratesFrom: "1 January 2026",
  indexedOn: "1 January",
  maxFortnightly: {
    under18AtHome: 418.90,
    under18AwayFromHome: 677.20,
    over18AtHome: 482.40,
    awayFromHome: 677.20,
    singleWithChildren: 854.20,
    coupleNoChildren: 677.20,
    coupleWithChildren: 733.20,
    longTermAtHome: 567.50,
    longTermAwayFromHome: 799.70,
    longTermCoupleNoChildren: 733.20,
  },
  publishedCutOff: {
    under18AtHome: 1_261.50,
    over18AtHome: 1_368.50,
    awayFromHome: 1_697.17,
    coupleWithChildren: 1_791.67,
    singleWithChildren: 1_995.84,
    longTermAtHome: 1_512.17,
    longTermAwayFromHome: 1_904.00,
    longTermCoupleNoChildren: 1_791.67,
  },
} as const;

/** Fortnightly reduction under the student personal income test. */
export function studentReduction(income: number): number {
  const i = Math.max(0, income);
  const t = STUDENT_INCOME_TEST;
  const band1 = Math.min(Math.max(0, i - t.freeArea), t.band1End - t.freeArea) * t.taper1;
  const band2 = Math.max(0, i - t.band1End) * t.taper2;
  return band1 + band2;
}

export function studentFortnightly(maxRate: number, income: number): number {
  return Math.max(0, Math.round((maxRate - studentReduction(income)) * 100) / 100);
}

// ---------- Age Pension ----------
export type PensionSituation = "single" | "couple";

export const AGE_PENSION = {
  ratesFrom: "20 March 2026",
  indexedOn: "20 March and 20 September",
  /** Normal rates per fortnight. Totals include Pension Supplement and Energy Supplement. */
  maxFortnightly: {
    single: { basic: 1_100.30, supplement: 86.50, energy: 14.10, total: 1_200.90 },
    coupleEach: { basic: 829.40, supplement: 65.20, energy: 10.60, total: 905.20 },
    coupleCombined: { basic: 1_658.80, supplement: 130.40, energy: 21.20, total: 1_810.40 },
    coupleApartIllHealth: { basic: 1_100.30, supplement: 86.50, energy: 14.10, total: 1_200.90 },
  },
  incomeTest: {
    single: { freeArea: 226, taper: 0.5 },
    /** Combined income; each person's pension reduces by the taper per combined dollar. */
    couple: { freeArea: 396, taper: 0.25 },
    transitional: { single: { freeArea: 226, taper: 0.4 }, couple: { freeArea: 396, taper: 0.2 } },
  },
  publishedCutOff: {
    single: 2_627.80,
    coupleCombined: 4_016.80,
    coupleApartIllHealthCombined: 5_199.60,
    transitionalSingle: 2_670.25,
    transitionalCoupleCombined: 4_340.00,
  },
} as const;

/** Fortnightly reduction of ONE person's pension. For couples pass combined income. */
export function pensionReduction(income: number, situation: PensionSituation): number {
  const t = AGE_PENSION.incomeTest[situation];
  return Math.max(0, income - t.freeArea) * t.taper;
}

/** One person's fortnightly Age Pension after the income test (assets test ignored). */
export function agePensionFortnightly(income: number, situation: PensionSituation): number {
  const max = situation === "single" ? AGE_PENSION.maxFortnightly.single.total : AGE_PENSION.maxFortnightly.coupleEach.total;
  return Math.max(0, Math.round((max - pensionReduction(income, situation)) * 100) / 100);
}

// ---------- Work Bonus ----------
export const WORK_BONUS = {
  /** Credit added each fortnight (offsets employment income before the income test). */
  fortnightlyCredit: 300,
  /** Maximum Work Bonus balance. */
  maxBalance: 11_800,
} as const;

/**
 * Employment income that counts in the pension income test after the Work
 * Bonus: the first $300 a fortnight is disregarded, then any accrued balance
 * offsets what is left.
 */
export function assessableAfterWorkBonus(employmentIncome: number, balance: number): number {
  const afterCredit = Math.max(0, employmentIncome - WORK_BONUS.fortnightlyCredit);
  const usable = Math.min(Math.max(0, balance), WORK_BONUS.maxBalance);
  return Math.max(0, afterCredit - usable);
}
