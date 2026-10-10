// =============================================================================
// Award rate index (lib/data/award-rate-index.ts): every entry is complete and
// traceable, every route it links exists, and the "nearest award minimums"
// lookup used by /hourly-to-salary/ and /salary-to-hourly/ behaves.
// =============================================================================

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

import {
  AWARD_RATE_INDEX,
  AWARD_RATE_MAX,
  AWARD_RATE_MIN,
  awardRatesNear,
  isoDate,
} from "../award-rate-index";
import { MODERN_AWARDS } from "../../constants/modern-awards";
import { HOSPITALITY_RATES, RETAIL_RATES } from "../../constants/hospitality-award";
import { SCHADS_SACS } from "../../constants/schads-award";
import { NMW } from "../../constants/minimum-wage";
import { OCCUPATIONS_BY_SLUG } from "../job-pay-rates";

const APP = path.join(process.cwd(), "app");

test("every entry has a rate, award code, effective date and source", () => {
  assert.ok(AWARD_RATE_INDEX.length > 300, `only ${AWARD_RATE_INDEX.length} entries`);
  for (const e of AWARD_RATE_INDEX) {
    const id = `${e.code} ${e.classification}`;
    assert.ok(Number.isFinite(e.hourly) && e.hourly > 0, `${id}: hourly`);
    assert.equal(Math.round(e.hourly * 100) / 100, e.hourly, `${id}: hourly not to the cent`);
    assert.ok(Number.isFinite(e.weekly) && e.weekly > 0, `${id}: weekly`);
    assert.match(e.code, /^MA\d{6}$/, `${id}: award code`);
    assert.ok(e.award.trim().length > 0 && e.awardTitle.trim().length > 0, `${id}: award name`);
    assert.ok(e.classification.trim().length > 0, `${id}: classification`);
    assert.match(e.effectiveFrom, /^\d{4}-\d{2}-\d{2}$/, `${id}: effective date`);
    assert.equal(isoDate(e.effectiveLabel), e.effectiveFrom, `${id}: date label`);
    assert.ok(e.effectiveFrom >= "2026-07-01", `${id}: older than the 2026 review`);
    assert.ok(e.source.label.trim().length > 0, `${id}: source label`);
    assert.match(e.source.url, /^https:\/\/awards\.fairwork\.gov\.au\/MA\d{6}\.html$/, `${id}: source url`);
    assert.ok(e.source.url.includes(e.code), `${id}: source is another award's text`);
    assert.equal(e.casualLoading, 0.25, `${id}: casual loading`);
  }
});

test("every award route in the index exists in app/", () => {
  const routes = new Set(AWARD_RATE_INDEX.map((e) => e.href));
  assert.ok(routes.size >= 30, `only ${routes.size} award routes`);
  for (const href of routes) {
    assert.ok(href !== null, "entry without a route");
    assert.match(href, /^\/[a-z0-9-]+\/$/, `${href}: route format`);
    const page = path.join(APP, ...href.split("/").filter(Boolean), "page.tsx");
    assert.ok(fs.existsSync(page), `${href} has no app/ page`);
  }
});

test("every linked occupation page exists and publishes that award rate", () => {
  const OCC = path.join(process.cwd(), "lib/data/job-pay-rates");
  assert.ok(fs.existsSync(path.join(APP, "job-pay-rates", "[occupation]", "page.tsx")));
  let linked = 0;
  for (const e of AWARD_RATE_INDEX) {
    if (e.jobs.length) linked++;
    for (const j of e.jobs) {
      assert.equal(j.href, `/job-pay-rates/${j.slug}/`);
      assert.ok(fs.existsSync(path.join(OCC, `${j.slug}.ts`)), `${j.href} has no occupation data`);
      const occ = OCCUPATIONS_BY_SLUG[j.slug as keyof typeof OCCUPATIONS_BY_SLUG];
      assert.equal(occ.award?.code, e.code, `${j.slug} is not on ${e.code}`);
      assert.ok(
        occ.tables.some((t) => !t.belowMinimumWage && t.rows.some((r) => r.hourly === e.hourly)),
        `${j.slug} does not publish ${e.hourly}`,
      );
    }
  }
  assert.ok(linked > 150, `only ${linked} entries link an occupation page`);
});

test("built from the constants: every award, adult rows only", () => {
  const codes = new Set(AWARD_RATE_INDEX.map((e) => e.code));
  for (const a of Object.values(MODERN_AWARDS)) assert.ok(codes.has(a.meta.code), `${a.meta.code} missing`);
  for (const c of ["MA000009", "MA000004", "MA000100"]) assert.ok(codes.has(c), `${c} missing`);
  // Spot checks against the constants (no figure typed in here).
  const find = (code: string, cls: string, stream: string | null = null) =>
    AWARD_RATE_INDEX.find((e) => e.code === code && e.classification === cls && e.stream === stream);
  assert.equal(find("MA000009", "Level 4")?.hourly, HOSPITALITY_RATES.find((r) => r.level === "Level 4")?.hourly);
  assert.equal(find("MA000004", "Level 1")?.hourly, RETAIL_RATES.find((r) => r.level === "Level 1")?.hourly);
  assert.equal(
    find("MA000100", "Level 2 pay point 1", "social and community services")?.hourly,
    SCHADS_SACS.find((r) => r.classification === "Level 2 pay point 1")?.hourly,
  );
  // Age-limited and pay-guide-only rows are out.
  assert.ok(!AWARD_RATE_INDEX.some((e) => /\bunder \d+\b/i.test(e.classification)));
  assert.ok(!AWARD_RATE_INDEX.some((e) => /^Managerial staff/.test(e.classification)));
  // No adult award minimum sits below the entry-level floor.
  assert.ok(AWARD_RATE_MIN.hourly < NMW.hourly && AWARD_RATE_MIN.hourly > 20);
  assert.ok(AWARD_RATE_MAX.hourly > 60);
});

test("Health Professionals rows take their own stream's date", () => {
  const hp = AWARD_RATE_INDEX.filter((e) => e.code === "MA000027");
  assert.ok(hp.length > 20);
  for (const e of hp) {
    const expected = e.classification.startsWith("Health Professional") ? "2026-10-01" : "2026-07-01";
    assert.equal(e.effectiveFrom, expected, e.classification);
  }
});

test("isoDate parses the constants' date format and rejects anything else", () => {
  assert.equal(isoDate("1 July 2026"), "2026-07-01");
  assert.equal(isoDate("1 October 2026"), "2026-10-01");
  assert.throws(() => isoDate("July 2026"));
  assert.throws(() => isoDate("1 Juli 2026"));
});

test("awardRatesNear: inside the band, 3 to 8 rows, one per award", () => {
  let inWindow = 0;
  for (let rate = 26; rate <= 70; rate += 1) {
    const r = awardRatesNear(rate);
    assert.equal(r.position, "inside");
    assert.ok(r.matches.length >= 3 && r.matches.length <= 8, `$${rate}: ${r.matches.length} rows`);
    const awards = r.matches.map((m) => `${m.code}|${m.stream ?? ""}`);
    assert.equal(new Set(awards).size, awards.length, `$${rate}: an award twice`);
    if (r.allInWindow) inWindow++;
    const sorted = [...r.matches].sort((a, b) => a.hourly - b.hourly);
    assert.deepEqual(r.matches, sorted, `$${rate}: not ascending`);
    for (const m of r.matches) {
      assert.equal(m.diff, Math.round((m.hourly - rate) * 100) / 100);
      assert.ok(m.classifications.length >= 1);
      if (r.allInWindow) assert.ok(Math.abs(m.diff) <= 0.75 + 1e-9, `$${rate}: ${m.hourly} outside window`);
    }
  }
  // The award band is dense from $26 to the mid-$40s: most rates find matches in the window.
  assert.ok(inWindow >= 25, `only ${inWindow} rates had matches within ±$0.75`);
});

test("awardRatesNear: a common rate does not crowd out the others", () => {
  // Ten awards start at the $25.74 entry level; $26 must still show $26.44 and up.
  const r = awardRatesNear(26);
  assert.ok(r.allInWindow);
  assert.ok(new Set(r.matches.map((m) => m.hourly)).size >= 4);
  assert.ok(r.matches.some((m) => m.hourly === NMW.hourly));
});

test("awardRatesNear: outside the band it says so and returns the nearest three", () => {
  const low = awardRatesNear(20);
  assert.equal(low.position, "below-all");
  assert.equal(low.allInWindow, false);
  assert.equal(low.matches.length, 3);
  assert.ok(low.matches.every((m) => m.hourly === AWARD_RATE_MIN.hourly));
  const high = awardRatesNear(100);
  assert.equal(high.position, "above-all");
  assert.equal(high.allInWindow, false);
  assert.equal(high.matches.length, 3);
  assert.ok(high.matches.some((m) => m.hourly === AWARD_RATE_MAX.hourly));
});

test("awardRatesNear: same-rate classifications in one award are merged", () => {
  // Pharmacy assistant level 1 and the 1st-year pharmacy student share $27.81.
  const r = awardRatesNear(27.81, { window: 0 });
  assert.ok(r.matches.every((m) => m.hourly === 27.81));
  const pharmacy = r.matches.find((m) => m.code === "MA000012");
  assert.ok(pharmacy, "Pharmacy missing at $27.81");
  assert.ok(pharmacy.classifications.length >= 2, pharmacy.classifications.join(", "));
});
