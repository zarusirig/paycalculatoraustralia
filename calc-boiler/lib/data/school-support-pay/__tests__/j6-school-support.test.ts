import { strict as assert } from "node:assert";
import test from "node:test";

import {
  ACT_SA_PERCENT,
  ACT_SA4_PERCENT,
  NT_FULL_AO_PAY_POINTS,
  SCHOOL_SUPPORT_HUB_FAQS,
  SCHOOL_SUPPORT_NOT_BUILT,
  SCHOOL_SUPPORT_SLUGS,
  SCHOOL_SUPPORT_STATES,
  TAS_HOURS,
  TAS_PAID_WEEKS_DIVISOR,
  deriveFullTimeAnnual,
  getSchoolSupportState,
} from "../index";
import { ACT } from "../../public-service-pay/act";

test("J6+H3: all eight states and territories are built, nothing left unbuilt", () => {
  assert.deepEqual([...SCHOOL_SUPPORT_SLUGS], ["nsw", "vic", "qld", "wa", "sa", "tas", "act", "nt"]);
  assert.deepEqual([...SCHOOL_SUPPORT_NOT_BUILT], []);
  for (const slug of SCHOOL_SUPPORT_SLUGS) assert.equal(getSchoolSupportState(slug)?.slug, slug);
  assert.equal(getSchoolSupportState("federal"), undefined);
});

// Secondary "current" tables (a 30-hour view, temporary rates, the NT 96%
// arrangement) carry a token in their id so the page's lead table stays unique.
const SECONDARY_TABLE_ID = /30h|temp|96pc/;

test("J6: every state has exactly one lead current table, sources and FAQs", () => {
  for (const s of SCHOOL_SUPPORT_STATES) {
    assert.equal(s.tables.filter((t) => t.status === "current" && !SECONDARY_TABLE_ID.test(t.id)).length, 1, s.slug);
    assert.equal(s.tables[0].status, "current", `${s.slug} first table is the lead`);
    assert.ok(s.sources.length > 0, `${s.slug} sources`);
    assert.ok(s.faqs.length >= 3, `${s.slug} faqs`);
    for (const t of s.tables) {
      assert.ok(t.rows.length > 0, `${s.slug} ${t.id} rows`);
      assert.ok(s.sources.some((src) => src.id === t.sourceId), `${s.slug} ${t.id} source ${t.sourceId}`);
      for (const r of t.rows) assert.ok(r.annual > 30_000 && r.annual < 250_000, `${s.slug} ${r.label} ${r.annual}`);
    }
    for (const src of s.sources) assert.match(src.url, /^https:\/\/[a-z0-9.-]+\.(gov\.au|asn\.au)\//, `${s.slug} ${src.id} official source`);
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

test("H3: TAS hourly rates are the DECYP formula, annual ÷ (36.75 × 52.2), within one cent", () => {
  const tas = getSchoolSupportState("tas")!;
  assert.equal(tas.fullTimeHours, TAS_HOURS);
  const lead = tas.tables.find((t) => t.id === "tas-2025")!;
  assert.equal(lead.rows.length, 5);
  for (const r of lead.rows) assert.ok(Math.abs(r.annual / (TAS_HOURS * TAS_PAID_WEEKS_DIVISOR) - r.hourly!) < 0.01, `${r.label} ${r.hourly}`);
  // Band 2 Range 1 Level 2 to 6 are the same five salary points as the General Stream Band 2 on the TAS public service page.
  assert.deepEqual(lead.rows.map((r) => r.annual), [69_593, 70_825, 72_114, 73_808, 74_837]);
  // The 1 December 2026 column is ($800 + base) × 1.03, rounded, within $1 of the agreement's printed figure.
  const next = tas.tables.find((t) => t.id === "tas-2026")!;
  assert.equal(next.status, "upcoming");
  lead.rows.forEach((r, i) => assert.ok(Math.abs((r.annual + 800) * 1.03 - next.rows[i].annual) <= 1, `${r.label} Dec 2026`));
});

test("H3: ACT School Assistant rows are the verified ASO pay points × 85.034% (× 91.836% for SA 4), within $1", () => {
  const act = getSchoolSupportState("act")!;
  const aso = ACT.schedules.find((s) => s.id === "act-admin-2025")!.streams.flatMap((s) => s.bands);
  const points = (code: string) => aso.find((b) => b.code === code)!.payPoints!.map((p) => p.annual);
  const table = act.tables[0];
  const sa23 = table.rows.filter((r) => r.label.startsWith("School Assistant 2/3")).map((r) => r.annual);
  const sa3 = table.rows.filter((r) => r.label.startsWith("School Assistant 3")).map((r) => r.annual);
  const sa4 = table.rows.filter((r) => r.label.startsWith("School Assistant 4")).map((r) => r.annual);
  const expect23 = [...points("ASO 2"), ...points("ASO 3")].map((a) => a * ACT_SA_PERCENT);
  assert.equal(sa23.length, 9);
  sa23.forEach((v, i) => assert.ok(Math.abs(v - expect23[i]) <= 1, `SA 2/3 pp${i + 1} ${v} vs ${expect23[i]}`));
  points("ASO 3").forEach((a, i) => assert.ok(Math.abs(sa3[i] - a * ACT_SA_PERCENT) <= 1, `SA 3 pp${i + 1}`));
  points("ASO 4").forEach((a, i) => assert.ok(Math.abs(sa4[i] - a * ACT_SA4_PERCENT) <= 1, `SA 4 pp${i + 1} ${sa4[i]} vs ${a * ACT_SA4_PERCENT}`));
  // The annex rounds clause R16.6's fractions; the rounded percentages are what the printed salaries follow.
  assert.ok(Math.abs(ACT_SA_PERCENT - 62.5 / 73.5) < 0.00001 && Math.abs(ACT_SA4_PERCENT - 67.5 / 73.5) < 0.00001);
  assert.equal(act.entry.annual, 59_725);
});

test("H3: NT 92% and 96% rows are the full AO2 to AO4 pay points scaled, within $1, and 2027 is +3.5%", () => {
  const nt = getSchoolSupportState("nt")!;
  const full = NT_FULL_AO_PAY_POINTS.map((p) => p.annual);
  assert.equal(full.length, 15);
  const t92 = nt.tables.find((t) => t.id === "nt-92-2026")!;
  const t96 = nt.tables.find((t) => t.id === "nt-96pc-2026")!;
  const t27 = nt.tables.find((t) => t.id === "nt-92-2027")!;
  assert.equal(t92.status, "current");
  assert.equal(t96.status, "current");
  assert.equal(t27.status, "upcoming");
  full.forEach((a, i) => {
    assert.ok(Math.abs(t92.rows[i].annual - a * 0.92) <= 1, `${t92.rows[i].label} 92%`);
    assert.ok(Math.abs(t96.rows[i].annual - a * 0.96) <= 1, `${t96.rows[i].label} 96%`);
    // The 2027 column is 92% of the full rate after its 3.5% rise, not 3.5% on the rounded 92% figure.
    assert.ok(Math.abs(t27.rows[i].annual - a * 1.035 * 0.92) <= 1, `${t92.rows[i].label} 2027 ${t27.rows[i].annual} vs ${a * 1.035 * 0.92}`);
  });
  assert.equal(nt.entry.annual, 58_817);
});

test("H3: new pages carry their own published date and the 22 October verification", () => {
  for (const slug of ["tas", "act", "nt"]) {
    const s = getSchoolSupportState(slug)!;
    assert.equal(s.publishedOn, "2026-10-22", slug);
    assert.equal(s.verifiedOn, "22 October 2026", slug);
    for (const src of s.sources) assert.equal(src.verifiedOn, "22 October 2026", `${slug} ${src.id}`);
  }
  for (const slug of ["nsw", "vic", "qld", "wa", "sa"]) assert.equal(getSchoolSupportState(slug)!.publishedOn, undefined, slug);
});

test("copy rules: no em dashes or AI-style phrases in the new states' reader-facing text", () => {
  const banned = /in today's|it's important to note|delve|whether you're|navigate|landscape|unlock|comprehensive|guarantee|leverage|utilize|seamlessly|actionable/i;
  for (const slug of ["tas", "act", "nt"]) {
    const s = getSchoolSupportState(slug)!;
    const text = [s.instrument, s.headline, s.metaTitle, s.metaDescription, s.h1, s.hoursNote, s.startingPoint, ...s.notes, ...s.tables.flatMap((t) => [t.title, t.caption, ...t.rows.map((r) => `${r.label} ${r.note ?? ""}`)]), ...s.faqs.flatMap((f) => [f.q, f.a])].join("\n");
    assert.ok(!text.includes("—"), `${slug} has an em dash`);
    assert.ok(!banned.test(text), `${slug} has a banned phrase: ${text.match(banned)?.[0]}`);
    assert.ok(s.metaTitle.length <= 62, `${slug} metaTitle ${s.metaTitle.length}`);
    assert.ok(s.metaDescription.length <= 165, `${slug} metaDescription ${s.metaDescription.length}`);
  }
});

test("J6: hub FAQ quotes each state's entry figure", () => {
  const text = SCHOOL_SUPPORT_HUB_FAQS[0].a;
  for (const figure of ["$38.33", "$31.6921", "$34.75", "$58,360", "$51,622", "$36.2775", "$59,725", "$58,817"]) assert.ok(text.includes(figure), figure);
});
