// =============================================================================
// Occupation medians near a salary — for /tax-on/[salary]/ (10 Oct 2026).
//
// Reads the median full-time weekly pay already verified on each
// /job-pay-rates/<occupation>/ page (lib/data/job-pay-rates: Jobs and Skills
// Australia occupation profiles, from the ABS Survey of Employee Earnings and
// Hours, May 2025; see MEDIAN_DEFINITION there). Nothing is typed in here:
// annual = weekly × 52, the same conversion the job pages use.
//
// Also the adult full-time award minimums printed in those pages' rate
// tables (Fair Work modern awards; rowAnnual: the award's own annual salary
// where it sets one, else weekly × 52). Junior, apprentice and
// below-minimum-wage tables are left out.
// =============================================================================

import { OCCUPATIONS, annualFromWeekly, rowAnnual } from "../job-pay-rates/index";

export interface OccupationMedian {
  slug: string;
  name: string;
  anzscoCode: string;
  anzscoTitle: string;
  weekly: number;
  annual: number;
  /** Jobs and Skills Australia profile the figure was read from. */
  url: string;
  /** This site's page for the occupation. */
  href: string;
}

/** Every occupation with a published median, sorted by annual value then name. */
export function occupationMedians(): OccupationMedian[] {
  return OCCUPATIONS.filter((o) => o.median !== null)
    .map((o) => ({
      slug: o.slug,
      name: o.name,
      anzscoCode: o.median!.anzscoCode,
      anzscoTitle: o.median!.anzscoTitle,
      weekly: o.median!.medianWeekly,
      annual: annualFromWeekly(o.median!.medianWeekly),
      url: o.median!.url,
      href: `/job-pay-rates/${o.slug}/`,
    }))
    .sort((a, b) => a.annual - b.annual || a.name.localeCompare(b.name));
}

/**
 * Occupations whose median rounds to `salary` on a grid of `step`. On the
 * $5,000 tax-on grid each occupation appears on exactly one page.
 */
export function occupationMediansRoundingTo(salary: number, step = 5_000): OccupationMedian[] {
  return occupationMedians().filter((o) => Math.round(o.annual / step) * step === salary);
}

/** Nearest occupation median strictly below and strictly above a salary. */
export function nearestOccupationMedians(salary: number): { below: OccupationMedian | null; above: OccupationMedian | null } {
  const all = occupationMedians();
  const below = all.filter((o) => o.annual < salary);
  const above = all.filter((o) => o.annual > salary);
  return { below: below.length ? below[below.length - 1] : null, above: above.length ? above[0] : null };
}

export interface AwardMinimum {
  /** Award code + classification, unique. */
  id: string;
  award: string;
  awardCode: string;
  classification: string;
  annual: number;
  /** The award page when the site has one, else the first occupation page that prints the row. */
  href: string;
}

/** Every adult full-time award classification printed on a job page, de-duplicated, sorted by annual. */
export function awardMinimums(): AwardMinimum[] {
  const seen = new Map<string, AwardMinimum>();
  for (const o of OCCUPATIONS) {
    if (!o.award) continue;
    for (const t of o.tables) {
      if (t.belowMinimumWage || /junior|apprentice|trainee/i.test(`${t.id} ${t.title}`)) continue;
      for (const r of t.rows) {
        const id = `${o.award.code}|${r.label}`;
        if (seen.has(id)) continue;
        seen.set(id, {
          id,
          award: o.award.name,
          awardCode: o.award.code,
          classification: r.label,
          annual: rowAnnual(r),
          href: o.award.awardPageHref ?? `/job-pay-rates/${o.slug}/`,
        });
      }
    }
  }
  return [...seen.values()].sort((a, b) => a.annual - b.annual || a.id.localeCompare(b.id));
}

/**
 * Up to `max` award minimums that round to `salary` on a grid of `step`,
 * closest first but at most one per award, returned in salary order.
 */
export function awardMinimumsRoundingTo(salary: number, step = 5_000, max = 6): AwardMinimum[] {
  const hits = awardMinimums()
    .filter((a) => Math.round(a.annual / step) * step === salary)
    .sort((a, b) => Math.abs(a.annual - salary) - Math.abs(b.annual - salary) || a.id.localeCompare(b.id));
  const awards = new Set<string>();
  const picked: AwardMinimum[] = [];
  for (const a of hits) {
    if (awards.has(a.awardCode)) continue;
    awards.add(a.awardCode);
    picked.push(a);
    if (picked.length === max) break;
  }
  return picked.sort((a, b) => a.annual - b.annual || a.id.localeCompare(b.id));
}
