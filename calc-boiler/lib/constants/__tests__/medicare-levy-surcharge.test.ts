// =============================================================================
// Medicare levy surcharge — ATO conformance tests for the MLS calculator page
//
// Anchors (ato.gov.au, read 23 September 2026):
//   QC49961  2026-27 tiers; "Tom": $90,000 taxable + $27,000 RFB -> $1,170.
//   QC71227  the rate is charged on taxable income + reportable fringe
//            benefits, not on investment losses or reportable super.
//   PHI rebate 2026-27, 1 July 2026 – 31 March 2027: under 65 base tier
//            24.118%, Tier 3 0%.
// =============================================================================

import { test } from "node:test";
import assert from "node:assert/strict";

import { MEDICARE_LEVY } from "../australian-tax";
import { calculateMLS } from "../medicare-levy-extra";
import {
  MLS_APPROPRIATE_COVER_MAX_EXCESS,
  PHI_REBATE,
  compareCoverWithSurcharge,
  estimateMls,
  familyBaseThreshold,
  incomeForMlsPurposes,
  mlsChargeBase,
  phiRebateRate,
} from "../medicare-levy-surcharge";

const single = (
  taxableIncome: number,
  extra: Partial<{ rfb: number; losses: number; resc: number; days: number }> = {},
) =>
  estimateMls({
    own: {
      taxableIncome,
      reportableFringeBenefits: extra.rfb ?? 0,
      netInvestmentLosses: extra.losses ?? 0,
      reportableSuperContributions: extra.resc ?? 0,
    },
    hasSpouse: false,
    spouseMlsIncome: 0,
    dependentChildren: 0,
    daysWithoutCover: extra.days ?? 365,
  });

test("2026-27 tiers are the ATO's", () => {
  const s = MEDICARE_LEVY.surcharge;
  assert.deepEqual([s.tier1.min, s.tier1.max, s.tier2.max, s.tier3.min], [105_001, 123_000, 164_000, 164_001]);
  assert.deepEqual([s.familyTier1.min, s.familyTier1.max, s.familyTier2.max, s.familyTier3.min], [210_001, 246_000, 328_000, 328_001]);
  assert.deepEqual([s.tier1.rate, s.tier2.rate, s.tier3.rate], [0.01, 0.0125, 0.015]);
});

test("ATO 'Tom': $90,000 taxable + $27,000 RFB -> Tier 1, $1,170", () => {
  const r = single(90_000, { rfb: 27_000 });
  assert.equal(r.ownMlsIncome, 117_000);
  assert.equal(r.tier, 1);
  assert.equal(r.fullYearSurcharge, 1_170);
});

test("base tier boundary: $105,000 nil, $105,001 in Tier 1", () => {
  assert.equal(single(105_000).fullYearSurcharge, 0);
  assert.equal(single(105_001).tier, 1);
  assert.equal(single(105_001).fullYearSurcharge, 1_050.01);
});

test("investment losses and reportable super decide the tier but aren't charged", () => {
  const r = single(100_000, { losses: 6_000, resc: 4_000 });
  assert.equal(r.ownMlsIncome, 110_000);
  assert.equal(r.tier, 1);
  assert.equal(r.chargeBase, 100_000);
  assert.equal(r.fullYearSurcharge, 1_000);
  assert.equal(incomeForMlsPurposes({ taxableIncome: 1, reportableFringeBenefits: 2, netInvestmentLosses: 3, reportableSuperContributions: 4 }), 10);
  assert.equal(mlsChargeBase({ taxableIncome: 1, reportableFringeBenefits: 2, netInvestmentLosses: 3, reportableSuperContributions: 4 }), 3);
});

test("calculateMLS without surchargeBase keeps its previous behaviour", () => {
  const r = calculateMLS({ mlsIncome: 117_000, spouseMlsIncome: 0, hasSpouse: false, dependentChildren: 0, hasPrivateHospitalCover: false });
  assert.equal(r.surcharge, 1_170);
});

test("part-year: surcharge is pro-rated by days without cover", () => {
  const r = single(90_000, { rfb: 27_000, days: 73 });
  assert.equal(r.surcharge, 234); // 1,170 x 73/365
  assert.equal(single(150_000, { days: 0 }).surcharge, 0);
});

test("family thresholds: combined income decides the tier; +$1,500 per child after the first", () => {
  assert.equal(familyBaseThreshold(0), 210_000);
  assert.equal(familyBaseThreshold(1), 210_000);
  assert.equal(familyBaseThreshold(3), 213_000);
  const r = estimateMls({
    own: { taxableIncome: 130_000, reportableFringeBenefits: 0, netInvestmentLosses: 0, reportableSuperContributions: 0 },
    hasSpouse: true,
    spouseMlsIncome: 90_000,
    dependentChildren: 0,
    daysWithoutCover: 365,
  });
  // $130k alone would be Tier 2 for a single; as a family $220k is Tier 1.
  assert.equal(r.testedIncome, 220_000);
  assert.equal(r.tier, 1);
  assert.equal(r.fullYearSurcharge, 1_300);
});

test("PHI rebate rates and cover comparison", () => {
  assert.equal(PHI_REBATE.rates.under65[0], 0.24118);
  assert.equal(phiRebateRate(3, "age70plus"), 0);
  assert.equal(phiRebateRate(1, "under65"), 0.16079);
  const c = compareCoverWithSurcharge(2_000, 1, "under65", 1_170);
  assert.equal(c.netPremium, 1_678.42);
  assert.equal(c.coverIsCheaper, false);
  assert.equal(MLS_APPROPRIATE_COVER_MAX_EXCESS.single, 750);
  assert.equal(MLS_APPROPRIATE_COVER_MAX_EXCESS.family, 1_500);
});
