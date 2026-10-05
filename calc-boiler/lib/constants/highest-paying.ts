// =============================================================================
// Highest paying jobs (/highest-paying-jobs-australia/) — a ranking of the
// occupations this site covers by median full-time weekly earnings, with what
// each pays after tax.
//
// This file defines NO figure of its own. The median is the Jobs and Skills
// Australia occupation-profile median read for each occupation page in
// lib/data/job-pay-rates/ (ABS Survey of Employee Earnings and Hours, May 2025;
// MEDIAN_DEFINITION: median weekly pay of full-time, non-managerial adult
// employees before tax and salary sacrifice). The after-tax figure is
// afterTax() in the same module, which runs the site's 2026-27 resident tax
// engine, the same one behind /take-home-pay-on/N/.
//
// Scope is deliberately payslip-shaped: "what does this occupation's median
// worker earn, and what lands in the bank". It is not career advice and it
// ranks only the occupations we publish award pages for, so it is a ranking of
// those, not of every job in Australia.
// =============================================================================

import { OCCUPATIONS, afterTax, annualFromWeekly, nearestTakeHomeAmount, takeHomeHref } from "../data/job-pay-rates";
import { ALL_OCCUPATIONS_MEDIAN_WEEKLY, JOB_PAY_VERIFIED_ON, MEDIAN_DEFINITION } from "../data/job-pay-rates/common";

export { ALL_OCCUPATIONS_MEDIAN_WEEKLY, JOB_PAY_VERIFIED_ON, MEDIAN_DEFINITION };

export const HIGHEST_PAYING_VERIFIED_ON = "5 October 2026";

export interface RankedJob {
  rank: number;
  slug: string;
  name: string;
  /** ANZSCO occupation group the median is for (several pages can share one). */
  anzscoTitle: string;
  medianWeekly: number;
  medianHourly: number;
  /** Median weekly × 52, whole dollars. */
  annualGross: number;
  annualNet: number;
  netWeekly: number;
  tax: number;
  /** Closest published /take-home-pay-on/N/ page and its amount. */
  takeHomeHref: string;
  takeHomeAmount: number;
  /** Median as a multiple of the all-occupations median. */
  vsAllOccupations: number;
  /** Another page covers the same ANZSCO group, so the two share a median. */
  sharesMedianWith: string[];
}

/** Occupations with a published median, highest first. Ties keep the registry order. */
export function rankedJobs(): RankedJob[] {
  const withMedian = OCCUPATIONS.filter((o) => o.median !== null);
  const byGroup = new Map<string, string[]>();
  for (const o of withMedian) {
    const key = o.median!.anzscoCode;
    byGroup.set(key, [...(byGroup.get(key) ?? []), o.name]);
  }
  const sorted = withMedian
    .map((o, i) => ({ o, i }))
    .sort((a, b) => b.o.median!.medianWeekly - a.o.median!.medianWeekly || a.i - b.i);
  return sorted.map(({ o }, idx) => {
    const m = o.median!;
    const gross = annualFromWeekly(m.medianWeekly);
    const at = afterTax(gross);
    return {
      rank: idx + 1,
      slug: o.slug,
      name: o.name,
      anzscoTitle: m.anzscoTitle,
      medianWeekly: m.medianWeekly,
      medianHourly: m.medianHourly,
      annualGross: gross,
      annualNet: at.netAnnual,
      netWeekly: at.netWeekly,
      tax: at.tax + at.medicare,
      takeHomeHref: takeHomeHref(gross),
      takeHomeAmount: nearestTakeHomeAmount(gross),
      vsAllOccupations: Math.round((m.medianWeekly / ALL_OCCUPATIONS_MEDIAN_WEEKLY) * 100) / 100,
      sharesMedianWith: (byGroup.get(m.anzscoCode) ?? []).filter((n) => n !== o.name),
    };
  });
}
