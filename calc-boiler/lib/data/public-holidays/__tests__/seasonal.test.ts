import assert from "node:assert/strict";
import { test } from "node:test";

import { STATE_PUBLIC_HOLIDAYS, getAwardPublicHolidayRate, getStatePublicHolidays, statewideDays, yearOf } from "../index";
import { weekdayOf } from "../dates";
import {
  addDays,
  easterSunday,
  entryHourlyFor,
  exampleRows,
  isWeekend,
  matrix2027,
  melbourneCupDay,
  otherHolidays2027,
  partDays2027,
  wholeDays2027,
  shutdownLeave,
  shutdownLeavePay,
  topicRows,
  type SeasonalTopic,
} from "../seasonal";

const STATES = ["nsw", "vic", "qld", "wa", "sa", "tas", "act", "nt"] as const;

function datesFor(topic: SeasonalTopic): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const r of topicRows(topic)) out[r.state.slug] = r.holidays.map((h) => h.date);
  return out;
}

// ---------------------------------------------------------------------------
// Weekday arithmetic, independent of the data files
// ---------------------------------------------------------------------------

test("2026-27 festive dates fall on the weekdays the Fair Work pages print", () => {
  assert.equal(weekdayOf("2026-11-03"), "Tuesday"); // Melbourne Cup Day
  assert.equal(weekdayOf("2026-12-24"), "Thursday"); // Christmas Eve
  assert.equal(weekdayOf("2026-12-25"), "Friday");
  assert.equal(weekdayOf("2026-12-26"), "Saturday");
  assert.equal(weekdayOf("2026-12-28"), "Monday"); // additional Boxing Day
  assert.equal(weekdayOf("2026-12-31"), "Thursday");
  assert.equal(weekdayOf("2027-01-01"), "Friday");
  assert.equal(weekdayOf("2027-01-26"), "Tuesday");
  assert.equal(weekdayOf("2027-03-26"), "Friday"); // Good Friday
  assert.equal(weekdayOf("2027-03-27"), "Saturday");
  assert.equal(weekdayOf("2027-03-28"), "Sunday");
  assert.equal(weekdayOf("2027-03-29"), "Monday");
  assert.equal(weekdayOf("2027-11-02"), "Tuesday");
  assert.equal(weekdayOf("2027-12-24"), "Friday");
  assert.equal(weekdayOf("2027-12-25"), "Saturday");
  assert.equal(weekdayOf("2027-12-26"), "Sunday");
  assert.equal(weekdayOf("2027-12-27"), "Monday");
  assert.equal(weekdayOf("2027-12-28"), "Tuesday");
});

test("Easter 2027: Good Friday, Saturday, Sunday and Monday follow the computus", () => {
  assert.equal(easterSunday(2026), "2026-04-05");
  assert.equal(easterSunday(2027), "2027-03-28");
  assert.equal(addDays(easterSunday(2027), -2), "2027-03-26");
  assert.equal(addDays(easterSunday(2027), -1), "2027-03-27");
  assert.equal(addDays(easterSunday(2027), 1), "2027-03-29");
});

test("Melbourne Cup Day is the first Tuesday of November", () => {
  assert.equal(melbourneCupDay(2026), "2026-11-03");
  assert.equal(melbourneCupDay(2027), "2027-11-02");
});

test("Australia Day 2027 is a weekday, so no additional day is needed", () => {
  assert.equal(isWeekend("2027-01-26"), false);
  assert.equal(addDays("2027-01-26", 0), "2027-01-26");
});

test("a Christmas or Boxing Day on a weekend is always matched by an additional weekday", () => {
  // 2026: Boxing Day Saturday -> Monday 28. 2027: Christmas Saturday -> Monday 27, Boxing Day Sunday -> Tuesday 28.
  for (const s of STATES) {
    const state = getStatePublicHolidays(s)!;
    const days26 = statewideDays(yearOf(state, 2026)!).map((h) => h.date);
    const days27 = statewideDays(yearOf(state, 2027)!).map((h) => h.date);
    assert.ok(days26.includes("2026-12-28"), `${s} 2026-12-28`);
    assert.ok(days27.includes("2027-12-27") && days27.includes("2027-12-28"), `${s} 2027-12-27/28`);
  }
});

// ---------------------------------------------------------------------------
// The holiday-by-holiday views agree with the Fair Work 2026 and 2027 pages
// (read 5 Oct 2026). Tasmania's Saturday 25 December 2027 is the one date the
// Fair Work list shows that the WorkSafe Tasmania table does not (noted on the
// page), so it is expected as absent here.
// ---------------------------------------------------------------------------

test("Christmas rows match the Fair Work lists, state by state", () => {
  assert.deepEqual(datesFor("christmas"), {
    nsw: ["2026-12-25", "2027-12-25", "2027-12-27"],
    vic: ["2026-12-25", "2027-12-25", "2027-12-27"],
    qld: ["2026-12-24", "2026-12-25", "2027-12-24", "2027-12-25", "2027-12-27"],
    wa: ["2026-12-25", "2027-12-25", "2027-12-27"],
    sa: ["2026-12-24", "2026-12-25", "2027-12-24", "2027-12-25", "2027-12-27"],
    tas: ["2026-12-25", "2027-12-27"],
    act: ["2026-12-25", "2027-12-25", "2027-12-27"],
    nt: ["2026-12-24", "2026-12-25", "2027-12-24", "2027-12-25", "2027-12-27"],
  });
});

test("Boxing Day rows match the Fair Work lists, state by state", () => {
  const both = ["2026-12-26", "2026-12-28", "2027-12-26", "2027-12-28"];
  assert.deepEqual(datesFor("boxing"), {
    nsw: both,
    vic: both,
    qld: both,
    wa: both,
    sa: both,
    tas: ["2026-12-28", "2027-12-28"], // Tasmania does not observe Saturday 26 December 2026 or Sunday 26 December 2027
    act: both,
    nt: both,
  });
});

test("New Year rows: 1 January 2027 everywhere, 7pm-midnight New Year's Eve in SA and the NT only", () => {
  const d = datesFor("new-year");
  for (const s of STATES) assert.ok(d[s].includes("2027-01-01"), `${s} New Year's Day`);
  assert.deepEqual(d.sa, ["2026-12-31", "2027-01-01", "2027-12-31"]);
  assert.deepEqual(d.nt, ["2026-12-31", "2027-01-01", "2027-12-31"]);
  for (const s of ["nsw", "vic", "qld", "wa", "tas", "act"] as const) assert.deepEqual(d[s], ["2027-01-01"]);
  const nye = topicRows("new-year").flatMap((r) => r.holidays.filter((h) => h.kind === "part-day"));
  assert.ok(nye.length === 4 && nye.every((h) => h.hours === "7pm to midnight"));
});

test("Easter 2027 rows match the Fair Work lists", () => {
  const four = ["2027-03-26", "2027-03-27", "2027-03-28", "2027-03-29"];
  assert.deepEqual(datesFor("easter"), {
    nsw: four,
    vic: four,
    qld: four,
    wa: ["2027-03-26", "2027-03-28", "2027-03-29"], // no Easter Saturday in WA
    sa: four,
    tas: ["2027-03-26", "2027-03-29"], // Easter Tuesday is "limited" and excluded
    act: four,
    nt: four,
  });
});

test("Australia Day 2027 is Tuesday 26 January in every state", () => {
  const d = datesFor("australia-day");
  for (const s of STATES) assert.deepEqual(d[s], ["2027-01-26"]);
});

test("Melbourne Cup Day rows are Victorian only and match the first-Tuesday rule", () => {
  const d = datesFor("melbourne-cup");
  assert.deepEqual(Object.keys(d), ["vic"]);
  assert.deepEqual(d.vic, [melbourneCupDay(2026), melbourneCupDay(2027)]);
});

test("Christmas Eve and New Year's Eve part-day windows: QLD 6pm, SA and NT 7pm", () => {
  const hours = (topic: SeasonalTopic) =>
    Object.fromEntries(topicRows(topic).map((r) => [r.state.slug, Array.from(new Set(r.holidays.filter((h) => h.kind === "part-day").map((h) => h.hours)))]));
  const xmas = hours("christmas");
  assert.deepEqual(xmas.qld, ["6pm to midnight"]);
  assert.deepEqual(xmas.sa, ["7pm to midnight"]);
  assert.deepEqual(xmas.nt, ["7pm to midnight"]);
  assert.deepEqual(xmas.nsw, []);
});

// ---------------------------------------------------------------------------
// Worked examples use the repo's award multiples and calc, nothing else
// ---------------------------------------------------------------------------

test("example rows apply the award's own public holiday multiples", () => {
  const rows = exampleRows(["retail", "hospitality"], 8);
  assert.equal(rows.length, 4);
  for (const r of rows) {
    const award = getAwardPublicHolidayRate(r.awardKey)!;
    const m = r.employment === "casual" ? award.casual : award.permanent;
    assert.equal(r.result.multiple, m);
    assert.equal(r.baseHourly, entryHourlyFor(r.awardKey));
    const hourly = Math.round(r.baseHourly * m * 100) / 100; // calc.ts rounds the hourly rate to cents first
    assert.equal(r.result.holidayHourly, hourly);
    assert.equal(r.result.holidayPay, Math.round(hourly * 8 * 100) / 100);
  }
  const retailPerm = rows.find((r) => r.awardKey === "retail" && r.employment === "permanent")!;
  assert.equal(retailPerm.result.multiple, 2.25);
  const hospCasual = rows.find((r) => r.awardKey === "hospitality" && r.employment === "casual")!;
  assert.equal(hospCasual.result.multiple, 2.5);
  // A permanent employee who has the day off is paid base rate x hours; a casual is paid nothing.
  assert.equal(retailPerm.result.dayOffPay, Math.round(retailPerm.baseHourly * 8 * 100) / 100);
  assert.equal(rows.find((r) => r.awardKey === "retail" && r.employment === "casual")!.result.dayOffPay, 0);
});

// ---------------------------------------------------------------------------
// Shutdown leave
// ---------------------------------------------------------------------------

test("shutdown leave: public holidays on working days are not charged to annual leave", () => {
  // Mon 28 Dec 2026 to Fri 8 Jan 2027: 12 calendar days, 10 weekdays, two of them
  // public holidays in NSW (Mon 28 Dec additional Boxing Day, Fri 1 Jan).
  const nsw = getStatePublicHolidays("nsw")!;
  const hols = [...statewideDays(yearOf(nsw, 2026)!), ...statewideDays(yearOf(nsw, 2027)!)].map((h) => h.date);
  const r = shutdownLeave({ start: "2026-12-28", end: "2027-01-08", publicHolidays: hols, hoursPerDay: 7.6 });
  assert.equal(r.calendarDays, 12);
  assert.equal(r.workingDays, 10);
  assert.equal(r.publicHolidayDays, 2);
  assert.equal(r.leaveDays, 8);
  assert.equal(r.leaveHours, 60.8);
});

test("shutdown leave: a Tasmanian-style Tuesday-only holiday and a part-timer's working days", () => {
  const r = shutdownLeave({
    start: "2027-12-27",
    end: "2028-01-07",
    publicHolidays: ["2027-12-27", "2027-12-28"],
    hoursPerDay: 7.6,
    workDays: ["Tuesday", "Wednesday", "Thursday"],
  });
  assert.equal(r.workingDays, 6); // Tue 28, Wed 29, Thu 30 Dec; Tue 4, Wed 5, Thu 6 Jan
  assert.equal(r.publicHolidayDays, 1); // Tue 28 Dec only (Mon 27 is not a working day for this person)
  assert.equal(r.leaveDays, 5);
});

test("2027 matrix: every whole-day holiday lands in exactly one row or the state-only list", () => {
  const matrix = matrix2027();
  for (const state of STATE_PUBLIC_HOLIDAYS) {
    const inRows = matrix.flatMap((r) => r.cells[state.slug]);
    const others = otherHolidays2027(state);
    const all = wholeDays2027(state);
    assert.equal(inRows.length + others.length, all.length, `${state.slug}: ${inRows.length} + ${others.length} != ${all.length}`);
    const dates = [...inRows, ...others].map((h) => h.date + h.name).sort();
    assert.deepEqual(dates, all.map((h) => h.date + h.name).sort());
  }
});

test("2027 matrix spot checks against the Fair Work 2027 list", () => {
  const m = Object.fromEntries(matrix2027().map((r) => [r.label, r.cells]));
  const d = (label: string, slug: string) => m[label][slug].map((h) => h.date);
  assert.deepEqual(d("Good Friday", "vic"), ["2027-03-26"]);
  assert.deepEqual(d("Easter Monday", "tas"), ["2027-03-29"]);
  assert.deepEqual(d("Easter Saturday", "wa"), []);
  assert.deepEqual(d("Anzac Day", "nsw"), ["2027-04-25", "2027-04-26"]);
  assert.deepEqual(d("Anzac Day", "vic"), ["2027-04-25"]);
  assert.deepEqual(d("Anzac Day", "wa"), ["2027-04-25", "2027-04-26"]);
  assert.deepEqual(d("Christmas Day", "nsw"), ["2027-12-25", "2027-12-27"]);
  assert.deepEqual(d("Boxing Day / Proclamation Day", "sa"), ["2027-12-26", "2027-12-28"]);
  assert.deepEqual(d("Australia Day", "nt"), ["2027-01-26"]);
  assert.deepEqual(partDays2027(getStatePublicHolidays("sa")!).map((h) => h.date), ["2027-12-24", "2027-12-31"]);
  assert.deepEqual(partDays2027(getStatePublicHolidays("qld")!).map((h) => h.date), ["2027-12-24"]);
  assert.deepEqual(partDays2027(getStatePublicHolidays("nsw")!), []);
});

test("shutdown leave pay: base rate times hours, plus the loading on top", () => {
  const r = shutdownLeavePay(60.8, 25, 0.175);
  assert.equal(r.base, 1520);
  assert.equal(r.loading, 266);
  assert.equal(r.total, 1786);
  assert.deepEqual(shutdownLeavePay(0, 30), { base: 0, loading: 0, total: 0 });
});
