// =============================================================================
// Tax-free threshold — claim rules, part-year threshold and withholding effect
//
// The $18,200 figure itself is TAX_FREE_THRESHOLD in australian-tax.ts, and
// the effective threshold with LITO is LITO.effectiveTaxFreeThreshold there.
// This file adds only what those do not model: who may claim it on which
// payer, the part-year threshold, and the per-pay withholding difference.
//
// Sources, read 23 September 2026 at ato.gov.au:
//   QC103970 "How to claim the tax-free threshold" (last updated 5 June 2026):
//     "Most Australian residents can claim tax-free threshold on the first
//     $18,200"; equivalent to "$350 a week, $700 a fortnight, $1,517 a month";
//     part-year threshold = "a flat amount of $13,464" + "an additional amount
//     up to $4,736 pro-rated" on the months in Australia "including the month
//     you arrived"; a full-year non-resident "can't claim the tax-free
//     threshold".
//   "Paper TFN declaration form for payees" (last updated 28 May 2026):
//     Question 9 is the tax-free threshold question; working holiday makers
//     must answer No; a foreign resident may answer Yes only when receiving
//     an Australian Government pension or allowance.
//   QC50527 "Multiple jobs or change of job" (last updated 5 June 2026):
//     "generally, you only claim the tax-free threshold from one payer.
//     Usually ... from the payer who pays you the highest salary or wage";
//     "If you're certain your total income for the income year from all your
//     payers will be $18,200 or less, you can choose to claim the tax-free
//     threshold from each payer"; after a job change "You can claim the
//     tax-free threshold from your new payer even if you have claimed it from
//     your previous employer"; with the threshold claimed "your payer will
//     withhold tax when you earn above $363 per week, $726 per fortnight or
//     $1,573 per month".
//   QC73322 "Tax rates – working holiday maker" (last updated 1 June 2026):
//     working holiday maker income is taxed at 15c for each $1 from $0.
//   QC105020 "Low income tax offset" (last updated 8 June 2026): $700 up to
//     $37,500, and the offset "can only reduce your tax payable to $0".
// =============================================================================

import { LITO, TAX_FREE_THRESHOLD, calculateIncomeTax, calculateLITO } from "./australian-tax";
import {
  calculatePAYGWithholding,
  type PayFrequency,
  PAY_PERIODS,
} from "./payg-withholding";

/** Part-year tax-free threshold components. ATO QC103970. */
export const PART_YEAR_TFT = {
  flat: 13_464,
  proRata: 4_736,
} as const;

/**
 * Income per pay period that $18,200 is equivalent to, as the ATO publishes it
 * (QC103970). Weekly and fortnightly are exact; monthly is $18,200 ÷ 12
 * rounded to the dollar.
 */
export const TFT_PER_PERIOD: Record<PayFrequency, number> = {
  weekly: 350,
  fortnightly: 700,
  monthly: 1_517,
};

/**
 * Earnings above which a payer withholds tax once the threshold is claimed —
 * higher than TFT_PER_PERIOD because the Schedule 1 scale builds in part of
 * LITO. ATO QC50527. Our Schedule 1 engine reproduces these exactly (pinned
 * in __tests__/tax-free-threshold.test.ts).
 */
export const TFT_WITHHOLDING_STARTS_ABOVE: Record<PayFrequency, number> = {
  weekly: 363,
  fortnightly: 726,
  monthly: 1_573,
};

/**
 * The part-year threshold for someone who became (or stopped being) an
 * Australian resident during the year. `months` counts the months resident,
 * including the month of arrival. Rounded to the dollar, as the ATO does.
 */
export function partYearTaxFreeThreshold(months: number): number {
  const m = Math.min(12, Math.max(0, Math.floor(months)));
  if (m >= 12) return TAX_FREE_THRESHOLD;
  return Math.round(PART_YEAR_TFT.flat + (PART_YEAR_TFT.proRata * m) / 12);
}

/** Resident income tax after LITO, floored at nil (LITO is non-refundable). */
export function incomeTaxAfterLito(taxableIncome: number): number {
  return Math.max(0, calculateIncomeTax(taxableIncome) - calculateLITO(taxableIncome));
}

/**
 * Highest whole-dollar income on which a resident pays no income tax at all
 * once LITO is applied. Derived: 18,200 + 700 ÷ 15%, floored — at the next
 * dollar the tax exceeds the offset by a few cents. LITO.effectiveTaxFreeThreshold
 * in australian-tax.ts is the same figure rounded to the nearest dollar, which
 * is how it is usually quoted.
 */
export function effectiveNilTaxIncome(): number {
  let income = LITO.effectiveTaxFreeThreshold + 1;
  while (income > TAX_FREE_THRESHOLD && incomeTaxAfterLito(income) > 0) income -= 1;
  return income;
}

// ---------------------------------------------------------------------------
// Withholding: claimed vs not claimed
// ---------------------------------------------------------------------------

export interface TftWithholdingRow {
  gross: number;
  claimed: number;
  notClaimed: number;
  difference: number;
}

/** Schedule 1 withholding on one pay, with and without the threshold. */
export function tftWithholdingRow(gross: number, frequency: PayFrequency): TftWithholdingRow {
  const claimed = calculatePAYGWithholding(gross, frequency, { claimsTaxFreeThreshold: true }).totalWithheld;
  const notClaimed = calculatePAYGWithholding(gross, frequency, { claimsTaxFreeThreshold: false }).totalWithheld;
  return { gross, claimed, notClaimed, difference: notClaimed - claimed };
}

/** Annualised difference — what not claiming costs in cash flow over a year. */
export function annualWithholdingDifference(gross: number, frequency: PayFrequency): number {
  return tftWithholdingRow(gross, frequency).difference * PAY_PERIODS[frequency];
}

// ---------------------------------------------------------------------------
// "Should I claim it on this job?"
// ---------------------------------------------------------------------------

export type TftResidency =
  | "resident"
  | "partYearResident"
  | "foreignResident"
  | "workingHolidayMaker";

export interface TftClaimInput {
  residency: TftResidency;
  /** Another payer is paying you at the same time (second job, pension, Centrelink). */
  hasOtherCurrentPayer: boolean;
  /** You already claim the threshold from that other payer. */
  claimingFromOtherPayer: boolean;
  /** This job pays more than the other one. */
  thisIsHighestPaying: boolean;
  /** Total expected income from every source this income year. */
  expectedTotalIncome: number;
}

export type TftAdviceCode =
  | "whm"
  | "foreignResident"
  | "partYear"
  | "onlyPayer"
  | "allUnderThreshold"
  | "alreadyClaimedElsewhere"
  | "claimHere"
  | "claimOnOtherJob";

export interface TftAdvice {
  claim: boolean;
  code: TftAdviceCode;
}

/**
 * The ATO's claim rules, in the order they bite. General guidance only — it
 * mirrors QC103970 and QC50527 and does not replace the TFN declaration
 * instructions.
 */
export function adviseTaxFreeThresholdClaim(input: TftClaimInput): TftAdvice {
  if (input.residency === "workingHolidayMaker") return { claim: false, code: "whm" };
  if (input.residency === "foreignResident") return { claim: false, code: "foreignResident" };
  if (!input.hasOtherCurrentPayer) {
    return { claim: true, code: input.residency === "partYearResident" ? "partYear" : "onlyPayer" };
  }
  if (input.expectedTotalIncome > 0 && input.expectedTotalIncome <= TAX_FREE_THRESHOLD) {
    return { claim: true, code: "allUnderThreshold" };
  }
  if (input.claimingFromOtherPayer) return { claim: false, code: "alreadyClaimedElsewhere" };
  return input.thisIsHighestPaying
    ? { claim: true, code: "claimHere" }
    : { claim: false, code: "claimOnOtherJob" };
}
