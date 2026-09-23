// =============================================================================
// F7: pay periods, FIFO pay and Centrelink payment dates
// Run with: npm test
// =============================================================================

import { test } from "node:test";
import assert from "node:assert/strict";

import {
  FY_2026_27,
  addMonthsClamped,
  extraPayTriggers,
  extraPayWithholding,
  financialYear,
  financialYearOf,
  isValidIso,
  payDatesBetween,
  payYearSummary,
  weekdayName,
  weeksInCalendarYear,
} from "../pay-periods";
import { calculateFifoPay, FIFO_DEFAULTS, ROSTER_PRESETS } from "../fifo-pay";
import { calculatePayBreakdown, SUPER_GUARANTEE } from "../australian-tax";
import {
  CHRISTMAS_2025_26,
  CHRISTMAS_2026_27_PUBLISHED,
  HOLIDAYS_2026_27,
  daysEarly,
  projectFortnightlyDates,
} from "../centrelink-payment-dates";

// ---------------------------------------------------------------------------
// Pay periods
// ---------------------------------------------------------------------------

test("FY2026-27 runs 1 July 2026 (a Wednesday) to 30 June 2027, 365 days", () => {
  assert.equal(FY_2026_27.label, "2026-27");
  assert.equal(FY_2026_27.days, 365);
  assert.equal(weekdayName("2026-07-01"), "Wednesday");
  assert.equal(weekdayName("2027-06-30"), "Wednesday");
});

test("weekly Wednesday pays give 53 pay days in 2026-27; Thursday gives 52", () => {
  const wed = payYearSummary("2026-07-01", "weekly");
  assert.equal(wed.count, 53);
  assert.equal(wed.extraPayYear, true);
  const thu = payYearSummary("2026-07-02", "weekly");
  assert.equal(thu.count, 52);
  assert.equal(thu.extraPayYear, false);
});

test("fortnightly: only a pay day on 1 July 2026 gives 27 pays in 2026-27", () => {
  assert.equal(payYearSummary("2026-07-01", "fortnightly").count, 27);
  assert.equal(payYearSummary("2026-07-15", "fortnightly").count, 27); // same cycle
  for (let i = 1; i < 14; i++) {
    const d = new Date(Date.UTC(2026, 6, 1 + i)).toISOString().slice(0, 10);
    assert.equal(payYearSummary(d, "fortnightly").count, 26, d);
  }
});

test("an anchor far outside the year still lands on the right cycle", () => {
  // 1 July 2026 + 14 × 60 days, and 14 × 40 days before it
  const after = payDatesBetween("2028-10-18", "fortnightly", FY_2026_27.start, FY_2026_27.end);
  assert.equal(after[0], "2026-07-01");
  assert.equal(after.length, 27);
  const before = payDatesBetween("2024-12-18", "fortnightly", FY_2026_27.start, FY_2026_27.end);
  assert.equal(before[0], "2026-07-01");
});

test("monthly pays are always 12 and clamp to short months", () => {
  assert.equal(payYearSummary("2026-07-31", "monthly").count, 12);
  assert.equal(addMonthsClamped("2027-01-31", 1), "2027-02-28");
  assert.equal(addMonthsClamped("2028-01-31", 1), "2028-02-29");
  const dates = payDatesBetween("2026-01-31", "monthly", FY_2026_27.start, FY_2026_27.end);
  assert.ok(dates.includes("2027-02-28"));
  assert.equal(dates.length, 12);
});

test("366-day financial years have two trigger days", () => {
  const fy = financialYear(2027); // contains 29 Feb 2028
  assert.equal(fy.days, 366);
  const t = extraPayTriggers(fy);
  assert.deepEqual(t.fortnightlyFirstPayDates, ["2027-07-01", "2027-07-02"]);
  assert.deepEqual(t.weeklyWeekdays, ["Thursday", "Friday"]);
  assert.equal(payYearSummary("2027-07-02", "fortnightly", fy).count, 27);
  assert.deepEqual(extraPayTriggers(FY_2026_27).weeklyWeekdays, ["Wednesday"]);
});

test("financialYearOf, calendar weeks and ISO validation", () => {
  assert.equal(financialYearOf("2027-03-01").label, "2026-27");
  assert.equal(financialYearOf("2026-07-01").label, "2026-27");
  assert.equal(financialYearOf("2026-06-30").label, "2025-26");
  assert.deepEqual(weeksInCalendarYear(2026), { weeks: 52, spareDays: 1, days: 365 });
  assert.deepEqual(weeksInCalendarYear(2028), { weeks: 52, spareDays: 2, days: 366 });
  assert.equal(isValidIso("2026-02-30"), false);
  assert.equal(isValidIso("2026-02-28"), true);
});

test("ATO extra-pay withholding bands (fortnightly and weekly)", () => {
  assert.equal(extraPayWithholding("fortnightly", 1_699), 0);
  assert.equal(extraPayWithholding("fortnightly", 1_700), 12);
  assert.equal(extraPayWithholding("fortnightly", 5_199.99), 12);
  assert.equal(extraPayWithholding("fortnightly", 5_200), 27);
  assert.equal(extraPayWithholding("fortnightly", 7_250), 48);
  assert.equal(extraPayWithholding("weekly", 874), 0);
  assert.equal(extraPayWithholding("weekly", 875), 3);
  assert.equal(extraPayWithholding("weekly", 3_650), 12);
});

// ---------------------------------------------------------------------------
// FIFO pay
// ---------------------------------------------------------------------------

test("2:1 roster, 12-hour shifts: 168 hours a swing, 114 ordinary, 54 overtime", () => {
  const r = calculateFifoPay({ ...FIFO_DEFAULTS, hourlyRate: 50 });
  assert.equal(r.cycleDays, 21);
  assert.equal(r.hoursPerCycle, 168);
  assert.equal(r.ordinaryHoursPerCycle, 114);
  assert.equal(r.overtimeHoursPerCycle, 54);
  assert.equal(r.perCycle.ordinary, 5_700);
  assert.equal(r.perCycle.overtime, 4_050);
  assert.equal(r.perCycle.gross, 9_750);
  // 364 / 21 cycles a year
  assert.equal(r.annual.gross, Math.round(9_750 * (364 / 21)));
  assert.equal(r.daysOnSitePerYear, Math.round(14 * (364 / 21)));
});

test("FIFO take-home comes from the site-wide tax engine", () => {
  const r = calculateFifoPay({ ...FIFO_DEFAULTS, hourlyRate: 50 });
  const engine = calculatePayBreakdown({ grossSalary: r.annual.gross, hasPrivateHealth: true });
  assert.equal(r.tax.takeHomePay, engine.takeHomePay);
  assert.ok(Math.abs(r.takeHomePerFortnight - engine.takeHomePay / 26) < 0.01);
});

test("super is on ordinary time earnings (not overtime) and capped", () => {
  const r = calculateFifoPay({ ...FIFO_DEFAULTS, hourlyRate: 50, shiftLoadingPct: 10, siteAllowancePerDay: 20 });
  const ote = r.annual.ordinary + r.annual.loading + r.annual.allowances;
  assert.equal(r.employerSuper, Math.round(ote * SUPER_GUARANTEE.rate));
  const high = calculateFifoPay({ ...FIFO_DEFAULTS, hourlyRate: 400 });
  assert.equal(high.superCapped, true);
  assert.equal(high.employerSuper, Math.round(SUPER_GUARANTEE.maxSGAnnual));
});

test("short shifts create no overtime; LAFHA stays out of taxable income", () => {
  const r = calculateFifoPay({ ...FIFO_DEFAULTS, daysOn: 7, daysOff: 7, shiftHours: 7, lafhaPerWeek: 300 });
  assert.equal(r.overtimeHoursPerCycle, 0);
  assert.equal(r.lafhaAnnual, 15_600);
  assert.equal(r.tax.grossSalary, r.annual.gross);
});

test("roster presets are unique and sensible", () => {
  const ids = new Set(ROSTER_PRESETS.map((p) => p.id));
  assert.equal(ids.size, ROSTER_PRESETS.length);
  for (const p of ROSTER_PRESETS) assert.ok(p.daysOn > 0 && p.daysOff > 0);
});

// ---------------------------------------------------------------------------
// Centrelink payment dates
// ---------------------------------------------------------------------------

test("2025-26 Christmas tables transcribed: 12 rows each, dates move earlier, never later", () => {
  const s = CHRISTMAS_2025_26;
  for (const rows of [s.allowances.report, s.pensions.report]) {
    assert.equal(rows.length, 12);
    for (const row of rows) {
      assert.ok(row.newReporting <= row.normalReporting);
      assert.ok(row.revisedPayment < row.nextPayment);
    }
  }
  for (const rows of [s.allowances.noReport, s.pensions.noReport]) {
    assert.equal(rows.length, 12);
    for (const row of rows) {
      assert.ok(row.revisedPayment <= row.normalPayment);
      assert.ok(daysEarly(row) >= 0);
      // the next payment is the normal fortnightly date
      const next = new Date(`${row.normalPayment}T00:00:00Z`);
      next.setUTCDate(next.getUTCDate() + 14);
      assert.equal(next.toISOString().slice(0, 10), row.nextPayment);
    }
  }
  // Spot checks against the published table
  assert.deepEqual(s.pensions.noReport[3], { normalPayment: "2025-12-25", revisedPayment: "2025-12-24", nextPayment: "2026-01-08" });
  assert.deepEqual(s.allowances.report[5], {
    normalReporting: "2025-12-25",
    newReporting: "2025-12-23",
    revisedPayment: "2025-12-24",
    nextPayment: "2026-01-09",
  });
});

test("Christmas 2026 schedule flagged as unpublished until refreshed", () => {
  assert.equal(CHRISTMAS_2026_27_PUBLISHED, false);
});

test("projected fortnightly dates step by 14 days and flag holidays", () => {
  const out = projectFortnightlyDates("2026-12-11", "2026-12-01", 4);
  assert.deepEqual(out.map((d) => d.iso), ["2026-12-11", "2026-12-25", "2027-01-08", "2027-01-22"]);
  assert.equal(out[1].flag, "holiday");
  assert.equal(out[1].holidayName, "Christmas Day");
  assert.equal(out[2].flag, "christmas-window");
  assert.equal(out[3].flag, null);
  assert.ok(HOLIDAYS_2026_27.every((h) => /^\d{4}-\d{2}-\d{2}$/.test(h.iso)));
});
