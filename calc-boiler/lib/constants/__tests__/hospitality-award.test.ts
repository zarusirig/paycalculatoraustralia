// =============================================================================
// Hospitality (MA000009) and Retail (MA000004) — Fair Work conformance tests.
// Verified 28 July 2026 against the FWO pay guides effective 01/07/2026.
//
// These guard four traps that each produce plausible-looking wrong numbers.
// =============================================================================

import { test } from "node:test";
import assert from "node:assert/strict";

import {
  HOSPITALITY_AWARD,
  RETAIL_AWARD,
  AWR_2026_FLOORS,
  HOSPITALITY_RATES,
  HOSPITALITY_CLASSIFICATIONS,
  HOSPITALITY_PENALTIES,
  HOSPITALITY_OVERTIME,
  HOSPITALITY_JUNIOR_SCALE,
  RETAIL_RATES,
  RETAIL_PENALTIES,
  RETAIL_OVERTIME,
  RETAIL_JUNIOR_SCALE,
} from "../hospitality-award";

test("hourly is weekly / 38 for every published rate", () => {
  for (const set of [HOSPITALITY_RATES, RETAIL_RATES]) {
    for (const r of set) {
      const derived = Math.round((r.weekly / 38) * 100) / 100;
      assert.ok(Math.abs(derived - r.hourly) <= 0.01, `${r.level}: ${derived} vs ${r.hourly}`);
    }
  }
});

// --- Trap 1: the 4.75% is not uniform -------------------------------------
test("Introductory and Level 1 sit exactly on the AWR floors, not +4.75%", () => {
  const intro = HOSPITALITY_RATES.find((r) => r.level === "Introductory")!;
  const l1 = HOSPITALITY_RATES.find((r) => r.level === "Level 1")!;
  assert.equal(intro.weekly, AWR_2026_FLOORS.entryLevelWeekly);
  assert.equal(intro.hourly, AWR_2026_FLOORS.entryLevelHourly);
  assert.equal(l1.weekly, AWR_2026_FLOORS.ongoingWeekly);
  assert.equal(l1.hourly, AWR_2026_FLOORS.ongoingHourly);
});

test("no rate falls below the entry-level floor", () => {
  for (const set of [HOSPITALITY_RATES, RETAIL_RATES]) {
    for (const r of set) {
      assert.ok(r.weekly >= AWR_2026_FLOORS.entryLevelWeekly, `${r.level} below floor`);
    }
  }
});

// --- Trap 2: evening and night are flat cash ------------------------------
test("hospitality evening and night loadings are cash per hour, not multipliers", () => {
  assert.equal(HOSPITALITY_PENALTIES.eveningPerHour, 2.95);
  assert.equal(HOSPITALITY_PENALTIES.nightPerHour, 4.42);
  // A multiplier would be near 1.0; these must be dollar amounts.
  assert.ok(HOSPITALITY_PENALTIES.eveningPerHour > 1.5);
  // Retail evening, by contrast, IS a percentage.
  assert.equal(RETAIL_PENALTIES.eveningAfter6pm, 1.25);
});

// --- Trap 3: casual penalties are additive, not compounded ----------------
test("casual penalties add the 25% loading rather than multiplying by it", () => {
  assert.equal(HOSPITALITY_PENALTIES.casualSunday, HOSPITALITY_PENALTIES.sunday + 0.25);
  assert.equal(HOSPITALITY_PENALTIES.casualSaturday, HOSPITALITY_PENALTIES.saturday + 0.25);
  assert.equal(HOSPITALITY_PENALTIES.casualPublicHoliday, HOSPITALITY_PENALTIES.publicHoliday + 0.25);
  // The compounded figure would be 1.875, which is what a naive model gives.
  assert.notEqual(HOSPITALITY_PENALTIES.casualSunday, HOSPITALITY_PENALTIES.sunday * 1.25);
});

test("published casual ordinary rate is the full-time hourly plus 25%", () => {
  const l1 = HOSPITALITY_RATES.find((r) => r.level === "Level 1")!;
  assert.equal(Math.round(l1.hourly * 1.25 * 100) / 100, 33.05);
});

// --- Trap 4: casual overtime diverges between the two awards --------------
test("hospitality excludes the casual loading from overtime; retail includes it", () => {
  assert.equal(HOSPITALITY_AWARD.casualLoadingOnOvertime, false);
  assert.equal(RETAIL_AWARD.casualLoadingOnOvertime, true);
  // Retail's casual first-tranche rate carries the loading; hospitality has no
  // separate casual overtime rate at all because it equals the full-time one.
  assert.equal(RETAIL_OVERTIME.casualWeekdayFirst3Hours, RETAIL_OVERTIME.weekdayFirst3Hours + 0.25);
  assert.equal(HOSPITALITY_OVERTIME.weekdayFirst2Hours, 1.5);
});

// --- Classification integrity ---------------------------------------------
test("there is no food and beverage attendant grade 5", () => {
  // The stream runs grades 1-4; Level 5 is "food and beverage supervisor".
  const titles = HOSPITALITY_CLASSIFICATIONS.map((c) => c.title.toLowerCase());
  assert.ok(!titles.some((t) => t.includes("beverage attendant grade 5")));
  assert.ok(titles.includes("food & beverage supervisor"));
});

test("every classification maps to a level that has a published rate", () => {
  const levels = new Set(HOSPITALITY_RATES.map((r) => r.level));
  for (const c of HOSPITALITY_CLASSIFICATIONS) {
    assert.ok(levels.has(c.level), `${c.title} maps to unknown ${c.level}`);
  }
});

// --- Junior scales differ between the awards ------------------------------
test("hospitality and retail junior scales genuinely differ at 19", () => {
  const hosp19 = HOSPITALITY_JUNIOR_SCALE.find((s) => s.age === "19")!.percentage;
  const ret19 = RETAIL_JUNIOR_SCALE.find((s) => s.age === "19")!.percentage;
  assert.equal(hosp19, 0.85);
  assert.equal(ret19, 0.8);
  assert.notEqual(hosp19, ret19);
});

test("retail's 20-year-old band splits on length of service", () => {
  const short = RETAIL_JUNIOR_SCALE.find((s) => s.age === "20 (6 months or less)")!;
  const long = RETAIL_JUNIOR_SCALE.find((s) => s.age === "20 (more than 6 months)")!;
  assert.equal(short.percentage, 0.9);
  assert.equal(long.percentage, 1);
});

test("junior scales are monotonic and top out at the adult rate", () => {
  for (const scale of [HOSPITALITY_JUNIOR_SCALE, RETAIL_JUNIOR_SCALE]) {
    assert.equal(scale[scale.length - 1].percentage, 1);
    for (let i = 1; i < scale.length; i++) {
      assert.ok(scale[i].percentage >= scale[i - 1].percentage);
    }
  }
});
