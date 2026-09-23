// H1 (24 Sep 2026) — employer pay round 4. Every formula-derived figure on the
// new employer pages is re-derived here from the instrument's own formula and
// the award rates it references, so a mistyped cent cannot slip in.

import assert from "node:assert/strict";
import { test } from "node:test";

import { getEmployerPay, juniorRates, roundCents } from "../index";

/** Fast Food Industry Award MA000003 hourly rates, cl 15.1 (varied PR799284). */
const FFIA_2025 = { L1: 26.55, L2: 28.12, L3a: 28.55, L3b: 28.9 } as const;
const FFIA_2026 = { L1: 27.81, L2: 29.45, L3a: 29.91, L3b: 30.27 } as const;

type Ffia = typeof FFIA_2026;

/** Hungry Jack's Schedule B (as varied by AG2026/295): [permanent, casual] per level. */
function hungryJacksScheduleB(a: Ffia | typeof FFIA_2025): [string, number, number][] {
  const teamLead = roundCents(a.L1 + 0.1);
  return [
    ["Crew Member", roundCents(a.L1 * 1.0075), roundCents(a.L1 * 1.2525)],
    ["Crew Member – Team Lead", roundCents(teamLead * 1.0075), roundCents(teamLead * 1.2525)],
    ["Crew Coach", roundCents(a.L2 * 1.0075), roundCents(a.L2 * 1.2525)],
    ["Shift Supervisor", a.L3a, roundCents(a.L3a * 1.25)],
    ["Assistant Manager", roundCents(a.L3b * 1.0075), roundCents(a.L3b * 1.2525)],
    ["Restaurant Manager", roundCents(a.L3b * 1.0075), roundCents(a.L3b * 1.2525)],
  ];
}

test("Hungry Jack's: the Schedule B formula reproduces the printed 2025 column", () => {
  // Schedule B (varied 20 March 2026) prints these 2025 dollars.
  const printed2025: [number, number][] = [
    [26.75, 33.25],
    [26.85, 33.38],
    [28.33, 35.22],
    [28.55, 35.69],
    [29.12, 36.2],
    [29.12, 36.2],
  ];
  assert.deepEqual(
    hungryJacksScheduleB(FFIA_2025).map(([, p, c]) => [p, c]),
    printed2025,
  );
});

test("Hungry Jack's: 2026 rates are the Schedule B formula on the 1 July 2026 award", () => {
  const hj = getEmployerPay("hungry-jacks");
  assert.ok(hj);
  assert.equal(hj.instrument.reference, "AG2025/3915, AE531466");
  assert.deepEqual(
    hj.rates.map((r) => [r.level, r.hourly, r.casualHourly]),
    hungryJacksScheduleB(FFIA_2026),
  );
  assert.ok(hj.casualRateNote?.includes("$35.03"), "cl 15.2 literal reading is disclosed");
  assert.equal(roundCents(hj.rates[0].hourly * 1.25), 35.03);
  // Never below the award (s 206): permanent and casual vs award Level 1.
  assert.ok(hj.rates[0].hourly > FFIA_2026.L1);
  assert.ok(hj.rates[0].casualHourly > roundCents(FFIA_2026.L1 * 1.25));
});

test("Hungry Jack's: junior dollars are cl 22.1 % of the Crew Member rates", () => {
  const hj = getEmployerPay("hungry-jacks");
  assert.ok(hj);
  const expected: Record<string, [number, number]> = {
    "15 and under": [11.21, 13.93],
    "16": [14.01, 17.42],
    "17": [16.81, 20.9],
    "18": [19.61, 24.38],
    "19": [22.42, 27.86],
    "20": [26.62, 33.09],
    "21 and over": [28.02, 34.83],
  };
  for (const row of juniorRates(hj)) {
    assert.equal(row.published, false, "juniors are derived, and labelled so");
    assert.deepEqual([row.hourly, row.casualHourly], expected[row.age], row.age);
  }
  assert.equal(hj.juniorScale.find((b) => b.age === "20")?.percentage, 0.95);
});

test("Hungry Jack's: penalty and FAQ dollars match the Level 1 formula", () => {
  const hj = getEmployerPay("hungry-jacks");
  assert.ok(hj);
  const L1 = FFIA_2026.L1;
  const dollars = (pct: number) => roundCents(L1 * pct).toFixed(2);
  const cells = hj.penalties.flatMap((p) => [p.permanent, p.casual]).join(" ");
  for (const pct of [1.1025, 1.3525, 1.1525, 1.4025, 1.2525, 1.5025, 2.2525, 2.5025]) {
    assert.ok(cells.includes(`$${dollars(pct)}`), `${pct}`);
  }
  const ot = hj.overtime.flatMap((p) => [p.permanent, p.casual]).join(" ");
  for (const pct of [1.5, 1.75, 2, 2.25]) assert.ok(ot.includes(`$${dollars(pct)}`), `OT ${pct}`);
  const faqText = hj.faqs.map((f) => f.a).join(" ");
  for (const v of ["$28.02", "$34.83", "$29.67", "$29.91", "$30.50", "$11.21", "$13.93", "$41.78", "$62.64", "$69.59"]) {
    assert.ok(faqText.includes(v), v);
  }
});

test("Liquorland: Coles agreement Levels 1 and 3, adult rates at any age", () => {
  const liquor = getEmployerPay("liquorland");
  const coles = getEmployerPay("coles");
  assert.ok(liquor && coles);
  assert.equal(liquor.instrument.reference, coles.instrument.reference);
  const colesByLevel = new Map(coles.rates.map((r) => [r.level, r]));
  assert.deepEqual(liquor.rates.map((r) => r.level), ["Level 1", "Level 3"]);
  for (const r of liquor.rates) {
    const c = colesByLevel.get(r.level);
    assert.ok(c);
    assert.equal(r.hourly, c.hourly);
    assert.equal(r.casualHourly, c.casualHourly);
  }
  // Appendix A3 (junior rates) is Coles Supermarkets only.
  assert.equal(liquor.juniorScale.length, 0);
  assert.equal(juniorRates(liquor).length, 0);
  // Legacy 2014 Liquor Agreement rates (A4.3.3(b)) are all overtaken in 2026.
  for (const r of liquor.rates) assert.ok(r.hourly > 27.93);
  const faqText = liquor.faqs.map((f) => f.a).join(" ");
  for (const r of liquor.rates) {
    assert.ok(faqText.includes(`$${r.hourly.toFixed(2)}`), r.level);
    assert.ok(faqText.includes(`$${r.casualHourly.toFixed(2)}`), r.level);
  }
});
