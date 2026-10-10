// Health Professionals and Support Services Award 2020 [MA000027] — Health
// Professional employee rates from 1 October 2026, used by every job-pay page
// for a health professional (occupational therapist, physiotherapist,
// psychologist, audiologist, dental hygienist, dietitian, lab technician,
// podiatrist, radiographer, sonographer, speech pathologist; quoted on the
// social worker page).
//
// Source: determination PR814029 (7 September 2026), clauses 17.1 and 17.2
// (weekly and hourly), Schedule C.2.1 (full-time/part-time penalty rates) and
// Schedule C.2.3 (casual ordinary hours, 125%), read 9 October 2026 from
//   https://www.fwc.gov.au/documents/awardsandorders/pdf/pr814029.pdf
// and checked the same day against the FWC consolidated award, which now
// "incorporates all amendments up to and including 1 October 2026 (PR814029)":
//   https://awards.fairwork.gov.au/MA000027.html
// Operative from the first full pay period starting on or after 1 October 2026.
// Each profession's AQF level is from Schedule B.3 of the same text.
//
// The weekly and hourly figures are the HPSS_OCT_2026_* constants in
// health-professionals-common.ts (identical to the determination); only the
// published casual and penalty columns are added here, so that file is not
// restructured.
//
// The pre-October pay points (HPSS_TABLES) are NOT current. A few survive
// only as retained minimums under clause J.4.3 for employees classified under
// the award on 30 September 2026.

import {
  HPSS_AWARD,
  HPSS_OCT_2026,
  HPSS_OCT_2026_LEVEL_1,
  HPSS_OCT_2026_SENIOR,
  hpssOccupation,
  type HpssOccupationInput,
} from "./health-professionals-common";
import type { AwardRef, Occupation, OccupationSource, RateRow, RateTable } from "./types";

export const HPSS_OCT_2026_VERIFIED_ON = "9 October 2026";
export const HPSS_OCT_2026_RATES_FROM = "the first full pay period starting on or after 1 October 2026";

export type HpssAqfLevel = 5 | 6 | 7 | 8 | 9;

/**
 * Schedule C.2.3 casual ordinary-hours rates (125% of the minimum hourly rate)
 * exactly as PR814029 prints them, read 9 October 2026. Order: 1st year,
 * 2nd – 3rd year, 4th – 6th year, 7th year+.
 */
const CASUAL_LEVEL_1: Record<HpssAqfLevel, readonly [number, number, number, number]> = {
  5: [40.55, 43.05, 46.91, 50.7],
  6: [40.55, 43.05, 48.79, 54.59],
  7: [43.05, 46.35, 51.49, 55.58],
  8: [43.99, 47.53, 52.14, 56.63],
  9: [47.53, 50.83, 54.59, 57.73],
};

/** Schedule C.2.3 casual rates for Level 2.1, Level 2.2, Level 3 and Level 4, read 9 October 2026. */
const CASUAL_SENIOR = [63.99, 65.24, 65.24, 82.21] as const;

/**
 * Schedule C.2.1 full-time and part-time rates for a 1st-year Level 1
 * employee, as PR814029 prints them (read 9 October 2026): "Between midnight
 * Friday and midnight Sunday" (150%) and "Public holiday" (250%).
 */
export const HPSS_OCT_2026_FIRST_YEAR_PENALTIES: Record<HpssAqfLevel, { weekend: number; publicHoliday: number }> = {
  5: { weekend: 48.66, publicHoliday: 81.1 },
  6: { weekend: 48.66, publicHoliday: 81.1 },
  7: { weekend: 51.66, publicHoliday: 86.1 },
  8: { weekend: 52.79, publicHoliday: 87.98 },
  9: { weekend: 57.03, publicHoliday: 95.05 },
};

export const HPSS_AWARD_OCT_2026: AwardRef = {
  ...HPSS_AWARD,
  consolidatedTo: "1 October 2026",
};

export const HPSS_OCT_2026_SOURCES: OccupationSource[] = [
  {
    title: `${HPSS_AWARD.name} [${HPSS_AWARD.code}] — consolidated to 1 October 2026 (PR814029)`,
    publisher: "Fair Work Commission",
    url: HPSS_AWARD.url,
  },
  {
    title: `Determination ${HPSS_OCT_2026.determination} (${HPSS_OCT_2026.decidedOn}), Health Professionals and Support Services Award 2020`,
    publisher: "Fair Work Commission",
    url: HPSS_OCT_2026.determinationUrl,
  },
];

/**
 * The one award-wide notice every health professional page carries. Kept to a
 * line: the lede already gives the 1 October 2026 start date, and the award
 * page covers the transition in full.
 */
export const HPSS_OCT_2026_NOTICES: string[] = [
  "Stage 1 of the gender undervaluation increases (determination PR814029); further stages are due from 30 June 2027, 2028, 2029 and 2030. If you were on this award on 30 September 2026, clause J.4.3 keeps your old minimum rate if it was higher.",
];

/** The four Level 1 rows (1st year to 7th year+) for one AQF level, with the published casual rate. */
export function hpssOct2026Level1Rows(aqf: HpssAqfLevel): RateRow[] {
  return HPSS_OCT_2026_LEVEL_1[aqf].map((r, i) => ({
    label: r.label,
    weekly: r.weekly,
    hourly: r.hourly,
    casualHourly: CASUAL_LEVEL_1[aqf][i],
  }));
}

/** Level 2.1, 2.2, 3 and 4, with the published casual rate. */
export function hpssOct2026SeniorRows(): RateRow[] {
  return HPSS_OCT_2026_SENIOR.map((r, i) => ({
    label: r.label,
    weekly: r.weekly,
    hourly: r.hourly,
    casualHourly: CASUAL_SENIOR[i],
  }));
}

/** The Level 1 label for an AQF level and year band (0 = 1st year … 3 = 7th year+). */
export function hpssOct2026Label(aqf: HpssAqfLevel, yearBand: 0 | 1 | 2 | 3 = 0): string {
  return HPSS_OCT_2026_LEVEL_1[aqf][yearBand].label;
}

export function hpssOct2026Level1Table(aqf: HpssAqfLevel, id = "level-1"): RateTable {
  return {
    id,
    title: `Health professional level 1 — AQF Level ${aqf}, from 1 October 2026`,
    // How Level 1 pay is set (AQF level and years at Level 1) is in each
    // profession's coverage paragraphs, so the intro does not repeat it.
    intro: `Clause 17.1 as substituted by determination PR814029, AQF Level ${aqf} rows. Casual rates are Schedule C.2.3 exactly.`,
    rows: hpssOct2026Level1Rows(aqf),
  };
}

export function hpssOct2026SeniorTable(): RateTable {
  return {
    id: "levels-2-4",
    title: "Health professional levels 2 to 4, from 1 October 2026",
    // The level definitions are in the row labels and, on each profession's
    // page, in its coverage paragraphs.
    intro: "Clause 17.2 as substituted by PR814029; levels are defined in Schedule A.2. Casual rates are Schedule C.2.3 exactly.",
    rows: hpssOct2026SeniorRows(),
  };
}

/**
 * Level 1 tables for each AQF level listed for the profession (the first gets
 * id "level-1", the rest "level-1-aqf-N"), then Levels 2–4.
 */
export function hpssOct2026Tables(aqfs: HpssAqfLevel | readonly HpssAqfLevel[]): RateTable[] {
  const list = typeof aqfs === "number" ? [aqfs] : aqfs;
  return [
    ...list.map((aqf, i) => hpssOct2026Level1Table(aqf, i === 0 ? "level-1" : `level-1-aqf-${aqf}`)),
    hpssOct2026SeniorTable(),
  ];
}

/**
 * hpssOccupation(), moved onto the 1 October 2026 tables. The headline label
 * must be a row of the first AQF level's table.
 */
export function hpssOct2026Occupation(aqfs: HpssAqfLevel | readonly HpssAqfLevel[], input: HpssOccupationInput): Occupation {
  const base = hpssOccupation(input);
  return {
    ...base,
    award: HPSS_AWARD_OCT_2026,
    tables: hpssOct2026Tables(aqfs),
    sources: [...HPSS_OCT_2026_SOURCES, ...base.sources.slice(1)],
    verifiedOn: HPSS_OCT_2026_VERIFIED_ON,
    ratesFrom: HPSS_OCT_2026_RATES_FROM,
  };
}
