import assert from "node:assert/strict";
import { test } from "node:test";

import { calculateIncomeTax } from "../australian-tax";
import { marginalBands, marginalRateAt, raiseOutcome } from "../marginal-rates";

// The raise/bonus engine is a difference of two full runs of the site's tax
// engine (2026-27 resident rates, ATO "Tax rates - Australian resident", last
// updated 13 Aug 2026), so these tests pin the ATO scale and then the
// behaviour the page explains.

test("ATO 2026-27 scale anchors the engine: $4,020 at $45,000, $31,020 at $135,000, $51,370 at $190,000", () => {
  assert.equal(Math.round(calculateIncomeTax(45_000)), 4_020);
  assert.equal(Math.round(calculateIncomeTax(135_000)), 31_020);
  assert.equal(Math.round(calculateIncomeTax(190_000)), 51_370);
});

test("ten bands, each effective rate matching the hand-derived value", () => {
  const bands = marginalBands();
  assert.equal(bands.length, 10);
  const rates = bands.map((b) => b.effectiveRate);
  // nil, nil (LITO absorbs 15c), 15, 25 (Medicare shade-in), 17, 22 (LITO 5c),
  // 33.5 (LITO 1.5c), 32, 39, 47
  assert.deepEqual(rates, [0, 0, 0.15, 0.25, 0.17, 0.22, 0.335, 0.32, 0.39, 0.47]);
});

test("bands tile the income line with no gaps", () => {
  const bands = marginalBands();
  assert.equal(bands[0].from, 0);
  for (let i = 1; i < bands.length; i++) assert.equal(bands[i].from, bands[i - 1].to);
  assert.equal(bands[bands.length - 1].to, Infinity);
});

test("marginalRateAt agrees with the bands", () => {
  assert.equal(marginalRateAt(80_000), 0.32);
  assert.equal(marginalRateAt(150_000), 0.39);
  assert.equal(marginalRateAt(250_000), 0.47);
  assert.equal(marginalRateAt(40_000), 0.22);
});

test("raise inside one band costs the band's all-in rate: $80k + $5k at 32%", () => {
  const r = raiseOutcome({ salary: 80_000, raise: 5_000 });
  assert.equal(r.extraTax, 1_600);
  assert.equal(r.netGain, 3_400);
  assert.equal(r.marginalRateOnRaise, 0.32);
  assert.equal(r.netGain + r.extraTax, r.raise);
});

test("raise that crosses $135,000 is blended, not the top rate on the whole raise", () => {
  const r = raiseOutcome({ salary: 130_000, raise: 10_000 });
  // $5,000 at 32% + $5,000 at 39% = $3,550
  assert.equal(r.extraTax, 3_550);
  assert.equal(r.scaleRateAfter, 0.37);
});

test("average rate is below the marginal rate on the raise", () => {
  const r = raiseOutcome({ salary: 90_000, raise: 10_000 });
  assert.ok(r.averageAfter < r.marginalRateOnRaise);
  assert.ok(r.averageAfter > r.averageBefore);
});

test("HELP debt raises the cost of a raise", () => {
  const without = raiseOutcome({ salary: 80_000, raise: 5_000 });
  const withHelp = raiseOutcome({ salary: 80_000, raise: 5_000, hasHelpDebt: true });
  assert.ok(withHelp.extraTax > without.extraTax);
});

test("no tax on a raise that stays inside the tax-free threshold", () => {
  const r = raiseOutcome({ salary: 10_000, raise: 5_000 });
  assert.equal(r.extraTax, 0);
  assert.equal(r.raiseIsTaxFree, true);
});

test("a raise is never negative and zero raise costs nothing", () => {
  const r = raiseOutcome({ salary: 60_000, raise: -5 });
  assert.equal(r.raise, 0);
  assert.equal(r.extraTax, 0);
  assert.equal(r.marginalRateOnRaise, 0);
});
