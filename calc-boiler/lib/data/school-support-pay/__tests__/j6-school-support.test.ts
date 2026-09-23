import { strict as assert } from "node:assert";
import test from "node:test";

import {
  SCHOOL_SUPPORT_HUB_FAQS,
  SCHOOL_SUPPORT_SLUGS,
  SCHOOL_SUPPORT_STATES,
  deriveFullTimeAnnual,
  getSchoolSupportState,
} from "../index";

test("J6: five verified states, TAS/ACT/NT not built", () => {
  assert.deepEqual([...SCHOOL_SUPPORT_SLUGS], ["nsw", "vic", "qld", "wa", "sa"]);
  assert.equal(getSchoolSupportState("tas"), undefined);
});

test("J6: every state has exactly one current table, sources and FAQs", () => {
  for (const s of SCHOOL_SUPPORT_STATES) {
    assert.equal(s.tables.filter((t) => t.status === "current" && !t.id.includes("30h") && !t.id.includes("temp")).length, 1, s.slug);
    assert.ok(s.sources.length > 0, `${s.slug} sources`);
    assert.ok(s.faqs.length >= 3, `${s.slug} faqs`);
    for (const t of s.tables) {
      assert.ok(t.rows.length > 0, `${s.slug} ${t.id} rows`);
      assert.ok(s.sources.some((src) => src.id === t.sourceId), `${s.slug} ${t.id} source ${t.sourceId}`);
      for (const r of t.rows) assert.ok(r.annual > 30_000 && r.annual < 250_000, `${s.slug} ${r.label} ${r.annual}`);
    }
  }
});

test("J6: derived annuals are hourly × full-time hours × 52", () => {
  assert.equal(deriveFullTimeAnnual(38.33, 31.25), 62_286);
  assert.equal(deriveFullTimeAnnual(34.75, 32.5), 58_728);
  for (const s of SCHOOL_SUPPORT_STATES) {
    for (const t of s.tables.filter((x) => x.annualBasis === "derived")) {
      assert.ok(s.fullTimeHours, `${s.slug} needs hours to derive`);
      for (const r of t.rows) assert.equal(r.annual, deriveFullTimeAnnual(r.hourly!, s.fullTimeHours!), `${s.slug} ${r.label}`);
    }
  }
});

test("J6: published QLD rates reconcile to hourly × 38 × (365.25 ÷ 7) within $2", () => {
  const qld = getSchoolSupportState("qld")!;
  for (const t of qld.tables.filter((x) => x.showHourly)) {
    for (const r of t.rows) assert.ok(Math.abs(r.hourly! * 38 * (365.25 / 7) - r.annual) <= 2, `${r.label} ${r.annual}`);
  }
});

test("J6: SA re-uses the verified SSO schedule", () => {
  const sa = getSchoolSupportState("sa")!;
  assert.equal(sa.entry.annual, 58_360);
  assert.equal(sa.tables[0].rows.at(-1)!.annual, 139_147);
});

test("J6: hub FAQ quotes each state's entry figure", () => {
  const text = SCHOOL_SUPPORT_HUB_FAQS[0].a;
  assert.ok(text.includes("$38.33") && text.includes("$31.6921") && text.includes("$34.75") && text.includes("$58,360") && text.includes("$51,622"));
});
