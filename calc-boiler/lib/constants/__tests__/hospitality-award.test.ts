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
  HOSPITALITY_PUBLIC_HOLIDAY_OVERTIME,
  RETAIL_JUNIOR_LEVEL_RESTRICTION,
  HOSPITALITY_MANAGERIAL_SOURCE,
  AWARD_DETERMINATIONS,
  AWARD_UNVERIFIED,
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

// =============================================================================
// Corrections from the 28 July 2026 primary-source re-verification.
// =============================================================================

test("casual overtime equals full-time overtime EXCEPT on public holidays", () => {
  // Schedule B.2.2 vs B.2.4 give identical dollars for Mon-Fri, weekend and
  // RDO overtime, but diverge on public holidays: 225% against 250%. Stating
  // the rule without that carve-out understates casual public holiday pay.
  assert.equal(HOSPITALITY_AWARD.casualLoadingOnOvertime, false);
  assert.equal(HOSPITALITY_PUBLIC_HOLIDAY_OVERTIME.fullTime, 2.25);
  assert.equal(HOSPITALITY_PUBLIC_HOLIDAY_OVERTIME.casual, 2.5);
  assert.notEqual(
    HOSPITALITY_PUBLIC_HOLIDAY_OVERTIME.fullTime,
    HOSPITALITY_PUBLIC_HOLIDAY_OVERTIME.casual,
    "public holidays are the exception to the identical-overtime rule",
  );
});

test("the highest-penalty-only rule has a breaks carve-out", () => {
  // cl 29.3(b) pays only the highest penalty; cl 29.3(c) makes the clause 16
  // Breaks penalty payable in addition.
  assert.equal(HOSPITALITY_PENALTIES.cumulative, false);
  assert.match(HOSPITALITY_PENALTIES.highestOnlyException, /in addition/);
});

test("retail junior rates are confined to levels 1-3 by the award itself", () => {
  // This is cl 17.2, not a Fair Work publishing choice — it was previously
  // recorded as the latter, which would have made it look like a data gap.
  assert.match(RETAIL_JUNIOR_LEVEL_RESTRICTION, /levels 1, 2 and 3/);
  assert.match(RETAIL_JUNIOR_LEVEL_RESTRICTION, /full adult rate/);
  for (const gap of AWARD_UNVERIFIED) {
    assert.ok(!gap.startsWith("Retail junior rates"), "no longer a gap; it is a rule");
  }
});

test("the managerial weekly rate is attributed to the pay guide, not the award", () => {
  // The award sets a minimum ANNUAL salary of $63,617 (cl 18.2) and never
  // states $1,223.39. Only the FWO pay guide does.
  assert.equal(HOSPITALITY_MANAGERIAL_SOURCE.weeklyIsPayGuideOnly, true);
  assert.equal(HOSPITALITY_MANAGERIAL_SOURCE.awardAnnualSalary, 63_617);
  const managerial = HOSPITALITY_RATES.find((r) => r.level.startsWith("Managerial"))!;
  assert.equal(managerial.weekly, 1_223.39);
});

test("determinations are recorded for both awards", () => {
  assert.equal(AWARD_DETERMINATIONS.hospitality, "PR799290");
  assert.equal(AWARD_DETERMINATIONS.retail, "PR799285");
  assert.equal(HOSPITALITY_AWARD.determination, AWARD_DETERMINATIONS.hospitality);
});

// Oct 2026: the above-the-fold level table is computed, so pin it to the figures
// printed in Schedule B.2.1 and B.2.3 of the consolidated award (read 5 Oct 2026,
// "incorporates all amendments up to and including 1 July 2026").
test("above-the-fold table: ordinary, Saturday, Sunday and public holiday rates match Schedule B", () => {
  const cents = (v: number) => Math.round(Number((v * 100).toFixed(6))) / 100;
  // level: [ft Sat, ft Sun, ft PH, casual ord, casual Sat, casual Sun, casual PH]
  const scheduleB: Record<string, number[]> = {
    Introductory: [32.18, 38.61, 57.92, 32.18, 38.61, 45.05, 64.35],
    "Level 1": [33.05, 39.66, 59.49, 33.05, 39.66, 46.27, 66.1],
    "Level 2": [33.85, 40.62, 60.93, 33.85, 40.62, 47.39, 67.7],
    "Level 3": [34.96, 41.96, 62.93, 34.96, 41.96, 48.95, 69.93],
    "Level 4": [36.81, 44.18, 66.26, 36.81, 44.18, 51.54, 73.63],
    "Level 5": [39.13, 46.95, 70.43, 39.13, 46.95, 54.78, 78.25],
    "Level 6": [40.16, 48.2, 72.29, 40.16, 48.2, 56.23, 80.33],
  };
  const P = HOSPITALITY_PENALTIES;
  for (const [level, expected] of Object.entries(scheduleB)) {
    const r = HOSPITALITY_RATES.find((x) => x.level === level)!;
    const got = [
      cents(r.hourly * P.saturday),
      cents(r.hourly * P.sunday),
      cents(r.hourly * P.publicHoliday),
      cents(r.hourly * (1 + HOSPITALITY_AWARD.casualLoading)),
      cents(r.hourly * P.casualSaturday),
      cents(r.hourly * P.casualSunday),
      cents(r.hourly * P.casualPublicHoliday),
    ];
    assert.deepEqual(got, expected, level);
  }
});
