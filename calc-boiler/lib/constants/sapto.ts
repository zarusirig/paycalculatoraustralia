// =============================================================================
// Seniors and Pensioners Tax Offset (SAPTO)
//
// Source: ATO "Seniors and pensioners tax offset" QC72197, last updated
// 8 June 2026, retrieved via firecrawl 28 July 2026.
//
// YEAR NOTE. As with the zone tax offset, these are the figures for the income
// year currently being lodged (2025-26). The ATO's own transfer worked example
// on that page is captioned "during the 2025-26 income year" and uses the 16%
// lowest marginal rate, which was replaced by 15% on 1 July 2026. Do not
// relabel this file to 2026-27 without a published ATO source.
//
// STRUCTURAL NOTE. Two different incomes drive the calculation and conflating
// them is the easy mistake:
//   - ELIGIBILITY for a couple is tested on HALF the COMBINED rebate income
//     against the cut-out threshold.
//   - The OFFSET AMOUNT is then computed on the person's OWN actual rebate
//     income against the shading-out threshold.
// The ATO's "Keith and Jean" and "Ying and Li Jun" examples exist precisely to
// make that distinction, and both are asserted in the tests.
// =============================================================================

/** The income year these amounts apply to. */
export const SAPTO_INCOME_YEAR = "2025-26";

/** Which SAPTO status applies. The ATO calls these SAPTO codes. */
export type SaptoStatus = "single" | "couple" | "illnessSeparated";

export interface SaptoBand {
  label: string;
  /** Maximum offset before any shading-out reduction. */
  maxOffset: number;
  /** Rebate income above which the offset starts reducing. */
  shadingOutThreshold: number;
  /** Rebate income at or above which no offset remains. */
  cutOutThreshold: number;
  /** Combined-rebate-income limit used for the couple eligibility test. */
  combinedCutOut: number;
}

/** ATO "Rates and rebate income thresholds for SAPTO". */
export const SAPTO_BANDS: Readonly<Record<SaptoStatus, SaptoBand>> = {
  single: {
    label: "Single",
    maxOffset: 2_230,
    shadingOutThreshold: 34_919,
    cutOutThreshold: 52_759,
    combinedCutOut: 52_759,
  },
  couple: {
    label: "Each partner of a couple",
    maxOffset: 1_602,
    shadingOutThreshold: 30_994,
    cutOutThreshold: 43_810,
    combinedCutOut: 87_620,
  },
  illnessSeparated: {
    label: "Each partner of an illness-separated couple",
    maxOffset: 2_040,
    shadingOutThreshold: 33_732,
    cutOutThreshold: 50_052,
    combinedCutOut: 100_104,
  },
} as const;

/** The offset reduces by 12.5c for every $1 of rebate income over the threshold. */
export const SAPTO_REDUCTION_RATE = 0.125;

/** Transfer of a spouse's unused SAPTO: A − ((B − $6,000) × 0.15). */
export const SAPTO_TRANSFER = {
  taxableIncomeFloor: 6_000,
  reductionRate: 0.15,
} as const;

export interface SaptoInput {
  status: SaptoStatus;
  /** This person's own rebate income. */
  rebateIncome: number;
  /** Spouse's rebate income. Ignored when status is "single". */
  spouseRebateIncome?: number;
  /** Whether this person meets the pension/allowance condition at all. */
  eligibleForPension?: boolean;
}

export interface SaptoResult {
  /** The offset, in whole dollars, never negative. */
  offset: number;
  eligible: boolean;
  /** Why the person is ineligible, when they are. */
  reason: "eligible" | "notPensionEligible" | "combinedIncomeTooHigh";
  maxOffset: number;
  shadingOutThreshold: number;
  cutOutThreshold: number;
  /** Combined rebate income used for the couple eligibility test. */
  combinedRebateIncome: number;
  /** Half the combined figure — what the ATO compares to the cut-out. */
  assessedRebateIncome: number;
  /** Amount the offset was reduced by, before rounding. */
  reduction: number;
}

/**
 * Seniors and pensioners tax offset.
 *
 * The ATO rounds the final offset UP to the nearest whole dollar — its own
 * examples take $1,719.875 to $1,720 and $1,402.50 to $1,403.
 */
export function calculateSAPTO(input: SaptoInput): SaptoResult {
  const { status, rebateIncome, spouseRebateIncome = 0, eligibleForPension = true } = input;
  const band = SAPTO_BANDS[status];

  const own = Math.max(0, rebateIncome);
  const spouse = status === "single" ? 0 : Math.max(0, spouseRebateIncome);
  const combined = own + spouse;

  // For a couple, eligibility is tested on HALF the combined rebate income.
  // For a single person the assessed figure is simply their own.
  const assessed = status === "single" ? own : combined / 2;

  const base = {
    maxOffset: band.maxOffset,
    shadingOutThreshold: band.shadingOutThreshold,
    cutOutThreshold: band.cutOutThreshold,
    combinedRebateIncome: combined,
    assessedRebateIncome: assessed,
  };

  if (!eligibleForPension) {
    return { ...base, offset: 0, eligible: false, reason: "notPensionEligible", reduction: 0 };
  }

  if (assessed >= band.cutOutThreshold) {
    return { ...base, offset: 0, eligible: false, reason: "combinedIncomeTooHigh", reduction: 0 };
  }

  // Eligible. The amount is worked out on this person's OWN rebate income.
  const excess = Math.max(0, own - band.shadingOutThreshold);
  const reduction = excess * SAPTO_REDUCTION_RATE;
  const offset = Math.max(0, Math.ceil(band.maxOffset - reduction));

  return { ...base, offset, eligible: true, reason: "eligible", reduction };
}

/**
 * A spouse's unused SAPTO available for transfer.
 * ATO: A − ((B − $6,000) × 0.15), where B is the spouse's taxable income plus
 * exempt pension income. The whole amount transfers when B is $6,000 or less.
 */
export function transferableSAPTO(spouseOffset: number, spouseTaxableIncome: number): number {
  const b = Math.max(0, spouseTaxableIncome);
  if (b <= SAPTO_TRANSFER.taxableIncomeFloor) return Math.max(0, spouseOffset);
  const reduction = (b - SAPTO_TRANSFER.taxableIncomeFloor) * SAPTO_TRANSFER.reductionRate;
  return Math.max(0, Math.round(spouseOffset - reduction));
}
