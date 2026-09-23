import assert from "node:assert/strict";
import { test } from "node:test";

import {
  DEFAULT_CONTRACTOR_ASSUMPTIONS,
  WEEKDAY_PUBLIC_HOLIDAYS_2026,
  WORKING_DAYS_PER_YEAR,
  contractorRateToEquivalentSalary,
} from "../contractor-rate";
import { SUPER_GUARANTEE } from "../australian-tax";
import { STATE_PUBLIC_HOLIDAYS } from "../../data/public-holidays";

test("defaults: 260 weekdays less 20 AL, 10 PL, 10 PH, 10 downtime = 210 billable days of 7.6 h", () => {
  assert.equal(WORKING_DAYS_PER_YEAR, 260);
  assert.equal(DEFAULT_CONTRACTOR_ASSUMPTIONS.hoursPerDay, 7.6);
  const r = contractorRateToEquivalentSalary(100, "hour");
  assert.equal(r.billableDays, 210);
  assert.equal(r.billableHours, 1596);
});

test("$100/hr: $159,600 billed − $3,000 costs = $156,600 package ÷ 1.12 = $139,821 salary", () => {
  const r = contractorRateToEquivalentSalary(100, "hour");
  assert.equal(r.billedIncome, 159_600);
  assert.equal(r.insurance + r.admin, 3_000);
  assert.equal(r.packageValue, 156_600);
  assert.equal(r.equivalentSalary, 139_821);
  assert.equal(r.superSelfFunded, 16_779);
  assert.equal(r.leaveValue, 21_511); // 40 paid days off ÷ 260 of the salary
  assert.equal(r.employeeHourly, 70.76);
});

test("salary + SG on the salary + costs reproduces the billed income", () => {
  for (const rate of [30, 50, 75, 100, 150]) {
    const r = contractorRateToEquivalentSalary(rate, "hour");
    const rebuilt = r.equivalentSalary * (1 + SUPER_GUARANTEE.rate) + r.insurance + r.admin;
    assert.ok(Math.abs(rebuilt - r.billedIncome) <= 1, `rate ${rate}: ${rebuilt} vs ${r.billedIncome}`);
  }
});

test("day rate: $1,000/day × 210 days = $210,000 billed → $184,821 salary", () => {
  const r = contractorRateToEquivalentSalary(1_000, "day");
  assert.equal(r.billedIncome, 210_000);
  assert.equal(r.equivalentSalary, 184_821);
});

test("super is capped at the maximum contribution base", () => {
  const r = contractorRateToEquivalentSalary(2_500, "day");
  assert.equal(r.packageValue, 522_000);
  assert.equal(r.equivalentSalary, Math.round(522_000 - SUPER_GUARANTEE.maxSGAnnual));
  assert.ok(r.equivalentSalary > SUPER_GUARANTEE.maxContributionBaseAnnual);
  assert.ok(Math.abs(r.superSelfFunded - SUPER_GUARANTEE.maxSGAnnual) <= 1);
});

test("equivalent salary rises with the rate and is always below billed income", () => {
  let prev = -1;
  for (let rate = 20; rate <= 300; rate += 5) {
    const r = contractorRateToEquivalentSalary(rate);
    assert.ok(r.equivalentSalary > prev);
    assert.ok(r.equivalentSalary < r.billedIncome);
    prev = r.equivalentSalary;
  }
});

test("overrides change billable days and costs", () => {
  const r = contractorRateToEquivalentSalary(100, "hour", { downtimeDays: 0, insurancePerYear: 0, adminPerYear: 0 });
  assert.equal(r.billableDays, 220);
  assert.equal(r.billedIncome, 167_200);
  assert.equal(r.equivalentSalary, Math.round(167_200 / 1.12));
});

test("bad input never goes negative or NaN", () => {
  for (const rate of [0, -50, Number.NaN, Number.POSITIVE_INFINITY]) {
    const r = contractorRateToEquivalentSalary(rate);
    assert.equal(r.billedIncome, 0);
    assert.equal(r.equivalentSalary, 0);
    assert.equal(r.superSelfFunded, 0);
  }
  const tiny = contractorRateToEquivalentSalary(1, "hour"); // $1,596 billed < $3,000 costs
  assert.equal(tiny.packageValue, 0);
  assert.equal(tiny.equivalentSalary, 0);
  const allLeave = contractorRateToEquivalentSalary(100, "hour", { downtimeDays: 500 });
  assert.equal(allLeave.billableDays, 0);
  assert.equal(allLeave.equivalentSalary, 0);
});

test("the 10 public holiday assumption sits inside the 2026 state range, and the range matches the data", () => {
  const counts = STATE_PUBLIC_HOLIDAYS.map((s) => {
    const y = s.years.find((x) => x.year === 2026);
    assert.ok(y, `${s.slug} has 2026`);
    return y.holidays.filter((h) => {
      if (h.kind !== "statewide" && h.kind !== "additional") return false;
      const wd = new Date(`${h.date}T00:00:00Z`).getUTCDay();
      return wd !== 0 && wd !== 6;
    }).length;
  });
  assert.equal(Math.min(...counts), WEEKDAY_PUBLIC_HOLIDAYS_2026.min);
  assert.equal(Math.max(...counts), WEEKDAY_PUBLIC_HOLIDAYS_2026.max);
  const ph = DEFAULT_CONTRACTOR_ASSUMPTIONS.publicHolidayDays;
  assert.ok(ph >= WEEKDAY_PUBLIC_HOLIDAYS_2026.min && ph <= WEEKDAY_PUBLIC_HOLIDAYS_2026.max);
});
