import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

import {
  HIGH_SALARY_TAIL,
  SALARY_GRID,
  SALARY_TO_HOURLY_SALARIES,
  TAKE_HOME_SALARIES,
  TAX_ON_SALARIES,
  groupByBand,
  nearbySalaries,
  nearestSalary,
  neighbourRows,
  prevNext,
  salaryFacts,
} from "../index";
import { MEDICARE_LEVY, SUPER_GUARANTEE, calculatePayBreakdown } from "../../../constants/australian-tax";

const LEGACY_FIVE_K = Array.from({ length: 35 }, (_, i) => 30_000 + i * 5_000);
const LEGACY_HOURLY = [
  30000, 40000, 45000, 50000, 55000, 60000, 65000, 70000, 75000, 80000, 85000, 90000, 95000, 100000, 110000,
  120000, 130000, 140000, 150000, 200000,
];

function assertAscending(list: readonly number[]) {
  for (let i = 1; i < list.length; i++) assert.ok(list[i] > list[i - 1], `not ascending at ${list[i]}`);
}

test("grids are ascending with no duplicates", () => {
  assertAscending(TAKE_HOME_SALARIES);
  assertAscending(TAX_ON_SALARIES);
  assertAscending(SALARY_TO_HOURLY_SALARIES);
});

test("every pre-existing URL is still generated", () => {
  for (const s of LEGACY_FIVE_K) {
    assert.ok(TAKE_HOME_SALARIES.includes(s), `take-home ${s}`);
    assert.ok(TAX_ON_SALARIES.includes(s), `tax-on ${s}`);
  }
  for (const s of LEGACY_HOURLY) assert.ok(SALARY_TO_HOURLY_SALARIES.includes(s), `salary-to-hourly ${s}`);
});

test("grid shape: $1k steps 40k-150k, 5k to 200k, tail to 500k", () => {
  for (let s = 40_000; s <= 150_000; s += 1_000) assert.ok(SALARY_GRID.includes(s), `${s}`);
  for (const s of [20_000, 25_000, 210_000, 250_000, 300_000, 350_000, 400_000, 500_000]) {
    assert.ok(SALARY_GRID.includes(s), `${s}`);
    assert.ok(TAKE_HOME_SALARIES.includes(s), `${s}`);
  }
  assert.ok(!SALARY_GRID.includes(151_000));
  assert.equal(SALARY_GRID.length, 4 + 111 + 10 + HIGH_SALARY_TAIL.length);
  assert.equal(SALARY_GRID[SALARY_GRID.length - 1], 500_000);
  assert.deepEqual(TAX_ON_SALARIES, SALARY_GRID);
  assert.ok(SALARY_TO_HOURLY_SALARIES.includes(75_000));
  assert.ok(!SALARY_TO_HOURLY_SALARIES.includes(72_000));
  assert.ok(!SALARY_TO_HOURLY_SALARIES.includes(25_000));
});

test("take-home keeps only the multiples of $5,000 (Oct 2026 prune)", () => {
  assert.deepEqual(TAKE_HOME_SALARIES, SALARY_GRID.filter((s) => s % 5_000 === 0));
  assert.equal(TAKE_HOME_SALARIES.length, 50);
  for (const s of [85_000, 90_000, 95_000, 100_000, 110_000, 120_000, 130_000, 150_000, 200_000]) {
    assert.ok(TAKE_HOME_SALARIES.includes(s), `${s}`);
  }
  assert.ok(!TAKE_HOME_SALARIES.includes(72_000));
  assert.ok(!TAKE_HOME_SALARIES.includes(149_000));
});

/** firebase.json allows // comments (Firebase CLI reads it with cjson); drop them before JSON.parse. */
function hostingRedirects(): { source?: string; regex?: string; destination: string; type: number }[] {
  const raw = readFileSync(join(process.cwd(), "firebase.json"), "utf8");
  const json = raw
    .split("\n")
    .filter((line) => !/^\s*\/\//.test(line))
    .join("\n");
  return JSON.parse(json).hosting.redirects;
}

test("every removed take-home URL 301s to the nearest kept page, with and without the slash", () => {
  const redirects = hostingRedirects();
  const bySource = new Map(redirects.filter((r) => r.source).map((r) => [r.source as string, r]));
  const removed = SALARY_GRID.filter((s) => !TAKE_HOME_SALARIES.includes(s));
  assert.equal(removed.length, 88);
  for (const s of removed) {
    const target = `/take-home-pay-on/${nearestSalary("take-home", s)}/`;
    for (const src of [`/take-home-pay-on/${s}`, `/take-home-pay-on/${s}/`]) {
      const r = bySource.get(src);
      assert.ok(r, `no redirect for ${src}`);
      assert.equal(r.destination, target, src);
      assert.equal(r.type, 301, src);
    }
  }
  assert.equal(bySource.get("/take-home-pay-on/146000/")?.destination, "/take-home-pay-on/145000/");
  assert.equal(bySource.get("/take-home-pay-on/148000/")?.destination, "/take-home-pay-on/150000/");
  // No kept page is redirected away.
  for (const s of TAKE_HOME_SALARIES) {
    assert.ok(!bySource.has(`/take-home-pay-on/${s}/`), `${s} is kept but redirected`);
    assert.ok(!bySource.has(`/take-home-pay-on/${s}`), `${s} is kept but redirected`);
  }
});

test("hub bands cover every salary exactly once", () => {
  for (const list of [TAKE_HOME_SALARIES, SALARY_TO_HOURLY_SALARIES]) {
    const grouped = groupByBand(list).flatMap((g) => g.salaries);
    assert.deepEqual(grouped, [...list]);
  }
});

test("prev/next and nearby links stay inside the grid", () => {
  assert.deepEqual(prevNext("take-home", 70_000), { prev: 65_000, next: 75_000 });
  assert.deepEqual(prevNext("take-home", 72_000), { prev: null, next: null });
  assert.deepEqual(prevNext("take-home", 20_000), { prev: null, next: 25_000 });
  assert.deepEqual(prevNext("take-home", 500_000), { prev: 400_000, next: null });
  assert.deepEqual(prevNext("salary-to-hourly", 30_000), { prev: null, next: 40_000 });
  const near = nearbySalaries("tax-on", 150_000);
  assert.ok(!near.includes(150_000));
  for (const s of near) assert.ok(TAX_ON_SALARIES.includes(s));
  assert.equal(nearestSalary("take-home", 72_400), 70_000);
  assert.equal(nearestSalary("tax-on", 72_400), 72_000);
  assert.equal(nearestSalary("take-home", 237_000), 240_000);
});

test("$100,000 headline matches the tax engine (no HECS)", () => {
  const f = salaryFacts(100_000);
  assert.equal(f.breakdown.takeHomePay, calculatePayBreakdown({ grossSalary: 100_000 }).takeHomePay);
  assert.ok(f.withHecs.takeHomePay < f.breakdown.takeHomePay);
});

test("next $1,000 is kept at the combined marginal rate inside a bracket", () => {
  // $100k: 30% bracket + 2% Medicare, no LITO -> keep $680.
  assert.equal(salaryFacts(100_000).nextThousand.takeHome, 680);
  // $20k: under LITO's effective tax-free threshold and the Medicare threshold -> keep it all.
  assert.equal(salaryFacts(20_000).nextThousand.takeHome, 1_000);
});

test("super is capped at the maximum contribution base", () => {
  const mid = salaryFacts(250_000);
  assert.equal(mid.superCapped, false);
  assert.equal(mid.employerSuper, Math.round(250_000 * SUPER_GUARANTEE.rate));
  const high = salaryFacts(400_000);
  assert.equal(high.superCapped, true);
  assert.equal(high.employerSuper, Math.round(SUPER_GUARANTEE.maxSGAnnual));
  assert.ok(high.division293 > 0);
  assert.equal(salaryFacts(150_000).division293, 0);
});

test("MLS tier follows the current surcharge table", () => {
  assert.equal(salaryFacts(MEDICARE_LEVY.surcharge.tier1.min - 1).mls.tier, 0);
  assert.equal(salaryFacts(110_000).mls.tier, 1);
  assert.equal(salaryFacts(200_000).mls.tier, 3);
});

test("neighbour rows drop non-positive salaries", () => {
  const rows = neighbourRows(20_000, [-20_000, -5_000, 0, 5_000]);
  assert.deepEqual(rows.map((r) => r.salary), [15_000, 20_000, 25_000]);
  assert.equal(rows.find((r) => r.offset === 0)?.diff, 0);
});
