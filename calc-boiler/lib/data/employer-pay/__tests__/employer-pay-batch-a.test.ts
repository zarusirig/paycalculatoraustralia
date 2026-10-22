// Batch A (22 Oct 2026): employer pay round 6, ALDI, Cotton On and The Reject
// Shop. Every formula-derived figure on the new pages is re-derived here from
// the instrument's own rule and the award rates it references (or matched to
// the instrument's printed table), so a mistyped cent cannot slip in.

import assert from "node:assert/strict";
import { test } from "node:test";

import {
  EMPLOYER_SECTOR,
  deriveJuniorHourly,
  getEmployerPay,
  juniorRates,
  relatedEmployers,
  underInstrument,
  weeklyExamples,
  type EmployerPay,
} from "../index";
import { featuredImageFor } from "../../../featured-image";

/** Half-up to the cent as on paper (toFixed(6) strips float noise like 45.31499...). */
const halfUp = (v: number) => Math.round(Number((v * 100).toFixed(6))) / 100;
const money = (v: number) => `$${halfUp(v).toFixed(2)}`;

/** General Retail Industry Award MA000004 cl 17.1 Table 4, Level 1 from 1 July 2026. */
const GRIA_2026_L1_WEEKLY = 1056.8;
const GRIA_2026_L1 = 27.81;

function pageText(e: EmployerPay): string {
  return [
    ...e.penaltyNotes,
    ...e.notices,
    ...e.faqs.map((f) => f.a),
    e.nextIncrease?.detail ?? "",
    e.casualRateNote ?? "",
    e.juniorNote,
    ...e.rates.map((r) => r.description),
    ...[...e.penalties, ...e.overtime].flatMap((p) => [p.permanent, p.casual, p.note ?? ""]),
    ...(e.allowances ?? []).map((a) => `${a.name} ${a.amount} ${a.when}`),
    e.allowancesNote ?? "",
  ].join(" ");
}

function get(slug: string): EmployerPay {
  const e = getEmployerPay(slug);
  assert.ok(e, slug);
  return e;
}

test("Batch A: slugs are registered with a sector, a verification date and a featured image", () => {
  for (const slug of ["aldi", "cotton-on", "reject-shop"]) {
    const e = get(slug);
    assert.equal(e.verifiedOn, "22 October 2026", slug);
    assert.ok(EMPLOYER_SECTOR[e.slug], slug);
    assert.ok(featuredImageFor(`/pay-rates/${slug}/`), `${slug}: featured image`);
    // Copy rules: no em dashes in anything the page prints.
    assert.ok(!pageText(e).includes(String.fromCharCode(0x2014)), `${slug}: em dash`);
  }
  assert.equal(EMPLOYER_SECTOR.aldi, "supermarket-liquor");
  assert.equal(EMPLOYER_SECTOR["cotton-on"], "retail");
  assert.equal(EMPLOYER_SECTOR["reject-shop"], "retail");
  // "paid under the The Reject Shop Agreement" is avoided by underInstrument().
  assert.equal(underInstrument("The Reject Shop Agreement 2023"), "The Reject Shop Agreement 2023");
  assert.equal(underInstrument("Coles Retail Enterprise Agreement 2024"), "the Coles Retail Enterprise Agreement 2024");
  assert.equal(underInstrument("General Retail Industry Award 2020"), "the General Retail Industry Award 2020");
});

test("The Reject Shop: GRIA Level 1 weekly x 1.005, Team Leader x 1.05, casual x 1.26 (cls 19.1, 19.4)", () => {
  const trs = get("reject-shop");
  assert.equal(trs.instrument.reference, "AG2023/4375, AE522483");
  assert.match(trs.instrument.nominalExpiry ?? "", /passed/);
  // The rule reproduces the printed 2023 column: FWO pay guide GRIA Level 1
  // from 1 July 2023 was $939.60 a week; cl 19.1 prints $944.30 and $991.52.
  assert.equal(halfUp(939.6 * 1.005), 944.3);
  assert.equal(halfUp(944.3 * 1.05), 991.52);
  const tmWeekly = halfUp(GRIA_2026_L1_WEEKLY * 1.005);
  const tlWeekly = halfUp(tmWeekly * 1.05);
  const tmHourly = halfUp(tmWeekly / 38);
  const tlHourly = halfUp(tlWeekly / 38);
  assert.deepEqual([tmWeekly, tlWeekly, tmHourly, tlHourly], [1062.08, 1115.18, 27.95, 29.35]);
  assert.deepEqual(
    trs.rates.map((r) => [r.level, r.weekly, r.hourly, r.casualHourly]),
    [
      ["Team Member", tmWeekly, tmHourly, halfUp(tmHourly * 1.26)],
      ["Team Leader", tlWeekly, tlHourly, halfUp(tlHourly * 1.26)],
    ],
  );
  assert.equal(trs.casualLoading, 0.26);
  // Hourly-first reading gives the same hourly and 2c more a week; disclosed.
  assert.equal(halfUp(halfUp(GRIA_2026_L1 * 1.005) * 38), 1062.1);
  assert.equal(halfUp(halfUp(GRIA_2026_L1 * 1.005) * 38 * 1.05), 1115.21);
  assert.ok(trs.notices.join(" ").includes("$1,062.10") && trs.notices.join(" ").includes("$1,115.21"));
  // Above the award: 0.5% on the base, a point on the loading.
  assert.ok(trs.rates[0].hourly > GRIA_2026_L1);
  assert.ok(trs.rates[0].casualHourly > halfUp(GRIA_2026_L1 * 1.25));
  // Juniors: cl 19.2 % x Team Member weekly / 38, casual x 1.26, adult at 20.
  const expected: Record<string, [number, number]> = {
    "Under 16": [12.58, 15.85],
    "16": [13.97, 17.6],
    "17": [16.77, 21.13],
    "18": [19.56, 24.65],
    "19": [22.36, 28.17],
    "20 and over": [27.95, 35.22],
  };
  const rows = juniorRates(trs);
  assert.equal(rows.length, Object.keys(expected).length);
  for (const row of rows) {
    assert.equal(row.published, false, "derived, labelled as ours");
    assert.equal(row.hourly, deriveJuniorHourly(trs.rates[0], row.percentage), row.age);
    assert.deepEqual([row.hourly, row.casualHourly], expected[row.age], row.age);
  }
  // PR813655 phase-in (75% / 85% of the award weekly, / 38) overtakes 18 and 19.
  assert.ok(halfUp((GRIA_2026_L1_WEEKLY * 0.75) / 38) > 19.56);
  assert.ok(halfUp((GRIA_2026_L1_WEEKLY * 0.85) / 38) > 22.36);
  // Penalty dollars for a Team Member: cl 23 percentages on $27.95, casual inclusive of 26%.
  const text = pageText(trs);
  for (const pct of [1.25, 1.5, 2.25, 1.51, 1.76, 2.51]) assert.ok(text.includes(money(tmHourly * pct)), `${pct}`);
  for (const v of ["$27.95", "$35.22", "$29.35", "$36.98", "$12.58", "$15.85", "$13.97", "$17.60", "$16.77", "$21.13", "$20.86", "$23.64", "$34.76"]) {
    assert.ok(text.includes(v), v);
  }
  // Casual cells carry the 22 June 2026 loading step (cls 23.3, 24.7, 25.9).
  assert.deepEqual(trs.penalties.map((p) => p.casual), ["Base + 26%", "Base + 51%", "Base + 51%", "Base + 76%", "Base + 151%"]);
  assert.deepEqual(trs.overtime.map((p) => p.casual), ["176%", "226%", "226%", "276%"]);
});

test("Cotton On: Retail Award figures identical to IGA, junior dollars are the FWO pay guide's", () => {
  const co = get("cotton-on");
  const iga = get("iga");
  assert.equal(co.instrument.kind, "modern-award");
  assert.equal(co.instrument.reference, "MA000004");
  assert.deepEqual(
    co.rates.map((r) => [r.weekly, r.hourly, r.casualHourly]),
    iga.rates.map((r) => [r.weekly, r.hourly, r.casualHourly]),
  );
  assert.deepEqual(co.penalties, iga.penalties);
  assert.deepEqual(co.overtime, iga.overtime);
  assert.deepEqual(co.juniorScale, iga.juniorScale);
  // Pay guide published 24 June 2026, Level 1 junior full-time and casual dollars.
  const guide: [string, number, number][] = [
    ["Under 16", 12.51, 15.64],
    ["16", 13.91, 17.39],
    ["17", 16.69, 20.86],
    ["18", 19.47, 24.34],
    ["19", 22.25, 27.81],
    ["20 (6 months' service or less)", 25.03, 31.29],
    ["20 (more than 6 months' service)", 27.81, 34.76],
    ["21 and over", 27.81, 34.76],
  ];
  assert.deepEqual(co.publishedJuniorRates?.map((p) => [p.age, p.hourly, p.casualHourly]), guide);
  for (const row of juniorRates(co)) assert.equal(row.published, true, row.age);
  // The published dollars agree with the award's weekly-then-divide rule and a 25% loading.
  for (const p of co.publishedJuniorRates ?? []) {
    const band = co.juniorScale.find((b) => b.age === p.age);
    assert.ok(band, p.age);
    assert.equal(p.hourly, deriveJuniorHourly(co.rates[0], band.percentage), p.age);
    assert.equal(p.casualHourly, halfUp(p.hourly * 1.25), p.age);
  }
  // Pay guide penalty and overtime dollars quoted on the page.
  const text = pageText(co);
  for (const v of ["$34.76", "$41.72", "$48.67", "$62.57", "$69.53", "$55.62", "$76.48", "$12.51", "$15.64", "$13.91", "$17.39", "$16.69", "$20.86", "$23.64", "$33.99", "$1,056.80"]) {
    assert.ok(text.includes(v), v);
  }
  assert.equal(halfUp(GRIA_2026_L1 * 1.5), 41.72);
  assert.equal(halfUp(GRIA_2026_L1 * 2.25), 62.57);
  // The pay source is the FWO pay guide; the DC-only agreement is named and kept apart.
  assert.match(co.sources[0].url, /fairwork\.gov\.au.*pay-guide/);
  assert.ok(co.instrument.coverage.includes("distribution centres"));
  assert.ok(co.sources.some((s) => s.url.includes("ae531676")));
  assert.deepEqual(relatedEmployers(co).sameInstrument.map((o) => o.slug).slice(0, 2), ["iga", "jb-hi-fi"]);
});

test("ALDI: Prestons printed dollars, no adult casuals, Minchinbury comparison, award floor on Fixed Roster", () => {
  const a = get("aldi");
  assert.equal(a.instrument.reference, "AG2024/4407, AE531722");
  assert.equal(a.instrument.nominalExpiry, "2 January 2030");
  // Sch 2 Part D and Sch 1 cl 12.3 base rates (Monday to Friday 7am to 6pm), lowest first.
  assert.deepEqual(
    a.rates.map((r) => [r.level, r.hourly, r.casualHourly, r.noCasual]),
    [
      ["Limited Roster Store Assistant", 29.64, 0, true],
      ["Full-time or Flexible Store Assistant", 30.21, 0, true],
      ["Duty Store Manager", 32.72, 0, true],
    ],
  );
  assert.equal(a.casualLoading, 0);
  assert.ok(a.casualRateNote?.includes("juniors only"));
  for (const x of weeklyExamples(a)) assert.equal(x.casualWeekly, 0, `${x.hours}h`);
  // No junior table: the note carries the cl 15 percentages as dollars and the printed casual junior rates.
  assert.equal(a.juniorScale.length, 0);
  assert.equal(juniorRates(a).length, 0);
  for (const [base, pct, v] of [[29.64, 0.5, 14.82], [29.64, 0.6, 17.78], [30.21, 0.5, 15.11], [30.21, 0.6, 18.13]] as const) {
    assert.equal(halfUp(base * pct), v);
    assert.ok(a.juniorNote.includes(money(v)), `${v}`);
  }
  for (const v of ["$17.31", "$20.75", "$24.90", "$24.23", "$29.06", "$31.14", "$37.37", "$34.59", "$41.51"]) assert.ok(a.juniorNote.includes(v) || pageText(a).includes(v), v);
  // Printed Full-time / Flexible time-band dollars in the penalty table.
  const cells = a.penalties.map((p) => p.permanent).join(" ");
  for (const v of ["$30.21", "$37.00", "$43.41", "$43.78", "$57.36", "$64.15"]) assert.ok(cells.includes(v), v);
  const text = pageText(a);
  for (const v of ["$36.30", "$42.95", "$56.26", "$62.92", "$40.06", "$47.42", "$62.10", "$69.45", "$29.04", "$28.50", "$31.46", "$26.79", "$27.81"]) {
    assert.ok(text.includes(v), v);
  }
  // Overtime at 150% of the base rate (Sch 2 cl 9.2, Sch 1 cl 12.4), our arithmetic.
  for (const base of [30.21, 29.64, 32.72]) assert.ok(text.includes(money(base * 1.5)), `${base} x 1.5`);
  // Prestons prints Minchinbury's July 2024 figures plus about 4%, every classification.
  for (const [minchinbury, prestons] of [[29.04, 30.21], [28.5, 29.64], [31.46, 32.72], [25.76, 26.79]] as const) {
    assert.ok(Math.abs(prestons / minchinbury - 1.04) < 0.001, `${minchinbury} -> ${prestons}`);
  }
  // Fixed Roster's printed $26.79 sits below the 2026 award Level 1 (s 206 floor): a notice, not a row.
  assert.ok(26.79 < GRIA_2026_L1);
  for (const r of a.rates) assert.ok(r.hourly > GRIA_2026_L1, r.level);
  assert.ok(a.notices.join(" ").includes("Fixed Roster"));
  // Above-award percentages quoted in the FAQ.
  assert.equal(Math.round((30.21 / GRIA_2026_L1 - 1) * 1000) / 10, 8.6);
  assert.equal(Math.round((29.64 / GRIA_2026_L1 - 1) * 1000) / 10, 6.6);
  // The one allowance is the Relieving Shift Manager payment (Sch 2 cl 17); its dollars appear once.
  assert.deepEqual(a.allowances?.map((x) => x.amount), ["$9.00 an hour"]);
  assert.ok(![...a.penaltyNotes, ...a.notices].join(" ").includes("$9.00"));
  assert.ok(a.nextIncrease?.date.includes("1 September"));
});
