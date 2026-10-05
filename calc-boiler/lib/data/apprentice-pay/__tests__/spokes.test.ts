import assert from "node:assert/strict";
import { test } from "node:test";

import { STANDARD_WEEKLY_RATE, getTrade } from "../index";
import {
  APPRENTICE_SPOKES,
  ADULT_NOTES,
  MANUFACTURING_TOOL_ALLOWANCE,
  allowanceRows,
  getSpoke,
  penaltyHourly,
  scenarioAllowance,
  spokeAdultRate,
  spokeRate,
} from "../spokes";

// Figures read from awards.fairwork.gov.au on 5 October 2026 (see spokes.ts, index.ts).

test("every spoke points at a data trade and has all four stages", () => {
  for (const s of APPRENTICE_SPOKES) {
    const t = getTrade(s.tradeSlug);
    assert.ok(t, `${s.slug} trade`);
    for (const stage of [1, 2, 3, 4] as const) {
      assert.ok(spokeRate(s, stage, "completed").hourly > 0);
      assert.ok(spokeRate(s, stage, "not-completed").hourly > 0);
    }
  }
  assert.equal(new Set(APPRENTICE_SPOKES.map((s) => s.slug)).size, APPRENTICE_SPOKES.length);
});

test("percentage rows: weekly = pct x $1,119.10 (to the cent), hourly = weekly / 38 for manufacturing and meat", () => {
  for (const slug of ["manufacturing", "meat"]) {
    const t = getTrade(slug)!;
    for (const r of t.junior) {
      if (r.pct === undefined) continue; // MA000010 stage 4 with Year 12 is the C12/V3 rate, not a percentage
      assert.ok(Math.abs(r.weekly - (STANDARD_WEEKLY_RATE * r.pct) / 100) <= 0.006, `${slug} ${r.stage} ${r.year12}`);
      assert.ok(Math.abs(r.hourly - r.weekly / 38) <= 0.011, `${slug} ${r.stage} hourly`);
    }
  }
});

test("manufacturing (boilermaker) matches MA000010 cl 21.6", () => {
  const s = getSpoke("boilermaker")!;
  assert.equal(spokeRate(s, 1, "not-completed").hourly, 14.73);
  assert.equal(spokeRate(s, 1, "completed").weekly, 615.51);
  assert.equal(spokeRate(s, 4, "not-completed").weekly, 984.81);
  // Stage 4 with Year 12 is the C12/V3 rate.
  assert.equal(spokeRate(s, 4, "completed").weekly, 1029.1);
  assert.equal(spokeRate(s, 4, "completed").hourly, 27.08);
  assert.equal(spokeAdultRate(s, 1)!.weekly, 895.28);
  assert.equal(spokeAdultRate(s, 3)!.hourly, 26.44);
});

test("meat industry (butcher) matches MA000059 cl 16.3 and 16.4", () => {
  const s = getSpoke("butcher")!;
  assert.equal(spokeRate(s, 1, "not-completed").weekly, 559.55);
  assert.equal(spokeRate(s, 2, "completed").weekly, 727.42);
  assert.equal(spokeRate(s, 3, "completed").pct, 85);
  assert.equal(spokeRate(s, 3, "not-completed").weekly, 951.24);
  assert.equal(spokeRate(s, 4, "completed").weekly, 1063.15);
  assert.equal(spokeRate(s, 4, "completed").hourly, 27.98);
  assert.equal(spokeAdultRate(s, 1)!.weekly, 895.28);
  // Adult stage 2 onwards is at least the lowest adult classification (MI 1, $978.10).
  assert.equal(spokeAdultRate(s, 2)!.weekly, 978.1);
  assert.equal(spokeAdultRate(s, 4)!.weekly, 1063.15);
});

test("carpenter, bricklayer and painter share one rate table and differ by tool allowance", () => {
  const c = getSpoke("carpenter")!;
  const b = getSpoke("bricklayer")!;
  const p = getSpoke("painter")!;
  for (const stage of [1, 2, 3, 4] as const) {
    assert.equal(spokeRate(c, stage, "completed").weekly, spokeRate(b, stage, "completed").weekly);
    assert.equal(spokeRate(c, stage, "completed").weekly, spokeRate(p, stage, "completed").weekly);
  }
  const general = (s: typeof c) => s.allowances.find((a) => a.id === "general")!;
  const residential = (s: typeof c) => s.allowances.find((a) => a.id === "residential")!;
  assert.equal(scenarioAllowance(general(c), 1), 108.37);
  assert.equal(scenarioAllowance(general(b), 1), 96.41);
  assert.equal(scenarioAllowance(general(p), 1), 77.04);
  assert.equal(scenarioAllowance(residential(c), 4), 94.94);
});

test("carpenter first year with general-site allowances: 615.51 + 108.37 = 723.88 a week", () => {
  const c = getSpoke("carpenter")!;
  const rows = allowanceRows(c, c.allowances[0]);
  assert.equal(rows[0].year12Weekly, 723.88);
  assert.equal(rows[0].noYear12Weekly, 667.92); // 559.55 + 108.37
  assert.equal(rows[0].year12Hourly, 19.05); // 723.88 / 38 = 19.0495
});

test("mechanic tool allowance rises by year and penalty rates match Schedule B.5.1", () => {
  const m = getSpoke("mechanic")!;
  const sc = m.allowances[0];
  assert.deepEqual([1, 2, 3, 4].map((s) => scenarioAllowance(sc, s as 1 | 2 | 3 | 4)), [5.88, 7.59, 10.46, 12.14]);
  // B.5.1 prints these exact dollar figures.
  assert.equal(penaltyHourly(14.73, "saturday"), 22.1);
  assert.equal(penaltyHourly(14.73, "sunday"), 29.46);
  assert.equal(penaltyHourly(14.73, "publicHoliday"), 36.83);
  assert.equal(penaltyHourly(16.2, "saturday"), 24.3);
  assert.equal(penaltyHourly(17.67, "publicHoliday"), 44.18);
  assert.equal(penaltyHourly(22.09, "publicHoliday"), 55.23);
  assert.equal(penaltyHourly(25.92, "sunday"), 51.84);
  assert.equal(penaltyHourly(25.92, "publicHoliday"), 64.8);
});

test("boilermaker tool allowance is $17.90 x 50/60/75/88 percent", () => {
  const b = getSpoke("boilermaker")!;
  const a = [1, 2, 3, 4].map((s) => scenarioAllowance(b.allowances[0], s as 1 | 2 | 3 | 4));
  assert.deepEqual(a, [8.95, 10.74, 13.43, 15.75]);
  assert.equal(MANUFACTURING_TOOL_ALLOWANCE, 17.9);
});

test("plumber and hairdresser/chef/butcher have no extra allowance table; adult text exists where no adult table", () => {
  for (const slug of ["plumber", "hairdresser", "chef", "butcher"]) assert.equal(getSpoke(slug)!.allowances.length, 0);
  for (const s of APPRENTICE_SPOKES) {
    const t = getTrade(s.tradeSlug)!;
    if (!t.adult) assert.ok(ADULT_NOTES[s.slug], `${s.slug} has an adult note`);
  }
});

test("headline junior figures", () => {
  assert.equal(spokeRate(getSpoke("plumber")!, 1, "completed").hourly, 18.11);
  assert.equal(spokeRate(getSpoke("mechanic")!, 4, "completed").hourly, 25.92);
  assert.equal(spokeRate(getSpoke("hairdresser")!, 3, "completed").weekly, 861.71);
  assert.equal(spokeRate(getSpoke("chef")!, 1, "not-completed").hourly, 16.2);
});
