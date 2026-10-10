import assert from "node:assert/strict";
import { test } from "node:test";

import {
  HIGH_BAND_MIN,
  LOW_BAND_MAX,
  div293Effect,
  hecsShift,
  hoursRows,
  jobsOnPage,
  landingSalary,
  lowIncomeHelp,
  minimumWageOnPage,
  mlsAhead,
  mlsEffect,
  occupationsOnPage,
  publicPayOnPage,
  sacrificeEffect,
  sgCap,
  takeHomeBand,
  yearChange,
} from "../take-home-sections";
import { TAKE_HOME_SALARIES } from "../index";
import { EMPLOYMENT, HECS_HELP, HECS_HELP_2025_26, MEDICARE_LEVY, TAX_BRACKETS, TAX_FREE_THRESHOLD } from "../../../constants/australian-tax";
import { OCCUPATION_MEDIANS } from "../../occupation-medians/index";

test("bands follow the 15% bracket and the surcharge threshold", () => {
  assert.equal(LOW_BAND_MAX, TAX_BRACKETS[1].max);
  assert.equal(HIGH_BAND_MIN, MEDICARE_LEVY.surcharge.tier1.min);
  assert.equal(takeHomeBand(20_000), "low");
  assert.equal(takeHomeBand(45_000), "low");
  assert.equal(takeHomeBand(50_000), "middle");
  assert.equal(takeHomeBand(105_000), "middle");
  assert.equal(takeHomeBand(110_000), "high");
  assert.equal(takeHomeBand(500_000), "high");
});

test("every kept salary lands on itself and midpoints go to the lower page", () => {
  for (const s of TAKE_HOME_SALARIES) assert.equal(landingSalary(s), s);
  assert.equal(landingSalary(22_500), 20_000);
  assert.equal(landingSalary(22_501), 25_000);
  assert.equal(landingSalary(205_000), 200_000);
  assert.equal(landingSalary(205_001), 200_000);
  assert.equal(landingSalary(225_000), 200_000);
  assert.equal(landingSalary(225_001), 250_000);
  assert.equal(landingSalary(1_000), null);
});

test("change since 2025-26: 1c on the 15% slice, HECS threshold indexation", () => {
  assert.equal(yearChange(20_000).change, 0, "LITO cancels tax in both years");
  assert.equal(yearChange(25_000).change, Math.round((25_000 - TAX_FREE_THRESHOLD) * 0.01));
  for (const s of [45_000, 80_000, 200_000]) assert.equal(yearChange(s).change, Math.round((45_000 - TAX_FREE_THRESHOLD) * 0.01));
  const y = yearChange(80_000);
  assert.equal(y.hecsChange, Math.round((HECS_HELP.minimumThreshold - HECS_HELP_2025_26.minimumThreshold) * 0.15));
  assert.equal(yearChange(200_000).hecsChange, 0, "top band is 10% of income both years");
  assert.equal(yearChange(80_000).next.gain, yearChange(80_000).next.fromRateCut + yearChange(80_000).next.fromWato);
  assert.equal(yearChange(20_000).next.gain, 0);
});

test("hours a week at the minimum wage and award entry rates", () => {
  const rows = hoursRows(30_000);
  assert.equal(rows.length, 3);
  assert.equal(rows[0].hourly, EMPLOYMENT.minimumWageHourly);
  assert.equal(rows[0].hours, Math.round((30_000 / 52 / EMPLOYMENT.minimumWageHourly) * 10) / 10);
  for (const r of rows) {
    assert.ok(r.casualHourly > r.hourly);
    assert.ok(r.casualHours < r.hours);
    assert.ok(r.sourceUrl.startsWith("https://"));
  }
});

test("each full-time junior minimum lands on one low page", () => {
  const ages = TAKE_HOME_SALARIES.flatMap((s) => minimumWageOnPage(s).juniors.map((j) => j.age));
  assert.equal(new Set(ages).size, ages.length);
  assert.deepEqual(minimumWageOnPage(30_000).juniors.map((j) => j.age), ["17"]);
  assert.equal(minimumWageOnPage(50_000).adult, true);
  assert.equal(minimumWageOnPage(40_000).juniors.length, 0);
});

test("low-income offsets by stage", () => {
  assert.equal(lowIncomeHelp(20_000).incomeTax, 0);
  assert.equal(lowIncomeHelp(25_000).medicareStage, "exempt");
  assert.equal(lowIncomeHelp(30_000).medicareStage, "shade-in");
  assert.equal(lowIncomeHelp(40_000).medicareStage, "full");
  assert.equal(lowIncomeHelp(40_000).litoStage, "phase-out");
  const l30 = lowIncomeHelp(30_000);
  assert.equal(l30.listoNow, 500);
  assert.equal(l30.listoNowCapped, true);
  assert.equal(l30.listoNext, 540);
  assert.equal(lowIncomeHelp(40_000).listoNow, 0);
  assert.equal(lowIncomeHelp(40_000).listoNext, 720);
  assert.equal(lowIncomeHelp(25_000).coContribution, 500);
});

test("salary sacrifice: $5,000 at the marginal rate, capped by concessional room", () => {
  const e = sacrificeEffect(80_000);
  assert.equal(e.amount, 5_000);
  assert.equal(e.takeHomeCost, 3_400);
  assert.equal(e.intoSuper, 4_250);
  assert.equal(e.netGain, 850);
  assert.equal(sacrificeEffect(50_000).litoGain, 75);
  const capped = sacrificeEffect(230_000);
  assert.equal(capped.fits, false);
  assert.equal(capped.amount, capped.room);
  assert.equal(sacrificeEffect(280_000).amount, 0);
});

test("HECS-HELP shows only where a neighbouring page is in another band", () => {
  for (const s of [65_000, 70_000, 125_000, 130_000, 185_000, 190_000]) assert.ok(hecsShift(s), `${s}`);
  for (const s of [30_000, 80_000, 120_000, 200_000]) assert.equal(hecsShift(s), null, `${s}`);
  assert.equal(hecsShift(70_000)?.prev?.repayment, 0);
});

test("surcharge, Division 293 and the SG cap appear only where they apply", () => {
  assert.equal(mlsEffect(105_000), null);
  assert.equal(mlsEffect(110_000)?.tier, 1);
  assert.equal(mlsEffect(125_000)?.tier, 2);
  assert.equal(mlsEffect(200_000)?.next, null);
  assert.ok(mlsAhead(100_000));
  assert.equal(mlsAhead(90_000), null);
  assert.equal(div293Effect(220_000), null);
  assert.equal(div293Effect(230_000)?.amount, 1_140);
  assert.equal(sgCap(270_000), null);
  assert.ok(sgCap(280_000));
});

test("jobs: each figure on one page, at least three names", () => {
  const seenOcc = new Map<string, number>();
  const seenPay = new Map<string, number>();
  for (const s of TAKE_HOME_SALARIES) {
    for (const o of occupationsOnPage(s)) {
      assert.ok(!seenOcc.has(o.anzscoCode), `${o.anzscoCode} on ${seenOcc.get(o.anzscoCode)} and ${s}`);
      seenOcc.set(o.anzscoCode, s);
    }
    const pay = publicPayOnPage(s);
    const rows = new Set(pay.map((p) => (p.groupKey.startsWith("employer|") ? `employer|${p.point}|${p.annual}` : p.id)));
    assert.ok(rows.size <= 14, `${s}: ${rows.size} rows`);
    for (let i = 1; i < pay.length; i++) assert.ok(pay[i].annual >= pay[i - 1].annual);
    for (const p of pay) {
      assert.ok(!seenPay.has(p.id), `${p.id} twice`);
      seenPay.set(p.id, s);
    }
    const j = jobsOnPage(s);
    if (j.show) assert.ok(j.occupations.length + j.publicPay.length >= 3);
  }
  assert.equal(seenOcc.size, OCCUPATION_MEDIANS.length, "every occupation median lands on some page");
});
