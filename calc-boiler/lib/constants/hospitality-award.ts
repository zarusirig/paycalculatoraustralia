// =============================================================================
// Hospitality Industry (General) Award 2020 (MA000009) and
// General Retail Industry Award 2020 (MA000004).
// Rates operative from the first full pay period starting on or after
// 1 July 2026.
//
// Verified 28 July 2026 against the FWO pay guides (Effective: 01/07/2026,
// Published: 24/06/2026) and the consolidated award texts. Award varied by
// PR799290 ppc 01Jul26. Annual Wage Review 2026 [2026] FWCFB 3500.
//
// ⚠️ THE 4.75% INCREASE IS NOT UNIFORM. It is subject to two floors: $1,004.90
// a week for ongoing employment and $978.10 for an entry-level rate applying
// in the first 6 months. Hospitality Introductory and Level 1 sit EXACTLY on
// those floors — they were lifted to the floor, not escalated by 4.75%.
// Computing FY2026-27 by inflating last year's figures gives wrong numbers.
//
// ⚠️ EVENING AND NIGHT LOADINGS ARE FLAT CASH, NOT PERCENTAGES. Hospitality
// pays ordinary rate + $2.95/hr (evening) or + $4.42/hr (night). Modelling
// them as multipliers is wrong. Retail evening IS a percentage (125%).
//
// ⚠️ CASUAL PENALTIES ARE ADDITIVE, NOT COMPOUNDED. Sunday casual is 175%
// (150% + 25%), not 150% x 1.25 = 187.5%.
//
// ⚠️ CASUAL OVERTIME DIVERGES BETWEEN THE TWO AWARDS. In hospitality the
// casual loading is NOT payable on overtime — clause 28.4 applies to the
// "ordinary hourly rate", which by clause 2 excludes the loading, so casual
// and full-time overtime dollars are identical. In retail the loading IS
// included (175% vs 150%). One shared code path cannot serve both.
//
// ⚠️ BUT "IDENTICAL" IS NOT UNIVERSAL. Re-verified 28 July 2026 against
// Schedule B: B.2.2 (full-time) and B.2.4 (casual) give the same dollars for
// Mon–Fri, weekend and rostered-day-off overtime — Level 1 is 39.66/52.88/52.88
// in both. PUBLIC HOLIDAYS DIVERGE: full-time 225%, casual 250%. Scope the
// claim to Mon–Fri, weekend and RDO overtime only.
//
// ⚠️ RETAIL OVERTIME IS BANDED "MONDAY TO SATURDAY", NOT "WEEKDAY". Table 11
// reads "Monday to Saturday—first 3 hours". Labelling those rows "weekday"
// leaves Saturday overtime undefined. The field names below are historical;
// the display labels are what matter.
// =============================================================================

export const HOSPITALITY_AWARD = {
  name: "Hospitality Industry (General) Award 2020",
  code: "MA000009",
  operativeFrom: "1 July 2026",
  effectiveNote:
    "Applies from the first full pay period starting on or after 1 July 2026.",
  casualLoading: 0.25,
  /** Clause 2: excludes the casual loading, which is why casual OT matches full-time. */
  casualLoadingOnOvertime: false,
  payGuidePublished: "24 June 2026",
  awardTextUrl: "https://awards.fairwork.gov.au/MA000009.html",
  determination: "PR799290",
} as const;

export const RETAIL_AWARD = {
  name: "General Retail Industry Award 2020",
  code: "MA000004",
  operativeFrom: "1 July 2026",
  casualLoading: 0.25,
  /** Retail DOES include the loading in casual overtime. */
  casualLoadingOnOvertime: true,
  awardTextUrl: "https://awards.fairwork.gov.au/MA000004.html",
} as const;

/** Annual Wage Review 2026 floors. Neither is a 4.75% escalation. */
export const AWR_2026_FLOORS = {
  increase: 0.0475,
  ongoingWeekly: 1_004.9,
  ongoingHourly: 26.44,
  entryLevelWeekly: 978.1,
  entryLevelHourly: 25.74,
} as const;

export interface AwardRate {
  level: string;
  weekly: number;
  hourly: number;
}

function parse(raw: string): AwardRate[] {
  return raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const [level, weekly, hourly] = line.split("|");
      if (!level || !weekly || !hourly) {
        throw new Error(`malformed award row: ${JSON.stringify(line)}`);
      }
      return { level, weekly: Number(weekly), hourly: Number(hourly) };
    });
}

/** Hospitality adult full-time and part-time. */
export const HOSPITALITY_RATES = parse(`
Introductory|978.10|25.74
Level 1|1004.90|26.44
Level 2|1029.10|27.08
Level 3|1062.90|27.97
Level 4|1119.10|29.45
Level 5|1189.40|31.30
Level 6|1221.10|32.13
Managerial staff (hotels)|1223.39|32.19
`);

/**
 * Classification to level. NOTE: the food and beverage stream runs grades 1–4
 * only — there is NO grade 5. Level 5 is "food and beverage supervisor".
 * Publishing an F&B grade 5 would be inventing a classification.
 */
export const HOSPITALITY_CLASSIFICATIONS: readonly { title: string; level: string }[] = [
  { title: "Food & beverage attendant grade 1", level: "Level 1" },
  { title: "Food & beverage attendant grade 2", level: "Level 2" },
  { title: "Food & beverage attendant grade 3", level: "Level 3" },
  { title: "Food & beverage attendant (tradesperson) grade 4", level: "Level 4" },
  { title: "Food & beverage supervisor", level: "Level 5" },
  { title: "Cook grade 1", level: "Level 2" },
  { title: "Cook grade 2", level: "Level 3" },
  { title: "Cook (tradesperson) grade 3", level: "Level 4" },
  { title: "Cook (tradesperson) grade 4", level: "Level 5" },
  { title: "Cook (tradesperson) grade 5", level: "Level 6" },
  { title: "Kitchen attendant grade 1", level: "Level 1" },
  { title: "Kitchen attendant grade 2", level: "Level 2" },
  { title: "Kitchen attendant grade 3", level: "Level 3" },
] as const;

/**
 * Public holiday overtime, where the "casual overtime equals full-time
 * overtime" rule does NOT hold. Schedule B.2.2 vs B.2.4.
 */
export const HOSPITALITY_PUBLIC_HOLIDAY_OVERTIME = {
  fullTime: 2.25,
  casual: 2.5,
} as const;

/** Hospitality penalties, award Table 14 (cl 29.2(b)). Casual is additive. */
export const HOSPITALITY_PENALTIES = {
  saturday: 1.25,
  sunday: 1.5,
  publicHoliday: 2.25,
  casualSaturday: 1.5,
  casualSunday: 1.75,
  casualPublicHoliday: 2.5,
  /** Flat cash per hour, NOT multipliers. */
  eveningPerHour: 2.95,
  nightPerHour: 4.42,
  /**
   * cl 29.3(b): where more than one penalty applies, only the highest is paid.
   * cl 29.3(c) carves out the clause 16 Breaks penalty, which IS payable in
   * addition. Verified 28 July 2026.
   */
  cumulative: false,
  highestOnlyException: "The clause 16 Breaks penalty is payable in addition to the highest applicable penalty rate (cl 29.3(c)).",
} as const;

/** Hospitality overtime, award Table 13 (cl 28.4). Same dollars for casuals. */
export const HOSPITALITY_OVERTIME = {
  weekdayFirst2Hours: 1.5,
  weekdayAfter2Hours: 2.0,
  weekend: 2.0,
  rosteredDayOff: 2.0,
} as const;

/**
 * Hospitality junior scale, award Table 5 (cl 18.4(a)) — employees other than
 * office employees. Note 19 is 85%, where retail is 80%.
 *
 * Juniors with a trade qualification, or who are liquor service employees,
 * must be paid the ADULT rate regardless of age.
 */
export const HOSPITALITY_JUNIOR_SCALE: readonly { age: string; percentage: number }[] = [
  { age: "Under 17", percentage: 0.5 },
  { age: "17", percentage: 0.6 },
  { age: "18", percentage: 0.7 },
  { age: "19", percentage: 0.85 },
  { age: "20 and over", percentage: 1 },
] as const;

/** Award Table 6 — junior OFFICE employees, a different scale again. */
export const HOSPITALITY_JUNIOR_OFFICE_SCALE: readonly { age: string; percentage: number }[] = [
  { age: "Under 16", percentage: 0.45 },
  { age: "16", percentage: 0.55 },
  { age: "17", percentage: 0.65 },
  { age: "18", percentage: 0.75 },
  { age: "19", percentage: 0.9 },
  { age: "20 and over", percentage: 1 },
] as const;

/**
 * Sourcing note, verified 28 July 2026: the AWARD states only the liquor limb
 * (cl 13.5, "Junior employees working as liquor service employees must be paid
 * as an adult"). The trade-qualification limb appears in the FWO Pay Guide,
 * not in those terms in the award. Attribute accordingly.
 */
export const HOSPITALITY_JUNIOR_ADULT_RATE_EXCEPTIONS =
  "Junior employees with a trade qualification, or who are liquor service employees, must be paid the adult rate.";
export const HOSPITALITY_JUNIOR_ADULT_RATE_SOURCE =
  "The liquor service rule is award clause 13.5; the trade-qualification rule is stated in the Fair Work Ombudsman pay guide.";

/** General Retail adult rates, levels 1–8. */
export const RETAIL_RATES = parse(`
Level 1|1056.80|27.81
Level 2|1081.00|28.45
Level 3|1097.80|28.89
Level 4|1119.10|29.45
Level 5|1165.10|30.66
Level 6|1182.10|31.11
Level 7|1241.40|32.67
Level 8|1291.80|33.99
`);

/** Retail penalties for non-shiftworkers. Evening IS a percentage here. */
export const RETAIL_PENALTIES = {
  eveningAfter6pm: 1.25,
  saturday: 1.25,
  sunday: 1.5,
  publicHoliday: 2.25,
  casualEveningAfter6pm: 1.5,
  casualSaturday: 1.5,
  casualSunday: 1.75,
  casualPublicHoliday: 2.5,
} as const;

/** Retail overtime. Unlike hospitality, casual rates include the loading. */
export const RETAIL_OVERTIME = {
  weekdayFirst3Hours: 1.5,
  weekdayAfter3Hours: 2.0,
  sunday: 2.0,
  publicHoliday: 2.5,
  casualWeekdayFirst3Hours: 1.75,
  casualWeekdayAfter3Hours: 2.25,
  casualSunday: 2.25,
  casualPublicHoliday: 2.75,
} as const;

/**
 * Retail junior scale, cl 17.2 Table 5. Published for levels 1–3 only.
 * Note the 20-year-old band splits on length of service, and 19 is 80% where
 * hospitality is 85%.
 */
export const RETAIL_JUNIOR_SCALE: readonly { age: string; percentage: number }[] = [
  { age: "Under 16", percentage: 0.45 },
  { age: "16", percentage: 0.5 },
  { age: "17", percentage: 0.6 },
  { age: "18", percentage: 0.7 },
  { age: "19", percentage: 0.8 },
  { age: "20 (6 months or less)", percentage: 0.9 },
  { age: "20 (more than 6 months)", percentage: 1 },
] as const;

/** Not extracted; do not publish without further verification. */
export const AWARD_UNVERIFIED = [
  "Hospitality apprentice rates",
  "Retail shiftworker rates and baking production early-morning/night rates",
  "Casino stream penalty detail",
  "Loaded rate arrangements (hospitality cl 24) — produce different results from the standard tables",
] as const;

/**
 * NOT a gap — a substantive award rule, corrected 28 July 2026. Retail junior
 * percentages are confined to levels 1–3 by the award itself (cl 17.2: "a
 * junior employee, who is classified as a retail employee level 1, 2 or 3"),
 * not by a Fair Work publishing choice. A junior classified at level 4 or
 * above is paid the full rate for that classification.
 */
export const RETAIL_JUNIOR_LEVEL_RESTRICTION =
  "Junior rates apply only to retail employee levels 1, 2 and 3 (cl 17.2). A junior classified at level 4 or above receives the full adult rate for that classification.";

/**
 * The managerial (hotels) weekly and hourly figures come from the FWO pay
 * guide. The award itself sets a minimum ANNUAL salary of $63,617 (cl 18.2)
 * and publishes only hourly loadings in Schedule B.5.1 — it never states
 * $1,223.39. Cite the pay guide, not the award, for that weekly rate.
 */
export const HOSPITALITY_MANAGERIAL_SOURCE = {
  weeklyIsPayGuideOnly: true,
  awardAnnualSalary: 63_617,
  awardClause: "cl 18.2",
} as const;

/** Determinations giving effect to the 2026 review, by award. */
export const AWARD_DETERMINATIONS = {
  hospitality: "PR799290",
  retail: "PR799285",
} as const;
