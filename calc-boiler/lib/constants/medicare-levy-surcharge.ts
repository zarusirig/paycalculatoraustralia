// =============================================================================
// Medicare levy surcharge (MLS) — income components, part-year cover, and the
// private health insurance rebate that sits on the same income tiers.
//
// The tiers themselves live in MEDICARE_LEVY.surcharge (australian-tax.ts) and
// the tier test in calculateMLS (medicare-levy-extra.ts). This file adds the
// pieces the /medicare-levy-surcharge-calculator/ page needs on top.
//
// Sources, all ato.gov.au, read 23 September 2026:
//   QC49961 "Medicare levy surcharge income, thresholds and rates"
//     (last updated 22 June 2026): 2026-27 tiers — singles $105,000 or less /
//     $105,001–$123,000 / $123,001–$164,000 / $164,001+; families $210,000 or
//     less / $210,001–$246,000 / $246,001–$328,000 / $328,001+; rates 0%, 1%,
//     1.25%, 1.5%; family threshold +$1,500 per MLS dependent child after the
//     first. Income for MLS purposes = taxable income + reportable fringe
//     benefits + total net investment losses + reportable super contributions
//     (reportable employer super contributions + deductible personal super
//     contributions), combined with a spouse's. Worked example "Tom": $90,000
//     taxable + $27,000 RFB = $117,000, Tier 1, MLS $1,170.
//   QC71227 "Paying the Medicare levy surcharge" (last updated 5 May 2026):
//     the rate "is levied on: your taxable income, total reportable fringe
//     benefits, and any amount on which family trust distribution tax has been
//     paid"; "The MLS is not covered in tax withheld by your employer"; a
//     spouse with own income for MLS purposes of "$27,222 or less" doesn't pay
//     it (stated for 2025-26 — no 2026-27 figure published yet).
//   QC71224 "Appropriate level of private patient hospital cover" (last
//     updated 30 April 2026): excess of $750 or less for singles, $1,500 or
//     less for couples/families; extras and travel insurance don't count.
//   QC27044 "Family and dependants for MLS purposes" (last updated 21 August
//     2026): a dependent child is under 21, or 21–24 and a full-time student.
//   "Income thresholds and rates for the private health insurance rebate"
//     (last updated 22 June 2026): 2026-27 rebate tiers use the same income
//     bands as the MLS; rates effective 1 July 2026 to 31 March 2027 below.
//     Rates from 1 April 2027 "will become available in March 2027".
// =============================================================================

import { MEDICARE_LEVY } from "./australian-tax";
import { calculateMLS, MLS_CHILD_INCREMENT, MLS_INCOME_YEAR, type MlsTier } from "./medicare-levy-extra";

export { MLS_INCOME_YEAR };

/** Days in the 2026-27 income year (1 July 2026 – 30 June 2027; no 29 Feb). */
export const MLS_DAYS_IN_YEAR = 365;

/** Maximum hospital-cover excess that still counts as "appropriate". QC71224. */
export const MLS_APPROPRIATE_COVER_MAX_EXCESS = { single: 750, family: 1_500 } as const;

/**
 * A spouse whose own income for MLS purposes is at or below this doesn't pay
 * the surcharge even when family income is over the threshold. The ATO states
 * it for 2025-26 only (QC71227); it is shown as such and NOT applied by the
 * calculator, because the 2026-27 figure is unpublished.
 */
export const MLS_SPOUSE_LOW_INCOME = { amount: 27_222, incomeYear: "2025-26" } as const;

export type PhiAgeBracket = "under65" | "age65to69" | "age70plus";

/**
 * Private health insurance rebate, as a fraction of the premium, indexed by
 * MLS tier (0 = base tier … 3 = Tier 3). Effective 1 July 2026 to 31 March 2027.
 */
export const PHI_REBATE = {
  period: "1 July 2026 to 31 March 2027",
  rates: {
    under65: [0.24118, 0.16079, 0.08038, 0],
    age65to69: [0.28139, 0.20098, 0.12058, 0],
    age70plus: [0.32158, 0.24118, 0.16079, 0],
  } satisfies Record<PhiAgeBracket, readonly [number, number, number, number]>,
} as const;

export interface MlsIncomeComponents {
  taxableIncome: number;
  reportableFringeBenefits: number;
  /** Net financial investment losses + net rental property losses. */
  netInvestmentLosses: number;
  /** Reportable employer super contributions (salary sacrifice) + deductible personal contributions. */
  reportableSuperContributions: number;
}

const nn = (n: number) => (Number.isFinite(n) ? Math.max(0, n) : 0);

/** Income for MLS purposes — decides the tier. QC49961. */
export function incomeForMlsPurposes(c: MlsIncomeComponents): number {
  return nn(c.taxableIncome) + nn(c.reportableFringeBenefits) + nn(c.netInvestmentLosses) + nn(c.reportableSuperContributions);
}

/** The amount the surcharge rate is charged on. QC71227. */
export function mlsChargeBase(c: MlsIncomeComponents): number {
  return nn(c.taxableIncome) + nn(c.reportableFringeBenefits);
}

export interface MlsEstimateInput {
  own: MlsIncomeComponents;
  hasSpouse: boolean;
  /** Spouse's income for MLS purposes (all four components summed). */
  spouseMlsIncome: number;
  /** MLS dependent children (under 21, or 21–24 studying full time). */
  dependentChildren: number;
  /** Days in the year you, your spouse or a dependant had no appropriate hospital cover. */
  daysWithoutCover: number;
}

export interface MlsEstimate {
  ownMlsIncome: number;
  testedIncome: number;
  usesFamilyThresholds: boolean;
  baseThreshold: number;
  tier: MlsTier;
  rate: number;
  chargeBase: number;
  /** Surcharge if there were no cover for the whole year. */
  fullYearSurcharge: number;
  /** Surcharge for the days without cover. */
  surcharge: number;
  daysWithoutCover: number;
}

/**
 * MLS estimate for one person. Tier on (combined) income for MLS purposes,
 * rate charged on own taxable income + fringe benefits, pro-rated by the days
 * without appropriate cover.
 */
export function estimateMls(input: MlsEstimateInput): MlsEstimate {
  const ownMlsIncome = incomeForMlsPurposes(input.own);
  const chargeBase = mlsChargeBase(input.own);
  const days = Math.min(MLS_DAYS_IN_YEAR, Math.max(0, Math.round(input.daysWithoutCover)));
  const r = calculateMLS({
    mlsIncome: ownMlsIncome,
    spouseMlsIncome: nn(input.spouseMlsIncome),
    hasSpouse: input.hasSpouse,
    dependentChildren: input.dependentChildren,
    hasPrivateHospitalCover: false,
    surchargeBase: chargeBase,
  });
  const surcharge = Math.round(((r.surcharge * days) / MLS_DAYS_IN_YEAR) * 100) / 100;
  return {
    ownMlsIncome,
    testedIncome: r.testedIncome,
    usesFamilyThresholds: r.usesFamilyThresholds,
    baseThreshold: r.baseThreshold,
    tier: r.tier,
    rate: r.rate,
    chargeBase,
    fullYearSurcharge: Math.round(r.surcharge * 100) / 100,
    surcharge,
    daysWithoutCover: days,
  };
}

/** Rebate fraction for a tier and age of the oldest person on the policy. */
export function phiRebateRate(tier: MlsTier, age: PhiAgeBracket): number {
  return PHI_REBATE.rates[age][tier];
}

export interface CoverComparison {
  /** Annual premium after the rebate you would receive at this tier. */
  netPremium: number;
  rebateRate: number;
  surcharge: number;
  /** Positive: the surcharge costs more than the cover. */
  surchargeMinusPremium: number;
  coverIsCheaper: boolean;
}

/**
 * Compare a full year's surcharge with a full year's hospital premium. The
 * rebate rate is the July 2026 – March 2027 rate applied to the whole premium,
 * so it is an estimate for the April–June quarter.
 */
export function compareCoverWithSurcharge(
  annualPremiumBeforeRebate: number,
  tier: MlsTier,
  age: PhiAgeBracket,
  fullYearSurcharge: number,
): CoverComparison {
  const rebateRate = phiRebateRate(tier, age);
  const netPremium = Math.round(nn(annualPremiumBeforeRebate) * (1 - rebateRate) * 100) / 100;
  const surchargeMinusPremium = Math.round((fullYearSurcharge - netPremium) * 100) / 100;
  return {
    netPremium,
    rebateRate,
    surcharge: fullYearSurcharge,
    surchargeMinusPremium,
    coverIsCheaper: surchargeMinusPremium > 0,
  };
}

/** 0%, 1%, 1.25%, 1.5% — each rate to the precision the ATO prints it. */
export function formatMlsRate(rate: number): string {
  const decimals = Math.round(rate * 10_000) % 10 !== 0 ? 2 : Math.round(rate * 1_000) % 10 !== 0 ? 1 : 0;
  return `${(rate * 100).toFixed(decimals)}%`;
}

/** Top of the surcharge-free base tier for a family with `children` MLS dependent children. */
export function familyBaseThreshold(children: number): number {
  const lift = Math.max(0, Math.floor(children) - 1) * MLS_CHILD_INCREMENT;
  return MEDICARE_LEVY.surcharge.familyTier1.min - 1 + lift;
}
