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

// --- G6: ATC "24 months" column ---
import { ATC_12_MONTH_COLUMN, ATC_24_MONTH_COLUMN, ATC_PAY as ATC_PAY_G6 } from "../air-traffic-controller";

test("G6: every ATC 24-month salary is the 12-month salary x 1.034, to the dollar", () => {
  const steps = ATC_PAY_G6.scales.find((s) => s.id === "atc-classification")?.steps ?? [];
  assert.ok(steps.length > 0);
  assert.equal(Object.keys(ATC_24_MONTH_COLUMN.salaries).length, steps.length);
  assert.equal(Object.keys(ATC_12_MONTH_COLUMN.salaries).length, steps.length);
  for (const s of steps) {
    const prev = ATC_12_MONTH_COLUMN.salaries[s.label];
    const next = ATC_24_MONTH_COLUMN.salaries[s.label];
    assert.ok(prev !== undefined && next !== undefined, s.label);
    assert.ok(Math.abs(prev * (1 + ATC_24_MONTH_COLUMN.increase) - next) <= 1, `${s.label}: ${prev} -> ${next}`);
  }
});

test("ATC page carries the 24-month column from 7 October 2026 (Attachment 1, re-read 9 October 2026)", () => {
  assert.equal(ATC_PAY_G6.ratesEffectiveFrom, "7 October 2026");
  assert.equal(ATC_PAY_G6.scheduledIncreases.length, 0);
  const atc = ATC_PAY_G6.scales.find((s) => s.id === "atc-classification")?.steps ?? [];
  for (const s of atc) assert.equal(s.salary, ATC_24_MONTH_COLUMN.salaries[s.label], s.label);
  const get = (id: string, label: string) =>
    ATC_PAY_G6.scales.find((s) => s.id === id)?.steps.find((st) => st.label === label)?.salary;
  // Published "24 months" figures from the agreement's ADT, SSO and FDC tables.
  assert.equal(get("fdc-classification", "FDC Trainee"), 91_854);
  assert.equal(get("fdc-classification", "FDC Supervisor"), 176_948);
  assert.equal(get("sso-classification", "Trainee"), 87_184);
  assert.equal(get("sso-classification", "Supervisor"), 155_919);
  assert.equal(get("adt-classification", "ADT Trainee"), 84_518);
  assert.equal(get("adt-classification", "ADT Supervisor"), 188_677);
});
// --- end G6 ---
