// =============================================================================
// Salary package ↔ base salary tests.
//
// Run with: npm test
//
// "$112,000 package" and "$100,000 plus super" are the same money; "$100,000
// including super" is not. These tests pin the arithmetic both ways, the
// rounding (whole dollars, matching calculatePayBreakdown's superIncluded
// path), and the one case the engine's simple ÷1.12 misses: the maximum
// super contribution base, above which SG stops growing with the base.
// =============================================================================

import { test } from "node:test";
import assert from "node:assert/strict";

import { SUPER_GUARANTEE, calculatePayBreakdown } from "../australian-tax";
import { packageFromBase, splitPackage } from "../salary-package";

test("splitPackage divides a super-inclusive package by 1 + SG rate", () => {
  const r = splitPackage(112_000);
  assert.equal(r.base, 100_000);
  assert.equal(r.superAmount, 12_000);
  assert.equal(r.total, 112_000);
  assert.equal(r.capApplied, false);
});

test("packageFromBase adds SG on top of a base", () => {
  const r = packageFromBase(100_000);
  assert.equal(r.total, 112_000);
  assert.equal(r.superAmount, 12_000);
  assert.equal(r.capApplied, false);
});

test("the two directions round-trip to the dollar", () => {
  for (const base of [50_000, 68_500, 85_000, 150_000, 200_000]) {
    assert.equal(splitPackage(packageFromBase(base).total).base, base);
  }
});

test("matches the engine's superIncluded path below the cap", () => {
  for (const total of [60_000, 112_000, 175_000]) {
    const engine = calculatePayBreakdown({ grossSalary: total, superIncluded: true });
    assert.equal(splitPackage(total).base, engine.grossSalary);
    assert.equal(splitPackage(total).superAmount, engine.superContribution);
  }
});

test("SG is capped at the maximum contribution base", () => {
  const capBase = SUPER_GUARANTEE.maxContributionBaseAnnual;
  const capSG = SUPER_GUARANTEE.maxSGAnnual;
  const high = packageFromBase(400_000);
  assert.equal(high.superAmount, capSG);
  assert.equal(high.capApplied, true);
  assert.equal(high.total, 400_000 + capSG);
  // and back again: a package that big splits as total − capped SG, not ÷1.12
  const back = splitPackage(400_000 + capSG);
  assert.equal(back.base, 400_000);
  assert.equal(back.capApplied, true);
  // just under the cap is uncapped
  assert.equal(packageFromBase(capBase - 1).capApplied, false);
});

test("zero and negative inputs give zeros, never NaN", () => {
  for (const v of [0, -5]) {
    for (const r of [splitPackage(v), packageFromBase(v)]) {
      assert.deepEqual([r.base, r.superAmount, r.total], [0, 0, 0]);
    }
  }
});
