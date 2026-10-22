// B2 (22 Oct 2026) — employer pay batch B. Bakers Delight (Retail Award,
// with the award's baking production shift rates) and Boost Juice (Fast Food
// Award). Every dollar quoted on the two pages is re-derived here from the
// award figures the pages import, so a mistyped cent cannot slip in.

import assert from "node:assert/strict";
import { test } from "node:test";

import { EMPLOYER_SECTOR, getEmployerPay, juniorRates, relatedEmployers, type EmployerPay } from "../index";

/** Half-up to the cent as on paper (toFixed(6) strips float noise like 38.284999…). */
const halfUp = (v: number) => Math.round(Number((v * 100).toFixed(6))) / 100;
const money = (v: number) => `$${halfUp(v).toFixed(2)}`;

function pageText(e: EmployerPay): string {
  return [
    ...e.penaltyNotes,
    ...e.notices,
    ...e.faqs.map((f) => f.a),
    e.nextIncrease?.detail ?? "",
    ...e.rates.map((r) => r.description),
  ].join(" ");
}

function get(slug: string): EmployerPay {
  const e = getEmployerPay(slug);
  assert.ok(e, slug);
  return e;
}

test("Bakers Delight: Retail Award figures as IGA, plus cl 25.2 baking production rows", () => {
  const bd = get("bakers-delight");
  const iga = get("iga");
  assert.equal(bd.instrument.kind, "modern-award");
  assert.equal(bd.instrument.reference, "MA000004");
  assert.equal(bd.verifiedOn, "22 October 2026");
  assert.equal(EMPLOYER_SECTOR["bakers-delight"], "retail");
  assert.deepEqual(
    bd.rates.map((r) => [r.level, r.weekly, r.hourly, r.casualHourly]),
    iga.rates.map((r) => [r.level, r.weekly, r.hourly, r.casualHourly]),
  );
  assert.deepEqual(juniorRates(bd), juniorRates(iga));
  assert.deepEqual(bd.overtime, iga.overtime);
  // Table 12 rows first, then the two baking production rows (cl 25.2(a) and (b)).
  assert.deepEqual(bd.penalties.slice(0, iga.penalties.length), iga.penalties);
  assert.deepEqual(
    bd.penalties.slice(iga.penalties.length).map((p) => [p.permanent, p.casual]),
    [["112.5%", "137.5%"], ["130%", "155%"]],
  );
  assert.equal(bd.allowances, undefined);
  // A qualified baker is Level 4 (Schedule A.4.3(b)).
  const l4 = bd.rates.find((r) => r.level === "Retail employee level 4");
  assert.ok(l4 && /baker/i.test(l4.description));
  assert.deepEqual([l4.hourly, l4.casualHourly], [29.45, 36.81]);
});

test("Bakers Delight: early morning and night shift dollars are 112.5/137.5% and 130/155% of Levels 1 and 4", () => {
  const bd = get("bakers-delight");
  const text = pageText(bd);
  const L1 = bd.rates[0].hourly;
  const L4 = 29.45;
  assert.equal(L1, 27.81);
  const expected = [
    [L1 * 1.125, 31.29], [L1 * 1.375, 38.24], [L1 * 1.3, 36.15], [L1 * 1.55, 43.11],
    [L4 * 1.125, 33.13], [L4 * 1.375, 40.49], [L4 * 1.3, 38.29], [L4 * 1.55, 45.65],
  ] as const;
  for (const [raw, printed] of expected) {
    assert.equal(halfUp(raw), printed);
    assert.ok(text.includes(money(printed)), money(printed));
  }
  // Table 12 dollars for a Level 1 sales assistant and the junior FAQ dollars.
  for (const pct of [1.25, 1.5, 1.75, 2.25, 2.5]) assert.ok(text.includes(money(L1 * pct)), `${pct}`);
  for (const [pct, v] of [[0.45, 12.51], [0.5, 13.91]] as const) {
    assert.equal(halfUp((1056.8 * pct) / 38), v);
    assert.ok(text.includes(money(v)) && text.includes(money(v * 1.25)), `${pct}`);
  }
  // PR813655 phase-in dollars in the next-increase note.
  assert.equal(halfUp((1056.8 * 0.75) / 38), 20.86);
  assert.equal(halfUp((1056.8 * 0.85) / 38), 23.64);
  assert.ok(bd.nextIncrease?.detail.includes("$20.86") && bd.nextIncrease.detail.includes("$23.64"));
  // Related: the other Retail Award pages share the instrument.
  assert.ok(relatedEmployers(bd).sameInstrument.some((o) => o.slug === "iga"));
});

test("Boost Juice: Fast Food Award figures as Subway, own descriptions and FAQ dollars", () => {
  const boost = get("boost-juice");
  const subway = get("subway");
  assert.equal(boost.instrument.kind, "modern-award");
  assert.equal(boost.instrument.reference, "MA000003");
  assert.equal(boost.verifiedOn, "22 October 2026");
  assert.equal(EMPLOYER_SECTOR["boost-juice"], "fast-food");
  assert.deepEqual(
    boost.rates.map((r) => [r.level, r.weekly, r.hourly, r.casualHourly]),
    subway.rates.map((r) => [r.level, r.weekly, r.hourly, r.casualHourly]),
  );
  assert.deepEqual(boost.publishedJuniorRates, subway.publishedJuniorRates);
  assert.deepEqual(boost.penalties, subway.penalties);
  assert.deepEqual(boost.overtime, subway.overtime);
  assert.equal(boost.allowances, undefined);
  assert.ok(/juice/i.test(boost.rates[0].description));
  const text = pageText(boost);
  assert.ok(!/sandwich artist/i.test(text), "Subway's job title");
  // L1 $27.81: casual x1.25, Sunday 150% casual, public holiday 225% / 250%.
  for (const v of ["$27.81", "$34.76", "$29.45", "$29.91", "$30.27", "$41.72", "$62.57", "$69.53"]) assert.ok(text.includes(v), v);
  assert.equal(halfUp(27.81 * 1.25), 34.76);
  assert.equal(halfUp(27.81 * 2.25), 62.57);
  assert.equal(halfUp(27.81 * 2.5), 69.53);
  // Printed Schedule A junior dollars quoted in the FAQ.
  for (const j of juniorRates(boost)) assert.equal(j.published, true, j.age);
  for (const v of ["$11.12", "$13.90", "$13.91", "$17.39", "$16.69", "$20.86"]) assert.ok(text.includes(v), v);
  // PR813654 Level 1 phase-in dollars in the next-increase note.
  for (const pct of [0.75, 0.85, 0.95]) assert.ok(boost.nextIncrease?.detail.includes(money((1056.8 * pct) / 38)), `${pct}`);
  assert.ok(relatedEmployers(boost).sameInstrument.some((o) => o.slug === "subway"));
});

test("B2 pages: sources are official and FAQs are their own", () => {
  for (const slug of ["bakers-delight", "boost-juice"]) {
    const e = get(slug);
    assert.ok(e.sources.some((s) => /fairwork\.gov\.au/.test(s.url)), `${slug}: Fair Work source`);
    assert.ok(e.faqs.length >= 4, slug);
    assert.ok(e.notices.length >= 2, slug);
    assert.ok(e.unverified.length >= 2, slug);
    // No em dashes in copy (house style).
    const copy = [e.instrument.coverage, ...e.notices, ...e.penaltyNotes, ...e.unverified, ...e.faqs.flatMap((f) => [f.q, f.a]), e.nextIncrease?.detail ?? ""].join(" ");
    assert.ok(!copy.includes("—"), `${slug}: em dash`);
  }
});
