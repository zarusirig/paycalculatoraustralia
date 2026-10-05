// Holiday-by-holiday views of the public holiday data (Oct 2026): Christmas
// Day, Boxing Day, New Year, Easter, Australia Day, Melbourne Cup Day and the
// 2027 matrix. Nothing here re-types a date — every row is picked out of the
// eight state files (each already tested against the government's own text)
// by name and date window. Relative imports only: compiled by the plain `tsc`
// test run.

import { STATE_PUBLIC_HOLIDAYS } from "./index";
import { WEEKDAYS, shortDate, weekdayOf } from "./dates";
import { publicHolidayPay, type PhEmployment, type PhPayResult } from "./calc";
import { getAwardPublicHolidayRate } from "./award-rates";
import { AWARD_DIRECTORY } from "../../constants/award-directory";
import type { HolidayKind, PublicHolidayDate, StatePublicHolidays } from "./types";

export type SeasonalTopic = "christmas" | "boxing" | "new-year" | "easter" | "australia-day" | "melbourne-cup";

interface TopicDef {
  match: RegExp;
  /** Inclusive ISO date windows the holiday can fall in. */
  windows: readonly (readonly [string, string])[];
  /** Restrict to these state slugs (Melbourne Cup is Victorian only). */
  only?: readonly string[];
}

export const TOPICS: Record<SeasonalTopic, TopicDef> = {
  christmas: {
    match: /christmas/i,
    windows: [
      ["2026-12-24", "2026-12-25"],
      ["2027-12-24", "2027-12-27"],
    ],
  },
  boxing: {
    match: /boxing|proclamation/i,
    windows: [
      ["2026-12-26", "2026-12-28"],
      ["2027-12-26", "2027-12-28"],
    ],
  },
  "new-year": {
    match: /new year/i,
    windows: [
      ["2026-12-31", "2026-12-31"],
      ["2027-01-01", "2027-01-01"],
      ["2027-12-31", "2027-12-31"],
    ],
  },
  easter: {
    match: /easter|good friday|saturday before easter|day after good friday/i,
    windows: [["2027-03-26", "2027-03-30"]],
  },
  "australia-day": { match: /australia day/i, windows: [["2027-01-26", "2027-01-26"]] },
  "melbourne-cup": {
    match: /melbourne cup/i,
    windows: [
      ["2026-11-03", "2026-11-03"],
      ["2027-11-02", "2027-11-02"],
    ],
    only: ["vic"],
  },
};

export interface TopicStateRow {
  state: StatePublicHolidays;
  holidays: readonly PublicHolidayDate[];
}

function inWindows(iso: string, windows: TopicDef["windows"]): boolean {
  return windows.some(([a, b]) => iso >= a && iso <= b);
}

/** Every state's holidays for a topic, in date order. States with none are omitted. */
export function topicRows(topic: SeasonalTopic): TopicStateRow[] {
  const def = TOPICS[topic];
  const out: TopicStateRow[] = [];
  for (const state of STATE_PUBLIC_HOLIDAYS) {
    if (def.only && !def.only.includes(state.slug)) continue;
    const holidays = state.years
      .flatMap((y) => y.holidays)
      .filter((h) => h.kind !== "limited" && h.kind !== "regional" && def.match.test(h.name) && inWindows(h.date, def.windows))
      .sort((a, b) => a.date.localeCompare(b.date));
    if (holidays.length) out.push({ state, holidays });
  }
  return out;
}

/** "Fri 25 Dec" — weekday abbreviation plus compact date. */
export function weekdayShortDate(iso: string): string {
  return `${weekdayOf(iso).slice(0, 3)} ${shortDate(iso)}`;
}

// ---------------------------------------------------------------------------
// 2027 matrix: the holidays most workers are paid for, one row each, plus the
// state-only remainder, so nothing in a state's 2027 list is dropped.
// ---------------------------------------------------------------------------

export const MATRIX_2027_ROWS: readonly { label: string; match: RegExp }[] = [
  { label: "New Year's Day", match: /new year's day/i },
  { label: "Australia Day", match: /australia day/i },
  { label: "Good Friday", match: /^good friday$/i },
  { label: "Easter Saturday", match: /easter saturday|saturday before easter|day after good friday/i },
  { label: "Easter Sunday", match: /^easter sunday$/i },
  { label: "Easter Monday", match: /easter monday/i },
  { label: "Anzac Day", match: /anzac/i },
  { label: "Christmas Day", match: /christmas day/i },
  { label: "Boxing Day / Proclamation Day", match: /boxing|proclamation/i },
];

/** A state's whole-day 2027 holidays (statewide + additional), date order. */
export function wholeDays2027(state: StatePublicHolidays): PublicHolidayDate[] {
  const y = state.years.find((x) => x.year === 2027);
  return (y?.holidays ?? []).filter((h) => h.kind === "statewide" || h.kind === "additional").sort((a, b) => a.date.localeCompare(b.date));
}

export function matrix2027(): { label: string; cells: Record<string, PublicHolidayDate[]> }[] {
  return MATRIX_2027_ROWS.map((row) => ({
    label: row.label,
    cells: Object.fromEntries(STATE_PUBLIC_HOLIDAYS.map((s) => [s.slug, wholeDays2027(s).filter((h) => row.match.test(h.name))])),
  }));
}

/** Whole-day 2027 holidays that are not in a matrix row — Labour Day, King's Birthday, state days. */
export function otherHolidays2027(state: StatePublicHolidays): PublicHolidayDate[] {
  return wholeDays2027(state).filter((h) => !MATRIX_2027_ROWS.some((r) => r.match.test(h.name)));
}

export function partDays2027(state: StatePublicHolidays): PublicHolidayDate[] {
  const y = state.years.find((x) => x.year === 2027);
  return (y?.holidays ?? []).filter((h) => h.kind === "part-day").sort((a, b) => a.date.localeCompare(b.date));
}

// ---------------------------------------------------------------------------
// Calendar facts the tests check the data against (independent of the states)
// ---------------------------------------------------------------------------

/** Gregorian Easter Sunday (anonymous Gregorian algorithm), ISO date. */
export function easterSunday(year: number): string {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/** ISO date `days` after (or before, if negative) `iso`, in UTC. */
export function addDays(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}

/** The first Tuesday of November — the Melbourne Cup rule. */
export function melbourneCupDay(year: number): string {
  for (let d = 1; d <= 7; d++) {
    const iso = `${year}-11-${String(d).padStart(2, "0")}`;
    if (weekdayOf(iso) === "Tuesday") return iso;
  }
  throw new Error("unreachable");
}

export function isWeekend(iso: string): boolean {
  const w = weekdayOf(iso);
  return w === "Saturday" || w === "Sunday";
}

// ---------------------------------------------------------------------------
// Worked examples
// ---------------------------------------------------------------------------

/** The award's entry-level adult hourly rate from 1 July 2026 (the calculator's prefill). */
export function entryHourlyFor(awardKey: string): number {
  const award = getAwardPublicHolidayRate(awardKey);
  if (!award) throw new Error(`unknown award ${awardKey}`);
  const entry = AWARD_DIRECTORY.find((a) => a.href === award.href);
  if (!entry) throw new Error(`no directory entry for ${awardKey}`);
  return entry.headlineHourly;
}

export interface ExampleRow {
  awardKey: string;
  awardName: string;
  employment: PhEmployment;
  baseHourly: number;
  hours: number;
  result: PhPayResult;
}

/** One row per (award, employment type) at the award's entry rate. */
export function exampleRows(awardKeys: readonly string[], hours: number): ExampleRow[] {
  const rows: ExampleRow[] = [];
  for (const awardKey of awardKeys) {
    const award = getAwardPublicHolidayRate(awardKey);
    if (!award) throw new Error(`unknown award ${awardKey}`);
    const baseHourly = entryHourlyFor(awardKey);
    for (const employment of ["permanent", "casual"] as const) {
      rows.push({
        awardKey,
        awardName: award.shortName,
        employment,
        baseHourly,
        hours,
        result: publicHolidayPay({ baseHourly, hours, employment, permanentMultiple: award.permanent, casualMultiple: award.casual }),
      });
    }
  }
  return rows;
}

// ---------------------------------------------------------------------------
// Shutdown (closedown) annual leave
// ---------------------------------------------------------------------------

export interface ShutdownLeave {
  /** Calendar days in the shutdown, start and end inclusive. */
  calendarDays: number;
  /** Ordinary working days in the window (Mon–Fri by default). */
  workingDays: number;
  /** Public holidays that fall on one of those working days. */
  publicHolidayDays: number;
  /** Working days charged to annual leave: working days minus public holidays. */
  leaveDays: number;
  leaveHours: number;
}

/**
 * Annual leave charged by a shutdown for someone who works Monday to Friday.
 * A public holiday on a normal working day is paid as a public holiday and not
 * deducted from the leave balance (Fair Work Ombudsman, end-of-year rules).
 */
export function shutdownLeave(opts: {
  start: string;
  end: string;
  publicHolidays: readonly string[];
  hoursPerDay: number;
  workDays?: readonly (typeof WEEKDAYS)[number][];
}): ShutdownLeave {
  const workDays = opts.workDays ?? ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  let calendarDays = 0;
  let workingDays = 0;
  let publicHolidayDays = 0;
  for (let d = opts.start; d <= opts.end; d = addDays(d, 1)) {
    calendarDays++;
    if (!workDays.includes(weekdayOf(d))) continue;
    workingDays++;
    if (opts.publicHolidays.includes(d)) publicHolidayDays++;
  }
  const leaveDays = workingDays - publicHolidayDays;
  return { calendarDays, workingDays, publicHolidayDays, leaveDays, leaveHours: Math.round(leaveDays * opts.hoursPerDay * 100) / 100 };
}

/** Annual leave pay for the shutdown hours at a base hourly rate, with an optional award leave loading. */
export function shutdownLeavePay(leaveHours: number, baseHourly: number, loading = 0): { base: number; loading: number; total: number } {
  const cents = (n: number) => Math.round(n * 100) / 100;
  const base = cents(leaveHours * baseHourly);
  const load = cents(base * loading);
  return { base, loading: load, total: cents(base + load) };
}

/** Table cell label: weekday and date, with the part-day window or extra-day tag. */
export function rowLabel(h: PublicHolidayDate): string {
  const kindTag: Partial<Record<HolidayKind, string>> = { additional: "extra day", "part-day": h.hours ?? "part day" };
  const tag = kindTag[h.kind];
  return tag ? `${weekdayShortDate(h.date)} (${tag})` : weekdayShortDate(h.date);
}
