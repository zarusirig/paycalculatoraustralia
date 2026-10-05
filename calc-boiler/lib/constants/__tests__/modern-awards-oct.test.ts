// =============================================================================
// October 2026 award batch — Miscellaneous (MA000104), Building and
// Construction (MA000020), Legal Services (MA000116), Electrical (MA000025),
// Fitness (MA000094), Real Estate (MA000106), Local Government (MA000112) and
// Live Performance (MA000081). Fair Work conformance tests.
//
// Anchors, transcribed 5 October 2026 from each award's own Schedule of
// hourly rates (consolidated to 1 July 2026) where one exists:
//   Misc Schedule A.1–A.3, Fitness B.1–B.2, Real Estate B.1–B.3, Local
//   Government B.1.2 / B.1.4 / B.2.1, Legal Services B.1–B.3, Electrical B.2–B.3.
// Building and Construction and Live Performance publish no hourly schedule
// for the rows used here, so they are checked against the clause arithmetic and,
// for Construction, against the independent building-construction-common.ts.
// =============================================================================

import { test } from "node:test";
import assert from "node:assert/strict";

import { MODERN_AWARDS, findAwardRate, juniorHourlyFor, penaltyDollars, roundCents, type ModernAwardData } from "../modern-awards";
import {
  CONSTRUCTION_AWARD,
  CONSTRUCTION_MIN_WEEKLY,
  ELECTRICAL_AWARD,
  ELECTRICAL_MIN_HOURLY,
  FITNESS_AWARD,
  LEGAL_AWARD,
  LIVE_PERFORMANCE_AWARD,
  LOCAL_GOVERNMENT_AWARD,
  MISC_AWARD,
  OCT_AWARDS,
  REAL_ESTATE_AWARD,
} from "../modern-awards-oct";
import { AWARD_DIRECTORY } from "../award-directory";
import { BUILDING_BASE_WEEKLY, buildingRow, type BuildingLevel } from "../../data/job-pay-rates/building-construction-common";

const ALL: readonly ModernAwardData[] = Object.values(OCT_AWARDS);

const casualOrd = (a: ModernAwardData, hourly: number) => roundCents(hourly * (1 + a.meta.casualLoading));
/** Percentage lookup on a penalty row by label fragment. */
const pen = (a: ModernAwardData, frag: string) => {
  const p = a.penalties.find((r) => r.label.includes(frag));
  assert.ok(p, `${a.meta.code}: penalty row ${frag}`);
  return p;
};
const ot = (a: ModernAwardData, frag: string) => {
  const o = a.overtime.find((r) => r.label.includes(frag));
  assert.ok(o, `${a.meta.code}: overtime row ${frag}`);
  return o;
};
const dollars = (rows: readonly { hourly: number }[], mult: number) => rows.map((r) => penaltyDollars(r.hourly, mult));

// --- Registry ----------------------------------------------------------------

test("October awards are registered with the expected keys, codes, routes and directory entries", () => {
  const expected: [string, string, string][] = [
    ["miscellaneous", "MA000104", "/miscellaneous-award-rates/"],
    ["building-construction", "MA000020", "/building-and-construction-award-rates/"],
    ["legal-services", "MA000116", "/legal-services-award-rates/"],
    ["electrical", "MA000025", "/electrical-award-rates/"],
    ["fitness", "MA000094", "/fitness-industry-award-rates/"],
    ["real-estate", "MA000106", "/real-estate-award-rates/"],
    ["local-government", "MA000112", "/local-government-award-rates/"],
    ["live-performance", "MA000081", "/live-performance-award-rates/"],
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

test("row counts match the award tables and levels are unique", () => {
  assert.equal(MISC_AWARD.rates.length, 4);
  assert.equal(CONSTRUCTION_AWARD.rates.length, 12);
  assert.equal(LEGAL_AWARD.rates.length, 7);
  assert.equal(ELECTRICAL_AWARD.rates.length, 10);
  assert.equal(FITNESS_AWARD.rates.length, 9);
  assert.equal(REAL_ESTATE_AWARD.rates.length, 5);
  assert.equal(LOCAL_GOVERNMENT_AWARD.rates.length, 11);
  assert.equal(LIVE_PERFORMANCE_AWARD.rates.length, 8);
  for (const a of ALL) assert.equal(new Set(a.rates.map((r) => r.level)).size, a.rates.length, `${a.meta.code} unique levels`);
});

test("every award is operative 1 July 2026 with a 25% casual loading and 38 standard hours", () => {
  for (const a of ALL) {
    assert.equal(a.meta.operativeFrom, "1 July 2026");
    assert.equal(a.meta.casualLoading, 0.25);
    assert.equal(a.meta.standardWeeklyHours, 38);
    assert.ok(a.meta.awardTextUrl.endsWith(`${a.meta.code}.html`));
  }
});

test("hourly is weekly / 38 to the cent for every row", () => {
  for (const a of ALL) {
    for (const r of a.rates) {
      assert.equal(roundCents(r.weekly / 38), r.hourly, `${a.meta.code} ${r.level}`);
    }
  }
});

// --- Miscellaneous (Schedule A) ---------------------------------------------

const MISC_FT = [[25.74, 30.89, 30.89, 38.61, 64.35], [27.08, 32.5, 32.5, 40.62, 67.7], [29.45, 35.34, 35.34, 44.18, 73.63], [32.13, 38.56, 38.56, 48.2, 80.33]];
const MISC_OT = [[38.61, 51.48, 64.35], [40.62, 54.16, 67.7], [44.18, 58.9, 73.63], [48.2, 64.26, 80.33]];
const MISC_CAS = [[32.18, 37.32, 37.32, 45.05, 64.35], [33.85, 39.27, 39.27, 47.39, 67.7], [36.81, 42.7, 42.7, 51.54, 73.63], [40.16, 46.59, 46.59, 56.23, 80.33]];

test("misc: cl 15.1 rates and Schedule A.1.1 / A.2.1 / A.1.2 for every level", () => {
  const pins: [string, number, number][] = [["Level 1", 978.1, 25.74], ["Level 2", 1029.1, 27.08], ["Level 3", 1119.1, 29.45], ["Level 4", 1221.1, 32.13]];
  pins.forEach(([lv, w, h], i) => {
    const r = findAwardRate(MISC_AWARD, lv);
    assert.equal(r.weekly, w);
    assert.equal(r.hourly, h);
    MISC_AWARD.matrix.forEach((c, j) => {
      assert.equal(penaltyDollars(r.hourly, c.fullTime), MISC_FT[i][j], `${lv} FT ${c.label}`);
      assert.equal(penaltyDollars(r.hourly, c.casual), MISC_CAS[i][j], `${lv} casual ${c.label}`);
    });
    const otRates = [ot(MISC_AWARD, "first 3").fullTime, ot(MISC_AWARD, "after 3").fullTime, ot(MISC_AWARD, "public holiday").fullTime];
    otRates.forEach((m, j) => assert.equal(penaltyDollars(r.hourly, m), MISC_OT[i][j], `${lv} OT ${j}`));
  });
});

test("misc: casual public holiday is 250%, not 275%, and casual overtime equals permanent (cl 11.1(b))", () => {
  assert.equal(pen(MISC_AWARD, "Public holiday").casual, 2.5);
  for (const o of MISC_AWARD.overtime) assert.equal(o.casual, o.fullTime);
  assert.equal(pen(MISC_AWARD, "Saturday").casual, 1.45);
});

test("misc: junior rates match Schedule A.3.1 for Level 1 and Level 2 (percentage of the weekly rate, then / 38)", () => {
  const l1 = findAwardRate(MISC_AWARD, "Level 1");
  const j = MISC_AWARD.junior!;
  const expected = [9.47, 12.18, 14.88, 17.58, 21.24, 25.15];
  j.scale.slice(0, 6).forEach((b, i) => assert.equal(juniorHourlyFor(MISC_AWARD, l1, b.percentage), expected[i], b.age));
  const l2 = findAwardRate(MISC_AWARD, "Level 2");
  assert.equal(juniorHourlyFor(MISC_AWARD, l2, j.scale[0].percentage), 9.97);
});

// --- Fitness (Schedule B) ----------------------------------------------------

const FIT_FT = [[25.74, 32.18, 38.61, 64.35], [26.44, 33.05, 39.66, 66.1], [27.97, 34.96, 41.96, 69.93], [29.45, 36.81, 44.18, 73.63], [30.66, 38.33, 45.99, 76.65], [32.13, 40.16, 48.2, 80.33], [33.87, 42.34, 50.81, 84.68], [33.58, 41.98, 50.37, 83.95], [34.89, 43.61, 52.34, 87.23]];
const FIT_OT = [[38.61, 51.48, 51.48, 64.35], [39.66, 52.88, 52.88, 66.1], [41.96, 55.94, 55.94, 69.93], [44.18, 58.9, 58.9, 73.63], [45.99, 61.32, 61.32, 76.65], [48.2, 64.26, 64.26, 80.33], [50.81, 67.74, 67.74, 84.68], [50.37, 67.16, 67.16, 83.95], [52.34, 69.78, 69.78, 87.23]];
const FIT_CAS = [[32.18, 33.46], [33.05, 34.37], [34.96, 36.36], [36.81, 38.29], [38.33, 39.86], [40.16, 41.77], [42.34, 44.03], [41.98, 43.65], [43.61, 45.36]];

test("fitness: every level matches Schedule B.1.1 (permanent), B.1.2 (overtime) and B.2 (casual)", () => {
  FITNESS_AWARD.rates.forEach((r, i) => {
    FITNESS_AWARD.matrix.forEach((c, j) => assert.equal(penaltyDollars(r.hourly, c.fullTime), FIT_FT[i][j], `${r.level} FT ${c.label}`));
    const cols = [ot(FITNESS_AWARD, "first 2"), ot(FITNESS_AWARD, "after 2"), ot(FITNESS_AWARD, "Sunday"), ot(FITNESS_AWARD, "Public holiday")];
    cols.forEach((o, j) => {
      assert.equal(penaltyDollars(r.hourly, o.fullTime), FIT_OT[i][j], `${r.level} OT ${o.label}`);
      assert.equal(o.casual, o.fullTime, "casual loading not paid on overtime (cl 12.2)");
    });
    assert.equal(penaltyDollars(r.hourly, FITNESS_AWARD.matrix[0].casual), FIT_CAS[i][0], `${r.level} casual weekday`);
    assert.equal(penaltyDollars(r.hourly, FITNESS_AWARD.matrix[1].casual), FIT_CAS[i][1], `${r.level} casual Saturday`);
    assert.equal(penaltyDollars(r.hourly, FITNESS_AWARD.matrix[2].casual), FIT_CAS[i][1], `${r.level} casual Sunday`);
  });
});

test("fitness: casual weekend loading is 30%, so casual Sunday is below permanent Sunday; Level 6 sits below Level 5 (cl 15.1)", () => {
  const sun = pen(FITNESS_AWARD, "Sunday");
  assert.equal(sun.casual, 1.3);
  assert.ok(sun.casual < sun.fullTime);
  assert.ok(findAwardRate(FITNESS_AWARD, "Level 6").weekly < findAwardRate(FITNESS_AWARD, "Level 5").weekly);
  // casual public holiday is deliberately not published
  const ph = pen(FITNESS_AWARD, "Public holiday");
  assert.equal(ph.employment, "permanent");
  assert.equal(FITNESS_AWARD.matrix.find((c) => c.label === "Public holiday")?.employment, "permanent");
  assert.equal(FITNESS_AWARD.junior!.adultAge, 20);
  assert.deepEqual(FITNESS_AWARD.junior!.scale.map((b) => b.percentage), [0.55, 0.65, 0.75, 0.85, 1]);
});

// --- Real Estate (Schedule B) ------------------------------------------------

const RE_FT = [[26.59, 53.18, 39.89, 53.18, 53.18], [28, 56, 42, 56, 56], [29.45, 58.9, 44.18, 58.9, 58.9], [32.39, 64.78, 48.59, 64.78, 64.78], [33.88, 67.76, 50.82, 67.76, 67.76]];
const RE_CAS = [[33.24, 66.48], [35, 70], [36.81, 73.62], [40.49, 80.98], [42.35, 84.7]];

test("real estate: cl 14.1 weekly rates and Schedule B.1.1 / B.2.2 for every level", () => {
  const weekly = [1010.6, 1063.9, 1119.1, 1231.0, 1287.3];
  REAL_ESTATE_AWARD.rates.forEach((r, i) => {
    assert.equal(r.weekly, weekly[i]);
    assert.equal(r.hourly, RE_FT[i][0], `${r.level} ordinary`);
    assert.equal(penaltyDollars(r.hourly, 2.0), RE_FT[i][1], `${r.level} PH`);
    assert.equal(penaltyDollars(r.hourly, ot(REAL_ESTATE_AWARD, "first 2").fullTime), RE_FT[i][2], `${r.level} RDO first 2h`);
    assert.equal(penaltyDollars(r.hourly, ot(REAL_ESTATE_AWARD, "after 2").fullTime), RE_FT[i][3], `${r.level} RDO after 2h`);
    // casual: Schedule B.2.2 — ordinary 100% of the casual rate, public holiday 200% of the casual rate
    const casualRate = casualOrd(REAL_ESTATE_AWARD, r.hourly);
    assert.equal(casualRate, RE_CAS[i][0], `${r.level} casual ordinary`);
    const phRow = pen(REAL_ESTATE_AWARD, "Public holiday");
    assert.equal(phRow.casualBasis, "compounded");
    assert.equal(roundCents(casualRate * phRow.casual), RE_CAS[i][1], `${r.level} casual PH`);
  });
});

test("real estate: no Saturday or Sunday penalty and 100% overtime off a rostered day off (cl 13.1, 19.1)", () => {
  assert.ok(!REAL_ESTATE_AWARD.penalties.some((p) => /saturday|sunday/i.test(p.label)));
  const first = ot(REAL_ESTATE_AWARD, "specific direction");
  assert.equal(first.fullTime, 1.0);
  assert.equal(first.casual, 1.25);
  assert.equal(ot(REAL_ESTATE_AWARD, "first 2").casual, null);
});

test("real estate: junior rates match Schedule B.3.1 (first 12 months and Level 4)", () => {
  const first = findAwardRate(REAL_ESTATE_AWARD, "Level 1 (Associate) — first 12 months");
  const s = REAL_ESTATE_AWARD.junior!.scale;
  assert.deepEqual([0, 1, 2].map((i) => juniorHourlyFor(REAL_ESTATE_AWARD, first, s[i].percentage)), [15.96, 18.62, 21.28]);
  const l4 = findAwardRate(REAL_ESTATE_AWARD, "Level 4 (In-Charge)");
  assert.deepEqual([0, 1, 2].map((i) => juniorHourlyFor(REAL_ESTATE_AWARD, l4, s[i].percentage)), [20.33, 23.71, 27.1]);
});

// --- Local Government (Schedule B) -------------------------------------------

const LG_A = [[27.11, 32.53, 40.67, 47.44, 67.78], [27.97, 33.56, 41.96, 48.95, 69.93], [29.03, 34.84, 43.55, 50.8, 72.58], [29.45, 35.34, 44.18, 51.54, 73.63], [31.3, 37.56, 46.95, 54.78, 78.25], [33.87, 40.64, 50.81, 59.27, 84.68], [34.46, 41.35, 51.69, 60.31, 86.15], [37.24, 44.69, 55.86, 65.17, 93.1], [39.83, 47.8, 59.75, 69.7, 99.58], [43.54, 52.25, 65.31, 76.2, 108.85], [49.09, 58.91, 73.64, 85.91, 122.73]];
const LG_OT = [[40.67, 54.22, 40.67, 54.22, 54.22, 67.78], [41.96, 55.94, 41.96, 55.94, 55.94, 69.93], [43.55, 58.06, 43.55, 58.06, 58.06, 72.58], [44.18, 58.9, 44.18, 58.9, 58.9, 73.63], [46.95, 62.6, 46.95, 62.6, 62.6, 78.25], [50.81, 67.74, 50.81, 67.74, 67.74, 84.68], [51.69, 68.92, 51.69, 68.92, 68.92, 86.15], [55.86, 74.48, 55.86, 74.48, 74.48, 93.1], [59.75, 79.66, 59.75, 79.66, 79.66, 99.58], [65.31, 87.08, 65.31, 87.08, 87.08, 108.85], [73.64, 98.18, 73.64, 98.18, 98.18, 122.73]];
const LG_CAS = [[33.89, 39.31, 47.44, 54.22], [34.96, 40.56, 48.95, 55.94], [36.29, 42.09, 50.8, 58.06], [36.81, 42.7, 51.54, 58.9], [39.13, 45.39, 54.78, 62.6], [42.34, 49.11, 59.27, 67.74], [43.08, 49.97, 60.31, 68.92], [46.55, 54, 65.17, 74.48], [49.79, 57.75, 69.7, 79.66], [54.43, 63.13, 76.2, 87.08], [61.36, 71.18, 85.91, 98.18]];

test("local government: cl 16.1 rates and Schedule B.1.2 / B.1.4 / B.2.1 for every level", () => {
  LOCAL_GOVERNMENT_AWARD.rates.forEach((r, i) => {
    LOCAL_GOVERNMENT_AWARD.matrix.forEach((c, j) => assert.equal(penaltyDollars(r.hourly, c.fullTime), LG_A[i][j], `${r.level} FT ${c.label}`));
    LOCAL_GOVERNMENT_AWARD.matrix.slice(0, 4).forEach((c, j) => assert.equal(penaltyDollars(r.hourly, c.casual), LG_CAS[i][j], `${r.level} casual ${c.label}`));
    LOCAL_GOVERNMENT_AWARD.overtime.forEach((o, j) => {
      assert.equal(penaltyDollars(r.hourly, o.fullTime), LG_OT[i][j], `${r.level} OT ${o.label}`);
      assert.equal(o.casual, o.fullTime, "casual loading not paid on overtime (cl 21.2(c))");
    });
  });
});

test("local government: casual public holiday is not published; juniors per cl 16.2", () => {
  assert.equal(pen(LOCAL_GOVERNMENT_AWARD, "Public holiday").employment, "permanent");
  assert.deepEqual(LOCAL_GOVERNMENT_AWARD.junior!.scale.map((b) => b.percentage), [0.55, 0.65, 0.75, 0.85, 0.95, 1]);
});

// --- Legal Services (Schedule B) ---------------------------------------------

const LEGAL_SH = [[28.24, 31.06, 32.48, 42.36, 56.48, 36.71], [29.45, 32.4, 33.87, 44.18, 58.9, 38.29], [31.11, 34.22, 35.78, 46.67, 62.22, 40.44], [32.67, 35.94, 37.57, 49.01, 65.34, 42.47], [33.99, 37.39, 39.09, 50.99, 67.98, 44.19], [33.99, 37.39, 39.09, 50.99, 67.98, 44.19], [36.03, 39.63, 41.43, 54.05, 72.06, 46.84]];
const LEGAL_WE = [[42.36, 56.48, 70.6, 56.48], [44.18, 58.9, 73.63, 58.9], [46.67, 62.22, 77.78, 62.22], [49.01, 65.34, 81.68, 65.34], [50.99, 67.98, 84.98, 67.98], [50.99, 67.98, 84.98, 67.98], [54.05, 72.06, 90.08, 72.06]];
const LEGAL_CAS = [[35.3, 38.12, 39.54, 49.42, 63.54, 43.77], [36.81, 39.76, 41.23, 51.54, 66.26, 45.65], [38.89, 42, 43.55, 54.44, 70, 48.22], [40.84, 44.1, 45.74, 57.17, 73.51, 50.64], [42.49, 45.89, 47.59, 59.48, 76.48, 52.68], [42.49, 45.89, 47.59, 59.48, 76.48, 52.68], [45.04, 48.64, 50.44, 63.05, 81.07, 55.85]];
const LEGAL_CASW = [[49.42, 63.54, 77.66, 63.54], [51.54, 66.26, 80.99, 66.26], [54.44, 70, 85.55, 70], [57.17, 73.51, 89.84, 73.51], [59.48, 76.48, 93.47, 76.48], [59.48, 76.48, 93.47, 76.48], [63.05, 81.07, 99.08, 81.07]];

test("legal: cl 15.1 rates and Schedule B.1.1 / B.1.2 / B.2.1 / B.2.2 for every level", () => {
  LEGAL_AWARD.rates.forEach((r, i) => {
    const rows = [
      ["Shiftworker — early morning", 1], ["Shiftworker — afternoon or night", 2], ["non-continuous afternoon or night, first 3", 3],
      ["non-continuous afternoon or night, after 3", 4], ["permanent night", 5],
    ] as const;
    assert.equal(r.hourly, LEGAL_SH[i][0]);
    assert.equal(casualOrd(LEGAL_AWARD, r.hourly), LEGAL_CAS[i][0]);
    for (const [frag, col] of rows) {
      const p = pen(LEGAL_AWARD, frag);
      assert.equal(penaltyDollars(r.hourly, p.fullTime), LEGAL_SH[i][col], `${r.level} FT ${frag}`);
      assert.equal(penaltyDollars(r.hourly, p.casual), LEGAL_CAS[i][col], `${r.level} casual ${frag}`);
    }
    const we = [pen(LEGAL_AWARD, "Saturday"), pen(LEGAL_AWARD, "— Sunday"), pen(LEGAL_AWARD, "— public holiday")];
    we.forEach((p, j) => {
      assert.equal(penaltyDollars(r.hourly, p.fullTime), LEGAL_WE[i][j], `${r.level} FT ${p.label}`);
      assert.equal(penaltyDollars(r.hourly, p.casual), LEGAL_CASW[i][j], `${r.level} casual ${p.label}`);
    });
  });
});

test("legal: day-worker overtime (cl 20.2(a)(i)) includes the casual loading, and Level 5 law graduate equals Level 5", () => {
  assert.deepEqual(LEGAL_AWARD.overtime.map((o) => [o.fullTime, o.casual]), [[1.5, 1.75], [2.0, 2.25], [2.0, 2.25], [2.5, 2.75]]);
  const l5 = findAwardRate(LEGAL_AWARD, "Level 5 — Legal clerical and administrative");
  const grad = findAwardRate(LEGAL_AWARD, "Level 5 — Law graduate");
  assert.equal(l5.hourly, grad.hourly);
  assert.equal(l5.weekly, grad.weekly);
});

test("legal: junior rates match Schedule B.3.1 (Level 1 and Level 2)", () => {
  const s = LEGAL_AWARD.junior!.scale;
  const l1 = findAwardRate(LEGAL_AWARD, "Level 1 — Legal clerical and administrative");
  assert.deepEqual(s.slice(0, 6).map((b) => juniorHourlyFor(LEGAL_AWARD, l1, b.percentage)), [12.71, 14.12, 16.94, 19.77, 22.59, 25.42]);
  const l2 = findAwardRate(LEGAL_AWARD, "Level 2 — Legal clerical and administrative");
  assert.deepEqual(s.slice(0, 6).map((b) => juniorHourlyFor(LEGAL_AWARD, l2, b.percentage)), [13.25, 14.73, 17.67, 20.62, 23.56, 26.51]);
});

// --- Electrical (Schedule B) -------------------------------------------------

const EL_ORD = [[27.53, 68.83], [27.75, 69.38], [28.64, 71.6], [29.53, 73.83], [31.13, 77.83], [32.05, 80.13], [33.81, 84.53], [35.44, 88.6], [36.14, 90.35], [38.91, 97.28]];
const EL_OT = [[41.3, 55.06, 55.06, 68.83], [41.63, 55.5, 55.5, 69.38], [42.96, 57.28, 57.28, 71.6], [44.3, 59.06, 59.06, 73.83], [46.7, 62.26, 62.26, 77.83], [48.08, 64.1, 64.1, 80.13], [50.72, 67.62, 67.62, 84.53], [53.16, 70.88, 70.88, 88.6], [54.21, 72.28, 72.28, 90.35], [58.37, 77.82, 77.82, 97.28]];
const EL_CAS = [[34.41, 86.03], [34.69, 86.72], [35.8, 89.5], [36.91, 92.28], [38.91, 97.28], [40.06, 100.16], [42.26, 105.66], [44.3, 110.75], [45.18, 112.94], [48.64, 121.59]];

test("electrical: ordinary hourly rate = (cl 16.2 weekly + industry allowance + tool allowance from grade 5) / 38, pinned to Schedule B.2.1 for all 10 grades", () => {
  const minWeekly = [1004.9, 1013.1, 1046.9, 1080.6, 1119.1, 1154.3, 1221.1, 1283.1, 1309.5, 1415.0];
  ELECTRICAL_AWARD.rates.forEach((r, i) => {
    assert.equal(r.hourly, EL_ORD[i][0], `${r.level} ordinary`);
    const allowances = 41.41 + (i >= 4 ? 22.31 : 0);
    assert.equal(roundCents(r.weekly - allowances), minWeekly[i], `${r.level} weekly = cl 16.2 minimum + allowances`);
    assert.equal(roundCents(minWeekly[i] / 38), ELECTRICAL_MIN_HOURLY[r.level], `${r.level} cl 16.2 hourly`);
  });
});

test("electrical: penalties, overtime and casual rates match Schedule B.2.1, B.2.2 and B.3.1 for every grade", () => {
  ELECTRICAL_AWARD.rates.forEach((r, i) => {
    assert.equal(penaltyDollars(r.hourly, ELECTRICAL_AWARD.matrix[1].fullTime), EL_ORD[i][1], `${r.level} PH`);
    ELECTRICAL_AWARD.overtime.forEach((o, j) => assert.equal(penaltyDollars(r.hourly, o.fullTime), EL_OT[i][j], `${r.level} OT ${o.label}`));
    assert.equal(penaltyDollars(r.hourly, ELECTRICAL_AWARD.matrix[0].casual), EL_CAS[i][0], `${r.level} casual ordinary`);
    assert.equal(penaltyDollars(r.hourly, ELECTRICAL_AWARD.matrix[1].casual), EL_CAS[i][1], `${r.level} casual PH`);
  });
});

test("electrical: casual percentages are the permanent percentage x 1.25 (cl 20.1(b), 20.4)", () => {
  for (const o of ELECTRICAL_AWARD.overtime) assert.equal(o.casual, o.fullTime * 1.25);
  for (const p of ELECTRICAL_AWARD.penalties) assert.equal(p.casual, p.fullTime * 1.25);
  assert.equal(ot(ELECTRICAL_AWARD, "first 2").casual, 1.875);
  assert.equal(pen(ELECTRICAL_AWARD, "Public holiday").casual, 3.125);
  assert.equal(ELECTRICAL_AWARD.junior, null);
});

// --- Building and Construction -----------------------------------------------

test("construction: cl 19.1(a) minimum weekly + $67.15 industry allowance, / 38 (cl 19.3(b)), cross-checked against the independent carpenter module", () => {
  const keyFor = (name: string): BuildingLevel | null => {
    const m = name.match(/^Level (\d)(?:\((\w)\))? \((?:CW\/)?ECW (\d)\)$/);
    if (!m || name.includes("ECW 9")) return null;
    return (m[2] ? `CW/ECW 1 (level ${m[2]})` : `CW/ECW ${m[1]}`) as BuildingLevel;
  };
  CONSTRUCTION_AWARD.rates.forEach((r, i) => {
    const [, minWeekly, minHourly] = CONSTRUCTION_MIN_WEEKLY[i];
    assert.equal(roundCents(r.weekly), roundCents(minWeekly + 67.15), r.level);
    assert.equal(roundCents(minWeekly / 38), minHourly, `${r.level} cl 19.1(a) hourly`);
    const key = keyFor(r.level);
    if (key) {
      assert.equal(BUILDING_BASE_WEEKLY[key], minWeekly, key);
      const independent = buildingRow(r.level, key, [67.15]);
      assert.equal(independent.hourly, r.hourly, `${r.level} vs building-construction-common`);
      assert.equal(independent.weekly, r.weekly);
    }
  });
  assert.equal(findAwardRate(CONSTRUCTION_AWARD, "Level 3 (CW/ECW 3)").hourly, 31.22);
  assert.equal(findAwardRate(CONSTRUCTION_AWARD, "Level 1(a) (CW/ECW 1)").hourly, 28.44);
});

test("construction: weekend work is overtime; casuals are 175% / 225% / 275% (cl 12.5–12.6, 29.4, 30.1)", () => {
  assert.deepEqual(CONSTRUCTION_AWARD.overtime.map((o) => [o.fullTime, o.casual]), [[1.5, 1.75], [2.0, 2.25], [1.5, 1.75], [2.0, 2.25], [2.0, 2.25], [2.5, 2.75]]);
  assert.equal(pen(CONSTRUCTION_AWARD, "Public holiday").casual, 2.75);
  assert.equal(pen(CONSTRUCTION_AWARD, "Good Friday").employment, "permanent");
  // Level 3 Saturday: 5 hours (2 at 150%, 3 at 200%) is $280.98
  const l3 = findAwardRate(CONSTRUCTION_AWARD, "Level 3 (CW/ECW 3)").hourly;
  assert.equal(roundCents(penaltyDollars(l3, 1.5) * 2 + penaltyDollars(l3, 2) * 3), 280.98);
});

// --- Live Performance (Production and Support Staff) -------------------------

test("live performance: cl 11.1 Production and Support Staff weekly and hourly rates", () => {
  const pins: [number, number][] = [[978.1, 25.74], [1046.9, 27.55], [1098.0, 28.89], [1119.1, 29.45], [1154.2, 30.37], [1189.4, 31.3], [1265.7, 33.31], [1309.4, 34.46]];
  LIVE_PERFORMANCE_AWARD.rates.forEach((r, i) => {
    assert.equal(r.weekly, pins[i][0]);
    assert.equal(r.hourly, pins[i][1]);
  });
});

test("live performance: Sunday, midnight to 7 am and public holiday are 200% (casuals 225%); overtime per cl 63", () => {
  for (const frag of ["midnight", "Sunday", "Public holiday"]) {
    const p = pen(LIVE_PERFORMANCE_AWARD, frag);
    assert.equal(p.fullTime, 2.0);
    assert.equal(p.casual, 2.25);
  }
  assert.deepEqual(LIVE_PERFORMANCE_AWARD.overtime.map((o) => [o.fullTime, o.casual]), [[1.5, 1.75], [2.0, 2.25], [1.5, null], [2.0, null], [1.5, 1.75]]);
  const l3 = findAwardRate(LIVE_PERFORMANCE_AWARD, "Level 3 — Production and Support Staff 3").hourly;
  assert.equal(penaltyDollars(l3, 2.25), 65.0);
  assert.equal(dollars([{ hourly: l3 }], 1.25)[0], 36.11);
});
