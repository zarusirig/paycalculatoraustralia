// =============================================================================
// T4 awards batch 3 — Restaurant (MA000119), Nurses (MA000034), Aged Care
// (MA000018), Hair and Beauty (MA000005), Cleaning Services (MA000022) and
// Road Transport and Distribution (MA000038). Fair Work conformance tests.
//
// Anchors, transcribed 23 September 2026:
//   - each award's own Schedule B / C "Summary of Hourly Rates of Pay"
//     (consolidated to 1 July 2026, or 1 August 2026 for Nurses);
//   - the Cleaning award's own worked example (cl 20, Example 1);
//   - the FWO pay guide for the Aged Care Award published 31 August 2026,
//     because that award has no hourly summary schedule;
//   - lib/data/nursing-pay/nurses-award-2020.ts, an independent transcription
//     of the Nurses Award made 28 August 2026.
// =============================================================================

import { test } from "node:test";
import assert from "node:assert/strict";

import {
  AGED_CARE_AWARD,
  AGED_CARE_STANDARD_RATE,
  CLEANING_AWARD,
  HAIR_BEAUTY_AWARD,
  MODERN_AWARDS,
  NURSES_AWARD,
  RESTAURANT_AWARD,
  ROAD_TRANSPORT_AWARD,
  findAwardRate,
  juniorHourlyFor,
  penaltyDollars,
  roundCents,
  roundToStep,
  type ModernAwardData,
} from "../modern-awards";
import { NURSES_AWARD_AGED_CARE, NURSES_AWARD_GENERAL } from "../../data/nursing-pay/nurses-award-2020";
import { AWARD_DIRECTORY } from "../award-directory";

const BATCH: readonly ModernAwardData[] = [
  RESTAURANT_AWARD,
  NURSES_AWARD,
  AGED_CARE_AWARD,
  HAIR_BEAUTY_AWARD,
  CLEANING_AWARD,
  ROAD_TRANSPORT_AWARD,
];

const rate = (a: ModernAwardData, level: string) => findAwardRate(a, level);
const casualOf = (a: ModernAwardData, level: string) => roundCents(rate(a, level).hourly * 1.25);

// --- Registry ----------------------------------------------------------------

test("batch 3 awards are registered under their keys with the expected routes and codes", () => {
  const expected: [string, string, string][] = [
    ["restaurant", "MA000119", "/restaurant-award-rates/"],
    ["nurses", "MA000034", "/nurses-award-rates/"],
    ["aged-care", "MA000018", "/aged-care-award-rates/"],
    ["hair-and-beauty", "MA000005", "/hair-and-beauty-award-rates/"],
    ["cleaning", "MA000022", "/cleaning-award-rates/"],
    ["road-transport", "MA000038", "/road-transport-award-rates/"],
  ];
  for (const [key, code, href] of expected) {
    const a = (MODERN_AWARDS as Record<string, ModernAwardData>)[key];
    assert.ok(a, key);
    assert.equal(a.key, key);
    assert.equal(a.meta.code, code);
    assert.equal(a.meta.href, href);
    assert.ok(AWARD_DIRECTORY.some((d) => d.code === code && d.href === href), `${code} in A–Z directory`);
  }
});

test("row counts match the award tables", () => {
  assert.equal(RESTAURANT_AWARD.rates.length, 7);
  assert.equal(NURSES_AWARD.rates.length, 67);
  assert.equal(AGED_CARE_AWARD.rates.length, 17);
  assert.equal(HAIR_BEAUTY_AWARD.rates.length, 6);
  assert.equal(CLEANING_AWARD.rates.length, 3);
  assert.equal(ROAD_TRANSPORT_AWARD.rates.length, 14);
  for (const a of BATCH) assert.equal(new Set(a.rates.map((r) => r.level)).size, a.rates.length, `${a.meta.code} unique levels`);
});

// --- Restaurant (Schedule B) -------------------------------------------------

test("restaurant: Table 3 rates and Schedule B.1.1 full-time penalty dollars", () => {
  const pins: [string, number, number][] = [
    ["Introductory Level", 978.1, 25.74],
    ["Level 1", 1004.9, 26.44],
    ["Level 2", 1029.1, 27.08],
    ["Level 3", 1062.9, 27.97],
    ["Level 4", 1119.1, 29.45],
    ["Level 5", 1189.4, 31.3],
    ["Level 6", 1221.1, 32.13],
  ];
  for (const [level, weekly, hourly] of pins) {
    assert.equal(rate(RESTAURANT_AWARD, level).weekly, weekly);
    assert.equal(rate(RESTAURANT_AWARD, level).hourly, hourly);
  }
  const intro = rate(RESTAURANT_AWARD, "Introductory Level").hourly;
  assert.equal(penaltyDollars(intro, 1.25), 32.18);
  assert.equal(penaltyDollars(intro, 1.5), 38.61);
  assert.equal(penaltyDollars(intro, 2.25), 57.92);
  assert.equal(penaltyDollars(rate(RESTAURANT_AWARD, "Level 6").hourly, 2.25), 72.29);
});

test("restaurant: casual Sunday is 150% for Introductory–Level 2 and 175% for Levels 3–6 (B.1.3)", () => {
  const low = RESTAURANT_AWARD.penalties.find((p) => p.label.startsWith("Sunday — Introductory"))!;
  const high = RESTAURANT_AWARD.penalties.find((p) => p.label.startsWith("Sunday — Levels 3"))!;
  assert.equal(low.casual, 1.5);
  assert.equal(high.casual, 1.75);
  assert.deepEqual([...low.appliesTo!], ["Introductory Level", "Level 1", "Level 2"]);
  assert.deepEqual([...high.appliesTo!], ["Level 3", "Level 4", "Level 5", "Level 6"]);
  const l1 = rate(RESTAURANT_AWARD, "Level 1").hourly;
  assert.equal(penaltyDollars(l1, 1.25), 33.05); // casual ordinary
  assert.equal(penaltyDollars(l1, low.casual), 39.66);
  assert.equal(penaltyDollars(l1, 2.5), 66.1);
  assert.equal(penaltyDollars(rate(RESTAURANT_AWARD, "Level 3").hourly, high.casual), 48.95);
  assert.equal(penaltyDollars(rate(RESTAURANT_AWARD, "Level 6").hourly, high.casual), 56.23);
});

test("restaurant: weeknight penalties are flat dollars (Table 8, Schedule C.3 = 10% / 15% of Level 4)", () => {
  const late = RESTAURANT_AWARD.penalties.find((p) => p.label.includes("10.00 pm to midnight"))!;
  const early = RESTAURANT_AWARD.penalties.find((p) => p.label.includes("midnight to 6.00 am"))!;
  assert.equal(late.flatPerHour, 2.95);
  assert.equal(early.flatPerHour, 4.42);
  const l4 = rate(RESTAURANT_AWARD, "Level 4").hourly;
  assert.equal(roundCents(l4 * 0.1), 2.95);
  assert.equal(roundCents(l4 * 0.15), 4.42);
});

test("restaurant: casual overtime carries no loading (B.1.4 prints full-time dollars)", () => {
  for (const o of RESTAURANT_AWARD.overtime) {
    if (o.casual !== null) assert.equal(o.casual, o.fullTime, o.label);
  }
  const l1 = rate(RESTAURANT_AWARD, "Level 1").hourly;
  assert.equal(penaltyDollars(l1, 1.5), 39.66);
  assert.equal(penaltyDollars(l1, 1.75), 46.27);
  assert.equal(penaltyDollars(l1, 2), 52.88);
});

test("restaurant: junior weekly rates round to 10 cents first, reproducing Schedule B.2.2", () => {
  const scale = RESTAURANT_AWARD.junior!.scale;
  const pctOf = (age: string) => scale.find((b) => b.age === age)!.percentage;
  const pins: [string, string, number][] = [
    ["Introductory Level", "Under 17", 12.87],
    ["Introductory Level", "17", 15.44],
    ["Introductory Level", "18", 18.02],
    ["Introductory Level", "19", 21.88],
    ["Level 1", "Under 17", 13.22],
    ["Level 1", "19", 22.48],
    ["Level 2", "18", 18.96],
    ["Level 4", "19", 25.03],
    ["Level 5", "18", 21.91],
    // 1189.40 x 85% = 1010.99 -> $1011.00 (cl 18.2(b)) / 38 = 26.61. Unrounded it would be 26.60.
    ["Level 5", "19", 26.61],
  ];
  for (const [level, age, hourly] of pins) {
    assert.equal(juniorHourlyFor(RESTAURANT_AWARD, rate(RESTAURANT_AWARD, level), pctOf(age)), hourly, `${level} ${age}`);
  }
  assert.equal(roundToStep(1010.99, 0.1), 1011);
  assert.equal(roundToStep(831.385, 0.1), 831.4);
  assert.equal(RESTAURANT_AWARD.junior!.adultAge, 20);
});

// --- Nurses (Schedule B) -----------------------------------------------------

test("nurses: rates agree with the independent nursing-pay transcription (both streams)", () => {
  const general = NURSES_AWARD_GENERAL.flatMap((s) => s.points);
  const aged = NURSES_AWARD_AGED_CARE.flatMap((s) => s.points);
  const mine = new Set(NURSES_AWARD.rates.map((r) => `${r.weekly}|${r.hourly}`));
  for (const p of [...general, ...aged]) {
    assert.ok(mine.has(`${p.weekly}|${p.hourly}`), `${p.label} ${p.weekly} ${p.hourly}`);
  }
  assert.equal(rate(NURSES_AWARD, "Registered nurse level 1 — pay point 1").weekly, 1219.5);
  assert.equal(rate(NURSES_AWARD, "Aged care registered nurse level 1 — first year at level").hourly, 41.36);
  assert.equal(rate(NURSES_AWARD, "Aged care registered nurse level 5").hourly, 71.35);
  assert.equal(rate(NURSES_AWARD, "Student enrolled nurse — under 21").hourly, 25.69);
  assert.equal(rate(NURSES_AWARD, "Senior occupational health clinical nurse").weekly, 1580.3);
});

test("nurses: shift loadings add for casuals, weekends and public holidays compound (B.1.3)", () => {
  const rn = rate(NURSES_AWARD, "Registered nurse level 1 — pay point 1").hourly;
  const cas = casualOf(NURSES_AWARD, "Registered nurse level 1 — pay point 1");
  assert.equal(cas, 40.11);
  // Full-time: 32.09 | 36.10 | 36.90 | 48.14 | 56.16 | 64.18
  assert.deepEqual([1.125, 1.15, 1.5, 1.75, 2].map((m) => penaltyDollars(rn, m)), [36.1, 36.9, 48.14, 56.16, 64.18]);
  // Casual: 44.12 | 44.93 additive on the minimum rate …
  const aft = NURSES_AWARD.penalties.find((p) => p.label.startsWith("Afternoon"))!;
  const night = NURSES_AWARD.penalties.find((p) => p.label.startsWith("Night"))!;
  assert.equal(aft.casualBasis, "additive");
  assert.equal(penaltyDollars(rn, aft.casual), 44.12);
  assert.equal(penaltyDollars(rn, night.casual), 44.93);
  // … 60.17 | 70.19 | 80.22 compounded on the rounded casual rate.
  assert.equal(NURSES_AWARD.casualPenaltyBasis, "compounded");
  assert.deepEqual([1.5, 1.75, 2].map((m) => penaltyDollars(cas, m)), [60.17, 70.19, 80.22]);
  // The compounded Sunday is NOT 32.09 x 218.75% (70.20): order matters.
  assert.notEqual(penaltyDollars(rn, 2.1875), 70.19);
});

test("nurses: other Schedule B anchors (EN, nursing assistant, nurse practitioner, overtime)", () => {
  const en = casualOf(NURSES_AWARD, "Enrolled nurse — pay point 1");
  assert.deepEqual([en, penaltyDollars(en, 1.5), penaltyDollars(en, 1.75), penaltyDollars(en, 2)], [37.5, 56.25, 65.63, 75]);
  const na = rate(NURSES_AWARD, "Nursing assistant — 1st year").hourly;
  assert.deepEqual([penaltyDollars(na, 1.25), penaltyDollars(na, 1.375), penaltyDollars(na, 1.4)], [34.56, 38.02, 38.71]);
  const np = casualOf(NURSES_AWARD, "Nurse practitioner — 1st year");
  assert.deepEqual([np, penaltyDollars(np, 1.5), penaltyDollars(np, 1.75), penaltyDollars(np, 2)], [61.74, 92.61, 108.05, 123.48]);
  const rn = rate(NURSES_AWARD, "Registered nurse level 1 — pay point 1").hourly;
  assert.deepEqual(NURSES_AWARD.overtime.map((o) => penaltyDollars(rn, o.fullTime)), [48.14, 64.18, 64.18, 80.23]);
});

test("nurses: RN levels 4 and 5 are excluded from shift loadings; no junior rates", () => {
  const aft = NURSES_AWARD.penalties.find((p) => p.label.startsWith("Afternoon"))!;
  assert.ok(!aft.appliesTo!.some((l) => /registered nurse level [45]/i.test(l)));
  assert.ok(aft.appliesTo!.includes("Registered nurse level 3 — pay point 1"));
  assert.ok(aft.appliesTo!.includes("Aged care registered nurse level 3"));
  assert.equal(NURSES_AWARD.junior, null);
  assert.ok(NURSES_AWARD.casualRuleSummary);
  assert.match(NURSES_AWARD.meta.consolidatedTo, /^1 August 2026/);
});

// --- Aged Care (FWO pay guide, 31 August 2026) --------------------------------

test("aged care: hourly is weekly / 38 and reproduces the FWO pay guide", () => {
  const pins: [string, number, number][] = [
    ["General — level 1", 1055.4, 27.77],
    ["General — level 7", 1278.6, 33.65],
    ["Direct care — level 1 (Introductory)", 1239.0, 32.61],
    ["Direct care — level 3 (Qualified)", 1376.7, 36.23],
    ["Direct care — level 6 (Team Leader)", 1541.9, 40.58],
  ];
  for (const [level, weekly, hourly] of pins) {
    assert.equal(rate(AGED_CARE_AWARD, level).weekly, weekly);
    assert.equal(rate(AGED_CARE_AWARD, level).hourly, hourly, level);
  }
  assert.ok(AGED_CARE_AWARD.meta.hourlyDerivation);
});

test("aged care: penalty and overtime dollars match the FWO pay guide", () => {
  const g1 = rate(AGED_CARE_AWARD, "General — level 1").hourly;
  // Full-time: Saturday, Sunday, public holiday, overtime first 2 / after 2.
  assert.deepEqual([1.5, 1.75, 2.5, 1.5, 2].map((m) => penaltyDollars(g1, m)), [41.66, 48.6, 69.43, 41.66, 55.54]);
  // Shift allowances: 10am–1pm 10%, 1pm–4pm 12.5%, 4pm–4am 15%, 4am–6am 10%.
  assert.deepEqual([1.1, 1.125, 1.15, 1.1].map((m) => penaltyDollars(g1, m)), [30.55, 31.24, 31.94, 30.55]);
  // Casual: ordinary, Saturday, Sunday, public holiday, and shift (loading added).
  assert.deepEqual([1.25, 1.75, 2, 2.75, 1.35, 1.375, 1.4].map((m) => penaltyDollars(g1, m)), [34.71, 48.6, 55.54, 76.37, 37.49, 38.18, 38.88]);
  // Casual overtime is set in terms at 187.5% / 250% / 312.5% (cl 25.1(c)).
  assert.deepEqual(AGED_CARE_AWARD.overtime.map((o) => o.casual), [1.875, 2.5, 2.5, 3.125]);
  assert.deepEqual([1.875, 2.5].map((m) => penaltyDollars(g1, m)), [52.07, 69.43]);
  const dc1 = rate(AGED_CARE_AWARD, "Direct care — level 1 (Introductory)").hourly;
  assert.deepEqual([1.25, 1.5, 1.75, 2.75].map((m) => penaltyDollars(dc1, m)), [40.76, 48.92, 57.07, 89.68]);
});

test("aged care: standard-rate allowances reproduce the pay guide; no junior rates", () => {
  assert.equal(AGED_CARE_STANDARD_RATE, rate(AGED_CARE_AWARD, "General — level 6").weekly);
  const find = (prefix: string) => AGED_CARE_AWARD.allowances.find((a) => a.name.startsWith(prefix))!.amount;
  assert.equal(find("Sleepover"), 65.31);
  assert.equal(find("Nauseous"), 0.63);
  // Pay guide prints leading hand per hour: weekly / 38.
  assert.equal(roundCents(find("Leading hand — in charge of 2 to 5") / 38), 0.88);
  assert.equal(roundCents(find("Leading hand — in charge of 6 to 10") / 38), 1.26);
  assert.equal(roundCents(find("Leading hand — in charge of 11 to 15") / 38), 1.59);
  assert.equal(roundCents(find("Leading hand — in charge of 16") / 38), 1.94);
  assert.equal(find("Vehicle allowance — 1 September 2026"), 1.05);
  assert.equal(AGED_CARE_AWARD.junior, null);
});

// --- Hair and Beauty (Schedule B) --------------------------------------------

test("hair and beauty: Saturday 133%, casual 158%, and casual public holiday 250% (B.1.1, B.2.1)", () => {
  const l1 = rate(HAIR_BEAUTY_AWARD, "Level 1").hourly;
  assert.deepEqual([1.33, 2, 2.5].map((m) => penaltyDollars(l1, m)), [36.99, 55.62, 69.53]);
  assert.deepEqual([1.25, 1.5, 1.58, 2.25, 2.5].map((m) => penaltyDollars(l1, m)), [34.76, 41.72, 43.94, 62.57, 69.53]);
  assert.equal(penaltyDollars(rate(HAIR_BEAUTY_AWARD, "Level 6").hourly, 1.58), 50.56);
  const ph = HAIR_BEAUTY_AWARD.penalties.find((p) => p.label.startsWith("Public holiday"))!;
  assert.equal(ph.casual, 2.5);
  assert.equal(ph.casualTabulated, true);
  assert.equal(penaltyDollars(l1, 1.75), 48.67); // casual overtime first 3 hours (B.2.2)
});

test("hair and beauty: juniors reach the adult rate at 18 and reproduce Schedule B.3.2", () => {
  const scale = HAIR_BEAUTY_AWARD.junior!.scale;
  assert.equal(HAIR_BEAUTY_AWARD.junior!.adultAge, 18);
  const pins: [string, number, number][] = [
    ["Level 1", 0.5, 13.91],
    ["Level 1", 0.75, 20.86],
    ["Level 3", 0.5, 14.73],
    ["Level 3", 0.75, 22.09],
    ["Level 6", 0.5, 16.0],
    ["Level 6", 0.75, 24.0],
  ];
  for (const [level, pct, hourly] of pins) {
    assert.ok(scale.some((b) => b.percentage === pct));
    assert.equal(juniorHourlyFor(HAIR_BEAUTY_AWARD, rate(HAIR_BEAUTY_AWARD, level), pct), hourly, `${level} ${pct}`);
  }
});

// --- Cleaning (Schedule B and cl 20 Example 1) -------------------------------

test("cleaning: part-time is its own column, and the award's worked example totals $690.50", () => {
  assert.equal(CLEANING_AWARD.meta.partTimeLoading, 0.15);
  for (const p of CLEANING_AWARD.penalties) assert.ok(p.partTime !== undefined, p.label);
  const l1 = rate(CLEANING_AWARD, "Level 1").hourly;
  assert.equal(l1, 27.08);
  const night = penaltyDollars(l1, CLEANING_AWARD.penalties[0].partTime!);
  const sat = penaltyDollars(l1, CLEANING_AWARD.penalties.find((p) => p.label.startsWith("Saturday"))!.partTime!);
  const sun = penaltyDollars(l1, CLEANING_AWARD.penalties.find((p) => p.label.startsWith("Sunday"))!.partTime!);
  assert.deepEqual([night, sat, sun], [35.2, 44.68, 58.22]);
  assert.equal(roundCents(night * 5 + sat * 5 + sun * 5), 690.5);
});

test("cleaning: Schedule B.1.1, B.1.2 and B.1.4 dollars", () => {
  const l1 = rate(CLEANING_AWARD, "Level 1").hourly;
  const l3 = rate(CLEANING_AWARD, "Level 3").hourly;
  const m = CLEANING_AWARD.matrix;
  assert.deepEqual(m.map((c) => penaltyDollars(l1, c.fullTime)), [27.08, 31.14, 35.2, 40.62, 54.16, 67.7]);
  assert.deepEqual(m.map((c) => penaltyDollars(l1, c.partTime!)), [31.14, 35.2, 35.2, 44.68, 58.22, 71.76]);
  assert.deepEqual(m.map((c) => penaltyDollars(l3, c.partTime!)), [33.87, 38.29, 38.29, 48.59, 63.32, 78.04]);
  assert.deepEqual(m.map((c) => penaltyDollars(l1, c.casual)), [33.85, 37.91, 41.97, 47.39, 60.93, 74.47]);
});

test("cleaning: junior rates (trolley collectors only) reproduce Schedule B.2.2", () => {
  const j = CLEANING_AWARD.junior!;
  assert.match(j.appliesTo, /trolley collection contractors only/);
  const l1 = rate(CLEANING_AWARD, "Level 1");
  assert.deepEqual(
    j.scale.filter((b) => b.percentage < 1).map((b) => juniorHourlyFor(CLEANING_AWARD, l1, b.percentage)),
    [12.18, 13.54, 16.25, 18.95, 21.66, 24.37],
  );
  assert.equal(juniorHourlyFor(CLEANING_AWARD, rate(CLEANING_AWARD, "Level 3"), 0.45), 13.25);
});

// --- Road Transport (Schedule C) ---------------------------------------------

test("road transport: Schedule C.2 and C.4 dollars for Grade 1", () => {
  const g1 = rate(ROAD_TRANSPORT_AWARD, "Transport Worker Grade 1").hourly;
  assert.equal(g1, 26.87);
  // Full-time day worker: early morning 130%, Saturday 150%, Sunday 200%.
  assert.deepEqual([1.3, 1.5, 2].map((m) => penaltyDollars(g1, m)), [34.93, 40.31, 53.74]);
  // Shiftworkers: afternoon 117.5%, night 130%, public holiday 250%.
  assert.deepEqual([1.175, 1.3, 2.5].map((m) => penaltyDollars(g1, m)), [31.57, 34.93, 67.18]);
  // Casual: ordinary, early morning, Saturday, Sunday, Good Friday/Christmas, other public holiday, afternoon shift.
  assert.deepEqual([1.25, 1.55, 1.75, 2.25, 3.25, 2.75, 1.425].map((m) => penaltyDollars(g1, m)), [33.59, 41.65, 47.02, 60.46, 87.33, 73.89, 38.29]);
});

test("road transport: casual overtime drops the loading and adds 10% (cl 11.4, C.5.1)", () => {
  const [first2, after2] = ROAD_TRANSPORT_AWARD.overtime;
  assert.equal(first2.casual, 1.6);
  assert.equal(after2.casual, 2.1);
  // cl 11.4 example: $20 an hour -> $32 and $42.
  assert.equal(roundCents(20 * first2.casual!), 32);
  assert.equal(roundCents(20 * after2.casual!), 42);
  const g1 = rate(ROAD_TRANSPORT_AWARD, "Transport Worker Grade 1").hourly;
  const g10 = rate(ROAD_TRANSPORT_AWARD, "Transport Worker Grade 10").hourly;
  assert.deepEqual([penaltyDollars(g1, 1.6), penaltyDollars(g1, 2.1), penaltyDollars(g10, 1.6), penaltyDollars(g10, 2.1)], [42.99, 56.43, 50.48, 66.26]);
});

test("road transport: juniors are a percentage of the HOURLY rate (cl 17.3)", () => {
  const j = ROAD_TRANSPORT_AWARD.junior!;
  assert.equal(j.basis, "hourly");
  assert.equal(j.adultAge, 20);
  const g1 = rate(ROAD_TRANSPORT_AWARD, "Transport Worker Grade 1");
  assert.equal(juniorHourlyFor(ROAD_TRANSPORT_AWARD, g1, 0.7), 18.81);
  // 80% of $26.87 = $21.50; 80% of the weekly rate / 38 would be $21.49.
  assert.equal(juniorHourlyFor(ROAD_TRANSPORT_AWARD, g1, 0.8), 21.5);
  assert.equal(roundCents((g1.weekly * 0.8) / 38), 21.49);
});

test("road transport: distribution facility levels equal Transport Worker Grades 3, 4, 7 and 9", () => {
  const pairs: [string, string][] = [
    ["Distribution facility employee level 1", "Transport Worker Grade 3"],
    ["Distribution facility employee level 2", "Transport Worker Grade 4"],
    ["Distribution facility employee level 3", "Transport Worker Grade 7"],
    ["Distribution facility employee level 4", "Transport Worker Grade 9"],
  ];
  for (const [dfe, tw] of pairs) assert.equal(rate(ROAD_TRANSPORT_AWARD, dfe).weekly, rate(ROAD_TRANSPORT_AWARD, tw).weekly);
});

// --- Cross-cutting -----------------------------------------------------------

test("every tabulated casual exception and one-employment row explains itself", () => {
  for (const a of BATCH) {
    for (const p of a.penalties) {
      if (p.casualTabulated) assert.ok(p.note, `${a.meta.code} ${p.label}`);
    }
    for (const p of a.penalties.filter((x) => x.appliesTo)) {
      for (const l of p.appliesTo!) assert.ok(a.rates.some((r) => r.level === l), `${a.meta.code} ${p.label}: unknown level ${l}`);
    }
    for (const c of a.matrix.filter((x) => x.appliesTo)) {
      for (const l of c.appliesTo!) assert.ok(a.rates.some((r) => r.level === l), `${a.meta.code} ${c.label}: unknown level ${l}`);
    }
  }
});
