// Public holiday pay cluster (G4) — registry and derived helpers.
// Relative imports only: this file is compiled by the plain `tsc` test run.

import { getAwardPublicHolidayRate, publicHolidayRateRange, PUBLIC_HOLIDAY_AWARD_RATES } from "./award-rates";
import { pctLabel } from "./calc";
import { formatHolidayDate } from "./dates";
import type { HolidayYear, PhStateSlug, PhYear, PublicHolidayDate, StatePublicHolidays } from "./types";
import { NSW_PUBLIC_HOLIDAYS } from "./states/nsw";
import { VIC_PUBLIC_HOLIDAYS } from "./states/vic";
import { QLD_PUBLIC_HOLIDAYS } from "./states/qld";
import { WA_PUBLIC_HOLIDAYS } from "./states/wa";
import { SA_PUBLIC_HOLIDAYS } from "./states/sa";
import { TAS_PUBLIC_HOLIDAYS } from "./states/tas";
import { ACT_PUBLIC_HOLIDAYS } from "./states/act";
import { NT_PUBLIC_HOLIDAYS } from "./states/nt";

export * from "./types";
export { PUBLIC_HOLIDAY_AWARD_RATES, getAwardPublicHolidayRate, publicHolidayRateRange } from "./award-rates";
export { publicHolidayPay, pctLabel } from "./calc";
export { formatHolidayDate, weekdayOf, shortDate } from "./dates";

export const PH_HUB_PATH = "/public-holiday-pay/";
export const PH_VERIFIED_ON = "24 September 2026";

/** Built state pages, in the site's usual state order. */
export const STATE_PUBLIC_HOLIDAYS: readonly StatePublicHolidays[] = [NSW_PUBLIC_HOLIDAYS, VIC_PUBLIC_HOLIDAYS, QLD_PUBLIC_HOLIDAYS, WA_PUBLIC_HOLIDAYS, SA_PUBLIC_HOLIDAYS, TAS_PUBLIC_HOLIDAYS, ACT_PUBLIC_HOLIDAYS, NT_PUBLIC_HOLIDAYS];

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
  const range = publicHolidayRateRange();
  const preset = getAwardPublicHolidayRate(s.calculatorPreset.awardKey);
  const y26 = yearOf(s, 2026);
  const count26 = y26 ? statewideDays(y26).length : 0;
  const common: { q: string; a: string }[] = [];
  if (preset) {
    const partDay = y26 ? partDays(y26).find((h) => s.calculatorPreset.holidayName.startsWith(h.name)) : undefined;
    common.push({
      q: `What is the pay rate for working ${s.calculatorPreset.holidayName} ${s.inName}?`,
      a: `Under the ${preset.shortName}, ${pctLabel(preset.permanent)} of your base rate for every hour worked${partDay ? ` from ${partDay.hours}` : ""} (${pctLabel(preset.casual)} for casuals, loading included). The ${PUBLIC_HOLIDAY_AWARD_RATES.length} awards on this site pay ${pctLabel(range.permanentMin)} to ${pctLabel(range.permanentMax)}.`,
    });
  }
  if (y26 && count26 > 0) {
    const own = stateOwnDays(s, 2026).map((h) => `${h.name.replace(/^The /, "the ")} on ${formatHolidayDate(h.date, false)}`);
    common.push({
      q: `How many public holidays are there ${s.inName} in 2026?`,
      a: `${count26} whole-day public holidays apply across ${s.code} in 2026${
        own.length ? `, including ${own.length > 1 ? `${own.slice(0, -1).join(", ")} and ${own[own.length - 1]}` : own[0]}, which not every state has` : ""
      }${partDays(y26).length ? `, plus ${partDays(y26).length} part-day ${partDays(y26).length > 1 ? "holidays" : "holiday"}` : ""}${
        s.regional.length || y26.holidays.some((h) => h.kind === "regional") ? ", plus regional holidays that apply in part of the state only" : ""
      }.`,
    });
  }
  return [...s.faqs, ...common];
}

const baseName = (name: string) => name.replace(/\s*\(observed\)$/, "");

/**
 * A state's whole-day holidays in a year that are not on every other state's
 * list: no other-state holiday on the same date or under the same name
 * ("Boxing Day (observed)" counts as "Boxing Day").
 */
export function stateOwnDays(s: StatePublicHolidays, year: PhYear): PublicHolidayDate[] {
  const own = yearOf(s, year);
  if (!own) return [];
  const others = STATE_PUBLIC_HOLIDAYS.filter((o) => o.slug !== s.slug).map((o) => {
    const days = yearOf(o, year) ? statewideDays(yearOf(o, year)!) : [];
    return { dates: new Set(days.map((h) => h.date)), names: new Set(days.map((h) => baseName(h.name))) };
  });
  return statewideDays(own).filter((h) => !others.every((o) => o.dates.has(h.date) || o.names.has(baseName(h.name))));
}
