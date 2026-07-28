// =============================================================================
// Junior pay rates — Fair Work conformance tests
//
// Run with: npm test
//
// Anchors are the twelve dollar figures Fair Work PUBLISHES at
// fairwork.gov.au/employment-conditions/awards/award-and-agreement-free-wages-and-conditions
// under "Juniors", verified 28 July 2026. They are not derived by us.
//
// The reason these tests exist: three of the six junior rates come out a cent
// low if the percentage is applied to the hourly minimum instead of the weekly
// one, and the casual rate at 19 comes out a cent low if derived from the
// unrounded hourly figure. Both mistakes look entirely plausible on the page.
// =============================================================================

import { test } from "node:test";
import assert from "node:assert/strict";

import { EMPLOYMENT } from "../australian-tax";
import {
  JUNIOR_RATES,
  JUNIOR_BANDS,
  CASUAL_LOADING,
  ADULT_AGE,
  AWARD_JUNIOR_SCALES,
  PENDING_JUNIOR_CHANGE,
  juniorHourlyRate,
  juniorCasualHourlyRate,
} from "../junior-rates";

/** Fair Work's published figures. Do not "fix" these to match our arithmetic. */
const FWO_PUBLISHED: { age: string; hourly: number; casual: number }[] = [
  { age: "Under 16", hourly: 9.73, casual: 12.16 },
  { age: "16", hourly: 12.51, casual: 15.64 },
  { age: "17", hourly: 15.29, casual: 19.11 },
  { age: "18", hourly: 18.06, casual: 22.58 },
  { age: "19", hourly: 21.82, casual: 27.28 },
  { age: "20", hourly: 25.84, casual: 32.30 },
  { age: "21 and over", hourly: 26.44, casual: 33.05 },
];

test("the adult National Minimum Wage matches the order", () => {
  assert.equal(EMPLOYMENT.minimumWageHourly, 26.44);
  assert.equal(EMPLOYMENT.minimumWageWeekly, 1_004.90);
  assert.equal(EMPLOYMENT.standardWeeklyHours, 38);
});

for (const expected of FWO_PUBLISHED) {
  test(`Fair Work published rate: age ${expected.age} is $${expected.hourly}/hr`, () => {
    const row = JUNIOR_RATES.find((r) => r.age === expected.age);
    assert.ok(row, `no band for ${expected.age}`);
    assert.equal(row.hourly, expected.hourly);
  });

  test(`Fair Work published casual rate: age ${expected.age} is $${expected.casual}/hr`, () => {
    const row = JUNIOR_RATES.find((r) => r.age === expected.age);
    assert.ok(row);
    assert.equal(row.casualHourly, expected.casual);
  });
}

test("rates are derived from the WEEKLY minimum, not the hourly one", () => {
  // Applying the percentage to $26.44 gives $15.28 at age 17, $21.81 at 19 and
  // $25.83 at 20 — a cent light each time, and wrong against Fair Work.
  for (const [age, pct] of [
    ["17", 0.578],
    ["19", 0.825],
    ["20", 0.977],
  ] as const) {
    const fromHourly = Math.round(EMPLOYMENT.minimumWageHourly * pct * 100) / 100;
    const ours = juniorHourlyRate(pct);
    assert.notEqual(
      ours,
      fromHourly,
      `age ${age}: deriving from the hourly rate would have matched, so the guard is not testing anything`,
    );
    const published = FWO_PUBLISHED.find((f) => f.age === age)!.hourly;
    assert.equal(ours, published);
  }
});

test("casual rate uses the ROUNDED junior hourly rate", () => {
  // Age 19: 21.82 x 1.25 = 27.275 -> 27.28. From the unrounded 21.8169 it
  // would be 27.27, which is not what Fair Work publishes.
  const unrounded = (EMPLOYMENT.minimumWageWeekly * 0.825) / EMPLOYMENT.standardWeeklyHours;
  const fromUnrounded = Math.round(unrounded * 1.25 * 100) / 100;
  assert.equal(fromUnrounded, 27.27, "precondition: the naive path gives 27.27");
  assert.equal(juniorCasualHourlyRate(0.825), 27.28, "we must publish Fair Work's 27.28");
});

test("casual loading is 25% and applies on top of the junior rate", () => {
  assert.equal(CASUAL_LOADING, 0.25);
  const adult = JUNIOR_RATES.find((r) => r.age === "21 and over")!;
  const sixteen = JUNIOR_RATES.find((r) => r.age === "16")!;
  // A 16-year-old casual gets 25% on THEIR base, not on the adult base.
  assert.ok(sixteen.casualHourly < adult.hourly, "16yo casual must not exceed the adult permanent rate");
  assert.equal(sixteen.casualHourly, 15.64);
});

test("there is no separate band for 14 or 15 year olds", () => {
  // The correct answer to "minimum wage australia 14 year old" is the
  // under-16 rate. Publishing a distinct 14yo figure would be invented.
  const ages = JUNIOR_BANDS.map((b) => b.age);
  assert.ok(ages.includes("Under 16"));
  assert.ok(!ages.some((a) => a.includes("14")));
  assert.ok(!ages.some((a) => a.includes("15")));
});

test("rates rise monotonically with age", () => {
  const sorted = [...JUNIOR_RATES].sort((a, b) => a.years - b.years);
  for (let i = 1; i < sorted.length; i++) {
    assert.ok(
      sorted[i].hourly > sorted[i - 1].hourly,
      `${sorted[i].age} is not above ${sorted[i - 1].age}`,
    );
  }
});

test("the adult rate applies from 21 under the National Minimum Wage", () => {
  assert.equal(ADULT_AGE, 21);
  const adult = JUNIOR_RATES.find((r) => r.years === 21)!;
  assert.equal(adult.percentage, 1);
  assert.equal(adult.hourly, EMPLOYMENT.minimumWageHourly);
});

test("award junior scales differ from the NMW scale and from each other", () => {
  // The point of carrying these: there is no single national junior scale.
  const retail = AWARD_JUNIOR_SCALES.find((a) => a.code === "MA000004")!;
  const fastFood = AWARD_JUNIOR_SCALES.find((a) => a.code === "MA000003")!;
  const hairBeauty = AWARD_JUNIOR_SCALES.find((a) => a.code === "MA000005")!;

  // Verified verbatim from clause 17.2 Table 5. An LLM extraction returned 40%
  // here; the award text says 45%. That is why this assertion exists.
  assert.equal(retail.scale.find((s) => s.age === "Under 16")!.percentage, 0.45);
  assert.equal(fastFood.scale.find((s) => s.age === "Under 16")!.percentage, 0.4);
  assert.notEqual(
    retail.scale[0].percentage,
    fastFood.scale[0].percentage,
    "retail and fast food genuinely differ at under-16",
  );
  // Hair and Beauty reaches the adult rate at 18, the earliest of the three.
  assert.equal(hairBeauty.scale.find((s) => s.age === "18 and over")!.percentage, 1);
});

test("the pending junior-rates change is not presented as in force", () => {
  assert.equal(PENDING_JUNIOR_CHANGE.inForce, false);
});
