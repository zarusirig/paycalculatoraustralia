// J7 (24 Sep 2026) — employer pay round 5. Every formula-derived figure on the
// new employer pages is re-derived here from the instrument's own formula (or
// matched to the instrument's printed table), so a mistyped cent cannot slip in.

import assert from "node:assert/strict";
import { test } from "node:test";

import { getEmployerPay, juniorRates, type EmployerPay } from "../index";

/** Half-up to the cent as on paper (toFixed(6) strips float noise like 34.82499…). */
const halfUp = (v: number) => Math.round(Number((v * 100).toFixed(6))) / 100;
const money = (v: number) => `$${halfUp(v).toFixed(2)}`;

/** General Retail Industry Award MA000004, cl 17.1 Table 4, from 1 July 2026. */
const GRIA_2026_L1 = 27.81;
const GRIA_2025_L1 = 26.55;
/** PR813655 phase-in from 1 Dec 2026: 75% / 85% of the Level 1 weekly rate, / 38. */
const GRIA_DEC_2026_18 = halfUp((1056.8 * 0.75) / 38);
const GRIA_DEC_2026_19 = halfUp((1056.8 * 0.85) / 38);

function pageText(e: EmployerPay): string {
  return [
    ...e.penaltyNotes,
    ...e.notices,
    ...e.faqs.map((f) => f.a),
    e.nextIncrease?.detail ?? "",
    e.casualRateNote ?? "",
    ...e.rates.map((r) => r.description),
  ].join(" ");
}

function get(slug: string): EmployerPay {
  const e = getEmployerPay(slug);
  assert.ok(e, slug);
  return e;
}

test("Target: cl 19.1 — CSA = Retail Award Level 1 + 5c, Team Leader = 112% of CSA", () => {
  const t = get("target");
  assert.equal(t.instrument.reference, "AG2022/5310, AE519106");
  // The same rule reproduces the SDA's July 2025 rate sheet (CSA $26.60, TL $29.79).
  assert.equal(halfUp(GRIA_2025_L1 + 0.05), 26.6);
  assert.equal(halfUp(26.6 * 1.12), 29.79);
  const csa = halfUp(GRIA_2026_L1 + 0.05);
  const tl = halfUp(csa * 1.12);
  assert.deepEqual(
    t.rates.map((r) => [r.level, r.hourly, r.casualHourly]),
    [
      ["Customer Service Assistant", csa, halfUp(csa * 1.25)],
      ["Team Leader", tl, halfUp(tl * 1.25)],
    ],
  );
  assert.deepEqual([csa, tl], [27.86, 31.2]);
  // Juniors: cl 17.1 percentages of the CSA rate, derived and labelled so.
  const juniors = Object.fromEntries(juniorRates(t).map((j) => [j.age, [j.hourly, j.casualHourly, j.published]]));
  assert.deepEqual(juniors["16 and under"], [13.93, 17.41, false]);
  assert.deepEqual(juniors["17"], [16.72, 20.9, false]);
  assert.deepEqual(juniors["18"], [19.5, 24.38, false]);
  assert.deepEqual(juniors["19"], [22.29, 27.86, false]);
  // Dec 2026 award phase-in overtakes Target's 18 and 19 rates (s 206 notice).
  assert.ok(GRIA_DEC_2026_18 > 19.5 && GRIA_DEC_2026_19 > 22.29);
  const text = pageText(t);
  for (const pct of [1.25, 1.5, 1.75, 2.25, 2.5]) assert.ok(text.includes(money(csa * pct)), `${pct}`);
  for (const v of ["$27.86", "$34.83", "$31.20", "$39.00", "$13.93", "$17.41", "$16.72", "$20.90", "$19.50", "$22.29", "$20.86", "$23.64"]) {
    assert.ok(text.includes(v), v);
  }
  assert.equal(money(GRIA_DEC_2026_18), "$20.86");
  assert.equal(money(GRIA_DEC_2026_19), "$23.64");
});

test("Priceline: printed cl 18.1 / Appendix A dollars and the agreement's multipliers", () => {
  const p = get("priceline");
  assert.equal(p.instrument.reference, "AG2026/2365, AE534063");
  const [re, ssa] = p.rates;
  assert.equal(re.hourly, 29.57);
  // cl 19.1: Specialist = 105% of Retail Employee.
  assert.equal(halfUp(re.hourly * 1.05), ssa.hourly);
  // Appendix A printed dollars, re-derived from the printed percentages.
  const printed: [number, number, number][] = [
    // [multiplier, Retail Employee, Specialist]
    [1.25, 36.96, 38.81],
    [1.11, 32.82, 34.47],
    [1.18, 34.89, 36.64],
    [1.415, 41.84, 43.94],
    [2.41, 71.26, 74.83],
    [2.6, 76.88, 80.73],
  ];
  for (const [m, a, b] of printed) {
    assert.equal(halfUp(re.hourly * m), a, `RE ${m}`);
    assert.equal(halfUp(ssa.hourly * m), b, `SSA ${m}`);
  }
  assert.equal(re.casualHourly, 36.96);
  assert.equal(ssa.casualHourly, 38.81);
  // Sunday: 179% is below the dollar floor, so the floor applies.
  assert.equal(halfUp(re.hourly * 1.79), 52.93);
  assert.ok(halfUp(ssa.hourly * 1.79) < 55.72);
  const juniors = Object.fromEntries(juniorRates(p).map((j) => [j.age, [j.hourly, j.casualHourly, j.published]]));
  assert.deepEqual(juniors["16 and younger"], [14.79, 18.49, false]);
  assert.deepEqual(juniors["17"], [17.74, 22.18, false]);
  assert.deepEqual(juniors["18"], [20.7, 25.88, false]);
  assert.deepEqual(juniors["19"], [23.66, 29.58, false]);
  for (const band of p.juniorScale) {
    const j = juniorRates(p).find((r) => r.age === band.age);
    assert.ok(j);
    assert.equal(j.hourly, halfUp(29.57 * band.percentage), band.age);
    assert.equal(j.casualHourly, halfUp(j.hourly * 1.25), band.age);
  }
  // Dec 2026 step in the agreement's own table (cl 26.1), and above the award phase-in.
  assert.equal(halfUp(29.57 * 0.75), 22.18);
  assert.equal(halfUp(29.57 * 0.85), 25.13);
  assert.ok(22.18 > GRIA_DEC_2026_18 && 25.13 > GRIA_DEC_2026_19);
  const text = pageText(p) + p.penalties.map((r) => `${r.permanent} ${r.note ?? ""}`).join(" ");
  for (const v of ["$29.57", "$36.96", "$31.05", "$38.81", "$34.89", "$41.84", "$53.07", "$55.72", "$52.93", "$71.26", "$76.88", "$32.82", "$14.79", "$18.49", "$17.74", "$22.18", "$25.13"]) {
    assert.ok(text.includes(v), v);
  }
});

test("Rebel: Super Retail Group Appendix A cl 304 (from 5 July 2026) transcribed exactly", () => {
  const r = get("rebel");
  assert.equal(r.instrument.reference, "AG2024/952, AE524487");
  // [permanent base, casual base] for Levels 1, 2, 3 at 20 years and above.
  assert.deepEqual(
    r.rates.map((x) => [x.hourly, x.casualHourly]),
    [[28.2, 35.25], [28.83, 36.04], [30.39, 37.98]],
  );
  // Above the Retail Award 2026 base rates for the mapped levels (L1, L2, L3).
  const gria = [27.81, 28.45, 28.89];
  r.rates.forEach((x, i) => assert.ok(x.hourly > gria[i], x.level));
  // Printed junior rows = the stated percentage of the adult Level 1 rate.
  for (const j of juniorRates(r)) {
    assert.equal(j.published, true);
    assert.equal(j.hourly, halfUp(28.2 * j.percentage), j.age);
  }
  // Dec 2026 award phase-in overtakes the printed 18 and 19 rates.
  assert.ok(GRIA_DEC_2026_18 > 19.74 && GRIA_DEC_2026_19 > 22.56);
  // Printed Level 1 penalty and overtime dollars appear on the page.
  const cells = [...r.penalties, ...r.overtime].flatMap((p) => [p.permanent, p.casual]).join(" ");
  for (const v of ["$34.40", "$41.45", "$48.50", "$62.60", "$69.65", "$55.55", "$76.69"]) assert.ok(cells.includes(v), v);
  const text = pageText(r);
  for (const v of ["$28.20", "$35.25", "$28.83", "$30.39", "$14.10", "$17.62", "$16.92", "$21.15", "$19.74", "$22.56", "$20.86", "$23.64", "$35.18", "$42.39", "$64.01", "$37.07", "$44.67", "$67.46"]) {
    assert.ok(text.includes(v), v);
  }
});
