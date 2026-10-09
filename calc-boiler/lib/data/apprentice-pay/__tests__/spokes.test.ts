import assert from "node:assert/strict";
import { test } from "node:test";

import { STANDARD_WEEKLY_RATE, apprenticePay, getTrade, type ApprenticeStage } from "../index";
import {
  ADULT_FAQ_ANSWERS,
  ADULT_NOTES,
  APPRENTICE_SPOKES,
  BUILDING_ALL_OTHERS_1Y_GENERAL,
  INDUSTRY_ALLOWANCE,
  MANUFACTURING_TOOL_ALLOWANCE,
  MANUFACTURING_TOOL_HOURLY_PAY_GUIDE,
  allowanceRows,
  getSpoke,
  headlineRate,
  payGuideKey,
  penaltyAt,
  penaltyHourly,
  scenarioAllowance,
  spokeAdultRate,
  spokeRate,
  type ApprenticeSpoke,
} from "../spokes";

// Figures read 9 October 2026 from the Fair Work Ombudsman pay guides
// (https://calculate.fairwork.gov.au/payguides/fairwork/<code>/pdf), the awards
// at awards.fairwork.gov.au and training.gov.au (see spokes.ts, index.ts).

const STAGE_LIST = [1, 2, 3, 4] as const;
const S = (slug: string): ApprenticeSpoke => {
  const s = getSpoke(slug);
  assert.ok(s, slug);
  return s;
};

test("every spoke points at a data trade and has all four stages", () => {
  for (const s of APPRENTICE_SPOKES) {
    const t = getTrade(s.tradeSlug);
    assert.ok(t, `${s.slug} trade`);
    for (const stage of STAGE_LIST) {
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

// ---- Building: FWO MA000020 pay guide, published 2 July 2026 -----------------

const BUILDING_PAY_GUIDE: Record<string, { tool: number; general: number[][]; residential: number[][]; adult: number[][] }> = {
  // [weekly, hourly] for 1n, 1y, 2n, 2y, 3, 4; adult [general, residential].
  carpenter: {
    tool: 41.22,
    general: [[667.92, 17.58], [723.88, 19.05], [779.83, 20.52], [835.79, 21.99], [947.7, 24.94], [1115.56, 29.36]],
    residential: [[654.49, 17.22], [710.45, 18.7], [766.4, 20.17], [822.36, 21.64], [934.27, 24.59], [1102.13, 29.0]],
    adult: [[1121.87, 29.52], [1108.44, 29.17]],
  },
  bricklayer: {
    tool: 29.26,
    general: [[655.96, 17.26], [711.92, 18.73], [767.87, 20.21], [823.83, 21.68], [935.74, 24.62], [1103.6, 29.04]],
    residential: [[642.53, 16.91], [698.49, 18.38], [754.44, 19.85], [810.4, 21.33], [922.31, 24.27], [1090.17, 28.69]],
    adult: [[1109.91, 29.21], [1096.48, 28.85]],
  },
  painter: {
    tool: 9.89,
    general: [[636.59, 16.75], [692.55, 18.23], [748.5, 19.7], [804.46, 21.17], [916.37, 24.12], [1084.23, 28.53]],
    residential: [[623.16, 16.4], [679.12, 17.87], [735.07, 19.34], [791.03, 20.82], [902.94, 23.76], [1070.8, 28.18]],
    adult: [[1090.54, 28.7], [1077.11, 28.35]],
  },
};
const PG_ROWS: [ApprenticeStage, "completed" | "not-completed"][] = [
  [1, "not-completed"],
  [1, "completed"],
  [2, "not-completed"],
  [2, "completed"],
  [3, "completed"],
  [4, "completed"],
];

test("building spokes carry the FWO pay guide figures exactly", () => {
  for (const [slug, want] of Object.entries(BUILDING_PAY_GUIDE)) {
    const s = S(slug);
    assert.ok(s.payGuide, `${slug} has a pay guide`);
    assert.equal(s.payGuide!.toolAllowance, want.tool);
    PG_ROWS.forEach(([stage, y12], i) => {
      assert.deepEqual([...s.payGuide!.general[payGuideKey(stage, y12)]], want.general[i], `${slug} general ${stage} ${y12}`);
      assert.deepEqual([...s.payGuide!.residential[payGuideKey(stage, y12)]], want.residential[i], `${slug} residential ${stage} ${y12}`);
    });
    // Stages 3 and 4 do not split by Year 12.
    assert.deepEqual(headlineRate(s, 3, "not-completed"), headlineRate(s, 3, "completed"));
    assert.deepEqual([...s.payGuide!.adult.general], want.adult[0]);
    assert.deepEqual([...s.payGuide!.adult.residential], want.adult[1]);
  }
});

test("building: % of standard rate + full tool allowance + industry allowance = pay guide, every row, both site types", () => {
  for (const slug of Object.keys(BUILDING_PAY_GUIDE)) {
    const s = S(slug);
    for (const site of ["general", "residential"] as const) {
      const sc = s.allowances.find((a) => a.id === site)!;
      assert.ok(sc.allPurpose);
      const rows = allowanceRows(s, sc);
      for (const r of rows) {
        assert.equal(r.allowance, Math.round((s.payGuide!.toolAllowance + INDUSTRY_ALLOWANCE[site]) * 100) / 100);
        const y = headlineRate(s, r.stage, "completed", site);
        const n = headlineRate(s, r.stage, "not-completed", site);
        assert.equal(r.year12Weekly, y.weekly, `${slug} ${site} ${r.stage} Y12 weekly`);
        assert.equal(r.year12Hourly, y.hourly, `${slug} ${site} ${r.stage} Y12 hourly`);
        assert.equal(r.noYear12Weekly, n.weekly, `${slug} ${site} ${r.stage} no Y12 weekly`);
        assert.equal(r.noYear12Hourly, n.hourly, `${slug} ${site} ${r.stage} no Y12 hourly`);
      }
    }
  }
});

test("building: the three trades share the wage table and differ only by the cl 21.1(a) tool allowance", () => {
  const c = S("carpenter");
  const b = S("bricklayer");
  const p = S("painter");
  for (const stage of STAGE_LIST) {
    assert.equal(spokeRate(c, stage, "completed").weekly, spokeRate(b, stage, "completed").weekly);
    assert.equal(spokeRate(c, stage, "completed").weekly, spokeRate(p, stage, "completed").weekly);
    // $11.96 and $31.33 a week below the carpenter in every year (lead paragraphs).
    assert.equal(Math.round((headlineRate(c, stage, "completed").weekly - headlineRate(b, stage, "completed").weekly) * 100) / 100, 11.96);
    assert.equal(Math.round((headlineRate(c, stage, "completed").weekly - headlineRate(p, stage, "completed").weekly) * 100) / 100, 31.33);
  }
  assert.equal(INDUSTRY_ALLOWANCE.general, 67.15);
  assert.equal(INDUSTRY_ALLOWANCE.residential, 53.72);
  assert.equal(scenarioAllowance(c.allowances.find((a) => a.id === "general")!, 1), 108.37);
  assert.equal(scenarioAllowance(b.allowances.find((a) => a.id === "general")!, 1), 96.41);
  assert.equal(scenarioAllowance(p.allowances.find((a) => a.id === "general")!, 1), 77.04);
  assert.equal(scenarioAllowance(c.allowances.find((a) => a.id === "residential")!, 4), 94.94);
  // "All others" table (no tool allowance): 615.51 + 67.15, / 38.
  assert.deepEqual([...BUILDING_ALL_OTHERS_1Y_GENERAL], [682.66, 17.96]);
  assert.equal(Math.round((spokeRate(c, 1, "completed").weekly + 67.15) * 100) / 100, 682.66);
  // Qualified carpenter on a general site: 1119.10 + 41.22 + 67.15.
  assert.equal(Math.round((STANDARD_WEEKLY_RATE + 41.22 + 67.15) * 100) / 100, 1227.47);
});

test("building: adult apprentice = CW1(a) $1,013.50 + industry + tool allowance, above the 90% fourth-year rate", () => {
  for (const [slug, want] of Object.entries(BUILDING_PAY_GUIDE)) {
    const s = S(slug);
    assert.equal(Math.round((1013.5 + 67.15 + want.tool) * 100) / 100, want.adult[0][0], `${slug} adult general`);
    assert.equal(Math.round((1013.5 + 53.72 + want.tool) * 100) / 100, want.adult[1][0], `${slug} adult residential`);
    assert.ok(want.adult[0][0] > headlineRate(s, 4, "completed").weekly);
    assert.ok(ADULT_NOTES[s.slug]!.includes(want.adult[0][1].toFixed(2)));
    assert.ok(ADULT_FAQ_ANSWERS[s.slug]!.includes(want.adult[1][1].toFixed(2)));
  }
});

test("calculator: building minimum includes the site allowances and matches the pay guide", () => {
  for (const slug of Object.keys(BUILDING_PAY_GUIDE)) {
    const s = S(slug);
    for (const site of ["general", "residential"] as const) {
      const sc = s.allowances.find((a) => a.id === site)!;
      for (const [stage, y12] of PG_ROWS) {
        const r = apprenticePay({ tradeSlug: "building", track: "junior", stage, year12: y12, hoursPerWeek: 38, weeklyAllowance: scenarioAllowance(sc, stage) })!;
        assert.equal(r.minHourly, headlineRate(s, stage, y12, site).hourly, `${slug} ${site} ${stage} ${y12}`);
      }
    }
  }
  // $17.00 is above the bare $16.20 wage but below a carpenter's $19.05: flagged.
  const c = S("carpenter");
  const under = apprenticePay({ tradeSlug: "building", track: "junior", stage: 1, year12: "completed", hoursPerWeek: 38, actualHourly: 17, weeklyAllowance: scenarioAllowance(c.allowances[0], 1) })!;
  assert.equal(under.belowAward, true);
  assert.equal(under.hourlyDifference, -2.05);
});

// ---- Other trades -----------------------------------------------------------

test("manufacturing (boilermaker) matches MA000010 cl 21.6 and the pay guide", () => {
  const s = S("boilermaker");
  assert.equal(spokeRate(s, 1, "not-completed").hourly, 14.73);
  assert.equal(spokeRate(s, 1, "completed").weekly, 615.51);
  assert.equal(spokeRate(s, 2, "completed").hourly, 19.14);
  assert.equal(spokeRate(s, 3, "completed").weekly, 839.33);
  assert.equal(spokeRate(s, 4, "not-completed").weekly, 984.81);
  // Stage 4 with Year 12 is the C12/V3 rate.
  assert.equal(spokeRate(s, 4, "completed").weekly, 1029.1);
  assert.equal(spokeRate(s, 4, "completed").hourly, 27.08);
  assert.equal(Math.round((1029.1 - 984.81) * 100) / 100, 44.29);
  assert.deepEqual(STAGE_LIST.map((st) => spokeAdultRate(s, st)!.weekly), [895.28, 978.1, 1004.9, 1029.1]);
  assert.equal(spokeAdultRate(s, 3)!.hourly, 26.44);
});

test("boilermaker tool allowance: $17.90 x 50/60/75/88 (our arithmetic), all-purpose, equal to the pay guide's hourly figures / 38", () => {
  const b = S("boilermaker");
  const sc = b.allowances[0];
  assert.ok(sc.allPurpose);
  const weekly = STAGE_LIST.map((s) => scenarioAllowance(sc, s));
  assert.deepEqual(weekly, [8.95, 10.74, 13.43, 15.75]);
  assert.equal(MANUFACTURING_TOOL_ALLOWANCE, 17.9);
  weekly.forEach((w, i) => assert.equal(Math.round((w / 38) * 100) / 100, MANUFACTURING_TOOL_HOURLY_PAY_GUIDE[i]));
  // 96-point fabrication plan: 25/50/75% = 24/48/72 points (fact text).
  assert.deepEqual([25, 50, 75].map((p) => (96 * p) / 100), [24, 48, 72]);
  assert.equal(b.qualification.code, "MEM31925");
});

test("meat industry (butcher) matches MA000059 cl 16.3, 16.4 and the pay guide", () => {
  const s = S("butcher");
  assert.equal(spokeRate(s, 1, "not-completed").weekly, 559.55);
  assert.equal(spokeRate(s, 2, "completed").weekly, 727.42);
  assert.equal(spokeRate(s, 3, "completed").pct, 85);
  assert.equal(spokeRate(s, 3, "not-completed").weekly, 951.24);
  assert.equal(spokeRate(s, 3, "completed").hourly, 25.03);
  assert.equal(spokeRate(s, 4, "completed").weekly, 1063.15);
  assert.equal(spokeRate(s, 4, "completed").hourly, 27.98);
  assert.deepEqual(STAGE_LIST.map((st) => spokeAdultRate(s, st)!.weekly), [895.28, 978.1, 978.1, 1063.15]);
  // 3rd-year comparison in the facts: 951.24 - 839.33.
  assert.equal(Math.round((951.24 - spokeRate(S("carpenter"), 3, "completed").weekly) * 100) / 100, 111.91);
});

test("penalty tables reproduce the FWO pay guide / award schedule figures", () => {
  // Year 12 rows, columns in the order the spoke declares them.
  const want: Record<string, number[][]> = {
    mechanic: [[24.3, 32.4, 40.5], [28.71, 38.28, 47.85], [33.14, 44.18, 55.23], [38.88, 51.84, 64.8]], // MA000089 B.5.1
    plumber: [[27.17, 36.22, 36.22, 45.28], [31.8, 42.4, 42.4, 53.0], [34.13, 45.5, 45.5, 56.88], [43.4, 57.86, 57.86, 72.33]], // MA000036 E.2.1(b)
    hairdresser: [[21.55, 32.4, 40.5], [25.46, 38.28, 47.85], [30.16, 45.36, 56.7], [35.26, 53.02, 66.28]], // MA000005 pay guide
    chef: [[20.25, 24.3, 36.45], [23.93, 28.71, 43.07], [29.45, 35.34, 53.01], [34.98, 41.97, 62.96]], // MA000009 pay guide
    butcher: [[20.25, 24.3], [23.93, 28.71], [31.29, 37.55], [34.98, 41.97]], // MA000059 pay guide, meat retail
  };
  for (const [slug, rows] of Object.entries(want)) {
    const s = S(slug);
    assert.ok(s.penalty, `${slug} has a penalty table`);
    STAGE_LIST.forEach((stage, i) => {
      const hourly = spokeRate(s, stage, "completed").hourly;
      assert.deepEqual(s.penalty!.columns.map((c) => penaltyAt(hourly, c.pct)), rows[i], `${slug} stage ${stage}`);
    });
  }
  // Without Year 12 (B.5.1 and the meat retail pay guide print these too).
  assert.equal(penaltyHourly(14.73, "saturday"), 22.1);
  assert.equal(penaltyHourly(14.73, "sunday"), 29.46);
  assert.equal(penaltyHourly(14.73, "publicHoliday"), 36.83);
  assert.equal(penaltyHourly(17.67, "publicHoliday"), 44.18);
  assert.equal(penaltyAt(14.73, 125), 18.41);
  assert.equal(penaltyAt(14.73, 133), 19.59);
  // Plumbing without Year 12, first year (E.2.1(b)).
  assert.deepEqual([150, 200, 200, 250].map((p) => penaltyAt(16.56, p)), [24.84, 33.12, 33.12, 41.4]);
});

test("conditional tool allowances: mechanic by year, hairdresser flat, chef weekly cap; none of them all-purpose", () => {
  const m = S("mechanic").allowances[0];
  assert.deepEqual(STAGE_LIST.map((s) => scenarioAllowance(m, s)), [5.88, 7.59, 10.46, 12.14]);
  const h = S("hairdresser").allowances[0];
  assert.deepEqual(STAGE_LIST.map((s) => scenarioAllowance(h, s)), [10.52, 10.52, 10.52, 10.52]);
  const c = S("chef").allowances[0];
  assert.deepEqual(STAGE_LIST.map((s) => scenarioAllowance(c, s)), [9.94, 9.94, 9.94, 9.94]);
  assert.ok(5 * 2.03 > 9.94 && 4 * 2.03 < 9.94); // the $9.94 cap is reached on the fifth day
  for (const sc of [m, h, c]) assert.equal(sc.allPurpose, false);
  assert.equal(S("plumber").allowances.length, 0);
  assert.equal(S("butcher").allowances.length, 0);
});

test("adult notes: every spoke without an adult table has one, with the pay guide figures", () => {
  for (const s of APPRENTICE_SPOKES) {
    const t = getTrade(s.tradeSlug)!;
    if (!t.adult) {
      assert.ok(ADULT_NOTES[s.slug], `${s.slug} has an adult note`);
      assert.ok(ADULT_FAQ_ANSWERS[s.slug], `${s.slug} has an adult FAQ answer`);
    }
  }
  // Plumbing: NMW $1,004.90 + industry allowance $41.41 = $1,046.31 ($27.53).
  assert.equal(Math.round((1004.9 + 41.41) * 100) / 100, 1046.31);
  assert.ok(ADULT_NOTES.plumber!.includes("$1,046.31") && ADULT_NOTES.plumber!.includes("$27.53"));
  // Hair: 80% of $1,119.10 then Level 1 $1,056.80.
  assert.ok(ADULT_NOTES.hairdresser!.includes("$895.28") && ADULT_NOTES.hairdresser!.includes("$1,056.80"));
  // Cookery: 80%, Introductory level $978.10, then 95% in 4th year.
  assert.ok(ADULT_NOTES.chef!.includes("$978.10") && ADULT_NOTES.chef!.includes("$27.98"));
});

test("qualifications: one current national code per spoke, all different", () => {
  const codes: Record<string, string> = {
    carpenter: "CPC30326",
    bricklayer: "CPC33020",
    painter: "CPC30620",
    plumber: "CPC32420",
    mechanic: "AUR30620",
    hairdresser: "SHB30416",
    chef: "SIT30821",
    boilermaker: "MEM31925",
    butcher: "AMP30815",
  };
  for (const s of APPRENTICE_SPOKES) {
    assert.equal(s.qualification.code, codes[s.slug]);
    assert.equal(s.qualification.url, `https://training.gov.au/training/details/${codes[s.slug]}`);
  }
});

test("uniqueness: each spoke has its own lead, facts and FAQs, and the building leads differ in their opening figures", () => {
  const leads = APPRENTICE_SPOKES.map((s) => s.lead);
  assert.equal(new Set(leads).size, leads.length);
  const allFacts = APPRENTICE_SPOKES.flatMap((s) => s.facts);
  assert.equal(new Set(allFacts).size, allFacts.length, "no fact paragraph is repeated across spokes");
  const allFaqs = APPRENTICE_SPOKES.flatMap((s) => s.faqs.map((f) => f.q));
  assert.equal(new Set(allFaqs).size, allFaqs.length);
  const year1 = ["carpenter", "bricklayer", "painter"].map((slug) => headlineRate(S(slug), 1, "completed").hourly);
  assert.deepEqual(year1, [19.05, 18.73, 18.23]);
});

test("headline junior figures", () => {
  assert.equal(spokeRate(S("plumber"), 1, "completed").hourly, 18.11);
  assert.equal(spokeRate(S("plumber"), 1, "completed").weekly, 688.01);
  assert.equal(spokeRate(S("mechanic"), 4, "completed").hourly, 25.92);
  assert.equal(spokeRate(S("hairdresser"), 3, "completed").weekly, 861.71);
  assert.equal(spokeRate(S("chef"), 1, "not-completed").hourly, 16.2);
  assert.equal(spokeRate(S("chef"), 4, "completed").weekly, 1063.15);
  // Non-building spokes lead with the award rate itself.
  assert.deepEqual(headlineRate(S("mechanic"), 1, "completed"), { weekly: 615.51, hourly: 16.2 });
});
