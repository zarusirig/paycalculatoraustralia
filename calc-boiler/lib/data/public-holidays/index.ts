// Public holiday pay cluster (G4) — registry and derived helpers.
// Relative imports only: this file is compiled by the plain `tsc` test run.

import { getAwardPublicHolidayRate, publicHolidayRateRange, PUBLIC_HOLIDAY_AWARD_RATES } from "./award-rates";
import { pctLabel } from "./calc";
import { formatHolidayDate } from "./dates";
import type { HolidayYear, PhStateSlug, PhYear, PublicHolidayDate, StatePublicHolidays } from "./types";
import { NSW_PUBLIC_HOLIDAYS } from "./states/nsw";
import { VIC_PUBLIC_HOLIDAYS } from "./states/vic";
import { QLD_PUBLIC_HOLIDAYS } from "./states/qld";

export * from "./types";
export { PUBLIC_HOLIDAY_AWARD_RATES, getAwardPublicHolidayRate, publicHolidayRateRange } from "./award-rates";
export { publicHolidayPay, pctLabel } from "./calc";
export { formatHolidayDate, weekdayOf, shortDate } from "./dates";

export const PH_HUB_PATH = "/public-holiday-pay/";
export const PH_VERIFIED_ON = "24 September 2026";

/** Built state pages, in the site's usual state order. */
export const STATE_PUBLIC_HOLIDAYS: readonly StatePublicHolidays[] = [NSW_PUBLIC_HOLIDAYS, VIC_PUBLIC_HOLIDAYS, QLD_PUBLIC_HOLIDAYS];

export function getStatePublicHolidays(slug: string): StatePublicHolidays | undefined {
  return STATE_PUBLIC_HOLIDAYS.find((s) => s.slug === slug);
}

export function statePath(slug: PhStateSlug): string {
  return `${PH_HUB_PATH}${slug}/`;
}

export function yearOf(state: StatePublicHolidays, year: PhYear): HolidayYear | undefined {
  return state.years.find((y) => y.year === year);
}

/** Whole-day holidays that apply across the state (state-wide + additional days). */
export function statewideDays(y: HolidayYear): readonly PublicHolidayDate[] {
  return y.holidays.filter((h) => h.kind === "statewide" || h.kind === "additional");
}

export function partDays(y: HolidayYear): readonly PublicHolidayDate[] {
  return y.holidays.filter((h) => h.kind === "part-day");
}

/** H1 and <title> stem for a state page. */
export function stateHeading(s: StatePublicHolidays): string {
  return `${s.code} Public Holidays 2026 & 2027 — Dates + Public Holiday Pay Rates`;
}

/**
 * The FAQ array a state page renders AND emits as FAQPage JSON-LD — one array,
 * so the visible answers and the structured data cannot differ.
 */
export function stateFaqs(s: StatePublicHolidays): { q: string; a: string }[] {
  const retail = getAwardPublicHolidayRate("retail");
  const hosp = getAwardPublicHolidayRate("hospitality");
  const range = publicHolidayRateRange();
  const y26 = yearOf(s, 2026);
  const count26 = y26 ? statewideDays(y26).length : 0;
  const common: { q: string; a: string }[] = [
    {
      q: `What is the public holiday pay rate ${s.inName}?`,
      a: `It is set by your award or agreement, not by the state. Across the ${PUBLIC_HOLIDAY_AWARD_RATES.length} awards on this site a permanent employee is paid ${pctLabel(range.permanentMin)} to ${pctLabel(range.permanentMax)} of the base rate for hours worked on a public holiday${
        retail && hosp
          ? ` — ${pctLabel(retail.permanent)} under the General Retail and Hospitality awards (${pctLabel(retail.casual)} for casuals)`
          : ""
      }. The ${s.code} holiday list decides which days those rates apply to.`,
    },
    {
      q: `Do I get paid if I don't work on a ${s.code} public holiday?`,
      a: `Yes, if you are full-time or part-time and the holiday falls on a day you would normally work. Under the National Employment Standards you are paid your base rate for the ordinary hours you would have worked. Casuals are not paid for a public holiday they don't work, and a part-timer who doesn't normally work that weekday gets nothing extra.`,
    },
  ];
  if (y26 && count26 > 0) {
    const first = statewideDays(y26)[0];
    common.push({
      q: `How many public holidays are there ${s.inName} in 2026?`,
      a: `${count26} whole-day public holidays apply across ${s.code} in 2026, starting with ${first.name} on ${formatHolidayDate(first.date)}${
        partDays(y26).length ? `, plus ${partDays(y26).length} part-day holidays` : ""
      }${s.regional.length || y26.holidays.some((h) => h.kind === "regional") ? ", plus regional holidays that apply in part of the state only" : ""}.`,
    });
  }
  return [...s.faqs, ...common];
}
