// =============================================================================
// Pay periods — pay-date generation, 53-week / 27-fortnight years, and the
// ATO's optional extra withholding for those years.
//
// Everything here is calendar arithmetic except the extra-withholding bands,
// which are ATO look-up values re-used from modules/tax-tables/ato-schedules.ts
// (read at ato.gov.au/tax-rates-and-codes/tax-table-fortnightly and
// .../tax-table-weekly, "When there are 27 [53] pays in a financial year";
// both re-read 24 September 2026, unchanged).
//
// The ATO's rule is about pay DAYS falling in the financial year (1 July to
// 30 June), not the periods the pay covers. A 365-day year is 52 weeks and
// 1 day, so the weekday of 1 July occurs 53 times; in a 366-day financial
// year (one containing 29 February) the weekdays of 1 and 2 July both do.
// =============================================================================

import { FORTNIGHTLY_EXTRA_PAY, WEEKLY_EXTRA_PAY, type ExtraPaySchedule } from "../../modules/tax-tables/ato-schedules";

export type PayCycle = "weekly" | "fortnightly" | "monthly";

export const PAY_CYCLE_STEP_DAYS: Record<Exclude<PayCycle, "monthly">, number> = { weekly: 7, fortnightly: 14 };

/** Pay days a normal financial year holds, and the most it can hold. */
export const PAY_DAYS_PER_YEAR: Record<PayCycle, { standard: number; max: number }> = {
  weekly: { standard: WEEKLY_EXTRA_PAY.standardPayCount, max: WEEKLY_EXTRA_PAY.extraPayCount },
  fortnightly: { standard: FORTNIGHTLY_EXTRA_PAY.standardPayCount, max: FORTNIGHTLY_EXTRA_PAY.extraPayCount },
  monthly: { standard: 12, max: 12 },
};

export const EXTRA_PAY_SCHEDULES: Record<Exclude<PayCycle, "monthly">, ExtraPaySchedule> = {
  weekly: WEEKLY_EXTRA_PAY,
  fortnightly: FORTNIGHTLY_EXTRA_PAY,
};

export const PAY_PERIODS_SOURCES = {
  atoFortnightly: FORTNIGHTLY_EXTRA_PAY.sourceUrl,
  atoWeekly: WEEKLY_EXTRA_PAY.sourceUrl,
} as const;

export const PAY_PERIODS_VERIFIED_ON = "24 September 2026";

// ---------------------------------------------------------------------------
// ISO date helpers (UTC, so no daylight-saving drift)
// ---------------------------------------------------------------------------

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;
export type Weekday = (typeof WEEKDAYS)[number];

function toUtc(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function fromUtc(d: Date): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}

export function isValidIso(iso: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  return fromUtc(toUtc(iso)) === iso;
}

export function addDays(iso: string, days: number): string {
  const d = toUtc(iso);
  d.setUTCDate(d.getUTCDate() + days);
  return fromUtc(d);
}

/** Whole days from a to b (positive when b is later). */
export function daysBetween(a: string, b: string): number {
  return Math.round((toUtc(b).getTime() - toUtc(a).getTime()) / 86_400_000);
}

export function weekdayName(iso: string): Weekday {
  return WEEKDAYS[toUtc(iso).getUTCDay()];
}

function daysInMonth(y: number, m: number): number {
  return new Date(Date.UTC(y, m, 0)).getUTCDate();
}

/** Same day of month `months` later, clamped to the month's last day (31 Jan + 1 → 28/29 Feb). */
export function addMonthsClamped(anchorIso: string, months: number): string {
  const [y, m, d] = anchorIso.split("-").map(Number);
  const total = y * 12 + (m - 1) + months;
  const ny = Math.floor(total / 12);
  const nm = (total % 12) + 1;
  const nd = Math.min(d, daysInMonth(ny, nm));
  return `${ny}-${String(nm).padStart(2, "0")}-${String(nd).padStart(2, "0")}`;
}

// ---------------------------------------------------------------------------
// Financial years
// ---------------------------------------------------------------------------

export interface FinancialYear {
  /** "2026-27" */
  label: string;
  start: string;
  end: string;
  days: number;
}

/** The financial year that starts on 1 July of `startYear`. */
export function financialYear(startYear: number): FinancialYear {
  const start = `${startYear}-07-01`;
  const end = `${startYear + 1}-06-30`;
  return { label: `${startYear}-${String(startYear + 1).slice(2)}`, start, end, days: daysBetween(start, end) + 1 };
}

/** The financial year containing a date. */
export function financialYearOf(iso: string): FinancialYear {
  const [y, m] = iso.split("-").map(Number);
  return financialYear(m >= 7 ? y : y - 1);
}

export const FY_2026_27 = financialYear(2026);

// ---------------------------------------------------------------------------
// Pay dates
// ---------------------------------------------------------------------------

/**
 * Every pay day of a cycle that falls between `from` and `to` inclusive,
 * given any one known pay day (`anchor`, which may be before, inside or after
 * the range). Monthly cycles keep the anchor's day of month, clamped to short
 * months.
 */
export function payDatesBetween(anchor: string, cycle: PayCycle, from: string, to: string): string[] {
  const out: string[] = [];
  if (cycle === "monthly") {
    const [ay, am] = anchor.split("-").map(Number);
    const [fy, fm] = from.split("-").map(Number);
    let k = (fy - ay) * 12 + (fm - am) - 1;
    for (;;) {
      const d = addMonthsClamped(anchor, k);
      if (d > to) break;
      if (d >= from) out.push(d);
      k += 1;
    }
    return out;
  }
  const step = PAY_CYCLE_STEP_DAYS[cycle];
  const offset = daysBetween(anchor, from);
  let d = addDays(anchor, Math.ceil(offset / step) * step);
  while (d <= to) {
    out.push(d);
    d = addDays(d, step);
  }
  return out;
}

export interface PayYearSummary {
  fy: FinancialYear;
  cycle: PayCycle;
  payDates: string[];
  count: number;
  standard: number;
  /** True in a 53-weekly or 27-fortnightly pay-day year. */
  extraPayYear: boolean;
}

export function payYearSummary(anchor: string, cycle: PayCycle, fy: FinancialYear = FY_2026_27): PayYearSummary {
  const payDates = payDatesBetween(anchor, cycle, fy.start, fy.end);
  const standard = PAY_DAYS_PER_YEAR[cycle].standard;
  return { fy, cycle, payDates, count: payDates.length, standard, extraPayYear: payDates.length > standard };
}

/**
 * The first-pay-day window that produces an extra pay: a weekly pay day on the
 * weekday of 1 July (or of 1 or 2 July in a 366-day year); a fortnightly pay
 * day falling on 1 July (or 1 or 2 July in a 366-day year).
 */
export function extraPayTriggers(fy: FinancialYear): { weeklyWeekdays: Weekday[]; fortnightlyFirstPayDates: string[] } {
  const spare = fy.days - 364; // 1, or 2 in a year containing 29 February
  const firsts = Array.from({ length: spare }, (_, i) => addDays(fy.start, i));
  return { weeklyWeekdays: firsts.map(weekdayName), fortnightlyFirstPayDates: firsts };
}

/** Weeks and spare days in a calendar year: 52 weeks + 1 day (or + 2 in a leap year). */
export function weeksInCalendarYear(year: number): { weeks: number; spareDays: number; days: number } {
  const days = daysBetween(`${year}-01-01`, `${year}-12-31`) + 1;
  return { weeks: Math.floor(days / 7), spareDays: days % 7, days };
}

/** The ATO's optional additional withholding per pay in an extra-pay year (0 below the first band). */
export function extraPayWithholding(cycle: Exclude<PayCycle, "monthly">, earningsPerPay: number): number {
  // The ATO tables are in whole dollars: ignore cents before looking up.
  const dollars = Math.floor(earningsPerPay);
  const band = EXTRA_PAY_SCHEDULES[cycle].bands.find((b) => dollars >= b.from && (b.to === null || dollars <= b.to));
  return band ? band.additional : 0;
}
