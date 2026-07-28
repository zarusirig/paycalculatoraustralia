// =============================================================================
// Medicare levy — ATO conformance tests
//
// Run with: npm test
//
// The two named anchors are the ATO's own worked examples:
//   "Angie"  QC27031, single, taxable income $29,000, no SAPTO      -> $98.90
//   "Ashton" QC27032, $49,700, spouse $21,700, SAPTO, no children   -> $92.90
//
// Ashton is the one that matters. He only reconciles if the s 8 family
// reduction is applied ON TOP of the s 7 individual reduction, in that order.
// Applying either alone, or a flat 2%, gives a different and wrong answer —
// this site previously shipped the flat-2% bug.
//
// Surcharge anchor:
//   "Tom"    QC49961, single, $117,000 for MLS purposes, no cover   -> $1,170
// =============================================================================

import { test } from "node:test";
import assert from "node:assert/strict";

import { MEDICARE_LEVY, calculateMedicareLevy } from "../australian-tax";
import {
  FAMILY_REDUCTION_TAPER,
  LEVY_EXEMPTION_CATEGORIES,
  MEDICARE_LEVY_SENIORS,
  MLS_CHILD_INCREMENT,
  calculateMLS,
  calculateMedicareLevyDetailed,
  familyLowerThreshold,
  familyReductionAmount,
  individualLevy,
  singleLowerThreshold,
  upperThreshold,
} from "../medicare-levy-extra";

const cents = (n: number) => Math.round(n * 100) / 100;

const single = (taxableIncome: number, seniorPensioner = false) =>
  calculateMedicareLevyDetailed({
    taxableIncome,
    hasSpouse: false,
    spouseTaxableIncome: 0,
    dependentChildren: 0,
    seniorPensioner,
  });

// ---------------------------------------------------------------------------
// Published figures
// ---------------------------------------------------------------------------

test("ATO rates: the levy is 2% and the shade-in is 10c per $1", () => {
  assert.equal(MEDICARE_LEVY.rate, 0.02);
  assert.equal(MEDICARE_LEVY.shadeInRate, 0.1);
});

test("ATO QC27031: single thresholds are $28,011 and $35,013", () => {
  assert.equal(MEDICARE_LEVY.lowIncomeThreshold, 28_011);
  assert.equal(MEDICARE_LEVY.shadeInThreshold, 35_013);
});

test("ATO QC27031: seniors and pensioners single thresholds are $44,268 and $55,335", () => {
  assert.equal(MEDICARE_LEVY_SENIORS.singleThreshold, 44_268);
  assert.equal(upperThreshold(MEDICARE_LEVY_SENIORS.singleThreshold), 55_335);
  // The concession runs out with SAPTO itself, not at the upper threshold.
  assert.equal(MEDICARE_LEVY_SENIORS.saptoSingleCutOut, 52_759);
});

test("ATO QC27032: family thresholds are $47,238 / $59,047, seniors $61,623 / $77,028", () => {
  assert.equal(MEDICARE_LEVY.familyThreshold, 47_238);
  assert.equal(upperThreshold(MEDICARE_LEVY.familyThreshold), 59_047);
  assert.equal(MEDICARE_LEVY_SENIORS.familyThreshold, 61_623);
  assert.equal(upperThreshold(MEDICARE_LEVY_SENIORS.familyThreshold), 77_028);
});

test("ATO QC27032: the family threshold rises $4,338 per dependent child", () => {
  assert.equal(MEDICARE_LEVY.additionalChild, 4_338);
  assert.equal(familyLowerThreshold(0, false), 47_238);
  assert.equal(familyLowerThreshold(1, false), 51_576);
  assert.equal(familyLowerThreshold(3, false), 47_238 + 3 * 4_338);
  // ATO publishes the matching upper increment as +$5,423 per child.
  assert.equal(upperThreshold(familyLowerThreshold(1, false)), 59_047 + 5_423);
});

test("every published upper threshold is 1.25x its lower threshold", () => {
  // Not a coincidence: 10% x (I - L) equals 2% x I exactly at I = 1.25L, which
  // is why the upper threshold never needs to be stored.
  assert.equal(upperThreshold(MEDICARE_LEVY.lowIncomeThreshold), MEDICARE_LEVY.shadeInThreshold);
  assert.equal(FAMILY_REDUCTION_TAPER, 0.08);
  assert.ok(Math.abs(FAMILY_REDUCTION_TAPER - (MEDICARE_LEVY.shadeInRate - MEDICARE_LEVY.rate)) < 1e-9);
});

// ---------------------------------------------------------------------------
// s 7 — the individual low-income reduction
// ---------------------------------------------------------------------------

test("nil below the lower threshold", () => {
  assert.equal(single(0).levy, 0);
  assert.equal(single(20_000).levy, 0);
  // At the threshold exactly: "equal to or less than" means nil.
  assert.equal(single(28_011).levy, 0);
  assert.equal(single(28_011).band, "belowSingleThreshold");
});

test("s 7 takes the lesser of the full rate and the shade-in, at any threshold", () => {
  assert.equal(individualLevy(20_000, 28_011), 0);
  assert.equal(cents(individualLevy(29_000, 28_011)), 98.9);
  assert.equal(cents(individualLevy(50_000, 44_268)), 573.2);
  assert.equal(cents(individualLevy(80_000, 28_011)), 1_600);
});

test("ATO 'Angie': single, $29,000 taxable income, no SAPTO -> $98.90", () => {
  const r = single(29_000);
  assert.equal(cents(r.levy), 98.9);
  assert.equal(r.band, "singleShadeIn");
  // Not the flat 2%, which would be $580.
  assert.equal(r.fullRateLevy, 580);
});

test("inside the shade-in the levy is 10% of the excess, not 2% of income", () => {
  assert.equal(cents(single(30_000).levy), cents(0.1 * (30_000 - 28_011)));
  assert.equal(cents(single(33_000).levy), cents(0.1 * (33_000 - 28_011)));
  assert.equal(cents(single(35_000).levy), cents(0.1 * (35_000 - 28_011)));
  // Every one of those is below the flat 2% a naive calculator would charge.
  for (const i of [30_000, 33_000, 35_000]) {
    assert.ok(single(i).levy < i * 0.02, `shade-in should undercut 2% at ${i}`);
  }
});

test("above the upper threshold the full 2% applies", () => {
  assert.equal(cents(single(36_000).levy), 720);
  assert.equal(cents(single(60_000).levy), 1_200);
  assert.equal(cents(single(100_000).levy), 2_000);
  assert.equal(single(60_000).band, "full");
});

test("the shade-in meets the full rate exactly at the upper threshold", () => {
  const upper = MEDICARE_LEVY.shadeInThreshold;
  assert.ok(single(upper).levy <= upper * MEDICARE_LEVY.rate);
  assert.equal(cents(single(upper + 1_000).levy), cents((upper + 1_000) * MEDICARE_LEVY.rate));
});

test("agrees with calculateMedicareLevy from australian-tax.ts for singles", () => {
  // The single-taxpayer path must not fork from the engine the rest of the
  // site uses. calculateMedicareLevy rounds to whole dollars; this one keeps
  // cents, so compare on the rounded value.
  for (let income = 0; income <= 200_000; income += 137) {
    assert.equal(
      Math.round(single(income).levy),
      calculateMedicareLevy(income),
      `divergence at $${income}`,
    );
  }
});

// ---------------------------------------------------------------------------
// Seniors and pensioners
// ---------------------------------------------------------------------------

test("seniors entitled to SAPTO get the higher threshold", () => {
  assert.equal(singleLowerThreshold(true), 44_268);
  assert.equal(singleLowerThreshold(false), 28_011);
  // $40,000 is well past the general threshold but under the seniors one.
  assert.equal(cents(single(40_000, false).levy), 800);
  assert.equal(single(40_000, true).levy, 0);
  assert.equal(cents(single(50_000, true).levy), cents(0.1 * (50_000 - 44_268)));
});

// ---------------------------------------------------------------------------
// s 8 — families
// ---------------------------------------------------------------------------

test("ATO 'Ashton': $49,700, spouse $21,700, SAPTO, no children -> $92.90", () => {
  const r = calculateMedicareLevyDetailed({
    taxableIncome: 49_700,
    hasSpouse: true,
    spouseTaxableIncome: 21_700,
    dependentChildren: 0,
    seniorPensioner: true,
  });
  assert.equal(r.familyIncome, 71_400);
  assert.equal(r.familyLowerThreshold, 61_623);
  // s 7 first: 10% x (49,700 - 44,268) = $543.20.
  assert.equal(cents(r.levyAfterIndividualReduction), 543.2);
  // then s 8(2): 2% x 61,623 - 0.08 x (71,400 - 61,623) = $450.30.
  assert.equal(cents(r.familyReduction), 450.3);
  assert.equal(cents(r.levy), 92.9);
  assert.equal(r.band, "familyReduced");
  // Ashton's spouse is under the individual threshold, so pays nothing and
  // s 8(3) never engages.
  assert.equal(r.spouseLevy, 0);
});

test("family income at or under the family threshold means no levy at all", () => {
  const r = calculateMedicareLevyDetailed({
    taxableIncome: 40_000,
    hasSpouse: true,
    spouseTaxableIncome: 7_238,
    dependentChildren: 0,
    seniorPensioner: false,
  });
  assert.equal(r.familyIncome, 47_238);
  assert.equal(r.levy, 0);
  assert.equal(r.band, "belowFamilyThreshold");
  // Without the family provisions the same person would pay the full 2%.
  assert.equal(cents(single(40_000).levy), 800);
});

test("a family with children: the threshold moves and the reduction follows it", () => {
  // Couple, $38,000 + $18,000 = $56,000, two children.
  // Family threshold = 47,238 + 2 x 4,338 = $55,914, so they are $86 over.
  const r = calculateMedicareLevyDetailed({
    taxableIncome: 38_000,
    hasSpouse: true,
    spouseTaxableIncome: 18_000,
    dependentChildren: 2,
    seniorPensioner: false,
  });
  assert.equal(r.familyLowerThreshold, 55_914);
  assert.equal(r.familyIncome, 56_000);
  // s 8(2) reduction = 2% x 55,914 - 0.08 x 86 = $1,111.40.
  assert.equal(cents(familyReductionAmount(56_000, 55_914)), 1_111.4);
  // Both are over the individual threshold, so s 8(3) splits the reduction by
  // taxable income share and the household pays close to nothing just over
  // the threshold.
  assert.ok(r.householdLevy < 1, `expected near-nil just over the threshold, got ${r.householdLevy}`);
  // One more child would have put them under the threshold entirely.
  const withThree = calculateMedicareLevyDetailed({
    taxableIncome: 38_000,
    hasSpouse: true,
    spouseTaxableIncome: 18_000,
    dependentChildren: 3,
    seniorPensioner: false,
  });
  assert.equal(withThree.levy, 0);
  assert.equal(withThree.band, "belowFamilyThreshold");
});

test("the family reduction runs out at 1.25x the family threshold", () => {
  const lower = familyLowerThreshold(0, false);
  const upper = upperThreshold(lower);
  assert.equal(familyReductionAmount(lower, lower), 0);
  assert.ok(familyReductionAmount(lower + 1_000, lower) > 0);
  assert.equal(familyReductionAmount(upper + 1, lower), 0);
  // Well past the upper threshold a couple simply pays 2% each.
  const r = calculateMedicareLevyDetailed({
    taxableIncome: 90_000,
    hasSpouse: true,
    spouseTaxableIncome: 70_000,
    dependentChildren: 2,
    seniorPensioner: false,
  });
  assert.equal(cents(r.levy), 1_800);
  assert.equal(cents(r.spouseLevy), 1_400);
  assert.equal(r.band, "full");
});

test("a sole parent uses the family threshold on their own income", () => {
  // s 8(5)(b): with no spouse, family income is the taxpayer's own income.
  const r = calculateMedicareLevyDetailed({
    taxableIncome: 46_000,
    hasSpouse: false,
    spouseTaxableIncome: 0,
    dependentChildren: 1,
    seniorPensioner: false,
  });
  assert.equal(r.familyIncome, 46_000);
  assert.equal(r.familyLowerThreshold, 51_576);
  assert.equal(r.levy, 0);
});

test("the household levy never goes backwards as family income rises", () => {
  let previous = -1;
  for (let combined = 40_000; combined <= 120_000; combined += 250) {
    const r = calculateMedicareLevyDetailed({
      taxableIncome: combined * 0.6,
      hasSpouse: true,
      spouseTaxableIncome: combined * 0.4,
      dependentChildren: 1,
      seniorPensioner: false,
    });
    assert.ok(
      r.householdLevy >= previous - 1e-6,
      `household levy fell at combined $${combined}`,
    );
    assert.ok(r.levy >= 0 && r.spouseLevy >= 0);
    previous = r.householdLevy;
  }
});

// ---------------------------------------------------------------------------
// Medicare levy surcharge — a different charge from the levy
// ---------------------------------------------------------------------------

const mls = (mlsIncome: number, hasPrivateHospitalCover = false) =>
  calculateMLS({
    mlsIncome,
    spouseMlsIncome: 0,
    hasSpouse: false,
    dependentChildren: 0,
    hasPrivateHospitalCover,
  });

test("ATO QC49961: 2026-27 single surcharge tiers", () => {
  assert.equal(MEDICARE_LEVY.surcharge.tier1.min, 105_001);
  assert.equal(MEDICARE_LEVY.surcharge.tier1.max, 123_000);
  assert.equal(MEDICARE_LEVY.surcharge.tier1.rate, 0.01);
  assert.equal(MEDICARE_LEVY.surcharge.tier2.max, 164_000);
  assert.equal(MEDICARE_LEVY.surcharge.tier2.rate, 0.0125);
  assert.equal(MEDICARE_LEVY.surcharge.tier3.min, 164_001);
  assert.equal(MEDICARE_LEVY.surcharge.tier3.rate, 0.015);
});

test("ATO QC49961: 2026-27 family surcharge tiers are double the single ones", () => {
  assert.equal(MEDICARE_LEVY.surcharge.familyTier1.min, 210_001);
  assert.equal(MEDICARE_LEVY.surcharge.familyTier2.min, 246_001);
  assert.equal(MEDICARE_LEVY.surcharge.familyTier3.min, 328_001);
  assert.equal(MLS_CHILD_INCREMENT, 1_500);
});

test("ATO 'Tom': single, $117,000 for MLS purposes, no cover -> $1,170", () => {
  const r = mls(117_000);
  assert.equal(r.tier, 1);
  assert.equal(r.rate, 0.01);
  assert.equal(cents(r.surcharge), 1_170);
});

test("no surcharge in the base tier, and none at all with hospital cover", () => {
  assert.equal(mls(105_000).surcharge, 0);
  assert.equal(mls(105_000).tier, 0);
  assert.equal(mls(105_000).avoidedByCover, false);
  const covered = mls(200_000, true);
  assert.equal(covered.surcharge, 0);
  assert.equal(covered.avoidedByCover, true);
});

test("surcharge tiers step at the published boundaries", () => {
  assert.equal(mls(105_001).tier, 1);
  assert.equal(mls(123_000).tier, 1);
  assert.equal(mls(123_001).tier, 2);
  assert.equal(cents(mls(123_001).surcharge), cents(123_001 * 0.0125));
  assert.equal(mls(164_000).tier, 2);
  assert.equal(mls(164_001).tier, 3);
  assert.equal(cents(mls(200_000).surcharge), 3_000);
});

test("families are tested on combined income, with +$1,500 per child after the first", () => {
  const family = (own: number, spouse: number, children: number) =>
    calculateMLS({
      mlsIncome: own,
      spouseMlsIncome: spouse,
      hasSpouse: true,
      dependentChildren: children,
      hasPrivateHospitalCover: false,
    });
  // $130,000 alone would be tier 2 as a single; combined with a low-income
  // spouse the family sits in the base tier and nothing is payable.
  assert.equal(mls(130_000).tier, 2);
  assert.equal(family(130_000, 40_000, 0).tier, 0);
  assert.equal(family(130_000, 40_000, 0).surcharge, 0);
  // Combined $211,000 is over the $210,000 family base with one child...
  assert.equal(family(150_000, 61_000, 1).tier, 1);
  // ...but a third child lifts the threshold by 2 x $1,500 to $213,000.
  assert.equal(family(150_000, 61_000, 3).tier, 0);
  assert.equal(family(150_000, 61_000, 3).baseThreshold, 213_000);
  // The surcharge is charged on your OWN income, at the family tier's rate.
  assert.equal(cents(family(150_000, 61_000, 1).surcharge), cents(150_000 * 0.01));
});

test("the surcharge is separate from the levy and both can apply at once", () => {
  const income = 130_000;
  assert.equal(cents(single(income).levy), 2_600);
  assert.equal(cents(mls(income).surcharge), cents(income * 0.0125));
  // Hospital cover removes the surcharge and leaves the levy untouched.
  assert.equal(mls(income, true).surcharge, 0);
  assert.equal(cents(single(income).levy), 2_600);
});

// ---------------------------------------------------------------------------
// Exemptions
// ---------------------------------------------------------------------------

test("exemption summary covers the half exemption, not just full exemptions", () => {
  assert.ok(LEVY_EXEMPTION_CATEGORIES.length >= 4);
  assert.ok(LEVY_EXEMPTION_CATEGORIES.some((c) => c.relief === "Full or half"));
  assert.ok(LEVY_EXEMPTION_CATEGORIES.every((c) => c.category && c.detail.length > 40));
});
