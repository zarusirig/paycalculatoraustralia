// =============================================================================
// SCHADS — Social, Community, Home Care and Disability Services Industry Award
// 2010 (MA000100). Rates operative from the first full pay period starting on
// or after 1 July 2026.
//
// Verified 28 July 2026 against TWO independent Fair Work artefacts that agree
// to the cent:
//   - FWO Pay Guide MA000100, effective 01/07/2026, published 24/06/2026
//   - FWO consolidated award text, https://awards.fairwork.gov.au/MA000100.html
// Annual Wage Review 2026 [2026] FWCFB 3500; determination PR799380.
//
// ⚠️ THE EQUAL REMUNERATION ORDER IS NOT OPTIONAL.
// Clause 15 of the award lists a "minimum weekly wage" — Level 4 pay point 1
// reads $1,344.50. Equal Remuneration Order PR525485 then applies on top for
// Schedule B (SACS) and Schedule C (Crisis Accommodation) classifications, and
// the award's own NOTE 2 says the ERO rates "form employees' ordinary rates of
// pay for all purposes." The operative Level 4 pp1 rate is $1,774.74.
//
// Publishing the clause 15 figure alone understates SACS pay substantially.
//
// ⚠️ THE ERO TABLES START AT LEVEL 2, NOT LEVEL 1. Re-verified 28 July 2026
// against the consolidated award and against PR799380 item 9 — both ERO tables
// open with "Social and community services employee level 2 | 15.2". Level 1
// has NO ERO row and receives NO uplift. The Level 1 rates below are the plain
// clause 15.1 minimum wages, which are also the operative rates. Describing
// them as "ERO-inclusive" is wrong.
//
// ⚠️ $1,119.10 IS TWO DIFFERENT THINGS. It is the operative Level 1 pay point 3
// rate, AND it is the pre-ERO clause 15 figure for Level 2 pay point 1, which
// becomes $1,376.49 once the ERO applies. Same number, ~$257/week apart in
// meaning. This is the likeliest way a SCHADS rate table goes wrong.
//
// TWO NEGATIVE FINDINGS, both deliberate:
//   - SCHADS contains NO junior rates. The word "junior" appears twice in the
//     whole award, both in transitional boilerplate. Any age-percentage table
//     attributed to this award is fabricated.
//   - There is NO separate "disability services" pay stream. Clause 17 was
//     deleted by PR995399 on 26 March 2010. Disability work sits in either
//     Schedule B (SACS) or Schedule E (home care — disability care).
// =============================================================================

export const SCHADS_AWARD = {
  name: "Social, Community, Home Care and Disability Services Industry Award 2010",
  code: "MA000100",
  operativeFrom: "1 July 2026",
  effectiveNote:
    "Applies from the first full pay period starting on or after 1 July 2026, not universally 1 July.",
  increase: 0.0475,
  casualLoading: 0.25,
  standardWeeklyHours: 38,
  payGuidePublished: "24 June 2026",
  awardTextUrl: "https://awards.fairwork.gov.au/MA000100.html",
  eroReference: "PR525485",
  determination: "PR799380",
  decision: "[2026] FWCFB 3500",
  /** SCHADS has no junior rates clause. Asserted in tests. */
  hasJuniorRates: false,
  /**
   * The ERO tables in clause 15 begin at Level 2. Level 1 gets no uplift.
   * Verified against the consolidated award and PR799380 item 9.
   */
  eroLowestLevel: 2,
  /**
   * Clause 34.2(a) says "double time and a half", not "250%". The percentage
   * is arithmetic, not the award's wording — quote the phrase when citing it.
   */
  publicHolidayAwardWording: "double time and a half",
  /**
   * Trainee rates are not in this award: clause 19.2 incorporates Schedule E
   * of the Miscellaneous Award 2020 by reference. Relevant when asserting the
   * no-junior-rates negative, since that is the only age-linked route in.
   */
  traineeRatesSource: "Schedule E of the Miscellaneous Award 2020, incorporated by cl 19.2",
} as const;

/**
 * Social and Community Services stream (Schedule B) — operative rates.
 * Levels 2–8 are ERO-inclusive; Level 1 carries no ERO uplift (see header).
 * Format: classification|weekly|hourly
 * Hourly is weekly ÷ 38 as published by Fair Work.
 */
export const SCHADS_SACS_RAW = `
Level 1 pay point 1|1046.90|27.55
Level 1 pay point 2|1080.60|28.44
Level 1 pay point 3|1119.10|29.45
Level 2 pay point 1|1376.49|36.22
Level 2 pay point 2|1419.79|37.36
Level 2 pay point 3|1462.96|38.50
Level 2 pay point 4|1501.95|39.53
Level 3 pay point 1|1538.59|40.49
Level 3 pay point 2|1582.94|41.66
Level 3 pay point 3|1616.71|42.55
Level 3 pay point 4|1649.97|43.42
Level 4 pay point 1|1774.74|46.70
Level 4 pay point 2|1821.07|47.92
Level 4 pay point 3|1867.93|49.16
Level 4 pay point 4|1909.51|50.25
Level 5 pay point 1|2030.20|53.43
Level 5 pay point 2|2073.91|54.58
Level 5 pay point 3|2122.13|55.85
Level 6 pay point 1|2218.02|58.37
Level 6 pay point 2|2267.02|59.66
Level 6 pay point 3|2316.16|60.95
Level 7 pay point 1|2398.95|63.13
Level 7 pay point 2|2449.36|64.46
Level 7 pay point 3|2499.20|65.77
Level 8 pay point 1|2602.75|68.49
Level 8 pay point 2|2653.94|69.84
Level 8 pay point 3|2705.27|71.19
`;

/** Home care — disability care (Schedule E). No ERO uplift. */
export const SCHADS_HOME_CARE_DISABILITY_RAW = `
Level 1 pay point 1|1036.80|27.28
Level 2 pay point 1|1096.60|28.86
Level 2 pay point 2|1104.10|29.06
Level 3 pay point 1|1119.10|29.45
Level 3 pay point 2|1153.70|30.36
Level 4 pay point 1|1221.00|32.13
Level 4 pay point 2|1245.40|32.77
Level 5 pay point 1|1309.20|34.45
Level 5 pay point 2|1360.80|35.81
`;

/** Home care — aged care (Schedule F). No pay points. */
export const SCHADS_HOME_CARE_AGED_RAW = `
Level 1 Introductory|1239.00|32.61
Level 2 Home carer|1307.80|34.42
Level 3 Qualified|1376.70|36.23
Level 4 Senior|1431.70|37.68
Level 5 Specialist|1486.80|39.13
Level 6 Team leader|1541.90|40.58
`;

export interface SchadsRate {
  classification: string;
  weekly: number;
  hourly: number;
}

export function parseSchadsRates(raw: string): SchadsRate[] {
  return raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const [classification, weekly, hourly] = line.split("|");
      if (!classification || !weekly || !hourly) {
        throw new Error(`malformed SCHADS row: ${JSON.stringify(line)}`);
      }
      return { classification, weekly: Number(weekly), hourly: Number(hourly) };
    });
}

export const SCHADS_SACS = parseSchadsRates(SCHADS_SACS_RAW);
export const SCHADS_HOME_CARE_DISABILITY = parseSchadsRates(SCHADS_HOME_CARE_DISABILITY_RAW);
export const SCHADS_HOME_CARE_AGED = parseSchadsRates(SCHADS_HOME_CARE_AGED_RAW);

/**
 * Penalty multipliers. Award clauses 26.1, 26.4, 29.2, 29.3, 34.2.
 * Weekend rates SUBSTITUTE for shift loadings rather than adding to them
 * (cl 26.2), and public holiday payment replaces both (cl 34.2(b)).
 */
export const SCHADS_PENALTIES = {
  saturday: 1.5,
  sunday: 2.0,
  publicHoliday: 2.5,
  afternoonShiftLoading: 0.125,
  nightShiftLoading: 0.15,
  casualSaturday: 1.75,
  casualSunday: 2.25,
  casualPublicHoliday: 2.75,
  substitutionNote:
    "Weekend rates are in substitution for, not cumulative upon, shift loadings (cl 26.2).",
} as const;

/** Allowances, from the FWO Pay Guide effective 1 July 2026. */
export const SCHADS_ALLOWANCES = {
  /** cl 25.7(d): 4.9% of the standard rate ($1,283.10) per sleepover. */
  sleepover: 62.87,
  brokenShiftOneBreak: 21.81,
  brokenShiftTwoBreaks: 28.87,
  firstAidWeekly: 21.43,
  firstAidHourly: 0.56,
  laundryPerShift: 0.33,
  laundryWeeklyMax: 1.53,
  mealOvertime: 17.30,
  onCallWeekday: 25.66,
  onCallOtherOrPublicHoliday: 50.81,
  uniformPerShift: 1.26,
  uniformWeeklyMax: 6.41,
  vehiclePerKm: 1.01,
} as const;

/**
 * Not extracted, and not to be published without further verification:
 *  - National Training Wage (cl 19, Schedule I) trainee rate tables
 *  - Schedule G translation rates for home care aged-care employees covered on
 *    or before 31 Dec 2024, and ex-Nurses Award transferees via PR779152
 *  - Queensland non-constitutional-corporation transitional pay equity orders,
 *    which the Pay Guide explicitly excludes
 *  - Crisis Accommodation (Schedule C) and Family Day Care (Schedule D) streams
 */
export const SCHADS_UNVERIFIED = [
  "National Training Wage (Schedule I) trainee rates",
  "Schedule G classification translation rates",
  "Queensland non-constitutional corporation transitional arrangements",
  "Crisis Accommodation and Family Day Care streams",
] as const;
