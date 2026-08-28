// =============================================================================
// Nurses Award 2020 [MA000034] — the federal safety net.
//
// Read on 28 August 2026 from the Fair Work Ombudsman's consolidated award
// text, https://awards.fairwork.gov.au/MA000034.html. Both weekly and hourly
// rates below are printed by the award itself; neither is derived here.
//
// THE THING MOST PAGES GET WRONG ABOUT THIS AWARD
// ------------------------------------------------
// The Nurses Award is a FLOOR, not a pay scale. Almost nobody working in a
// state public hospital is paid these rates: every state public health system
// has an enterprise or certified agreement that pays well above them, and the
// award only bites where no agreement applies — private hospitals, GP clinics,
// aged care and agency work that is not covered by an agreement. Publishing an
// award rate as "what a nurse earns in <state>" would understate a public
// hospital nurse's pay by tens of thousands of dollars a year.
//
// TWO RATE STREAMS, NOT ONE
// -------------------------
// Since the aged care work value case the award has carried two separate sets
// of minimum rates: "other than aged care employees" (clause 15.1) and "aged
// care employees" (clause 15.3). The aged care rates are materially higher for
// the same nominal level. Quoting one set as "the Nurses Award rate" without
// saying which stream is a real error, so both are published here.
//
// Operative dates differ between the streams and are recorded per block.
// =============================================================================

import type { AwardScale, RateSource } from "./types";

export const NURSES_AWARD = {
  name: "Nurses Award 2020",
  code: "MA000034",
  /** Clause 15.1 — employees other than aged care employees. */
  generalRatesFrom: "1 July 2026",
  generalDetermination: "PR799315",
  /** Clause 15.3 — aged care employees. Varied again after the general rates. */
  agedCareRatesFrom: "1 August 2026",
  agedCareDetermination: "PR812118",
  standardWeeklyHours: 38,
  casualLoading: 0.25,
  verifiedOn: "28 August 2026",
} as const;

export const NURSES_AWARD_SOURCES: readonly RateSource[] = [
  {
    title: "Nurses Award 2020 [MA000034] — consolidated award text",
    url: "https://awards.fairwork.gov.au/MA000034.html",
    publisher: "Fair Work Ombudsman",
  },
  {
    title: "Work value case — nurses and midwives (AM2024/11)",
    url: "https://www.fwc.gov.au/hearings-decisions/major-cases/work-value-case-nurses-and-midwives",
    publisher: "Fair Work Commission",
  },
] as const;

/**
 * Clause 15.1 — minimum rates for employees OTHER THAN aged care employees,
 * operative from 1 July 2026 (PR799315).
 */
export const NURSES_AWARD_GENERAL: readonly AwardScale[] = [
  {
    classification: "Nursing assistant",
    points: [
      { label: "1st year", weekly: 1050.7, hourly: 27.65 },
      { label: "2nd year", weekly: 1067.3, hourly: 28.09 },
      { label: "3rd year and thereafter", weekly: 1084.4, hourly: 28.54 },
      { label: "Experienced (holder of a relevant certificate III)", weekly: 1119.1, hourly: 29.45 },
    ],
  },
  {
    classification: "Enrolled nurse",
    points: [
      { label: "Pay point 1", weekly: 1139.9, hourly: 30.0 },
      { label: "Pay point 2", weekly: 1155.0, hourly: 30.39 },
      { label: "Pay point 3", weekly: 1170.4, hourly: 30.8 },
      { label: "Pay point 4", weekly: 1187.2, hourly: 31.24 },
      { label: "Pay point 5", weekly: 1199.2, hourly: 31.56 },
    ],
    note: "Student enrolled nurse rates sit below this scale: $976.20 a week under 21, $1,024.70 a week at 21 and over.",
  },
  {
    classification: "Registered nurse — level 1",
    points: [
      { label: "Pay point 1", weekly: 1219.5, hourly: 32.09 },
      { label: "Pay point 2", weekly: 1244.5, hourly: 32.75 },
      { label: "Pay point 3", weekly: 1275.0, hourly: 33.55 },
      { label: "Pay point 4", weekly: 1309.0, hourly: 34.45 },
      { label: "Pay point 5", weekly: 1349.2, hourly: 35.51 },
      { label: "Pay point 6", weekly: 1388.1, hourly: 36.53 },
      { label: "Pay point 7", weekly: 1428.3, hourly: 37.59 },
      { label: "Pay point 8 and thereafter", weekly: 1465.5, hourly: 38.57 },
    ],
    note: "A 4-year degree entrant starts at $1,273.40 a week and a masters entrant at $1,317.20, then moves to pay point 4 and pay point 5 respectively.",
  },
  {
    classification: "Registered nurse — level 2",
    points: [
      { label: "Pay point 1", weekly: 1504.4, hourly: 39.59 },
      { label: "Pay point 2", weekly: 1528.3, hourly: 40.22 },
      { label: "Pay point 3", weekly: 1554.8, hourly: 40.92 },
      { label: "Pay point 4 and thereafter", weekly: 1580.3, hourly: 41.59 },
    ],
  },
  {
    classification: "Registered nurse — level 3",
    points: [
      { label: "Pay point 1", weekly: 1631.2, hourly: 42.93 },
      { label: "Pay point 2", weekly: 1661.1, hourly: 43.71 },
      { label: "Pay point 3", weekly: 1689.8, hourly: 44.47 },
      { label: "Pay point 4 and thereafter", weekly: 1720.1, hourly: 45.27 },
    ],
  },
  {
    classification: "Registered nurse — level 4",
    points: [
      { label: "Grade 1", weekly: 1861.7, hourly: 48.99 },
      { label: "Grade 2", weekly: 1995.1, hourly: 52.5 },
      { label: "Grade 3", weekly: 2111.6, hourly: 55.57 },
    ],
  },
  {
    classification: "Registered nurse — level 5",
    points: [
      { label: "Grade 1", weekly: 1878.6, hourly: 49.44 },
      { label: "Grade 2", weekly: 1978.4, hourly: 52.06 },
      { label: "Grade 3", weekly: 2111.6, hourly: 55.57 },
      { label: "Grade 4", weekly: 2243.1, hourly: 59.03 },
      { label: "Grade 5", weekly: 2474.1, hourly: 65.11 },
      { label: "Grade 6", weekly: 2706.9, hourly: 71.23 },
    ],
  },
  {
    classification: "Nurse practitioner",
    points: [
      { label: "1st year", weekly: 1877.0, hourly: 49.39 },
      { label: "2nd year", weekly: 1932.7, hourly: 50.86 },
    ],
  },
] as const;

/**
 * Clause 15.3 — minimum rates for AGED CARE employees, operative from
 * 1 August 2026 (PR812118 for the enrolled and registered nurse tables,
 * PR799315 for the student and nurse practitioner tables).
 */
export const NURSES_AWARD_AGED_CARE: readonly AwardScale[] = [
  {
    classification: "Enrolled nurse — aged care",
    points: [
      { label: "Enrolled nurse supervising other direct care employees", weekly: 1542.0, hourly: 40.58 },
    ],
    note: "Student enrolled nurse rates sit below this: $1,122.60 a week under 21, $1,178.30 at 21 and over.",
  },
  {
    classification: "Registered nurse — aged care level 1",
    points: [
      { label: "First year at this level", weekly: 1571.6, hourly: 41.36 },
      { label: "Over 1 and up to 4 years at this level", weekly: 1654.3, hourly: 43.53 },
      { label: "Over 4 years at this level", weekly: 1801.1, hourly: 47.4 },
    ],
  },
  {
    classification: "Registered nurse — aged care level 2",
    points: [
      { label: "First 3 years at this level", weekly: 1947.7, hourly: 51.26 },
      { label: "Over 3 years at this level", weekly: 2046.0, hourly: 53.84 },
    ],
  },
  {
    classification: "Registered nurse — aged care levels 3 to 5",
    points: [
      { label: "Level 3", weekly: 2094.2, hourly: 55.11 },
      { label: "Level 4", weekly: 2390.3, hourly: 62.9 },
      { label: "Level 5", weekly: 2711.3, hourly: 71.35 },
    ],
  },
  {
    classification: "Nurse practitioner — aged care",
    points: [
      { label: "1st year", weekly: 2158.6, hourly: 56.81 },
      { label: "2nd year", weekly: 2222.7, hourly: 58.49 },
    ],
  },
] as const;

/** Clauses 20 and 21 — shiftwork loadings and weekend penalty rates. */
export const NURSES_AWARD_PENALTIES = [
  { label: "Afternoon shift, Monday to Friday", value: "+12.5%", note: "Shift starting at or after 12 noon and finishing after 6.00 pm (clause 20.1(a))." },
  { label: "Night shift, Monday to Friday", value: "+15%", note: "Shift starting at or after 6.00 pm and finishing before 7.30 am (clause 20.1(b))." },
  { label: "Saturday ordinary hours", value: "150%", note: "Midnight Friday to midnight Saturday (clause 21.1)." },
  { label: "Sunday ordinary hours", value: "175%", note: "Midnight Saturday to midnight Sunday (clause 21.2)." },
  { label: "Casual loading", value: "+25%", note: "Shift loadings are worked out on the minimum hourly rate, then the casual loading is added to the penalty rate (clause 11.4)." },
] as const;

/**
 * Deliberately not published. Each would need its own verification pass and a
 * guess here would be worse than the gap.
 */
export const NURSES_AWARD_UNVERIFIED: readonly string[] = [
  "Occupational health nurse levels 1 to 3 (clause 15.1(e))",
  "Schedule B summary of hourly rates, including overtime and public holiday multipliers",
  "Schedule C monetary allowances",
  "Schedule F classification translation rates for employees classified as aged care nurses on 28 February 2025",
] as const;
