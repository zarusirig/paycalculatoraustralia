import assert from "node:assert/strict";
import { test } from "node:test";

import { EE_PERCENTILES_ALL, EE_RELEASE, annualise } from "../index";
import { ordinal, placeAmongAllEmployees } from "../all-employee-percentile";

test("source figures are the published ABS Employee Earnings Aug 2025 percentiles", () => {
  assert.equal(EE_RELEASE.referencePeriod, "August 2025");
  assert.ok(EE_RELEASE.url.startsWith("https://www.abs.gov.au/"));
  assert.deepEqual(
    EE_PERCENTILES_ALL.map((p) => [p.percentile, p.weekly]),
    [
      [10, 450],
      [25, 900],
      [50, 1425],
      [75, 2127],
      [90, 3000],
    ],
  );
});

test("a salary on a published point returns that percentile", () => {
  for (const p of EE_PERCENTILES_ALL) {
    const r = placeAmongAllEmployees(annualise(p.weekly));
    assert.equal(r.kind, "between");
    assert.equal(r.estimate, p.percentile);
  }
});

test("between points: straight-line estimate, with the bracketing points", () => {
  // $80,000 = $1,538.46 a week: 50 + (113.46 / 702) × 25 = 54.04 -> 54th.
  const r = placeAmongAllEmployees(80_000);
  assert.equal(r.kind, "between");
  assert.equal(r.estimate, 54);
  assert.deepEqual(r.lower, { percentile: 50, weekly: 1425 });
  assert.deepEqual(r.upper, { percentile: 75, weekly: 2127 });
});

test("outside the published range no number is given", () => {
  const low = placeAmongAllEmployees(20_000);
  assert.equal(low.kind, "below-lowest");
  assert.equal(low.estimate, null);
  const high = placeAmongAllEmployees(160_000);
  assert.equal(high.kind, "above-highest");
  assert.equal(high.estimate, null);
  assert.equal(high.lower?.percentile, 90);
});

test("estimates never fall as salary rises", () => {
  let prev = 0;
  for (let s = 24_000; s <= 156_000; s += 1_000) {
    const e = placeAmongAllEmployees(s).estimate;
    assert.ok(e !== null && e >= prev, `${s}`);
    prev = e;
  }
});

test("ordinals", () => {
  assert.deepEqual([1, 2, 3, 4, 11, 12, 13, 21, 52, 73, 90].map(ordinal), [
    "1st", "2nd", "3rd", "4th", "11th", "12th", "13th", "21st", "52nd", "73rd", "90th",
  ]);
  assert.throws(() => placeAmongAllEmployees(-1));
});
