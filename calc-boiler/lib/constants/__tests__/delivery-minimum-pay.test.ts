import assert from "node:assert/strict";
import { test } from "node:test";

import {
  DELIVERY_MSO,
  DELIVERY_RATE_PERIODS,
  DELIVERY_VEHICLES,
  deliveryFloor,
  deliveryRate,
  earningsFloor,
  engagedMinutes,
} from "../delivery-minimum-pay";

// Rates are read from clause 14.2 of the FWC's Interim On-Demand Delivery
// Employee-like Worker Minimum Standards Order (11 Aug 2026, commencing 17 Aug 2026).

test("2026 rates match clause 14.2(a) and the FWO release", () => {
  assert.equal(deliveryRate("bicycle-or-none", "2026"), 31.3);
  assert.equal(deliveryRate("ebike-or-escooter", "2026"), 31.3);
  assert.equal(deliveryRate("motorcycle-or-scooter", "2026"), 31.5);
  assert.equal(deliveryRate("car-or-van", "2026"), 32);
});

test("2027 rates match clause 14.2(b)", () => {
  assert.equal(deliveryRate("bicycle-or-none", "2027"), 31.8);
  assert.equal(deliveryRate("ebike-or-escooter", "2027"), 31.8);
  assert.equal(deliveryRate("motorcycle-or-scooter", "2027"), 32);
  assert.equal(deliveryRate("car-or-van", "2027"), 32.5);
});

test("every vehicle class has a rate in every period", () => {
  for (const p of DELIVERY_RATE_PERIODS) {
    for (const v of DELIVERY_VEHICLES) assert.ok(p.rates[v.id] > 31, `${p.id} ${v.id}`);
  }
  assert.equal(DELIVERY_MSO.commences, "17 August 2026");
  assert.equal(DELIVERY_MSO.maxEarningsPeriodDays, 21);
});

test("engaged time is rounded to the nearest minute", () => {
  assert.equal(engagedMinutes(10, 30), 630);
  assert.equal(engagedMinutes(0, 45), 45);
  assert.equal(engagedMinutes(1.5, 0), 90);
  assert.equal(engagedMinutes(-3, -5), 0);
});

test("earnings floor = engaged hours x hourly rate", () => {
  assert.equal(earningsFloor(600, 31.3), 313); // 10 hours
  assert.equal(earningsFloor(90, 32), 48); // 1.5 hours
  assert.equal(earningsFloor(0, 32), 0);
  // 100 hours 15 minutes at $31.30 = 100.25 x 31.30
  assert.equal(earningsFloor(100 * 60 + 15, 31.3), 3137.83);
});

test("a payout under the floor produces a top-up for the difference", () => {
  const r = deliveryFloor({ vehicle: "bicycle-or-none", engagedMinutes: 600, paid: 280 });
  assert.equal(r.floor, 313);
  assert.equal(r.topUp, 33);
  assert.equal(r.belowFloor, true);
  assert.equal(r.effectiveHourly, 28);
  assert.equal(r.entitledTotal, 313);
});

test("a payout at or over the floor needs no top-up", () => {
  const r = deliveryFloor({ vehicle: "car-or-van", engagedMinutes: 600, paid: 400 });
  assert.equal(r.floor, 320);
  assert.equal(r.topUp, 0);
  assert.equal(r.belowFloor, false);
  assert.equal(r.entitledTotal, 400);
  assert.equal(r.effectiveHourly, 40);
});

test("the floor is before expenses: costs reduce profit, never the floor", () => {
  const r = deliveryFloor({
    vehicle: "car-or-van",
    engagedMinutes: 1200, // 20 hours
    paid: 600,
    km: 200,
    costPerKm: 0.5,
    otherCosts: 20,
  });
  assert.equal(r.floor, 640);
  assert.equal(r.topUp, 40);
  assert.equal(r.vehicleCost, 100);
  assert.equal(r.expenses, 120);
  assert.equal(r.profitBeforeTax, 520); // entitled 640 less 120
  assert.equal(r.profitPerEngagedHour, 26);
});

test("zero engaged time gives zero hourly figures, not NaN", () => {
  const r = deliveryFloor({ vehicle: "bicycle-or-none", engagedMinutes: 0, paid: 50 });
  assert.equal(r.floor, 0);
  assert.equal(r.effectiveHourly, 0);
  assert.equal(r.profitPerEngagedHour, 0);
});
