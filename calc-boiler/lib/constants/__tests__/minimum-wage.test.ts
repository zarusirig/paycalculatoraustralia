// =============================================================================
// Minimum wage, minimum wage by age, pro-rata and casual loading — tests
//
// Anchors: [2026] FWCFB 3500 ($26.44 / $1,004.90 from 1 July 2026, up from
// $24.95 / $948.00) and the Fair Work Ombudsman's published junior dollars.
// =============================================================================

import { test } from "node:test";
import assert from "node:assert/strict";

import {
  NMW,
  NMW_HISTORY,
  MIN_WAGE_AGES,
  awardBandsForAge,
  nmwRowForAge,
  pendingChangeForAge,
  weeklyPay,
  calculateProRata,
  PRO_RATA_DEFAULTS,
  compareCasualPermanent,
  CASUAL_DEFAULTS,
  formatIncrease,
  isMinWageAge,
  FAST_FOOD_LEVEL_1,
  FAST_FOOD_PUBLISHED_JUNIOR_L1,
  roundCents,
  WA_STATE_MINIMUM_WAGE,
} from "../minimum-wage";

// --- National Minimum Wage ---------------------------------------------------
test("NMW matches the 2026 decision", () => {
  assert.equal(NMW.hourly, 26.44);
  assert.equal(NMW.weekly, 1_004.9);
  assert.equal(NMW.previousHourly, 24.95);
  assert.equal(NMW.previousWeekly, 948);
  assert.equal(NMW.annual, 52_254.8);
  assert.equal(NMW.fortnightly, 2_009.8);
});

test("WA state minimum wage is below the NMW and hourly = weekly / 38", () => {
  assert.equal(WA_STATE_MINIMUM_WAGE.hourly, roundCents(WA_STATE_MINIMUM_WAGE.weekly / 38));
  assert.ok(WA_STATE_MINIMUM_WAGE.weekly < NMW.weekly);
});

test("NMW casual rate is $33.05 (Fair Work's published adult casual)", () => {
  assert.equal(NMW.casualHourly, 33.05);
});

test("NMW 2026 increase is 6.0% on the weekly rate", () => {
  assert.equal(formatIncrease(NMW.increase), "6.0%");
});

// --- History -----------------------------------------------------------------
test("history ends at the current NMW and is strictly increasing", () => {
  const last = NMW_HISTORY[NMW_HISTORY.length - 1];
  assert.equal(last.fy, "2026-27");
  assert.equal(last.weekly, NMW.weekly);
  for (let i = 1; i < NMW_HISTORY.length; i++) {
    assert.ok(NMW_HISTORY[i].weekly > NMW_HISTORY[i - 1].weekly, NMW_HISTORY[i].fy);
    assert.ok(NMW_HISTORY[i].hourly > NMW_HISTORY[i - 1].hourly, NMW_HISTORY[i].fy);
  }
});

test("history hourly rates are the weekly rate / 38 to the cent", () => {
  for (const row of NMW_HISTORY) {
    assert.ok(Math.abs(row.weekly / 38 - row.hourly) < 0.006, `${row.fy}: ${row.weekly}/38 vs ${row.hourly}`);
  }
});

test("computed increases agree with the published percentages", () => {
  for (const row of NMW_HISTORY.slice(1)) {
    const published = Number(row.published!.replace("%", "")) / 100;
    assert.ok(Math.abs(row.increase! - published) < 0.0006, `${row.fy}: ${row.increase} vs ${row.published}`);
  }
  assert.equal(NMW_HISTORY[0].increase, null);
  assert.equal(NMW_HISTORY.find((r) => r.fy === "2026-27")!.published, "6.0%");
  assert.equal(NMW_HISTORY.find((r) => r.fy === "2023-24")!.published, "8.6%");
});

// --- Minimum wage by age -----------------------------------------------------
test("spoke ages are 14 to 20", () => {
  assert.deepEqual([...MIN_WAGE_AGES], [14, 15, 16, 17, 18, 19, 20]);
  assert.ok(isMinWageAge(15));
  assert.ok(!isMinWageAge(21));
  assert.ok(!isMinWageAge(13));
});

test("14 and 15 year olds are both on the under-16 NMW band ($9.73)", () => {
  assert.equal(nmwRowForAge(14).hourly, 9.73);
  assert.equal(nmwRowForAge(15).hourly, 9.73);
  assert.equal(nmwRowForAge(15).casualHourly, 12.16);
  assert.equal(nmwRowForAge(16).hourly, 12.51);
  assert.equal(nmwRowForAge(19).casualHourly, 27.28);
  assert.equal(nmwRowForAge(20).hourly, 25.84);
});

test("retail junior on Level 1 applies the percentage to the weekly rate", () => {
  const [retail15] = awardBandsForAge(15);
  assert.equal(retail15.code, "MA000004");
  assert.equal(retail15.percentage, 0.45);
  // 1,056.80 x 45% = 475.56 / 38 = 12.5147 -> 12.51
  assert.equal(retail15.hourly, 12.51);
  const [retail16] = awardBandsForAge(16);
  // 1,056.80 x 50% = 528.40 / 38 = 13.905 -> 13.91
  assert.equal(retail16.hourly, 13.91);
});

test("retail splits the 20-year-old band on length of service", () => {
  const bands = awardBandsForAge(20).filter((b) => b.code === "MA000004");
  assert.equal(bands.length, 2);
  assert.equal(bands[1].percentage, 1);
  assert.equal(bands[1].hourly, 27.81);
});

test("hospitality under-17 band covers 14, 15 and 16", () => {
  for (const age of [14, 15, 16] as const) {
    const hosp = awardBandsForAge(age).find((b) => b.code === "MA000009")!;
    assert.equal(hosp.band, "Under 17");
    assert.equal(hosp.percentage, 0.5);
    // 1,004.90 x 50% / 38 = 13.222 -> 13.22
    assert.equal(hosp.hourly, 13.22);
  }
  const hosp19 = awardBandsForAge(19).find((b) => b.code === "MA000009")!;
  assert.equal(hosp19.percentage, 0.85);
});

test("fast food Level 1 junior dollars match the award's own Schedule A", () => {
  assert.equal(FAST_FOOD_LEVEL_1.hourly, roundCents(FAST_FOOD_LEVEL_1.weekly / 38));
  for (const age of MIN_WAGE_AGES) {
    const ff = awardBandsForAge(age).find((b) => b.code === "MA000003")!;
    const label = age < 16 ? "Under 16" : String(age);
    const published = FAST_FOOD_PUBLISHED_JUNIOR_L1.find((r) => r.age === label)!;
    assert.equal(ff.hourly, published.hourly, `age ${age} hourly`);
    assert.equal(ff.casualHourly, published.casualHourly, `age ${age} casual`);
  }
  assert.equal(awardBandsForAge(15).find((b) => b.code === "MA000003")!.percentage, 0.4);
});

test("18-20 transition per award: 5-point step on 1 Dec 2026, not the adult rate", () => {
  assert.equal(pendingChangeForAge(17), null);
  const p19 = pendingChangeForAge(19)!;
  assert.deepEqual(p19.map((p) => p.key), ["retail", "fastFood", "pharmacy"]);
  for (const p of p19) {
    assert.equal(p.present, 80);
    assert.equal(p.firstStep, 85);
    assert.equal(p.firstStepDate, "1 December 2026");
  }
  // Retail and fast food reach 100% at 19 from 1 July 2028; pharmacy too.
  assert.equal(p19.find((p) => p.key === "fastFood")!.fullAdultFrom, "1 July 2028");
  assert.equal(p19.find((p) => p.key === "pharmacy")!.fullAdultFrom, "1 July 2028");
  // 18: retail/fast food 1 July 2029; pharmacy also 1 July 2029 but via 85/95.
  const p18 = pendingChangeForAge(18)!;
  assert.equal(p18.find((p) => p.key === "retail")!.fullAdultFrom, "1 July 2029");
  assert.deepEqual(p18.find((p) => p.key === "pharmacy")!.steps.map((s) => s.percentage), [75, 85, 95, 100]);
});

test("retail 20-year-olds with >6 months already get 100%, so retail is omitted at 20", () => {
  const p20 = pendingChangeForAge(20)!;
  assert.deepEqual(p20.map((p) => p.key), ["fastFood", "pharmacy"]);
  assert.equal(p20[0].firstStep, 95);
  assert.equal(p20[0].fullAdultFrom, "1 July 2027");
});

test("weekly pay multiplies to the cent", () => {
  assert.equal(weeklyPay(9.73, 15), 145.95);
  assert.equal(weeklyPay(12.16, 10), 121.6);
});

// --- Pro-rata ----------------------------------------------------------------
test("pro-rata by hours: $80,000 at 22.8 of 38 hours is $48,000", () => {
  const r = calculateProRata(PRO_RATA_DEFAULTS);
  assert.equal(r.fraction, 0.6);
  assert.equal(r.annualSalary, 48_000);
  assert.equal(r.payableSalary, 48_000);
  assert.equal(r.fortnightly, 1_846.15);
  assert.equal(r.monthly, 4_000);
  assert.equal(r.hourlyRate, 40.49);
});

test("pro-rata by days and for part of a year", () => {
  const r = calculateProRata({ ...PRO_RATA_DEFAULTS, mode: "days", daysPerWeek: 4, monthsWorked: 6 });
  assert.equal(r.fraction, 0.8);
  assert.equal(r.annualSalary, 64_000);
  assert.equal(r.payableSalary, 32_000);
});

test("pro-rata caps at full time and handles a 40-hour full-time week", () => {
  assert.equal(calculateProRata({ ...PRO_RATA_DEFAULTS, hoursPerWeek: 45 }).fraction, 1);
  const r = calculateProRata({ ...PRO_RATA_DEFAULTS, fullTimeHours: 40, hoursPerWeek: 20 });
  assert.equal(r.annualSalary, 40_000);
});

// --- Casual loading ----------------------------------------------------------
test("casual loading at 25% on the NMW gives $33.05", () => {
  const r = compareCasualPermanent(CASUAL_DEFAULTS);
  assert.equal(r.casualHourly, 33.05);
});

test("casual vs permanent: same hours, same weeks off", () => {
  const r = compareCasualPermanent({ baseHourly: 30, hoursPerWeek: 38, loading: 0.25, sickDaysUsed: 0, leaveLoading: false });
  assert.equal(r.permanentWeekly, 1_140);
  assert.equal(r.casualWeekly, 1_425);
  assert.equal(r.weeksWorked, 48);
  assert.equal(r.permanentAnnual, 59_280);
  assert.equal(r.casualAnnual, 68_400);
  assert.equal(r.difference, 9_120);
  assert.equal(r.annualLeaveValue, 4_560);
  assert.ok(Math.abs(r.breakEvenLoading - (52 / 48 - 1)) < 1e-9);
});

test("using all 10 sick days and leave loading raises the break-even", () => {
  const r = compareCasualPermanent({ baseHourly: 30, hoursPerWeek: 38, loading: 0.25, sickDaysUsed: 10, leaveLoading: true });
  assert.equal(r.weeksWorked, 46);
  assert.equal(r.personalLeaveValue, 2_280);
  // 4 weeks x 1,140 x 17.5% = 798
  assert.equal(r.permanentAnnual, 59_280 + 798);
  assert.equal(r.casualAnnual, 1_425 * 46);
  assert.ok(r.breakEvenLoading > 0.13 && r.breakEvenLoading < 0.15);
});
