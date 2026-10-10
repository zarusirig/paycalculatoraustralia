import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

import {
  MEDIAN_SOURCE_NAME,
  MEDIAN_SOURCE_PERIOD,
  OCCUPATION_MEDIANS,
  OCCUPATION_MEDIAN_PAGE_COUNT,
  groupName,
  medianRank,
  occupationsNear,
} from "../index";
import { calculatePayBreakdown } from "../../../constants/australian-tax";
import { OCCUPATIONS, OCCUPATION_SLUGS } from "../../job-pay-rates";
import { HEALTH_SALARY_PAGES, HEALTH_SALARY_SLUGS } from "../../health-salary";

/** The route file that builds /job-pay-rates/<slug>/, or null when there is none. */
function routeFileFor(href: string): string | null {
  const m = href.match(/^\/job-pay-rates\/([a-z0-9-]+)\/$/);
  if (!m) return null;
  const slug = m[1];
  const app = join(process.cwd(), "app", "job-pay-rates");
  if ((HEALTH_SALARY_SLUGS as readonly string[]).includes(slug)) {
    const file = join(app, slug, "page.tsx");
    return existsSync(file) ? file : null;
  }
  if ((OCCUPATION_SLUGS as readonly string[]).includes(slug)) {
    const file = join(app, "[occupation]", "page.tsx");
    return existsSync(file) ? file : null;
  }
  return null;
}

test("every entry has a figure, a source and at least one page", () => {
  assert.ok(OCCUPATION_MEDIANS.length >= 50, `only ${OCCUPATION_MEDIANS.length} groups`);
  for (const o of OCCUPATION_MEDIANS) {
    assert.ok(Number.isInteger(o.medianWeekly) && o.medianWeekly > 0, `${o.anzscoCode} weekly`);
    assert.equal(o.annual, o.medianWeekly * 52, `${o.anzscoCode} annual`);
    assert.equal(o.sourceName, MEDIAN_SOURCE_NAME);
    assert.equal(o.sourcePeriod, MEDIAN_SOURCE_PERIOD);
    assert.match(o.sourceUrl, /^https:\/\/www\.jobsandskills\.gov\.au\/data\/occupation-and-industry-profiles\/occupations-anzsco\/\d{4}-/);
    assert.ok(o.sourceUrl.includes(`/${o.anzscoCode}-`), `${o.anzscoCode} source URL is another group's profile`);
    assert.match(o.anzscoCode, /^\d{4}$/);
    assert.ok(o.anzscoTitle.length > 3);
    assert.ok(o.pages.length > 0, `${o.anzscoCode} has no page`);
  }
});

test("every page in the index is an existing route", () => {
  for (const o of OCCUPATION_MEDIANS) {
    for (const p of o.pages) {
      assert.ok(p.name.length > 1);
      assert.ok(routeFileFor(p.href), `${o.anzscoCode}: ${p.href} has no route`);
    }
  }
});

test("one entry per ANZSCO group, and it is the median the occupation pages publish", () => {
  const codes = OCCUPATION_MEDIANS.map((o) => o.anzscoCode);
  assert.equal(new Set(codes).size, codes.length);
  const expected = [
    ...OCCUPATIONS.filter((o) => o.median).map((o) => ({ href: `/job-pay-rates/${o.slug}/`, weekly: o.median!.medianWeekly })),
    ...HEALTH_SALARY_PAGES.filter((p) => p.jsa).map((p) => ({ href: `/job-pay-rates/${p.slug}/`, weekly: p.jsa!.medianWeekly })),
  ];
  assert.equal(OCCUPATION_MEDIAN_PAGE_COUNT, expected.length);
  for (const e of expected) {
    const entry = OCCUPATION_MEDIANS.find((o) => o.pages.some((p) => p.href === e.href));
    assert.ok(entry, `${e.href} missing`);
    assert.equal(entry.medianWeekly, e.weekly, e.href);
  }
});

test("occupationsNear: 3 to 6 groups, nearest first, take-home from the engine", () => {
  for (const salary of [20_000, 45_000, 85_000, 100_000, 150_000, 300_000, 500_000]) {
    const near = occupationsNear(salary);
    assert.ok(near.length >= 3 && near.length <= 6, `${salary}: ${near.length}`);
    for (let i = 1; i < near.length; i++) {
      assert.ok(Math.abs(near[i].diff) >= Math.abs(near[i - 1].diff), `${salary} not sorted`);
    }
    for (const o of near) {
      assert.equal(o.diff, o.annual - salary);
      assert.equal(o.fortnightlyTakeHome, calculatePayBreakdown({ grossSalary: o.annual }).fortnightly);
    }
  }
  // $100k sits in the middle of the index: a full six groups within 10%.
  assert.equal(occupationsNear(100_000).length, 6);
  // Nothing in the index is near $20k, so only the three lowest medians show.
  assert.deepEqual(
    occupationsNear(20_000).map((o) => o.anzscoCode),
    OCCUPATION_MEDIANS.slice(0, 3).map((o) => o.anzscoCode),
  );
});

test("medianRank counts groups either side of a salary", () => {
  const r = medianRank(100_000);
  assert.equal(r.total, OCCUPATION_MEDIANS.length);
  assert.ok(r.below > 0 && r.above > 0);
  assert.ok(r.below + r.above <= r.total);
  assert.equal(medianRank(1).below, 0);
  assert.equal(medianRank(10_000_000).above, 0);
});

test("groupName lower-cases ANZSCO titles but keeps acronyms", () => {
  assert.equal(groupName("ICT Business and Systems Analysts"), "ICT business and systems analysts");
  assert.equal(groupName("Motor Mechanics"), "motor mechanics");
});
