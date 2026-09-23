// =============================================================================
// Programmatic salary pages — the salary grid and every per-salary fact.
//
// One source of truth for which salaries have a page under
//   /take-home-pay-on/[salary]/   /tax-on/[salary]/   /salary-to-hourly/[amount]/
// and for the band-dependent facts each page prints. generateStaticParams,
// the sitemap, the hub pages and the prev/next chains all read these lists,
// so a page cannot be built without being linked, or linked without being
// built.
//
// No figure here is typed in: every dollar amount comes from the tax engine
// (lib/constants/australian-tax.ts) or the super and ABS modules it imports,
// so the grid re-prices itself when those constants roll over each 1 July.
//
// Wave 3 / T6 (23 Sep 2026): grid widened from 35 values ($30k–$200k, $5k
// steps) to $1k steps between $40k and $150k plus the high-salary tail.
// Every pre-existing URL is still in the lists (see the unit tests).
// =============================================================================

import {
  calculatePayBreakdown,
  HECS_HELP,
  LITO,
  MEDICARE_LEVY,
  SUPER_GUARANTEE,
  TAX_BRACKETS,
  type PayBreakdown,
} from "../../constants/australian-tax";
import { DIVISION_293, division293Estimate, CONTRIBUTIONS_TAX_RATE } from "../../constants/super-contributions";

// ---------------------------------------------------------------------------
// The grid
// ---------------------------------------------------------------------------

function range(from: number, to: number, step: number): number[] {
  const out: number[] = [];
  for (let v = from; v <= to; v += step) out.push(v);
  return out;
}

/** Salaries above $200k that carry search demand ("250k after tax", "300k"). */
export const HIGH_SALARY_TAIL: readonly number[] = [...range(210_000, 300_000, 10_000), 350_000, 400_000, 500_000];

/**
 * Every salary with a /take-home-pay-on/ and a /tax-on/ page:
 * $20k–$35k in $5k steps, every $1,000 from $40k to $150k, $5k steps to
 * $200k, $10k steps to $300k, then $350k, $400k and $500k.
 */
export const TAKE_HOME_SALARIES: readonly number[] = [
  ...range(20_000, 35_000, 5_000),
  ...range(40_000, 150_000, 1_000),
  ...range(155_000, 200_000, 5_000),
  ...HIGH_SALARY_TAIL,
];

/** /tax-on/ uses the same grid as /take-home-pay-on/ (a page pair per salary). */
export const TAX_ON_SALARIES: readonly number[] = TAKE_HOME_SALARIES;

/**
 * /salary-to-hourly/ — the take-home grid from $40k up, plus the long-standing
 * $30,000 page. (No $20k/$25k/$35k: those were never hourly pages and a
 * sub-$40k annual salary is almost always a part-time figure, where a 38-hour
 * conversion misleads.)
 */
export const SALARY_TO_HOURLY_SALARIES: readonly number[] = [
  30_000,
  ...TAKE_HOME_SALARIES.filter((s) => s >= 40_000),
];

export type SalaryFamily = "take-home" | "tax-on" | "salary-to-hourly";

const FAMILY_LISTS: Record<SalaryFamily, readonly number[]> = {
  "take-home": TAKE_HOME_SALARIES,
  "tax-on": TAX_ON_SALARIES,
  "salary-to-hourly": SALARY_TO_HOURLY_SALARIES,
};

const FAMILY_BASE: Record<SalaryFamily, string> = {
  "take-home": "/take-home-pay-on/",
  "tax-on": "/tax-on/",
  "salary-to-hourly": "/salary-to-hourly/",
};

export function salaryList(family: SalaryFamily): readonly number[] {
  return FAMILY_LISTS[family];
}

export function hubHref(family: SalaryFamily): string {
  return FAMILY_BASE[family];
}

export function salaryHref(family: SalaryFamily, salary: number): string {
  return `${FAMILY_BASE[family]}${salary}/`;
}

export function hasPage(family: SalaryFamily, salary: number): boolean {
  return FAMILY_LISTS[family].includes(salary);
}

/** Nearest salary in the family's grid (ties go to the lower value). */
export function nearestSalary(family: SalaryFamily, salary: number): number {
  return FAMILY_LISTS[family].reduce((best, s) =>
    Math.abs(s - salary) < Math.abs(best - salary) ? s : best,
  );
}

/** The grid neighbours of a salary: previous and next page in the family. */
export function prevNext(family: SalaryFamily, salary: number): { prev: number | null; next: number | null } {
  const list = FAMILY_LISTS[family];
  const i = list.indexOf(salary);
  if (i === -1) return { prev: null, next: null };
  return { prev: i > 0 ? list[i - 1] : null, next: i < list.length - 1 ? list[i + 1] : null };
}

/**
 * Links for the "nearby salaries" strip: the three grid neighbours either side
 * plus the round-number pages ±$5k and ±$10k away where they exist. Sorted,
 * de-duplicated, never including the salary itself.
 */
export function nearbySalaries(family: SalaryFamily, salary: number): number[] {
  const list = FAMILY_LISTS[family];
  const i = list.indexOf(salary);
  const picks = new Set<number>();
  if (i !== -1) {
    for (let d = -3; d <= 3; d++) {
      const s = list[i + d];
      if (d !== 0 && s !== undefined) picks.add(s);
    }
  }
  for (const off of [-10_000, -5_000, 5_000, 10_000]) {
    if (list.includes(salary + off)) picks.add(salary + off);
  }
  return [...picks].sort((a, b) => a - b);
}

// ---------------------------------------------------------------------------
// Bands — used to group the hub pages and to vary the copy
// ---------------------------------------------------------------------------

export interface SalaryBand {
  id: string;
  title: string;
  min: number;
  max: number;
}

/**
 * Hub groupings: roughly $20k bands, each small enough to scan (at most ~31
 * links) while the $1k-step middle of the grid stays readable.
 */
export const SALARY_BANDS: readonly SalaryBand[] = [
  { id: "under-40k", title: "$20,000 – $39,999", min: 0, max: 39_999 },
  { id: "40k-59k", title: "$40,000 – $59,999", min: 40_000, max: 59_999 },
  { id: "60k-79k", title: "$60,000 – $79,999", min: 60_000, max: 79_999 },
  { id: "80k-99k", title: "$80,000 – $99,999", min: 80_000, max: 99_999 },
  { id: "100k-119k", title: "$100,000 – $119,999", min: 100_000, max: 119_999 },
  { id: "120k-150k", title: "$120,000 – $150,000", min: 120_000, max: 150_000 },
  { id: "155k-200k", title: "$155,000 – $200,000", min: 150_001, max: 200_000 },
  { id: "over-200k", title: "Over $200,000", min: 200_001, max: Infinity },
];

export function groupByBand(salaries: readonly number[]): { band: SalaryBand; salaries: number[] }[] {
  return SALARY_BANDS.map((band) => ({
    band,
    salaries: salaries.filter((s) => s >= band.min && s <= band.max),
  })).filter((g) => g.salaries.length > 0);
}

// ---------------------------------------------------------------------------
// Per-salary facts — everything the band-dependent copy branches on
// ---------------------------------------------------------------------------

export type LitoStage = "full" | "phase-out-5c" | "phase-out-1.5c" | "nil";
export type MedicareStage = "exempt" | "shade-in" | "full";

export interface SalaryFacts {
  salary: number;
  breakdown: PayBreakdown;
  withHecs: PayBreakdown;
  /** Index into TAX_BRACKETS of the top bracket this salary reaches. */
  bracketIndex: number;
  bracketRate: number;
  /** First dollar of the next bracket, or null in the top bracket. */
  nextBracketStart: number | null;
  nextBracketRate: number | null;
  litoStage: LitoStage;
  medicareStage: MedicareStage;
  /** Medicare Levy Surcharge without private hospital cover (singles, current tiers). */
  mls: { rate: number; amount: number; tier: 0 | 1 | 2 | 3 };
  /** HECS-HELP band index (0 = below threshold). */
  hecsBandIndex: number;
  /** Employer SG, capped at the maximum contribution base. */
  employerSuper: number;
  superCapped: boolean;
  /** Concessional cap left after employer SG — room for salary sacrifice. */
  concessionalRoom: number;
  /** Division 293 on employer SG alone (0 when income + SG stays under the threshold). */
  division293: number;
  /** What the next $1,000 of salary is worth. */
  nextThousand: {
    takeHome: number;
    takeHomeWithHecs: number;
    /** Share of the extra $1,000 lost to tax, Medicare and (none) HECS, 0–1. */
    effectiveMarginal: number;
    effectiveMarginalWithHecs: number;
  };
  /** Sacrificing $1,000 of salary into super. */
  sacrificeThousand: {
    takeHomeCost: number;
    intoSuper: number;
    /** intoSuper - takeHomeCost: positive means the household is ahead. */
    netGain: number;
  };
}

function bracketIndexFor(income: number): number {
  let idx = 0;
  TAX_BRACKETS.forEach((b, i) => {
    if (income >= b.min) idx = i;
  });
  return idx;
}

function litoStageFor(income: number): LitoStage {
  if (income <= LITO.fullOffsetCeiling) return "full";
  if (income <= LITO.phaseOut1.end) return "phase-out-5c";
  if (income < LITO.nilOffsetIncome) return "phase-out-1.5c";
  return "nil";
}

function medicareStageFor(income: number): MedicareStage {
  if (income <= MEDICARE_LEVY.lowIncomeThreshold) return "exempt";
  if (income * MEDICARE_LEVY.rate > (income - MEDICARE_LEVY.lowIncomeThreshold) * MEDICARE_LEVY.shadeInRate) {
    return "shade-in";
  }
  return "full";
}

function mlsFor(income: number): SalaryFacts["mls"] {
  const s = MEDICARE_LEVY.surcharge;
  if (income < s.tier1.min) return { rate: 0, amount: 0, tier: 0 };
  if (income <= s.tier1.max) return { rate: s.tier1.rate, amount: Math.round(income * s.tier1.rate), tier: 1 };
  if (income <= s.tier2.max) return { rate: s.tier2.rate, amount: Math.round(income * s.tier2.rate), tier: 2 };
  return { rate: s.tier3.rate, amount: Math.round(income * s.tier3.rate), tier: 3 };
}

function hecsBandIndexFor(income: number): number {
  if (income <= HECS_HELP.minimumThreshold) return 0;
  let idx = 0;
  HECS_HELP.bands.forEach((b, i) => {
    if (income >= b.min) idx = i;
  });
  return idx;
}

/** Employer SG on a salary, capped at the maximum super contribution base. */
export function employerSuperFor(salary: number): { amount: number; capped: boolean } {
  const uncapped = calculatePayBreakdown({ grossSalary: salary }).superContribution;
  if (salary > SUPER_GUARANTEE.maxContributionBaseAnnual) {
    return { amount: Math.round(SUPER_GUARANTEE.maxSGAnnual), capped: true };
  }
  return { amount: uncapped, capped: false };
}

const factsCache = new Map<number, SalaryFacts>();

export function salaryFacts(salary: number): SalaryFacts {
  const cached = factsCache.get(salary);
  if (cached) return cached;

  const breakdown = calculatePayBreakdown({ grossSalary: salary });
  const withHecs = calculatePayBreakdown({ grossSalary: salary, includeHECS: true });
  const plus = calculatePayBreakdown({ grossSalary: salary + 1_000 });
  const plusHecs = calculatePayBreakdown({ grossSalary: salary + 1_000, includeHECS: true });
  const sacrificed = calculatePayBreakdown({ grossSalary: salary, salarySacrifice: 1_000 });

  const bracketIndex = bracketIndexFor(salary);
  const next = TAX_BRACKETS[bracketIndex + 1];
  const sg = employerSuperFor(salary);
  const division293 = division293Estimate(salary, sg.amount);

  // $1,000 sacrificed: contributions tax is 15%, or 30% where Division 293
  // bites (income + concessional contributions over the threshold).
  // Sacrificing moves $1,000 from taxable income into concessional
  // contributions, so the Division 293 test total (income + contributions) is
  // unchanged at salary + SG.
  const div293Applies = salary + sg.amount > DIVISION_293.threshold;
  const contributionsTax = CONTRIBUTIONS_TAX_RATE + (div293Applies ? DIVISION_293.rate : 0);
  const takeHomeCost = breakdown.takeHomePay - sacrificed.takeHomePay;
  const intoSuper = Math.round(1_000 * (1 - contributionsTax));

  const facts: SalaryFacts = {
    salary,
    breakdown,
    withHecs,
    bracketIndex,
    bracketRate: TAX_BRACKETS[bracketIndex].rate,
    nextBracketStart: next ? next.min : null,
    nextBracketRate: next ? next.rate : null,
    litoStage: litoStageFor(salary),
    medicareStage: medicareStageFor(salary),
    mls: mlsFor(salary),
    hecsBandIndex: hecsBandIndexFor(salary),
    employerSuper: sg.amount,
    superCapped: sg.capped,
    concessionalRoom: Math.max(0, Math.round(SUPER_GUARANTEE.concessionalCap - sg.amount)),
    division293,
    nextThousand: {
      takeHome: plus.takeHomePay - breakdown.takeHomePay,
      takeHomeWithHecs: plusHecs.takeHomePay - withHecs.takeHomePay,
      effectiveMarginal: 1 - (plus.takeHomePay - breakdown.takeHomePay) / 1_000,
      effectiveMarginalWithHecs: 1 - (plusHecs.takeHomePay - withHecs.takeHomePay) / 1_000,
    },
    sacrificeThousand: {
      takeHomeCost,
      intoSuper,
      netGain: intoSuper - takeHomeCost,
    },
  };
  factsCache.set(salary, facts);
  return facts;
}

/** Rows for a ±$1k / ±$5k (optionally ±$10k) comparison table around a salary. */
export function neighbourRows(
  salary: number,
  offsets: readonly number[] = [-5_000, -1_000, 0, 1_000, 5_000],
): { offset: number; salary: number; breakdown: PayBreakdown; diff: number }[] {
  const base = salaryFacts(salary).breakdown.takeHomePay;
  return offsets
    .map((offset) => salary + offset)
    .filter((s) => s > 0)
    .map((s) => {
      const b = calculatePayBreakdown({ grossSalary: s });
      return { offset: s - salary, salary: s, breakdown: b, diff: b.takeHomePay - base };
    });
}
