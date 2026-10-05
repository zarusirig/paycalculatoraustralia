import assert from "node:assert/strict";
import { test } from "node:test";

import {
  ANNUAL_LEAVE,
  accruedLeaveHours,
  annualLeave,
  annualLeaveHoursPerYear,
  leaveHoursPerPayPeriod,
  leavePayoutTax,
} from "../annual-leave";

// Worked examples from the Fair Work Ombudsman "Annual leave" page, read 5
// October 2026: 4 weeks a year based on ordinary hours; a part-timer on 20
// hours a week accumulates 80 hours.

test("FWO example: 20 hours a week accumulates 80 hours a year", () => {
  assert.equal(annualLeaveHoursPerYear(20), 80);
});

test("full-time 38-hour week earns 152 hours a year (4 weeks)", () => {
  assert.equal(annualLeaveHoursPerYear(38), 152);
  assert.equal(ANNUAL_LEAVE.weeksPerYear, 4);
});

test("shiftworker week: 5 weeks is 190 hours on a 38-hour week", () => {
  assert.equal(annualLeaveHoursPerYear(38, ANNUAL_LEAVE.shiftworkerWeeksPerYear), 190);
});

test("accrual is 1/13 of ordinary hours: 6 months of 38-hour weeks = 76 hours", () => {
  assert.equal(accruedLeaveHours(38, 26), 76);
  assert.equal(accruedLeaveHours(38, 52), 152);
});

test("per pay period: 38 hours earns 5.85 hours a fortnight, 2.92 a week", () => {
  assert.equal(leaveHoursPerPayPeriod(38, 2), 5.85);
  assert.equal(leaveHoursPerPayPeriod(38, 1), 2.92);
  assert.equal(leaveHoursPerPayPeriod(38, 4), 11.69);
});

test("a full year at $40/h pays $6,080 base, $7,144 with 17.5% loading", () => {
  const base = annualLeave({ employment: "full-time", hoursPerWeek: 38, daysPerWeek: 5, weeksWorked: 52, takenHours: 0, baseHourlyRate: 40 });
  assert.equal(base.balanceHours, 152);
  assert.equal(base.balanceDays, 20);
  assert.equal(base.balanceWeeks, 4);
  assert.equal(base.baseValue, 6_080);
  assert.equal(base.totalValue, 6_080);
  const withLoading = annualLeave({ employment: "full-time", hoursPerWeek: 38, daysPerWeek: 5, weeksWorked: 52, takenHours: 0, baseHourlyRate: 40, includeLoading: true });
  assert.equal(withLoading.loadingValue, 1_064);
  assert.equal(withLoading.totalValue, 7_144);
});

test("leave taken reduces the balance and never below zero", () => {
  const r = annualLeave({ employment: "full-time", hoursPerWeek: 38, daysPerWeek: 5, weeksWorked: 52, takenHours: 38, baseHourlyRate: 30 });
  assert.equal(r.balanceHours, 114);
  const over = annualLeave({ employment: "full-time", hoursPerWeek: 38, daysPerWeek: 5, weeksWorked: 10, takenHours: 500, baseHourlyRate: 30 });
  assert.equal(over.balanceHours, 0);
});

test("casuals accrue no paid annual leave", () => {
  const r = annualLeave({ employment: "casual", hoursPerWeek: 38, daysPerWeek: 5, weeksWorked: 104, takenHours: 0, baseHourlyRate: 40 });
  assert.equal(r.accruedHours, 0);
  assert.equal(r.balanceHours, 0);
  assert.equal(r.totalValue, 0);
});

test("part-time spread of hours does not change accrual (days only change the day count)", () => {
  const five = annualLeave({ employment: "part-time", hoursPerWeek: 20, daysPerWeek: 5, weeksWorked: 52, takenHours: 0, baseHourlyRate: 0 });
  const four = annualLeave({ employment: "part-time", hoursPerWeek: 20, daysPerWeek: 4, weeksWorked: 52, takenHours: 0, baseHourlyRate: 0 });
  assert.equal(five.accruedHours, four.accruedHours);
  assert.equal(five.balanceDays, 20);
  assert.equal(four.balanceDays, 16);
});

test("genuine redundancy payout is withheld at 32% (ATO Schedule 7)", () => {
  const t = leavePayoutTax(90_000, 10_000, "genuine-redundancy");
  assert.equal(t.tax, 3_200);
  assert.equal(t.net, 6_800);
});

test("normal termination payout is taxed at marginal rates plus Medicare", () => {
  const t = leavePayoutTax(90_000, 10_000, "normal-termination");
  // $90k to $100k stays inside the 30% bracket: 30% + 2% Medicare
  assert.equal(t.tax, 3_200);
  const crossing = leavePayoutTax(130_000, 10_000, "normal-termination");
  assert.equal(crossing.tax, 3_550);
});
