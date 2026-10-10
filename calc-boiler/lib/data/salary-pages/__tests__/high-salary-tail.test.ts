// =============================================================================
// High-salary prune (10 Oct 2026): above $200,000 only $250k, $300k, $400k and
// $500k keep a page in /tax-on/, /take-home-pay-on/ and /salary-to-hourly/.
// Every removed URL 301s in firebase.json to the nearest kept page (ties go to
// the lower one), with and without the trailing slash, and no redirect anywhere
// in the file lands on a removed page.
// =============================================================================

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";

import {
  HIGH_SALARY_REMOVED,
  HIGH_SALARY_TAIL,
  hubHref,
  nearestSalary,
  salaryList,
  type SalaryFamily,
} from "../index";

const FAMILIES: readonly SalaryFamily[] = ["tax-on", "take-home", "salary-to-hourly"];

/** firebase.json as the Firebase CLI reads it: whole-line // comments dropped. */
function firebaseRedirects(): { source?: string; regex?: string; destination: string; type: number }[] {
  const raw = fs.readFileSync(path.join(process.cwd(), "firebase.json"), "utf8");
  const json = raw
    .split("\n")
    .filter((line) => !/^\s*\/\//.test(line))
    .join("\n");
  return JSON.parse(json).hosting.redirects;
}

test("the tail is $250k, $300k, $400k and $500k; the removed list is the old tail minus those", () => {
  assert.deepEqual([...HIGH_SALARY_TAIL], [250_000, 300_000, 400_000, 500_000]);
  assert.deepEqual(
    [...HIGH_SALARY_REMOVED],
    [210_000, 220_000, 230_000, 240_000, 260_000, 270_000, 280_000, 290_000, 350_000],
  );
});

test("each family keeps the tail, drops the removed salaries, and is unchanged at $200k and below", () => {
  const atOrBelow200k: Record<SalaryFamily, number> = { "tax-on": 37, "take-home": 37, "salary-to-hourly": 34 };
  for (const fam of FAMILIES) {
    const list = salaryList(fam);
    assert.deepEqual(list.filter((s) => s > 200_000), [...HIGH_SALARY_TAIL], fam);
    for (const s of HIGH_SALARY_REMOVED) assert.ok(!list.includes(s), `${fam} ${s} still built`);
    assert.equal(list.filter((s) => s <= 200_000).length, atOrBelow200k[fam], fam);
    assert.ok(list.includes(200_000), fam);
  }
});

test("nearest kept page: ties go to the lower salary", () => {
  const want: Record<number, number> = {
    210_000: 200_000,
    220_000: 200_000,
    230_000: 250_000,
    240_000: 250_000,
    260_000: 250_000,
    270_000: 250_000,
    280_000: 300_000,
    290_000: 300_000,
    350_000: 300_000,
  };
  for (const fam of FAMILIES) {
    for (const s of HIGH_SALARY_REMOVED) assert.equal(nearestSalary(fam, s), want[s], `${fam} ${s}`);
  }
});

test("every removed URL 301s to its nearest kept page, with and without the slash", () => {
  const bySource = new Map(firebaseRedirects().filter((r) => r.source).map((r) => [r.source!, r]));
  for (const fam of FAMILIES) {
    const base = hubHref(fam);
    for (const s of HIGH_SALARY_REMOVED) {
      const want = `${base}${nearestSalary(fam, s)}/`;
      for (const src of [`${base}${s}`, `${base}${s}/`]) {
        const r = bySource.get(src);
        assert.ok(r, `no redirect for ${src}`);
        assert.equal(r.destination, want, src);
        assert.equal(r.type, 301, src);
      }
    }
  }
});

test("no redirect lands on a removed page (no chains), and no kept page is redirected away", () => {
  const redirects = firebaseRedirects();
  for (const fam of FAMILIES) {
    const base = hubHref(fam);
    const removed = new Set(HIGH_SALARY_REMOVED.map((s) => `${base}${s}/`));
    const kept = new Set(salaryList(fam).map((s) => `${base}${s}/`));
    for (const r of redirects) {
      const dest = r.destination.endsWith("/") ? r.destination : `${r.destination}/`;
      assert.ok(!removed.has(dest), `${r.source ?? r.regex} -> ${r.destination} lands on a removed page`);
      if (r.source) assert.ok(!kept.has(r.source.endsWith("/") ? r.source : `${r.source}/`), `kept page ${r.source} is redirected`);
    }
  }
});
