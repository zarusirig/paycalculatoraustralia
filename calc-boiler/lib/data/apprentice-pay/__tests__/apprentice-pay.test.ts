import assert from "node:assert/strict";
import { test } from "node:test";

import {
  APPRENTICE_TRADES,
  FULL_TIME_HOURS,
  STANDARD_WEEKLY_RATE,
  apprenticePay,
  apprenticeRate,
  getTrade,
} from "../index";

// Figures read from awards.fairwork.gov.au on 5 October 2026 (see index.ts).

const PCT_TRADES = ["building", "automotive", "hairdressing", "beauty-therapy", "cookery"];

test("percentage trades: weekly = pct x $1,119.10 (to the cent) and hourly = weekly / 38", () => {
  for (const slug of PCT_TRADES) {
    const t = getTrade(slug)!;
    for (const r of t.junior) {
      assert.ok(r.pct !== undefined, `${slug} stage ${r.stage} has a pct`);
      const expected = (STANDARD_WEEKLY_RATE * (r.pct as number)) / 100;
      assert.ok(Math.abs(r.weekly - expected) <= 0.006, `${slug} ${r.stage} ${r.year12}: ${r.weekly} vs ${expected}`);
      const hourly = Math.round((r.weekly / FULL_TIME_HOURS) * 100) / 100;
      assert.ok(Math.abs(r.hourly - hourly) <= 0.011, `${slug} ${r.stage} hourly ${r.hourly} vs ${hourly}`);
    }
  }
});

test("headline first-year rates match the award tables", () => {
  const b = getTrade("building")!;
  assert.equal(apprenticeRate(b, "junior", 1, "not-completed")!.weekly, 559.55);
  assert.equal(apprenticeRate(b, "junior", 1, "completed")!.hourly, 16.2);
  const c = getTrade("cookery")!;
  // Hospitality award Table 7 has no Year 12 split.
  assert.equal(apprenticeRate(c, "junior", 1, "not-completed")!.hourly, 16.2);
  assert.equal(apprenticeRate(c, "junior", 4, "completed")!.weekly, 1063.15);
  const p = getTrade("plumbing")!;
  assert.equal(apprenticeRate(p, "junior", 1, "completed")!.hourly, 18.11);
  assert.equal(apprenticeRate(p, "junior", 4, "not-completed")!.hourly, 28.93);
});

test("automotive 4th-year junior is 88% and adult 1st year is 80% of R6", () => {
  const a = getTrade("automotive")!;
  assert.equal(apprenticeRate(a, "junior", 4, "completed")!.weekly, 984.81);
  assert.equal(apprenticeRate(a, "adult", 1, "completed")!.weekly, 895.28);
  assert.equal(apprenticeRate(a, "adult", 2, "completed")!.hourly, 25.74);
  assert.ok(Math.abs(984.81 - 0.88 * STANDARD_WEEKLY_RATE) < 0.006);
  assert.ok(Math.abs(895.28 - 0.8 * STANDARD_WEEKLY_RATE) < 0.006);
});

test("electrical rates are the Schedule B.4 hourly rates", () => {
  const e = getTrade("electrical")!;
  assert.equal(apprenticeRate(e, "junior", 1, "completed")!.hourly, 17.97);
  assert.equal(apprenticeRate(e, "junior", 1, "not-completed")!.hourly, 16.39);
  assert.equal(apprenticeRate(e, "junior", 4, "completed")!.hourly, 26.5);
  assert.equal(apprenticeRate(e, "adult", 1, "completed")!.hourly, 25.87);
  assert.equal(apprenticeRate(e, "adult", 3, "completed")!.hourly, 28.9);
});

test("plumbing weekly is Schedule E hourly x 38", () => {
  const p = getTrade("plumbing")!;
  for (const r of p.junior) {
    assert.ok(Math.abs(r.weekly - r.hourly * FULL_TIME_HOURS) <= 0.005);
  }
});

test("every trade has 4 stages for junior apprentices and rates rise with the stage", () => {
  for (const t of APPRENTICE_TRADES) {
    for (const y12 of ["completed", "not-completed"] as const) {
      const rates = ([1, 2, 3, 4] as const).map((s) => apprenticeRate(t, "junior", s, y12)!.hourly);
      for (let i = 1; i < rates.length; i++) assert.ok(rates[i] >= rates[i - 1], `${t.slug} ${y12}`);
      assert.equal(rates.length, 4);
    }
    assert.ok(t.award.url.startsWith("https://awards.fairwork.gov.au/MA000"));
  }
});

test("year 12 completers are never paid less than non-completers in the same stage", () => {
  for (const t of APPRENTICE_TRADES) {
    for (const s of [1, 2, 3, 4] as const) {
      const yes = apprenticeRate(t, "junior", s, "completed")!.hourly;
      const no = apprenticeRate(t, "junior", s, "not-completed")!.hourly;
      assert.ok(yes >= no, `${t.slug} stage ${s}`);
    }
  }
});

test("calculator: minimum for the hours entered, annual = weekly x 52", () => {
  const r = apprenticePay({ tradeSlug: "building", track: "junior", stage: 1, year12: "completed", hoursPerWeek: 38 })!;
  assert.equal(r.minHourly, 16.2);
  assert.equal(r.minWeekly, 615.6); // 16.20 x 38
  assert.equal(r.minAnnual, 32_011.2);
  const part = apprenticePay({ tradeSlug: "building", track: "junior", stage: 1, year12: "completed", hoursPerWeek: 20 })!;
  assert.equal(part.minWeekly, 324);
});

test("calculator: compares the employer's rate to the award minimum", () => {
  const under = apprenticePay({ tradeSlug: "cookery", track: "junior", stage: 2, year12: "completed", hoursPerWeek: 38, actualHourly: 17 })!;
  assert.equal(under.belowAward, true);
  assert.equal(under.hourlyDifference, -2.14);
  assert.equal(under.weeklyShortfall, 81.32);
  const over = apprenticePay({ tradeSlug: "cookery", track: "junior", stage: 2, year12: "completed", hoursPerWeek: 38, actualHourly: 21 })!;
  assert.equal(over.belowAward, false);
  assert.equal(over.weeklyShortfall, 0);
  const none = apprenticePay({ tradeSlug: "cookery", track: "junior", stage: 2, year12: "completed", hoursPerWeek: 38 })!;
  assert.equal(none.belowAward, null);
});

test("calculator: unknown trade or an untabulated adult track returns null", () => {
  assert.equal(apprenticePay({ tradeSlug: "nope", track: "junior", stage: 1, year12: "completed", hoursPerWeek: 38 }), null);
  assert.equal(apprenticePay({ tradeSlug: "plumbing", track: "adult", stage: 1, year12: "completed", hoursPerWeek: 38 }), null);
});
