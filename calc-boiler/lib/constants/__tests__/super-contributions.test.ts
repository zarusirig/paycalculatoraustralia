// =============================================================================
// Concessional contributions cap — ATO conformance tests
//
// Anchors (ato.gov.au, read 23 September 2026):
//   QC19749   cap $32,500 from 1 July 2026; $30,000 2024-25 to 2025-26;
//             $27,500 2021-22 to 2023-24; carry-forward needs TSB < $500,000,
//             up to 5 previous years, from 2018-19. Example "Sam": unused
//             2019-20 to 2023-24 = $67,500.
//   Div 293   "Jan": $240,000 + $15,000 contributions -> $750.
//   SG        12%; annual maximum contribution base from 1 July 2026.
// =============================================================================

import { test } from "node:test";
import assert from "node:assert/strict";

import { SUPER_GUARANTEE } from "../australian-tax";
import {
  CARRY_FORWARD,
  CONCESSIONAL_CAP_BY_YEAR,
  DIVISION_296,
  LOW_RATE_CAP,
  TRANSFER_BALANCE_CAP_PREVIOUS,
  annualSuperGuarantee,
  bringForwardThresholds,
  carryForwardWindow,
  concessionalCapPosition,
  division293Estimate,
  previousIncomeYear,
} from "../super-contributions";

test("cap history matches the ATO", () => {
  assert.equal(SUPER_GUARANTEE.concessionalCap, 32_500);
  assert.equal(CONCESSIONAL_CAP_BY_YEAR["2026-27"], 32_500);
  assert.equal(CONCESSIONAL_CAP_BY_YEAR["2025-26"], 30_000);
  assert.equal(CONCESSIONAL_CAP_BY_YEAR["2024-25"], 30_000);
  assert.equal(CONCESSIONAL_CAP_BY_YEAR["2021-22"], 27_500);
  assert.equal(CONCESSIONAL_CAP_BY_YEAR["2020-21"], 25_000);
  assert.equal(CARRY_FORWARD.totalSuperBalanceLimit, 500_000);
});

test("previousIncomeYear", () => {
  assert.equal(previousIncomeYear("2026-27"), "2025-26");
  assert.equal(previousIncomeYear("2000-01"), "1999-00");
});

test("carry-forward window for 2026-27 is 2021-22 to 2025-26, oldest first", () => {
  const w = carryForwardWindow("2026-27");
  assert.deepEqual(w.map((x) => x.year), ["2021-22", "2022-23", "2023-24", "2024-25", "2025-26"]);
  assert.equal(w.reduce((a, x) => a + x.cap, 0), 27_500 * 3 + 30_000 * 2);
});

test("ATO 'Sam': 2024-25 window starts 2019-20; his unused amounts total $67,500", () => {
  const w = carryForwardWindow("2024-25");
  assert.deepEqual(w.map((x) => x.year), ["2019-20", "2020-21", "2021-22", "2022-23", "2023-24"]);
  const contributed = [11_000, 12_000, 13_000, 14_000, 15_000];
  const unused = w.reduce((a, x, i) => a + (x.cap - contributed[i]), 0);
  assert.equal(unused, 67_500);
});

test("window never reaches before 2018-19", () => {
  assert.deepEqual(carryForwardWindow("2020-21").map((x) => x.year), ["2018-19", "2019-20"]);
});

test("SG is 12% and stops at the annual maximum contribution base", () => {
  assert.equal(annualSuperGuarantee(100_000), 12_000);
  assert.equal(annualSuperGuarantee(400_000), SUPER_GUARANTEE.maxSGAnnual);
});

test("cap position: SG + sacrifice against the general cap", () => {
  const p = concessionalCapPosition({
    salary: 100_000,
    salarySacrifice: 10_000,
    personalDeductible: 0,
    otherEmployer: 0,
    unusedCarryForward: 0,
    totalSuperBalance: 200_000,
  });
  assert.equal(p.superGuarantee, 12_000);
  assert.equal(p.totalConcessional, 22_000);
  assert.equal(p.headroom, 10_500);
  assert.equal(p.maxSalarySacrifice, 20_500);
  assert.equal(p.excess, 0);
});

test("carry-forward only counts when total super balance is under $500,000", () => {
  const base = { salary: 150_000, salarySacrifice: 30_000, personalDeductible: 0, otherEmployer: 0, unusedCarryForward: 20_000 };
  const ok = concessionalCapPosition({ ...base, totalSuperBalance: 499_999 });
  assert.equal(ok.availableCap, 52_500);
  assert.equal(ok.excess, 0);
  const no = concessionalCapPosition({ ...base, totalSuperBalance: 500_000 });
  assert.equal(no.availableCap, 32_500);
  assert.equal(no.excess, 18_000 + 30_000 - 32_500);
});

test("Division 293: ATO 'Jan' -> $750; nil at or under $250,000", () => {
  assert.equal(division293Estimate(240_000, 15_000), 750);
  assert.equal(division293Estimate(220_000, 30_000), 0);
  assert.equal(division293Estimate(300_000, 20_000), 3_000);
});

test("bring-forward thresholds derive to the ATO's 2026-27 figures", () => {
  assert.equal(SUPER_GUARANTEE.transferBalanceCap, 2_100_000);
  assert.equal(SUPER_GUARANTEE.nonConcessionalCap, 130_000);
  assert.equal(SUPER_GUARANTEE.bringForwardCap, 3 * SUPER_GUARANTEE.nonConcessionalCap);
  const t = bringForwardThresholds();
  assert.equal(t.threeYear, 1_840_000);
  assert.equal(t.twoYear, 1_970_000);
  assert.equal(t.nilCap, 2_100_000);
});

test("transfer balance, low rate cap and Division 296 anchors", () => {
  assert.equal(TRANSFER_BALANCE_CAP_PREVIOUS, 2_000_000);
  assert.equal(LOW_RATE_CAP.amount, 260_000);
  assert.equal(DIVISION_296.largeBalanceThreshold, 3_000_000);
  assert.equal(DIVISION_296.veryLargeBalanceThreshold, 10_000_000);
  assert.equal(DIVISION_296.rate + DIVISION_296.additionalRate, 0.25);
});
