// =============================================================================
// Child Care Subsidy (CCS) 2026-27 — Centrelink wave 3 (H3).
//
// Read on 24 September 2026 from Services Australia (income, higher-rate,
// hourly-cap, hours and examples pages) and cross-checked against the
// Department of Education provider page ("CCS rates 2026-27", "Rates for
// second and younger children 2026-27", "2026–27 hourly rate caps", and the
// 3 Day Guarantee). The two sources agree on every figure below.
//
// Rounding: Services Australia shows CCS percentages to 2 decimal places
// (e.g. 81.70% on $130,000). ccsStandardPercent() reproduces all five of its
// standard-rate worked examples exactly (asserted in the tests).
//
// Known source discrepancy: Services Australia's twins example ($182,300
// family income) gives the higher-rate child 81.99%. The published
// higher-rate table (both sources) gives 95% − ($182,300 − $146,437) ÷ $3,000
// = 83.05%. We follow the published table and say so on the page.
//
// Not modelled: Additional Child Care Subsidy, In Home Care per-family
// rules beyond the cap, absences, shared care, fee discounts for educators.
// =============================================================================

export const CCS_SOURCES = {
  verifiedOn: "24 September 2026",
  verifiedOnISO: "2026-09-24",
  income: "https://www.servicesaustralia.gov.au/your-income-can-affect-child-care-subsidy",
  higherRate: "https://www.servicesaustralia.gov.au/your-number-children-care-can-affect-your-higher-child-care-subsidy",
  careType: "https://www.servicesaustralia.gov.au/type-child-care-you-use-can-affect-child-care-subsidy",
  hours: "https://www.servicesaustralia.gov.au/recognised-participation-and-activity-test-for-child-care-subsidy",
  examples: "https://www.servicesaustralia.gov.au/examples-to-help-you-understand-your-child-care-subsidy",
  howMuch: "https://www.servicesaustralia.gov.au/how-much-child-care-subsidy-you-can-get",
  education: "https://www.education.gov.au/early-childhood/providers/child-care-subsidy",
  startingBlocks: "https://www.startingblocks.gov.au/child-care-subsidy-calculator",
} as const;

export type CareType = "cbdc" | "fdc" | "oshc" | "ihc";
export type ChildAgeBand = "belowSchool" | "schoolAge";

export const CARE_TYPE_LABELS: Record<CareType, string> = {
  cbdc: "Centre Based Day Care (long day care)",
  fdc: "Family Day Care",
  oshc: "Outside School Hours Care",
  ihc: "In Home Care (per family)",
};

export const CCS = {
  financialYear: "2026-27",
  standard: {
    maxPercent: 90,
    /** 90% up to and including this family income. */
    lowerThreshold: 88_520,
    /** 1 percentage point per $5,000 above the threshold. */
    step: 5_000,
    /** 0% at or above this. */
    cutOut: 538_520,
  },
  higher: {
    maxPercent: 95,
    band1Start: 146_437,
    band1End: 191_437,
    plateauPercent: 80,
    band2Start: 270_727,
    band2End: 360_727,
    floorPercent: 50,
    /** At or above this, every child gets the standard rate. */
    incomeLimit: 370_727,
    step: 3_000,
    /** Higher rate needs more than one CCS-eligible child aged 5 or under. */
    maxChildAge: 5,
  },
  hourlyRateCap: {
    belowSchool: { cbdc: 15.19, fdc: 14.08, oshc: 15.19, ihc: 41.31 },
    schoolAge: { cbdc: 13.30, fdc: 14.08, oshc: 13.30, ihc: 41.31 },
  } satisfies Record<ChildAgeBand, Record<CareType, number>>,
  hours: {
    /** From 5 January 2026 every eligible family gets at least this many per child per fortnight. */
    guaranteed: 72,
    /** More than 48 hours of recognised participation (both parents), exemptions, First Nations children. */
    higher: 100,
    participationThreshold: 48,
    guaranteeFrom: "5 January 2026",
  },
  /** Withheld by default each fortnight, paid at balancing if not needed. */
  defaultWithholding: 0.05,
  absenceDaysPerChildPerYear: 42,
} as const;

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Standard CCS percentage (e.g. 81.7 for 81.70%) on annual family income. */
export function ccsStandardPercent(familyIncome: number): number {
  const s = CCS.standard;
  const i = Math.max(0, familyIncome);
  if (i <= s.lowerThreshold) return s.maxPercent;
  if (i >= s.cutOut) return 0;
  return Math.max(0, round2(s.maxPercent - (i - s.lowerThreshold) / s.step));
}

/**
 * Higher CCS percentage for a second or younger child aged 5 or under, or
 * null when family income is at or above the higher-rate income limit (all
 * children then get the standard rate).
 */
export function ccsHigherPercent(familyIncome: number): number | null {
  const h = CCS.higher;
  const i = Math.max(0, familyIncome);
  if (i >= h.incomeLimit) return null;
  if (i <= h.band1Start) return h.maxPercent;
  if (i < h.band1End) return round2(h.maxPercent - (i - h.band1Start) / h.step);
  if (i < h.band2Start) return h.plateauPercent;
  if (i < h.band2End) return round2(h.plateauPercent - (i - h.band2Start) / h.step);
  return h.floorPercent;
}

/** Subsidised hours per child per fortnight: 72, or 100 above 48 hours of participation (the lower parent's). */
export function ccsSubsidisedHours(lowerParentParticipationHours: number, exemptOrFirstNations = false): number {
  if (exemptOrFirstNations) return CCS.hours.higher;
  return lowerParentParticipationHours > CCS.hours.participationThreshold ? CCS.hours.higher : CCS.hours.guaranteed;
}

export interface CcsChildInput {
  careType: CareType;
  ageBand: ChildAgeBand;
  /** Fee per day (session). */
  dailyFee: number;
  /** Hours in the charged session (not the hours attended). */
  sessionHours: number;
  daysPerWeek: number;
  /** True for the second or younger CCS-eligible child aged 5 or under. */
  higherRateChild: boolean;
}

export interface CcsChildResult {
  percent: number;
  hourlyFee: number;
  cap: number;
  subsidyPerHour: number;
  hoursCharged: number;
  hoursSubsidised: number;
  feesFortnight: number;
  subsidyFortnight: number;
  withheldFortnight: number;
  paidFortnight: number;
  gapFortnight: number;
}

/**
 * One child's fortnight: the CCS percentage is applied to the lower of the
 * hourly fee and the hourly rate cap, for up to the subsidised hours. The
 * default 5% withholding is taken off what is paid to the service.
 */
export function ccsForChild(child: CcsChildInput, familyIncome: number, subsidisedHours: number, withholding: number = CCS.defaultWithholding): CcsChildResult {
  const higher = child.higherRateChild && child.careType !== "ihc" ? ccsHigherPercent(familyIncome) : null;
  const percent = higher ?? ccsStandardPercent(familyIncome);
  const sessionHours = Math.max(0, child.sessionHours);
  const hourlyFee = sessionHours > 0 ? Math.max(0, child.dailyFee) / sessionHours : 0;
  const cap = CCS.hourlyRateCap[child.ageBand][child.careType];
  const subsidyPerHour = round2((Math.min(hourlyFee, cap) * percent) / 100);
  const hoursCharged = sessionHours * Math.max(0, child.daysPerWeek) * 2;
  const hoursSubsidised = Math.min(hoursCharged, Math.max(0, subsidisedHours));
  const feesFortnight = round2(Math.max(0, child.dailyFee) * Math.max(0, child.daysPerWeek) * 2);
  const subsidyFortnight = round2(subsidyPerHour * hoursSubsidised);
  const withheldFortnight = round2(subsidyFortnight * Math.min(1, Math.max(0, withholding)));
  const paidFortnight = round2(subsidyFortnight - withheldFortnight);
  const gapFortnight = round2(Math.max(0, feesFortnight - paidFortnight));
  return { percent, hourlyFee: round2(hourlyFee), cap, subsidyPerHour, hoursCharged, hoursSubsidised, feesFortnight, subsidyFortnight, withheldFortnight, paidFortnight, gapFortnight };
}
