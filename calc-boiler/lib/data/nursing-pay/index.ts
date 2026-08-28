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

import type { NursingStateData, NursingStateSlug, PayPoint, PayScale, ScaleFamily } from "./types";
import { NSW_NURSING_PAY } from "./nsw";
import { VIC_NURSING_PAY } from "./vic";
import { QLD_NURSING_PAY } from "./qld";
import { WA_NURSING_PAY } from "./wa";
import { SA_NURSING_PAY } from "./sa";
import { TAS_NURSING_PAY } from "./tas";

export * from "./types";
export * from "./nurses-award-2020";

/**
 * Registered states. Partial on purpose: ACT and NT are a later wave and the
 * type already carries their slugs so adding them needs no refactor.
 */
export const NURSING_PAY_BY_STATE: Partial<Record<NursingStateSlug, NursingStateData>> = {
  nsw: NSW_NURSING_PAY,
  vic: VIC_NURSING_PAY,
  qld: QLD_NURSING_PAY,
  wa: WA_NURSING_PAY,
  sa: SA_NURSING_PAY,
  tas: TAS_NURSING_PAY,
};

/** Slugs with a built page, in the order the hub lists them. */
export const NURSING_PAY_STATES: NursingStateSlug[] = ["nsw", "vic", "qld", "wa", "sa", "tas"];

/** States we have deliberately not built yet, so the hub can say so. */
export const NURSING_PAY_STATES_NOT_BUILT = ["Australian Capital Territory", "Northern Territory"] as const;

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

/** The instrument a scale's rates came from. */
export function instrumentFor(state: NursingStateData, instrumentId: string) {
  return state.instruments.find((i) => i.id === instrumentId);
}
