// =============================================================================
// /tax-on/ prune (10 Oct 2026): the kept grid, the removed URLs, and the 301
// for every removed URL in firebase.json (to the nearest kept page, with and
// without the trailing slash).
// =============================================================================

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";

import {
  TAX_ON_REMOVED_SALARIES,
  TAX_ON_SALARIES,
  groupByBand,
  nearbySalaries,
  nearestSalary,
  prevNext,
} from "../index";

const ROOT = process.cwd();

/** Drop // and block comments outside strings (what cjson, the Firebase CLI's loader, accepts). */
function stripJsonComments(src: string): string {
  let out = "";
  let inString = false;
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (inString) {
      out += c;
      if (c === "\\") out += src[++i];
      else if (c === '"') inString = false;
    } else if (c === '"') {
      inString = true;
      out += c;
    } else if (c === "/" && src[i + 1] === "/") {
      while (i < src.length && src[i] !== "\n") i++;
      out += "\n";
    } else if (c === "/" && src[i + 1] === "*") {
      i = src.indexOf("*/", i + 2) + 1;
    } else {
      out += c;
    }
  }
  return out;
}

/** firebase.json as the Firebase CLI reads it. */
function firebaseRedirects(): { source?: string; regex?: string; destination: string; type: number }[] {
  const raw = fs.readFileSync(path.join(ROOT, "firebase.json"), "utf8");
  const cfg = JSON.parse(stripJsonComments(raw));
  const hosting = Array.isArray(cfg.hosting) ? cfg.hosting[0] : cfg.hosting;
  return hosting.redirects;
}

test("tax-on keeps $5,000 steps only: 50 pages from $20k to $500k", () => {
  assert.equal(TAX_ON_SALARIES.length, 50);
  for (const s of TAX_ON_SALARIES) assert.equal(s % 5_000, 0, `${s}`);
  for (let s = 20_000; s <= 200_000; s += 5_000) assert.ok(TAX_ON_SALARIES.includes(s), `${s}`);
  for (const s of [210_000, 250_000, 300_000, 350_000, 400_000, 500_000]) assert.ok(TAX_ON_SALARIES.includes(s), `${s}`);
  for (let i = 1; i < TAX_ON_SALARIES.length; i++) assert.ok(TAX_ON_SALARIES[i] > TAX_ON_SALARIES[i - 1]);
});

test("the removed list is exactly the old $1k steps, disjoint from the kept grid", () => {
  assert.equal(TAX_ON_REMOVED_SALARIES.length, 88);
  for (const s of TAX_ON_REMOVED_SALARIES) {
    assert.ok(!TAX_ON_SALARIES.includes(s), `${s} still kept`);
    assert.ok(s > 40_000 && s < 150_000 && s % 1_000 === 0, `${s}`);
  }
  for (let s = 40_000; s <= 150_000; s += 1_000) {
    assert.ok(TAX_ON_SALARIES.includes(s) !== TAX_ON_REMOVED_SALARIES.includes(s), `${s} must be kept xor removed`);
  }
});

test("nearest kept page: 146k -> 145k, 148k -> 150k, 41k -> 40k", () => {
  assert.equal(nearestSalary("tax-on", 146_000), 145_000);
  assert.equal(nearestSalary("tax-on", 148_000), 150_000);
  assert.equal(nearestSalary("tax-on", 41_000), 40_000);
  assert.equal(nearestSalary("tax-on", 43_000), 45_000);
});

test("every removed URL 301s to its nearest kept page, with and without the slash", () => {
  const bySource = new Map(firebaseRedirects().filter((r) => r.source).map((r) => [r.source!, r]));
  for (const s of TAX_ON_REMOVED_SALARIES) {
    const want = `/tax-on/${nearestSalary("tax-on", s)}/`;
    for (const src of [`/tax-on/${s}`, `/tax-on/${s}/`]) {
      const r = bySource.get(src);
      assert.ok(r, `no redirect for ${src}`);
      assert.equal(r.destination, want, src);
      assert.equal(r.type, 301, src);
    }
  }
});

test("no redirect points at, or away from, a kept tax-on page", () => {
  const kept = new Set(TAX_ON_SALARIES.map((s) => `/tax-on/${s}/`));
  for (const r of firebaseRedirects()) {
    if (r.source && kept.has(r.source.endsWith("/") ? r.source : `${r.source}/`)) {
      assert.fail(`kept page ${r.source} is redirected`);
    }
    const m = /^\/tax-on\/(\d+)\/$/.exec(r.destination);
    if (m) assert.ok(TAX_ON_SALARIES.includes(Number(m[1])), `redirect target ${r.destination} is not built`);
  }
});

test("hub bands, prev/next and nearby links stay inside the kept grid", () => {
  assert.deepEqual(groupByBand(TAX_ON_SALARIES).flatMap((g) => g.salaries), [...TAX_ON_SALARIES]);
  assert.deepEqual(prevNext("tax-on", 80_000), { prev: 75_000, next: 85_000 });
  assert.deepEqual(prevNext("tax-on", 200_000), { prev: 195_000, next: 210_000 });
  for (const s of TAX_ON_SALARIES) {
    for (const n of nearbySalaries("tax-on", s)) assert.ok(TAX_ON_SALARIES.includes(n), `${s} links ${n}`);
  }
});
