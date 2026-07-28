// =============================================================================
// Work hours / timesheet arithmetic tests.
//
// Run with: npm test
//
// The overnight case is the reason this file exists. Every timesheet tool that
// gets it wrong gets it wrong the same way: end minus start, no day wrap, so a
// 22:00–06:00 shift reads as minus sixteen hours and the week silently loses a
// day. The zero-length case is the mirror image — wrapping too eagerly turns
// 09:00 to 09:00 into a 24-hour shift.
// =============================================================================

import { test } from "node:test";
import assert from "node:assert/strict";

import { EMPLOYMENT } from "../australian-tax";
import {
  CASUAL_LOADING,
  OVERTIME_DEFAULTS,
  STANDARD_WEEKLY_HOURS,
  calculateShift,
  calculateTimesheet,
  calculateTimesheetPay,
  decimalHoursToHm,
  decimalHoursToMinutes,
  elapsedMinutes,
  formatMinutesAsTime,
  minutesToDecimalHours,
  minutesToHm,
  parseTimeToMinutes,
  splitOvertime,
} from "../work-hours";

// ---------------------------------------------------------------------------
// Constants are derived, not retyped
// ---------------------------------------------------------------------------

test("standard weekly hours come from EMPLOYMENT, not a literal", () => {
  assert.equal(STANDARD_WEEKLY_HOURS, EMPLOYMENT.standardWeeklyHours);
  assert.equal(STANDARD_WEEKLY_HOURS, 38);
});

test("casual loading comes from EMPLOYMENT, not a literal", () => {
  assert.equal(CASUAL_LOADING, EMPLOYMENT.casualLoading);
  assert.equal(CASUAL_LOADING, 0.25);
});

test("the default overtime threshold is the standard week", () => {
  assert.equal(OVERTIME_DEFAULTS.thresholdHours, EMPLOYMENT.standardWeeklyHours);
});

// ---------------------------------------------------------------------------
// Clock parsing
// ---------------------------------------------------------------------------

test("parseTimeToMinutes reads 24-hour clock times", () => {
  assert.equal(parseTimeToMinutes("00:00"), 0);
  assert.equal(parseTimeToMinutes("09:00"), 540);
  assert.equal(parseTimeToMinutes("9:05"), 545);
  assert.equal(parseTimeToMinutes("17:30"), 1_050);
  assert.equal(parseTimeToMinutes("23:59"), 1_439);
  // Some browsers hand back seconds from <input type="time">.
  assert.equal(parseTimeToMinutes("17:30:00"), 1_050);
});

test("parseTimeToMinutes rejects junk instead of guessing", () => {
  assert.equal(parseTimeToMinutes(""), null);
  assert.equal(parseTimeToMinutes("   "), null);
  assert.equal(parseTimeToMinutes("24:00"), null);
  assert.equal(parseTimeToMinutes("09:60"), null);
  assert.equal(parseTimeToMinutes("9am"), null);
  assert.equal(parseTimeToMinutes("930"), null);
});

test("formatMinutesAsTime round-trips", () => {
  assert.equal(formatMinutesAsTime(0), "00:00");
  assert.equal(formatMinutesAsTime(540), "09:00");
  assert.equal(formatMinutesAsTime(1_439), "23:59");
  assert.equal(formatMinutesAsTime(1_440), "00:00");
});

// ---------------------------------------------------------------------------
// A normal shift
// ---------------------------------------------------------------------------

test("normal shift: 09:00–17:00 with a 30-minute break is 7.5 hours", () => {
  const r = calculateShift({ start: "09:00", end: "17:00", breakMinutes: 30 });
  assert.equal(r.valid, true);
  assert.equal(r.overnight, false);
  assert.equal(r.elapsedMinutes, 480);
  assert.equal(r.breakMinutes, 30);
  assert.equal(r.paidMinutes, 450);
  assert.equal(r.paidHours, 7.5);
});

test("normal shift with no break is the full span", () => {
  const r = calculateShift({ start: "09:00", end: "17:00" });
  assert.equal(r.paidMinutes, 480);
  assert.equal(r.paidHours, 8);
  assert.equal(r.breakMinutes, 0);
});

test("a shift finishing at 23:59 does not wrap", () => {
  const r = calculateShift({ start: "18:00", end: "23:59" });
  assert.equal(r.overnight, false);
  assert.equal(r.paidMinutes, 359);
});

// ---------------------------------------------------------------------------
// Overnight shifts — the one everybody gets wrong
// ---------------------------------------------------------------------------

test("overnight shift: 22:00–06:00 is 8 hours, not minus 16", () => {
  const r = calculateShift({ start: "22:00", end: "06:00" });
  assert.equal(r.valid, true);
  assert.equal(r.overnight, true);
  assert.equal(r.elapsedMinutes, 480);
  assert.equal(r.paidHours, 8);
});

test("overnight shift with a break: 23:30–07:30 less 45 minutes is 7.25 hours", () => {
  const r = calculateShift({ start: "23:30", end: "07:30", breakMinutes: 45 });
  assert.equal(r.overnight, true);
  assert.equal(r.paidMinutes, 435);
  assert.equal(r.paidHours, 7.25);
  assert.equal(decimalHoursToHm(r.paidHours), "7:15");
});

test("overnight shift ending at exactly midnight", () => {
  // 20:00 → 00:00 wraps: end (0) is earlier than start (1,200).
  const r = calculateShift({ start: "20:00", end: "00:00" });
  assert.equal(r.overnight, true);
  assert.equal(r.paidHours, 4);
});

test("elapsedMinutes wraps only when the end is earlier than the start", () => {
  assert.equal(elapsedMinutes(540, 1_020), 480); // 09:00 → 17:00
  assert.equal(elapsedMinutes(1_320, 360), 480); // 22:00 → 06:00
  assert.equal(elapsedMinutes(540, 540), 0); // 09:00 → 09:00
  assert.equal(elapsedMinutes(0, 1_439), 1_439); // 00:00 → 23:59
});

// ---------------------------------------------------------------------------
// Zero-length shift
// ---------------------------------------------------------------------------

test("zero-length shift: 09:00–09:00 is 0 hours, not 24", () => {
  const r = calculateShift({ start: "09:00", end: "09:00" });
  assert.equal(r.valid, true);
  assert.equal(r.overnight, false);
  assert.equal(r.elapsedMinutes, 0);
  assert.equal(r.paidMinutes, 0);
  assert.equal(r.paidHours, 0);
});

test("an empty row is not counted at all", () => {
  const r = calculateShift({ start: "", end: "", breakMinutes: 30 });
  assert.equal(r.valid, false);
  assert.equal(r.paidMinutes, 0);
  assert.equal(r.breakMinutes, 0);
});

// ---------------------------------------------------------------------------
// Break longer than the shift
// ---------------------------------------------------------------------------

test("break longer than the shift clamps to zero paid time, never negative", () => {
  const r = calculateShift({ start: "09:00", end: "09:30", breakMinutes: 60 });
  assert.equal(r.valid, true);
  assert.equal(r.elapsedMinutes, 30);
  assert.equal(r.requestedBreakMinutes, 60);
  assert.equal(r.breakMinutes, 30); // only what the shift can absorb
  assert.equal(r.breakExceedsShift, true);
  assert.equal(r.paidMinutes, 0);
  assert.equal(r.paidHours, 0);
});

test("break exactly equal to the shift is zero paid time and not flagged", () => {
  const r = calculateShift({ start: "12:00", end: "12:30", breakMinutes: 30 });
  assert.equal(r.paidMinutes, 0);
  assert.equal(r.breakExceedsShift, false);
});

test("a negative break is ignored rather than adding time", () => {
  const r = calculateShift({ start: "09:00", end: "17:00", breakMinutes: -60 });
  assert.equal(r.breakMinutes, 0);
  assert.equal(r.paidMinutes, 480);
});

// ---------------------------------------------------------------------------
// Decimal ↔ h:mm conversion
// ---------------------------------------------------------------------------

test("minutes to decimal hours", () => {
  assert.equal(minutesToDecimalHours(450), 7.5);
  assert.equal(minutesToDecimalHours(465), 7.75);
  assert.equal(minutesToDecimalHours(455), 7.58); // 7.5833… → 2dp
  assert.equal(minutesToDecimalHours(0), 0);
});

test("minutes to h:mm", () => {
  assert.equal(minutesToHm(450), "7:30");
  assert.equal(minutesToHm(465), "7:45");
  assert.equal(minutesToHm(5), "0:05");
  assert.equal(minutesToHm(0), "0:00");
  assert.equal(minutesToHm(2_280), "38:00");
  assert.equal(minutesToHm(-30), "0:00");
});

test("decimal hours to h:mm and back", () => {
  assert.equal(decimalHoursToHm(7.5), "7:30");
  assert.equal(decimalHoursToHm(7.25), "7:15");
  assert.equal(decimalHoursToHm(0.1), "0:06");
  assert.equal(decimalHoursToHm(38), "38:00");
  assert.equal(decimalHoursToMinutes(7.5), 450);
  assert.equal(decimalHoursToMinutes(0.25), 15);
  // The pair that trips people up: 7.5 hours is 7h 30m, not 7h 50m.
  assert.notEqual(decimalHoursToHm(7.5), "7:50");
});

// ---------------------------------------------------------------------------
// Weekly totals
// ---------------------------------------------------------------------------

test("five 8-hour days less a 30-minute break each is exactly 37.5 hours", () => {
  const rows = Array.from({ length: 5 }, () => ({
    start: "09:00",
    end: "17:00",
    breakMinutes: 30,
  }));
  const t = calculateTimesheet(rows);
  assert.equal(t.totalHours, 37.5);
  assert.equal(t.breakMinutes, 150);
  assert.equal(t.daysWorked, 5);
  assert.equal(t.rowsEntered, 5);
});

test("a week of overnight shifts totals correctly", () => {
  const rows = Array.from({ length: 4 }, () => ({ start: "22:00", end: "06:30" }));
  const t = calculateTimesheet(rows);
  assert.equal(t.totalHours, 34);
  assert.equal(t.rows.every((r) => r.overnight), true);
});

test("blank rows do not count as days worked", () => {
  const t = calculateTimesheet([
    { start: "09:00", end: "17:00" },
    { start: "", end: "" },
    { start: "09:00", end: "09:00" },
  ]);
  assert.equal(t.rowsEntered, 2);
  assert.equal(t.daysWorked, 1);
  assert.equal(t.totalHours, 8);
});

// ---------------------------------------------------------------------------
// Overtime split
// ---------------------------------------------------------------------------

test("exactly 38 hours produces no overtime", () => {
  const s = splitOvertime(38);
  assert.equal(s.ordinaryHours, 38);
  assert.equal(s.overtimeHours, 0);
  assert.equal(s.firstTierHours, 0);
  assert.equal(s.secondTierHours, 0);
});

test("37.99 hours produces no overtime", () => {
  assert.equal(splitOvertime(37.99).overtimeHours, 0);
});

test("40 hours produces 2 hours of overtime, all in the first band", () => {
  const s = splitOvertime(40);
  assert.equal(s.ordinaryHours, 38);
  assert.equal(s.overtimeHours, 2);
  assert.equal(s.firstTierHours, 2);
  assert.equal(s.secondTierHours, 0);
});

test("43.5 hours spills past the first band into the second", () => {
  const s = splitOvertime(43.5);
  assert.equal(s.ordinaryHours, 38);
  assert.equal(s.overtimeHours, 5.5);
  assert.equal(s.firstTierHours, 2);
  assert.equal(s.secondTierHours, 3.5);
});

test("the threshold and band widths are configurable per award", () => {
  // A flat time-and-a-half award: one very wide first band, nothing after it.
  const flat = splitOvertime(45, { firstTierHours: 1_000 });
  assert.equal(flat.firstTierHours, 7);
  assert.equal(flat.secondTierHours, 0);

  // A fortnightly period: 76 ordinary hours.
  const fortnight = splitOvertime(80, { thresholdHours: 76 });
  assert.equal(fortnight.ordinaryHours, 76);
  assert.equal(fortnight.overtimeHours, 4);
});

test("overtime can be switched off entirely", () => {
  const s = splitOvertime(50, { enabled: false });
  assert.equal(s.ordinaryHours, 50);
  assert.equal(s.overtimeHours, 0);
});

test("negative or non-finite hours degrade to zero", () => {
  assert.equal(splitOvertime(-10).ordinaryHours, 0);
  assert.equal(splitOvertime(Number.NaN).ordinaryHours, 0);
});

// ---------------------------------------------------------------------------
// Pay
// ---------------------------------------------------------------------------

test("38 hours at $30 with no overtime is $1,140", () => {
  const p = calculateTimesheetPay({ totalHours: 38, hourlyRate: 30 });
  assert.equal(p.gross, 1_140);
  assert.equal(p.overtimePay, 0);
  assert.equal(p.casualLoadingAmount, 0);
});

test("40 hours at $30 is $1,140 ordinary plus $90 overtime", () => {
  const p = calculateTimesheetPay({ totalHours: 40, hourlyRate: 30 });
  assert.equal(p.ordinaryPay, 1_140);
  assert.equal(p.firstTierPay, 90); // 2 h × $30 × 1.5
  assert.equal(p.secondTierPay, 0);
  assert.equal(p.gross, 1_230);
});

test("42 hours at $30 splits 2 h at time and a half and 2 h at double time", () => {
  const p = calculateTimesheetPay({ totalHours: 42, hourlyRate: 30 });
  assert.equal(p.firstTierPay, 90); // 2 × 30 × 1.5
  assert.equal(p.secondTierPay, 120); // 2 × 30 × 2.0
  assert.equal(p.overtimePay, 210);
  assert.equal(p.gross, 1_350);
});

test("casual loading lifts the rate by 25% before any multiplier", () => {
  const p = calculateTimesheetPay({ totalHours: 38, hourlyRate: 30, casual: true });
  assert.equal(p.effectiveRate, 37.5);
  assert.equal(p.gross, 1_425);
  assert.equal(p.casualLoadingAmount, 285);
});

test("casual loading applies to overtime hours too", () => {
  const p = calculateTimesheetPay({ totalHours: 40, hourlyRate: 30, casual: true });
  // 38 × 37.50 = 1,425; 2 × 37.50 × 1.5 = 112.50
  assert.equal(p.gross, 1_537.5);
  assert.equal(p.casualLoadingAmount, 307.5);
});

test("a zero rate produces zero pay without blowing up", () => {
  const p = calculateTimesheetPay({ totalHours: 40, hourlyRate: 0 });
  assert.equal(p.gross, 0);
  assert.equal(p.effectiveRate, 0);
});

test("gross is rounded to cents", () => {
  const p = calculateTimesheetPay({ totalHours: 7.58, hourlyRate: 26.44 });
  assert.equal(p.gross, 200.42);
});

// ---------------------------------------------------------------------------
// End to end: a real roster
// ---------------------------------------------------------------------------

test("end to end: four night shifts and two days = 46 h, priced with overtime", () => {
  const rows = [
    { start: "22:00", end: "06:00", breakMinutes: 30 }, // 7.5
    { start: "22:00", end: "06:00", breakMinutes: 30 }, // 7.5
    { start: "22:00", end: "06:00", breakMinutes: 30 }, // 7.5
    { start: "22:00", end: "06:00", breakMinutes: 30 }, // 7.5
    { start: "08:00", end: "16:30", breakMinutes: 30 }, // 8.0
    { start: "08:00", end: "16:30", breakMinutes: 30 }, // 8.0
    { start: "", end: "" },
  ];
  const t = calculateTimesheet(rows);
  assert.equal(t.totalHours, 46);
  assert.equal(minutesToHm(t.paidMinutes), "46:00");

  const p = calculateTimesheetPay({ totalHours: t.totalHours, hourlyRate: 32 });
  assert.equal(p.split.ordinaryHours, 38);
  assert.equal(p.split.firstTierHours, 2);
  assert.equal(p.split.secondTierHours, 6);
  // 38 × 32 = 1,216; 2 × 32 × 1.5 = 96; 6 × 32 × 2 = 384
  assert.equal(p.gross, 1_696);
});
