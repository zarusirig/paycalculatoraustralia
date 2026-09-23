// =============================================================================
// National Minimum Wage, minimum wage by age, pro-rata and casual loading.
//
// Consumers: /minimum-wage-australia/, /minimum-wage-by-age/[age]/,
// /minimum-wage-history-australia/, /junior-pay-rates/,
// /pro-rata-salary-calculator/ and /casual-loading-calculator/.
//
// SOURCES, verified 23 Sep 2026:
//   - Annual Wage Review 2026, [2026] FWCFB 3500 (2 June 2026), read from the
//     decision itself. [4]: "The NMW will be increased to $1004.90 per week, or
//     $26.44 per hour … This increase will take effect from 1 July 2026."
//     [139]: the casual loading for award/agreement-free employees "will remain
//     at 25 per cent". [143]: the order takes effect "from the start of the
//     employee's first full pay period on or after 1 July 2026". [141]: the real
//     wage gap may be closed "in the 2027 Review".
//   - Fair Work Ombudsman / FWC media: "$24.95 to $26.44 per hour, $948.00 to
//     $1,004.90 per 38-hour week".
//   - Fast Food Industry Award 2020 (MA000003), consolidated to 1 July 2026
//     (PR799280, PR799284, PR799442), read from awards.fairwork.gov.au on
//     23 Sep 2026: cl 15.1 Table 3 Level 1 = $1,056.80 / $27.81, and the
//     Schedule A.3.2 / A.3.4 junior Level 1 dollars used as test anchors.
//
// Every dollar figure here is DERIVED from EMPLOYMENT (australian-tax.ts),
// JUNIOR_RATES (junior-rates.ts), the award constants (hospitality-award.ts)
// and FAST_FOOD_LEVEL_1 below.
// Nothing is re-keyed, so a July refresh of those files flows through.
//
// ⚠️ THE 18–20 JUNIOR TRANSITION IS A PHASE-IN, NOT AN ADULT-RATE JUMP. It
// was determined on 26 Aug 2026 (PR813655 / PR813654 / PR813656) and starts
// 1 Dec 2026. See JUNIOR_TRANSITION_SCHEDULES in junior-rates.ts. Until then
// the spokes show today's rates as current and the 1 Dec 2026 step as coming.
// =============================================================================

import { EMPLOYMENT, SUPER_GUARANTEE } from "./australian-tax";
import {
  AWARD_JUNIOR_SCALES,
  CASUAL_LOADING,
  JUNIOR_RATES,
  JUNIOR_TRANSITION_SCHEDULES,
  PENDING_JUNIOR_CHANGE,
  type JuniorRateRow,
} from "./junior-rates";
import {
  AWR_2026_FLOORS,
  HOSPITALITY_JUNIOR_SCALE,
  HOSPITALITY_RATES,
  RETAIL_JUNIOR_SCALE,
  RETAIL_RATES,
} from "./hospitality-award";

/** Round half up to the cent. */
export function roundCents(value: number): number {
  return Math.round(value * 100 + Number.EPSILON) / 100;
}

// ---------------------------------------------------------------------------
// National Minimum Wage
// ---------------------------------------------------------------------------

export const NMW_DECISION = {
  name: "Annual Wage Review 2026",
  citation: "[2026] FWCFB 3500",
  decidedOn: "2 June 2026",
  operativeFrom: "1 July 2026",
  operativeNote:
    "Applies from the start of the employee's first full pay period on or after 1 July 2026.",
  /** The decision itself refers to "the 2027 Review" ([141]). */
  nextReview: "Annual Wage Review 2027",
  /** s 286/287 Fair Work Act: review outcomes operate from 1 July. */
  nextReviewOperativeFrom: "1 July 2027",
  awardIncrease: AWR_2026_FLOORS.increase,
  entryLevelHourly: AWR_2026_FLOORS.entryLevelHourly,
  entryLevelWeekly: AWR_2026_FLOORS.entryLevelWeekly,
} as const;

/**
 * WA State Minimum Wage (adults 21+), for WA state-system employees only —
 * sole traders, partnerships, some trusts and other non-corporate employers.
 * 2026 State Wage Case (WAIRC): +4.75% to $998.30 a week from 1 July 2026.
 * Source: wa.gov.au announcement, 17 June 2026, and smallbusiness.wa.gov.au
 * ("$998.30 per week or $26.27 per hour"), verified 23 Sep 2026.
 */
export const WA_STATE_MINIMUM_WAGE = {
  weekly: 998.3,
  hourly: 26.27,
  increase: 0.0475,
  operativeFrom: "1 July 2026",
  setBy: "Western Australian Industrial Relations Commission (2026 State Wage Case)",
  url: "https://www.wa.gov.au/government/announcements/wa-award-and-minimum-rates-of-pay-increase-1-july-2026",
} as const;

export const NMW = {
  hourly: EMPLOYMENT.minimumWageHourly,
  weekly: EMPLOYMENT.minimumWageWeekly,
  /** Weekly x 52, matching the site-wide 52-week convention. */
  annual: roundCents(EMPLOYMENT.minimumWageWeekly * EMPLOYMENT.weeksPerYear),
  fortnightly: roundCents(EMPLOYMENT.minimumWageWeekly * 2),
  casualHourly: roundCents(EMPLOYMENT.minimumWageHourly * (1 + CASUAL_LOADING)),
  previousHourly: EMPLOYMENT.minimumWageHourlyPrevious,
  previousWeekly: EMPLOYMENT.minimumWageWeeklyPrevious,
  /** Increase on the weekly rate, e.g. 0.06 for 6.0%. */
  increase: EMPLOYMENT.minimumWageWeekly / EMPLOYMENT.minimumWageWeeklyPrevious - 1,
  hoursPerWeek: EMPLOYMENT.standardWeeklyHours,
} as const;

/**
 * National Minimum Wage by financial year, adult rate, 38-hour week.
 * Source: each year's National Minimum Wage Order / Annual Wage Review.
 * `published` is the increase as the Commission announced it (rounded, and
 * 2022 was a flat $40 a week); the computed `increase` is tested against it.
 */
export const NMW_HISTORY_RAW: readonly { fy: string; operativeFrom: string; published: string | null; hourly: number; weekly: number }[] = [
  { fy: "2010-11", operativeFrom: "1 Jul 2010", published: null, hourly: 15.0, weekly: 569.9 },
  { fy: "2011-12", operativeFrom: "1 Jul 2011", published: "3.4%", hourly: 15.51, weekly: 589.3 },
  { fy: "2012-13", operativeFrom: "1 Jul 2012", published: "2.9%", hourly: 15.96, weekly: 606.4 },
  { fy: "2013-14", operativeFrom: "1 Jul 2013", published: "2.6%", hourly: 16.37, weekly: 622.2 },
  { fy: "2014-15", operativeFrom: "1 Jul 2014", published: "3.0%", hourly: 16.87, weekly: 640.9 },
  { fy: "2015-16", operativeFrom: "1 Jul 2015", published: "2.5%", hourly: 17.29, weekly: 656.9 },
  { fy: "2016-17", operativeFrom: "1 Jul 2016", published: "2.4%", hourly: 17.7, weekly: 672.7 },
  { fy: "2017-18", operativeFrom: "1 Jul 2017", published: "3.3%", hourly: 18.29, weekly: 694.9 },
  { fy: "2018-19", operativeFrom: "1 Jul 2018", published: "3.5%", hourly: 18.93, weekly: 719.2 },
  { fy: "2019-20", operativeFrom: "1 Jul 2019", published: "3.0%", hourly: 19.49, weekly: 740.8 },
  { fy: "2020-21", operativeFrom: "1 Jul 2020", published: "1.75%", hourly: 19.84, weekly: 753.8 },
  { fy: "2021-22", operativeFrom: "1 Jul 2021", published: "2.5%", hourly: 20.33, weekly: 772.6 },
  { fy: "2022-23", operativeFrom: "1 Jul 2022", published: "5.2%", hourly: 21.38, weekly: 812.6 },
  { fy: "2023-24", operativeFrom: "1 Jul 2023", published: "8.6%", hourly: 23.23, weekly: 882.8 },
  { fy: "2024-25", operativeFrom: "1 Jul 2024", published: "3.75%", hourly: 24.1, weekly: 915.9 },
  { fy: "2025-26", operativeFrom: "1 Jul 2025", published: "3.5%", hourly: EMPLOYMENT.minimumWageHourlyPrevious, weekly: EMPLOYMENT.minimumWageWeeklyPrevious },
  { fy: "2026-27", operativeFrom: "1 Jul 2026", published: "6.0%", hourly: EMPLOYMENT.minimumWageHourly, weekly: EMPLOYMENT.minimumWageWeekly },
];

export interface NmwHistoryRow {
  fy: string;
  operativeFrom: string;
  published: string | null;
  hourly: number;
  weekly: number;
  /** Increase on the previous year's weekly rate; null for the first row. */
  increase: number | null;
}

export const NMW_HISTORY: readonly NmwHistoryRow[] = NMW_HISTORY_RAW.map((row, i, all) => ({
  ...row,
  increase: i === 0 ? null : row.weekly / all[i - 1].weekly - 1,
}));

/** Format an increase to one decimal place, or two where the second is non-zero (1.75%). */
export function formatIncrease(v: number): string {
  const pct = v * 100;
  const two = Math.round(pct * 100) / 100;
  return Math.abs(two * 10 - Math.round(two * 10)) < 1e-9 ? `${two.toFixed(1)}%` : `${two.toFixed(2)}%`;
}

// ---------------------------------------------------------------------------
// Minimum wage by age — the /minimum-wage-by-age/[age]/ spokes
// ---------------------------------------------------------------------------

/**
 * Ages with their own spoke. 13 and under are left to the hub: GSC shows
 * negligible demand (33 impressions in 28 days) and the rate is the same
 * under-16 band as 14 and 15.
 */
export const MIN_WAGE_AGES = [14, 15, 16, 17, 18, 19, 20] as const;
export type MinWageAge = (typeof MIN_WAGE_AGES)[number];

export function isMinWageAge(n: number): n is MinWageAge {
  return (MIN_WAGE_AGES as readonly number[]).includes(n);
}

/** Hours a week shown on every spoke — typical after-school casual loads. */
export const SPOKE_HOURS = [10, 15, 20] as const;

export interface AwardBandForAge {
  award: string;
  code: string;
  href: string | null;
  /** Band label exactly as the award publishes it. */
  band: string;
  percentage: number;
  /** Adult classification the percentage is applied to, or null if no dollar figure is published. */
  adultLevel: string | null;
  adultWeekly: number | null;
  hourly: number | null;
  casualHourly: number | null;
}

const RETAIL_L1 = RETAIL_RATES.find((r) => r.level === "Level 1")!;
const HOSP_L1 = HOSPITALITY_RATES.find((r) => r.level === "Level 1")!;
const FAST_FOOD = AWARD_JUNIOR_SCALES.find((a) => a.code === "MA000003")!;

/**
 * Fast Food Industry Award 2020, cl 15.1 Table 3, from 1 July 2026 (PR799284).
 * Only Level 1 is carried — it is the classification most juniors start on.
 */
export const FAST_FOOD_LEVEL_1 = {
  award: "Fast Food Industry Award 2020",
  code: "MA000003",
  level: "Fast Food Employee Level 1",
  weekly: 1_056.8,
  hourly: 27.81,
  clause: "cl 15.1, Table 3",
  variedBy: "PR799284",
  awardTextUrl: "https://awards.fairwork.gov.au/MA000003.html",
} as const;

/**
 * Schedule A.3.2 (full-time/part-time) and A.3.4 (casual) junior Level 1
 * dollars as the award itself prints them — regression anchors only.
 */
export const FAST_FOOD_PUBLISHED_JUNIOR_L1: readonly { age: string; hourly: number; casualHourly: number }[] = [
  { age: "Under 16", hourly: 11.12, casualHourly: 13.9 },
  { age: "16", hourly: 13.91, casualHourly: 17.39 },
  { age: "17", hourly: 16.69, casualHourly: 20.86 },
  { age: "18", hourly: 19.47, casualHourly: 24.34 },
  { age: "19", hourly: 22.25, casualHourly: 27.81 },
  { age: "20", hourly: 25.03, casualHourly: 31.29 },
];

/** Junior hourly on an award: percentage of the WEEKLY rate, then / 38. */
export function awardJuniorHourly(adultWeekly: number, percentage: number): number {
  return roundCents((adultWeekly * percentage) / EMPLOYMENT.standardWeeklyHours);
}

function withDollars(
  base: Omit<AwardBandForAge, "hourly" | "casualHourly">,
): AwardBandForAge {
  if (base.adultWeekly == null) return { ...base, hourly: null, casualHourly: null };
  const hourly = awardJuniorHourly(base.adultWeekly, base.percentage);
  return { ...base, hourly, casualHourly: roundCents(hourly * (1 + CASUAL_LOADING)) };
}

/** The National Minimum Wage junior row for an age (under 16 covers 14 and 15). */
export function nmwRowForAge(age: MinWageAge): JuniorRateRow {
  const label = age < 16 ? "Under 16" : String(age);
  return JUNIOR_RATES.find((r) => r.age === label)!;
}

/** Retail, fast food and hospitality junior bands for an age. Retail splits at 20. */
export function awardBandsForAge(age: MinWageAge): AwardBandForAge[] {
  const retailLabels =
    age < 16 ? ["Under 16"] : age === 20 ? ["20 (6 months or less)", "20 (more than 6 months)"] : [String(age)];
  const retail = retailLabels.map((label) => {
    const band = RETAIL_JUNIOR_SCALE.find((b) => b.age === label)!;
    return withDollars({
      award: "General Retail Industry Award",
      code: "MA000004",
      href: "/retail-award-rates/",
      band: band.age,
      percentage: band.percentage,
      adultLevel: "Retail Employee Level 1",
      adultWeekly: RETAIL_L1.weekly,
    });
  });

  const ffLabel = age < 16 ? "Under 16" : String(age);
  const ffBand = FAST_FOOD.scale.find((b) => b.age === ffLabel)!;
  const fastFood = withDollars({
    award: "Fast Food Industry Award",
    code: "MA000003",
    href: null,
    band: ffBand.age,
    percentage: ffBand.percentage,
    adultLevel: FAST_FOOD_LEVEL_1.level,
    adultWeekly: FAST_FOOD_LEVEL_1.weekly,
  });

  const hospLabel = age < 17 ? "Under 17" : age >= 20 ? "20 and over" : String(age);
  const hospBand = HOSPITALITY_JUNIOR_SCALE.find((b) => b.age === hospLabel)!;
  const hospitality = withDollars({
    award: "Hospitality Industry (General) Award",
    code: "MA000009",
    href: "/hospitality-award-rates/",
    band: hospBand.age,
    percentage: hospBand.percentage,
    adultLevel: "Level 1",
    adultWeekly: HOSP_L1.weekly,
  });

  return [...retail, fastFood, hospitality];
}

export interface TransitionForAge {
  key: "retail" | "fastFood" | "pharmacy";
  award: string;
  code: string;
  determination: string;
  /** Current % for an employee with more than 6 months' service. */
  present: number;
  /** % from the first full pay period on or after 1 December 2026. */
  firstStep: number;
  firstStepDate: string;
  /** First date the adult rate (100%) applies. */
  fullAdultFrom: string;
  /** Every step for this age, from 1 December 2026. */
  steps: readonly { effective: string; percentage: number }[];
}

/**
 * The determined 18–20 transition (PR813655 / PR813654 / PR813656) for this
 * age, per award. Under-18s: null (unchanged). Awards where the age already
 * gets 100% (retail at 20 with >6 months) are omitted.
 */
export function pendingChangeForAge(age: MinWageAge): TransitionForAge[] | null {
  if (age < 18) return null;
  const key = `age${age}` as "age18" | "age19" | "age20";
  const out: TransitionForAge[] = [];
  for (const k of ["retail", "fastFood", "pharmacy"] as const) {
    const sch = JUNIOR_TRANSITION_SCHEDULES[k];
    if (sch.present[key] === 100) continue;
    const steps = sch.rows.map((r) => ({ effective: r.effective, percentage: r[key] }));
    out.push({
      key: k,
      award: sch.award,
      code: sch.code,
      determination: sch.determination,
      present: sch.present[key],
      firstStep: steps[0].percentage,
      firstStepDate: PENDING_JUNIOR_CHANGE.earliestStart,
      fullAdultFrom: steps.find((st) => st.percentage === 100)!.effective,
      steps,
    });
  }
  return out;
}

/** Gross pay for a week at an hourly rate. */
export function weeklyPay(hourly: number, hours: number): number {
  return roundCents(hourly * hours);
}

// ---------------------------------------------------------------------------
// Pro-rata salary
// ---------------------------------------------------------------------------

export interface ProRataInput {
  /** Full-time equivalent (FTE) annual salary. */
  fteSalary: number;
  mode: "hours" | "days";
  hoursPerWeek: number;
  /** Full-time hours for the role. NES maximum is 38; some agreements use 35–40. */
  fullTimeHours: number;
  daysPerWeek: number;
  fullTimeDays: number;
  /** Months of the year worked, for a part-year pro-rata. 1–12. */
  monthsWorked: number;
}

export interface ProRataResult {
  /** Fraction of full time, e.g. 0.6. Capped at 1. */
  fraction: number;
  /** Annual salary for the part-time load over a full year. */
  annualSalary: number;
  /** annualSalary x monthsWorked / 12 — what is actually paid in the year. */
  payableSalary: number;
  weekly: number;
  fortnightly: number;
  monthly: number;
  /** The FTE hourly rate, which pro-rating does not change. */
  hourlyRate: number;
}

export const PRO_RATA_DEFAULTS: ProRataInput = {
  fteSalary: 80_000,
  mode: "hours",
  hoursPerWeek: 22.8,
  fullTimeHours: EMPLOYMENT.standardWeeklyHours,
  daysPerWeek: 3,
  fullTimeDays: 5,
  monthsWorked: 12,
};

export function calculateProRata(input: ProRataInput): ProRataResult {
  const fte = Math.max(0, input.fteSalary);
  const ftHours = input.fullTimeHours > 0 ? input.fullTimeHours : EMPLOYMENT.standardWeeklyHours;
  const ftDays = input.fullTimeDays > 0 ? input.fullTimeDays : 5;
  const raw =
    input.mode === "hours"
      ? Math.max(0, input.hoursPerWeek) / ftHours
      : Math.max(0, input.daysPerWeek) / ftDays;
  const fraction = Math.min(1, raw);
  const months = Math.min(12, Math.max(0, input.monthsWorked));
  const annualSalary = roundCents(fte * fraction);
  return {
    fraction,
    annualSalary,
    payableSalary: roundCents((annualSalary * months) / 12),
    weekly: roundCents(annualSalary / EMPLOYMENT.weeksPerYear),
    fortnightly: roundCents(annualSalary / 26),
    monthly: roundCents(annualSalary / 12),
    hourlyRate: roundCents(fte / (ftHours * EMPLOYMENT.weeksPerYear)),
  };
}

// ---------------------------------------------------------------------------
// Casual loading
// ---------------------------------------------------------------------------

/** NES annual leave for a non-shiftworker, in weeks of ordinary hours. */
export const NES_ANNUAL_LEAVE_WEEKS = EMPLOYMENT.annualLeaveWeeks;
/** NES paid personal/carer's leave: 10 days a year = 2 weeks of ordinary hours. */
export const NES_PERSONAL_LEAVE_DAYS = EMPLOYMENT.personalLeaveDays;
/** Annual leave loading is an AWARD entitlement (commonly 17.5%), not an NES one. */
export const COMMON_LEAVE_LOADING = 0.175;

export interface CasualComparisonInput {
  /** Permanent (base) ordinary hourly rate. */
  baseHourly: number;
  hoursPerWeek: number;
  /** Casual loading as a fraction. 0.25 under the NMW order and most awards. */
  loading: number;
  /** Personal leave days a permanent employee would actually take (0–10). */
  sickDaysUsed: number;
  /** Whether the award pays annual leave loading on the 4 weeks. */
  leaveLoading: boolean;
}

export interface CasualComparisonResult {
  casualHourly: number;
  permanentWeekly: number;
  casualWeekly: number;
  /** Weeks actually worked in the year by either employee. */
  weeksWorked: number;
  /** Permanent: paid 52 weeks including leave (plus any leave loading). */
  permanentAnnual: number;
  /** Casual: paid only for the weeks actually worked. */
  casualAnnual: number;
  /** casualAnnual − permanentAnnual. Positive = casual earns more. */
  difference: number;
  /** Value of paid annual leave (4 weeks) plus leave loading if any. */
  annualLeaveValue: number;
  /** Value of the personal leave days actually used. */
  personalLeaveValue: number;
  /** The loading at which casual and permanent pay the same for the same work. */
  breakEvenLoading: number;
  permanentSuper: number;
  casualSuper: number;
}

export const CASUAL_DEFAULTS: CasualComparisonInput = {
  baseHourly: EMPLOYMENT.minimumWageHourly,
  hoursPerWeek: EMPLOYMENT.standardWeeklyHours,
  loading: CASUAL_LOADING,
  sickDaysUsed: 5,
  leaveLoading: false,
};

/**
 * Same hours, same weeks off. Both employees take 4 weeks' holiday and the
 * permanent employee's sick days off; the permanent one is paid for them and
 * the casual is not. Public holidays are left out (they depend on the roster)
 * and are noted on the page instead.
 */
export function compareCasualPermanent(input: CasualComparisonInput): CasualComparisonResult {
  const base = Math.max(0, input.baseHourly);
  const hours = Math.max(0, input.hoursPerWeek);
  const sickDays = Math.min(NES_PERSONAL_LEAVE_DAYS, Math.max(0, input.sickDaysUsed));
  const sickWeeks = sickDays / 5;

  const casualHourly = roundCents(base * (1 + Math.max(0, input.loading)));
  const permanentWeekly = roundCents(base * hours);
  const casualWeekly = roundCents(casualHourly * hours);
  const weeksWorked = EMPLOYMENT.weeksPerYear - NES_ANNUAL_LEAVE_WEEKS - sickWeeks;

  const leaveLoadingValue = input.leaveLoading ? permanentWeekly * NES_ANNUAL_LEAVE_WEEKS * COMMON_LEAVE_LOADING : 0;
  const annualLeaveValue = roundCents(permanentWeekly * NES_ANNUAL_LEAVE_WEEKS + leaveLoadingValue);
  const personalLeaveValue = roundCents(permanentWeekly * sickWeeks);
  const permanentAnnual = roundCents(permanentWeekly * EMPLOYMENT.weeksPerYear + leaveLoadingValue);
  const casualAnnual = roundCents(casualWeekly * weeksWorked);

  const workedValueAtBase = permanentWeekly * weeksWorked;
  const breakEvenLoading = workedValueAtBase > 0 ? permanentAnnual / workedValueAtBase - 1 : 0;

  return {
    casualHourly,
    permanentWeekly,
    casualWeekly,
    weeksWorked,
    permanentAnnual,
    casualAnnual,
    difference: roundCents(casualAnnual - permanentAnnual),
    annualLeaveValue,
    personalLeaveValue,
    breakEvenLoading,
    // Super is paid on ordinary time earnings, which include the casual
    // loading. The ATO treats annual leave loading as OTE unless it is
    // attributable to lost overtime (SGR 2009/2), so it is included here.
    permanentSuper: roundCents(permanentAnnual * SUPER_GUARANTEE.rate),
    casualSuper: roundCents(casualAnnual * SUPER_GUARANTEE.rate),
  };
}
