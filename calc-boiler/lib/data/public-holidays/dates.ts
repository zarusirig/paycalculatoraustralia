// Date helpers for the public holiday cluster. Pure functions, no Date-locale
// dependence: every calculation is in UTC so the build machine's timezone
// cannot shift a holiday by a day.

export const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;
export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

function parts(iso: string): { y: number; m: number; d: number } {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) throw new Error(`not an ISO date: ${iso}`);
  return { y: Number(match[1]), m: Number(match[2]), d: Number(match[3]) };
}

export function weekdayOf(iso: string): (typeof WEEKDAYS)[number] {
  const { y, m, d } = parts(iso);
  return WEEKDAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
}

/** "Monday 27 April 2026". */
export function formatHolidayDate(iso: string, withYear = true): string {
  const { y, m, d } = parts(iso);
  return `${weekdayOf(iso)} ${d} ${MONTHS[m - 1]}${withYear ? ` ${y}` : ""}`;
}

/** "27 Apr" — compact form for dense tables. */
export function shortDate(iso: string): string {
  const { m, d } = parts(iso);
  return `${d} ${MONTHS[m - 1].slice(0, 3)}`;
}

export function isValidIsoDate(iso: string): boolean {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return false;
  const dt = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  return dt.getUTCFullYear() === Number(m[1]) && dt.getUTCMonth() === Number(m[2]) - 1 && dt.getUTCDate() === Number(m[3]);
}

export interface ParsedSourceDay {
  weekday?: string;
  day: number;
  month: number;
  year?: number;
}

/**
 * Parse a date as an official page prints it, into every day it names. Handles
 * the forms the eight sources use:
 *   "Monday 27 April"                                (VIC, QLD, WA, SA, ACT)
 *   "Monday 27 April 2026"                           (NSW, NT)
 *   "Saturday 25 and Monday 27 April"                (ACT pairs; month shared)
 *   "Saturday 26 December and Monday 28 December"    (QLD pairs)
 *   "28 December" / "27 March 2026"                  (Tasmania, QLD show days)
 */
export function parseSourceDate(source: string): ParsedSourceDay[] {
  const segments = source.split(/\s+(?:and|&)\s+/);
  const out: ParsedSourceDay[] = [];
  let pendingNoMonth: { weekday?: string; day: number }[] = [];
  const dayRe = new RegExp(`^(?:(${WEEKDAYS.join("|")})\\s+)?(\\d{1,2})(?:\\s+(${MONTHS.join("|")}))?(?:\\s+(20\\d{2}))?$`);
  for (const seg of segments) {
    const m = dayRe.exec(seg.trim());
    if (!m) throw new Error(`unparseable source date segment "${seg}" in "${source}"`);
    const entry = { weekday: m[1], day: Number(m[2]) };
    if (!m[3]) {
      pendingNoMonth.push(entry);
      continue;
    }
    const month = MONTHS.indexOf(m[3] as (typeof MONTHS)[number]) + 1;
    const year = m[4] ? Number(m[4]) : undefined;
    for (const p of pendingNoMonth) out.push({ ...p, month, year });
    pendingNoMonth = [];
    out.push({ ...entry, month, year });
  }
  if (pendingNoMonth.length || out.length === 0) throw new Error(`no month in source date: ${source}`);
  return out;
}

/**
 * Does the ISO date agree with the source string? One of the days it names
 * must have the same day and month, the same year where printed, and the same
 * weekday where printed. Returns a reason string on mismatch, or null.
 */
export function sourceMismatch(iso: string, source: string): string | null {
  const { y, m, d } = parts(iso);
  const days = parseSourceDate(source);
  const hit = days.find((x) => x.day === d && x.month === m);
  if (!hit) return `${d}/${m} not in "${source}"`;
  if (hit.year !== undefined && hit.year !== y) return `year ${hit.year} in "${source}" != ${y}`;
  if (hit.weekday && hit.weekday !== weekdayOf(iso)) return `"${source}" says ${hit.weekday}, ${iso} is a ${weekdayOf(iso)}`;
  return null;
}
