// =============================================================================
// Zone and overseas forces tax offset — ATO conformance tests
//
// Run with: npm test
//
// Anchors are the ATO's own published table amounts and worked examples from
// T4 Zone or overseas forces 2026 (QC106871), retrieved 28 July 2026.
//
// The defect these guard against: the site previously published $1,511 as the
// maximum zone offset, treating a special area as a supplement on top of the
// Zone A fixed amount. ATO table 3 lists "Special area" as its own row — it
// REPLACES the zone amount. The real maximum with no dependants is $1,173.
// =============================================================================

import { test } from "node:test";
import assert from "node:assert/strict";

import {
  ZONE_AREA_RATES,
  DEPENDANT_BASE_AMOUNTS,
  SOLE_PARENT_BASE,
  calculateZoneTaxOffset,
  calculateDependantBaseAmount,
  calculateSoleParentBase,
  reduceBaseAmountForATI,
} from "../zone-tax-offset";

const near = (actual: number, expected: number, msg: string) =>
  assert.ok(
    Math.abs(actual - expected) < 0.011,
    `${msg}: expected ~${expected}, got ${actual}`,
  );

// ---------------------------------------------------------------------------
// ATO table 1 / table 3 — the published fixed amounts
// ---------------------------------------------------------------------------

test("ATO table 1: Zone A with no base amount is $338", () => {
  const r = calculateZoneTaxOffset({ places: [{ area: "zoneA", days: 200 }] });
  assert.equal(r.offset, 338);
  assert.equal(r.category, 1);
});

test("ATO table 1: Zone B with no base amount is $57", () => {
  const r = calculateZoneTaxOffset({ places: [{ area: "zoneB", days: 200 }] });
  assert.equal(r.offset, 57);
});

test("ATO table 1: special area with no base amount is $1,173", () => {
  const r = calculateZoneTaxOffset({ places: [{ area: "specialArea", days: 200 }] });
  assert.equal(r.offset, 1_173);
});

test("ATO table 1: overseas forces with no base amount is $338", () => {
  const r = calculateZoneTaxOffset({ places: [{ area: "overseasForces", days: 200 }] });
  assert.equal(r.offset, 338);
});

test("special area REPLACES the zone fixed amount — $1,511 must never appear", () => {
  // The live page claimed Zone A + special area = $338 + $1,173 = $1,511.
  const r = calculateZoneTaxOffset({
    places: [
      { area: "zoneA", days: 365 },
      { area: "specialArea", days: 365 },
    ],
  });
  assert.equal(r.offset, 1_173);
  assert.notEqual(r.offset, 1_511);
});

test("Zone B + special area is $1,173, not $1,230", () => {
  const r = calculateZoneTaxOffset({
    places: [
      { area: "zoneB", days: 365 },
      { area: "specialArea", days: 365 },
    ],
  });
  assert.equal(r.offset, 1_173);
  assert.notEqual(r.offset, 1_230);
});

// ---------------------------------------------------------------------------
// ATO worked examples
// ---------------------------------------------------------------------------

test("ATO example 'Neil': Zone A 190 days + Zone B 40 days uses Zone A only", () => {
  // "Neil uses the Zone A amount because this will give him the greater
  //  benefit. He ignores the time that his usual place of residence was in Zone B."
  const r = calculateZoneTaxOffset({
    places: [
      { area: "zoneA", days: 190 },
      { area: "zoneB", days: 40 },
    ],
  });
  assert.equal(r.category, 1);
  assert.equal(r.offset, 338);
});

test("ATO example 'Sharon': Zone A 100 days + Zone B 120 days apportions 100/183 and 83/183", () => {
  // "Sharon claims 100 / 183 days for Zone A and 83 / 183 days for Zone B."
  const r = calculateZoneTaxOffset({
    places: [
      { area: "zoneA", days: 100 },
      { area: "zoneB", days: 120 },
    ],
  });
  assert.equal(r.category, 2);
  assert.equal(r.perPlace[0].daysClaimed, 100);
  assert.equal(r.perPlace[1].daysClaimed, 83);
  near(r.offset, (338 * 100) / 183 + (57 * 83) / 183, "Sharon two-zone offset");
});

test("ATO example: overseas 100 days + special area 185 days claims the full special area amount", () => {
  // "Sharon claims the full special area amount and ignores the 100 days in an
  //  overseas locality."
  const r = calculateZoneTaxOffset({
    places: [
      { area: "overseasForces", days: 100 },
      { area: "specialArea", days: 185 },
    ],
  });
  assert.equal(r.category, 1);
  assert.equal(r.offset, 1_173);
});

test("ATO example 'Sharon overseas only': 100 days claims 100/183", () => {
  const r = calculateZoneTaxOffset({ places: [{ area: "overseasForces", days: 100 }] });
  assert.equal(r.category, 2);
  near(r.offset, (338 * 100) / 183, "overseas part-year offset");
});

// ---------------------------------------------------------------------------
// ATO table 2 — dependant base amounts
// ---------------------------------------------------------------------------

test("ATO table 2: one student under 25 is $376", () => {
  assert.equal(calculateDependantBaseAmount(1, 0), DEPENDANT_BASE_AMOUNTS.studentUnder25);
});

test("ATO table 2: oldest non-student child is $376, each further child $282", () => {
  assert.equal(calculateDependantBaseAmount(0, 1), 376);
  assert.equal(calculateDependantBaseAmount(0, 2), 376 + 282);
  assert.equal(calculateDependantBaseAmount(0, 3), 376 + 282 * 2);
});

test("students and children combine", () => {
  assert.equal(calculateDependantBaseAmount(2, 2), 376 * 2 + 376 + 282);
});

test("Zone A adds 50% of the base amount", () => {
  const r = calculateZoneTaxOffset({ places: [{ area: "zoneA", days: 365 }], students: 1 });
  assert.equal(r.totalBaseAmount, 376);
  assert.equal(r.offset, 338 + 376 * 0.5); // 526
});

test("Zone B adds only 20% of the base amount", () => {
  const r = calculateZoneTaxOffset({ places: [{ area: "zoneB", days: 365 }], students: 1 });
  near(r.offset, 57 + 376 * 0.2, "Zone B with one student"); // 132.20
});

// ---------------------------------------------------------------------------
// Sole parent, invalid carer, ATI reduction, remote area allowance
// ---------------------------------------------------------------------------

test("sole parent full year is $1,607", () => {
  assert.equal(calculateSoleParentBase(365), SOLE_PARENT_BASE.fullYear);
});

test("sole parent part year is $4.40 a day", () => {
  near(calculateSoleParentBase(100), 440, "sole parent 100 days");
});

test("invalid carer offset flows into the base amount", () => {
  const r = calculateZoneTaxOffset({
    places: [{ area: "zoneA", days: 365 }],
    invalidCarerOffset: 3_396,
  });
  assert.equal(r.totalBaseAmount, 3_396);
  assert.equal(r.offset, 338 + 3_396 * 0.5); // 2,036
});

test("ATO worksheet 2: base reduces $1 for every $4 of ATI over $282", () => {
  assert.equal(reduceBaseAmountForATI(376, 285), 376, "ATI under $286 claims in full");
  assert.equal(reduceBaseAmountForATI(376, 286), 375, "$4 over reduces by $1");
  assert.equal(reduceBaseAmountForATI(376, 400), 376 - Math.floor(118 / 4));
  assert.equal(reduceBaseAmountForATI(376, 10_000), 0, "never negative");
});

test("remote area allowance reduces the offset and never takes it below zero", () => {
  const partial = calculateZoneTaxOffset({
    places: [{ area: "zoneA", days: 365 }],
    remoteAreaAllowance: 100,
  });
  assert.equal(partial.offset, 238);

  const swamped = calculateZoneTaxOffset({
    places: [{ area: "zoneA", days: 365 }],
    remoteAreaAllowance: 5_000,
  });
  assert.equal(swamped.offset, 0);
});

// ---------------------------------------------------------------------------
// Invariants
// ---------------------------------------------------------------------------

test("no combination of places exceeds the special area amount plus 50% of base", () => {
  const areas = Object.keys(ZONE_AREA_RATES) as (keyof typeof ZONE_AREA_RATES)[];
  const ceiling = ZONE_AREA_RATES.specialArea.fixedAmount + 1_000 * 0.5;
  for (const a of areas) {
    for (const b of areas) {
      const r = calculateZoneTaxOffset({
        places: [
          { area: a, days: 300 },
          { area: b, days: 300 },
        ],
        invalidCarerOffset: 1_000,
      });
      assert.ok(
        r.offset <= ceiling + 0.01,
        `${a}+${b} produced ${r.offset}, above the ${ceiling} ceiling`,
      );
    }
  }
});

test("days claimed across all places never exceed 183", () => {
  const r = calculateZoneTaxOffset({
    places: [
      { area: "zoneA", days: 150 },
      { area: "zoneB", days: 150 },
      { area: "overseasForces", days: 150 },
    ],
  });
  const claimed = r.perPlace.reduce((t, p) => t + p.daysClaimed, 0);
  assert.ok(claimed <= 183, `claimed ${claimed} days`);
});

test("no days in any zone is ineligible and returns zero", () => {
  const r = calculateZoneTaxOffset({ places: [] });
  assert.equal(r.offset, 0);
  assert.equal(r.ineligible, true);
});

test("183 days exactly qualifies in full — the test is '183 days or more'", () => {
  const r = calculateZoneTaxOffset({ places: [{ area: "zoneA", days: 183 }] });
  assert.equal(r.category, 1);
  assert.equal(r.offset, 338);

  const justUnder = calculateZoneTaxOffset({ places: [{ area: "zoneA", days: 182 }] });
  assert.equal(justUnder.category, 2, "182 days apportions rather than qualifying in full");
  assert.ok(justUnder.offset < 338);
});
