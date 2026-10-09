// Health Professionals and Support Services Award 2020 [MA000027] — Health
// Professional employee rates from 1 October 2026, for occupation pages that
// have moved onto the new structure (occupational therapist, physiotherapist,
// psychologist).
//
// Source: determination PR814029 (7 September 2026), clauses 17.1 and 17.2
// (weekly and hourly) and Schedule C.2.3 (casual ordinary hours, 125%), read
// 9 October 2026 from
//   https://www.fwc.gov.au/documents/awardsandorders/pdf/pr814029.pdf
// and checked the same day against the FWC consolidated award, which now
// "incorporates all amendments up to and including 1 October 2026 (PR814029)":
//   https://awards.fairwork.gov.au/MA000027.html
// Operative from the first full pay period starting on or after 1 October 2026.
//
// The weekly and hourly figures are the HPSS_OCT_2026_* constants in
// health-professionals-common.ts (identical to the determination); only the
// casual column is added here, so that file is not restructured.
//
// The pre-October pay points (HPSS_TABLES) are NOT current for these
// professions. They survive only as retained minimums under clause J.4.3 for
// employees classified under the award on 30 September 2026.

import {
  HPSS_AWARD,
  HPSS_OCT_2026,
  HPSS_OCT_2026_LEVEL_1,
  HPSS_OCT_2026_SENIOR,
  hpssOccupation,
  type HpssOccupationInput,
} from "./health-professionals-common";
import type { AwardRef, Occupation, RateTable } from "./types";

export const HPSS_OCT_2026_VERIFIED_ON = "9 October 2026";

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

export const HPSS_AWARD_OCT_2026: AwardRef = {
  ...HPSS_AWARD,
  consolidatedTo: "1 October 2026",
};

/** Level 1 (for one AQF level) and Levels 2–4, as RateTables, from 1 October 2026. */
export function hpssOct2026Tables(aqf: HpssAqfLevel): RateTable[] {
  return [
    {
      id: "level-1",
      title: `Health professional level 1 — AQF Level ${aqf}, from 1 October 2026`,
      intro: `Clause 17.1 as substituted by determination PR814029, from the first full pay period starting on or after 1 October 2026. Level 1 pay is set by the AQF level of the profession's standard minimum qualification (Schedule B) and years of experience in the profession at Level 1. Casual rates are Schedule C.2.3 exactly.`,
      rows: HPSS_OCT_2026_LEVEL_1[aqf].map((r, i) => ({
        label: r.label,
        weekly: r.weekly,
        hourly: r.hourly,
        casualHourly: CASUAL_LEVEL_1[aqf][i],
      })),
    },
    {
      id: "levels-2-4",
      title: "Health professional levels 2 to 4, from 1 October 2026",
      intro:
        "Clause 17.2 as substituted by PR814029. Level 2 is a senior clinician, specialist, supervisor or educator (2.1 under 5 years in the role, 2.2 for 5 years or more); level 3 an advanced clinician, senior specialist or section manager; level 4 a manager (Schedule A.2). Casual rates are Schedule C.2.3 exactly.",
      rows: HPSS_OCT_2026_SENIOR.map((r, i) => ({
        label: r.label,
        weekly: r.weekly,
        hourly: r.hourly,
        casualHourly: CASUAL_SENIOR[i],
      })),
    },
  ];
}

/** hpssOccupation(), moved onto the 1 October 2026 tables for a single-AQF-level profession. */
export function hpssOct2026Occupation(aqf: HpssAqfLevel, input: HpssOccupationInput): Occupation {
  const base = hpssOccupation(input);
  return {
    ...base,
    award: HPSS_AWARD_OCT_2026,
    tables: hpssOct2026Tables(aqf),
    sources: [
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
      ...base.sources.slice(1),
    ],
    verifiedOn: HPSS_OCT_2026_VERIFIED_ON,
    ratesFrom: "the first full pay period starting on or after 1 October 2026",
  };
}
