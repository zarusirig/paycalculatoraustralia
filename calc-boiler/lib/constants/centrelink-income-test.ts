// =============================================================================
// Centrelink income tests and maximum rates — JobSeeker, Austudy, Youth
// Allowance (students/apprentices), Age Pension, Work Bonus.
//
// TWO DATED RATE SETS. JobSeeker and pension rates are indexed on 20 March and
// 20 September. DSS published the 20 September 2026 figures on 20 August 2026,
// but the 20 March 2026 rates are the ones actually paid until 19 September
// 2026. This file therefore carries BOTH sets, keyed by the date they take
// effect, and exposes a pure selector — ratesOnDate() — that picks the set in
// force on a given date.
//
//   Do not collapse this to a single set, and do not select between the sets
//   with a module-scope `new Date()`. The site is a static export: a date read
//   at module scope is frozen at BUILD time, so the page would be stuck on
//   whichever set was current when the build ran. Client components must
//   resolve the active set after mount (see useCentrelinkRates in
//   modules/calculator/centrelink-shared.tsx). Server-rendered HTML uses
//   DEFAULT_RATE_SET_KEY, a constant derived from CENTRELINK_SOURCES.verifiedOn,
//   so server and client agree on the first render.
//
// Sources for each figure:
//   - 20 March 2026 set: the Services Australia pages named in
//     CENTRELINK_SOURCES, read 28 August 2026. Cut-offs are AS PUBLISHED.
//   - 20 September 2026 set: the DSS "Social Security Payment Parameters —
//     20 September 2026 indexation" rates list (CENTRELINK_SOURCES.dssRatesList),
//     published 20 August 2026, read 28 August 2026. Rates are AS PUBLISHED;
//     the cut-offs are DERIVED (see JOBSEEKER_RATES["2026-09-20"].cutOffSource)
//     because Services Australia publishes September cut-offs on the day.
//
// Two things the source pages do NOT say, and the code does not assume:
//   - The published cut-offs for JobSeeker and the student payments are
//     slightly higher than the basic rate implies, because they are built on
//     the "typical total rate" — basic rate plus Energy Supplement, plus the
//     Pharmaceutical Allowance where it applies — which the rates pages leave
//     out. Each set records that typical total, so the cut-offs reconcile
//     exactly. Age Pension totals already include the supplements.
//   - Assets tests, deeming, Rent Assistance and the parental means test are
//     out of scope. The calculators cover the personal (and partner) income
//     test only.
//
// Student payments (Austudy, Youth Allowance) index on 1 JANUARY, not
// September. They are untouched by the 20 September 2026 indexation and are
// deliberately kept as a single undated set below.
// =============================================================================

export const CENTRELINK_SOURCES = {
  verifiedOn: "28 August 2026",
  /** Machine-readable form of verifiedOn. Drives DEFAULT_RATE_SET_KEY. */
  verifiedOnISO: "2026-08-28",
  jobseekerIncomeTest: "https://www.servicesaustralia.gov.au/income-test-for-jobseeker-payment",
  jobseekerRates: "https://www.servicesaustralia.gov.au/how-much-jobseeker-payment-you-can-get",
  austudyIncomeTest: "https://www.servicesaustralia.gov.au/income-tests-for-austudy",
  austudyRates: "https://www.servicesaustralia.gov.au/how-much-austudy-you-can-get",
  youthAllowanceIncomeTest: "https://www.servicesaustralia.gov.au/what-personal-income-test-for-youth-allowance-for-students-and-australian-apprentices",
  youthAllowanceRates: "https://www.servicesaustralia.gov.au/how-much-youth-allowance-for-students-and-apprentices-you-can-get",
  agePensionIncomeTest: "https://www.servicesaustralia.gov.au/income-test-for-age-pension",
  agePensionRates: "https://www.servicesaustralia.gov.au/how-much-age-pension-you-can-get",
  workBonus: "https://www.servicesaustralia.gov.au/how-work-bonus-works",
  /** DSS rates list for the 20 September 2026 indexation, published 20 Aug 2026. */
  dssRatesList: "https://www.dss.gov.au/system/files/documents/2026-08/rates-list-20-september-2026.pdf",
  dssRatesListTitle: "Social Security Payment Parameters — 20 September 2026 indexation",
  dssRatesListPublished: "20 August 2026",
} as const;

// -----------------------------------------------------------------------------
// Dated rate sets and the selector
// -----------------------------------------------------------------------------

/** Effective dates of the rate sets carried here, oldest first. */
export const RATE_SET_KEYS = ["2026-03-20", "2026-09-20"] as const;
export type RateSetKey = (typeof RATE_SET_KEYS)[number];

export const MARCH_2026 = "2026-03-20" satisfies RateSetKey;
export const SEPTEMBER_2026 = "2026-09-20" satisfies RateSetKey;

/** Human labels for each set, for headings and column captions. */
export const RATE_SET_LABELS: Record<RateSetKey, string> = {
  "2026-03-20": "20 March 2026",
  "2026-09-20": "20 September 2026",
};

/** The last day the March set is paid — the day before the September set starts. */
export const RATE_SET_ENDS: Record<RateSetKey, string | null> = {
  "2026-03-20": "19 September 2026",
  "2026-09-20": null,
};

/** Local calendar date as YYYY-MM-DD. Local, not UTC: "today" is the user's day. */
function toIsoDay(date: Date | string): string {
  if (typeof date === "string") return date.slice(0, 10);
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * The rate set in force on a given date. Pure — pass the date in, never read
 * the clock here. Dates before the earliest set we carry fall back to that
 * earliest set (we hold no older figures).
 */
export function rateSetKeyOnDate(date: Date | string): RateSetKey {
  const day = toIsoDay(date);
  let key: RateSetKey = RATE_SET_KEYS[0];
  for (const candidate of RATE_SET_KEYS) {
    if (day >= candidate) key = candidate;
  }
  return key;
}

/**
 * The set server-rendered HTML uses: the one in force when this file was last
 * verified. A constant, so the first client render matches the server exactly.
 */
export const DEFAULT_RATE_SET_KEY: RateSetKey = rateSetKeyOnDate(CENTRELINK_SOURCES.verifiedOnISO);

// -----------------------------------------------------------------------------
// JobSeeker Payment
// -----------------------------------------------------------------------------

export interface JobseekerRateSet {
  /** ISO date the set takes effect. */
  effectiveFrom: RateSetKey;
  /** Prose form, e.g. "20 March 2026". */
  ratesFrom: string;
  /** Basic rate per fortnight, as the Services Australia rates page states it. */
  maxFortnightly: {
    single: number;
    singleWithChildren: number;
    singleOver55LongTerm: number;
    partialCapacity: number;
    partnered: number;
    principalCarerExempt: number;
  };
  /**
   * "Typical total rate": basic rate + Energy Supplement (+ Pharmaceutical
   * Allowance where it applies). The published cut-offs are built on these,
   * which is why the calculator's payment hits $0 slightly below the cut-off.
   */
  typicalTotal: {
    single: number;
    singleWithChildren: number;
    principalCarer: number;
    singleOver55LongTerm: number;
    partialCapacity: number;
    partnered: number;
    principalCarerExempt: number;
  };
  /** Your payment reduces 60c for each dollar your partner earns over these. */
  partnerIncomeLimit: {
    partner22ToPensionAge: number;
    partnerUnder22NoChildren: number;
    partnerUnder22WithChildren: number;
    taper: number;
  };
  /** "Maximum income before your payment reduces to $0" (single). */
  publishedCutOff: {
    single: number;
    singleOver55LongTerm: number;
    partialCapacity: number;
    principalCarer: number;
    principalCarerExempt: number;
    singleWithChildNotCarer: number;
  };
  /** Whether the cut-offs above are Services Australia's own figures or ours. */
  cutOffSource: "published" | "derived";
}

export const JOBSEEKER_RATES: Record<RateSetKey, JobseekerRateSet> = {
  // --- In force to 19 September 2026. Services Australia, read 28 Aug 2026. ---
  "2026-03-20": {
    effectiveFrom: "2026-03-20",
    ratesFrom: "20 March 2026",
    maxFortnightly: {
      single: 808.70,
      singleWithChildren: 866.00,
      singleOver55LongTerm: 866.00,
      partialCapacity: 866.00,
      partnered: 740.30,
      // Parenting Payment Single basic ($1,017.20) + Pension Supplement basic
      // amount ($30.10). That is how Services Australia builds this rate.
      principalCarerExempt: 1_047.30,
    },
    typicalTotal: {
      single: 817.50,              // 808.70 + 8.80 Energy Supplement
      singleWithChildren: 875.50,  // 866.00 + 9.50
      principalCarer: 882.50,      // 866.00 + 9.50 + 7.00 Pharmaceutical Allowance
      singleOver55LongTerm: 882.50,
      partialCapacity: 882.50,
      partnered: 748.20,           // 740.30 + 7.90
      principalCarerExempt: 1_066.30, // 1,047.30 + 12.00 + 7.00
    },
    partnerIncomeLimit: {
      partner22ToPensionAge: 1_415.00,
      partnerUnder22NoChildren: 1_307.00,
      partnerUnder22WithChildren: 1_402.00,
      taper: 0.6,
    },
    publishedCutOff: {
      single: 1_530.17,
      singleOver55LongTerm: 1_638.50,
      partialCapacity: 1_638.50,
      principalCarer: 2_356.25,
      principalCarerExempt: 2_815.75,
      singleWithChildNotCarer: 1_626.84,
    },
    cutOffSource: "published",
  },

  // --- In force from 20 September 2026. DSS rates list, read 28 Aug 2026. ---
  "2026-09-20": {
    effectiveFrom: "2026-09-20",
    ratesFrom: "20 September 2026",
    maxFortnightly: {
      single: 824.90,
      singleWithChildren: 883.30,
      singleOver55LongTerm: 883.30,
      partialCapacity: 883.30,
      partnered: 755.10,
      // Parenting Payment Single basic ($1,037.50) + Pension Supplement basic
      // amount ($30.70) = $1,068.20, the same construction as the March rate.
      principalCarerExempt: 1_068.20,
    },
    typicalTotal: {
      single: 833.70,              // 824.90 + 8.80 (supplements do not index)
      singleWithChildren: 892.80,  // 883.30 + 9.50
      principalCarer: 899.80,      // 883.30 + 9.50 + 7.00
      singleOver55LongTerm: 899.80,
      partialCapacity: 899.80,
      partnered: 763.00,           // 755.10 + 7.90
      principalCarerExempt: 1_087.20, // 1,068.20 + 12.00 + 7.00
    },
    partnerIncomeLimit: {
      partner22ToPensionAge: 1_440.00,
      partnerUnder22NoChildren: 1_307.00, // unchanged on 20 Sep 2026
      partnerUnder22WithChildren: 1_402.00, // unchanged on 20 Sep 2026
      taper: 0.6,
    },
    // DERIVED, NOT PUBLISHED. Services Australia publishes September cut-offs
    // on the day. These are computed with jobseekerCutOff() from the DSS
    // typical total rates above and the unchanged taper — the same arithmetic
    // reproduces every published March 2026 cut-off to the cent (the tests
    // assert that). REPLACE WITH THE PUBLISHED FIGURES AFTER 20 SEPTEMBER 2026.
    publishedCutOff: {
      single: 1_557.17,
      singleOver55LongTerm: 1_667.33,
      partialCapacity: 1_667.33,
      principalCarer: 2_399.50,
      principalCarerExempt: 2_868.00,
      singleWithChildNotCarer: 1_655.67,
    },
    cutOffSource: "derived",
  },
};

/**
 * The income test itself. Free areas and tapers index on 1 July, not on
 * 20 September, so there is one undated set. Verified 28 August 2026 and
 * unchanged by the 20 September 2026 indexation.
 */
export const JOBSEEKER_INCOME_TEST = {
  freeArea: 150,
  band1End: 256,
  taper1: 0.5,
  taper2: 0.6,
  /** Single principal carer of a dependent child under 16: 40c over $150. */
  principalCarerTaper: 0.4,
  /** Working credits accrue when income is below this. */
  workingCreditThreshold: 48,
} as const;

/** The JobSeeker rate set in force on a given date. Pure. */
export function jobseekerRatesOnDate(date: Date | string): JobseekerRateSet {
  return JOBSEEKER_RATES[rateSetKeyOnDate(date)];
}

/**
 * Back-compatible view of the JobSeeker figures: the income test plus the rate
 * set in force at CENTRELINK_SOURCES.verifiedOn. Static/server-rendered copy
 * uses this; anything that must follow the calendar reads jobseekerRatesOnDate.
 */
export const JOBSEEKER = {
  indexedOn: "20 March and 20 September",
  incomeTest: JOBSEEKER_INCOME_TEST,
  ...JOBSEEKER_RATES[DEFAULT_RATE_SET_KEY],
};

/** Fortnightly reduction from the recipient's own income. */
export function jobseekerReduction(income: number, principalCarer = false): number {
  const i = Math.max(0, income);
  const t = JOBSEEKER_INCOME_TEST;
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
  partnerTaper: number = JOBSEEKER.partnerIncomeLimit.taper,
): number {
  const own = jobseekerReduction(income, principalCarer);
  const partner = Math.max(0, partnerIncome - partnerLimit) * partnerTaper;
  return Math.max(0, Math.round((maxRate - own - partner) * 100) / 100);
}

/**
 * The income at which JobSeeker reaches $0, from the typical total rate and the
 * taper — the inverse of jobseekerReduction. Rounded to cents the way Services
 * Australia rounds its published figures.
 */
export function jobseekerCutOff(typicalTotalRate: number, principalCarer = false): number {
  const t = JOBSEEKER_INCOME_TEST;
  const raw = principalCarer
    ? typicalTotalRate / t.principalCarerTaper + t.freeArea
    // Band 1 absorbs (256 − 150) × 50c = $53 before the 60c taper starts.
    : (typicalTotalRate - (t.band1End - t.freeArea) * t.taper1) / t.taper2 + t.band1End;
  return Math.round(raw * 100) / 100;
}

// -----------------------------------------------------------------------------
// Student payments: Austudy and Youth Allowance (students / apprentices)
//
// Indexed on 1 JANUARY. Untouched by the 20 September 2026 indexation.
// -----------------------------------------------------------------------------

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

// -----------------------------------------------------------------------------
// Age Pension
// -----------------------------------------------------------------------------

export type PensionSituation = "single" | "couple";

export interface PensionRateComponents {
  basic: number;
  supplement: number;
  energy: number;
  total: number;
}

export interface AgePensionRateSet {
  effectiveFrom: RateSetKey;
  ratesFrom: string;
  /** Per fortnight. Totals include Pension Supplement and Energy Supplement. */
  maxFortnightly: {
    single: PensionRateComponents;
    coupleEach: PensionRateComponents;
    coupleCombined: PensionRateComponents;
    coupleApartIllHealth: PensionRateComponents;
  };
  /** Transitional-rate pensioners (pre-2009 rules). Typical totals. */
  transitional: { singleTotal: number; partneredEachTotal: number };
  publishedCutOff: {
    single: number;
    coupleCombined: number;
    coupleApartIllHealthCombined: number;
    transitionalSingle: number;
    transitionalCoupleCombined: number;
  };
  cutOffSource: "published" | "derived";
}

export const AGE_PENSION_RATES: Record<RateSetKey, AgePensionRateSet> = {
  // --- In force to 19 September 2026. Services Australia, read 28 Aug 2026. ---
  "2026-03-20": {
    effectiveFrom: "2026-03-20",
    ratesFrom: "20 March 2026",
    maxFortnightly: {
      single: { basic: 1_100.30, supplement: 86.50, energy: 14.10, total: 1_200.90 },
      coupleEach: { basic: 829.40, supplement: 65.20, energy: 10.60, total: 905.20 },
      coupleCombined: { basic: 1_658.80, supplement: 130.40, energy: 21.20, total: 1_810.40 },
      coupleApartIllHealth: { basic: 1_100.30, supplement: 86.50, energy: 14.10, total: 1_200.90 },
    },
    transitional: { singleTotal: 977.70, partneredEachTotal: 788.80 },
    publishedCutOff: {
      single: 2_627.80,
      coupleCombined: 4_016.80,
      coupleApartIllHealthCombined: 5_199.60,
      transitionalSingle: 2_670.25,
      transitionalCoupleCombined: 4_340.00,
    },
    cutOffSource: "published",
  },

  // --- In force from 20 September 2026. DSS rates list, read 28 Aug 2026. ---
  "2026-09-20": {
    effectiveFrom: "2026-09-20",
    ratesFrom: "20 September 2026",
    maxFortnightly: {
      single: { basic: 1_135.40, supplement: 88.20, energy: 14.10, total: 1_237.70 },
      coupleEach: { basic: 855.90, supplement: 66.50, energy: 10.60, total: 933.00 },
      coupleCombined: { basic: 1_711.80, supplement: 133.00, energy: 21.20, total: 1_866.00 },
      coupleApartIllHealth: { basic: 1_135.40, supplement: 88.20, energy: 14.10, total: 1_237.70 },
    },
    transitional: { singleTotal: 997.00, partneredEachTotal: 804.40 },
    // DERIVED, NOT PUBLISHED — computed with agePensionCutOff() from the DSS
    // rates above and the unchanged free areas and tapers. The same arithmetic
    // reproduces every published March 2026 cut-off to the cent (asserted in
    // the tests). REPLACE WITH THE PUBLISHED FIGURES AFTER 20 SEPTEMBER 2026.
    publishedCutOff: {
      single: 2_701.40,
      coupleCombined: 4_128.00,
      coupleApartIllHealthCombined: 5_346.80,
      transitionalSingle: 2_718.50,
      transitionalCoupleCombined: 4_418.00,
    },
    cutOffSource: "derived",
  },
};

/**
 * Free areas and tapers. These index on 1 July, not on 20 September, so there
 * is one undated set. Verified 28 August 2026 and unchanged by the
 * 20 September 2026 indexation.
 */
export const AGE_PENSION_INCOME_TEST = {
  single: { freeArea: 226, taper: 0.5 },
  /** Combined income; each person's pension reduces by the taper per combined dollar. */
  couple: { freeArea: 396, taper: 0.25 },
  transitional: { single: { freeArea: 226, taper: 0.4 }, couple: { freeArea: 396, taper: 0.2 } },
} as const;

/** The Age Pension rate set in force on a given date. Pure. */
export function agePensionRatesOnDate(date: Date | string): AgePensionRateSet {
  return AGE_PENSION_RATES[rateSetKeyOnDate(date)];
}

/**
 * Back-compatible view of the Age Pension figures: the income test plus the
 * rate set in force at CENTRELINK_SOURCES.verifiedOn.
 */
export const AGE_PENSION = {
  indexedOn: "20 March and 20 September",
  incomeTest: AGE_PENSION_INCOME_TEST,
  ...AGE_PENSION_RATES[DEFAULT_RATE_SET_KEY],
};

/** Fortnightly reduction of ONE person's pension. For couples pass combined income. */
export function pensionReduction(income: number, situation: PensionSituation): number {
  const t = AGE_PENSION_INCOME_TEST[situation];
  return Math.max(0, income - t.freeArea) * t.taper;
}

/** One person's fortnightly Age Pension after the income test (assets test ignored). */
export function agePensionFortnightly(
  income: number,
  situation: PensionSituation,
  rates: AgePensionRateSet = AGE_PENSION_RATES[DEFAULT_RATE_SET_KEY],
): number {
  const max = situation === "single" ? rates.maxFortnightly.single.total : rates.maxFortnightly.coupleEach.total;
  return Math.max(0, Math.round((max - pensionReduction(income, situation)) * 100) / 100);
}

export type PensionCutOffKind =
  | "single"
  | "coupleCombined"
  | "transitionalSingle"
  | "transitionalCoupleCombined";

/**
 * The income at which a pension reaches $0, from the total rate and the taper —
 * the inverse of pensionReduction. For couples, pass the per-person total rate
 * and read the answer as combined income. A couple living apart due to ill
 * health takes the single total with the "coupleCombined" test.
 */
export function agePensionCutOff(totalRate: number, kind: PensionCutOffKind): number {
  const t = AGE_PENSION_INCOME_TEST;
  const rule =
    kind === "single" ? t.single
      : kind === "coupleCombined" ? t.couple
        : kind === "transitionalSingle" ? t.transitional.single
          : t.transitional.couple;
  return Math.round((totalRate / rule.taper + rule.freeArea) * 100) / 100;
}

// -----------------------------------------------------------------------------
// Combined selector
// -----------------------------------------------------------------------------

export interface CentrelinkRateSet {
  key: RateSetKey;
  /** "20 March 2026" / "20 September 2026". */
  label: string;
  /** Last day this set is paid, or null if it is the latest set we carry. */
  endsOn: string | null;
  jobseeker: JobseekerRateSet;
  agePension: AgePensionRateSet;
}

/**
 * Every dated Centrelink figure in force on a given date. Pure — callers supply
 * the date, so this is safe to unit test and safe to call from a client effect.
 * Student payments are not returned: they index on 1 January and do not change
 * across these sets.
 */
export function ratesOnDate(date: Date | string): CentrelinkRateSet {
  const key = rateSetKeyOnDate(date);
  return {
    key,
    label: RATE_SET_LABELS[key],
    endsOn: RATE_SET_ENDS[key],
    jobseeker: JOBSEEKER_RATES[key],
    agePension: AGE_PENSION_RATES[key],
  };
}

// -----------------------------------------------------------------------------
// Work Bonus
//
// Not in the 20 September 2026 DSS rates list — the credit and maximum balance
// are set in legislation, not indexed on 20 September.
// -----------------------------------------------------------------------------

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
