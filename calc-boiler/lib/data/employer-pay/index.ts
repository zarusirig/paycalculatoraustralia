// =============================================================================
// Employer pay rates — aggregated registry and the arithmetic the pages share.
//
// One file per employer. Add an employer by transcribing its enterprise
// agreement (or, where staff are award-covered, the modern award pay guide)
// into lib/data/employer-pay/<slug>.ts, adding the slug to EMPLOYER_SLUGS in
// types.ts and registering it below. The route, hub, sitemap and site
// directory all read EMPLOYER_SLUGS, so nothing else needs editing.
// =============================================================================

import type { EmployerPay, EmployerSlug, RateRow } from "./types";
import { EMPLOYER_SLUGS } from "./types";
import { HOURLY_RATE_PAGES, hourlyRateSlug } from "../../constants/hourly-rates";
import { nearestTakeHomeAmount } from "../teacher-pay/index";
import { COLES_PAY } from "./coles";
import { WOOLWORTHS_PAY } from "./woolworths";
import { BUNNINGS_PAY } from "./bunnings";
import { MCDONALDS_PAY } from "./mcdonalds";
import { CHEMIST_WAREHOUSE_PAY } from "./chemist-warehouse";
import { KMART_PAY } from "./kmart";
import { SUBWAY_PAY } from "./subway";

export const EMPLOYER_PAY_BY_SLUG: Readonly<Record<EmployerSlug, EmployerPay>> = {
  coles: COLES_PAY,
  woolworths: WOOLWORTHS_PAY,
  bunnings: BUNNINGS_PAY,
  mcdonalds: MCDONALDS_PAY,
  "chemist-warehouse": CHEMIST_WAREHOUSE_PAY,
  kmart: KMART_PAY,
  subway: SUBWAY_PAY,
};

/** Every employer, in the order the hub lists them (by search demand). */
export const EMPLOYERS: EmployerPay[] = EMPLOYER_SLUGS.map((slug) => EMPLOYER_PAY_BY_SLUG[slug]);

export function isEmployerSlug(value: string): value is EmployerSlug {
  return (EMPLOYER_SLUGS as readonly string[]).includes(value);
}

export function getEmployerPay(slug: string): EmployerPay | undefined {
  return isEmployerSlug(slug) ? EMPLOYER_PAY_BY_SLUG[slug] : undefined;
}

// ---------------------------------------------------------------------------
// Arithmetic. Every derived figure on an employer page comes from here so the
// tests can pin it.
// ---------------------------------------------------------------------------

/** Standard full-time week the instruments divide weekly rates by. */
export const STANDARD_WEEKLY_HOURS = 38;
export const WEEKS_PER_YEAR = 52;

/** Hours-per-week shown in the worked example on every page. */
export const EXAMPLE_HOURS = [15, 25, 38] as const;

/** Round half up to the cent. */
export function roundCents(value: number): number {
  return Math.round(value * 100 + Number.EPSILON) / 100;
}

/** The entry-level adult classification (rates[0]). */
export function entryRate(employer: EmployerPay): RateRow {
  const row = employer.rates[0];
  if (!row) throw new Error(`${employer.slug}: no rates published`);
  return row;
}

/** The highest adult base hourly rate published for an employer. */
export function topRate(employer: EmployerPay): RateRow {
  return employer.rates.reduce((best, row) => (row.hourly > best.hourly ? row : best));
}

export interface JuniorRow {
  age: string;
  percentage: number;
  hourly: number;
  casualHourly: number;
  /** True when the dollars were published by the instrument/pay guide, false when derived here. */
  published: boolean;
}

/**
 * Junior hourly rate derived from the entry-level adult rate.
 *
 * Where the instrument publishes a weekly rate, the percentage is applied to
 * the WEEKLY figure and divided by 38 — the order Fair Work's own pay guides
 * reproduce (see lib/constants/junior-rates.ts). Otherwise it is applied to the
 * hourly rate. The casual figure is the rounded junior rate plus the loading.
 */
export function deriveJuniorHourly(row: RateRow, percentage: number): number {
  if (row.weekly !== undefined) {
    return roundCents((row.weekly * percentage) / STANDARD_WEEKLY_HOURS);
  }
  return roundCents(row.hourly * percentage);
}

export function juniorRates(employer: EmployerPay): JuniorRow[] {
  const entry = entryRate(employer);
  return employer.juniorScale.map((band) => {
    const published = employer.publishedJuniorRates?.find((p) => p.age === band.age);
    if (published) {
      return {
        age: band.age,
        percentage: band.percentage,
        hourly: published.hourly,
        casualHourly: published.casualHourly,
        published: true,
      };
    }
    const hourly = deriveJuniorHourly(entry, band.percentage);
    return {
      age: band.age,
      percentage: band.percentage,
      hourly,
      casualHourly: roundCents(hourly * (1 + employer.casualLoading)),
      published: false,
    };
  });
}

export interface WeeklyExample {
  hours: number;
  permanentWeekly: number;
  casualWeekly: number;
}

/** Gross weekly pay at the entry-level adult rate, all hours at ordinary time. */
export function weeklyExamples(employer: EmployerPay): WeeklyExample[] {
  const entry = entryRate(employer);
  return EXAMPLE_HOURS.map((hours) => ({
    hours,
    permanentWeekly: roundCents(entry.hourly * hours),
    casualWeekly: roundCents(entry.casualHourly * hours),
  }));
}

/** Annual gross for a full-time (38-hour) employee at the given hourly rate. */
export function annualFullTime(hourly: number): number {
  return roundCents(hourly * STANDARD_WEEKLY_HOURS * WEEKS_PER_YEAR);
}

/** Nearest /take-home-pay-on/N/ page for a full-time year at this rate. */
export function takeHomeHrefForHourly(hourly: number): { href: string; amount: number } {
  const amount = nearestTakeHomeAmount(annualFullTime(hourly));
  return { href: `/take-home-pay-on/${amount}/`, amount };
}

/**
 * Nearest /hourly-to-salary/[rate]/ page that actually exists. Exact award
 * rates have their own page; EA rates usually do not, so the UI must say
 * "nearest" when `exact` is false.
 */
export function hourlyToSalaryLink(hourly: number): { href: string; rate: number; exact: boolean } {
  let best = HOURLY_RATE_PAGES[0];
  for (const rate of HOURLY_RATE_PAGES) {
    if (Math.abs(rate - hourly) < Math.abs(best - hourly)) best = rate;
  }
  return {
    href: `/hourly-to-salary/${hourlyRateSlug(best)}/`,
    rate: best,
    exact: roundCents(best) === roundCents(hourly),
  };
}

/** "25%" from 0.25; one decimal where needed ("57.8%"). */
export function formatPct(fraction: number): string {
  const pct = Math.round(fraction * 1000) / 10;
  return `${pct % 1 === 0 ? pct.toFixed(0) : pct.toFixed(1)}%`;
}

export * from "./types";
