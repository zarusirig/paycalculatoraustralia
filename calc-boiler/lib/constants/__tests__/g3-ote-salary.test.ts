import assert from "node:assert/strict";
import { test } from "node:test";

import { HIGH_INCOME_THRESHOLD, oteBreakdown } from "../ote-salary";
import { SUPER_GUARANTEE } from "../australian-tax";

test("OTE = base + commission at 100% of target; split is base share", () => {
  const r = oteBreakdown({ base: 80_000, targetVariable: 40_000, attainmentPct: 100 });
  assert.equal(r.ote, 120_000);
  assert.equal(r.basePct, 66.7);
  assert.equal(r.totalEarned, 120_000);
});

test("commission is ordinary time earnings: SG is on base + commission earned", () => {
  const r = oteBreakdown({ base: 80_000, targetVariable: 40_000, attainmentPct: 50 });
  assert.equal(r.variableEarned, 20_000);
  assert.equal(r.superGuarantee, 100_000 * SUPER_GUARANTEE.rate);
});

test("SG stops at the maximum contribution base", () => {
  const r = oteBreakdown({ base: 250_000, targetVariable: 100_000, attainmentPct: 100 });
  assert.equal(r.superGuarantee, Math.round(SUPER_GUARANTEE.maxContributionBaseAnnual * SUPER_GUARANTEE.rate * 100) / 100);
});

test("high income threshold counts base only: commission can't be determined in advance", () => {
  assert.equal(HIGH_INCOME_THRESHOLD.current, 190_100);
  const r = oteBreakdown({ base: 150_000, targetVariable: 100_000, attainmentPct: 150 });
  assert.equal(r.highIncomeEarnings, 150_000);
  assert.equal(r.aboveHighIncomeThreshold, false);
  assert.equal(oteBreakdown({ base: 190_100, targetVariable: 0, attainmentPct: 0 }).aboveHighIncomeThreshold, true);
});
