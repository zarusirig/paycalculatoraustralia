import assert from "node:assert/strict";
import { test } from "node:test";

import { AWE_BY_INDUSTRY, EE_MEDIAN_BY_AGE, EE_MEDIAN_BY_INDUSTRY, annualise } from "../index";
import { absBenchmarks, benchmarksRoundingTo, groupBenchmarks, nearestBenchmarks } from "../abs-benchmarks";
import { TAX_ON_SALARIES } from "../../salary-pages/index";

test("every benchmark is a verified ABS weekly figure × 52", () => {
  const all = absBenchmarks();
  for (const x of all) assert.equal(x.annual, annualise(x.weekly), x.id);
  const mining = all.find((x) => x.id === "awe-ind-Mining");
  assert.equal(mining?.weekly, AWE_BY_INDUSTRY.find((r) => r.label === "Mining")?.weekly);
  assert.equal(all.filter((x) => x.id.startsWith("ee-ind-")).length, EE_MEDIAN_BY_INDUSTRY.length);
  assert.equal(all.filter((x) => x.id.startsWith("ee-age-")).length, EE_MEDIAN_BY_AGE.length);
  assert.equal(new Set(all.map((x) => x.id)).size, all.length);
  for (let i = 1; i < all.length; i++) assert.ok(all[i].annual >= all[i - 1].annual);
});

test("on the $5,000 tax-on grid each benchmark lands on exactly one built page", () => {
  const all = absBenchmarks();
  let placed = 0;
  for (const s of TAX_ON_SALARIES) placed += benchmarksRoundingTo(s).length;
  assert.equal(placed, all.length);
  // $85,000: full-time median for 25–34 year olds ($1,648 × 52 = $85,696) rounds here.
  assert.ok(benchmarksRoundingTo(85_000).some((x) => x.id === "ee-age-25–34"));
  assert.ok(!benchmarksRoundingTo(80_000).some((x) => x.id === "ee-age-25–34"));
});

test("same measure and value merge into one line", () => {
  const g = groupBenchmarks(benchmarksRoundingTo(80_000));
  const median78 = g.find((x) => x.annual === 78_000);
  assert.ok(median78 && median78.groups.length >= 4, "four industries share a $1,500 median");
});

test("nearest below and above", () => {
  const top = nearestBenchmarks(500_000);
  assert.equal(top.above, null);
  assert.equal(top.below?.id, "awe-ind-Mining");
  const n = nearestBenchmarks(160_000);
  assert.ok(n.below && n.below.annual < 160_000);
  assert.ok(n.above && n.above.annual > 160_000);
});
