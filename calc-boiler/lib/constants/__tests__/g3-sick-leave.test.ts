import assert from "node:assert/strict";
import { test } from "node:test";

import { SICK_LEAVE, accruedSickLeaveHours, annualSickLeaveHours, sickLeave, sickLeavePerPayPeriod } from "../sick-leave";

// G3 (wave 4). Worked examples from the Fair Work Ombudsman's "Paid sick and
// carer's leave" page, read 24 September 2026.

test("FWO example: 38 hours a week earns 76 hours a year; 19 hours earns 38", () => {
  assert.equal(annualSickLeaveHours(38), 76);
  assert.equal(annualSickLeaveHours(19), 38);
});

test("full-time 38-hour week = 10 days of 7.6 hours", () => {
  const r = sickLeave({ employment: "full-time", hoursPerWeek: 38, daysPerWeek: 5, weeksWorked: 52, takenHours: 0, baseHourlyRate: 30 });
  assert.equal(r.annualDays, SICK_LEAVE.fullTimeDaysPerYear);
  assert.equal(r.balanceHours, 76);
  assert.equal(r.balanceValue, 2280);
});

test("FWO example: spread of hours does not change accrual (38 h over 4 or 5 days)", () => {
  const five = sickLeave({ employment: "full-time", hoursPerWeek: 38, daysPerWeek: 5, weeksWorked: 52, takenHours: 0, baseHourlyRate: 0 });
  const four = sickLeave({ employment: "full-time", hoursPerWeek: 38, daysPerWeek: 4, weeksWorked: 52, takenHours: 0, baseHourlyRate: 0 });
  assert.equal(five.accruedHours, four.accruedHours);
  assert.equal(four.annualDays, 8); // 76 hours of 9.5-hour days
});

test("casuals accrue no paid sick leave", () => {
  const r = sickLeave({ employment: "casual", hoursPerWeek: 38, daysPerWeek: 5, weeksWorked: 104, takenHours: 10, baseHourlyRate: 30 });
  assert.equal(r.accruedHours, 0);
  assert.equal(r.balanceHours, 0);
  assert.equal(r.balanceValue, 0);
});

test("balance never goes negative and accrual is pro rata by weeks", () => {
  assert.equal(accruedSickLeaveHours(38, 26), 38);
  const r = sickLeave({ employment: "part-time", hoursPerWeek: 20, daysPerWeek: 4, weeksWorked: 13, takenHours: 50, baseHourlyRate: 30 });
  assert.equal(r.balanceHours, 0);
});

test("fortnightly accrual on 38 hours is 2.92 hours", () => {
  assert.equal(sickLeavePerPayPeriod(38, 2), 2.92);
});
