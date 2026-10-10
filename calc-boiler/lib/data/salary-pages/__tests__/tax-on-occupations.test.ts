import assert from "node:assert/strict";
import { test } from "node:test";

import { OCCUPATIONS, OCCUPATION_SLUGS } from "../../job-pay-rates/index";
import { TAX_ON_SALARIES } from "../index";
import { EMPLOYMENT } from "../../../constants/australian-tax";
import {
  awardMinimums,
  awardMinimumsRoundingTo,
  nearestOccupationMedians,
  occupationMedians,
  occupationMediansRoundingTo,
} from "../tax-on-occupations";

test("every occupation median is the job page's verified weekly figure × 52", () => {
  const all = occupationMedians();
  assert.equal(all.length, OCCUPATIONS.filter((o) => o.median !== null).length);
  for (const m of all) {
    const occ = OCCUPATIONS.find((o) => o.slug === m.slug)!;
    assert.equal(m.weekly, occ.median!.medianWeekly);
    assert.equal(m.annual, Math.round(m.weekly * 52));
    assert.ok((OCCUPATION_SLUGS as readonly string[]).includes(m.slug));
    assert.equal(m.href, `/job-pay-rates/${m.slug}/`);
    assert.ok(m.url.startsWith("https://www.jobsandskills.gov.au/"), m.url);
  }
});

test("on the $5,000 tax-on grid each occupation lands on exactly one built page", () => {
  let placed = 0;
  for (const s of TAX_ON_SALARIES) placed += occupationMediansRoundingTo(s).length;
  assert.equal(placed, occupationMedians().length);
});

test("nearest below and above bracket the salary", () => {
  const all = occupationMedians();
  const mid = all[Math.floor(all.length / 2)].annual + 1;
  const n = nearestOccupationMedians(mid);
  assert.ok(n.below && n.below.annual < mid);
  assert.ok(n.above && n.above.annual > mid);
  assert.equal(nearestOccupationMedians(1_000_000).above, null);
});

test("award minimums: adult full-time rows from the job pages, one per award per page", () => {
  const all = awardMinimums();
  assert.ok(all.length > 0);
  assert.equal(new Set(all.map((a) => a.id)).size, all.length);
  for (const a of all) {
    // Adult full-time rows only: nothing below the full-time National Minimum Wage.
    assert.ok(a.annual >= Math.floor(EMPLOYMENT.minimumWageWeekly * 52), `${a.id} ${a.annual}`);
    assert.ok(a.href.startsWith("/") && a.href.endsWith("/"), a.href);
  }
  for (const s of [50_000, 60_000, 70_000]) {
    const picks = awardMinimumsRoundingTo(s);
    assert.ok(picks.length <= 6);
    assert.equal(new Set(picks.map((p) => p.awardCode)).size, picks.length);
    for (const p of picks) assert.equal(Math.round(p.annual / 5_000) * 5_000, s);
  }
});
