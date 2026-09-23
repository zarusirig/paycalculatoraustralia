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
