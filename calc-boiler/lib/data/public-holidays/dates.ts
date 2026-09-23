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

export interface ParsedSourceDate {
  /** Each day number printed, with the weekday printed immediately before it (if any). */
  days: { weekday?: string; day: number }[];
  month: number;
  year?: number;
}

/**
 * Parse a date as an official page prints it. Handles the forms the eight
 * sources use:
 *   "Monday 27 April"            (VIC, QLD, WA, SA, ACT)
 *   "Monday 27 April 2026"       (NSW, NT)
 *   "Saturday 25 and Monday 27 April"   (ACT's paired days)
 *   "28 December" / "7 January"  (Tasmania prints no weekday)
 */
export function parseSourceDate(source: string): ParsedSourceDate {
  const monthMatch = new RegExp(`\\b(${MONTHS.join("|")})\\b`).exec(source);
  if (!monthMatch) throw new Error(`no month in source date: ${source}`);
  const month = MONTHS.indexOf(monthMatch[1] as (typeof MONTHS)[number]) + 1;
  const yearMatch = /\b(20\d{2})\b/.exec(source);
  const head = source.slice(0, monthMatch.index);
  const days: { weekday?: string; day: number }[] = [];
  const re = new RegExp(`(?:\\b(${WEEKDAYS.join("|")})\\s+)?\\b(\\d{1,2})\\b`, "g");
  let m: RegExpExecArray | null;
  while ((m = re.exec(head)) !== null) days.push({ weekday: m[1], day: Number(m[2]) });
  if (days.length === 0) throw new Error(`no day in source date: ${source}`);
  return { days, month, year: yearMatch ? Number(yearMatch[1]) : undefined };
}

/**
 * Does the ISO date agree with the source string? The day (and its weekday,
 * where printed) must appear, the month must match, and the year must match
 * where printed. Returns a reason string on mismatch, or null.
 */
export function sourceMismatch(iso: string, source: string): string | null {
  const { y, m, d } = parts(iso);
  const p = parseSourceDate(source);
  if (p.month !== m) return `month ${p.month} in "${source}" != ${m}`;
  if (p.year !== undefined && p.year !== y) return `year ${p.year} in "${source}" != ${y}`;
  const hit = p.days.find((x) => x.day === d);
  if (!hit) return `day ${d} not in "${source}"`;
  if (hit.weekday && hit.weekday !== weekdayOf(iso)) return `"${source}" says ${hit.weekday}, ${iso} is a ${weekdayOf(iso)}`;
  return null;
}
