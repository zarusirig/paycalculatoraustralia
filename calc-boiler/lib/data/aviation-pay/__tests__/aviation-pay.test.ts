import assert from "node:assert/strict";
import { test } from "node:test";

import { AVIATION_PATHS, AVIATION_PAY, aviationEntrySalary, aviationTopSalary } from "../index";
import { nearestTakeHome, toIsoDate } from "../../service-pay";
import { TAKE_HOME_SALARIES } from "../../salary-pages";

const PAGES = Object.values(AVIATION_PAY);

test("both aviation pages are registered with trailing-slashed paths", () => {
  assert.equal(AVIATION_PAY["air-traffic-controller"].slug, "air-traffic-controller");
  assert.equal(AVIATION_PAY.pilot.slug, "pilot");
  for (const path of Object.values(AVIATION_PATHS)) assert.match(path, /^\/[a-z-]+\/$/);
});

test("each page is dated and sourced", () => {
  for (const page of PAGES) {
    assert.ok(toIsoDate(page.verifiedOn), `${page.slug} verifiedOn`);
    assert.match(page.instrument.url, /^https:\/\//);
    assert.ok(page.sources.length > 0);
    for (const s of page.sources) assert.match(s.url, /^https:\/\//);
  }
});

test("tables are well formed, whole-dollar and plausible", () => {
  for (const page of PAGES) {
    const ids = new Set<string>();
    for (const scale of page.scales) {
      assert.match(scale.id, /^[a-z0-9-]+$/);
      assert.ok(!ids.has(scale.id), `${page.slug} duplicate scale ${scale.id}`);
      ids.add(scale.id);
      const labels = new Set<string>();
      for (const step of scale.steps) {
        assert.ok(!labels.has(step.label), `${page.slug} ${scale.id} duplicate ${step.label}`);
        labels.add(step.label);
        assert.ok(Number.isInteger(step.salary), `${page.slug} ${step.label}`);
        assert.ok(step.salary >= 30_000 && step.salary <= 400_000, `${page.slug} ${step.label} ${step.salary}`);
        assert.ok(new Set(TAKE_HOME_SALARIES).has(nearestTakeHome(step.salary)));
      }
    }
    if (page.scales.length > 0) {
      const labels = page.scales[0].steps.map((s) => s.label);
      if (page.entryStep) assert.ok(labels.includes(page.entryStep), `${page.slug} entryStep`);
      if (page.topStep) assert.ok(labels.includes(page.topStep), `${page.slug} topStep`);
      assert.ok(aviationEntrySalary(page)! <= aviationTopSalary(page)!);
    }
  }
});

test("every dollar figure in an FAQ answer appears in the page's own data", () => {
  for (const page of PAGES) {
    const salaries = new Set(page.scales.flatMap((s) => s.steps.map((st) => st.salary)));
    const prose = [
      ...page.traineePay,
      ...page.allowances,
      ...page.notices,
      ...page.scheduledIncreases.map((i) => i.detail),
      ...page.otherInstruments.map((o) => o.summary),
      ...page.scales.flatMap((s) => s.steps.map((st) => st.note ?? "")),
    ].join(" ");
    for (const faq of page.faqs) {
      for (const m of faq.a.matchAll(/\$(\d{1,3}(?:,\d{3})*(?:\.\d+)?)/g)) {
        const value = Number(m[1].replace(/,/g, ""));
        assert.ok(
          salaries.has(value) || prose.includes(m[0]) || prose.includes(m[1]),
          `${page.slug} FAQ "${faq.q}" quotes ${m[0]}, not in the tables or notes`,
        );
      }
    }
  }
});
