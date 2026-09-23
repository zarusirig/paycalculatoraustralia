// =============================================================================
// Payday Super — per-pay SG and due-date arithmetic
// Run with: npm test
// =============================================================================

import { test } from "node:test";
import assert from "node:assert/strict";

import { SUPER_GUARANTEE } from "../australian-tax";
import {
  addBusinessDays,
  earliestSgDueDate,
  parseIsoDate,
  perPaySuper,
} from "../payday-super";

const iso = (d: Date) => d.toISOString().slice(0, 10);

test("per-pay SG is 12% of each pay's qualifying earnings", () => {
  const f = perPaySuper(78_000, "fortnightly");
  assert.equal(f.qualifyingEarningsPerPay, 3_000);
  assert.equal(f.sgPerPay, 360);
  assert.equal(f.sgAnnual, 9_360);
  assert.equal(perPaySuper(52_000, "weekly").sgPerPay, 120);
  assert.equal(perPaySuper(120_000, "monthly").sgPerPay, 1_200);
});

test("annual SG is capped at the maximum contribution base", () => {
  const r = perPaySuper(400_000, "monthly");
  assert.equal(r.aboveMaxContributionBase, true);
  assert.equal(r.sgAnnual, SUPER_GUARANTEE.maxSGAnnual);
  assert.equal(perPaySuper(SUPER_GUARANTEE.maxContributionBaseAnnual, "weekly").aboveMaxContributionBase, false);
});

test("parseIsoDate rejects impossible dates", () => {
  assert.equal(parseIsoDate("2026-02-30"), null);
  assert.equal(parseIsoDate("26-2-1"), null);
  assert.equal(iso(parseIsoDate("2026-07-09")!), "2026-07-09");
});

test("business days skip weekends", () => {
  // Friday 3 July 2026 + 1 business day = Monday 6 July.
  assert.equal(iso(addBusinessDays(parseIsoDate("2026-07-03")!, 1)), "2026-07-06");
});

// The ATO's own worked examples (payment-deadlines-for-payday-super, updated
// 10 Aug 2026) each include one extra day for NT Picnic Day (Mon 3 Aug 2026).
// A weekends-only count must land exactly ONE business day earlier — which is
// the "earliest possible" contract the page states.
test("matches ATO examples minus the NT Picnic Day holiday", () => {
  // Example 1: QE day 1 = 9 July 2026, new employee, ATO due 7 August 2026.
  assert.equal(iso(earliestSgDueDate(parseIsoDate("2026-07-09")!, true)), "2026-08-06");
  // Example 1: QE day 2 = 30 July 2026, ATO due 11 August 2026.
  assert.equal(iso(earliestSgDueDate(parseIsoDate("2026-07-30")!)), "2026-08-10");
  // Example 2: new fund, QE day 7 Aug 2026 → ATO 4 Sep 2026 (no holiday in window).
  assert.equal(iso(earliestSgDueDate(parseIsoDate("2026-08-07")!, true)), "2026-09-04");
  // Example 2: 4 Sep 2026 → ATO 15 Sep 2026; no holiday in the window, so exact.
  assert.equal(iso(earliestSgDueDate(parseIsoDate("2026-09-04")!)), "2026-09-15");
});
