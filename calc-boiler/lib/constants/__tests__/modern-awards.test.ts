// =============================================================================
// Fast Food (MA000003), Pharmacy (MA000012), Manufacturing (MA000010),
// Security (MA000016) and Clerks (MA000002) — Fair Work conformance tests.
//
// Anchors are the consolidated award texts "incorporating all amendments up to
// and including 1 July 2026", transcribed 23 September 2026, and the junior
// determinations PR813654–PR813656 made 26 August 2026.
// =============================================================================

import { test } from "node:test";
import assert from "node:assert/strict";

import {
  CLERKS_AWARD,
  FAST_FOOD_AWARD,
  FAST_FOOD_PUBLISHED_JUNIOR_L1,
  JUNIOR_PHASE_IN,
  MANUFACTURING_AWARD,
  MODERN_AWARDS,
  PHARMACY_AWARD,
  SECURITY_AWARD,
  findAwardRate,
  juniorHourly,
  penaltyDollars,
  roundCents,
  type ModernAwardData,
} from "../modern-awards";
import { AWR_2026_FLOORS, HOSPITALITY_ALLOWANCES, RETAIL_ALLOWANCES } from "../hospitality-award";
import { FWO_PUBLISHED_JUNIOR_RATES } from "../junior-rates";
import { AWARD_DIRECTORY } from "../award-directory";

const ALL: readonly ModernAwardData[] = Object.values(MODERN_AWARDS);

// --- Published rates, pinned -------------------------------------------------

test("published weekly and hourly rates are pinned to the award text", () => {
  const pins: [ModernAwardData, string, number, number][] = [
    [FAST_FOOD_AWARD, "Level 1", 1056.8, 27.81],
    [FAST_FOOD_AWARD, "Level 2", 1119.1, 29.45],
    [FAST_FOOD_AWARD, "Level 3 (in charge of one or no person)", 1136.4, 29.91],
    [FAST_FOOD_AWARD, "Level 3 (in charge of 2 or more people)", 1150.4, 30.27],
    [PHARMACY_AWARD, "Pharmacy assistant level 1", 1056.8, 27.81],
    [PHARMACY_AWARD, "Pharmacy assistant level 4", 1165.1, 30.66],
    [PHARMACY_AWARD, "Pharmacy intern — 2nd half of training", 1335.5, 35.14],
    [PHARMACY_AWARD, "Pharmacist", 1586.3, 41.74],
    [PHARMACY_AWARD, "Pharmacist manager", 1981.6, 52.15],
    [MANUFACTURING_AWARD, "C14 / V1", 978.1, 25.74],
    [MANUFACTURING_AWARD, "C13 / V2", 1004.9, 26.44],
    [MANUFACTURING_AWARD, "C10 / V5", 1119.1, 29.45],
    [MANUFACTURING_AWARD, "C2(b) / V14", 1513.7, 39.83],
    [MANUFACTURING_AWARD, "D4 (driver)", 1118.0, 29.42],
    [SECURITY_AWARD, "Security Officer Level 1", 1080.1, 28.42],
    [SECURITY_AWARD, "Security Officer Level 5", 1185.7, 31.2],
    [CLERKS_AWARD, "Level 1 — Year 1", 1024.7, 26.97],
    [CLERKS_AWARD, "Level 2 — Year 1", 1119.1, 29.45],
    [CLERKS_AWARD, "Call centre technical associate", 1415.1, 37.24],
  ];
  for (const [award, level, weekly, hourly] of pins) {
    const r = findAwardRate(award, level);
    assert.equal(r.weekly, weekly, `${award.meta.code} ${level} weekly`);
    assert.equal(r.hourly, hourly, `${award.meta.code} ${level} hourly`);
  }
});

test("row counts match the award tables", () => {
  assert.equal(FAST_FOOD_AWARD.rates.length, 4);
  assert.equal(PHARMACY_AWARD.rates.length, 14);
  assert.equal(MANUFACTURING_AWARD.rates.length, 19);
  assert.equal(SECURITY_AWARD.rates.length, 5);
  assert.equal(CLERKS_AWARD.rates.length, 10);
});

test("hourly is weekly / 38 to the cent for every classification", () => {
  for (const award of ALL) {
    for (const r of award.rates) {
      const derived = roundCents(r.weekly / 38);
      assert.ok(Math.abs(derived - r.hourly) <= 0.01, `${award.meta.code} ${r.level}: ${derived} vs ${r.hourly}`);
    }
  }
});

test("no adult rate sits below the 2026 entry-level floor", () => {
  for (const award of ALL) {
    for (const r of award.rates) {
      assert.ok(r.weekly >= AWR_2026_FLOORS.entryLevelWeekly, `${award.meta.code} ${r.level}`);
    }
  }
  // C14 sits exactly on the entry-level floor, C13 on the ongoing floor.
  assert.equal(findAwardRate(MANUFACTURING_AWARD, "C14 / V1").weekly, AWR_2026_FLOORS.entryLevelWeekly);
  assert.equal(findAwardRate(MANUFACTURING_AWARD, "C13 / V2").weekly, AWR_2026_FLOORS.ongoingWeekly);
});

test("every award is consolidated to 1 July 2026 and has a unique route", () => {
  const hrefs = new Set<string>();
  for (const award of ALL) {
    assert.match(award.meta.consolidatedTo, /^1 July 2026/);
    assert.match(award.meta.code, /^MA0000\d\d$/);
    assert.ok(award.rates.some((r) => r.level === award.entryLevel), `${award.meta.code} entry level exists`);
    assert.ok(!hrefs.has(award.meta.href));
    hrefs.add(award.meta.href);
  }
});

// --- Casual penalties --------------------------------------------------------

test("additive awards: casual penalty = full-time penalty + 25%", () => {
  for (const award of ALL.filter((a) => a.casualPenaltyBasis === "additive")) {
    for (const p of award.penalties) {
      assert.equal(roundCents(p.casual - p.fullTime), 0.25, `${award.meta.code} ${p.label}`);
    }
    for (const c of award.matrix) {
      assert.equal(roundCents(c.casual - c.fullTime), 0.25, `${award.meta.code} matrix ${c.label}`);
    }
  }
});

test("manufacturing compounds: casual 150% is applied to the casual rate (Schedule C.3.2)", () => {
  assert.equal(MANUFACTURING_AWARD.casualPenaltyBasis, "compounded");
  const c14 = findAwardRate(MANUFACTURING_AWARD, "C14 / V1");
  const casual = roundCents(c14.hourly * 1.25);
  assert.equal(casual, 32.18);
  assert.equal(penaltyDollars(casual, 1.5), 48.27);
  assert.equal(penaltyDollars(casual, 2.0), 64.36);
  assert.equal(penaltyDollars(casual, 2.5), 80.45);
  // The additive model would give 25.74 x 1.75 = 45.05 — materially lower.
  assert.notEqual(penaltyDollars(c14.hourly, 1.75), 48.27);
});

test("fast food Sunday splits by level", () => {
  const sunL1 = FAST_FOOD_AWARD.penalties.find((p) => p.label.startsWith("Sunday (Level 1"))!;
  const sunL23 = FAST_FOOD_AWARD.penalties.find((p) => p.label.startsWith("Sunday (Level 2"))!;
  assert.equal(sunL1.fullTime, 1.25);
  assert.equal(sunL23.fullTime, 1.5);
  const matrixL1 = FAST_FOOD_AWARD.matrix.find((c) => c.label === "Sunday (Level 1)")!;
  assert.deepEqual(matrixL1.appliesTo, ["Level 1"]);
});

test("security night rate is 121.7%, and casual Table 7 figure matches the award example", () => {
  const night = SECURITY_AWARD.penalties[0];
  assert.equal(night.fullTime, 1.217);
  assert.equal(night.casual, 1.467);
  // cl 20 Example 4: "$28.42 x 146.7% = $41.69"
  assert.equal(penaltyDollars(28.42, 1.467), 41.69);
  // cl 17.4 Example 2: "$29.73 x 121.7% = $36.18"
  assert.equal(penaltyDollars(29.73, 1.217), 36.18);
});

test("casual overtime: loading included for Fast Food and Clerks, not published for Pharmacy or Security", () => {
  for (const award of [FAST_FOOD_AWARD, CLERKS_AWARD]) {
    for (const o of award.overtime) assert.equal(roundCents((o.casual ?? 0) - o.fullTime), 0.25);
  }
  for (const award of [PHARMACY_AWARD, SECURITY_AWARD]) {
    for (const o of award.overtime) assert.equal(o.casual, null);
  }
});

// --- Junior rates ------------------------------------------------------------

test("Security has no junior rates; the others do", () => {
  assert.equal(SECURITY_AWARD.junior, null);
  assert.ok(SECURITY_AWARD.noJuniorNote);
  for (const a of [FAST_FOOD_AWARD, PHARMACY_AWARD, MANUFACTURING_AWARD, CLERKS_AWARD]) assert.ok(a.junior);
});

test("fast food junior dollars reproduce Fair Work's Schedule A figures", () => {
  const l1 = findAwardRate(FAST_FOOD_AWARD, "Level 1");
  const scale = FAST_FOOD_AWARD.junior!.scale;
  for (const pub of FAST_FOOD_PUBLISHED_JUNIOR_L1.current) {
    const band = scale.find((b) => b.age === pub.age)!;
    const hourly = juniorHourly(l1.weekly, band.percentage);
    assert.equal(hourly, pub.hourly, `age ${pub.age}`);
    if ("casual" in pub) assert.equal(roundCents(hourly * 1.25), pub.casual);
  }
  for (const pub of FAST_FOOD_PUBLISHED_JUNIOR_L1.fromDecember2026) {
    assert.equal(juniorHourly(l1.weekly, pub.percentage), pub.hourly, pub.age);
  }
});

test("manufacturing juniors are a percentage of C13 and reproduce the FWO junior table", () => {
  const j = MANUFACTURING_AWARD.junior!;
  assert.equal(j.baseLevel, "C13 / V2");
  const c13 = findAwardRate(MANUFACTURING_AWARD, "C13 / V2");
  for (const pub of FWO_PUBLISHED_JUNIOR_RATES) {
    const band = j.scale.find((b) => b.age === pub.age)!;
    assert.equal(juniorHourly(c13.weekly, band.percentage), pub.hourly, `age ${pub.age}`);
  }
});

test("pharmacy juniors apply to assistant levels 1 and 2 only", () => {
  assert.match(PHARMACY_AWARD.junior!.appliesTo, /levels 1 and 2 only/);
});

test("junior phase-in: fast food and retail move 5 points a half-year, pharmacy 10 a year", () => {
  const ff = JUNIOR_PHASE_IN.fastFood;
  const rt = JUNIOR_PHASE_IN.retail;
  const ph = JUNIOR_PHASE_IN.pharmacy;
  assert.deepEqual([...ff.age18], [75, 80, 85, 90, 95, 100]);
  assert.deepEqual([...ff.age19], [85, 90, 95, 100, 100, 100]);
  assert.deepEqual([...ff.age20], [95, 100, 100, 100, 100, 100]);
  assert.deepEqual([...rt.age18], [...ff.age18]);
  // Retail 20-year-olds with more than 6 months were already on the adult rate.
  assert.deepEqual([...rt.age20], [100, 100, 100, 100, 100, 100]);
  assert.deepEqual([...ph.age18], [75, 85, 95, 100]);
  assert.deepEqual([...ph.age19], [85, 95, 100, 100]);
  assert.deepEqual([...ph.age20], [95, 100, 100, 100]);
  for (const s of [ff, rt, ph]) {
    assert.equal(s.periods.length, s.age18.length);
    assert.deepEqual(s.qualifyingPeriod, { age18: 70, age19: 80, age20: 90 });
  }
  // It is a phase-in, NOT the adult rate on 1 December 2026.
  assert.notEqual(ff.age18[0], 100);
  assert.notEqual(ff.age19[0], 100);
  assert.equal(JUNIOR_PHASE_IN.commences, "1 December 2026");
});

// --- Allowances --------------------------------------------------------------

test("allowances are positive, cited, and key figures are pinned", () => {
  for (const award of ALL) {
    assert.ok(award.allowances.length > 0);
    for (const a of award.allowances) {
      assert.ok(a.amount > 0, `${award.meta.code} ${a.name}`);
      assert.match(a.clause, /^cl \d/);
    }
  }
  const find = (award: ModernAwardData, prefix: string) => award.allowances.find((a) => a.name.startsWith(prefix))!.amount;
  assert.equal(find(FAST_FOOD_AWARD, "Meal allowance"), 17.33);
  assert.equal(find(PHARMACY_AWARD, "Home medicine"), 106.4);
  assert.equal(find(MANUFACTURING_AWARD, "Tool allowance — tradesperson"), 17.9);
  assert.equal(find(SECURITY_AWARD, "Firearm"), 3.84);
  assert.equal(find(CLERKS_AWARD, "First aid"), 16.79);
  assert.equal(HOSPITALITY_ALLOWANCES.find((a) => a.name.startsWith("Meal"))!.amount, 17.42);
  assert.equal(RETAIL_ALLOWANCES.find((a) => a.name.startsWith("Meal"))!.amount, 24.56);
  assert.equal(RETAIL_ALLOWANCES.find((a) => a.name.startsWith("First aid"))!.amount, 14.55);
});

// --- A–Z directory -----------------------------------------------------------

test("award directory is A–Z, covers all eight award pages, and reads rates from constants", () => {
  assert.equal(AWARD_DIRECTORY.length, 8);
  const names = AWARD_DIRECTORY.map((a) => a.name);
  assert.deepEqual(names, [...names].sort((a, b) => a.localeCompare(b, "en-AU")));
  const byCode = new Map(AWARD_DIRECTORY.map((a) => [a.code, a]));
  assert.equal(byCode.get("MA000003")!.headlineHourly, 27.81);
  assert.equal(byCode.get("MA000009")!.headlineHourly, 26.44);
  assert.equal(byCode.get("MA000004")!.headlineHourly, 27.81);
  assert.equal(byCode.get("MA000100")!.headlineHourly, 27.55);
  assert.equal(byCode.get("MA000002")!.headlineHourly, 26.97);
  assert.equal(byCode.get("MA000016")!.headlineHourly, 28.42);
  assert.equal(byCode.get("MA000010")!.headlineHourly, 25.74);
  for (const a of AWARD_DIRECTORY) {
    assert.match(a.href, /^\/[a-z-]+\/$/);
    assert.ok(a.covers.length > 0, a.code);
  }
});
