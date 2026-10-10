// =============================================================================
// Tax, levy and super thresholds near a salary — the "Thresholds near $X"
// section of /tax-on/[salary]/ (10 Oct 2026).
//
// Every amount is read from the verified constants; nothing is typed in here.
// Each threshold carries the income year its figure belongs to, because they
// do not all share one year:
//   - income tax brackets, LITO, MLS tiers, HECS-HELP bands, the super maximum
//     contribution base, the concessional cap and Division 293: 2026-27
//     (australian-tax.ts, super-contributions.ts, each with its ATO source);
//   - Medicare levy low-income thresholds: 2025-26, the latest the ATO has
//     published (see the MEDICARE_LEVY header in australian-tax.ts).
//
// Distances assume salary is the only income. MLS, HECS-HELP and Division 293
// use wider income tests (reportable fringe benefits, reportable super,
// investment losses), which the page says next to the table.
// =============================================================================

import {
  HECS_HELP,
  LITO,
  MEDICARE_LEVY,
  SITE_CONFIG,
  SUPER_GUARANTEE,
  TAX_BRACKETS,
  TAX_FREE_THRESHOLD,
  formatAUD,
} from "../../constants/australian-tax";
import { DIVISION_293 } from "../../constants/super-contributions";

export type ThresholdKind = "income-tax" | "lito" | "medicare" | "mls" | "hecs" | "div293" | "super";

export interface Threshold {
  id: string;
  kind: ThresholdKind;
  /** The rule changes for income above this figure. */
  at: number;
  /** Short noun phrase for the table and for prose after "the". */
  name: string;
  /** Income year the figure belongs to, e.g. "2026-27". */
  incomeYear: string;
  /** What changes once income passes `at`, in one sentence. */
  change: string;
  /** Page that explains it. */
  href: string;
}

export type ThresholdStatus = "passed" | "at" | "ahead";

export interface ThresholdPosition extends Threshold {
  /** |salary − at|. */
  distance: number;
  /** passed: salary is above it; at: salary equals it (the next dollar crosses); ahead: still to come. */
  status: ThresholdStatus;
}

/** Window either side of the salary for "near". */
export const THRESHOLD_WINDOW = 15_000;

const pc = (r: number) => `${Number((r * 100).toFixed(2))}%`;
const cents = (r: number) => `${Number((r * 100).toFixed(1))}c`;

/**
 * Salary at which salary + 12% employer super first exceeds the Division 293
 * threshold (employer SG as the only concessional contribution). Derived:
 * floor(250,000 ÷ 1.12) = $223,214.
 */
export const DIV293_SALARY_EQUIVALENT = Math.floor(DIVISION_293.threshold / (1 + SUPER_GUARANTEE.rate));

/** The full list, sorted by `at`. Built once from the constants. */
export function allThresholds(): Threshold[] {
  const fy = SITE_CONFIG.financialYear;
  const levyYear = SITE_CONFIG.previousFinancialYear;
  const [, b15, b30, b37, b45] = TAX_BRACKETS;
  const litoAt45k = LITO.maxOffset - (LITO.phaseOut1.end - LITO.fullOffsetCeiling) * LITO.phaseOut1.rate;
  const s = MEDICARE_LEVY.surcharge;
  const [, h1, h2, h3] = HECS_HELP.bands;

  const list: Threshold[] = [
    {
      id: "tax-free",
      kind: "income-tax",
      at: TAX_FREE_THRESHOLD,
      name: "Tax-free threshold",
      incomeYear: fy,
      change: `Income tax starts: each dollar above ${formatAUD(TAX_FREE_THRESHOLD)} is taxed at ${cents(b15.rate)} before offsets.`,
      href: "/tax-free-threshold/",
    },
    {
      id: "lito-nil-tax",
      kind: "lito",
      // Highest whole-dollar income on which LITO still cancels all the tax:
      // floor($18,200 + $700 ÷ 15%) = $22,866 (tax at $22,867 is 5c).
      at: Math.floor(TAX_FREE_THRESHOLD + LITO.maxOffset / b15.rate),
      name: "LITO nil-tax limit",
      incomeYear: fy,
      change: `The ${formatAUD(LITO.maxOffset)} Low Income Tax Offset no longer covers the whole ${pc(b15.rate)} tax, so income tax becomes payable.`,
      href: "/low-income-tax-offset/",
    },
    {
      id: "medicare-start",
      kind: "medicare",
      at: MEDICARE_LEVY.lowIncomeThreshold,
      name: "Medicare levy low-income threshold",
      incomeYear: levyYear,
      change: `The Medicare levy starts, shaded in at ${cents(MEDICARE_LEVY.shadeInRate)} per dollar above ${formatAUD(MEDICARE_LEVY.lowIncomeThreshold)}.`,
      href: "/medicare-levy/",
    },
    {
      id: "medicare-full",
      kind: "medicare",
      at: MEDICARE_LEVY.shadeInThreshold,
      name: "Full Medicare levy threshold",
      incomeYear: levyYear,
      change: `The shade-in ends and the full ${pc(MEDICARE_LEVY.rate)} levy applies to the whole income.`,
      href: "/medicare-levy/",
    },
    {
      id: "lito-phase-out",
      kind: "lito",
      at: LITO.fullOffsetCeiling,
      name: "LITO phase-out threshold",
      incomeYear: fy,
      change: `The ${formatAUD(LITO.maxOffset)} offset shrinks by ${cents(LITO.phaseOut1.rate)} per dollar, adding ${cents(LITO.phaseOut1.rate)} to the tax on each extra dollar.`,
      href: "/low-income-tax-offset/",
    },
    {
      id: "bracket-30",
      kind: "income-tax",
      at: b30.min - 1,
      name: `${pc(b30.rate)} tax rate`,
      incomeYear: fy,
      change: `Each dollar above ${formatAUD(b30.min - 1)} is taxed at ${cents(b30.rate)} instead of ${cents(b15.rate)}.`,
      href: "/tax-brackets/",
    },
    {
      id: "lito-slower",
      kind: "lito",
      at: LITO.phaseOut1.end,
      name: "LITO slower phase-out",
      incomeYear: fy,
      change: `The offset (${formatAUD(litoAt45k)} at this point) now shrinks by ${cents(LITO.phaseOut2.rate)} per dollar instead of ${cents(LITO.phaseOut1.rate)}.`,
      href: "/low-income-tax-offset/",
    },
    {
      id: "lito-nil",
      kind: "lito",
      at: LITO.nilOffsetIncome,
      name: "LITO cut-out",
      incomeYear: fy,
      change: `No Low Income Tax Offset is left; the bracket tax is paid in full.`,
      href: "/low-income-tax-offset/",
    },
    {
      id: "hecs-start",
      kind: "hecs",
      at: HECS_HELP.minimumThreshold,
      name: "HECS-HELP repayment threshold",
      incomeYear: fy,
      change: `With a study loan, repayments start at ${cents(h1.marginalRate)} per dollar of repayment income above ${formatAUD(HECS_HELP.minimumThreshold)}.`,
      href: "/hecs-help-calculator/",
    },
    {
      id: "mls-1",
      kind: "mls",
      at: s.tier1.min - 1,
      name: "Medicare levy surcharge, tier 1",
      incomeYear: fy,
      change: `Singles without private hospital cover pay a ${pc(s.tier1.rate)} surcharge on their whole income for MLS purposes, about ${formatAUD(s.tier1.min * s.tier1.rate)} from the first dollar over.`,
      href: "/medicare-levy-surcharge-calculator/",
    },
    {
      id: "mls-2",
      kind: "mls",
      at: s.tier2.min - 1,
      name: "Medicare levy surcharge, tier 2",
      incomeYear: fy,
      change: `The surcharge for singles without hospital cover rises from ${pc(s.tier1.rate)} to ${pc(s.tier2.rate)} of the whole income.`,
      href: "/medicare-levy-surcharge-calculator/",
    },
    {
      id: "hecs-17",
      kind: "hecs",
      at: h2.min - 1,
      name: "HECS-HELP higher band",
      incomeYear: fy,
      change: `With a study loan, repayments become ${formatAUD(h2.base)} plus ${cents(h2.marginalRate)} per dollar above ${formatAUD(h2.min - 1)}, up from ${cents(h1.marginalRate)}.`,
      href: "/hecs-help-calculator/",
    },
    {
      id: "bracket-37",
      kind: "income-tax",
      at: b37.min - 1,
      name: `${pc(b37.rate)} tax rate`,
      incomeYear: fy,
      change: `Each dollar above ${formatAUD(b37.min - 1)} is taxed at ${cents(b37.rate)} instead of ${cents(b30.rate)}.`,
      href: "/tax-brackets/",
    },
    {
      id: "mls-3",
      kind: "mls",
      at: s.tier3.min - 1,
      name: "Medicare levy surcharge, tier 3",
      incomeYear: fy,
      change: `The surcharge for singles without hospital cover reaches its top rate of ${pc(s.tier3.rate)} of the whole income.`,
      href: "/medicare-levy-surcharge-calculator/",
    },
    {
      id: "hecs-flat",
      kind: "hecs",
      at: h3.min - 1,
      name: "HECS-HELP flat-rate band",
      incomeYear: fy,
      change: `With a study loan, the repayment becomes a flat ${pc(h3.marginalRate)} of total repayment income, the top of the scale.`,
      href: "/hecs-help-calculator/",
    },
    {
      id: "bracket-45",
      kind: "income-tax",
      at: b45.min - 1,
      name: `${pc(b45.rate)} tax rate`,
      incomeYear: fy,
      change: `Each dollar above ${formatAUD(b45.min - 1)} is taxed at the top rate of ${cents(b45.rate)} instead of ${cents(b37.rate)}.`,
      href: "/tax-brackets/",
    },
    {
      id: "div293",
      kind: "div293",
      at: DIV293_SALARY_EQUIVALENT,
      name: "Division 293 threshold",
      incomeYear: fy,
      change: `Salary plus ${pc(SUPER_GUARANTEE.rate)} employer super passes ${formatAUD(DIVISION_293.threshold)}, so an extra ${pc(DIVISION_293.rate)} tax applies to concessional contributions.`,
      href: "/division-293-tax/",
    },
    {
      id: "super-max-base",
      kind: "super",
      at: SUPER_GUARANTEE.maxContributionBaseAnnual,
      name: "Super maximum contribution base",
      incomeYear: fy,
      change: `Employer super stops rising: the super guarantee is owed only on the first ${formatAUD(SUPER_GUARANTEE.maxContributionBaseAnnual)}, a maximum of ${formatAUD(SUPER_GUARANTEE.maxSGAnnual)} a year.`,
      href: "/concessional-contributions-cap/",
    },
  ];
  return list.sort((a, b) => a.at - b.at);
}

function position(t: Threshold, salary: number): ThresholdPosition {
  const status: ThresholdStatus = salary > t.at ? "passed" : salary === t.at ? "at" : "ahead";
  return { ...t, distance: Math.abs(salary - t.at), status };
}

export interface ThresholdsNear {
  salary: number;
  /** Thresholds within ±window of the salary, sorted by `at`. */
  near: ThresholdPosition[];
  /** First threshold above the window, or null when none is left. */
  nextBeyond: ThresholdPosition | null;
  /** Last threshold below the window, or null. */
  lastBefore: ThresholdPosition | null;
}

export function thresholdsNear(salary: number, window: number = THRESHOLD_WINDOW): ThresholdsNear {
  const all = allThresholds();
  const near = all.filter((t) => Math.abs(salary - t.at) <= window).map((t) => position(t, salary));
  const above = all.filter((t) => t.at > salary + window);
  const below = all.filter((t) => t.at < salary - window);
  return {
    salary,
    near,
    nextBeyond: above.length ? position(above[0], salary) : null,
    lastBefore: below.length ? position(below[below.length - 1], salary) : null,
  };
}

/** "$3,001 above $120,000" style distance text for a threshold position. */
export function distanceText(t: ThresholdPosition, salary: number): string {
  const s = formatAUD(salary);
  if (t.status === "at") return `At ${s}: the next dollar crosses it`;
  if (t.status === "passed") return `Passed: ${formatAUD(t.distance)} below ${s}`;
  return `${formatAUD(t.distance)} above ${s}`;
}
