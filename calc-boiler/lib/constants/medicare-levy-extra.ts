// =============================================================================
// Medicare levy — family, seniors and surcharge mechanics
//
// australian-tax.ts holds the headline MEDICARE_LEVY figures and
// calculateMedicareLevy(), which implements the single low-income shade-in.
// That function covers one taxpayer with no spouse and no dependants. This
// file adds the parts it does not model: the seniors and pensioners
// thresholds, the family income reduction, and a family-aware surcharge.
//
// -----------------------------------------------------------------------------
// WHICH INCOME YEAR THESE FIGURES BELONG TO — read before changing anything
// -----------------------------------------------------------------------------
// The two halves of this page are on DIFFERENT income years, and conflating
// them is the accuracy risk here.
//
// * The Medicare levy LOW-INCOME THRESHOLDS below are the 2025-26 figures.
//   They are the latest the ATO has published: "Medicare levy reduction for
//   low-income earners" (QC27031, last updated 30 June 2026) still opens
//   "In 2025-26, you don't have to pay the Medicare levy if your taxable
//   income is equal to or less than the lower Medicare levy threshold", and
//   the same amounts appear in the operative text of the Medicare Levy Act
//   1986 s 8(5) and s 8(7) as consolidated. 2026-27 thresholds had not been
//   published when this file was last verified (28 July 2026). This mirrors
//   how lib/constants/sapto.ts handles the same rollover gap.
//
// * The SURCHARGE tiers in MEDICARE_LEVY.surcharge ARE published for 2026-27
//   and verified: ATO "Medicare levy surcharge income, thresholds and rates"
//   (QC49961, last updated 22 June 2026).
//
// -----------------------------------------------------------------------------
// THE CALCULATION, AND WHY IT IS BUILT THIS WAY
// -----------------------------------------------------------------------------
// The levy is worked out in two stages, and the order matters. Medicare Levy
// Act 1986 s 8(2) reduces "the amount of the levy payable ... but for this
// section and section 9" — that is, the amount AFTER the s 7 individual
// low-income reduction, not the raw 2%.
//
//   Stage 1 (s 7): levy = min(2% x taxable income, 10% x (income - lower))
//                  and nil at or below the lower threshold.
//   Stage 2 (s 8): if you have a spouse or dependants and family income
//                  exceeds the family threshold (FIT), subtract
//                      2% x FIT - 0.08 x (family income - FIT)
//                  floored at nil. Below FIT no levy is payable at all.
//   s 8(3):        where BOTH spouses would be liable, each takes the share
//                  of that reduction that their own taxable income bears to
//                  family income.
//   s 8(4):        any part of one spouse's reduction that exceeds their own
//                  levy spills over and reduces the other spouse's levy.
//
// Both ATO worked examples fall out of this exactly, to the cent, and are
// pinned in lib/constants/__tests__/medicare-levy.test.ts:
//   "Angie"  single, $29,000, no SAPTO                        -> $98.90
//   "Ashton" $49,700, spouse $21,700, SAPTO, no children      -> $92.90
// Ashton only reconciles if stage 2 is applied on top of stage 1. A flat 2%,
// or stage 2 alone, both give the wrong answer.
//
// Sources, all read 28 July 2026:
//   ATO QC27031 Medicare levy reduction for low-income earners
//   ATO QC27032 Medicare levy reduction - family income
//   ATO QC49961 Medicare levy surcharge income, thresholds and rates
//   ATO QC27036 Medical exemption from Medicare levy
//   Medicare Levy Act 1986 s 8 (family income threshold and reduction formula)
// =============================================================================

import { MEDICARE_LEVY } from "./australian-tax";

/** Income year the low-income thresholds in this file belong to. */
export const MEDICARE_LEVY_INCOME_YEAR = "2025-26";

/** Income year the surcharge tiers belong to. */
export const MLS_INCOME_YEAR = "2026-27";

/**
 * Seniors and pensioners thresholds. Available only if you are entitled to at
 * least $1 of the seniors and pensioners tax offset (SAPTO) — being of
 * age-pension age is not enough on its own, and a person who is eligible for
 * SAPTO but receives nothing because their own rebate income is too high
 * cannot use these.
 *
 * ATO QC27031: "If you're entitled to the Seniors and pensioners tax offset —
 * $44,268 lower, $55,335 upper", note 1 "The entitlement to the seniors and
 * pensioners tax offset (SAPTO) for singles ceases when the rebate income
 * reaches $52,759." ATO QC27032 for the $61,623 family figure. Both are also
 * the operative amounts in Medicare Levy Act 1986 s 8(7).
 */
export const MEDICARE_LEVY_SENIORS = {
  singleThreshold: 44_268,
  familyThreshold: 61_623,
  /** Rebate income at which SAPTO — and with it this concession — cuts out. */
  saptoSingleCutOut: 52_759,
} as const;

/** Taper in the s 8(2) family reduction formula. */
export const FAMILY_REDUCTION_TAPER = 0.08;

/**
 * MLS family thresholds rise by this much for each dependent child AFTER the
 * first. ATO QC49961: "The family income threshold is increased by $1,500 for
 * each MLS dependent child after the first child."
 */
export const MLS_CHILD_INCREMENT = 1_500;

// ---------------------------------------------------------------------------
// Thresholds
// ---------------------------------------------------------------------------

/** Lower threshold for one person, before any family provisions. */
export function singleLowerThreshold(seniorPensioner: boolean): number {
  return seniorPensioner
    ? MEDICARE_LEVY_SENIORS.singleThreshold
    : MEDICARE_LEVY.lowIncomeThreshold;
}

/** Family income threshold (FIT), s 8(5) and s 8(7). */
export function familyLowerThreshold(
  dependentChildren: number,
  seniorPensioner: boolean,
): number {
  const base = seniorPensioner
    ? MEDICARE_LEVY_SENIORS.familyThreshold
    : MEDICARE_LEVY.familyThreshold;
  return base + Math.max(0, dependentChildren) * MEDICARE_LEVY.additionalChild;
}

/**
 * The income at which the reduction runs out and the full 2% applies.
 *
 * Derived, never hardcoded. Both reduction formulas hit zero at exactly
 * 1.25x the lower threshold, because 10% x (I - L) = 2% x I when I = 1.25L.
 * That reproduces every upper threshold the ATO publishes: 28,011 -> 35,013,
 * 44,268 -> 55,335, 47,238 -> 59,047, 61,623 -> 77,028.
 */
export function upperThreshold(lower: number): number {
  const ratio =
    MEDICARE_LEVY.shadeInRate / (MEDICARE_LEVY.shadeInRate - MEDICARE_LEVY.rate);
  // The epsilon is not cosmetic: 0.10 - 0.02 is 0.08000000000000002 in binary
  // floating point, so 44,268 lands on 55,334.999... and would floor to the
  // wrong dollar without it.
  return Math.floor(lower * ratio + 1e-6);
}

// ---------------------------------------------------------------------------
// The levy
// ---------------------------------------------------------------------------

export type MedicareLevyBand =
  /** s 7: at or under the individual lower threshold — nil. */
  | "belowSingleThreshold"
  /** s 8(1): family income at or under the family threshold — nil. */
  | "belowFamilyThreshold"
  /** s 7: inside the individual shade-in, 10c per $1 over the threshold. */
  | "singleShadeIn"
  /** s 8(2): family reduction applied on top. */
  | "familyReduced"
  /** No reduction — the full 2%. */
  | "full";

export interface MedicareLevyInput {
  /** Your own taxable income. */
  taxableIncome: number;
  /** Married or de facto on the last day of the income year. */
  hasSpouse: boolean;
  /** Your spouse's taxable income. Ignored when hasSpouse is false. */
  spouseTaxableIncome: number;
  /** Dependent children for Medicare levy reduction purposes. */
  dependentChildren: number;
  /** Entitled to at least $1 of SAPTO. */
  seniorPensioner: boolean;
}

export interface MedicareLevyResult {
  /** Your Medicare levy, in dollars and cents. */
  levy: number;
  /** Your spouse's levy on the same facts — nil when you have no spouse. */
  spouseLevy: number;
  /** The two combined. */
  householdLevy: number;
  /** 2% of your taxable income, before any reduction. */
  fullRateLevy: number;
  /** Your levy after the s 7 individual reduction, before s 8. */
  levyAfterIndividualReduction: number;
  /** The s 8(2) reduction attributed to you, after any s 8(3) apportioning. */
  familyReduction: number;
  band: MedicareLevyBand;
  /** True when the family provisions in s 8 were in play at all. */
  familyProvisionsApply: boolean;
  familyIncome: number;
  singleLowerThreshold: number;
  singleUpperThreshold: number;
  familyLowerThreshold: number | null;
  familyUpperThreshold: number | null;
  usesSeniorThresholds: boolean;
}

/** s 7 — the individual low-income reduction. Exported for testing. */
export function individualLevy(taxableIncome: number, lowerThreshold: number): number {
  if (taxableIncome <= 0 || taxableIncome <= lowerThreshold) return 0;
  return Math.min(
    taxableIncome * MEDICARE_LEVY.rate,
    (taxableIncome - lowerThreshold) * MEDICARE_LEVY.shadeInRate,
  );
}

/** s 8(2) — the unapportioned family reduction. Exported for testing. */
export function familyReductionAmount(familyIncome: number, familyThreshold: number): number {
  if (familyIncome <= familyThreshold) return 0;
  return Math.max(
    0,
    MEDICARE_LEVY.rate * familyThreshold -
      FAMILY_REDUCTION_TAPER * (familyIncome - familyThreshold),
  );
}

/**
 * Full Medicare levy for one taxpayer, including the family and seniors
 * provisions. Amounts are exact to the cent; the ATO shows cents too.
 */
export function calculateMedicareLevyDetailed(input: MedicareLevyInput): MedicareLevyResult {
  const income = Math.max(0, input.taxableIncome);
  const children = Math.max(0, Math.floor(input.dependentChildren));
  const spouseIncome = input.hasSpouse ? Math.max(0, input.spouseTaxableIncome) : 0;
  const senior = input.seniorPensioner;

  const singleLower = singleLowerThreshold(senior);
  const singleUpper = upperThreshold(singleLower);
  const fullRateLevy = income * MEDICARE_LEVY.rate;

  // s 7 first, for both spouses.
  const ownS7 = individualLevy(income, singleLower);
  const spouseS7 = input.hasSpouse ? individualLevy(spouseIncome, singleLower) : 0;

  // s 8 applies where there is a spouse or a dependent child. s 8(5): family
  // income is the couple's combined taxable income, or the taxpayer's own
  // where there is no spouse (the sole-parent case).
  const familyProvisionsApply = input.hasSpouse || children > 0;
  const familyIncome = input.hasSpouse ? income + spouseIncome : income;
  const familyLower = familyProvisionsApply ? familyLowerThreshold(children, senior) : null;
  const familyUpper = familyLower === null ? null : upperThreshold(familyLower);

  const base = {
    fullRateLevy,
    levyAfterIndividualReduction: ownS7,
    familyProvisionsApply,
    familyIncome,
    singleLowerThreshold: singleLower,
    singleUpperThreshold: singleUpper,
    familyLowerThreshold: familyLower,
    familyUpperThreshold: familyUpper,
    usesSeniorThresholds: senior,
  };

  // No family provisions — s 7 alone decides it.
  if (familyLower === null) {
    return {
      ...base,
      levy: ownS7,
      spouseLevy: 0,
      householdLevy: ownS7,
      familyReduction: 0,
      band:
        ownS7 === 0
          ? "belowSingleThreshold"
          : ownS7 < fullRateLevy
            ? "singleShadeIn"
            : "full",
    };
  }

  // s 8(1) — family income at or under the threshold, no levy is payable.
  if (familyIncome <= familyLower) {
    return {
      ...base,
      levy: 0,
      spouseLevy: 0,
      householdLevy: 0,
      familyReduction: ownS7,
      band: "belowFamilyThreshold",
    };
  }

  // s 8(2), then s 8(3) where both spouses would be liable.
  const reduction = familyReductionAmount(familyIncome, familyLower);
  const bothLiable = ownS7 > 0 && spouseS7 > 0;
  let ownReduction = bothLiable && familyIncome > 0 ? (reduction * income) / familyIncome : reduction;
  let spouseReduction = bothLiable && familyIncome > 0 ? reduction - ownReduction : 0;

  // s 8(4) — reduction in excess of one spouse's own levy passes to the other.
  if (ownReduction > ownS7 && spouseS7 > 0) {
    spouseReduction += ownReduction - ownS7;
    ownReduction = ownS7;
  } else if (spouseReduction > spouseS7 && ownS7 > 0) {
    ownReduction += spouseReduction - spouseS7;
    spouseReduction = spouseS7;
  }

  const levy = Math.max(0, ownS7 - ownReduction);
  const spouseLevy = Math.max(0, spouseS7 - spouseReduction);

  return {
    ...base,
    levy,
    spouseLevy,
    householdLevy: levy + spouseLevy,
    familyReduction: Math.min(ownReduction, ownS7),
    band:
      ownS7 === 0
        ? "belowSingleThreshold"
        : reduction > 0
          ? "familyReduced"
          : ownS7 < fullRateLevy
            ? "singleShadeIn"
            : "full",
  };
}

// ---------------------------------------------------------------------------
// Medicare levy surcharge — a separate charge, avoidable with hospital cover
// ---------------------------------------------------------------------------

export type MlsTier = 0 | 1 | 2 | 3;

export interface MlsInput {
  /**
   * Your income for MLS purposes: taxable income plus reportable fringe
   * benefits, total net investment losses and reportable super contributions.
   * Wider than taxable income, which is why salary sacrifice does not help.
   */
  mlsIncome: number;
  /** Your spouse's income for MLS purposes. Ignored without a spouse. */
  spouseMlsIncome: number;
  hasSpouse: boolean;
  dependentChildren: number;
  /** Compliant private patient hospital cover held for the whole year. */
  hasPrivateHospitalCover: boolean;
}

export interface MlsResult {
  surcharge: number;
  rate: number;
  tier: MlsTier;
  /** Income the tier is decided on — combined where you have a family. */
  testedIncome: number;
  /** Top of the base (nil) tier on your circumstances. */
  baseThreshold: number;
  /** Lower bound of the tier you landed in, or null in the base tier. */
  tierFloor: number | null;
  /** Upper bound of the tier you landed in, or null in the top tier. */
  tierCeiling: number | null;
  usesFamilyThresholds: boolean;
  /** True only where cover is what keeps the surcharge at nil. */
  avoidedByCover: boolean;
}

/**
 * The surcharge you pay is worked out on YOUR income for MLS purposes, but the
 * tier is decided on the combined income where you have a family. ATO QC49961.
 */
export function calculateMLS(input: MlsInput): MlsResult {
  const own = Math.max(0, input.mlsIncome);
  const children = Math.max(0, Math.floor(input.dependentChildren));
  const spouse = input.hasSpouse ? Math.max(0, input.spouseMlsIncome) : 0;

  // Family thresholds apply if you have a spouse or any dependent children.
  const usesFamilyThresholds = input.hasSpouse || children > 0;
  const testedIncome = usesFamilyThresholds ? own + spouse : own;

  const s = MEDICARE_LEVY.surcharge;
  // Every family boundary shifts by $1,500 per dependent child after the first.
  const lift = usesFamilyThresholds ? Math.max(0, children - 1) * MLS_CHILD_INCREMENT : 0;
  const t1 = usesFamilyThresholds ? s.familyTier1 : s.tier1;
  const t2 = usesFamilyThresholds ? s.familyTier2 : s.tier2;
  const t3 = usesFamilyThresholds ? s.familyTier3 : s.tier3;

  const baseThreshold = t1.min - 1 + lift;

  let tier: MlsTier = 0;
  let rate = 0;
  let tierFloor: number | null = null;
  let tierCeiling: number | null = null;

  if (testedIncome > baseThreshold) {
    if (testedIncome <= t1.max + lift) {
      tier = 1;
      rate = t1.rate;
      tierFloor = t1.min + lift;
      tierCeiling = t1.max + lift;
    } else if (testedIncome <= t2.max + lift) {
      tier = 2;
      rate = t2.rate;
      tierFloor = t2.min + lift;
      tierCeiling = t2.max + lift;
    } else {
      tier = 3;
      rate = t3.rate;
      tierFloor = t3.min + lift;
      tierCeiling = null;
    }
  }

  const avoidedByCover = input.hasPrivateHospitalCover && tier > 0;

  return {
    surcharge: input.hasPrivateHospitalCover ? 0 : own * rate,
    rate: input.hasPrivateHospitalCover ? 0 : rate,
    tier: input.hasPrivateHospitalCover ? 0 : tier,
    testedIncome,
    baseThreshold,
    tierFloor: input.hasPrivateHospitalCover ? null : tierFloor,
    tierCeiling: input.hasPrivateHospitalCover ? null : tierCeiling,
    usesFamilyThresholds,
    avoidedByCover,
  };
}

// ---------------------------------------------------------------------------
// Exemptions — summary only, the tests of eligibility are not arithmetic
// ---------------------------------------------------------------------------

export interface LevyExemptionCategory {
  category: string;
  relief: "Full" | "Full or half" | "Full for the exempt period";
  detail: string;
}

/**
 * ATO QC27035 and QC27036. The half exemption is the part people miss: a
 * Category 1 medical exemption drops to half where you have a dependant who
 * is neither in an exemption category nor liable for the levy themselves.
 */
export const LEVY_EXEMPTION_CATEGORIES: readonly LevyExemptionCategory[] = [
  {
    category: "Medical (Category 1)",
    relief: "Full or half",
    detail:
      "Blind pensioners, and anyone entitled to full free medical treatment for all conditions under Defence Force arrangements or a DVA Repatriation Health Card (Gold Card). You get the full exemption if you had no dependants, or if every dependant was itself exempt or paid the levy. It drops to a half exemption if you had at least one dependant — a spouse, typically — who was neither exempt nor liable for the levy.",
  },
  {
    category: "Foreign residents",
    relief: "Full for the exempt period",
    detail:
      "You pay no Medicare levy for any period you were a foreign resident for tax purposes. Part-year residents pay it only on the residency period.",
  },
  {
    category: "Not entitled to Medicare benefits",
    relief: "Full for the exempt period",
    detail:
      "Temporary residents on visas that do not confer Medicare eligibility can apply to Services Australia for a Medicare Entitlement Statement and claim the exemption on lodgment. People from countries with a reciprocal health care agreement — including the UK, New Zealand and Ireland — are entitled to Medicare and so do pay the levy.",
  },
  {
    category: "Spouse and dependant tests",
    relief: "Full or half",
    detail:
      "Where both spouses would otherwise be liable and one is in a Category 1 exemption category, a signed family agreement decides which of you claims the full exemption and which claims the half. Shared-care arrangements split by day: half for the days you had care, full for the days you did not.",
  },
] as const;
