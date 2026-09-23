// =============================================================================
// Tax-free threshold — ATO conformance tests
//
// Anchors, all ato.gov.au, read 23 September 2026:
//   QC103970  $18,200 = $350/week, $700/fortnight, $1,517/month;
//             part-year threshold $13,464 + $4,736 pro-rated by months.
//   QC50527   with the threshold claimed, withholding starts above
//             $363/week, $726/fortnight, $1,573/month.
//   QC105020  LITO $700 up to $37,500.
// =============================================================================

import { test } from "node:test";
import assert from "node:assert/strict";

import { LITO, TAX_FREE_THRESHOLD } from "../australian-tax";
import { calculatePAYGWithholding } from "../payg-withholding";
import {
  PART_YEAR_TFT,
  TFT_PER_PERIOD,
  TFT_WITHHOLDING_STARTS_ABOVE,
  adviseTaxFreeThresholdClaim,
  effectiveNilTaxIncome,
  incomeTaxAfterLito,
  partYearTaxFreeThreshold,
  tftWithholdingRow,
} from "../tax-free-threshold";

test("threshold is $18,200 and the part-year components sum to it", () => {
  assert.equal(TAX_FREE_THRESHOLD, 18_200);
  assert.equal(PART_YEAR_TFT.flat + PART_YEAR_TFT.proRata, TAX_FREE_THRESHOLD);
});

test("per-period equivalents match QC103970", () => {
  assert.equal(TFT_PER_PERIOD.weekly, TAX_FREE_THRESHOLD / 52);
  assert.equal(TFT_PER_PERIOD.fortnightly, TAX_FREE_THRESHOLD / 26);
  assert.equal(TFT_PER_PERIOD.monthly, Math.round(TAX_FREE_THRESHOLD / 12));
});

test("part-year threshold: 12 months is the full $18,200, 0 months the flat $13,464", () => {
  assert.equal(partYearTaxFreeThreshold(12), 18_200);
  assert.equal(partYearTaxFreeThreshold(0), 13_464);
  assert.equal(partYearTaxFreeThreshold(6), 13_464 + 2_368);
});

test("Schedule 1 withholding starts exactly where QC50527 says (threshold claimed)", () => {
  for (const f of ["weekly", "fortnightly", "monthly"] as const) {
    const at = TFT_WITHHOLDING_STARTS_ABOVE[f];
    // At the published figure nothing is withheld. The scale's first taxed band
    // starts there, but its first few cents round to $0, so the first whole
    // dollar appears a little higher ($365 a week).
    assert.equal(calculatePAYGWithholding(at, f).totalWithheld, 0, `${f} at ${at}`);
    assert.ok(calculatePAYGWithholding(at + 10, f).totalWithheld > 0, `${f} above ${at}`);
  }
});

test("not claiming the threshold always withholds at least as much", () => {
  for (const gross of [200, 350, 500, 700, 1_000, 1_500, 2_500]) {
    const r = tftWithholdingRow(gross, "weekly");
    assert.ok(r.notClaimed >= r.claimed, `weekly ${gross}`);
    assert.equal(r.difference, r.notClaimed - r.claimed);
  }
});

test("effective nil-tax income with LITO is $22,866 (15% rate)", () => {
  assert.equal(effectiveNilTaxIncome(), 22_866);
  assert.equal(incomeTaxAfterLito(22_866), 0);
  assert.ok(incomeTaxAfterLito(22_867) > 0);
  // The rounded headline figure in australian-tax.ts sits one dollar above.
  assert.equal(LITO.effectiveTaxFreeThreshold, 22_867);
});

test("claim advice follows the ATO rules", () => {
  const base = {
    residency: "resident" as const,
    hasOtherCurrentPayer: false,
    claimingFromOtherPayer: false,
    thisIsHighestPaying: true,
    expectedTotalIncome: 60_000,
  };
  assert.deepEqual(adviseTaxFreeThresholdClaim(base), { claim: true, code: "onlyPayer" });
  assert.equal(adviseTaxFreeThresholdClaim({ ...base, residency: "workingHolidayMaker" }).claim, false);
  assert.equal(adviseTaxFreeThresholdClaim({ ...base, residency: "foreignResident" }).claim, false);
  const two = { ...base, hasOtherCurrentPayer: true };
  assert.deepEqual(adviseTaxFreeThresholdClaim({ ...two, claimingFromOtherPayer: true }), { claim: false, code: "alreadyClaimedElsewhere" });
  assert.deepEqual(adviseTaxFreeThresholdClaim({ ...two, thisIsHighestPaying: false }), { claim: false, code: "claimOnOtherJob" });
  assert.deepEqual(adviseTaxFreeThresholdClaim(two), { claim: true, code: "claimHere" });
  // Certain to stay at or under $18,200 in total: may claim from each payer.
  assert.deepEqual(
    adviseTaxFreeThresholdClaim({ ...two, claimingFromOtherPayer: true, expectedTotalIncome: 18_000 }),
    { claim: true, code: "allUnderThreshold" },
  );
});
