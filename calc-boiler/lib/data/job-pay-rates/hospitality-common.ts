// Shared rows and rules for the hospitality occupations (T5, wave 3): chef,
// bartender and barista.
//
// Hospitality Industry (General) Award 2020 [MA000009] rows are READ FROM
// lib/constants/hospitality-award.ts (HOSPITALITY_RATES), the same data the
// /hospitality-award-rates/ page renders — not re-typed.
//
// Restaurant Industry Award 2020 [MA000119] rows are READ FROM
// lib/constants/modern-awards.ts (RESTAURANT_AWARD, added by T4), the table
// /restaurant-award-rates/ renders (cl 18.1, Table 3, consolidated to 1 July
// 2026). The dollar figures are identical to the Hospitality Award's Table 3
// at every level; a test asserts that.
//
// Differences that matter between the two awards (both read 23 Sep 2026):
//   - Evening loadings: Hospitality +$2.95/hr 7 pm–midnight and +$4.42/hr
//     midnight–7 am Mon–Fri (cl 29.2, Table 14); Restaurant +$2.95/hr
//     10 pm–midnight and +$4.42/hr midnight–6 am (cl 24.2, Table 8).
//   - Casual Sunday: Hospitality 175% for everyone; Restaurant 150% for casual
//     Introductory to Level 2, 175% for casual Level 3 to 6 (Table 8).
//   - Saturday overtime: Restaurant 175% for the first 2 hours (Table 7);
//     Hospitality 200% from midnight Friday to midnight Sunday (Table 13).

import { HOSPITALITY_RATES } from "../../constants/hospitality-award";
import { RESTAURANT_AWARD } from "../../constants/modern-awards";
import { casualFromHourly, rowFromModernAward } from "./common";
import type { PenaltyRow, RateRow } from "./types";

export const RESTAURANT_AWARD_REF = {
  name: "Restaurant Industry Award 2020",
  code: "MA000119",
  consolidatedTo: "1 July 2026",
} as const;

export const HOSPITALITY_AWARD_REF = {
  name: "Hospitality Industry (General) Award 2020",
  code: "MA000009",
  consolidatedTo: "1 July 2026",
} as const;

/** Restaurant Award cl 18.1, Table 3 — the shared constants. */
export const RESTAURANT_TABLE_3 = RESTAURANT_AWARD.rates;

/** A Hospitality Award row for a wage level, from the shared constants. */
export function hospitalityRow(level: string, label: string, note?: string): RateRow {
  const r = HOSPITALITY_RATES.find((x) => x.level === level);
  if (!r) throw new Error(`hospitality-common: no Hospitality Award ${level}`);
  return { label, weekly: r.weekly, hourly: r.hourly, casualHourly: casualFromHourly(r.hourly), ...(note ? { note } : {}) };
}

/** A Restaurant Award row for a wage level. */
export function restaurantRow(level: string, label: string, note?: string): RateRow {
  return rowFromModernAward(RESTAURANT_AWARD, level, label, note);
}

/** Hospitality Award cl 29.2, Table 14. */
export const HOSPITALITY_PENALTY_ROWS: PenaltyRow[] = [
  { when: "Monday–Friday, 7 pm to midnight", permanent: "100% + $2.95/hr", casual: "125% + $2.95/hr" },
  { when: "Monday–Friday, midnight to 7 am", permanent: "100% + $4.42/hr", casual: "125% + $4.42/hr" },
  { when: "Saturday", permanent: "125%", casual: "150%" },
  { when: "Sunday", permanent: "150%", casual: "175%" },
  { when: "Public holiday", permanent: "225%", casual: "250%" },
];

/** Restaurant Award cl 24.2, Table 8 (casual column for Levels 3–6; Sunday differs below Level 3). */
export const RESTAURANT_PENALTY_ROWS: PenaltyRow[] = [
  { when: "Monday–Friday, 10 pm to midnight", permanent: "100% + $2.95/hr", casual: "125% + $2.95/hr" },
  { when: "Monday–Friday, midnight to 6 am", permanent: "100% + $4.42/hr", casual: "125% + $4.42/hr" },
  { when: "Saturday", permanent: "125%", casual: "150%" },
  { when: "Sunday", permanent: "150%", casual: "175% (Levels 3–6); 150% (Introductory–Level 2)" },
  { when: "Public holiday", permanent: "225%", casual: "250%" },
];

export const HOSPITALITY_OVERTIME_LINES: string[] = [
  "Hospitality Award (cl 28.4, Table 13): Monday to Friday 150% for the first 2 hours, then 200%; midnight Friday to midnight Sunday 200%; rostered day off 200%. The casual loading is not added to overtime.",
  "Restaurant Award (cl 23.4, Table 7): Monday to Friday 150% for the first 2 hours, then 200%; Saturday 175% for the first 2 hours, then 200%; Sunday and rostered day off 200%.",
];

export const HOSPITALITY_EVENING_NOTE =
  "The evening and night loadings are flat dollar amounts added to each hour, not percentages. Where more than one penalty applies only the highest is paid (Hospitality cl 29.3; Restaurant cl 24.3).";
