// =============================================================================
// Public-health nursing pay — registry and the small amount of arithmetic the
// pages are allowed to do.
//
// Adding ACT or NT is a new file plus one line in NURSING_PAY_BY_STATE. The
// route, the metadata, the hub state-picker and the sitemap entry all read from
// NURSING_PAY_STATES, so nothing else has to change.
//
// WHAT THE HELPERS BELOW MAY AND MAY NOT DO
// -----------------------------------------
// They may convert between units a source publishes and units it does not,
// but only along a route the state's own `derivation` notes describe, and the
// page always prints that note next to the number. They may not invent a rate:
// a pay point with no published figure in any unit returns null and the UI
// shows the reason instead of a dollar sign.
// =============================================================================

import type { KeyGrade, NursingStateData, NursingStateSlug, PayPoint, PayScale, ScaleFamily } from "./types";
import { formatAUD } from "../../constants/australian-tax";
import { NSW_NURSING_PAY } from "./nsw";
import { VIC_NURSING_PAY } from "./vic";
import { QLD_NURSING_PAY } from "./qld";
import { WA_NURSING_PAY } from "./wa";
import { SA_NURSING_PAY } from "./sa";
import { TAS_NURSING_PAY } from "./tas";
// H2 (24 Sep 2026): ACT and NT built.
import { ACT_NURSING_PAY } from "./act";
import { NT_NURSING_PAY } from "./nt";

export * from "./types";
export * from "./nurses-award-2020";

/** Registered states — all eight since H2 (24 Sep 2026). */
export const NURSING_PAY_BY_STATE: Partial<Record<NursingStateSlug, NursingStateData>> = {
  nsw: NSW_NURSING_PAY,
  vic: VIC_NURSING_PAY,
  qld: QLD_NURSING_PAY,
  wa: WA_NURSING_PAY,
  sa: SA_NURSING_PAY,
  tas: TAS_NURSING_PAY,
  act: ACT_NURSING_PAY,
  nt: NT_NURSING_PAY,
};

/** Slugs with a built page, in the order the hub lists them. */
export const NURSING_PAY_STATES: NursingStateSlug[] = ["nsw", "vic", "qld", "wa", "sa", "tas", "act", "nt"];

/** States we have deliberately not built yet, so the hub can say so. */
export const NURSING_PAY_STATES_NOT_BUILT: readonly string[] = [];

export function getNursingPay(slug: string): NursingStateData | undefined {
  return NURSING_PAY_BY_STATE[slug as NursingStateSlug];
}

// ---------- unit conversion ----------

/** Weeks used to annualise a weekly rate: 26 fortnightly pays. */
export const WEEKS_PER_YEAR = 52;

/**
 * Annual salary for a pay point.
 *
 * Published annual wins. Otherwise fortnightly x 26, otherwise weekly x 52.
 * Returns null where the source publishes no rate at all for the row.
 */
export function annualFor(point: PayPoint): number | null {
  if (typeof point.annual === "number") return point.annual;
  if (typeof point.fortnightly === "number") return Math.round(point.fortnightly * 26);
  if (typeof point.weekly === "number") return Math.round(point.weekly * WEEKS_PER_YEAR);
  return null;
}

/** True when the annual figure came straight off the source. */
export function annualIsPublished(point: PayPoint): boolean {
  return typeof point.annual === "number";
}

/**
 * Hourly rate for a pay point.
 *
 * Published hourly wins. Otherwise weekly / ordinary weekly hours — which is
 * only done for states whose `derivation.hourly` note explains it (NSW cites
 * its own award clause). States with no hourly derivation note return null and
 * the page says the source does not publish one.
 */
export function hourlyFor(point: PayPoint, state: NursingStateData): number | null {
  if (typeof point.hourly === "number") return point.hourly;
  if (!state.derivation.hourly || state.derivation.hourly.startsWith("not shown")) return null;
  if (typeof point.weekly === "number") {
    return Math.round((point.weekly / state.ordinaryHoursPerWeek) * 100) / 100;
  }
  return null;
}

// ---------- take-home linking ----------

/** /take-home-pay-on/N/ exists for N = 30000..200000 in steps of 5000. */
export const TAKE_HOME_MIN = 30_000;
export const TAKE_HOME_MAX = 200_000;
export const TAKE_HOME_STEP = 5_000;

/** Nearest published /take-home-pay-on/ salary to an annual figure. */
export function nearestTakeHomeSalary(annual: number): number {
  const snapped = Math.round(annual / TAKE_HOME_STEP) * TAKE_HOME_STEP;
  return Math.min(TAKE_HOME_MAX, Math.max(TAKE_HOME_MIN, snapped));
}

/** Trailing-slash path to the nearest take-home page, per site convention. */
export function takeHomeHref(annual: number): string {
  return `/take-home-pay-on/${nearestTakeHomeSalary(annual)}/`;
}

// ---------- scale lookups ----------

/** All scales in a family, in the order the state file declares them. */
export function scalesInFamily(state: NursingStateData, family: ScaleFamily): PayScale[] {
  return state.scales.filter((s) => s.family === family);
}

/** Families this state actually has rows for, in SCALE_FAMILY_ORDER order. */
export function familiesPresent(state: NursingStateData, order: readonly ScaleFamily[]): ScaleFamily[] {
  return order.filter((f) => state.scales.some((s) => s.family === f));
}

/** The state's base registered nurse scale — the first "registered" family scale. */
export function baseRegisteredScale(state: NursingStateData): PayScale | undefined {
  return state.scales.find((s) => s.family === "registered");
}

/** Lowest and highest published annual on the base registered nurse scale. */
export function registeredNurseRange(
  state: NursingStateData,
): { entry: number; top: number; entryLabel: string; topLabel: string } | null {
  const scale = baseRegisteredScale(state);
  if (!scale) return null;

  const priced = scale.points
    .map((p) => ({ point: p, annual: annualFor(p) }))
    .filter((r): r is { point: PayPoint; annual: number } => r.annual !== null);

  if (priced.length === 0) return null;

  let low = priced[0];
  let high = priced[0];
  for (const row of priced) {
    if (row.annual < low.annual) low = row;
    if (row.annual > high.annual) high = row;
  }

  return {
    entry: low.annual,
    top: high.annual,
    entryLabel: low.point.label,
    topLabel: high.point.label,
  };
}

/**
 * Start and top of the base RN ladder, leaving out rows flagged `offLadder`
 * (Queensland's re-entry rate). This is the "RN starts at" figure used in the
 * answer box, the salary title and the FAQs. `registeredNurseRange` keeps the
 * true lowest row for the hub and other pages that already use it.
 */
export function registeredNurseLadder(
  state: NursingStateData,
): { entry: number; top: number; entryLabel: string; topLabel: string } | null {
  const scale = baseRegisteredScale(state);
  if (!scale) return null;
  const priced = scale.points
    .filter((p) => !p.offLadder)
    .map((p) => ({ point: p, annual: annualFor(p) }))
    .filter((r): r is { point: PayPoint; annual: number } => r.annual !== null);
  if (priced.length === 0) return null;
  let low = priced[0];
  let high = priced[0];
  for (const row of priced) {
    if (row.annual < low.annual) low = row;
    if (row.annual > high.annual) high = row;
  }
  return { entry: low.annual, top: high.annual, entryLabel: low.point.label, topLabel: high.point.label };
}

/**
 * Fortnightly pay for a pay point. Published fortnightly wins; otherwise a
 * published weekly rate x 2. Null for states that publish an annual salary
 * only, so the page never divides an annual figure into a pay it does not set.
 */
export function fortnightlyFor(point: PayPoint): number | null {
  if (typeof point.fortnightly === "number") return point.fortnightly;
  if (typeof point.weekly === "number") return Math.round(point.weekly * 2 * 100) / 100;
  return null;
}

export interface ResolvedKeyGrade {
  grade: KeyGrade;
  scale: PayScale;
  anchor: string;
  /** The single step asked for, or the lowest priced step when no step is named. */
  low: PayPoint;
  /** Same as `low` for a single step; the highest priced step otherwise. */
  high: PayPoint;
  lowAnnual: number;
  highAnnual: number;
}

/** Look up an answer-box row in the state's own scales. Null if it does not resolve. */
export function resolveKeyGrade(state: NursingStateData, grade: KeyGrade): ResolvedKeyGrade | null {
  const scale = state.scales.find((s) => s.classification === grade.classification);
  if (!scale) return null;
  const priced = scale.points
    .filter((p) => !p.offLadder)
    .map((p) => ({ point: p, annual: annualFor(p) }))
    .filter((r): r is { point: PayPoint; annual: number } => r.annual !== null);
  if (priced.length === 0) return null;
  let lowRow = priced[0];
  let highRow = priced[0];
  if (grade.point) {
    const one = priced.find((r) => r.point.label === grade.point);
    if (!one) return null;
    lowRow = one;
    highRow = one;
  } else {
    for (const row of priced) {
      if (row.annual < lowRow.annual) lowRow = row;
      if (row.annual > highRow.annual) highRow = row;
    }
  }
  return {
    grade,
    scale,
    anchor: scaleAnchor(state, scale),
    low: lowRow.point,
    high: highRow.point,
    lowAnnual: lowRow.annual,
    highAnnual: highRow.annual,
  };
}

/** All answer-box rows that resolve, in the order the state file lists them. */
export function keyGradeRows(state: NursingStateData): ResolvedKeyGrade[] {
  return (state.keyGrades ?? [])
    .map((g) => resolveKeyGrade(state, g))
    .filter((r): r is ResolvedKeyGrade => r !== null);
}

/** The instrument a scale's rates came from. */
export function instrumentFor(state: NursingStateData, instrumentId: string) {
  return state.instruments.find((i) => i.id === instrumentId);
}

// ---------- page titles ----------

/**
 * The year the page's rates are in force for, taken from `verifiedOn` — the
 * date the figures were read as current. A title saying "2026" is therefore a
 * claim that these were the operative rates during 2026, which is what the
 * verification date establishes.
 */
export function ratesYear(state: NursingStateData): string {
  const match = state.verifiedOn.match(/\b(20\d{2})\b/);
  return match ? match[1] : "";
}

/** "NSW Health (local health districts…)" -> "NSW Health". */
export function employerShortName(state: NursingStateData): string {
  return state.employer.split(" (")[0];
}

export function nursingPageTitle(state: NursingStateData): string {
  if (state.salaryTitle) {
    const stem = state.salaryTitle.replace("{year}", ratesYear(state));
    const ladder = registeredNurseLadder(state);
    if (!ladder) return stem;
    const withPay = `${stem} (RN from ${formatAUD(ladder.entry)})`;
    return withPay.length <= 65 ? withPay : stem;
  }
  if (state.metaTitle) return state.metaTitle;
  return `${state.shortName} Nurse Pay Rates ${ratesYear(state)} - ${employerShortName(state)} Nursing Salary`;
}

export function nursingPageH1(state: NursingStateData): string {
  if (state.h1) return state.h1;
  return `${state.shortName} Nurse & Midwife Pay Rates ${ratesYear(state)}: ${employerShortName(state)} Pay Scales`;
}

// ---------- per-scale anchors and the at-a-glance summary ----------

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[–—]/g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Anchor id for a scale's table: the grade code where the state gives one
 * ("nurse-grade-5", "cns-cms"), falling back to the classification name when
 * there is no code or two scales share one (SA prints RN/M2 for two roles).
 */
export function scaleAnchor(state: NursingStateData, scale: PayScale): string {
  if (scale.gradeCode) {
    const base = slugify(scale.gradeCode);
    const clash = state.scales.some((s) => s !== scale && s.gradeCode && slugify(s.gradeCode) === base);
    if (!clash) return base;
  }
  return slugify(scale.classification);
}

export interface ScaleSummary {
  scale: PayScale;
  anchor: string;
  /** Lowest and highest annual figure across priced points; null if none is priced. */
  low: number | null;
  high: number | null;
  /** Hourly rate at the lowest priced point, where published or derivable. */
  lowHourly: number | null;
}

/** One row per scale for the "at a glance" table, in the state file's order. */
export function scaleSummaries(state: NursingStateData): ScaleSummary[] {
  return state.scales.map((scale) => {
    const priced = scale.points
      .map((point) => ({ point, annual: annualFor(point) }))
      .filter((r): r is { point: PayPoint; annual: number } => r.annual !== null);
    if (priced.length === 0) {
      return { scale, anchor: scaleAnchor(state, scale), low: null, high: null, lowHourly: null };
    }
    let lowRow = priced[0];
    let high = priced[0].annual;
    for (const row of priced) {
      if (row.annual < lowRow.annual) lowRow = row;
      if (row.annual > high) high = row.annual;
    }
    return {
      scale,
      anchor: scaleAnchor(state, scale),
      low: lowRow.annual,
      high,
      lowHourly: hourlyFor(lowRow.point, state),
    };
  });
}
