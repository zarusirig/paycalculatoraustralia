// =============================================================================
// Occupation median index — "jobs that pay about $X" on /take-home-pay-on/N/.
//
// One measure only: the Jobs and Skills Australia occupation-profile median
// full-time weekly earnings (ABS Survey of Employee Earnings and Hours, May
// 2025) × 52. It covers more of the site's occupations than the ATO
// Taxation statistics medians do (79 pages against 18), and it is a full-time
// figure, so it can sit next to a full-time salary. Award minimums are never
// mixed in.
//
// Nothing is typed in here: every entry is read from the occupation data the
// /job-pay-rates/ pages already publish (lib/data/job-pay-rates and
// lib/data/health-salary), so the index cannot disagree with those pages.
// Pages that share an ANZSCO unit group share one entry, labelled with the
// group, because JSA publishes one median per group.
// =============================================================================

import { calculatePayBreakdown } from "../../constants/australian-tax";
import { OCCUPATIONS } from "../job-pay-rates";
import { HEALTH_SALARY_PAGES } from "../health-salary";

export const MEDIAN_SOURCE_NAME = "Jobs and Skills Australia";
/** ABS Survey of Employee Earnings and Hours reference period behind every JSA median here. */
export const MEDIAN_SOURCE_PERIOD = "May 2025";
export const MEDIAN_SOURCE_SURVEY = "ABS Survey of Employee Earnings and Hours";

export interface OccupationMedianPage {
  /** The site's job title, e.g. "Electrician". */
  name: string;
  /** Route on this site, always trailing-slashed. */
  href: string;
}

export interface OccupationMedian {
  /** ANZSCO unit group code, e.g. "3411". Unique in the index. */
  anzscoCode: string;
  /** ANZSCO unit group title exactly as JSA prints it. */
  anzscoTitle: string;
  /** Median full-time weekly earnings before tax, whole dollars. */
  medianWeekly: number;
  /** medianWeekly × 52. */
  annual: number;
  /** The JSA occupation profile the figure was read from. */
  sourceUrl: string;
  sourceName: typeof MEDIAN_SOURCE_NAME;
  sourcePeriod: typeof MEDIAN_SOURCE_PERIOD;
  /** This site's pages for occupations in the group. */
  pages: OccupationMedianPage[];
}

function build(): OccupationMedian[] {
  const byCode = new Map<string, OccupationMedian>();
  const add = (
    code: string,
    title: string,
    weekly: number,
    url: string,
    page: OccupationMedianPage,
  ) => {
    const existing = byCode.get(code);
    if (existing) {
      if (existing.medianWeekly !== weekly) {
        throw new Error(`occupation-medians: ANZSCO ${code} has two medians (${existing.medianWeekly}, ${weekly})`);
      }
      existing.pages.push(page);
      return;
    }
    byCode.set(code, {
      anzscoCode: code,
      anzscoTitle: title,
      medianWeekly: weekly,
      annual: weekly * 52,
      sourceUrl: url,
      sourceName: MEDIAN_SOURCE_NAME,
      sourcePeriod: MEDIAN_SOURCE_PERIOD,
      pages: [page],
    });
  };

  for (const occ of OCCUPATIONS) {
    if (!occ.median) continue;
    add(occ.median.anzscoCode, occ.median.anzscoTitle, occ.median.medianWeekly, occ.median.url, {
      name: occ.name,
      href: `/job-pay-rates/${occ.slug}/`,
    });
  }
  for (const page of HEALTH_SALARY_PAGES) {
    if (!page.jsa) continue;
    add(page.jsa.anzscoCode, page.jsa.anzscoTitle, page.jsa.medianWeekly, page.jsa.url, {
      name: page.name,
      href: `/job-pay-rates/${page.slug}/`,
    });
  }
  return [...byCode.values()].sort((a, b) => a.annual - b.annual || a.anzscoTitle.localeCompare(b.anzscoTitle));
}

/** Every occupation group with a JSA median, lowest annual figure first. */
export const OCCUPATION_MEDIANS: readonly OccupationMedian[] = build();

/** Number of the site's occupation pages the index covers. */
export const OCCUPATION_MEDIAN_PAGE_COUNT = OCCUPATION_MEDIANS.reduce((n, o) => n + o.pages.length, 0);

export interface NearbyOccupation extends OccupationMedian {
  /** annual − salary: positive when the median is above the salary. */
  diff: number;
  /** Take-home a fortnight on the median, same engine and assumptions as the salary pages (no HECS). */
  fortnightlyTakeHome: number;
}

/**
 * The occupation groups whose median is closest to `salary`: every group
 * within 10% of it, at least `min` and at most `max`, nearest first (ties go
 * to the lower figure).
 */
export function occupationsNear(salary: number, min = 3, max = 6): NearbyOccupation[] {
  const ranked = [...OCCUPATION_MEDIANS].sort(
    (a, b) => Math.abs(a.annual - salary) - Math.abs(b.annual - salary) || a.annual - b.annual,
  );
  const within = ranked.filter((o) => Math.abs(o.annual - salary) <= salary * 0.1).length;
  const n = Math.min(max, Math.max(min, within));
  return ranked.slice(0, n).map((o) => ({
    ...o,
    diff: o.annual - salary,
    fortnightlyTakeHome: calculatePayBreakdown({ grossSalary: o.annual }).fortnightly,
  }));
}

/** An ANZSCO title for mid-sentence use: lower case, acronyms such as "ICT" kept. */
export function groupName(title: string): string {
  return title
    .split(" ")
    .map((w) => (/^[A-Z]{2,}$/.test(w) ? w : w.toLowerCase()))
    .join(" ");
}

/** How many groups have a median below, and above, a salary. */
export function medianRank(salary: number): { below: number; above: number; total: number } {
  const below = OCCUPATION_MEDIANS.filter((o) => o.annual < salary).length;
  const above = OCCUPATION_MEDIANS.filter((o) => o.annual > salary).length;
  return { below, above, total: OCCUPATION_MEDIANS.length };
}
