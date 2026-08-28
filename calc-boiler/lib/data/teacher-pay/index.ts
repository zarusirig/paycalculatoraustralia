// =============================================================================
// Public-school teacher pay scales — aggregated registry.
//
// One file per state or territory. Add a state by transcribing its department
// salary schedule or enterprise agreement into lib/data/teacher-pay/<slug>.ts
// and registering it below. Every state must be registered: the dynamic route
// builds a page for all eight, and a state whose scale could not be verified
// still gets a page that says so rather than a page carrying invented numbers.
// =============================================================================

import type { TeacherPayState, TeacherStateSlug } from "./types";
import { TEACHER_STATE_SLUGS } from "./types";
import { NSW_TEACHER_PAY } from "./nsw";
import { VIC_TEACHER_PAY } from "./vic";
import { QLD_TEACHER_PAY } from "./qld";
import { WA_TEACHER_PAY } from "./wa";
import { SA_TEACHER_PAY } from "./sa";
import { TAS_TEACHER_PAY } from "./tas";
import { ACT_TEACHER_PAY } from "./act";
import { NT_TEACHER_PAY } from "./nt";

export const TEACHER_PAY_BY_STATE: Readonly<Record<TeacherStateSlug, TeacherPayState>> = {
  nsw: NSW_TEACHER_PAY,
  vic: VIC_TEACHER_PAY,
  qld: QLD_TEACHER_PAY,
  wa: WA_TEACHER_PAY,
  sa: SA_TEACHER_PAY,
  tas: TAS_TEACHER_PAY,
  act: ACT_TEACHER_PAY,
  nt: NT_TEACHER_PAY,
};

/** Every state, in the order the hub lists them. */
export const TEACHER_PAY_STATES: TeacherPayState[] = TEACHER_STATE_SLUGS.map(
  (slug) => TEACHER_PAY_BY_STATE[slug],
);

export function isTeacherStateSlug(value: string): value is TeacherStateSlug {
  return (TEACHER_STATE_SLUGS as readonly string[]).includes(value);
}

export function getTeacherPayState(slug: string): TeacherPayState | undefined {
  return isTeacherStateSlug(slug) ? TEACHER_PAY_BY_STATE[slug] : undefined;
}

// ---------------------------------------------------------------------------
// Linking a gross salary to the site's own take-home page.
//
// app/sitemap.ts generates /take-home-pay-on/N/ for N from 30,000 to 200,000 in
// steps of 5,000. A teacher salary is almost never a round 5,000, so we link to
// the NEAREST page that exists and the UI says so — we never pretend the linked
// page is the exact salary.
// ---------------------------------------------------------------------------

export const TAKE_HOME_MIN = 30_000;
export const TAKE_HOME_MAX = 200_000;
export const TAKE_HOME_STEP = 5_000;

/**
 * The nearest /take-home-pay-on/N/ amount that actually exists.
 *
 * Rounds to the nearest 5,000 and clamps into the generated range, so a
 * $238,676 principal salary links to the $200,000 page rather than a 404.
 * Exact ties round up, which is the same direction Math.round takes.
 */
export function nearestTakeHomeAmount(salary: number): number {
  if (!Number.isFinite(salary)) {
    throw new Error(`nearestTakeHomeAmount: expected a finite salary, got ${salary}`);
  }
  const rounded = Math.round(salary / TAKE_HOME_STEP) * TAKE_HOME_STEP;
  return Math.min(TAKE_HOME_MAX, Math.max(TAKE_HOME_MIN, rounded));
}

/** Href for the nearest take-home page. Always trailing-slashed. */
export function takeHomeHref(salary: number): string {
  return `/take-home-pay-on/${nearestTakeHomeAmount(salary)}/`;
}

/** True when the linked page is the salary itself rather than a nearby step. */
export function isExactTakeHomeAmount(salary: number): boolean {
  return nearestTakeHomeAmount(salary) === salary;
}

/** The lowest published salary in a state, or null when nothing is published. */
export function lowestPublishedSalary(state: TeacherPayState): number | null {
  const all = state.scales.flatMap((scale) => scale.steps.map((step) => step.salary));
  return all.length > 0 ? Math.min(...all) : null;
}

/** The highest published salary in a state, or null when nothing is published. */
export function highestPublishedSalary(state: TeacherPayState): number | null {
  const all = state.scales.flatMap((scale) => scale.steps.map((step) => step.salary));
  return all.length > 0 ? Math.max(...all) : null;
}

/**
 * The entry-level classroom teacher salary — the first step of the first
 * published scale. Returns null when a state has no verified scale at all.
 */
export function graduateSalary(state: TeacherPayState): number | null {
  return state.scales[0]?.steps[0]?.salary ?? null;
}

/** Top of the classroom teacher scale — the last step of the first scale. */
export function topOfClassroomScale(state: TeacherPayState): number | null {
  const steps = state.scales[0]?.steps;
  return steps && steps.length > 0 ? steps[steps.length - 1].salary : null;
}

export * from "./types";
