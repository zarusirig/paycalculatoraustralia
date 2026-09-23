// =============================================================================
// Redundancy — NES scale and ATO tax-free limit / ETP tests
// Run with: npm test
// =============================================================================

import { test } from "node:test";
import assert from "node:assert/strict";

import { REDUNDANCY_WEEKS } from "../australian-tax";
import {
  ETP_RATES,
  NES_REDUNDANCY_SCALE,
  REDUNDANCY_TAX_2025_26,
  REDUNDANCY_TAX_2026_27,
  genuineRedundancyTaxFreeLimit,
  nesRedundancyWeeks,
  redundancyTax,
} from "../redundancy";

test("NES scale matches the Fair Work Act s 119(2) table", () => {
  const expected = [0, 4, 6, 7, 8, 10, 11, 13, 14, 16, 12, 12, 12];
  expected.forEach((weeks, years) => assert.equal(nesRedundancyWeeks(years), weeks, `${years} years`));
  assert.equal(nesRedundancyWeeks(4.99), 8, "part years are dropped");
  assert.equal(nesRedundancyWeeks(35), 12);
});

test("NES scale agrees with REDUNDANCY_WEEKS in australian-tax.ts", () => {
  for (const row of REDUNDANCY_WEEKS) {
    const years = Number.parseInt(row.years, 10);
    assert.equal(nesRedundancyWeeks(years), row.weeks, row.years);
  }
  assert.equal(NES_REDUNDANCY_SCALE.length, 11);
});

test("ATO tax-free limits: 2026-27 $13,598 + $6,801, 2025-26 $13,100 + $6,552", () => {
  assert.equal(REDUNDANCY_TAX_2026_27.taxFreeBase, 13_598);
  assert.equal(REDUNDANCY_TAX_2026_27.taxFreePerYear, 6_801);
  assert.equal(REDUNDANCY_TAX_2025_26.taxFreeBase, 13_100);
  assert.equal(REDUNDANCY_TAX_2025_26.taxFreePerYear, 6_552);
  // MLC's technical guide: 11 completed years in 2026-27.
  assert.equal(genuineRedundancyTaxFreeLimit(11), 13_598 + 6_801 * 11);
  assert.equal(genuineRedundancyTaxFreeLimit(5.9), 13_598 + 6_801 * 5, "completed years only");
});

test("ATO ETP cap: 2026-27 $270,000, 2025-26 $260,000", () => {
  assert.equal(REDUNDANCY_TAX_2026_27.etpCap, 270_000);
  assert.equal(REDUNDANCY_TAX_2025_26.etpCap, 260_000);
});

test("genuine redundancy under the limit is wholly tax-free", () => {
  const r = redundancyTax({ grossPayment: 20_000, completedYears: 5, genuine: true, reachedPreservationAge: false });
  assert.equal(r.taxFree, 20_000);
  assert.equal(r.tax, 0);
  assert.equal(r.net, 20_000);
});

test("excess over the tax-free limit is taxed at 32% under preservation age, 17% at or over", () => {
  const limit = genuineRedundancyTaxFreeLimit(2);
  const under = redundancyTax({ grossPayment: limit + 10_000, completedYears: 2, genuine: true, reachedPreservationAge: false });
  assert.equal(under.etpTaxable, 10_000);
  assert.equal(Math.round(under.tax), 3_200);
  const over = redundancyTax({ grossPayment: limit + 10_000, completedYears: 2, genuine: true, reachedPreservationAge: true });
  assert.equal(Math.round(over.tax), 1_700);
});

test("amounts above the ETP cap are taxed at 47%", () => {
  const r = redundancyTax({ grossPayment: 300_000, completedYears: 0, genuine: false, reachedPreservationAge: false });
  assert.equal(r.etpWithinCap, 270_000);
  assert.equal(r.etpAboveCap, 30_000);
  assert.equal(Math.round(r.tax), Math.round(270_000 * ETP_RATES.underPreservationAge + 30_000 * ETP_RATES.aboveCap));
});

test("a non-genuine redundancy has no tax-free part", () => {
  const r = redundancyTax({ grossPayment: 20_000, completedYears: 5, genuine: false, reachedPreservationAge: false });
  assert.equal(r.taxFree, 0);
  assert.equal(Math.round(r.tax), 6_400);
});
