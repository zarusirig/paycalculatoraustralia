// =============================================================================
// Where an annual salary sits among ALL Australian employees (full-time and
// part-time), estimated from the ABS published percentiles.
//
// Source figures: EE_PERCENTILES_ALL in ./index.ts — ABS Employee Earnings,
// August 2025 (released 12 December 2025), weekly earnings in main job, all
// employees: 10th $450, 25th $900, median $1,425, 75th $2,127, 90th $3,000.
// https://www.abs.gov.au/statistics/labour/earnings-and-working-conditions/employee-earnings/aug-2025
// The same table is printed on /average-salary-australia/, so the two pages
// always agree. No figure is typed in here.
//
// The estimate is a straight-line interpolation between the two published
// points either side of the salary's weekly equivalent (annual ÷ 52). It is
// OUR estimate, not an ABS figure, and the page says so. Outside the published
// range (below the 10th or above the 90th percentile) no number is given.
// =============================================================================

import { EE_PERCENTILES_ALL, WEEKS_PER_YEAR } from "./index";

export interface PercentilePoint {
  percentile: number;
  weekly: number;
}

export type PercentilePositionKind = "below-lowest" | "between" | "above-highest";

export interface AllEmployeePlacement {
  /** Annual salary ÷ 52. */
  weekly: number;
  kind: PercentilePositionKind;
  /** Whole-number interpolated percentile, or null outside the published range. */
  estimate: number | null;
  /** Published point at or below the salary (null below the lowest). */
  lower: PercentilePoint | null;
  /** Published point at or above the salary (null above the highest). */
  upper: PercentilePoint | null;
}

export function placeAmongAllEmployees(
  annualSalary: number,
  points: readonly PercentilePoint[] = EE_PERCENTILES_ALL,
): AllEmployeePlacement {
  if (!Number.isFinite(annualSalary) || annualSalary < 0) {
    throw new Error(`placeAmongAllEmployees: expected a non-negative salary, got ${annualSalary}`);
  }
  const weekly = annualSalary / WEEKS_PER_YEAR;
  const first = points[0];
  const last = points[points.length - 1];
  if (weekly < first.weekly) return { weekly, kind: "below-lowest", estimate: null, lower: null, upper: first };
  if (weekly > last.weekly) return { weekly, kind: "above-highest", estimate: null, lower: last, upper: null };
  for (let i = 0; i < points.length - 1; i++) {
    const lo = points[i];
    const hi = points[i + 1];
    if (weekly >= lo.weekly && weekly <= hi.weekly) {
      const share = (weekly - lo.weekly) / (hi.weekly - lo.weekly);
      return {
        weekly,
        kind: "between",
        estimate: Math.round(lo.percentile + share * (hi.percentile - lo.percentile)),
        lower: lo,
        upper: hi,
      };
    }
  }
  // weekly === last.weekly with a single point list.
  return { weekly, kind: "between", estimate: last.percentile, lower: last, upper: last };
}

/** "10th", "21st", "52nd", "73rd". */
export function ordinal(n: number): string {
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`;
  const suffix = n % 10 === 1 ? "st" : n % 10 === 2 ? "nd" : n % 10 === 3 ? "rd" : "th";
  return `${n}${suffix}`;
}
