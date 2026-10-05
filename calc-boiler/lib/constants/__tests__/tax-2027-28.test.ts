// =============================================================================
// 2027-28 scale (14% second rate) and the $250 Working Australians Tax Offset
// Run with: npm test
// =============================================================================

import { test } from "node:test";
import assert from "node:assert/strict";

import {
  MAX_COMBINED_GAIN,
  MAX_RATE_CUT_SAVING,
  TAX_BRACKETS_2027_28,
  WATO,
  compareTakeHome,
  incomeTax2027_28,
  wato,
} from "../tax-2027-28";
import { calculateIncomeTax } from "../australian-tax";

test("2027-28 scale: same thresholds, 14% second rate, bases follow", () => {
  assert.deepEqual(
    TAX_BRACKETS_2027_28.map((b) => [b.min, b.rate, Math.round(b.base)]),
    [
      [0, 0, 0],
      [18_201, 0.14, 0],
      [45_001, 0.3, 3_752],
      [135_001, 0.37, 30_752],
      [190_001, 0.45, 51_102],
    ],
  );
  assert.equal(Math.round(incomeTax2027_28(45_000)), 3_752);
  assert.equal(Math.round(incomeTax2027_28(80_000)), 14_252);
  assert.equal(Math.round(incomeTax2027_28(200_000)), 55_602);
});

test("the 2026-27 engine is untouched (15% scale)", () => {
  assert.equal(Math.round(calculateIncomeTax(45_000)), 4_020);
  assert.equal(Math.round(calculateIncomeTax(80_000)), 14_520);
});

test("WATO: nil at or below the tax-free threshold, $250 for most workers, never more than tax payable", () => {
  assert.equal(wato(0), 0);
  assert.equal(wato(18_200), 0);
  assert.equal(wato(22_000), 0); // LITO wipes out the tax, nothing left to offset
  assert.equal(wato(25_000), 250); // tax 952 - LITO 700 = 252 payable
  assert.equal(wato(24_000), 112); // tax 812 - LITO 700: the offset is limited to what is payable
  assert.equal(wato(80_000), WATO.maxOffset);
  assert.equal(wato(500_000), WATO.maxOffset);
});

test("$80,000 earner: $268 from the rate cut plus $250 WATO = $518 a year", () => {
  const c = compareTakeHome(80_000);
  assert.equal(Math.round(c.y2026_27.incomeTaxPayable), 14_520);
  assert.equal(Math.round(c.y2027_28.incomeTaxPayable), 14_002); // 14,252 - 250
  assert.equal(c.fromWato, 250);
  assert.equal(Math.round(c.fromRateCut), 268);
  assert.equal(Math.round(c.gainPerYear), 518);
  // Medicare is 2% of income in both years.
  assert.equal(c.y2026_27.medicare, 1_600);
  assert.equal(c.y2027_28.medicare, 1_600);
});

test("rate cut saving is 1c per $1 between $18,200 and $45,000, then flat $268", () => {
  assert.equal(Math.round(compareTakeHome(31_700).fromRateCut), 135); // 13,500 x 1%
  assert.equal(Math.round(compareTakeHome(45_000).fromRateCut), 268);
  assert.equal(Math.round(compareTakeHome(300_000).fromRateCut), 268);
  assert.equal(MAX_RATE_CUT_SAVING, 268);
  assert.equal(MAX_COMBINED_GAIN, 518);
});

test("incomes inside the tax-free threshold gain nothing", () => {
  const c = compareTakeHome(18_000);
  assert.equal(c.gainPerYear, 0);
  assert.equal(c.y2027_28.takeHome, 18_000);
});
