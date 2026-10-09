// Small helpers shared by the J8 occupation pages and sections (9 Oct 2026).
//
// takeHomeWeekly() is the same engine call as afterTax() in ./index.ts
// (2026-27 resident rates, LITO, Medicare levy, no HECS, no surcharge). It is
// repeated here, not imported, because the occupation files are imported BY
// index.ts: importing index back would be a require cycle under the CommonJS
// test build. The J8 test asserts the two agree to the dollar.

import { calculatePayBreakdown } from "../../constants/australian-tax";

/** "$32.13" */
export const money2 = (x: number): string => `$${x.toFixed(2)}`;

/** "$63,497" */
export const money0 = (x: number): string => `$${Math.round(x).toLocaleString("en-AU")}`;

/** Full-time annual equivalent of a weekly rate: 52 weeks, to the dollar (same as annualFromWeekly). */
export const annual52 = (weekly: number): number => Math.round(weekly * 52);

/** Weekly take-home on a full-time annual salary, using the site's tax engine. */
export function takeHomeWeekly(grossAnnual: number): number {
  return calculatePayBreakdown({ grossSalary: grossAnnual, includeHECS: false, hasPrivateHealth: true }).weekly;
}

/** Hourly rate x a penalty percentage, rounded half-up to the cent, as Fair Work's schedules do. */
export function atPercent(hourly: number, pct: number): number {
  return Math.round(Math.round(hourly * 100) * pct + 1e-7) / 100;
}
