// /salary-to-hourly/ grid after the 10 Oct 2026 prune: multiples of $5,000
// only, independent of the take-home grid, every ranking page kept.

import assert from "node:assert/strict";
import { test } from "node:test";

import { SALARY_TO_HOURLY_SALARIES, nearestSalary, prevNext } from "../index";

// Pages with search impressions (GSC to Oct 2026) — must never be pruned.
const RANKING = [30_000, 60_000, 65_000, 70_000, 75_000, 80_000, 85_000, 90_000, 100_000];

test("salary-to-hourly keeps multiples of $5,000 only", () => {
  assert.equal(SALARY_TO_HOURLY_SALARIES.length, 38);
  for (const s of SALARY_TO_HOURLY_SALARIES) assert.equal(s % 5_000, 0, `${s}`);
  for (let s = 40_000; s <= 200_000; s += 5_000) assert.ok(SALARY_TO_HOURLY_SALARIES.includes(s), `${s} missing`);
  for (const s of RANKING) assert.ok(SALARY_TO_HOURLY_SALARIES.includes(s), `ranking page ${s} missing`);
  for (const s of [41_000, 72_000, 146_000, 148_000]) assert.ok(!SALARY_TO_HOURLY_SALARIES.includes(s), `${s} should redirect`);
});

test("removed salaries resolve to the nearest kept page (the redirect targets)", () => {
  assert.equal(nearestSalary("salary-to-hourly", 146_000), 145_000);
  assert.equal(nearestSalary("salary-to-hourly", 148_000), 150_000);
  assert.equal(nearestSalary("salary-to-hourly", 42_000), 40_000);
  assert.equal(nearestSalary("salary-to-hourly", 43_000), 45_000);
});

test("prev/next walk the $5k grid", () => {
  assert.deepEqual(prevNext("salary-to-hourly", 80_000), { prev: 75_000, next: 85_000 });
  assert.deepEqual(prevNext("salary-to-hourly", 200_000), { prev: 195_000, next: 250_000 });
  assert.deepEqual(prevNext("salary-to-hourly", 500_000), { prev: 400_000, next: null });
});
