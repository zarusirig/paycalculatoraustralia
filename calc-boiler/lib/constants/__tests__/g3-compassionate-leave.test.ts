import assert from "node:assert/strict";
import { test } from "node:test";

import { COMPASSIONATE_LEAVE, compassionateLeavePay } from "../compassionate-leave";

test("2 days per occasion, paid at base rate for ordinary hours", () => {
  assert.equal(COMPASSIONATE_LEAVE.daysPerOccasion, 2);
  assert.equal(compassionateLeavePay("permanent", 30, 7.6), 456);
});

test("casual compassionate leave is unpaid", () => {
  assert.equal(compassionateLeavePay("casual", 40, 8), 0);
});

test("never pays more than 2 days per occasion; occasions multiply", () => {
  assert.equal(compassionateLeavePay("permanent", 30, 7.6, 5), 456);
  assert.equal(compassionateLeavePay("permanent", 30, 7.6, 2, 2), 912);
  assert.equal(compassionateLeavePay("permanent", 30, 7.6, 1), 228);
});

test("family and domestic violence leave is 10 days a year", () => {
  assert.equal(COMPASSIONATE_LEAVE.fdvDaysPerYear, 10);
});
