// =============================================================================
// ADF pay scales — registry, hand-transcribed small schedules, derived figures.
//
// Salary tables and pay-grade listings are GENERATED (salaries.ts,
// pay-grades.ts). The three small schedules below were transcribed by hand
// from PACMAN on 23 September 2026 and are asserted in tests:
//   - Schedule B.10 Parts 1 and 2 — Service Warrant Officer and Warrant
//     Officer Class 1 (Permanent Forces)
//   - Schedule B.13 Part 1 — Trainee salary rates (Permanent Forces), the
//     recruit and initial-training rows only
// All carry the PACMAN note "ADF Military Salary - 6 November 2025".
//
// Not published here, deliberately:
//   - Reserve daily rates (PACMAN Part 2 of each schedule).
//   - Specialist officer structures (medical, dental, legal, chaplain,
//     aviation), senior officers (1-star and above), cyber and nuclear
//     submariner divisions.
//   - Allowances and the ADF Military Factor. PACMAN's allowance-rate page
//     (Chapter 4 Part 2F) returned 403 when we tried to read it, so no
//     allowance dollar figure appears on these pages.
// =============================================================================

import { calculatePayBreakdown } from "../../constants/australian-tax";
import { OTHER_RANK_PAY_GRADES } from "./pay-grades";
import { OFFICER_SALARIES, OTHER_RANK_SALARIES } from "./salaries";
import type { AdfService, AdfServiceKey, AdfServiceSlug, PayGradeEntry, RankSalaryTable } from "./types";
import { ADF_SERVICE_SLUGS } from "./types";

export const ADF_PAY_EFFECTIVE = "6 November 2025";
export const ADF_PAY_VERIFIED_ON = "23 September 2026";

export const PACMAN_URLS = {
  salaries: "https://pay-conditions.defence.gov.au/pacman/manual/chapter-3/part-1",
  otherRanks: "https://pay-conditions.defence.gov.au/pacman/chapter-3/part-1/schedule-b12",
  officers: "https://pay-conditions.defence.gov.au/pacman/chapter-3/part-1/schedule-b3",
  warrantOfficers: "https://pay-conditions.defence.gov.au/pacman/chapter-3/part-1/schedule-b10",
  trainees: "https://pay-conditions.defence.gov.au/pacman/chapter-3/part-1/schedule-b13",
  otherRankPayGrades: "https://pay-conditions.defence.gov.au/pacman/chapter-3/part-1/schedule-b11",
  officerPayGrades: "https://pay-conditions.defence.gov.au/pacman/chapter-3/part-1/schedule-b2",
} as const;

export const ADF_SERVICES: Record<AdfServiceSlug, AdfService> = {
  army: { slug: "army", key: "army", name: "Army", fullName: "Australian Army" },
  navy: { slug: "navy", key: "navy", name: "Navy", fullName: "Royal Australian Navy" },
  "air-force": { slug: "air-force", key: "airForce", name: "Air Force", fullName: "Royal Australian Air Force" },
};

export const ADF_SERVICE_LIST: AdfService[] = ADF_SERVICE_SLUGS.map((s) => ADF_SERVICES[s]);

export function getAdfService(slug: string): AdfService | undefined {
  return (ADF_SERVICE_SLUGS as readonly string[]).includes(slug) ? ADF_SERVICES[slug as AdfServiceSlug] : undefined;
}

// ---------------------------------------------------------------------------
// Schedule B.10 — Service Warrant Officers and Warrant Officer Class 1.
// ---------------------------------------------------------------------------

/** Part 1: Service Warrant Officer, a single yearly rate. */
export const SERVICE_WARRANT_OFFICER_SALARY = 169_795;

/**
 * Part 2: Warrant Officer Class 1, by tier. PACMAN prints "-" for pay grades a
 * tier does not use; those are null. Highest tier first, as PACMAN orders them.
 * In PACMAN's pay-grade schedules WO1 is used across all three services (the
 * Navy and Air Force rank title is "Warrant Officer").
 */
export const WO1_SALARIES: RankSalaryTable = {
  id: "wo1",
  group: "other-ranks",
  pacmanHeading: "Warrant Officer Class 1",
  names: { navy: "Warrant Officer", army: "Warrant Officer Class 1", airForce: "Warrant Officer" },
  rows: [
    { increment: "Tier C", salaries: [null, null, null, null, null, null, null, 156_144, 162_712, 169_795] },
    { increment: "Tier B", salaries: [null, null, null, 134_419, 139_245, 144_452, 150_074, 156_144, 162_712, 169_795] },
    { increment: "Tier A2", salaries: [119_455, 122_679, 126_815, 131_275, 136_098, 141_304, 146_930, 153_002, 159_562, 166_648] },
    { increment: "Tier A1", salaries: [117_408, 120_630, 124_762, 129_230, 134_052, 139_253, 144_881, 150_955, 157_512, 164_598] },
  ],
};

// ---------------------------------------------------------------------------
// Schedule B.13 Part 1 — trainees (Permanent Forces). Only the rows that apply
// to ordinary recruits and initial trade training.
// ---------------------------------------------------------------------------

export const TRAINEE_SALARIES: { label: string; salary: number }[] = [
  { label: "Normal entry recruit during basic recruit training", salary: 60_517 },
  { label: "Initial category, trade or employment training — first 6 months", salary: 69_162 },
  { label: "Initial category, trade or employment training — 6 to 12 months", salary: 72_621 },
  { label: "Initial category, trade or employment training — 12 months or more", salary: 76_079 },
];

// ---------------------------------------------------------------------------
// Derived figures.
// ---------------------------------------------------------------------------

export { OTHER_RANK_SALARIES, OFFICER_SALARIES, OTHER_RANK_PAY_GRADES };

/** Every published salary in a table, ignoring nulls. */
export function tableSalaries(table: RankSalaryTable): number[] {
  return table.rows.flatMap((r) => r.salaries.filter((x): x is number => x !== null));
}

export function salaryRange(table: RankSalaryTable): { min: number; max: number } {
  const all = tableSalaries(table);
  return { min: Math.min(...all), max: Math.max(...all) };
}

/** The rank name for a service, falling back to PACMAN's heading. */
export function rankName(table: RankSalaryTable, key: AdfServiceKey): string | null {
  return table.names[key];
}

/** Tables that apply to a service (drops Army-only ranks from Navy/Air Force). */
export function tablesForService(tables: RankSalaryTable[], key: AdfServiceKey): RankSalaryTable[] {
  return tables.filter((t) => t.names[key] !== null);
}

/** Employment categories at a pay grade for a service. */
export function categoriesAtPayGrade(key: AdfServiceKey, payGrade: number): PayGradeEntry[] {
  return OTHER_RANK_PAY_GRADES[key][payGrade] ?? [];
}

export function formatCategory(e: PayGradeEntry): string {
  return e.grade ? `${e.category} (${e.grade})` : e.category;
}

/**
 * Take-home on an ADF salary with the same engine as /take-home-pay-on/:
 * 2026-27 resident rates, LITO, Medicare levy, no HECS, no Medicare levy
 * surcharge.
 *
 * MEDICARE LEVY: the ATO's Category 1 exemption applies to a member entitled
 * to full free medical treatment for all conditions under Defence Force
 * arrangements — a full exemption if all their dependants are also entitled
 * to free medical treatment, otherwise generally half. We can't
 * know a reader's family situation, so we return both the standard figure and
 * the figure with the levy fully exempted, and the page explains the
 * difference. Source: ATO, "Category 1: Medical exemption from Medicare levy".
 */
export function adfTakeHome(salary: number): {
  net: number;
  netFortnightly: number;
  medicareLevy: number;
  netIfLevyExempt: number;
} {
  const b = calculatePayBreakdown({ grossSalary: salary, includeHECS: false, hasPrivateHealth: true });
  return {
    net: b.takeHomePay,
    netFortnightly: b.fortnightly,
    medicareLevy: b.medicareLevy,
    netIfLevyExempt: b.takeHomePay + b.medicareLevy,
  };
}

export const ATO_MEDICARE_DEFENCE_URL =
  "https://www.ato.gov.au/individuals-and-families/medicare-and-private-health-insurance/medicare-levy/medicare-levy-exemption/medical-exemption-from-medicare-levy";

export * from "./types";
