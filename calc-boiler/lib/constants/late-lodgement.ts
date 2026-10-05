// =============================================================================
// Late tax return — failure-to-lodge (FTL) penalty for an individual
// Run tests with: npm test
//
// Sources, all ato.gov.au, read 5 October 2026 via Firecrawl:
//  - "Failure to lodge on time penalty" (QC33410, last updated 22 Jun 2026):
//    "The base FTL penalty is calculated at the rate of one penalty unit for
//    every 28 days (or part thereof) that the document is overdue, up to a
//    maximum of 5 penalty units." The base amount applies to individuals and
//    small withholders. "Generally, we will not issue you with an FTL penalty
//    notice for a late-lodged tax return ... if the lodgment results in either
//    a refund or a nil result, unless: the FTL penalty was applied before the
//    return or statement was lodged ...". "Generally, we don't apply penalties
//    in isolated cases of late lodgment" and the ATO warns "by phone or in
//    writing before we apply an FTL penalty and issue you a notice to lodge".
//    Remission can be requested after lodging; registered-agent safe harbour
//    applies if you gave the agent everything in time.
//  - "Penalty units" (last updated 26 Jun 2026): $364 on or after 1 July 2026;
//    $330 from 7 November 2024 to 30 June 2026.
//  - Weekend due dates move to the next business day (QC34577), handled by
//    nextBusinessDay() in tax-calendar-2026-27.ts. 31 Oct 2026 is a Saturday,
//    so the effective self-lodge date is Monday 2 November 2026.
//
// The penalty-unit value the ATO applies depends on when the failure occurred;
// this module picks it from the (effective) due date and says so on the page.
// Only due dates from 7 Nov 2024 are supported — the earlier value is not
// verified here.
// =============================================================================

import { PENALTY_UNIT, nextBusinessDay } from "./tax-calendar-2026-27";

export const FTL_RULES = {
  daysPerUnit: PENALTY_UNIT.ftlDaysPerUnit,
  maxUnits: PENALTY_UNIT.ftlMaxUnits,
} as const;

/** First day each penalty-unit value applies, newest first. */
export const PENALTY_UNIT_PERIODS: readonly { from: string; amount: number }[] = [
  { from: "2026-07-01", amount: PENALTY_UNIT.amount },
  { from: "2024-11-07", amount: PENALTY_UNIT.previousAmount },
];

function toUtc(iso: string): number {
  const [y, m, d] = iso.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

/** Whole calendar days from `fromIso` to `toIso` (negative if `toIso` is earlier). */
export function daysBetween(fromIso: string, toIso: string): number {
  return Math.round((toUtc(toIso) - toUtc(fromIso)) / 86_400_000);
}

/** Penalty units for a return that is `daysOverdue` days late: 1 per 28 days or part, max 5. */
export function ftlPenaltyUnits(daysOverdue: number): number {
  if (!Number.isFinite(daysOverdue) || daysOverdue <= 0) return 0;
  return Math.min(FTL_RULES.maxUnits, Math.ceil(daysOverdue / FTL_RULES.daysPerUnit));
}

/** Penalty-unit dollar value for a failure on `dueIso`, or null before 7 Nov 2024 (not verified). */
export function penaltyUnitAmountOn(dueIso: string): number | null {
  const p = PENALTY_UNIT_PERIODS.find((x) => dueIso >= x.from);
  return p ? p.amount : null;
}

export interface FtlInput {
  /** The published due date (e.g. 2026-10-31). Moved to the next business day if it falls on a weekend or holiday. */
  dueIso: string;
  lodgedIso: string;
}

export interface FtlResult {
  effectiveDueIso: string;
  daysOverdue: number;
  units: number;
  unitAmount: number | null;
  /** Dollars the ATO can charge an individual; null if the unit value is not supported. */
  penalty: number | null;
  /** Units are capped: more days late adds nothing. */
  atMaximum: boolean;
  /** First date by which the penalty reaches its maximum (effective due date + 112 days). */
  maximumReachedIso: string;
}

function addDays(iso: string, n: number): string {
  const d = new Date(toUtc(iso) + n * 86_400_000);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}

export function ftlPenalty(input: FtlInput): FtlResult {
  const effectiveDueIso = nextBusinessDay(input.dueIso);
  const daysOverdue = Math.max(0, daysBetween(effectiveDueIso, input.lodgedIso));
  const units = ftlPenaltyUnits(daysOverdue);
  const unitAmount = penaltyUnitAmountOn(effectiveDueIso);
  return {
    effectiveDueIso,
    daysOverdue,
    units,
    unitAmount,
    penalty: unitAmount === null ? null : units * unitAmount,
    atMaximum: units === FTL_RULES.maxUnits,
    maximumReachedIso: addDays(effectiveDueIso, (FTL_RULES.maxUnits - 1) * FTL_RULES.daysPerUnit + 1),
  };
}
