// =============================================================================
// Work hours / timesheet arithmetic.
//
// Pure functions only — no React, no DOM — so `npm test` can exercise the time
// maths directly. The UI in modules/calculator/work-hours-calculator.tsx is a
// thin shell over everything in this file.
//
// Two rules drive the design, because they are where timesheet tools break:
//
//   1. A shift whose end time is EARLIER than its start time crosses midnight.
//      22:00 → 06:00 is eight hours, not minus sixteen. An end time EQUAL to
//      the start time is a zero-length shift, not a 24-hour one — nobody types
//      09:00 to 09:00 meaning a full day, and treating it as 24 hours silently
//      inflates a week by three days.
//
//   2. An unpaid break can never exceed the shift it sits inside. A 30-minute
//      shift with a 60-minute break is zero paid minutes, never negative.
//
// Ordinary hours and casual loading are derived from EMPLOYMENT so the tool
// cannot drift from the rest of the site.
//
// ⚠️ OVERTIME THRESHOLDS ARE NOT UNIVERSAL. The NES sets 38 ordinary hours a
// week, but when overtime starts, and at what multiplier, is set by the
// applicable modern award or enterprise agreement — the Retail Award bands
// overtime Monday to Saturday, the Hospitality Award pays the first two hours
// at time and a half then double time, and many awards also have daily and
// rostered-day thresholds. The values below are DEFAULTS the user overrides,
// not statements of law. See /overtime-penalty-rates-guide/.
// =============================================================================

import { EMPLOYMENT } from "./australian-tax";

export const MINUTES_PER_HOUR = 60;
export const MINUTES_PER_DAY = 24 * MINUTES_PER_HOUR;

/** Casual loading, from the single site-wide constant. */
export const CASUAL_LOADING = EMPLOYMENT.casualLoading;

/** Ordinary hours in a standard full-time week (NES). */
export const STANDARD_WEEKLY_HOURS = EMPLOYMENT.standardWeeklyHours;

/**
 * Starting points for the overtime inputs. Every one of these is editable in
 * the calculator because the real numbers come from the employee's award.
 */
export const OVERTIME_DEFAULTS = {
  /** Ordinary hours before overtime starts, for a one-week period. */
  thresholdHours: STANDARD_WEEKLY_HOURS,
  /** Width of the first overtime band, in hours. */
  firstTierHours: 2,
  /** Time and a half. */
  firstTierMultiplier: 1.5,
  /** Double time, applied after the first band is exhausted. */
  secondTierMultiplier: 2,
} as const;

function round(value: number, dp: number): number {
  const factor = 10 ** dp;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

function round2(value: number): number {
  return round(value, 2);
}

/** Round to cents. */
export function roundCurrency(value: number): number {
  return round(value, 2);
}

// ---------------------------------------------------------------------------
// Clock times
// ---------------------------------------------------------------------------

/**
 * Parse a 24-hour "HH:MM" clock time into minutes past midnight.
 * Accepts an optional ":SS" tail because some browsers hand back seconds from
 * `<input type="time">`. Returns null for anything unusable.
 */
export function parseTimeToMinutes(value: string): number | null {
  if (typeof value !== "string") return null;
  const match = /^(\d{1,2}):([0-5]\d)(?::[0-5]\d)?$/.exec(value.trim());
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23) return null;
  return hours * MINUTES_PER_HOUR + minutes;
}

/** Format minutes past midnight back to a 24-hour "HH:MM" clock time. */
export function formatMinutesAsTime(minutes: number): string {
  const wrapped = ((Math.round(minutes) % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  const hours = Math.floor(wrapped / MINUTES_PER_HOUR);
  const mins = wrapped % MINUTES_PER_HOUR;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

/**
 * Elapsed minutes between two clock times, adding a day when the end time is
 * earlier than the start. Equal times are zero, not 1,440.
 */
export function elapsedMinutes(startMinutes: number, endMinutes: number): number {
  const raw = endMinutes - startMinutes;
  return raw < 0 ? raw + MINUTES_PER_DAY : raw;
}

// ---------------------------------------------------------------------------
// Hours formatting
// ---------------------------------------------------------------------------

/** Minutes to decimal hours — the format payroll systems use. 450 → 7.5 */
export function minutesToDecimalHours(minutes: number, dp = 2): number {
  if (!Number.isFinite(minutes)) return 0;
  return round(minutes / MINUTES_PER_HOUR, dp);
}

/** Decimal hours back to whole minutes. 7.5 → 450 */
export function decimalHoursToMinutes(hours: number): number {
  if (!Number.isFinite(hours)) return 0;
  return Math.round(hours * MINUTES_PER_HOUR);
}

/** Minutes to "h:mm". 450 → "7:30". Negatives clamp to "0:00". */
export function minutesToHm(minutes: number): string {
  if (!Number.isFinite(minutes)) return "0:00";
  const total = Math.max(0, Math.round(minutes));
  const hours = Math.floor(total / MINUTES_PER_HOUR);
  const mins = total % MINUTES_PER_HOUR;
  return `${hours}:${String(mins).padStart(2, "0")}`;
}

/** Decimal hours to "h:mm". 7.75 → "7:45" */
export function decimalHoursToHm(hours: number): string {
  return minutesToHm(decimalHoursToMinutes(hours));
}

/** Decimal hours as a trimmed string. 7.5 → "7.5", 8 → "8", 7.25 → "7.25" */
export function formatDecimalHours(hours: number, dp = 2): string {
  if (!Number.isFinite(hours)) return "0";
  return String(round(hours, dp));
}

// ---------------------------------------------------------------------------
// A single shift
// ---------------------------------------------------------------------------

export interface ShiftInput {
  /** 24-hour "HH:MM". */
  start: string;
  /** 24-hour "HH:MM". Earlier than `start` means the shift crosses midnight. */
  end: string;
  /** Unpaid break in minutes. Clamped to the length of the shift. */
  breakMinutes?: number;
}

export interface ShiftResult {
  /** False when either clock time is missing or malformed. */
  valid: boolean;
  /** True when the end time falls on the following day. */
  overnight: boolean;
  /** Span from start to end, before the break is taken out. */
  elapsedMinutes: number;
  /** Break actually deducted, after clamping to the shift length. */
  breakMinutes: number;
  /** Break the user asked for, before clamping. */
  requestedBreakMinutes: number;
  /** True when the requested break was longer than the shift itself. */
  breakExceedsShift: boolean;
  /** Paid minutes: elapsed less the deducted break. Never negative. */
  paidMinutes: number;
  /** Paid minutes as decimal hours. */
  paidHours: number;
}

const EMPTY_SHIFT: ShiftResult = {
  valid: false,
  overnight: false,
  elapsedMinutes: 0,
  breakMinutes: 0,
  requestedBreakMinutes: 0,
  breakExceedsShift: false,
  paidMinutes: 0,
  paidHours: 0,
};

export function calculateShift(shift: ShiftInput): ShiftResult {
  const start = parseTimeToMinutes(shift.start);
  const end = parseTimeToMinutes(shift.end);
  const requested =
    Number.isFinite(shift.breakMinutes) && (shift.breakMinutes as number) > 0
      ? Math.round(shift.breakMinutes as number)
      : 0;

  if (start === null || end === null) {
    return { ...EMPTY_SHIFT, requestedBreakMinutes: requested };
  }

  const elapsed = elapsedMinutes(start, end);
  const deducted = Math.min(requested, elapsed);
  const paid = elapsed - deducted;

  return {
    valid: true,
    overnight: end < start,
    elapsedMinutes: elapsed,
    breakMinutes: deducted,
    requestedBreakMinutes: requested,
    breakExceedsShift: requested > elapsed,
    paidMinutes: paid,
    paidHours: minutesToDecimalHours(paid),
  };
}

// ---------------------------------------------------------------------------
// A whole timesheet
// ---------------------------------------------------------------------------

export interface TimesheetTotals {
  /** Paid minutes across every valid row. */
  paidMinutes: number;
  /** Paid minutes as decimal hours. */
  totalHours: number;
  /** Unpaid break minutes actually deducted. */
  breakMinutes: number;
  /** Span across every valid row before breaks. */
  elapsedMinutes: number;
  /** Rows with a valid start and end. */
  rowsEntered: number;
  /** Rows with more than zero paid minutes. */
  daysWorked: number;
  /** Per-row results, in the order supplied. */
  rows: ShiftResult[];
}

export function calculateTimesheet(rows: readonly ShiftInput[]): TimesheetTotals {
  const results = rows.map(calculateShift);
  let paidMinutes = 0;
  let breakMinutes = 0;
  let elapsed = 0;
  let rowsEntered = 0;
  let daysWorked = 0;

  for (const row of results) {
    if (!row.valid) continue;
    rowsEntered += 1;
    paidMinutes += row.paidMinutes;
    breakMinutes += row.breakMinutes;
    elapsed += row.elapsedMinutes;
    if (row.paidMinutes > 0) daysWorked += 1;
  }

  return {
    paidMinutes,
    totalHours: minutesToDecimalHours(paidMinutes),
    breakMinutes,
    elapsedMinutes: elapsed,
    rowsEntered,
    daysWorked,
    rows: results,
  };
}

// ---------------------------------------------------------------------------
// Overtime
// ---------------------------------------------------------------------------

export interface OvertimeConfig {
  /** Set false to treat every hour as ordinary. Defaults to true. */
  enabled?: boolean;
  /** Ordinary hours before overtime starts. Defaults to 38. */
  thresholdHours?: number;
  /** Width of the first overtime band in hours. Defaults to 2. */
  firstTierHours?: number;
  /** Multiplier for the first band. Defaults to 1.5. */
  firstTierMultiplier?: number;
  /** Multiplier once the first band is used up. Defaults to 2. */
  secondTierMultiplier?: number;
}

export interface OvertimeSplit {
  ordinaryHours: number;
  firstTierHours: number;
  secondTierHours: number;
  overtimeHours: number;
}

/**
 * Split total hours into ordinary time, a first overtime band and everything
 * beyond it. Setting `firstTierHours` to a very large number puts all overtime
 * in the first band, which is how a flat time-and-a-half award behaves.
 */
export function splitOvertime(totalHours: number, config: OvertimeConfig = {}): OvertimeSplit {
  const total = Number.isFinite(totalHours) && totalHours > 0 ? totalHours : 0;
  const enabled = config.enabled ?? true;

  if (!enabled) {
    return {
      ordinaryHours: round2(total),
      firstTierHours: 0,
      secondTierHours: 0,
      overtimeHours: 0,
    };
  }

  const threshold = Math.max(0, config.thresholdHours ?? OVERTIME_DEFAULTS.thresholdHours);
  const band = Math.max(0, config.firstTierHours ?? OVERTIME_DEFAULTS.firstTierHours);

  const ordinary = Math.min(total, threshold);
  const overtime = Math.max(0, total - threshold);
  const first = Math.min(overtime, band);
  const second = overtime - first;

  return {
    ordinaryHours: round2(ordinary),
    firstTierHours: round2(first),
    secondTierHours: round2(second),
    overtimeHours: round2(overtime),
  };
}

// ---------------------------------------------------------------------------
// Pay
// ---------------------------------------------------------------------------

export interface PayInput {
  totalHours: number;
  /** Base hourly rate, before any casual loading. */
  hourlyRate: number;
  /** Apply the 25% casual loading from EMPLOYMENT. Defaults to false. */
  casual?: boolean;
  overtime?: OvertimeConfig;
}

export interface PayResult {
  /** Rate as entered. */
  baseRate: number;
  /** Rate after casual loading, if any. */
  effectiveRate: number;
  /** Dollars added by the casual loading across the whole period. */
  casualLoadingAmount: number;
  split: OvertimeSplit;
  ordinaryPay: number;
  firstTierPay: number;
  secondTierPay: number;
  overtimePay: number;
  gross: number;
}

export function calculateTimesheetPay(input: PayInput): PayResult {
  const baseRate = Number.isFinite(input.hourlyRate) && input.hourlyRate > 0 ? input.hourlyRate : 0;
  const loading = input.casual ? CASUAL_LOADING : 0;
  const effectiveRate = baseRate * (1 + loading);
  const split = splitOvertime(input.totalHours, input.overtime);

  const firstMultiplier = input.overtime?.firstTierMultiplier ?? OVERTIME_DEFAULTS.firstTierMultiplier;
  const secondMultiplier =
    input.overtime?.secondTierMultiplier ?? OVERTIME_DEFAULTS.secondTierMultiplier;

  const ordinaryPay = split.ordinaryHours * effectiveRate;
  const firstTierPay = split.firstTierHours * effectiveRate * firstMultiplier;
  const secondTierPay = split.secondTierHours * effectiveRate * secondMultiplier;
  const gross = ordinaryPay + firstTierPay + secondTierPay;

  // The loading is the difference between this gross and the same timesheet
  // priced at the unloaded rate, so it stays correct when overtime is involved.
  const grossAtBase =
    split.ordinaryHours * baseRate +
    split.firstTierHours * baseRate * firstMultiplier +
    split.secondTierHours * baseRate * secondMultiplier;

  return {
    baseRate: roundCurrency(baseRate),
    effectiveRate: roundCurrency(effectiveRate),
    casualLoadingAmount: roundCurrency(gross - grossAtBase),
    split,
    ordinaryPay: roundCurrency(ordinaryPay),
    firstTierPay: roundCurrency(firstTierPay),
    secondTierPay: roundCurrency(secondTierPay),
    overtimePay: roundCurrency(firstTierPay + secondTierPay),
    gross: roundCurrency(gross),
  };
}
