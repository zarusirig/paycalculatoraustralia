// =============================================================================
// Salary-range rules for /tax-on/[salary]/ (10 Oct 2026, second pass).
//
// Each range section on the page appears only where its rule applies at that
// salary, so the page structure changes along the salary range instead of
// every page carrying every section. Every boundary is read from the verified
// constants; nothing is typed in here:
//   - Low Income Tax Offset: below LITO.nilOffsetIncome ($66,667), 2026-27.
//   - Medicare levy low-income reduction: where the engine's levy is below the
//     full 2% (to MEDICARE_LEVY.shadeInThreshold; 2025-26 thresholds, the
//     latest the ATO has published).
//   - Bracket edge: within BRACKET_EDGE_WINDOW of the 30%, 37% and 45% edges
//     (2026-27). The $18,200 edge is left to the LITO section: up to the LITO
//     nil-tax limit, crossing it costs nothing.
//   - HECS-HELP: from THRESHOLD_WINDOW below the repayment threshold (2026-27).
//   - Medicare levy surcharge: from THRESHOLD_WINDOW below the tier 1 start
//     (2026-27 tiers).
//   - Division 293: from THRESHOLD_WINDOW below the salary at which salary plus
//     employer super passes $250,000 (2026-27).
// =============================================================================

import {
  HECS_HELP,
  LITO,
  MEDICARE_LEVY,
  SUPER_GUARANTEE,
  TAX_BRACKETS,
  calculateLITO,
  calculateMedicareLevy,
  calculatePayBreakdown,
} from "../../constants/australian-tax";
import { DIVISION_293, division293Estimate } from "../../constants/super-contributions";
import { DIV293_SALARY_EQUIVALENT, THRESHOLD_WINDOW } from "./tax-on-thresholds";
import { employerSuperFor } from "./index";

/** How close to a bracket edge (either side) a salary must be for the edge section. */
export const BRACKET_EDGE_WINDOW = 5_000;

// ---------------------------------------------------------------------------
// Low Income Tax Offset
// ---------------------------------------------------------------------------

export type LitoPhase = "cancels-tax" | "full" | "phase-out-fast" | "phase-out-slow";

export interface LitoPosition {
  phase: LitoPhase;
  /** Offset at this salary (2026-27). */
  offset: number;
  /** Bracket tax before the offset. */
  taxBeforeOffset: number;
  /** Highest whole-dollar income on which the full offset cancels all the tax. */
  nilTaxLimit: number;
  /** Dollars over the point where the current phase-out starts (0 when the offset is full). */
  overPhaseStart: number;
  /** Income tax on the next dollar, bracket rate plus offset lost, 0–1. */
  nextDollarRate: number;
}

/** LITO position, or null once the offset has run out. */
export function litoPosition(salary: number): LitoPosition | null {
  if (salary >= LITO.nilOffsetIncome) return null;
  const b = calculatePayBreakdown({ grossSalary: salary });
  const nilTaxLimit = Math.floor(TAX_BRACKETS[1].min - 1 + LITO.maxOffset / TAX_BRACKETS[1].rate);
  const bracketRateNext = TAX_BRACKETS.find((t) => salary + 1 >= t.min && salary + 1 <= t.max)!.rate;
  const litoLossNext = calculateLITO(salary) - calculateLITO(salary + 1);
  const phase: LitoPhase =
    salary <= nilTaxLimit
      ? "cancels-tax"
      : salary <= LITO.fullOffsetCeiling
        ? "full"
        : salary <= LITO.phaseOut1.end
          ? "phase-out-fast"
          : "phase-out-slow";
  const overPhaseStart =
    phase === "phase-out-fast" ? salary - LITO.fullOffsetCeiling : phase === "phase-out-slow" ? salary - LITO.phaseOut1.end : 0;
  return {
    phase,
    offset: b.litoOffset,
    taxBeforeOffset: b.incomeTax,
    nilTaxLimit,
    overPhaseStart,
    nextDollarRate: salary + 1 <= nilTaxLimit ? 0 : bracketRateNext + litoLossNext,
  };
}

// ---------------------------------------------------------------------------
// Medicare levy low-income reduction (2025-26 thresholds)
// ---------------------------------------------------------------------------

export interface MedicareReduction {
  stage: "exempt" | "shade-in";
  levy: number;
  /** 2% of the whole income. */
  fullLevy: number;
  /** Income above the low-income threshold (0 when exempt). */
  overThreshold: number;
}

/** Null where the full 2% levy applies. */
export function medicareReduction(salary: number): MedicareReduction | null {
  const levy = calculateMedicareLevy(salary);
  const fullLevy = Math.round(salary * MEDICARE_LEVY.rate);
  if (levy >= fullLevy) return null;
  return {
    stage: salary <= MEDICARE_LEVY.lowIncomeThreshold ? "exempt" : "shade-in",
    levy,
    fullLevy,
    overThreshold: Math.max(0, salary - MEDICARE_LEVY.lowIncomeThreshold),
  };
}

// ---------------------------------------------------------------------------
// Bracket edges (30%, 37%, 45%)
// ---------------------------------------------------------------------------

export interface BracketEdge {
  /** Last dollar taxed at the lower rate, e.g. 135,000. */
  edge: number;
  lowerRate: number;
  upperRate: number;
  status: "below" | "at" | "above";
  /** |salary − edge|. */
  distance: number;
}

export function bracketEdgeNear(salary: number): BracketEdge | null {
  for (let i = 2; i < TAX_BRACKETS.length; i++) {
    const edge = TAX_BRACKETS[i].min - 1;
    const distance = Math.abs(salary - edge);
    if (distance <= BRACKET_EDGE_WINDOW) {
      return {
        edge,
        lowerRate: TAX_BRACKETS[i - 1].rate,
        upperRate: TAX_BRACKETS[i].rate,
        status: salary < edge ? "below" : salary === edge ? "at" : "above",
        distance,
      };
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// HECS-HELP, Medicare levy surcharge, Division 293
// ---------------------------------------------------------------------------

/** HECS-HELP section: from THRESHOLD_WINDOW below the repayment threshold. */
export function showsHecs(salary: number): boolean {
  return salary >= HECS_HELP.minimumThreshold - THRESHOLD_WINDOW;
}

export interface MlsPosition {
  tier: 0 | 1 | 2 | 3;
  rate: number;
  /** Surcharge on this salary for a single without appropriate hospital cover. */
  amount: number;
  /** Next tier up, or null in the top tier. */
  next: { tier: 1 | 2 | 3; at: number; rate: number; distance: number } | null;
  /**
   * The family tiers, when this salary is a couple's or family's only income,
   * from THRESHOLD_WINDOW below the family tier 1 start (before the $1,500
   * increase per dependent child after the first); null below that.
   */
  family: { tier: 0 | 1 | 2 | 3; rate: number; amount: number } | null;
}

/** MLS position for a single (salary as the only MLS income), or null well below tier 1. */
export function mlsPosition(salary: number): MlsPosition | null {
  const s = MEDICARE_LEVY.surcharge;
  if (salary < s.tier1.min - 1 - THRESHOLD_WINDOW) return null;
  const tiers = [
    { tier: 1 as const, min: s.tier1.min, max: s.tier1.max, rate: s.tier1.rate },
    { tier: 2 as const, min: s.tier2.min, max: s.tier2.max, rate: s.tier2.rate },
    { tier: 3 as const, min: s.tier3.min, max: s.tier3.max, rate: s.tier3.rate },
  ];
  const cur = tiers.find((t) => salary >= t.min && salary <= t.max);
  const nextT = tiers.find((t) => t.min > salary);
  const fam = [
    { tier: 1 as const, min: s.familyTier1.min, max: s.familyTier1.max, rate: s.familyTier1.rate },
    { tier: 2 as const, min: s.familyTier2.min, max: s.familyTier2.max, rate: s.familyTier2.rate },
    { tier: 3 as const, min: s.familyTier3.min, max: s.familyTier3.max, rate: s.familyTier3.rate },
  ];
  const famCur = fam.find((t) => salary >= t.min && salary <= t.max);
  return {
    tier: cur ? cur.tier : 0,
    rate: cur ? cur.rate : 0,
    amount: cur ? Math.round(salary * cur.rate) : 0,
    next: nextT ? { tier: nextT.tier, at: nextT.min, rate: nextT.rate, distance: nextT.min - salary } : null,
    family:
      salary >= s.familyTier1.min - 1 - THRESHOLD_WINDOW
        ? { tier: famCur ? famCur.tier : 0, rate: famCur ? famCur.rate : 0, amount: famCur ? Math.round(salary * famCur.rate) : 0 }
        : null,
  };
}

export interface Div293Position {
  stage: "below" | "part" | "all";
  employerSuper: number;
  superCapped: boolean;
  /** Salary plus employer super, the Division 293 test total when nothing else counts. */
  total: number;
  /** total − $250,000 (negative below the threshold). */
  excess: number;
  amount: number;
}

/** Division 293 position, or null well below the threshold. */
export function div293Position(salary: number): Div293Position | null {
  if (salary < DIV293_SALARY_EQUIVALENT - THRESHOLD_WINDOW) return null;
  const sg = employerSuperFor(salary);
  const total = salary + sg.amount;
  const excess = total - DIVISION_293.threshold;
  return {
    stage: excess <= 0 ? "below" : excess < sg.amount ? "part" : "all",
    employerSuper: sg.amount,
    superCapped: sg.capped,
    total,
    excess,
    amount: division293Estimate(salary, sg.amount),
  };
}

/** Employer super at the maximum contribution base (2026-27). */
export const MAX_EMPLOYER_SUPER = Math.round(SUPER_GUARANTEE.maxSGAnnual);

// ---------------------------------------------------------------------------
// Which sections and FAQs a page carries
// ---------------------------------------------------------------------------

export type RangeSection = "lito" | "medicare" | "edge" | "mls" | "hecs" | "div293";

/** The range sections shown at this salary, in page order. */
export function rangeSections(salary: number): RangeSection[] {
  const out: RangeSection[] = [];
  if (litoPosition(salary)) out.push("lito");
  if (medicareReduction(salary)) out.push("medicare");
  if (bracketEdgeNear(salary)) out.push("edge");
  if (mlsPosition(salary)) out.push("mls");
  if (showsHecs(salary)) out.push("hecs");
  if (div293Position(salary)) out.push("div293");
  return out;
}

export type TaxOnFaqId = "total" | RangeSection | "placement" | "thresholds";

/**
 * FAQ questions for a page: the total-tax answer, then two more, range
 * rules first (most specific to the salary), then where it ranks among
 * earners, then the thresholds nearby.
 */
export function taxOnFaqIds(salary: number, extra = 2): TaxOnFaqId[] {
  const order: RangeSection[] = ["lito", "medicare", "edge", "div293", "mls", "hecs"];
  const have = new Set(rangeSections(salary));
  const picks: TaxOnFaqId[] = order.filter((id) => have.has(id));
  picks.push("placement", "thresholds");
  return ["total", ...picks.slice(0, extra)];
}
