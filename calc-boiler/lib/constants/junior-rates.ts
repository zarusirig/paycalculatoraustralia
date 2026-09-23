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
//
// ⚠️ FAIR WORK PUBLISHES NO WEEKLY JUNIOR FIGURES. Re-verified 28 July 2026:
// the FWO junior table has exactly two columns, "Full time and part-time"
// (hourly) and "Casual". Any weekly junior amount is OUR derivation and must
// be labelled as such on the page. The hourly and casual columns below do
// reproduce FWO's published dollars exactly — see FWO_PUBLISHED_JUNIOR_RATES.
//
// ⚠️ FAIR WORK DOES NOT STATE ITS METHOD. The weekly-then-divide order is
// inferred because it is the only one that reproduces every published figure.
// Attribute the FIGURES to Fair Work; do not attribute the METHODOLOGY.
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

/**
 * Special National Minimum Wage 3.
 *
 * ⚠️ SOURCING, corrected 28 July 2026. The cl 8.2 table has SIX rows and stops
 * at 20. There is NO "21 and over = 100%" row in cl 8.2. The final row below
 * is included because it is what a reader needs, but its authority is cl 4.1
 * — at 21 an employee simply falls out of Special NMW 3 and onto the full
 * National Minimum Wage. Do not attribute that row to cl 8.2.
 *
 * The order's own labels read "Under 16 years of age", "At 16 years of age"
 * and so on; the shorter labels below match the FWO table, not the order.
 */
export const JUNIOR_BANDS: readonly JuniorBand[] = [
  { age: "Under 16", years: 15, percentage: 0.368 },
  { age: "16", years: 16, percentage: 0.473 },
  { age: "17", years: 17, percentage: 0.578 },
  { age: "18", years: 18, percentage: 0.683 },
  { age: "19", years: 19, percentage: 0.825 },
  { age: "20", years: 20, percentage: 0.977 },
  { age: "21 and over", years: 21, percentage: 1 },
] as const;

/** The clause each part of the table actually comes from. */
export const JUNIOR_BANDS_SOURCE = {
  juniorClause: "cl 8.2 (Special National Minimum Wage 3), which stops at age 20",
  adultClause: "cl 4.1 (the National Minimum Wage), which applies from age 21",
} as const;

/**
 * Fair Work Ombudsman's OWN published junior dollars from 1 July 2026,
 * transcribed verbatim 28 July 2026. These exist so the derivation above can
 * be regression-tested against the published figures rather than trusted.
 * FWO publishes hourly only — there is deliberately no weekly column here.
 */
export const FWO_PUBLISHED_JUNIOR_RATES: readonly {
  age: string;
  hourly: number;
  casualHourly: number;
}[] = [
  { age: "Under 16", hourly: 9.73, casualHourly: 12.16 },
  { age: "16", hourly: 12.51, casualHourly: 15.64 },
  { age: "17", hourly: 15.29, casualHourly: 19.11 },
  { age: "18", hourly: 18.06, casualHourly: 22.58 },
  { age: "19", hourly: 21.82, casualHourly: 27.28 },
  { age: "20", hourly: 25.84, casualHourly: 32.30 },
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
    note: "Adult rate at 21. From 1 December 2026, 18 to 20-year-olds with more than 6 months' service move towards it in stages (PR813654).",
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
 * The junior-rate transition for 18 to 20-year-olds under the Retail, Fast
 * Food and Pharmacy awards. DETERMINED, but not yet operative (as of 23 Sep
 * 2026), and NOT a jump to the adult rate.
 *
 * History of this constant:
 *  - 28 July 2026: modelled as the PROVISIONAL view in [2026] FWCFB 75
 *    (31 March 2026, PR798175) — five-point steps every six months.
 *  - 23 Sep 2026: UPDATED after reading the implementation decision
 *    [2026] FWCFB 222 (26 August 2026) and the three determinations it issued,
 *    each read from the determination text itself:
 *      PR813655  General Retail Industry Award 2020, cl 17.2 Table 5
 *      PR813654  Fast Food Industry Award 2020, cl 15.2 Table 4
 *      PR813656  Pharmacy Industry Award 2020, cl 16.2 Table 4
 *    Each "comes into operation on 1 December 2026" and takes effect for an
 *    employee from their first full pay period starting on or after each date.
 *
 * What the determinations actually do:
 *  - Retail and fast food: the provisional schedule was substantially adopted
 *    ([2026] FWCFB 222 [260], [263]) — five percentage points each 1 December
 *    and 1 July until 100%. Retail 20-year-olds with more than 6 months'
 *    service ALREADY get 100%, so retail changes only 18 and 19.
 *  - Pharmacy: a DIFFERENT, consented schedule ([262]) — ten-point annual
 *    steps: 1 Dec 2026, 1 Jul 2027, 1 Jul 2028, 1 Jul 2029. Pharmacy
 *    assistant levels 1 and 2 only.
 *  - Only employees with MORE than 6 months with the employer move. Those
 *    with 6 months or less stay on 70/80/90%. Under-18 rates are unchanged.
 *    Service with an old employer counts on a transfer of business.
 *
 * ⚠️ AFTER 1 DECEMBER 2026: flip `inForce` to true and fold the operative
 * row into the current-rate tables (AWARD_JUNIOR_SCALES here, and
 * RETAIL_JUNIOR_SCALE in hospitality-award.ts), then again at each step.
 */
export type JuniorTransitionRow = { effective: string; age18: number; age19: number; age20: number };

export interface JuniorTransitionSchedule {
  award: string;
  code: string;
  determination: string;
  clause: string;
  /** Classifications the junior scale applies to at all. */
  appliesTo: string;
  /** Current percentages for employees with MORE than 6 months' service. */
  present: { age18: number; age19: number; age20: number };
  rows: readonly JuniorTransitionRow[];
}

/** Retail & fast food: the five-point, six-monthly schedule. */
const SIX_MONTHLY_STEPS: readonly JuniorTransitionRow[] = [
  { effective: "1 December 2026", age18: 75, age19: 85, age20: 95 },
  { effective: "1 July 2027", age18: 80, age19: 90, age20: 100 },
  { effective: "1 December 2027", age18: 85, age19: 95, age20: 100 },
  { effective: "1 July 2028", age18: 90, age19: 100, age20: 100 },
  { effective: "1 December 2028", age18: 95, age19: 100, age20: 100 },
  { effective: "1 July 2029", age18: 100, age19: 100, age20: 100 },
];

export const JUNIOR_TRANSITION_SCHEDULES: Record<"retail" | "fastFood" | "pharmacy", JuniorTransitionSchedule> = {
  retail: {
    award: "General Retail Industry Award 2020",
    code: "MA000004",
    determination: "PR813655",
    clause: "cl 17.2, Table 5",
    appliesTo: "Retail employee levels 1, 2 and 3",
    present: { age18: 70, age19: 80, age20: 100 },
    // Retail 20-year-olds with >6 months already receive 100%.
    rows: SIX_MONTHLY_STEPS.map((r) => ({ ...r, age20: 100 })),
  },
  fastFood: {
    award: "Fast Food Industry Award 2020",
    code: "MA000003",
    determination: "PR813654",
    clause: "cl 15.2, Table 4",
    appliesTo: "All fast food classifications",
    present: { age18: 70, age19: 80, age20: 90 },
    rows: SIX_MONTHLY_STEPS,
  },
  pharmacy: {
    award: "Pharmacy Industry Award 2020",
    code: "MA000012",
    determination: "PR813656",
    clause: "cl 16.2, Table 4",
    appliesTo: "Pharmacy assistants levels 1 and 2",
    present: { age18: 70, age19: 80, age20: 90 },
    rows: [
      { effective: "1 December 2026", age18: 75, age19: 85, age20: 95 },
      { effective: "1 July 2027", age18: 85, age19: 95, age20: 100 },
      { effective: "1 July 2028", age18: 95, age19: 100, age20: 100 },
      { effective: "1 July 2029", age18: 100, age19: 100, age20: 100 },
    ],
  },
};

export const PENDING_JUNIOR_CHANGE = {
  decision: "[2026] FWCFB 75",
  documentReference: "PR798175",
  decidedOn: "31 March 2026",
  implementationDecision: "[2026] FWCFB 222",
  implementationDecidedOn: "26 August 2026",
  application: "AM2024/24",
  applicant: "Shop, Distributive and Allied Employees Association",
  /** The date the determinations come into operation. */
  earliestStart: "1 December 2026",
  awards: ["General Retail Industry Award", "Fast Food Industry Award", "Pharmacy Industry Award"],
  /** Determinations have been made (26 August 2026). */
  determined: true,
  /** Not operative until the first full pay period on or after 1 December 2026. */
  inForce: false,
  isProvisionalView: false,
  serviceQualifier: "more than 6 months with their employer",
  transferOfBusinessNote:
    "Service with the old employer counts towards the 6 months if there has been a transfer of business.",
  underEighteenUnchanged: true,
  /** The determinations' own operative wording — quote this, not a paraphrase. */
  operativeWording:
    "This determination comes into operation on 1 December 2026. In accordance with ss 165(3) and 166(5) of the Fair Work Act 2009 (Cth) this determination does not take effect in relation to a particular employee until the start of the employee's first full pay period that starts on or after 1 December 2026.",
  /**
   * Fast food schedule with a "Present" row, kept for existing consumers.
   * Prefer JUNIOR_TRANSITION_SCHEDULES, which also carries retail and the
   * different pharmacy schedule.
   */
  phaseIn: [{ effective: "Present", age18: 70, age19: 80, age20: 90 }, ...SIX_MONTHLY_STEPS],
} as const;

/**
 * Minimum working age. There is NO national minimum — the Fair Work Ombudsman
 * says so directly: "The minimum age for working depends on the state or
 * territory you're working in."
 *
 * ⚠️ The widely repeated line that "the standard minimum age in Australia is
 * 15" appears only in media and secondary sources. No government page states
 * it. Do not publish it.
 *
 * Transcribed from each jurisdiction's own government page, 28 July 2026.
 * Every jurisdiction separately bars work during school hours under education
 * law, regardless of the employment-law position.
 */
export const MINIMUM_WORKING_AGE: readonly {
  jurisdiction: string;
  summary: string;
  detail: string;
  url: string;
}[] = [
  {
    jurisdiction: "NSW",
    summary: "No minimum age",
    detail:
      "NSW Industrial Relations states there is no minimum legal age to start work. Separate rules apply to under-16s in still photography, modelling, promotional work, performance and public speaking, but not to retail or hospitality.",
    url: "https://www.nsw.gov.au/employment/rights-responsibilities/starting-work",
  },
  {
    jurisdiction: "VIC",
    summary: "13, or 11 for deliveries",
    detail:
      "11 to deliver newspapers and advertising material; 13 for other work including retail and hospitality. No age limit in entertainment. An employer usually needs a licence to employ someone under 15. Work is generally limited to 6am–9pm, 3 hours a day and 12 hours a week during term.",
    url: "https://www.vic.gov.au/child-employment-licence",
  },
  {
    jurisdiction: "QLD",
    summary: "13, or 11 for supervised deliveries",
    detail:
      "13 generally, lowered to 11 for supervised delivery work between 6am and 6pm. No work between 10pm and 6am, and a maximum of 4 hours on a school day.",
    url: "https://www.business.qld.gov.au/running-business/employing/hiring-recruitment/employing-children/restrictions",
  },
  {
    jurisdiction: "WA",
    summary: "No flat minimum — restricted by job type under 15",
    detail:
      "Any age in a family business, professional performance or for a charity. 10–12 may deliver newspapers or advertising material. 13–14 may work in a shop, fast food outlet, cafe or restaurant, or collect trolleys, with written parental permission, outside school hours and between 6am and 10pm.",
    url: "https://www.wa.gov.au/organisation/private-sector-labour-relations/when-children-can-work-western-australia",
  },
  {
    jurisdiction: "SA",
    summary: "No minimum age",
    detail:
      "SafeWork SA states there is no minimum working age in South Australia, so a child of any age may undertake paid employment. Children of compulsory school age cannot be employed during school hours.",
    url: "https://safework.sa.gov.au/workers/wages-and-conditions/minimum-working-age",
  },
  {
    jurisdiction: "TAS",
    summary: "No minimum age",
    detail:
      "Generally no minimum age for casual or part-time work, though age restrictions apply to certain types of work. Work during school hours requires an approved exemption.",
    url: "https://www.decyp.tas.gov.au/learning/primary-school-to-year-12/employment-while-studying/",
  },
  {
    jurisdiction: "ACT",
    summary: "No minimum age stated; hours capped by age",
    detail:
      "ACT government pages set hour limits without stating a floor — no more than 10 hours a week under 15, and daily caps rising from 3 hours under age 3 to 6 hours at ages 12–15.",
    url: "https://www.act.gov.au/community/youth/employing-young-people",
  },
  {
    jurisdiction: "NT",
    summary: "No flat minimum — restricted roles under 15",
    detail:
      "Under 15s are limited to roles such as babysitting, helping in a family business or delivering newspapers. From 15 a wider range of work is allowed. No work during school hours, and none between 10pm and 6am under 15.",
    url: "https://nt.gov.au/learning/student-wellbeing-and-inclusion/school-attendance/school-age-children-in-jobs",
  },
] as const;
