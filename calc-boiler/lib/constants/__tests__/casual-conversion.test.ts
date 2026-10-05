import assert from "node:assert/strict";
import { test } from "node:test";

import { EMPLOYEE_CHOICE, baseRateFromCasual, compareCasualToPermanent } from "../casual-conversion";

test("casual rate is base + 25%: $30 base = $37.50", () => {
  const c = compareCasualToPermanent(30, 38, 52);
  assert.equal(c.casualRate, 37.5);
});

test("permanent annual pay is base × hours × 52", () => {
  const c = compareCasualToPermanent(30, 38, 52);
  assert.equal(c.permanentAnnual, 59_280);
  assert.equal(c.casualAnnualFullYear, 74_100);
});

test("break-even is 52 ÷ 1.25 = 41.6 paid weeks whatever the rate", () => {
  assert.equal(compareCasualToPermanent(30, 38, 40).breakEvenWeeks, 41.6);
  assert.equal(compareCasualToPermanent(55, 20, 40).breakEvenWeeks, 41.6);
});

test("working fewer paid weeks than break-even leaves the casual behind", () => {
  const behind = compareCasualToPermanent(30, 38, 40);
  assert.ok(behind.difference < 0);
  const ahead = compareCasualToPermanent(30, 38, 48);
  assert.ok(ahead.difference > 0);
});

test("a casual rate that already includes loading maps back to the base", () => {
  assert.equal(baseRateFromCasual(37.5), 30);
});

test("pathway thresholds and response time are those the FWO prints", () => {
  assert.equal(EMPLOYEE_CHOICE.minMonths, 6);
  assert.equal(EMPLOYEE_CHOICE.minMonthsSmallBusiness, 12);
  assert.equal(EMPLOYEE_CHOICE.responseDays, 21);
});

test("zero hours never divides by zero", () => {
  const c = compareCasualToPermanent(30, 0, 40);
  assert.equal(c.breakEvenWeeks, 0);
});
