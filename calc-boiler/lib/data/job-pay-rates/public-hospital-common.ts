// =============================================================================
// Shared pieces for the health job pages that show public hospital pay by
// state (23 Oct 2026): pharmacist, radiographer, physiotherapist,
// psychologist, occupational therapist and sonographer.
//
// Titles, descriptions, ledes and FAQ figures are BUILT from the data
// (lib/data/public-health-allied-pay and each page's JSA median), never typed
// in, so a figure in the title or an FAQ cannot drift from the tables.
// Take-home figures use the site's tax engine (calculatePayBreakdown), the
// same call as afterTax() in ./index.
// =============================================================================

import { calculatePayBreakdown, formatAUD } from "../../constants/australian-tax";
import {
  entryRange,
  publicAnnual,
  publicPayFor,
  publicPayIn,
  stepOf,
  type AlliedProfession,
} from "../public-health-allied-pay";
import type { MedianEarnings } from "./types";

export const HOSPITAL_PAGES_MODIFIED = "2026-10-23";

/** Whole dollars, e.g. "$86,785". */
export function aud(n: number): string {
  return formatAUD(n);
}

/** Dollars and cents, e.g. "$1,668.95". */
export function aud2(n: number): string {
  return formatAUD(n, 2);
}

/** The JSA median as a full-time year: weekly x 52, to the dollar (as annualFromWeekly). */
export function medianAnnual(m: MedianEarnings): number {
  return Math.round(m.medianWeekly * 52);
}

/** Take-home a year and a fortnight on a gross salary: 2026-27 resident rates, Medicare levy, no HECS, no surcharge. */
export function takeHome(gross: number): { year: number; fortnight: number } {
  const b = calculatePayBreakdown({ grossSalary: gross, includeHECS: false, hasPrivateHealth: true });
  return { year: b.takeHomePay, fortnight: b.fortnightly };
}

/** The first form that fits Google's ~65-character title width. */
export function hospitalSalaryTitle(name: string, median: MedianEarnings | null): string {
  const forms = [
    ...(median ? [`${name} Salary Australia 2026: ${aud(medianAnnual(median))} Median, Pay by State`] : []),
    `${name} Salary Australia 2026: Hospital Pay by State`,
    `${name} Salary Australia 2026: Pay by State`,
    `${name} Salary 2026: Hospital Pay by State`,
  ];
  return forms.find((t) => t.length <= 65) ?? forms[forms.length - 1];
}

/** The state codes with a verified table, e.g. "NSW, VIC, QLD, WA and SA". */
export function stateList(profession: AlliedProfession): string {
  const codes = publicPayFor(profession).map((r) => r.state.code);
  return codes.length <= 1 ? codes.join("") : `${codes.slice(0, -1).join(", ")} and ${codes[codes.length - 1]}`;
}

/** The lowest start and the highest top across the verified states' scales. */
export function fullRange(profession: AlliedProfession): { low: number; high: number } {
  const rows = publicPayFor(profession);
  return { low: Math.min(...rows.map((r) => r.entryAnnual)), high: Math.max(...rows.map((r) => r.topAnnual)) };
}

/** Meta description: the median, then the public hospital pay range across states. Under 160 characters. */
export function hospitalMetaDescription(name: string, profession: AlliedProfession, median: MedianEarnings | null): string {
  const { low, high } = fullRange(profession);
  const states = publicPayFor(profession).length;
  const lead = median ? `${name} salary in Australia: ${aud(median.medianWeekly)} a week median.` : `${name} salary in Australia.`;
  const forms = [
    `${lead} Public hospital pay in ${states} states runs from ${aud(low)} to ${aud(high)}. Every grade, with take-home pay.`,
    `${lead} Hospital pay in ${states} states runs from ${aud(low)} to ${aud(high)}, with take-home pay.`,
    `${lead} Public hospital pay in ${stateList(profession)}, with take-home pay.`,
  ];
  return forms.find((d) => d.length <= 160) ?? forms[forms.length - 1];
}

/** "from $68,245 in VIC to $91,726 in WA" */
export function startRangeWords(profession: AlliedProfession): string {
  const { low, high } = entryRange(profession);
  return `from ${aud(low.entryAnnual)} a year in ${low.state.code} to ${aud(high.entryAnnual)} in ${high.state.code}`;
}

/** One state's start and top in words, e.g. "NSW Health: $86,785 (Grade 1, year 1) to $195,970 (Grade 7, Group B, year 2)". */
export function stateRangeWords(profession: AlliedProfession, code: string): string {
  const r = publicPayIn(profession, code);
  return `${aud(r.entryAnnual)} (${r.entry.label}) to ${aud(r.topAnnual)} (${r.top.label})`;
}

/** A named step's yearly pay in one state, in dollars. Throws if the step does not exist. */
export function stepPay(profession: AlliedProfession, code: string, label: string): string {
  return aud(publicAnnual(profession, code, label));
}

/** Every state's start, e.g. "NSW $86,785, VIC $68,245, QLD $83,824, WA $91,726 and SA $73,710". */
export function allStarts(profession: AlliedProfession): string {
  const parts = publicPayFor(profession).map((r) => `${r.state.code} ${aud(r.entryAnnual)}`);
  return parts.length <= 1 ? parts.join("") : `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`;
}

/** A named step's published weekly rate in one state, e.g. "$1,668.95". Throws if the step has none. */
export function stepWeekly(profession: AlliedProfession, code: string, label: string): string {
  const step = stepOf(publicPayIn(profession, code).scale, label);
  if (typeof step.weekly !== "number") throw new Error(`stepWeekly: ${code} ${label} has no weekly rate`);
  return aud2(step.weekly);
}
