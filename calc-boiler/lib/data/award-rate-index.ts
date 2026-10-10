// =============================================================================
// Award rate index: every adult, full-time, ordinary-hours minimum hourly rate
// this site publishes, by award and classification, in one flat list.
//
// Built only from the verified award constants. Nothing is re-keyed here:
//   - lib/constants/modern-awards.ts (+ -oct, -oct2): every MODERN_AWARDS entry
//   - lib/constants/hospitality-award.ts: Hospitality (MA000009), Retail (MA000004)
//   - lib/constants/schads-award.ts: SCHADS (MA000100), three streams
// The source on each entry is the one those files already cite (award text URL,
// rates clause or determination), and the effective date is the award's own
// operative date. Health Professionals and Support Services (MA000027) carries
// two dates in one string; each row takes the date for its stream.
//
// Left out on purpose:
//   - age-limited rows ("Student enrolled nurse — under 21"): not adult rates;
//   - Hospitality "Managerial staff (hotels)": the award sets an annual salary
//     and the weekly figure is pay-guide only (HOSPITALITY_MANAGERIAL_SOURCE),
//     so it is not an award hourly minimum.
//
// Each entry also lists the occupation pages (/job-pay-rates/) whose adult
// rate tables print the same award code and the same rate, read from
// lib/data/job-pay-rates, so a row can link "pay guides at this rate".
//
// Consumers: /hourly-to-salary/[rate]/ and /salary-to-hourly/[amount]/
// ("award jobs with a minimum rate near $X an hour"). These are legal floors
// from a stated date, never "what a job pays": copy must say so.
// =============================================================================

import { MODERN_AWARDS, type ModernAwardData } from "../constants/modern-awards";
import {
  AWARD_DETERMINATIONS,
  HOSPITALITY_AWARD,
  HOSPITALITY_MANAGERIAL_SOURCE,
  HOSPITALITY_RATES,
  RETAIL_AWARD,
  RETAIL_RATES,
} from "../constants/hospitality-award";
import {
  SCHADS_AWARD,
  SCHADS_HOME_CARE_AGED,
  SCHADS_HOME_CARE_DISABILITY,
  SCHADS_SACS,
  type SchadsRate,
} from "../constants/schads-award";
import { OCCUPATIONS } from "./job-pay-rates";

/** An occupation pay guide on this site that publishes this exact award rate. */
export interface AwardRateJob {
  slug: string;
  name: string;
  href: string;
}

export interface AwardRateSource {
  /** What was transcribed: instrument, clause or determination. */
  label: string;
  url: string;
}

export interface AwardRateEntry {
  /** Short award name for prose, e.g. "Fast Food Award". */
  award: string;
  /** Full title as it appears in the award. */
  awardTitle: string;
  /** Fair Work award code, e.g. "MA000003". */
  code: string;
  /** Stream where the site keeps separate tables for one award (SCHADS), else null. */
  stream: string | null;
  classification: string;
  hourly: number;
  weekly: number;
  /** ISO date the rate applies from (first full pay period starting on or after it). */
  effectiveFrom: string;
  /** The same date as the award states it, e.g. "1 July 2026". */
  effectiveLabel: string;
  /** Our award page, if we have one. */
  href: string | null;
  source: AwardRateSource;
  /** Casual loading the award sets on this rate (0.25 in every award indexed). */
  casualLoading: number;
  /** True where the published figure is the ordinary hourly rate including all-purpose allowances. */
  includesAllPurposeAllowances: boolean;
  /** Occupation pages (/job-pay-rates/) whose adult rate tables print this award's rate. */
  jobs: AwardRateJob[];
}

/**
 * Occupation pages by "award code|hourly rate": every adult row in each
 * occupation's rate tables (apprentice and trainee tables, which may sit below
 * the minimum wage, are skipped). Matching on the award code AND the exact
 * rate means a job is only listed against a rate its own page publishes.
 */
const JOBS_BY_RATE: ReadonlyMap<string, AwardRateJob[]> = (() => {
  const map = new Map<string, AwardRateJob[]>();
  for (const o of OCCUPATIONS) {
    if (!o.award) continue;
    for (const t of o.tables) {
      if (t.belowMinimumWage) continue;
      for (const r of t.rows) {
        const key = `${o.award.code}|${r.hourly}`;
        const list = map.get(key) ?? [];
        if (!list.some((j) => j.slug === o.slug)) list.push({ slug: o.slug, name: o.name, href: `/job-pay-rates/${o.slug}/` });
        map.set(key, list);
      }
    }
  }
  return map;
})();

const jobsAt = (code: string, hourly: number): AwardRateJob[] => [...(JOBS_BY_RATE.get(`${code}|${hourly}`) ?? [])];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** "1 July 2026" -> "2026-07-01". Throws on anything else, so a bad constant fails the build. */
export function isoDate(label: string): string {
  const m = /^(\d{1,2}) ([A-Z][a-z]+) (\d{4})$/.exec(label.trim());
  const month = m ? MONTHS.indexOf(m[2]) : -1;
  if (!m || month === -1) throw new Error(`award rate index: not a date: ${JSON.stringify(label)}`);
  return `${m[3]}-${String(month + 1).padStart(2, "0")}-${m[1].padStart(2, "0")}`;
}

/**
 * The operative date for one row. Most awards state a single date; MA000027
 * states "1 July 2026 (Support Services) and 1 October 2026 (Health
 * Professionals)", so the row takes the date whose stream label it starts with.
 */
function operativeFor(award: ModernAwardData, level: string): string {
  const parts = [...award.meta.operativeFrom.matchAll(/(\d{1,2} [A-Z][a-z]+ \d{4}) \(([^)]+)\)/g)];
  if (parts.length === 0) return award.meta.operativeFrom;
  for (const [, date, stream] of parts) {
    // "Health Professionals" -> "Health Professional"; "Support Services" -> "Support Service".
    if (level.startsWith(stream.replace(/s$/, ""))) return date;
  }
  throw new Error(`award rate index: no operative date for ${award.meta.code} ${level}`);
}

/** Rows that are not adult rates: an age limit in the classification itself. */
const AGE_LIMITED = /\bunder \d+\b/i;

function fromModernAward(a: ModernAwardData): AwardRateEntry[] {
  const allowances = /all-purpose/i.test(a.meta.ratesLabel ?? "");
  return a.rates
    .filter((r) => !AGE_LIMITED.test(r.level))
    .map((r) => {
      const label = operativeFor(a, r.level);
      return {
        award: a.meta.shortName,
        awardTitle: a.meta.name,
        code: a.meta.code,
        stream: null,
        classification: r.level,
        hourly: r.hourly,
        weekly: r.weekly,
        effectiveFrom: isoDate(label),
        effectiveLabel: label,
        href: a.meta.href,
        source: { label: `${a.meta.shortName} (${a.meta.code}) ${a.ratesClause}`, url: a.meta.awardTextUrl },
        casualLoading: a.meta.casualLoading,
        includesAllPurposeAllowances: allowances,
        jobs: jobsAt(a.meta.code, r.hourly),
      };
    });
}

const HOSPITALITY_SOURCE: AwardRateSource = {
  label: `Hospitality Award (${HOSPITALITY_AWARD.code}) award text and FWO pay guide, determination ${AWARD_DETERMINATIONS.hospitality}`,
  url: HOSPITALITY_AWARD.awardTextUrl,
};
const RETAIL_SOURCE: AwardRateSource = {
  label: `General Retail Award (${RETAIL_AWARD.code}) award text and FWO pay guide, determination ${AWARD_DETERMINATIONS.retail}`,
  url: RETAIL_AWARD.awardTextUrl,
};
const SCHADS_SOURCE: AwardRateSource = {
  label: `SCHADS Award (${SCHADS_AWARD.code}) award text and FWO pay guide, determination ${SCHADS_AWARD.determination} (SACS Levels 2–8 with Equal Remuneration Order ${SCHADS_AWARD.eroReference})`,
  url: SCHADS_AWARD.awardTextUrl,
};

const hospitality: AwardRateEntry[] = HOSPITALITY_RATES.filter(
  // Annual-salary classification; weekly is pay-guide only (see header).
  (r) => !(HOSPITALITY_MANAGERIAL_SOURCE.weeklyIsPayGuideOnly && /^Managerial staff/.test(r.level)),
).map((r) => ({
  award: "Hospitality Award",
  awardTitle: HOSPITALITY_AWARD.name,
  code: HOSPITALITY_AWARD.code,
  stream: null,
  classification: r.level,
  hourly: r.hourly,
  weekly: r.weekly,
  effectiveFrom: isoDate(HOSPITALITY_AWARD.operativeFrom),
  effectiveLabel: HOSPITALITY_AWARD.operativeFrom,
  href: "/hospitality-award-rates/",
  source: HOSPITALITY_SOURCE,
  casualLoading: HOSPITALITY_AWARD.casualLoading,
  includesAllPurposeAllowances: false,
  jobs: jobsAt(HOSPITALITY_AWARD.code, r.hourly),
}));

const retail: AwardRateEntry[] = RETAIL_RATES.map((r) => ({
  award: "General Retail Award",
  awardTitle: RETAIL_AWARD.name,
  code: RETAIL_AWARD.code,
  stream: null,
  classification: r.level,
  hourly: r.hourly,
  weekly: r.weekly,
  effectiveFrom: isoDate(RETAIL_AWARD.operativeFrom),
  effectiveLabel: RETAIL_AWARD.operativeFrom,
  href: "/retail-award-rates/",
  source: RETAIL_SOURCE,
  casualLoading: RETAIL_AWARD.casualLoading,
  includesAllPurposeAllowances: false,
  jobs: jobsAt(RETAIL_AWARD.code, r.hourly),
}));

function schads(rows: readonly SchadsRate[], stream: string): AwardRateEntry[] {
  return rows.map((r) => ({
    award: "SCHADS Award",
    awardTitle: SCHADS_AWARD.name,
    code: SCHADS_AWARD.code,
    stream,
    classification: r.classification,
    hourly: r.hourly,
    weekly: r.weekly,
    effectiveFrom: isoDate(SCHADS_AWARD.operativeFrom),
    effectiveLabel: SCHADS_AWARD.operativeFrom,
    href: "/schads-award-pay-rates/",
    source: SCHADS_SOURCE,
    casualLoading: SCHADS_AWARD.casualLoading,
    includesAllPurposeAllowances: false,
    jobs: jobsAt(SCHADS_AWARD.code, r.hourly),
  }));
}

/** Every indexed rate, ascending by hourly rate, then award and classification. */
export const AWARD_RATE_INDEX: readonly AwardRateEntry[] = [
  ...Object.values(MODERN_AWARDS).flatMap((a) => fromModernAward(a)),
  ...hospitality,
  ...retail,
  ...schads(SCHADS_SACS, "social and community services"),
  ...schads(SCHADS_HOME_CARE_DISABILITY, "home care — disability"),
  ...schads(SCHADS_HOME_CARE_AGED, "home care — aged care"),
].sort(
  (a, b) =>
    a.hourly - b.hourly ||
    a.award.localeCompare(b.award, "en-AU") ||
    a.classification.localeCompare(b.classification, "en-AU"),
);

export const AWARD_RATE_MIN = AWARD_RATE_INDEX[0];
export const AWARD_RATE_MAX = AWARD_RATE_INDEX[AWARD_RATE_INDEX.length - 1];

/** "SCHADS Award (home care — disability)" / "Fast Food Award". */
export function awardLabel(e: Pick<AwardRateEntry, "award" | "stream">): string {
  return e.stream ? `${e.award} (${e.stream})` : e.award;
}

// ---------------------------------------------------------------------------
// Nearest rates
// ---------------------------------------------------------------------------

/** One rate in one award (or SCHADS stream), with every classification on it. */
export interface AwardRateMatch {
  award: string;
  stream: string | null;
  code: string;
  href: string | null;
  /** Every classification in this award at exactly `hourly` (e.g. Pharmacy assistant level 3 and 3rd-year student). */
  classifications: string[];
  hourly: number;
  /** hourly - target, to the cent. */
  diff: number;
  effectiveFrom: string;
  effectiveLabel: string;
  source: AwardRateSource;
  casualLoading: number;
  includesAllPurposeAllowances: boolean;
  /** Occupation pages publishing this rate (same award, same rate). */
  jobs: AwardRateJob[];
}

export interface AwardRatesNear {
  target: number;
  /** The ± window used. */
  window: number;
  /** True when every match is inside the window; false when the nearest rates are further away. */
  allInWindow: boolean;
  /** Where the target sits against the whole index. */
  position: "below-all" | "inside" | "above-all";
  matches: AwardRateMatch[];
}

const cents = (n: number) => Math.round(n * 100) / 100;

const groupKey = (e: Pick<AwardRateEntry, "code" | "stream">) => `${e.code}|${e.stream ?? ""}`;

/** One candidate per (award or stream, rate), classifications on that rate merged. */
const CANDIDATES: readonly Omit<AwardRateMatch, "diff">[] = (() => {
  const byKey = new Map<string, Omit<AwardRateMatch, "diff">>();
  for (const e of AWARD_RATE_INDEX) {
    const key = `${groupKey(e)}|${e.hourly}`;
    const hit = byKey.get(key);
    if (hit) {
      hit.classifications.push(e.classification);
      continue;
    }
    byKey.set(key, {
      award: e.award,
      stream: e.stream,
      code: e.code,
      href: e.href,
      classifications: [e.classification],
      hourly: e.hourly,
      effectiveFrom: e.effectiveFrom,
      effectiveLabel: e.effectiveLabel,
      source: e.source,
      casualLoading: e.casualLoading,
      includesAllPurposeAllowances: e.includesAllPurposeAllowances,
      jobs: e.jobs,
    });
  }
  return [...byKey.values()];
})();

/**
 * The award classifications whose minimum rate is closest to `target`.
 *
 * Each award (SCHADS: each stream) appears once. With at least `min` awards
 * within ±`window`, up to `max` of them, nearest first but spread out: first a
 * new award at a new rate, then any new award, so one common rate (the $25.74
 * entry level shared by ten awards) cannot fill the list. Otherwise the
 * nearest rate in each of the `min` nearest awards, whatever the distance
 * (`allInWindow` is then false and the copy must not claim the window).
 * Returned in ascending order of rate.
 */
export function awardRatesNear(
  target: number,
  { window = 0.75, min = 3, max = 8 }: { window?: number; min?: number; max?: number } = {},
): AwardRatesNear {
  const ranked: AwardRateMatch[] = CANDIDATES.map((c) => ({ ...c, diff: cents(c.hourly - target) })).sort(
    (a, b) =>
      Math.abs(a.diff) - Math.abs(b.diff) ||
      a.hourly - b.hourly ||
      awardLabel(a).localeCompare(awardLabel(b), "en-AU"),
  );

  const pick = (pool: readonly AwardRateMatch[], limit: number, spreadRates: boolean): AwardRateMatch[] => {
    const out: AwardRateMatch[] = [];
    const groups = new Set<string>();
    const rates = new Set<number>();
    const passes = spreadRates ? [true, false] : [false];
    for (const needNewRate of passes) {
      for (const m of pool) {
        if (out.length >= limit) break;
        if (groups.has(groupKey(m)) || (needNewRate && rates.has(m.hourly))) continue;
        out.push(m);
        groups.add(groupKey(m));
        rates.add(m.hourly);
      }
    }
    return out;
  };

  const within = ranked.filter((m) => Math.abs(m.diff) <= window + 1e-9);
  let picked = pick(within, max, true);
  if (picked.length < min) picked = pick(ranked, min, false);
  picked.sort((a, b) => a.hourly - b.hourly || awardLabel(a).localeCompare(awardLabel(b), "en-AU"));

  return {
    target,
    window,
    allInWindow: picked.every((m) => Math.abs(m.diff) <= window + 1e-9),
    position: target < AWARD_RATE_MIN.hourly ? "below-all" : target > AWARD_RATE_MAX.hourly ? "above-all" : "inside",
    matches: picked,
  };
}
