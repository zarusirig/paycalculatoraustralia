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
import { CO_CONTRIBUTION, DIVISION_293 } from "../../constants/super-contributions";
import { LISTO_2027_28, LISTO_CURRENT } from "../../constants/listo";
import { FTB_B } from "../../constants/centrelink-family-payments";
import { PPL_INCOME_TEST } from "../../constants/paid-parental-leave";
import { MLS_CHILD_INCREMENT } from "../../constants/medicare-levy-extra";

export type ThresholdKind = "income-tax" | "lito" | "medicare" | "mls" | "hecs" | "div293" | "super" | "super-offset" | "family";

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

/** Window either side of the salary for "near": where the range sections start. */
export const THRESHOLD_WINDOW = 15_000;

/**
 * Window for the thresholds table on /tax-on/[salary]/ (second pass, 10 Oct
 * 2026): one $5,000 grid step either side, the size of a rise or cut to the
 * next page. The next threshold beyond it and the last one passed are named
 * under the table, so nothing further away is lost.
 */
export const TABLE_WINDOW = 5_000;

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
    // Second pass (10 Oct 2026): the other income tests a salary crosses.
    {
      id: "listo",
      kind: "super-offset",
      at: LISTO_CURRENT.incomeThreshold,
      name: "Low income super tax offset limit",
      incomeYear: LISTO_CURRENT.incomeYear,
      change: `Above ${formatAUD(LISTO_CURRENT.incomeThreshold)} of adjusted taxable income the ATO no longer refunds ${pc(LISTO_CURRENT.rate)} of concessional contributions (up to ${formatAUD(LISTO_CURRENT.maxPayment)}) into super. The limit becomes ${formatAUD(LISTO_2027_28.incomeThreshold)} in ${LISTO_2027_28.incomeYear}.`,
      href: "/listo-calculator/",
    },
    {
      id: "co-contribution-lower",
      kind: "super-offset",
      at: CO_CONTRIBUTION.lowerThreshold,
      name: "Super co-contribution lower threshold",
      incomeYear: CO_CONTRIBUTION.incomeYear,
      change: `The government co-contribution (up to ${formatAUD(CO_CONTRIBUTION.maxEntitlement)} for ${formatAUD(CO_CONTRIBUTION.contributionForMax)} of after-tax contributions) shrinks by ${Number((CO_CONTRIBUTION.reductionPerDollar * 100).toFixed(3))}c per dollar of total income above ${formatAUD(CO_CONTRIBUTION.lowerThreshold)}.`,
      href: "/super-co-contribution/",
    },
    {
      id: "co-contribution-higher",
      kind: "super-offset",
      at: CO_CONTRIBUTION.higherThreshold,
      name: "Super co-contribution cut-out",
      incomeYear: CO_CONTRIBUTION.incomeYear,
      change: `No government super co-contribution on total income of ${formatAUD(CO_CONTRIBUTION.higherThreshold)} or more.`,
      href: "/super-co-contribution/",
    },
    {
      id: "ftb-b",
      kind: "family",
      at: FTB_B.primaryEarnerLimit,
      name: "Family Tax Benefit Part B limit",
      incomeYear: fy,
      change: `No FTB Part B when the primary (or single) earner's adjusted taxable income is over ${formatAUD(FTB_B.primaryEarnerLimit)}.`,
      href: "/family-tax-benefit-calculator/",
    },
    {
      id: "ppl-individual",
      kind: "family",
      at: PPL_INCOME_TEST["2025-26"].individual,
      name: "Parental Leave Pay individual income test",
      incomeYear: "2025-26",
      change: `Adjusted taxable income above ${formatAUD(PPL_INCOME_TEST["2025-26"].individual)} in the income year assessed fails the individual test; the family test (${formatAUD(PPL_INCOME_TEST["2025-26"].family)} combined) can still pass.`,
      href: "/parental-leave-pay/",
    },
    {
      id: "mls-family-1",
      kind: "mls",
      at: s.familyTier1.min - 1,
      name: "Medicare levy surcharge, family tier 1",
      incomeYear: fy,
      change: `A couple or family without hospital cover pays a ${pc(s.familyTier1.rate)} surcharge above ${formatAUD(s.familyTier1.min - 1)} of combined income for MLS purposes (plus ${formatAUD(MLS_CHILD_INCREMENT)} per child after the first).`,
      href: "/medicare-levy-surcharge-calculator/",
    },
    {
      id: "mls-family-2",
      kind: "mls",
      at: s.familyTier2.min - 1,
      name: "Medicare levy surcharge, family tier 2",
      incomeYear: fy,
      change: `The family surcharge rises from ${pc(s.familyTier1.rate)} to ${pc(s.familyTier2.rate)}.`,
      href: "/medicare-levy-surcharge-calculator/",
    },
    {
      id: "mls-family-3",
      kind: "mls",
      at: s.familyTier3.min - 1,
      name: "Medicare levy surcharge, family tier 3",
      incomeYear: fy,
      change: `The family surcharge reaches its top rate of ${pc(s.familyTier3.rate)}.`,
      href: "/medicare-levy-surcharge-calculator/",
    },
    {
      id: "ppl-family",
      kind: "family",
      at: PPL_INCOME_TEST["2025-26"].family,
      name: "Parental Leave Pay family income test",
      incomeYear: "2025-26",
      change: `No Parental Leave Pay when combined family income in the income year assessed is over ${formatAUD(PPL_INCOME_TEST["2025-26"].family)}, or a single person's own income is.`,
      href: "/parental-leave-pay/",
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

/**
 * The thresholds a move to either neighbouring /tax-on/ page would cross:
 * from the previous page's salary to the next one's (inclusive). On the
 * $5,000 part of the grid that is ±$5,000; on the high-salary tail it widens
 * with the gaps between pages. On the first and last pages it stops at the
 * salary on the side with no neighbour.
 */
export function thresholdsBetweenNeighbours(salary: number, grid: readonly number[]): ThresholdsNear & { lo: number; hi: number } {
  const i = grid.indexOf(salary);
  const prev = i > 0 ? grid[i - 1] : undefined;
  const next = i >= 0 && i < grid.length - 1 ? grid[i + 1] : undefined;
  const lo = prev ?? salary;
  const hi = next ?? salary;
  const all = allThresholds();
  const near = all.filter((t) => t.at >= lo && t.at <= hi).map((t) => position(t, salary));
  const above = all.filter((t) => t.at > hi);
  const below = all.filter((t) => t.at < lo);
  return {
    salary,
    lo,
    hi,
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
