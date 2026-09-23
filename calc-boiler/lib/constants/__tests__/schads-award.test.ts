// =============================================================================
// SCHADS (MA000100) — Fair Work conformance tests.
//
// Anchors are the FWO Pay Guide effective 01/07/2026, cross-checked against the
// consolidated award text. Verified 28 July 2026.
//
// The guard that matters: the Equal Remuneration Order. Award clause 15 lists
// Level 4 pp1 as $1,344.50; the operative ERO-inclusive rate is $1,774.74.
// Publishing the clause 15 figure understates SACS pay by up to 45%.
// =============================================================================

import { test } from "node:test";
import assert from "node:assert/strict";

import {
  SCHADS_AWARD,
  SCHADS_SACS,
  SCHADS_HOME_CARE_AGED,
  SCHADS_HOME_CARE_DISABILITY,
  SCHADS_PENALTIES,
  SCHADS_ALLOWANCES,
  SCHADS_VEHICLE_ALLOWANCE,
  isSchadsTemporaryVehicleRate,
  parseSchadsRates,
  schadsVehicleAllowanceWording,
  schadsVehiclePerKm,
} from "../schads-award";

test("hourly is weekly divided by 38, to the cent, for every SACS rate", () => {
  for (const r of SCHADS_SACS) {
    const derived = Math.round((r.weekly / SCHADS_AWARD.standardWeeklyHours) * 100) / 100;
    assert.ok(
      Math.abs(derived - r.hourly) <= 0.01,
      `${r.classification}: ${r.weekly}/38 = ${derived}, published ${r.hourly}`,
    );
  }
});

test("Equal Remuneration Order is applied — Level 4 pp1 is $1,774.74, not $1,344.50", () => {
  const l4 = SCHADS_SACS.find((r) => r.classification === "Level 4 pay point 1");
  assert.ok(l4);
  assert.equal(l4.weekly, 1_774.74);
  assert.notEqual(l4.weekly, 1_344.5, "that is the pre-ERO clause 15 figure");
  assert.ok(Math.abs(1_344.5 * 1.32 - l4.weekly) < 0.01);
});

test("Level 1 receives no ERO uplift, so the jump to Level 2 is real", () => {
  const l1 = SCHADS_SACS.find((r) => r.classification === "Level 1 pay point 3")!;
  const l2 = SCHADS_SACS.find((r) => r.classification === "Level 2 pay point 1")!;
  assert.equal(l1.weekly, 1_119.1);
  assert.equal(l2.weekly, 1_376.49);
  assert.ok(l2.weekly - l1.weekly > 250, "the discontinuity is genuine, not a typo");
});

test("SACS rates rise monotonically across all 27 classifications", () => {
  assert.equal(SCHADS_SACS.length, 27);
  for (let i = 1; i < SCHADS_SACS.length; i++) {
    assert.ok(
      SCHADS_SACS[i].weekly > SCHADS_SACS[i - 1].weekly,
      `${SCHADS_SACS[i].classification} is not above ${SCHADS_SACS[i - 1].classification}`,
    );
  }
});

test("every classification clears the national minimum wage", () => {
  for (const set of [SCHADS_SACS, SCHADS_HOME_CARE_AGED, SCHADS_HOME_CARE_DISABILITY]) {
    for (const r of set) {
      assert.ok(r.weekly >= 1_004.9, `${r.classification} at ${r.weekly} is below the NMW`);
    }
  }
});

test("casual loading reproduces the published casual rate", () => {
  const l1 = SCHADS_SACS[0];
  const casual = Math.round(l1.hourly * (1 + SCHADS_AWARD.casualLoading) * 100) / 100;
  assert.equal(casual, 34.44, "FWO publishes $34.44 for SACS Level 1 pp1 casual");
});

test("casual penalty rates are the permanent rate plus the loading", () => {
  assert.equal(SCHADS_PENALTIES.casualSaturday, SCHADS_PENALTIES.saturday + 0.25);
  assert.equal(SCHADS_PENALTIES.casualSunday, SCHADS_PENALTIES.sunday + 0.25);
  assert.equal(SCHADS_PENALTIES.casualPublicHoliday, SCHADS_PENALTIES.publicHoliday + 0.25);
});

test("sleepover allowance is 4.9% of the standard rate", () => {
  // cl 25.7(d), standard rate = clause 15.3 SACS L3 pp3 = $1,283.10 (pre-ERO).
  assert.ok(Math.abs(1_283.1 * 0.049 - SCHADS_ALLOWANCES.sleepover) < 0.01);
  assert.equal(SCHADS_ALLOWANCES.sleepover, 62.87);
});

test("SCHADS has no junior rates — any age table for this award is fabricated", () => {
  // An automated extraction returned "cl 10.5: under 16 = 60%..." for this
  // award. Clause 10.5 is not a junior rates clause and no such table exists.
  assert.equal(SCHADS_AWARD.hasJuniorRates, false);
});

test("parser rejects a malformed row", () => {
  assert.throws(() => parseSchadsRates("Level 1|1000"), /malformed SCHADS row/);
});

test("home care aged care has six levels and no pay points", () => {
  assert.equal(SCHADS_HOME_CARE_AGED.length, 6);
  for (const r of SCHADS_HOME_CARE_AGED) {
    assert.ok(!r.classification.includes("pay point"));
  }
});

// =============================================================================
// Corrections from the 28 July 2026 primary-source re-verification.
// =============================================================================

test("the ERO tables start at Level 2 — Level 1 gets no uplift", () => {
  // Both ERO tables in cl 15 open with "Social and community services employee
  // level 2". Calling the Level 1 rates ERO-inclusive misstates why they are
  // what they are, even though the figures themselves are the operative ones.
  assert.equal(SCHADS_AWARD.eroLowestLevel, 2);

  const l1 = SCHADS_SACS.filter((r) => r.classification.startsWith("Level 1"));
  assert.equal(l1.length, 3, "Level 1 has three pay points");
  // The plain cl 15.1 minimum wages, unchanged by any ERO.
  assert.deepEqual(l1.map((r) => r.weekly), [1_046.9, 1_080.6, 1_119.1]);
});

test("$1,119.10 means two different things and must not be conflated", () => {
  // It is the operative Level 1 pp3 rate, AND the pre-ERO cl 15 figure for
  // Level 2 pp1 which becomes $1,376.49. ~$257/week apart in meaning.
  const l1pp3 = SCHADS_SACS.find((r) => r.classification === "Level 1 pay point 3")!;
  const l2pp1 = SCHADS_SACS.find((r) => r.classification === "Level 2 pay point 1")!;
  assert.equal(l1pp3.weekly, 1_119.1);
  assert.equal(l2pp1.weekly, 1_376.49);
  assert.ok(l2pp1.weekly - l1pp3.weekly > 250);
});

test("public holiday pay is quoted as the award words it", () => {
  // cl 34.2(a) says "double time and a half". "250%" is our arithmetic.
  assert.equal(SCHADS_AWARD.publicHolidayAwardWording, "double time and a half");
  assert.equal(SCHADS_PENALTIES.publicHoliday, 2.5);
});

test("trainee rates are sourced outside this award", () => {
  // cl 19.2 incorporates Schedule E of the Miscellaneous Award 2020, which is
  // the only age-linked route into SCHADS pay. Needed to state the
  // no-junior-rates negative accurately.
  assert.match(SCHADS_AWARD.traineeRatesSource, /Miscellaneous Award 2020/);
});

test("vehicle allowance: temporary $1.05/km 1 Sep 2026 – 28 Feb 2027 (PR813674), $1.01 either side", () => {
  assert.equal(SCHADS_ALLOWANCES.vehiclePerKm, 1.01);
  assert.equal(SCHADS_VEHICLE_ALLOWANCE.ordinaryPerKm, 1.01);
  assert.equal(SCHADS_VEHICLE_ALLOWANCE.temporaryPerKm, 1.05);
  assert.equal(SCHADS_VEHICLE_ALLOWANCE.determination, "PR813674");
  assert.equal(schadsVehiclePerKm("2026-08-31"), 1.01);
  assert.equal(schadsVehiclePerKm("2026-09-01"), 1.05);
  assert.equal(schadsVehiclePerKm("2026-09-23"), 1.05);
  assert.equal(schadsVehiclePerKm("2027-02-28"), 1.05);
  assert.equal(schadsVehiclePerKm("2027-03-01"), 1.01);
  assert.equal(isSchadsTemporaryVehicleRate(new Date("2026-12-01T00:00:00Z")), true);
  assert.equal(isSchadsTemporaryVehicleRate(new Date("2027-06-01T00:00:00Z")), false);
});

test("vehicle allowance wording names the rate in force and the other one", () => {
  assert.match(schadsVehicleAllowanceWording("2026-08-01"), /^\$1\.01 per km; rises temporarily to \$1\.05/);
  const during = schadsVehicleAllowanceWording("2026-09-23");
  assert.match(during, /^\$1\.05 per km from 1 September 2026 to 28 February 2027/);
  assert.match(during, /\$1\.01 per km again from 1 March 2027/);
  assert.match(schadsVehicleAllowanceWording("2027-03-01"), /^\$1\.01 per km \(the temporary \$1\.05 rate/);
});

// --- G6: Schedule E interim increase from 1 Dec 2026 (PR814259) ---
import { SCHADS_HOME_CARE_DISABILITY_DEC_2026, SCHADS_SCHEDULE_E_INCREASE } from "../schads-award";

test("G6: every Schedule E Dec 2026 rate is the current rate x the interim increase, to 10c", () => {
  assert.equal(SCHADS_HOME_CARE_DISABILITY_DEC_2026.length, SCHADS_HOME_CARE_DISABILITY.length);
  const ex = SCHADS_SCHEDULE_E_INCREASE.exceptions as Record<string, number>;
  for (const row of SCHADS_HOME_CARE_DISABILITY_DEC_2026) {
    const now = SCHADS_HOME_CARE_DISABILITY.find((r) => r.classification === row.classification);
    assert.ok(now, row.classification);
    const pct = ex[row.classification] ?? SCHADS_SCHEDULE_E_INCREASE.interimIncrease;
    assert.ok(Math.abs(now.weekly * (1 + pct) - row.weekly) <= 0.1, `${row.classification}: ${now.weekly} -> ${row.weekly}`);
  }
});
// --- end G6 ---
