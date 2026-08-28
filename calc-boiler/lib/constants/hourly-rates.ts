// =============================================================================
// Hourly-rate page inventory — the single list behind /hourly-to-salary/[rate]/.
//
// Why this list looks the way it does (GSC export to 27 Aug 2026, analysed in
// docs/seo/2026-08-28-gsc-query-network-traffic-opportunities.md, P1):
//
//   - People search "$N an hour is how much a year" for EVERY whole dollar. The
//     30-rate list built in July left 38% of the visible demand without a page
//     ($20, $58, $90, $62, $85, $49, $41, $43 ...). So: every whole dollar $20–$100.
//   - Half-dollar rates are searched too ($37.50 188 impressions, $36.50 107,
//     $34.50 92). So: every half-dollar across the award band, $20.50–$49.50.
//   - The cent-level rates people search are the rates they are actually paid:
//     $26.44 is the National Minimum Wage (309 impressions); $29.45 is Hospitality
//     Level 4 / Retail Level 4 / SCHADS Level 1 pp3 (85 impressions). So: every
//     adult hourly rate in the verified award constants, each tagged with the
//     classification(s) that pay it so the page can say who earns it.
//
// Anything below $20 is deliberately out — those are junior percentages, and
// that intent ("minimum wage for a 16 year old") is served by /junior-pay-rates/.
//
// Consumers: app/hourly-to-salary/[rate]/page.tsx (generateStaticParams),
// app/sitemap.ts, app/site-directory/page.tsx and the hub's link table. Do not
// re-declare the list anywhere else.
// =============================================================================

import { EMPLOYMENT } from "./australian-tax";
import { HOSPITALITY_AWARD, HOSPITALITY_RATES, RETAIL_AWARD, RETAIL_RATES } from "./hospitality-award";
import {
  SCHADS_AWARD,
  SCHADS_HOME_CARE_AGED,
  SCHADS_HOME_CARE_DISABILITY,
  SCHADS_SACS,
} from "./schads-award";
import { CASUAL_LOADING, NMW_ORDER } from "./junior-rates";

export const HOURLY_RATE_MIN = 20;
export const HOURLY_RATE_MAX = 100;

/** Half-dollar pages are generated across this band only. */
export const HALF_DOLLAR_MIN = 20.5;
export const HALF_DOLLAR_MAX = 49.5;

export interface HourlyRateNote {
  /** Short instrument name for prose, e.g. "Hospitality Award". */
  award: string;
  /** Award code, or "NMW" for the National Minimum Wage Order. */
  code: string;
  /** Classification or rate label, e.g. "Level 4", "adult minimum wage". */
  classification: string;
  /** Route on this site that explains the instrument. */
  href: string;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

const NMW_HOURLY = EMPLOYMENT.minimumWageHourly;
const NMW_CASUAL_HOURLY = round2(NMW_HOURLY * (1 + CASUAL_LOADING));
const NMW_PREVIOUS_HOURLY = EMPLOYMENT.minimumWageHourlyPrevious;

const notes = new Map<number, HourlyRateNote[]>();
function note(rate: number, n: HourlyRateNote) {
  const list = notes.get(rate) ?? [];
  list.push(n);
  notes.set(rate, list);
}

// --- National Minimum Wage ---------------------------------------------------
note(NMW_HOURLY, {
  award: "National Minimum Wage",
  code: "NMW",
  classification: `adult minimum wage from ${NMW_ORDER.operativeFrom}`,
  href: "/minimum-wage-history-australia/",
});
note(NMW_CASUAL_HOURLY, {
  award: "National Minimum Wage",
  code: "NMW",
  classification: `casual minimum wage (adult rate plus ${Math.round(CASUAL_LOADING * 100)}% loading) from ${NMW_ORDER.operativeFrom}`,
  href: "/minimum-wage-history-australia/",
});
note(NMW_PREVIOUS_HOURLY, {
  award: "National Minimum Wage",
  code: "NMW",
  classification: `adult minimum wage to 30 June 2026 (superseded by $${NMW_HOURLY.toFixed(2)})`,
  href: "/minimum-wage-history-australia/",
});

// --- Award adult rates (verified constants) ---------------------------------
for (const r of HOSPITALITY_RATES) {
  note(r.hourly, {
    award: "Hospitality Award",
    code: HOSPITALITY_AWARD.code,
    classification: r.level,
    href: "/hospitality-award-rates/",
  });
}
for (const r of RETAIL_RATES) {
  note(r.hourly, {
    award: "General Retail Award",
    code: RETAIL_AWARD.code,
    classification: r.level,
    href: "/retail-award-rates/",
  });
}
for (const r of SCHADS_SACS) {
  note(r.hourly, {
    award: "SCHADS Award (social and community services)",
    code: SCHADS_AWARD.code,
    classification: r.classification,
    href: "/schads-award-pay-rates/",
  });
}
for (const r of SCHADS_HOME_CARE_DISABILITY) {
  note(r.hourly, {
    award: "SCHADS Award (home care — disability)",
    code: SCHADS_AWARD.code,
    classification: r.classification,
    href: "/schads-award-pay-rates/",
  });
}
for (const r of SCHADS_HOME_CARE_AGED) {
  note(r.hourly, {
    award: "SCHADS Award (home care — aged care)",
    code: SCHADS_AWARD.code,
    classification: r.classification,
    href: "/schads-award-pay-rates/",
  });
}

/** Rates that carry a note (NMW or award), whatever the band. */
const NOTED_RATES = [...notes.keys()];

const wholeDollars: number[] = [];
for (let r = HOURLY_RATE_MIN; r <= HOURLY_RATE_MAX; r += 1) wholeDollars.push(r);

const halfDollars: number[] = [];
for (let r = HALF_DOLLAR_MIN; r <= HALF_DOLLAR_MAX; r += 1) halfDollars.push(round2(r));

/** Every generated /hourly-to-salary/ rate, ascending, unique, inside the band. */
export const HOURLY_RATE_PAGES: readonly number[] = [
  ...new Set([...wholeDollars, ...halfDollars, ...NOTED_RATES].map(round2)),
]
  .filter((r) => r >= HOURLY_RATE_MIN && r <= HOURLY_RATE_MAX)
  .sort((a, b) => a - b);

/** The award/NMW classifications that pay exactly this rate, if any. */
export function notesForRate(rate: number): HourlyRateNote[] {
  return notes.get(round2(rate)) ?? [];
}

/**
 * URL segment for a rate: "30", "37-5", "26-44".
 *
 * A dash, not a dot: with `trailingSlash: true` Next.js treats a final
 * segment like "37.5" as a file with an extension and emits the link WITHOUT
 * the slash, so every internal link would land on the 301 instead of the page.
 */
export function hourlyRateSlug(rate: number): string {
  return String(round2(rate)).replace(".", "-");
}

/** Inverse of hourlyRateSlug. Returns NaN for anything that is not a rate. */
export function hourlyRateFromSlug(slug: string): number {
  if (!/^\d+(-\d{1,2})?$/.test(slug)) return Number.NaN;
  return round2(Number(slug.replace("-", ".")));
}

/** Rates worth showing with full figures in a short table: every $5 step. */
export const FEATURED_HOURLY_RATES: readonly number[] = HOURLY_RATE_PAGES.filter(
  (r) => Number.isInteger(r) && r % 5 === 0,
);
