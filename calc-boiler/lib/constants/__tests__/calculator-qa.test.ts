// =============================================================================
// Regression tests for logic bugs found in the calculator QA pass
// (docs/seo/2026-09-24-calculator-qa.md).
// =============================================================================

import { test } from "node:test";
import assert from "node:assert/strict";

import { bonusTaxSplit, calculatePayBreakdown } from "../australian-tax";

test("bonusTaxSplit: rows add up to the total when the bonus crosses a bracket", () => {
  // $130,000 base + $25,000 bonus: $5,000 is taxed at 30% and $20,000 at 37%,
  // so "bonus × 37%" ($9,250) overstated income tax on the bonus.
  const s = bonusTaxSplit(130_000, 25_000);
  const without = calculatePayBreakdown({ grossSalary: 130_000 });
  const withBonus = calculatePayBreakdown({ grossSalary: 130_000, bonus: 25_000 });
  assert.equal(s.total, withBonus.totalDeductions - without.totalDeductions);
  assert.equal(s.incomeTax + s.medicare, s.total);
  assert.equal(s.medicare, 500);
  assert.equal(s.incomeTax, 5_000 * 0.3 + 20_000 * 0.37);
  assert.equal(s.net, 25_000 - s.total);
  assert.ok(s.incomeTax < Math.round(25_000 * 0.37));
});

test("bonusTaxSplit: LITO phase-out and Medicare shade-in land in the right rows", () => {
  for (const base of [0, 18_000, 30_000, 45_000, 60_000, 90_000, 190_000]) {
    for (const bonus of [0, 500, 10_000, 60_000]) {
      const s = bonusTaxSplit(base, bonus);
      assert.equal(s.incomeTax + s.medicare, s.total, `${base}+${bonus}`);
      assert.ok(s.incomeTax >= 0 && s.medicare >= 0, `${base}+${bonus} non-negative`);
    }
  }
  assert.deepEqual(bonusTaxSplit(90_000, 0), { total: 0, medicare: 0, incomeTax: 0, net: 0 });
});

test("bonusTaxSplit: negative or non-numeric inputs are treated as zero", () => {
  assert.deepEqual(bonusTaxSplit(90_000, -5_000), { total: 0, medicare: 0, incomeTax: 0, net: 0 });
  assert.deepEqual(bonusTaxSplit(Number.NaN, 10_000), bonusTaxSplit(0, 10_000));
});
