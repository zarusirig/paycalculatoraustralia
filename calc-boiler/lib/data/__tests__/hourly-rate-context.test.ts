// =============================================================================
// Rate-specific facts behind the conditional sections on /hourly-to-salary/
// and /salary-to-hourly/ (lib/data/hourly-rate-context.ts): each lookup stays
// inside its window, whole-dollar neighbours never share an award row, and the
// dollars are the source constants' own.
// =============================================================================

import { test } from "node:test";
import assert from "node:assert/strict";

import {
  CASUAL_MINIMUM_FULL_TIME,
  CONTRACTOR_CONTEXT_FROM,
  MAX_AWARD_ROWS,
  NEAR_WINDOW,
  TYPICAL_AWARD_ROWS,
  apprenticeRatesNear,
  casualEquivalents,
  hourlyPageAwardRates,
  hourlyPagePayScalePoints,
  juniorFloors,
  nearestAwardRates,
  pageAwardRates,
  penaltyContext,
  salaryPageAwardRates,
  salaryPageAwardWindow,
  salaryPageHalfWindow,
  salaryPagePayScalePoints,
} from "../hourly-rate-context";
import { PAY_SCALE_INDEX, PAY_SCALE_ROWS, joinLabel, payScalePointsNear } from "../pay-scale-index";
import { SALARY_TO_HOURLY_SALARIES } from "../salary-pages";
import { AWARD_RATE_INDEX, AWARD_RATE_MAX, AWARD_RATE_MIN } from "../award-rate-index";
import { APPRENTICE_TRADES } from "../apprentice-pay";
import { MODERN_AWARDS } from "../../constants/modern-awards";
import { JUNIOR_RATES } from "../../constants/junior-rates";
import { NMW } from "../../constants/minimum-wage";
import { EMPLOYMENT } from "../../constants/australian-tax";
import { HOURLY_RATE_PAGES } from "../../constants/hourly-rates";

/** Half-up to the cent without binary drift (25.74 x 1.25 = 32.175 -> 32.18), as the lib rounds. */
const cents = (n: number) => Math.round(Number((n * 100).toFixed(6))) / 100;
const key = (m: { code: string; stream: string | null; hourly: number }) => `${m.code}|${m.stream ?? ""}|${m.hourly}`;

test("award rows sit in [rate - 50c, rate + 50c) and neighbours never share one", () => {
  let previous = new Set<string>();
  for (const rate of HOURLY_RATE_PAGES) {
    const near = pageAwardRates(rate);
    for (const m of near.matches) {
      assert.ok(m.diff >= -NEAR_WINDOW - 1e-9 && m.diff < NEAR_WINDOW, `$${rate}: ${m.award} ${m.hourly}`);
      assert.equal(m.diff, cents(m.hourly - rate));
    }
    const awards = near.matches.map((m) => `${m.code}|${m.stream ?? ""}`);
    assert.equal(new Set(awards).size, awards.length, `$${rate}: one row per award`);
    const here = new Set(near.matches.map(key));
    for (const k of here) assert.ok(!previous.has(k), `$${rate} repeats ${k} from $${rate - 1}`);
    previous = here;
  }
});

test("no award rows below the lowest or above the highest award minimum", () => {
  assert.equal(pageAwardRates(AWARD_RATE_MIN.hourly - 1).matches.length, 0);
  assert.equal(pageAwardRates(AWARD_RATE_MAX.hourly + 1).matches.length, 0);
});

test("nearest award rates straddle a rate with nothing within 50c", () => {
  for (const rate of HOURLY_RATE_PAGES) {
    if (pageAwardRates(rate).matches.length > 0) continue;
    const { below, above } = nearestAwardRates(rate);
    if (below) assert.ok(below.hourly < rate, `$${rate}: below`);
    if (above) assert.ok(above.hourly > rate, `$${rate}: above`);
    if (rate > AWARD_RATE_MIN.hourly && rate < AWARD_RATE_MAX.hourly) {
      assert.ok(below && above, `$${rate}: inside the index needs both sides`);
      // Nothing in the index between the two.
      assert.ok(!AWARD_RATE_INDEX.some((e) => e.hourly > below!.hourly && e.hourly < above!.hourly), `$${rate}: gap`);
    }
  }
});

test("casual equivalents are each award's own base plus its loading, within 50c", () => {
  let found = 0;
  for (const rate of HOURLY_RATE_PAGES) {
    for (const c of casualEquivalents(rate)) {
      found++;
      assert.equal(c.casual, cents(c.match.hourly * (1 + c.match.casualLoading)), `$${rate}: ${c.match.award}`);
      assert.ok(c.diff >= -NEAR_WINDOW - 1e-9 && c.diff < NEAR_WINDOW, `$${rate}: ${c.match.award} casual ${c.casual}`);
    }
  }
  assert.ok(found > 50, `only ${found} casual equivalents across the range`);
  // The casual national minimum wage sits on the Hospitality Level 1 / NMW base.
  assert.ok(casualEquivalents(33).some((c) => c.match.hourly === NMW.hourly));
});

test("penalty dollars are the award's own multipliers on the matched minimum", () => {
  const byCode = new Map(Object.values(MODERN_AWARDS).map((a) => [a.meta.code, a]));
  let found = 0;
  for (const rate of HOURLY_RATE_PAGES) {
    const ctx = penaltyContext(rate);
    if (!ctx) continue;
    found++;
    assert.ok(Math.abs(ctx.match.diff) < NEAR_WINDOW + 1e-9, `$${rate}: within 50c`);
    assert.equal(byCode.get(ctx.match.code), ctx.award, `$${rate}: award by code`);
    assert.ok(ctx.match.classifications.includes(ctx.classification));
    for (const l of ctx.lines) {
      assert.equal(l.hourly, cents(ctx.match.hourly * l.multiplier + l.flatPerHour), `$${rate}: ${l.label}`);
      const rows: readonly { label: string; fullTime: number }[] =
        l.kind === "overtime" ? ctx.award.overtime : ctx.award.penalties;
      const row = rows.find((r) => r.label === l.label);
      assert.ok(row, `$${rate}: ${l.label} is in the award table`);
      assert.equal(row.fullTime, l.multiplier);
    }
    // Casual-only rows never priced for a permanent employee.
    assert.ok(!ctx.lines.some((l) => ctx.award.penalties.find((p) => p.label === l.label)?.employment === "casual"));
  }
  assert.ok(found >= 10, `only ${found} rates with penalty context`);
  // Only at typical award rates (at least four awards within 50c).
  for (const rate of HOURLY_RATE_PAGES) {
    if (penaltyContext(rate)) assert.ok(pageAwardRates(rate).matches.length >= TYPICAL_AWARD_ROWS, `$${rate}: not typical`);
  }
  assert.equal(penaltyContext(AWARD_RATE_MAX.hourly + 5), null);
});

test("junior floors: every row met is at or under the rate, the next one is over", () => {
  for (const rate of [20, 21, 22, 25, 26]) {
    const { met, nextUp } = juniorFloors(rate);
    for (const r of met) assert.ok(r.hourly <= rate && r.percentage < 1);
    if (nextUp) assert.ok(nextUp.hourly > rate);
  }
  assert.equal(juniorFloors(22).met.at(-1)?.age, "19");
  assert.equal(juniorFloors(26).met.at(-1)?.age, "20");
  assert.equal(juniorFloors(26).nextUp?.hourly, NMW.hourly);
  assert.equal(juniorFloors(20).nextUp, JUNIOR_RATES.find((r) => r.age === "19"));
});

test("apprentice rows are within 50c and their Year 12 condition is the trade's own", () => {
  for (const rate of [20, 21, 22, 23, 24, 25, 26]) {
    for (const a of apprenticeRatesNear(rate)) {
      assert.ok(a.diff >= -NEAR_WINDOW - 1e-9 && a.diff < NEAR_WINDOW, `$${rate}: ${a.hourly}`);
      for (const t of a.trades) {
        const trade = APPRENTICE_TRADES.find((x) => x.slug === t.slug)!;
        const list = a.track === "adult" ? trade.adult ?? [] : trade.junior;
        const atStage = list.filter((r) => r.stage === a.stage);
        assert.ok(atStage.some((r) => r.hourly === a.hourly), `${t.slug}: ${a.hourly} at stage ${a.stage}`);
        if (a.year12 !== "either") {
          const other = atStage.filter((r) => r.year12 !== a.year12);
          assert.ok(other.every((r) => r.hourly !== a.hourly), `${t.slug}: Year 12 condition matters at ${a.hourly}`);
        }
      }
    }
  }
  const at22 = apprenticeRatesNear(22);
  assert.ok(at22.some((a) => a.hourly === 22.09 && a.stage === 3 && a.track === "junior"));
});

test("salary-page windows meet without overlapping", () => {
  const list = SALARY_TO_HOURLY_SALARIES;
  for (let i = 0; i < list.length - 1; i++) {
    const a = list[i];
    const b = list[i + 1];
    assert.ok(a + salaryPageHalfWindow(a) <= b - salaryPageHalfWindow(b) + 1e-9, `${a} and ${b} overlap`);
    const hourlyGap = (b - a) / EMPLOYMENT.hoursPerYear;
    assert.ok(salaryPageAwardWindow(a) + salaryPageAwardWindow(b) <= hourlyGap + 1e-9, `${a} and ${b}: award windows overlap`);
  }
});

test("pay scale index: every point is a positive salary with a group, label and date", () => {
  assert.ok(PAY_SCALE_INDEX.length > 1000, `only ${PAY_SCALE_INDEX.length} points`);
  const kinds = new Set(PAY_SCALE_INDEX.map((p) => p.kind));
  for (const k of ["public-service", "defence", "teaching", "nursing", "medical"]) assert.ok(kinds.has(k as never), k);
  for (const p of PAY_SCALE_INDEX) {
    assert.ok(Number.isFinite(p.annual) && p.annual > 0, `${p.group} ${p.label}`);
    assert.ok(p.group.trim() && p.label.trim() && p.effectiveFrom.trim(), `${p.group} ${p.label}: text`);
    assert.ok(p.href === null || /^\/[a-z0-9-/]+\/$/.test(p.href), `${p.label}: href ${p.href}`);
  }
  for (let i = 1; i < PAY_SCALE_INDEX.length; i++) assert.ok(PAY_SCALE_INDEX[i - 1].annual <= PAY_SCALE_INDEX[i].annual);
});

test("pay scale points: half-open window, one per employer, and neighbouring pages never share one", () => {
  const halfWindow = EMPLOYMENT.hoursPerYear / 2;
  let previous = new Set<string>();
  for (const rate of HOURLY_RATE_PAGES) {
    const annual = rate * EMPLOYMENT.hoursPerYear;
    const near = payScalePointsNear(annual, halfWindow);
    assert.ok(near.length <= PAY_SCALE_ROWS);
    assert.equal(new Set(near.map((p) => p.group)).size, near.length, `$${rate}: one per employer`);
    for (const p of near) {
      assert.equal(p.diff, p.annual - annual);
      assert.ok(p.diff >= -halfWindow && p.diff < halfWindow, `$${rate}: ${p.label}`);
    }
    const here = new Set(near.map((p) => `${p.group}|${p.label}|${p.annual}`));
    for (const k of here) assert.ok(!previous.has(k), `$${rate} repeats ${k}`);
    previous = here;
  }
});

test("joinLabel says a repeated classification once", () => {
  assert.equal(joinLabel("Administrative and Clerical Officer, Grade 2", "Grade 2, thereafter"), "Administrative and Clerical Officer, Grade 2, thereafter");
  assert.equal(joinLabel("VPS Grade 1, Value Range 1.1", "1.1.2"), "VPS Grade 1, Value Range 1.1, 1.1.2");
  assert.equal(joinLabel("Registered Nurse/Midwife", "4th year"), "Registered Nurse/Midwife, 4th year");
  assert.equal(joinLabel("Permit to Teach", "Permit to Teach"), "Permit to Teach");
});

test("page rows prefer what the page below did not show, from inside their own window", () => {
  let previousGroups = new Set<string>();
  for (const rate of HOURLY_RATE_PAGES) {
    const rows = hourlyPageAwardRates(rate).matches;
    assert.equal(rows.length, Math.min(pageAwardRates(rate).matches.length, MAX_AWARD_ROWS), `$${rate}: table filled`);
    for (const m of rows) assert.ok(m.diff >= -NEAR_WINDOW - 1e-9 && m.diff < NEAR_WINDOW, `$${rate}: ${m.award}`);

    const points = hourlyPagePayScalePoints(rate);
    const annual = rate * EMPLOYMENT.hoursPerYear;
    for (const p of points) assert.ok(p.diff >= -EMPLOYMENT.hoursPerYear / 2 && p.diff < EMPLOYMENT.hoursPerYear / 2);
    const fresh = points.filter((p) => !previousGroups.has(p.group)).length;
    const available = new Set(payScalePointsNear(annual, EMPLOYMENT.hoursPerYear / 2, 1000).map((p) => p.group));
    const freshAvailable = [...available].filter((g) => !previousGroups.has(g)).length;
    assert.equal(fresh, Math.min(freshAvailable, PAY_SCALE_ROWS), `$${rate}: employers the page below did not show come first`);
    previousGroups = new Set(points.map((p) => p.group));
  }
  for (const salary of SALARY_TO_HOURLY_SALARIES) {
    const half = salaryPageHalfWindow(salary);
    for (const p of salaryPagePayScalePoints(salary)) assert.ok(p.diff >= -half && p.diff < half, `${salary}: ${p.label}`);
    const w = salaryPageAwardWindow(salary);
    for (const m of salaryPageAwardRates(salary).matches) assert.ok(m.diff >= -w - 1e-9 && m.diff < w, `${salary}: ${m.award}`);
  }
});

test("thresholds come from the constants", () => {
  assert.equal(CASUAL_MINIMUM_FULL_TIME, Math.round(NMW.casualHourly * EMPLOYMENT.hoursPerYear));
  assert.ok(HOURLY_RATE_PAGES.includes(CONTRACTOR_CONTEXT_FROM));
});
