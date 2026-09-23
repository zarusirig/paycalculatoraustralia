import assert from "node:assert/strict";
import { test } from "node:test";

import {
  AWE_BY_INDUSTRY,
  AWE_BY_STATE,
  AWE_HEADLINE,
  EE_DISTRIBUTION_ALL,
  EE_DISTRIBUTION_FULL_TIME,
  EE_MEDIAN,
  EE_MEDIAN_BY_AGE,
  EE_MEDIAN_BY_INDUSTRY,
  EE_MEDIAN_BY_STATE,
  EE_PERCENTILES_ALL,
  HEADLINE,
  annualise,
  averageSalaryDescription,
  averageSalaryTitle,
  dollars,
  dollarsCents,
  salaryPercentile,
  shareEarningBelow,
} from "../index";

test("headline annual figures are the ABS weekly figures × 52", () => {
  assert.equal(HEADLINE.averageAnnual, 108_352);
  assert.equal(HEADLINE.medianFullTimeAnnual, 90_532);
  assert.equal(HEADLINE.medianAllAnnual, 74_100);
  assert.equal(HEADLINE.averageAllEmployeesAnnual, 82_118);
  assert.equal(HEADLINE.averageFullTimeTotalAnnual, 112_320);
  assert.equal(annualise(1000), 52_000);
});

test("title and description quote the computed figures", () => {
  assert.equal(
    averageSalaryTitle(),
    "Average Salary in Australia 2026: $108,352 a Year (Median $90,532)",
  );
  const d = averageSalaryDescription();
  assert.match(d, /\$108,352/);
  assert.match(d, /\$2,083\.70/);
  assert.match(d, /\$74,100/);
  assert.ok(d.length <= 320);
});

test("formatting helpers", () => {
  assert.equal(dollars(108352.4), "$108,352");
  assert.equal(dollarsCents(2083.7), "$2,083.70");
});

test("mean exceeds median, as the ABS data show", () => {
  assert.ok(AWE_HEADLINE.fullTimeOrdinaryWeekly > EE_MEDIAN.fullTime);
  assert.ok(EE_MEDIAN.fullTime > EE_MEDIAN.allEmployees);
});

test("tables have every state and every published industry", () => {
  assert.equal(AWE_BY_STATE.length, 8);
  assert.equal(EE_MEDIAN_BY_STATE.length, 8);
  assert.equal(AWE_BY_INDUSTRY.length, 18);
  assert.equal(EE_MEDIAN_BY_INDUSTRY.length, 19);
  assert.equal(EE_MEDIAN_BY_AGE.length, 8);
  // ACT is the highest AWE state; Tasmania the lowest.
  const sorted = [...AWE_BY_STATE].sort((a, b) => b.weekly - a.weekly);
  assert.equal(sorted[0].code, "ACT");
  assert.equal(sorted[sorted.length - 1].code, "TAS");
  // Mining is the highest-paying industry on both measures.
  assert.equal([...AWE_BY_INDUSTRY].sort((a, b) => b.weekly - a.weekly)[0].label, "Mining");
  assert.equal(EE_MEDIAN_BY_INDUSTRY[0].label, "Mining");
});

test("distribution counts sum to the ABS published totals", () => {
  assert.equal(EE_DISTRIBUTION_FULL_TIME.length, 51);
  assert.equal(EE_DISTRIBUTION_ALL.length, 51);
  const ft = EE_DISTRIBUTION_FULL_TIME.reduce((a, b) => a + b, 0);
  const all = EE_DISTRIBUTION_ALL.reduce((a, b) => a + b, 0);
  assert.ok(Math.abs(ft - 8450.043) < 0.01, `full-time total ${ft}`);
  assert.ok(Math.abs(all - 12257.647) < 0.01, `all total ${all}`);
  for (let i = 0; i < 51; i++) {
    assert.ok(EE_DISTRIBUTION_FULL_TIME[i] <= EE_DISTRIBUTION_ALL[i], `band ${i}`);
  }
});

test("distribution agrees with the published percentiles", () => {
  // Each published percentile must sit inside the band the counts put it in.
  for (const { percentile, weekly } of EE_PERCENTILES_ALL) {
    const floor = Math.floor(weekly / 100) * 100;
    const below = shareEarningBelow(floor, "all");
    const upTo = shareEarningBelow(floor + 100, "all");
    assert.ok(below <= percentile / 100 + 0.005, `${percentile}th: ${below}`);
    assert.ok(upTo >= percentile / 100 - 0.005, `${percentile}th: ${upTo}`);
  }
  // Full-time median $1,741 sits in the $1,700 band.
  assert.ok(shareEarningBelow(1700, "fullTime") < 0.5);
  assert.ok(shareEarningBelow(1800, "fullTime") > 0.5);
});

test("salaryPercentile returns a band range and never interpolates", () => {
  const r = salaryPercentile(HEADLINE.averageAnnual, "fullTime");
  assert.equal(r.bandFloor, 2000);
  assert.equal(r.bandCeiling, 2100);
  assert.ok(r.shareBelowFloor < r.shareBelowCeiling);
  assert.equal(r.shareBelowFloor, shareEarningBelow(2000, "fullTime"));

  const top = salaryPercentile(1_000_000, "all");
  assert.equal(top.bandFloor, 5000);
  assert.equal(top.bandCeiling, null);
  assert.equal(top.shareBelowCeiling, 1);

  const zero = salaryPercentile(0, "all");
  assert.equal(zero.shareBelowFloor, 0);

  assert.throws(() => salaryPercentile(-1, "all"));
  assert.throws(() => shareEarningBelow(150, "all"));
});

test("full-time earners rank lower than against all employees at the same salary", () => {
  const ft = salaryPercentile(90_000, "fullTime");
  const all = salaryPercentile(90_000, "all");
  assert.ok(all.shareBelowFloor > ft.shareBelowFloor);
});
