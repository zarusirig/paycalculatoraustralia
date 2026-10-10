// =============================================================================
// Rate-specific facts for /hourly-to-salary/[rate]/ and /salary-to-hourly/[amount]/
// (second pass, 10 Oct 2026).
//
// Each helper answers one question that only applies along part of the range,
// so a page shows a section only where its fact exists:
//
//   - pageAwardRates: award minimums within 50c of the rate, half-open
//     [rate - 0.50, rate + 0.50), so two whole-dollar neighbours never share a row;
//   - nearestAwardRates: the closest award minimum below and above a rate with
//     nothing within 50c;
//   - casualEquivalents: award classifications whose CASUAL minimum (base plus
//     the award's casual loading) is within 50c of the rate;
//   - penaltyContext: weekend, public holiday and overtime dollars for the
//     award classification nearest the rate, from that award's own tables;
//   - juniorFloors / apprenticeRatesNear: which junior minimums and apprentice
//     minimums a rate below the adult minimum wage would meet;
//   - salaryPageHalfWindow / HOURLY_PAGE_HALF_WINDOW: the "near this salary"
//     window for published pay scale points (lib/data/pay-scale-index.ts).
//
// Nothing is typed in here. Rates come from the award rate index (itself built
// from lib/constants/modern-awards*.ts, hospitality-award.ts, schads-award.ts),
// the junior scale from lib/constants/junior-rates.ts and apprentice rates from
// lib/data/apprentice-pay. Relative imports only, so `npm test` compiles it.
// =============================================================================

import { EMPLOYMENT } from "../constants/australian-tax";
import { CASUAL_LOADING, JUNIOR_RATES, type JuniorRateRow } from "../constants/junior-rates";
import { NMW } from "../constants/minimum-wage";
import { MODERN_AWARDS, type ModernAwardData } from "../constants/modern-awards";
import { APPRENTICE_TRADES, type ApprenticeStage } from "./apprentice-pay";
import { HOURLY_RATE_PAGES } from "../constants/hourly-rates";
import { AWARD_RATE_INDEX, awardRatesNear, type AwardRateMatch, type AwardRatesNear } from "./award-rate-index";
import { PAY_SCALE_ROWS, payScalePointsNear, type PayScaleMatch } from "./pay-scale-index";
import { SALARY_TO_HOURLY_SALARIES } from "./salary-pages";
import { payPointsRoundingTo } from "./salary-pages/tax-on-pay-points";

/** Half-width of the "near this rate" window, in dollars an hour. */
export const NEAR_WINDOW = 0.5;
/** At most this many award rows on a page (the first pass's cap). */
export const MAX_AWARD_ROWS = 8;
/**
 * From this hourly rate a page adds contractor context. Award minimums thin
 * out above $60 (a handful of nursing, SCHADS and health professional rates up
 * to AWARD_RATE_MAX), so from here pay is mostly set by agreements, salaries
 * and contract rates.
 */
export const CONTRACTOR_CONTEXT_FROM = 60;
/**
 * A full-time year at the casual minimum wage (adult minimum plus 25%, 1,976
 * hours). A salary below it is part-time pay at minimum rates, so the
 * salary-to-hourly page shows minimum-wage hours; above it, the hourly rate
 * including super.
 */
export const CASUAL_MINIMUM_FULL_TIME = Math.round(NMW.casualHourly * EMPLOYMENT.hoursPerYear);

const cents = (n: number) => Math.round(Number((n * 100).toFixed(6))) / 100;
const EPS = 1e-9;
/** diff in [-window, +window): the upper edge belongs to the next whole dollar. */
const inHalfOpen = (diff: number, window = NEAR_WINDOW) => diff >= -window - EPS && diff < window - EPS;

/**
 * Half the gap to the nearer neighbouring /salary-to-hourly/ page, so the
 * "near this salary" windows of neighbouring pages meet without overlapping.
 */
export function salaryPageHalfWindow(salary: number): number {
  const list = SALARY_TO_HOURLY_SALARIES;
  const i = list.indexOf(salary);
  if (i === -1) return 2_500;
  const gaps = [i > 0 ? salary - list[i - 1] : Infinity, i < list.length - 1 ? list[i + 1] - salary : Infinity];
  return Math.min(...gaps) / 2;
}

/** Half the gap between whole-dollar /hourly-to-salary/ pages, as a full-time salary ($988). */
export const HOURLY_PAGE_HALF_WINDOW = EMPLOYMENT.hoursPerYear / 2;

// ---------------------------------------------------------------------------
// Award minimums near the rate
// ---------------------------------------------------------------------------

/** One award, or one SCHADS stream. */
export const awardKey = (m: Pick<AwardRateMatch, "code" | "stream">) => `${m.code}|${m.stream ?? ""}`;

/** Every award with a minimum in the half-open window, one row each (the index's own pick), nearest first. */
function awardsInWindow(target: number, window: number): { near: AwardRatesNear; ranked: AwardRateMatch[] } {
  const near = awardRatesNear(target, { window, min: 0, max: AWARD_RATE_INDEX.length });
  const ranked = near.matches
    .filter((m) => inHalfOpen(m.diff, window))
    .sort((a, b) => Math.abs(a.diff) - Math.abs(b.diff) || a.hourly - b.hourly || awardKey(a).localeCompare(awardKey(b)));
  return { near, ranked };
}

/**
 * Award minimums within `window` (default 50c) of `target`, half-open, at most
 * one row per award (SCHADS: per stream), up to MAX_AWARD_ROWS, nearest first
 * but taking awards in `avoid` (the neighbouring page's) only to fill the
 * table. Returned in ascending order of rate; empty when no award minimum is
 * that close. /salary-to-hourly/ passes half the hourly gap to its
 * neighbouring pages, so its windows meet without overlapping too.
 */
export function pageAwardRates(
  target: number,
  window: number = NEAR_WINDOW,
  avoid: ReadonlySet<string> = new Set(),
): AwardRatesNear {
  const { near, ranked } = awardsInWindow(target, window);
  const matches = [...ranked.filter((m) => !avoid.has(awardKey(m))), ...ranked.filter((m) => avoid.has(awardKey(m)))]
    .slice(0, MAX_AWARD_ROWS)
    .sort((a, b) => a.hourly - b.hourly || awardKey(a).localeCompare(awardKey(b)));
  return { ...near, allInWindow: true, matches };
}

/**
 * Runs `pick` over an ascending list of pages, handing each the keys the page
 * before it showed, so neighbouring pages favour different awards or employers.
 */
function walkPages<T>(pages: readonly number[], pick: (page: number, avoid: ReadonlySet<string>) => T, keys: (v: T) => string[]): Map<number, T> {
  const out = new Map<number, T>();
  let previous: ReadonlySet<string> = new Set();
  for (const page of pages) {
    const value = pick(page, previous);
    out.set(page, value);
    previous = new Set(keys(value));
  }
  return out;
}

let hourlyAwards: Map<number, AwardRatesNear> | null = null;
/** The award rows on /hourly-to-salary/[rate]/: pageAwardRates, preferring awards the rate a dollar below did not show. */
export function hourlyPageAwardRates(rate: number): AwardRatesNear {
  hourlyAwards ??= walkPages(HOURLY_RATE_PAGES, (r, avoid) => pageAwardRates(r, NEAR_WINDOW, avoid), (n) => n.matches.map(awardKey));
  return hourlyAwards.get(rate) ?? pageAwardRates(rate);
}

let salaryAwards: Map<number, AwardRatesNear> | null = null;
/** The award rows on /salary-to-hourly/[amount]/, in that page's window, preferring awards the salary below did not show. */
export function salaryPageAwardRates(salary: number): AwardRatesNear {
  salaryAwards ??= walkPages(
    SALARY_TO_HOURLY_SALARIES,
    (s, avoid) => pageAwardRates(s / EMPLOYMENT.hoursPerYear, salaryPageAwardWindow(s), avoid),
    (n) => n.matches.map(awardKey),
  );
  return salaryAwards.get(salary) ?? pageAwardRates(salary / EMPLOYMENT.hoursPerYear, salaryPageAwardWindow(salary));
}

/** Award rows needed within 50c for a rate to count as a typical award rate. */
export const TYPICAL_AWARD_ROWS = 4;

/**
 * A rate at which at least TYPICAL_AWARD_ROWS awards set a minimum within 50c
 * ($26 to $42 an hour on the 2026 rates): the band where weekend and overtime
 * multiples on an award classification describe a common job.
 */
export function isTypicalAwardRate(rate: number): boolean {
  return awardsInWindow(rate, NEAR_WINDOW).ranked.length >= TYPICAL_AWARD_ROWS;
}

/** The window /salary-to-hourly/ uses for award rows: half the hourly gap to its neighbours, to the cent below. */
export function salaryPageAwardWindow(salary: number): number {
  return Math.floor((salaryPageHalfWindow(salary) / EMPLOYMENT.hoursPerYear) * 100) / 100;
}

/**
 * The nearest award minimum below and above `target`: the closest indexed rate
 * on each side (one award on it, with every classification at that rate), so
 * no indexed rate lies between the two.
 */
export function nearestAwardRates(target: number): { below: AwardRateMatch | null; above: AwardRateMatch | null } {
  const lower = [...AWARD_RATE_INDEX].reverse().find((e) => e.hourly < target - EPS);
  const upper = AWARD_RATE_INDEX.find((e) => e.hourly > target + EPS);
  const at = (hourly: number): AwardRateMatch | null => {
    const m = awardRatesNear(hourly, { window: 0, min: 1, max: 1 }).matches[0];
    return m ? { ...m, diff: cents(hourly - target) } : null;
  };
  return { below: lower ? at(lower.hourly) : null, above: upper ? at(upper.hourly) : null };
}

// ---------------------------------------------------------------------------
// Casual equivalents
// ---------------------------------------------------------------------------

export interface CasualEquivalent {
  match: AwardRateMatch;
  /** The award's casual minimum: base x (1 + casual loading), to the cent. */
  casual: number;
  /** casual - rate. */
  diff: number;
}

/**
 * Award classifications whose casual minimum is within 50c of `rate`
 * (half-open, like pageAwardRates). Every indexed award sets a 25% loading,
 * so the search runs on base = rate / 1.25 and each result is re-checked with
 * the award's own loading.
 */
export function casualEquivalents(rate: number, avoid: ReadonlySet<string> = new Set()): CasualEquivalent[] {
  const base = rate / (1 + CASUAL_LOADING);
  const pool = awardRatesNear(base, { window: NEAR_WINDOW / (1 + CASUAL_LOADING) + 0.01, min: 0, max: AWARD_RATE_INDEX.length }).matches;
  const ranked = pool
    .map((m) => {
      const casual = cents(m.hourly * (1 + m.casualLoading));
      return { match: m, casual, diff: cents(casual - rate) };
    })
    .filter((c) => inHalfOpen(c.diff))
    .sort((a, b) => Math.abs(a.diff) - Math.abs(b.diff) || a.casual - b.casual || awardKey(a.match).localeCompare(awardKey(b.match)));
  return [...ranked.filter((c) => !avoid.has(awardKey(c.match))), ...ranked.filter((c) => avoid.has(awardKey(c.match)))]
    .slice(0, MAX_AWARD_ROWS)
    .sort((a, b) => a.casual - b.casual || awardKey(a.match).localeCompare(awardKey(b.match)));
}

let hourlyCasual: Map<number, CasualEquivalent[]> | null = null;
/** The casual-equivalent rows on /hourly-to-salary/[rate]/, preferring awards the rate a dollar below did not show. */
export function hourlyPageCasualEquivalents(rate: number): CasualEquivalent[] {
  hourlyCasual ??= walkPages(HOURLY_RATE_PAGES, (r, avoid) => casualEquivalents(r, avoid), (rows) => rows.map((c) => awardKey(c.match)));
  return hourlyCasual.get(rate) ?? casualEquivalents(rate);
}

// ---------------------------------------------------------------------------
// Published pay scale points near the page's salary
// ---------------------------------------------------------------------------

let hourlyPoints: Map<number, PayScaleMatch[]> | null = null;
/** Pay scale points on /hourly-to-salary/[rate]/ (within $988 of the full-time salary), preferring employers the rate below did not show. */
export function hourlyPagePayScalePoints(rate: number): PayScaleMatch[] {
  const pick = (r: number, avoid: ReadonlySet<string>) =>
    payScalePointsNear(r * EMPLOYMENT.hoursPerYear, HOURLY_PAGE_HALF_WINDOW, PAY_SCALE_ROWS, avoid);
  hourlyPoints ??= walkPages(HOURLY_RATE_PAGES, pick, (pts) => pts.map((p) => p.group));
  return hourlyPoints.get(rate) ?? pick(rate, new Set());
}

/**
 * Rows on a /salary-to-hourly/ pay scale table. Its window is $5,000 or more
 * wide (against $1,976 on /hourly-to-salary/), so more employers fall in it.
 */
export const SALARY_PAGE_SCALE_ROWS = PAY_SCALE_ROWS + 2;

/**
 * The teacher and nursing points /tax-on/[salary]/ lists for the same salary
 * (lib/data/salary-pages/tax-on-pay-points.ts, same $5,000 grid), keyed by page
 * and salary, so /salary-to-hourly/ never repeats one of them.
 */
function taxOnPointKeys(salary: number): Set<string> {
  return new Set(payPointsRoundingTo(salary).map((p) => `${p.href}|${p.annual}`));
}

let salaryPoints: Map<number, PayScaleMatch[]> | null = null;
/**
 * Pay scale points on /salary-to-hourly/[amount]/ (within half the gap to its
 * neighbours, leaving out the teacher and nursing points /tax-on/ shows for
 * the same salary), preferring employers the salary below did not show.
 */
export function salaryPagePayScalePoints(salary: number): PayScaleMatch[] {
  const pick = (s: number, avoid: ReadonlySet<string>) => {
    const taxOn = taxOnPointKeys(s);
    return payScalePointsNear(s, salaryPageHalfWindow(s), SALARY_PAGE_SCALE_ROWS, avoid, (p) => taxOn.has(`${p.href}|${p.annual}`));
  };
  salaryPoints ??= walkPages(SALARY_TO_HOURLY_SALARIES, pick, (pts) => pts.map((p) => p.group));
  return salaryPoints.get(salary) ?? pick(salary, new Set());
}

// ---------------------------------------------------------------------------
// Penalty and overtime rates for the nearest award classification
// ---------------------------------------------------------------------------

export interface PenaltyLine {
  /** As the award labels the time worked. */
  label: string;
  kind: "penalty" | "overtime";
  /** Multiple of the minimum hourly rate, e.g. 1.25. */
  multiplier: number;
  /** Flat dollars an hour on top (Restaurant late-night work), else 0. */
  flatPerHour: number;
  /** Dollars an hour for a full-time or part-time employee on the classification. */
  hourly: number;
}

export interface PenaltyContext {
  match: AwardRateMatch;
  award: ModernAwardData;
  /** The classification the dollars are for (the first on the matched rate). */
  classification: string;
  lines: PenaltyLine[];
}

const MODERN_BY_CODE: ReadonlyMap<string, ModernAwardData> = new Map(
  Object.values(MODERN_AWARDS).map((a) => [a.meta.code, a]),
);

/**
 * Which award classification a typical rate prices: the nearest of the page's
 * award rows whose award has penalty and overtime tables, skipping the award
 * the rate a dollar below used when another qualifies, so neighbouring pages
 * walk through different awards' tables instead of repeating one.
 */
function penaltyMatch(target: number): AwardRateMatch | null {
  if (!isTypicalAwardRate(target)) return null;
  const candidates = hourlyPageAwardRates(target)
    .matches.filter((m) => MODERN_BY_CODE.has(m.code))
    .sort((a, b) => Math.abs(a.diff) - Math.abs(b.diff) || a.hourly - b.hourly);
  const previous = penaltyMatch(target - 1);
  return candidates.find((m) => m.code !== previous?.code) ?? candidates[0] ?? null;
}

/**
 * Weekend, public holiday and overtime dollars for the classification
 * penaltyMatch picks, from its award's own tables, priced at its minimum rate
 * for a permanent employee. Null when the rate is not a typical award rate
 * (isTypicalAwardRate) or no classification with tables is within 50c.
 */
export function penaltyContext(target: number): PenaltyContext | null {
  const match = penaltyMatch(target);
  if (!match) return null;
  const award = MODERN_BY_CODE.get(match.code)!;
  const applies = (list?: readonly string[]) => !list || list.some((c) => match.classifications.includes(c));
  const lines: PenaltyLine[] = [
    ...award.penalties
      .filter((p) => p.employment !== "casual" && applies(p.appliesTo))
      .map((p) => ({
        label: p.label,
        kind: "penalty" as const,
        multiplier: p.fullTime,
        flatPerHour: p.flatPerHour ?? 0,
        hourly: cents(match.hourly * p.fullTime + (p.flatPerHour ?? 0)),
      })),
    ...award.overtime.map((o) => ({
      label: o.label,
      kind: "overtime" as const,
      multiplier: o.fullTime,
      flatPerHour: 0,
      hourly: cents(match.hourly * o.fullTime),
    })),
  ];
  if (lines.length === 0) return null;
  return { match, award, classification: match.classifications[0], lines };
}

// ---------------------------------------------------------------------------
// Below the adult minimum wage: junior and apprentice minimums
// ---------------------------------------------------------------------------

/** Junior National Minimum Wage rows a rate meets, and the first one it does not. */
export function juniorFloors(rate: number): { met: JuniorRateRow[]; nextUp: JuniorRateRow | null } {
  const junior = JUNIOR_RATES.filter((r) => r.percentage < 1);
  return {
    met: junior.filter((r) => r.hourly <= rate + EPS),
    nextUp: JUNIOR_RATES.find((r) => r.hourly > rate + EPS) ?? null,
  };
}

export interface ApprenticeRateNear {
  hourly: number;
  track: "junior" | "adult";
  stage: ApprenticeStage;
  /** "completed" / "not-completed" when the rate depends on Year 12, else "either". */
  year12: "completed" | "not-completed" | "either";
  trades: { slug: string; name: string }[];
  /** hourly - rate. */
  diff: number;
}

/**
 * Apprentice award minimums within 50c of `rate` (half-open), one row per
 * hourly figure, stage, track and Year 12 condition, with every trade on it.
 */
export function apprenticeRatesNear(rate: number): ApprenticeRateNear[] {
  const groups = new Map<string, ApprenticeRateNear>();
  for (const t of APPRENTICE_TRADES) {
    const tracks: ["junior" | "adult", typeof t.junior][] = [["junior", t.junior]];
    if (t.adult) tracks.push(["adult", t.adult]);
    for (const [track, list] of tracks) {
      // This trade's Year 12 condition for each (stage, figure): when both the
      // "completed" and "not completed" rows carry the same figure, it does not matter.
      const conditions = new Map<string, Set<string>>();
      for (const r of list) {
        if (!inHalfOpen(cents(r.hourly - rate))) continue;
        const k = `${r.stage}|${r.hourly}`;
        conditions.set(k, (conditions.get(k) ?? new Set<string>()).add(r.year12));
      }
      for (const [k, set] of conditions) {
        const [stage, hourly] = k.split("|").map(Number) as [ApprenticeStage, number];
        const year12: ApprenticeRateNear["year12"] =
          set.size === 1 && !set.has("either") ? ([...set][0] as "completed" | "not-completed") : "either";
        const key = `${hourly}|${track}|${stage}|${year12}`;
        const g = groups.get(key) ?? { hourly, track, stage, year12, trades: [], diff: cents(hourly - rate) };
        g.trades.push({ slug: t.slug, name: t.name });
        groups.set(key, g);
      }
    }
  }
  return [...groups.values()].sort(
    (a, b) => a.hourly - b.hourly || a.stage - b.stage || a.track.localeCompare(b.track) || a.year12.localeCompare(b.year12),
  );
}
