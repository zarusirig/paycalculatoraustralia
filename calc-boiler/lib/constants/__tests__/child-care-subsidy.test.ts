// =============================================================================
// H3 Child Care Subsidy 2026-27 tests. Worked examples are Services
// Australia's "Examples to help you understand your Child Care Subsidy"
// (read 24 September 2026).
//
// Run with: npm test
// =============================================================================

import { test } from "node:test";
import assert from "node:assert/strict";

import { CCS, ccsForChild, ccsHigherPercent, ccsStandardPercent, ccsSubsidisedHours } from "../child-care-subsidy";

test("standard rate reproduces every Services Australia worked example", () => {
  assert.equal(ccsStandardPercent(75_000), 90); // Charlotte
  assert.equal(ccsStandardPercent(130_000), 81.7); // Richard, Sonam & Dechen
  assert.equal(ccsStandardPercent(400_000), 27.7); // Tony & Viv
  assert.equal(ccsStandardPercent(95_000), 88.7); // Andy & Chris
  assert.equal(ccsStandardPercent(120_000), 83.7); // Rani & Tavish
  assert.equal(ccsStandardPercent(182_300), 71.24); // Gus & Louise, standard child
});

test("standard rate boundaries", () => {
  assert.equal(ccsStandardPercent(88_520), 90);
  assert.equal(ccsStandardPercent(93_520), 89);
  assert.equal(ccsStandardPercent(538_519), 0);
  assert.equal(ccsStandardPercent(538_520), 0);
  assert.equal(CCS.standard.lowerThreshold + CCS.standard.maxPercent * CCS.standard.step, CCS.standard.cutOut);
});

test("higher rate follows the published 2026-27 table", () => {
  assert.equal(ccsHigherPercent(70_000), 95); // Carmel & Ali
  assert.equal(ccsHigherPercent(130_000), 95); // Sonam & Dechen
  assert.equal(ccsHigherPercent(120_000), 95); // Rani & Tavish
  assert.equal(ccsHigherPercent(146_437), 95);
  assert.equal(ccsHigherPercent(149_437), 94);
  assert.equal(ccsHigherPercent(191_437), 80);
  assert.equal(ccsHigherPercent(250_000), 80);
  assert.equal(ccsHigherPercent(300_727), 70);
  assert.equal(ccsHigherPercent(360_727), 50);
  assert.equal(ccsHigherPercent(370_726), 50);
  assert.equal(ccsHigherPercent(370_727), null);
  assert.equal(ccsHigherPercent(400_000), null); // Tony & Viv: standard for all
  // Band ends line up with the table (15 points over $45,000; 30 over $90,000).
  const h = CCS.higher;
  assert.equal((h.band1End - h.band1Start) / h.step, h.maxPercent - h.plateauPercent);
  assert.equal((h.band2End - h.band2Start) / h.step, h.plateauPercent - h.floorPercent);
});

test("the twins example conflicts with the published table — we follow the table", () => {
  // Services Australia's example says 81.99%; the table gives 83.05%.
  assert.equal(ccsHigherPercent(182_300), 83.05);
});

test("subsidised hours: 72 guaranteed, 100 above 48 hours of participation", () => {
  assert.equal(ccsSubsidisedHours(0), 72);
  assert.equal(ccsSubsidisedHours(48), 72);
  assert.equal(ccsSubsidisedHours(48.5), 100);
  assert.equal(ccsSubsidisedHours(0, true), 100);
});

test("one child's fortnight: percentage × lower of fee and cap, for subsidised hours", () => {
  // $150/day, 10-hour session, 3 days a week, $130,000 family income, 72 hours.
  const r = ccsForChild({ careType: "cbdc", ageBand: "belowSchool", dailyFee: 150, sessionHours: 10, daysPerWeek: 3, higherRateChild: false }, 130_000, 72);
  assert.equal(r.hourlyFee, 15);
  assert.equal(r.cap, 15.19);
  assert.equal(r.percent, 81.7);
  assert.equal(r.subsidyPerHour, 12.26); // 15 × 81.7% = 12.255 → 12.26
  assert.equal(r.hoursCharged, 60);
  assert.equal(r.hoursSubsidised, 60);
  assert.equal(r.feesFortnight, 900);
  assert.equal(r.subsidyFortnight, 735.6);
  assert.equal(r.withheldFortnight, 36.78);
  assert.equal(r.paidFortnight, 698.82);
  assert.equal(r.gapFortnight, 201.18);
});

test("fee above the cap: subsidy is on the cap; hours above the entitlement are unsubsidised", () => {
  // $200/day, 10 hours → $20/hour, capped at $15.19. 5 days = 100 hours, entitlement 72.
  const r = ccsForChild({ careType: "cbdc", ageBand: "belowSchool", dailyFee: 200, sessionHours: 10, daysPerWeek: 5, higherRateChild: false }, 80_000, 72);
  assert.equal(r.percent, 90);
  assert.equal(r.subsidyPerHour, 13.67); // 15.19 × 90% = 13.671
  assert.equal(r.hoursSubsidised, 72);
  assert.equal(r.subsidyFortnight, Math.round(13.67 * 72 * 100) / 100);
});

test("higher-rate child gets the higher percentage; In Home Care never does", () => {
  const base = { careType: "cbdc" as const, ageBand: "belowSchool" as const, dailyFee: 140, sessionHours: 10, daysPerWeek: 2, higherRateChild: true };
  assert.equal(ccsForChild(base, 130_000, 72).percent, 95);
  assert.equal(ccsForChild({ ...base, careType: "ihc" }, 130_000, 72).percent, 81.7);
  assert.equal(ccsForChild(base, 400_000, 72).percent, 27.7);
});

test("school-age caps are lower for centre care and OSHC", () => {
  assert.equal(CCS.hourlyRateCap.schoolAge.oshc, 13.3);
  assert.equal(CCS.hourlyRateCap.belowSchool.oshc, 15.19);
  assert.equal(CCS.hourlyRateCap.schoolAge.fdc, CCS.hourlyRateCap.belowSchool.fdc);
});
