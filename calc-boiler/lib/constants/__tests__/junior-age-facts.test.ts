// =============================================================================
// Age-specific junior facts for /minimum-wage-by-age/[age]/
//
// Run with: npm test
//
// Dollar anchors are the Level 1 figures the determinations themselves print
// (read 10 October 2026): PR813655 Schedule B.3.1 (retail, from 1 December
// 2026) and PR813654 (fast food, from 1 December 2026).
// =============================================================================

import { test } from "node:test";
import assert from "node:assert/strict";

import {
  CHILD_WORK_RULES,
  JUNIOR_SCALE_AWARDS,
  PHASE_IN,
  adultAgeOf,
  adultRateStatus,
  awardsByPercentageAtAge,
  bandForAge,
  nextBirthday,
  nextRiseAge,
  phaseInForAge,
} from "../junior-age-facts";
import { FAST_FOOD_LEVEL_1, awardJuniorHourly } from "../minimum-wage";
import { HOSPITALITY_JUNIOR_SCALE, RETAIL_JUNIOR_SCALE, RETAIL_RATES } from "../hospitality-award";

const award = (code: string) => JUNIOR_SCALE_AWARDS.find((a) => a.code === code)!;

test("bandForAge matches the award's own labels", () => {
  assert.deepEqual(bandForAge(HOSPITALITY_JUNIOR_SCALE, 16), { age: "Under 17", percentage: 0.5 });
  assert.deepEqual(bandForAge(HOSPITALITY_JUNIOR_SCALE, 20), { age: "20 and over", percentage: 1 });
  assert.equal(bandForAge(award("MA000038").scale, 18)!.age, "Under 19");
  assert.equal(bandForAge(award("MA000005").scale, 18)!.percentage, 1);
  // Retail at 20: the 6-months-or-less band is the one a new 20-year-old starts on.
  assert.deepEqual(bandForAge(RETAIL_JUNIOR_SCALE, 20), { age: "20 (6 months or less)", percentage: 0.9 });
  assert.equal(bandForAge(RETAIL_JUNIOR_SCALE, 21), null);
});

test("every award junior scale covers every spoke age", () => {
  for (const a of JUNIOR_SCALE_AWARDS) {
    for (let age = 14; age <= 20; age++) assert.ok(bandForAge(a.scale, age), `${a.code} at ${age}`);
  }
  const total = awardsByPercentageAtAge(17).reduce((n, g) => n + g.awards.length, 0);
  assert.equal(total, JUNIOR_SCALE_AWARDS.length);
});

test("turning 15 changes no junior rate; turning 16 does not move hospitality", () => {
  assert.equal(nextBirthday(14).rises.length, 0);
  const at16 = nextBirthday(15);
  assert.ok(at16.unchanged.some((s) => s.award.code === "MA000009"));
  const retail = at16.rises.find((s) => s.award.code === "MA000004")!;
  assert.equal(retail.from.percentage, 0.45);
  assert.equal(retail.to.percentage, 0.5);
  assert.equal(nextRiseAge(HOSPITALITY_JUNIOR_SCALE, 15), 17);
  assert.equal(nextRiseAge(award("MA000083").scale, 15), 19);
});

test("adult-rate ages read from the scales", () => {
  assert.equal(adultAgeOf(award("MA000005").scale), 18);
  assert.equal(adultAgeOf(HOSPITALITY_JUNIOR_SCALE), 20);
  assert.equal(adultAgeOf(award("MA000003").scale), 21);
  // Retail's 100% at 20 needs more than 6 months' service, so the unconditional adult age is 21.
  assert.equal(adultAgeOf(RETAIL_JUNIOR_SCALE), 21);
  assert.deepEqual(adultRateStatus(18).adultNow.map((a) => a.code), ["MA000005"]);
  const at20 = adultRateStatus(20).adultNow.map((a) => a.code);
  assert.ok(at20.includes("MA000009") && at20.includes("MA000119"));
  assert.ok(!at20.includes("MA000003"));
});

test("phase-in by age: a four-year phase-in, not in force before 1 December 2026", () => {
  assert.equal(PHASE_IN.inForce, false);
  assert.equal(PHASE_IN.start, "1 December 2026");
  const p18 = phaseInForAge(18);
  assert.deepEqual(p18.map((r) => r.key), ["retail", "fastFood", "pharmacy"]);
  assert.deepEqual(p18[1].steps.map((s) => s.percentage), [75, 80, 85, 90, 95, 100]);
  assert.equal(p18[1].steps.at(-1)!.effective, "1 July 2029");
  assert.deepEqual(p18[2].steps.map((s) => s.percentage), [75, 85, 95, 100]);
  const p20 = phaseInForAge(20);
  assert.deepEqual(p20.map((r) => r.key), ["fastFood", "pharmacy"]);
  assert.deepEqual(p20[0].steps, [
    { effective: "1 December 2026", percentage: 95 },
    { effective: "1 July 2027", percentage: 100 },
  ]);
});

test("first-step Level 1 dollars match the determinations' own schedules", () => {
  const retailL1 = RETAIL_RATES.find((r) => r.level === "Level 1")!.weekly;
  assert.equal(awardJuniorHourly(retailL1, 0.75), 20.86); // PR813655 B.3.1, 18 more than 6 months
  assert.equal(awardJuniorHourly(retailL1, 0.85), 23.64); // PR813655 B.3.1, 19 more than 6 months
  assert.equal(awardJuniorHourly(FAST_FOOD_LEVEL_1.weekly, 0.95), 26.42); // PR813654, 20 more than 6 months
});

test("state rules: eight jurisdictions, each on a government page, none claiming a national minimum", () => {
  assert.equal(CHILD_WORK_RULES.length, 8);
  for (const r of CHILD_WORK_RULES) {
    assert.match(r.url, /^https:\/\/[^/]*(\.gov\.au|safework\.sa\.gov\.au)\//);
    for (const t of [r.at14, r.at15, r.faq14 ?? "", r.faq15 ?? ""]) assert.doesNotMatch(t, /national minimum/i);
  }
});
