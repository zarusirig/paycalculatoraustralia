// =============================================================================
// Public service pay scales — shared types and helpers.
//
// Every salary in this folder was read from the primary instrument named in the
// jurisdiction's `sources` block on the date recorded there. Nothing is
// estimated, interpolated or averaged from job ads. Where a level's rate could
// not be read from a primary source it is omitted and listed in `unverified`,
// following the SCHADS_UNVERIFIED convention in lib/constants/schads-award.ts.
//
// The shape is deliberately "jurisdiction -> schedules -> streams -> bands"
// rather than "jurisdiction -> bands", because no Australian public service
// publishes a single table:
//   - the APS has no service-wide pay scale at all (each agency bargains its
//     own enterprise agreement), so its schedules are (a) the APSC's APS-wide
//     remuneration percentiles and (b) one named agency agreement as an example;
//   - Queensland has an award floor plus agency certified agreements above it;
//   - Victoria has one enterprise agreement plus a separate executive tribunal
//     determination.
// A jurisdiction added later (NSW, WA, SA, TAS, ACT, NT) only has to supply the
// same shape — no consumer of this module needs to change.
// =============================================================================

/** Every Australian public service. Only `BUILT_SLUGS` have data so far. */
export type JurisdictionSlug =
  | "aps"
  | "vic"
  | "qld"
  | "nsw"
  | "wa"
  | "sa"
  | "tas"
  | "act"
  | "nt";

/** A primary document a figure was read from. */
export interface PaySource {
  /** Referenced by `PaySchedule.sourceId` and friends. */
  id: string;
  title: string;
  publisher: string;
  url: string;
  /** The date the figures in this document take effect, where it states one. */
  effectiveFrom?: string;
  /** The date we read the document. */
  verifiedOn: string;
  note?: string;
}

/** What kind of instrument sets the figures in a schedule. */
export type BandBasis =
  /** A modern or state award — the legal floor. */
  | "award"
  /** An enterprise or certified agreement. */
  | "agreement"
  /** A tribunal or ministerial determination. */
  | "determination"
  /** Actual salaries reported to a remuneration survey, not a rate table. */
  | "survey";

export interface PayPoint {
  /** As the instrument labels it: "AO3/2", "3.1.4", "APS 6.1". */
  label: string;
  /** Full-time annual salary in dollars. */
  annual: number;
}

export interface ClassificationBand {
  /** The classification as people search for it: "APS6", "VPS 3.1", "PO4". */
  code: string;
  /** The instrument's own name for it. */
  name: string;
  /** Lower-cased search variants: "aps6", "aps 6", "aps level 6". */
  aliases: readonly string[];
  /** One line on what the level covers. No careers advice. */
  summary: string;
  /** Bottom of the band. */
  min: number;
  /** Top of the band. */
  max: number;
  /** Optional grouping label, e.g. "VPS Grade 3" for value ranges 3.1 and 3.2. */
  group?: string;
  /** Median actual salary — survey schedules only. */
  median?: number;
  /** Lowest salary actually reported — survey schedules only. */
  reportedMin?: number;
  /** Employees counted at this level — survey schedules only. */
  headcount?: number;
  /** Every published increment, where the instrument lists them. */
  payPoints?: readonly PayPoint[];
  note?: string;
}

export interface PayStream {
  id: string;
  name: string;
  /** "AO", "PO", "TO", "OO" — the letters that appear on a payslip. */
  code?: string;
  description: string;
  bands: readonly ClassificationBand[];
}

export interface PaySchedule {
  id: string;
  title: string;
  /** Who this schedule actually covers — the honesty line. */
  coverage: string;
  basis: BandBasis;
  /** "1 September 2026", "31 December 2025" (survey date). */
  effectiveFrom: string;
  /** What the min and max columns mean for this schedule. */
  rangeMeaning: string;
  sourceId: string;
  streams: readonly PayStream[];
  note?: string;
}

export interface SuperannuationNote {
  /** Employer contribution rate as a percentage, where one is published. */
  rate: number | null;
  text: string;
  sourceId: string;
}

export interface PayFaq {
  q: string;
  a: string;
}

export interface Jurisdiction {
  slug: JurisdictionSlug;
  /** "Australian Public Service", "Victorian Public Service". */
  name: string;
  /** "APS", "VPS", "Queensland public service". */
  shortName: string;
  /** For breadcrumbs and titles: "APS (federal)", "Victoria (VPS)". */
  label: string;
  /** The answer-first paragraph. Leads with a number. */
  headline: string;
  metaTitle: string;
  metaDescription: string;
  /** The instrument (or family of instruments) that sets pay. */
  instrument: string;
  /** How pay rises are set and when the next one lands. */
  payRise: string;
  schedules: readonly PaySchedule[];
  /** How you move up within a band. Paragraphs. */
  progression: readonly string[];
  superannuation: SuperannuationNote;
  sources: readonly PaySource[];
  /** Rates we could NOT verify, and therefore did not publish. */
  unverified: readonly string[];
  faqs: readonly PayFaq[];
  verifiedOn: string;
}

/** A jurisdiction the cluster will cover later. Listed, never faked. */
export interface PlannedJurisdiction {
  slug: JurisdictionSlug;
  name: string;
  shortName: string;
  /** Who publishes the pay scales, so the reader knows where to look today. */
  authority: string;
  /** Only set once the URL has been checked — a wrong link is worse than none. */
  authorityUrl?: string;
}

// ---------- take-home-pay links ----------
// /take-home-pay-on/N/ exists for N = 30000..200000 in steps of 5000
// (app/sitemap.ts, section 7). Any link out of this module must land on one.

export const TAKE_HOME_MIN = 30_000;
export const TAKE_HOME_MAX = 200_000;
export const TAKE_HOME_STEP = 5_000;

/**
 * The nearest published /take-home-pay-on/ salary to `salary`, clamped to the
 * range that actually exists. Ties round up, so a band midpoint of $82,500
 * points at $85,000 rather than a page below the band.
 */
export function nearestTakeHomeSalary(salary: number): number {
  if (!Number.isFinite(salary)) {
    throw new Error(`nearestTakeHomeSalary: ${salary} is not a finite number`);
  }
  const stepped = Math.round(salary / TAKE_HOME_STEP) * TAKE_HOME_STEP;
  return Math.min(TAKE_HOME_MAX, Math.max(TAKE_HOME_MIN, stepped));
}

/** Href for the take-home page nearest a salary. Always trailing-slashed. */
export function takeHomeHref(salary: number): string {
  return `/take-home-pay-on/${nearestTakeHomeSalary(salary)}/`;
}

/** Midpoint of a band, rounded to the dollar. */
export function bandMidpoint(band: Pick<ClassificationBand, "min" | "max">): number {
  return Math.round((band.min + band.max) / 2);
}

/** Whole dollars, no cents: "$108,092". */
export function formatSalary(value: number): string {
  return `$${Math.round(value).toLocaleString("en-AU")}`;
}

/** "$92,000 to $115,199", or a single figure when the band has no width. */
export function formatBandRange(band: Pick<ClassificationBand, "min" | "max">): string {
  return band.min === band.max
    ? formatSalary(band.min)
    : `${formatSalary(band.min)} to ${formatSalary(band.max)}`;
}

/** Normalise a classification for lookup: "APS 6" and "aps6" both match. */
export function normaliseCode(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}
