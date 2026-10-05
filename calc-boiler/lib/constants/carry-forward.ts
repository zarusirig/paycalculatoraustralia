// =============================================================================
// Carry-forward (catch-up) concessional contributions, year by year
// Run tests with: npm test
//
// Rules and caps come from super-contributions.ts (CARRY_FORWARD,
// CONCESSIONAL_CAP_BY_YEAR, carryForwardWindow) and australian-tax.ts
// (SUPER_GUARANTEE.concessionalCap = $32,500 from 1 July 2026). Re-read on the
// ATO's "Concessional contributions cap" page (QC19749, last updated 2 July
// 2026) on 5 October 2026:
//  - "From 1 July 2026, the concessional contributions cap is $32,500";
//    $30,000 for 2024-25 and 2025-26; $27,500 for 2021-22 to 2023-24.
//  - Eligible if "a total super balance of less than $500,000 at 30 June of
//    the previous financial year" (plus the unused amounts themselves).
//  - "You can carry forward unused cap amounts from up to 5 previous financial
//    years", "starting from 2018-19", "including when you were not a member of
//    a super fund".
//  - "Unused cap amounts are available for 5 years and expire after this. For
//    example, a 2020-21 unused cap amount that is not used by the end of
//    2025-26 will expire." So a 2021-22 amount is last usable in 2026-27.
//  - "The oldest available unused cap amounts are carried forward first."
//  - Contributions count "in the year your super fund receives them".
//  - Your available amounts are in ATO online services (myGov: Super,
//    Information, Carry forward concessional contributions).
// Notice of intent: ATO "Personal super contributions" (read 5 Oct 2026): to
// claim a deduction for a personal contribution you must give your fund a
// notice in the approved form and get its acknowledgment.
//
// WHAT IS MODELLED. For each of the five prior years: unused = cap that year
// minus concessional contributions made that year (never below nil). Those are
// added to this year's general cap if the balance test is passed, and are drawn
// oldest first. Contributions "this year" are employer super guarantee, salary
// sacrifice, other employer contributions and personal deductible contributions
// combined; they are the figure the ATO compares with your cap.
// =============================================================================

import { SUPER_GUARANTEE } from "./australian-tax";
import { CARRY_FORWARD, CONCESSIONAL_CAP_BY_YEAR, CONTRIBUTIONS_TAX_RATE, carryForwardWindow } from "./super-contributions";

export interface CarryForwardRow {
  year: string;
  cap: number;
  contributed: number;
  unused: number;
  /** Last income year the unused amount can be used in. */
  usableUntil: string;
  /** Amount of this year's unused cap used by contributions above the general cap (oldest first). */
  used: number;
  /** Still unused after this year's contributions. */
  remaining: number;
  /** True for the oldest year: its remaining amount expires on 30 June of the target year. */
  expiresAtEndOfTarget: boolean;
}

export interface CarryForwardInput {
  targetYear?: string;
  /** Concessional contributions made in each prior year, keyed by income year ("2021-22"...). */
  contributedByYear: Readonly<Record<string, number>>;
  /** Total super balance at 30 June of the year before the target year. */
  totalSuperBalance: number;
  /** Concessional contributions already made or planned in the target year. */
  contributionsThisYear: number;
}

export interface CarryForwardPlan {
  targetYear: string;
  generalCap: number;
  rows: CarryForwardRow[];
  totalUnused: number;
  eligible: boolean;
  /** Unused amounts you can actually use (nil if the balance test fails). */
  available: number;
  /** General cap plus available carry-forward. */
  availableCap: number;
  /** Extra you can still contribute this year before reaching the available cap. */
  headroom: number;
  /** Contributions above the available cap. */
  excess: number;
  /** Contributions above the general cap that are covered by carry-forward. */
  usedFromCarryForward: number;
  /** Unused amounts that will expire at 30 June of the target year if not used. */
  expiringThisYear: number;
}

const round2 = (n: number) => Math.round(n * 100) / 100;
const nn = (n: number) => (Number.isFinite(n) ? Math.max(0, n) : 0);

/** Next income year label: "2026-27" -> "2027-28". */
function nextYear(fy: string): string {
  const start = Number(fy.slice(0, 4)) + 1;
  return `${start}-${String((start + 1) % 100).padStart(2, "0")}`;
}

/** The last year an unused amount from `year` can be used: five years later. */
export function usableUntil(year: string): string {
  let y = year;
  for (let i = 0; i < CARRY_FORWARD.years; i++) y = nextYear(y);
  return y;
}

export function carryForwardPlan(input: CarryForwardInput): CarryForwardPlan {
  const targetYear = input.targetYear ?? "2026-27";
  const generalCap = targetYear === "2026-27" ? SUPER_GUARANTEE.concessionalCap : (CONCESSIONAL_CAP_BY_YEAR[targetYear] ?? SUPER_GUARANTEE.concessionalCap);
  const window = carryForwardWindow(targetYear);
  const eligible = nn(input.totalSuperBalance) < CARRY_FORWARD.totalSuperBalanceLimit;

  const rows: CarryForwardRow[] = window.map((w, i) => {
    const contributed = nn(input.contributedByYear[w.year] ?? 0);
    const unused = round2(Math.max(0, w.cap - contributed));
    return {
      year: w.year,
      cap: w.cap,
      contributed,
      unused,
      usableUntil: usableUntil(w.year),
      used: 0,
      remaining: unused,
      expiresAtEndOfTarget: i === 0 && window.length === CARRY_FORWARD.years,
    };
  });

  const totalUnused = round2(rows.reduce((s, r) => s + r.unused, 0));
  const available = eligible ? totalUnused : 0;
  const availableCap = generalCap + available;
  const thisYear = nn(input.contributionsThisYear);

  // Draw down oldest first (rows are oldest first already).
  let toCover = eligible ? Math.max(0, thisYear - generalCap) : 0;
  for (const r of rows) {
    const take = Math.min(r.unused, toCover);
    r.used = round2(take);
    r.remaining = round2(r.unused - take);
    toCover = round2(toCover - take);
  }
  const usedFromCarryForward = round2(rows.reduce((s, r) => s + r.used, 0));
  const expiringThisYear = eligible ? round2(rows.filter((r) => r.expiresAtEndOfTarget).reduce((s, r) => s + r.remaining, 0)) : 0;

  return {
    targetYear,
    generalCap,
    rows,
    totalUnused,
    eligible,
    available,
    availableCap,
    headroom: round2(Math.max(0, availableCap - thisYear)),
    excess: round2(Math.max(0, thisYear - availableCap)),
    usedFromCarryForward,
    expiringThisYear,
  };
}

/**
 * Marginal income tax rate plus Medicare levy on taxable income, for the
 * deduction-saving estimate. 2% levy is applied above the point where the
 * levy is fully phased in (it is a floor on the saving for lower incomes).
 */
export function deductionSaving(extraDeductible: number, marginalIncomeRate: number, includeMedicare = true): number {
  const levy = includeMedicare ? 0.02 : 0;
  return round2(nn(extraDeductible) * Math.max(0, marginalIncomeRate + levy - CONTRIBUTIONS_TAX_RATE));
}
