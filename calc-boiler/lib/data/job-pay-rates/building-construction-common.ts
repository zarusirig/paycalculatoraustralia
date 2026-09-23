// Building and Construction General On-site Award 2020 [MA000020] — shared by
// the carpenter and crane operator pages.
//
// Source: FWC consolidated award text, awards.fairwork.gov.au/MA000020.html,
// "incorporates all amendments up to and including 1 July 2026 (PR799301 …)".
// Read 23 September 2026.
//
// ⚠️ THE CLAUSE 19.1 RATE IS NOT THE MINIMUM. Clause 19.1(b): "The rates in
// clause 19.1(a) prescribe minimum classification rates only. The payment of
// additional allowances is required by other clauses of this award." The
// "ordinary hourly rate" (cl 2) is the cl 19.1 rate PLUS the industry
// allowance (cl 22.1, all purposes), and any other all-purpose allowance —
// for a carpenter, the tool allowance (cl 21.1(a), $41.22/wk, all purposes).
// For a weekly hire employee the hourly rate is that weekly sum / 38
// (cl 19.3(b)). The award publishes NO hourly summary schedule, so the
// weekly column below is our sum of published figures and hourly/casual are
// our arithmetic on it, rounded half-up to the cent. Tests re-derive them.
//
//   cl 19.1(a) weekly: CW1(a) 1013.50  CW1(b) 1033.50  CW1(c) 1047.30
//     CW1(d) 1066.00  CW2 1087.50  CW3 1119.10  CW4 1154.40  CW5 1189.60
//     CW6 1221.30  CW7 1256.30  CW8 1286.70  ECW9 1309.50
//   cl 22.1 industry allowance: general building, civil and metal & engineering
//     construction $67.15/wk; residential building $53.72/wk.
//
// Daily hire employees (cl 19.3(a)) are paid more: the sum is multiplied by
// 52/50.4 ("follow the job loading") before dividing by 38. Casuals get 25%
// on the ordinary hourly rate (cl 12.4) and 275% on public holidays (cl 12.6).
//
// Ordinary hours are Monday to Friday, 7 am to 6 pm (cl 16.1), so Saturday and
// Sunday work is overtime: Saturday 150% for 2 hours then 200% (200% after
// 12 noon), Sunday 200%, public holidays 250% (cl 29.4, 30.1).

import type { AwardRef, PenaltyRow, RateRow } from "./types";
import { awardTextUrl, casualFromHourly, hourlyFromWeekly, toCents } from "./common";

export const BUILDING_AWARD: AwardRef = {
  name: "Building and Construction General On-site Award 2020",
  code: "MA000020",
  url: awardTextUrl("MA000020"),
  consolidatedTo: "1 July 2026",
};

export const BUILDING_SOURCE_TITLE =
  "Building and Construction General On-site Award 2020 [MA000020] — consolidated to 1 July 2026";

/** cl 19.1(a) minimum weekly classification rates (not the minimum pay — see header). */
export const BUILDING_BASE_WEEKLY = {
  "CW/ECW 1 (level a)": 1013.5,
  "CW/ECW 1 (level b)": 1033.5,
  "CW/ECW 1 (level c)": 1047.3,
  "CW/ECW 1 (level d)": 1066.0,
  "CW/ECW 2": 1087.5,
  "CW/ECW 3": 1119.1,
  "CW/ECW 4": 1154.4,
  "CW/ECW 5": 1189.6,
  "CW/ECW 6": 1221.3,
  "CW/ECW 7": 1256.3,
  "CW/ECW 8": 1286.7,
} as const;

export type BuildingLevel = keyof typeof BUILDING_BASE_WEEKLY;

/** cl 22.1 all-purpose industry allowances, per week. */
export const INDUSTRY_ALLOWANCE = { general: 67.15, residential: 53.72 } as const;

/** cl 21.1(a) tool allowance for a carpenter and/or joiner, per week, all purposes. */
export const CARPENTER_TOOL_ALLOWANCE = 41.22;

/** A weekly-hire row: cl 19.1 rate + industry allowance (+ any other all-purpose allowance). */
export function buildingRow(
  label: string,
  level: BuildingLevel,
  allowances: number[],
  note?: string,
): RateRow {
  const weekly = toCents(allowances.reduce((sum, a) => sum + a, BUILDING_BASE_WEEKLY[level]));
  const hourly = hourlyFromWeekly(weekly);
  return { label, weekly, hourly, casualHourly: casualFromHourly(hourly), ...(note ? { note } : {}) };
}

export const BUILDING_PENALTIES: PenaltyRow[] = [
  { when: "Ordinary hours (Monday–Friday, 7 am–6 pm)", permanent: "100%", casual: "125%" },
  { when: "Saturday (overtime) — first 2 hours", permanent: "150%", casual: "175%" },
  { when: "Saturday after 2 hours or after 12 noon; Sunday", permanent: "200%", casual: "225%" },
  { when: "Public holiday", permanent: "250%", casual: "275%" },
];

export const BUILDING_PENALTIES_NOTE =
  "Percentages of the ordinary hourly rate, which already includes the industry allowance and any other all-purpose allowance. Ordinary hours run Monday to Friday (cl 16.1), so all weekend work is overtime (cl 29.12, 30.1). Casual rates are from cl 12.5 and 12.6.";

export const BUILDING_OVERTIME: string[] = [
  "Monday to Friday: 150% for the first 2 hours beyond ordinary hours, then 200% (cl 29.4(a)).",
  "Saturday: 150% for the first 2 hours, then 200%; all Saturday work after 12 noon is 200% (cl 30.1). Sunday: 200%. Public holiday: 250%.",
  "Minimum payments: 3 hours for Saturday overtime, 4 hours for Sunday and public holidays, and 3 hours for a recall (cl 29.5, 30.2).",
  "Casuals: 175% where the permanent rate is 150%, and 225% where it is 200% (cl 12.5).",
];

export const MULTISTOREY_ALLOWANCE = {
  name: "Multistorey allowance",
  amount: "$0.77 to $2.24 per hour",
  note: "Paid to everyone on site while building or renovating a building of 5 or more storeys, rising with the floor level reached (cl 23.3(e)).",
};

/** Daily hire ordinary hourly rate under cl 19.3(a): (weekly sum x 52/50.4, to the cent) / 38. */
export function dailyHireHourly(weeklySum: number): number {
  const loaded = Math.round(((weeklySum * 52) / 50.4) * 100) / 100;
  return toCents(loaded / 38);
}
