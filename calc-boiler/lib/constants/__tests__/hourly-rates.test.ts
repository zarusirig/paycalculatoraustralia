// =============================================================================
// Hourly-rate page inventory tests.
//
// Run with: npm test
//
// The list drives generateStaticParams for /hourly-to-salary/[rate]/, the
// sitemap, the site directory and the hub's link table, so it has to be one
// list in one place. These tests pin the three things GSC showed people
// actually search: every whole dollar from $20 to $100, the half-dollars in
// the award band, and the exact cent-level award/NMW rates ($26.44, $29.45).
// =============================================================================

import { test } from "node:test";
import assert from "node:assert/strict";

import { EMPLOYMENT, SUPER_GUARANTEE, calculatePayBreakdown } from "../australian-tax";
import {
  HOURLY_RATE_MAX,
  HOURLY_RATE_MIN,
  HOURLY_RATE_PAGES,
  hourlyRateFromSlug,
  hourlyRateSlug,
  notesForRate,
  // G5
  casualAfterTax,
  hourlyAfterTax,
  prevNextRate,
} from "../hourly-rates";

test("rates are unique, ascending and inside the published band", () => {
  const sorted = [...HOURLY_RATE_PAGES].sort((a, b) => a - b);
  assert.deepEqual(HOURLY_RATE_PAGES, sorted);
  assert.equal(new Set(HOURLY_RATE_PAGES).size, HOURLY_RATE_PAGES.length);
  for (const r of HOURLY_RATE_PAGES) {
    assert.ok(Number.isFinite(r), `${r} is not a number`);
    assert.ok(r >= HOURLY_RATE_MIN && r <= HOURLY_RATE_MAX, `${r} outside band`);
  }
});

test("every whole dollar from the floor to the ceiling has a page", () => {
  for (let r = HOURLY_RATE_MIN; r <= HOURLY_RATE_MAX; r += 1) {
    assert.ok(HOURLY_RATE_PAGES.includes(r), `$${r} missing`);
  }
});

test("half-dollar rates exist across the award band", () => {
  for (const r of [20.5, 34.5, 36.5, 37.5, 49.5]) {
    assert.ok(HOURLY_RATE_PAGES.includes(r), `$${r} missing`);
  }
});

test("the national minimum wage and its casual rate are pages, with notes", () => {
  const nmw = EMPLOYMENT.minimumWageHourly;
  assert.ok(HOURLY_RATE_PAGES.includes(nmw));
  assert.ok(notesForRate(nmw).some((n) => /minimum wage/i.test(n.classification)));
  const casual = Math.round(nmw * 1.25 * 100) / 100;
  assert.ok(HOURLY_RATE_PAGES.includes(casual), `casual NMW ${casual} missing`);
});

test("award hourly rates from the verified constants are pages, with notes", () => {
  // Hospitality Level 4, Retail Level 4, SCHADS L1 pp3 and Home Care L3 pp1 all pay $29.45.
  assert.ok(HOURLY_RATE_PAGES.includes(29.45));
  const notes = notesForRate(29.45);
  assert.ok(notes.length >= 3, `expected several awards at $29.45, got ${notes.length}`);
  assert.ok(notes.some((n) => n.code === "MA000009"));
  assert.ok(notes.some((n) => n.code === "MA000004"));
  assert.ok(notes.some((n) => n.code === "MA000100"));
  // A rate with no award attached has no notes.
  assert.deepEqual(notesForRate(100), []);
});

test("slugs round-trip and never contain a dot (Next drops the trailing slash on dotted segments)", () => {
  for (const r of HOURLY_RATE_PAGES) {
    const slug = hourlyRateSlug(r);
    assert.equal(hourlyRateFromSlug(slug), r);
    assert.ok(!slug.includes("."), `slug ${slug} contains a dot`);
    assert.ok(!slug.startsWith("$"));
  }
  assert.equal(hourlyRateSlug(37.5), "37-5");
  assert.equal(hourlyRateSlug(26.44), "26-44");
  assert.equal(hourlyRateSlug(30), "30");
  assert.equal(hourlyRateFromSlug("26-44"), 26.44);
  assert.ok(Number.isNaN(hourlyRateFromSlug("26.44")));
  assert.ok(Number.isNaN(hourlyRateFromSlug("abc")));
});

// --- G5: after-tax figures ---------------------------------------------------

test("G5: hourlyAfterTax reconciles gross = tax + Medicare + take-home", () => {
  for (const rate of [20, 26.44, 30, 35, 45.5, 80, 100]) {
    for (const hours of [20, 25, 38]) {
      const f = hourlyAfterTax(rate, hours);
      assert.ok(Math.abs(f.grossAnnual - rate * hours * EMPLOYMENT.weeksPerYear) < 0.01);
      assert.ok(Math.abs(f.grossAnnual - f.incomeTax - f.medicareLevy - f.takeHomeAnnual) < 1, `${rate}@${hours}`);
      // <=, not <: $20 x 20 hours ($20,800) is under the LITO-effective tax-free threshold.
      assert.ok(f.perHour <= rate && f.perHour > 0);
      assert.ok(Math.abs(f.perWeek * 52 - f.takeHomeAnnual) < 1);
    }
  }
});

test("G5: $35 an hour at 38 hours matches the engine on $69,160", () => {
  const f = hourlyAfterTax(35);
  assert.equal(f.grossAnnual, 69_160);
  const b = calculatePayBreakdown({ grossSalary: 69_160 });
  assert.equal(f.takeHomeAnnual, b.takeHomePay);
  assert.equal(f.employerSuper, b.superContribution);
});

test("G5: casual rate adds the 25% loading before tax", () => {
  const c = casualAfterTax(30);
  assert.equal(c.rate, 37.5);
  assert.ok(c.perWeek > hourlyAfterTax(30).perWeek);
});

test("G5: employer super is capped at the maximum contribution base", () => {
  // $100 an hour x 38 x 52 = $197,600, under the base; at 60 hours it is over.
  const over = hourlyAfterTax(100, 60);
  assert.ok(over.grossAnnual > SUPER_GUARANTEE.maxContributionBaseAnnual);
  assert.equal(over.employerSuper, Math.round(SUPER_GUARANTEE.maxSGAnnual));
});

test("G5: prevNextRate walks the page list and stops at the ends", () => {
  assert.deepEqual(prevNextRate(HOURLY_RATE_MIN).prev, null);
  assert.deepEqual(prevNextRate(HOURLY_RATE_MAX).next, null);
  const { prev, next } = prevNextRate(30);
  assert.ok(prev !== null && next !== null && prev < 30 && next > 30);
  assert.ok(HOURLY_RATE_PAGES.includes(prev) && HOURLY_RATE_PAGES.includes(next));
  assert.deepEqual(prevNextRate(19.99), { prev: null, next: null });
});
