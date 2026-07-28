// =============================================================================
// Junior pay rates — award/agreement-free employees
//
// Source: National Minimum Wage Order 2026 (PR799279, made 19 June 2026,
// Hatcher P), cl 4.1 and cl 8.2, and the Fair Work Ombudsman's published
// junior table. Verified 28 July 2026.
//
// EFFECTIVE DATE NUANCE. The order takes effect for an employee "from the start
// of the employee's first full pay period that starts on or after 1 July 2026"
// (cl 2.1). It is NOT universally 1 July, and the page says so.
//
// ROUNDING — this is the part that is easy to get wrong.
// Fair Work applies the junior percentage to the WEEKLY rate and then divides
// by 38. Applying it to the hourly rate instead is out by a cent at ages 17, 19
// and 20:
//
//   age 17   57.8% x 1,004.90 / 38 = 15.29    57.8% x 26.44 = 15.28  WRONG
//   age 19   82.5% x 1,004.90 / 38 = 21.82    82.5% x 26.44 = 21.81  WRONG
//   age 20   97.7% x 1,004.90 / 38 = 25.84    97.7% x 26.44 = 25.83  WRONG
//
// The casual rate is then the ROUNDED junior hourly x 1.25, rounded half up.
// Deriving it from the unrounded figure loses a cent at 19 (27.27 vs 27.28).
// Both behaviours are asserted in tests against Fair Work's published dollars.
// =============================================================================

import { EMPLOYMENT } from "./australian-tax";

/** The order these rates derive from, for citation on the page. */
export const NMW_ORDER = {
  citation: "National Minimum Wage Order 2026",
  reference: "PR799279",
  decision: "[2026] FWCFB 3500",
  madeOn: "19 June 2026",
  operativeFrom: "1 July 2026",
  url: "https://www.fwc.gov.au/documents/awardsandorders/pdf/pr799279.pdf",
} as const;

/** Casual loading for award/agreement-free employees. NMW Order 2026 cl 5.1. */
export const CASUAL_LOADING = 0.25;

/** Age at which the full adult National Minimum Wage applies. */
export const ADULT_AGE = 21;

export interface JuniorBand {
  /** Age label as Fair Work publishes it. */
  age: string;
  /** Sort key — the age in years; 15 stands in for "under 16". */
  years: number;
  /** Percentage of the adult rate, NMW Order 2026 cl 8.2. */
  percentage: number;
}

/** NMW Order 2026 cl 8.2 — Special National Minimum Wage 3. */
export const JUNIOR_BANDS: readonly JuniorBand[] = [
  { age: "Under 16", years: 15, percentage: 0.368 },
  { age: "16", years: 16, percentage: 0.473 },
  { age: "17", years: 17, percentage: 0.578 },
  { age: "18", years: 18, percentage: 0.683 },
  { age: "19", years: 19, percentage: 0.825 },
  { age: "20", years: 20, percentage: 0.977 },
  { age: "21 and over", years: 21, percentage: 1 },
] as const;

/** Round half up to the cent, matching Fair Work's published figures. */
function roundCents(value: number): number {
  return Math.round(value * 100 + Number.EPSILON) / 100;
}

/**
 * Junior hourly rate. Derived from the WEEKLY minimum divided by standard
 * hours — not from the hourly minimum. See the rounding note above.
 */
export function juniorHourlyRate(percentage: number): number {
  const weekly = EMPLOYMENT.minimumWageWeekly * percentage;
  return roundCents(weekly / EMPLOYMENT.standardWeeklyHours);
}

/** Junior weekly rate — the percentage applied to the weekly minimum. */
export function juniorWeeklyRate(percentage: number): number {
  return roundCents(EMPLOYMENT.minimumWageWeekly * percentage);
}

/**
 * Junior casual hourly rate. The ROUNDED junior hourly rate plus the 25%
 * loading — deriving from the unrounded rate is a cent light at age 19.
 */
export function juniorCasualHourlyRate(percentage: number): number {
  return roundCents(juniorHourlyRate(percentage) * (1 + CASUAL_LOADING));
}

export interface JuniorRateRow extends JuniorBand {
  weekly: number;
  hourly: number;
  casualHourly: number;
}

/** The full published table, computed once. */
export const JUNIOR_RATES: readonly JuniorRateRow[] = JUNIOR_BANDS.map((band) => ({
  ...band,
  weekly: juniorWeeklyRate(band.percentage),
  hourly: juniorHourlyRate(band.percentage),
  casualHourly: juniorCasualHourlyRate(band.percentage),
}));

/**
 * Awards set their own junior scales, applied to the award classification rate
 * rather than to the National Minimum Wage. These are quoted verbatim from the
 * award texts and exist to make the point that there is no single national
 * junior scale — Retail and Fast Food differ from each other at under-16.
 */
export const AWARD_JUNIOR_SCALES = [
  {
    award: "General Retail Industry Award",
    code: "MA000004",
    clause: "cl 17.2, Table 5",
    note: "Retail employee levels 1–3 only. Adult rate at 20 with more than 6 months' service.",
    scale: [
      { age: "Under 16", percentage: 0.45 },
      { age: "16", percentage: 0.5 },
      { age: "17", percentage: 0.6 },
      { age: "18", percentage: 0.7 },
      { age: "19", percentage: 0.8 },
      { age: "20 (6 months or less)", percentage: 0.9 },
      { age: "20 (more than 6 months)", percentage: 1 },
    ],
  },
  {
    award: "Fast Food Industry Award",
    code: "MA000003",
    clause: "Table 4",
    note: "Adult rate at 21.",
    scale: [
      { age: "Under 16", percentage: 0.4 },
      { age: "16", percentage: 0.5 },
      { age: "17", percentage: 0.6 },
      { age: "18", percentage: 0.7 },
      { age: "19", percentage: 0.8 },
      { age: "20", percentage: 0.9 },
      { age: "21", percentage: 1 },
    ],
  },
  {
    award: "Hair and Beauty Industry Award",
    code: "MA000005",
    clause: "Table 5",
    note: "Adult rate at 18 — the earliest of any common award.",
    scale: [
      { age: "Under 17", percentage: 0.5 },
      { age: "17", percentage: 0.75 },
      { age: "18 and over", percentage: 1 },
    ],
  },
] as const;

/**
 * A scheduled review point, not current law. FWC decision [2026] FWCFB 75
 * (Junior rates application AM2024/24) would give 18–20 year olds under the
 * Retail, Fast Food and Pharmacy awards the adult rate after 6 months'
 * employment. Fair Work says it "could" start 1 December 2026, with further
 * hearings on timing. Under-18 rates are unchanged. Do not present as in force.
 */
export const PENDING_JUNIOR_CHANGE = {
  decision: "[2026] FWCFB 75",
  application: "AM2024/24",
  earliestStart: "1 December 2026",
  awards: ["General Retail Industry Award", "Fast Food Industry Award", "Pharmacy Industry Award"],
  inForce: false,
} as const;
