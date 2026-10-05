// =============================================================================
// Carry-forward concessional contributions (ATO QC19749, updated 2 Jul 2026)
// Run with: npm test
// =============================================================================

import { test } from "node:test";
import assert from "node:assert/strict";

import { carryForwardPlan, deductionSaving, usableUntil } from "../carry-forward";

const NO_CONTRIBUTIONS = {};

test("window for 2026-27 is 2021-22 to 2025-26 with each year's own cap", () => {
  const p = carryForwardPlan({ contributedByYear: NO_CONTRIBUTIONS, totalSuperBalance: 100_000, contributionsThisYear: 0 });
  assert.deepEqual(p.rows.map((r) => [r.year, r.cap]), [
    ["2021-22", 27_500],
    ["2022-23", 27_500],
    ["2023-24", 27_500],
    ["2024-25", 30_000],
    ["2025-26", 30_000],
  ]);
  assert.equal(p.generalCap, 32_500);
  // Nothing contributed: every cap is unused. 3 x 27,500 + 2 x 30,000 = 142,500.
  assert.equal(p.totalUnused, 142_500);
  assert.equal(p.availableCap, 175_000);
});

test("unused amounts last five years: 2021-22 is last usable in 2026-27", () => {
  assert.equal(usableUntil("2021-22"), "2026-27");
  assert.equal(usableUntil("2025-26"), "2030-31");
  const p = carryForwardPlan({ contributedByYear: NO_CONTRIBUTIONS, totalSuperBalance: 100_000, contributionsThisYear: 0 });
  assert.equal(p.rows[0].expiresAtEndOfTarget, true);
  assert.equal(p.rows[1].expiresAtEndOfTarget, false);
  assert.equal(p.expiringThisYear, 27_500);
});

test("unused = cap minus contributions, never negative", () => {
  const p = carryForwardPlan({
    contributedByYear: { "2021-22": 13_000, "2022-23": 30_000, "2023-24": 27_500, "2024-25": 9_000, "2025-26": 0 },
    totalSuperBalance: 200_000,
    contributionsThisYear: 0,
  });
  assert.deepEqual(p.rows.map((r) => r.unused), [14_500, 0, 0, 21_000, 30_000]);
  assert.equal(p.totalUnused, 65_500);
});

test("total super balance of $500,000 or more at 30 June 2026 switches carry-forward off", () => {
  const input = { contributedByYear: NO_CONTRIBUTIONS, contributionsThisYear: 40_000 };
  const below = carryForwardPlan({ ...input, totalSuperBalance: 499_999 });
  assert.equal(below.eligible, true);
  assert.equal(below.excess, 0);
  const at = carryForwardPlan({ ...input, totalSuperBalance: 500_000 });
  assert.equal(at.eligible, false);
  assert.equal(at.available, 0);
  assert.equal(at.availableCap, 32_500);
  assert.equal(at.excess, 7_500);
  assert.equal(at.expiringThisYear, 0);
});

test("oldest unused amounts are used first (ATO: 2020-21 before 2021-22)", () => {
  const p = carryForwardPlan({
    contributedByYear: { "2021-22": 20_000, "2022-23": 27_500, "2023-24": 27_500, "2024-25": 30_000, "2025-26": 30_000 },
    totalSuperBalance: 300_000,
    contributionsThisYear: 32_500 + 10_000, // 10,000 above the general cap
  });
  // 2021-22 unused = 7,500; the rest comes from the next oldest unused year (none left: all used).
  assert.equal(p.totalUnused, 7_500);
  assert.equal(p.usedFromCarryForward, 7_500);
  assert.equal(p.rows[0].used, 7_500);
  assert.equal(p.rows[0].remaining, 0);
  assert.equal(p.excess, 2_500);
  assert.equal(p.headroom, 0);
});

test("partial use draws the oldest year down first and leaves later years", () => {
  const p = carryForwardPlan({
    contributedByYear: { "2021-22": 17_500, "2022-23": 17_500, "2023-24": 27_500, "2024-25": 30_000, "2025-26": 30_000 },
    totalSuperBalance: 300_000,
    contributionsThisYear: 32_500 + 15_000,
  });
  assert.equal(p.rows[0].unused, 10_000);
  assert.equal(p.rows[0].used, 10_000);
  assert.equal(p.rows[1].unused, 10_000);
  assert.equal(p.rows[1].used, 5_000);
  assert.equal(p.rows[1].remaining, 5_000);
  assert.equal(p.usedFromCarryForward, 15_000);
  assert.equal(p.expiringThisYear, 0); // the expiring 2021-22 amount was used
  assert.equal(p.headroom, 5_000);
  assert.equal(p.excess, 0);
});

test("a deduction on a personal contribution saves marginal rate + 2% Medicare less the 15% contributions tax", () => {
  assert.equal(deductionSaving(10_000, 0.3), 1_700); // 10,000 x (30% + 2% - 15%)
  assert.equal(deductionSaving(10_000, 0.45), 3_200);
  assert.equal(deductionSaving(10_000, 0.15), 200); // 15% + 2% - 15%
  assert.equal(deductionSaving(-5, 0.3), 0);
});
