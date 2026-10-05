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
 * The qualified-graduate classroom teacher salary: the `graduateStep` row of
 * the first published scale where the state names one, otherwise that scale's
 * first step. Returns null when a state has no verified scale at all.
 */
export function graduateSalary(state: TeacherPayState): number | null {
  const steps = state.scales[0]?.steps;
  if (!steps || steps.length === 0) return null;
  if (state.graduateStep) {
    const named = steps.find((step) => step.label === state.graduateStep);
    if (named) return named.salary;
  }
  return steps[0].salary;
}

/**
 * Top of the incremental classroom teacher scale: the `topClassroomStep` row
 * where the state names one, otherwise the last step of the first scale.
 */
export function topOfClassroomScale(state: TeacherPayState): number | null {
  const steps = state.scales[0]?.steps;
  if (!steps || steps.length === 0) return null;
  if (state.topClassroomStep) {
    const named = steps.find((step) => step.label === state.topClassroomStep);
    if (named) return named.salary;
  }
  return steps[steps.length - 1].salary;
}

/**
 * The year the page's rates are current for, from `verifiedOn` — the date the
 * figures were last confirmed against the source.
 */
export function teacherRatesYear(state: TeacherPayState): string {
  const match = state.verifiedOn.match(/\b(20\d{2})\b/);
  return match ? match[1] : "";
}

/** One row per published scale for the at-a-glance table. */
export function scaleRanges(
  state: TeacherPayState,
): { id: string; title: string; low: number; high: number; steps: number }[] {
  return state.scales
    .filter((scale) => scale.steps.length > 0)
    .map((scale) => {
      const salaries = scale.steps.map((step) => step.salary);
      return {
        id: scale.id,
        title: scale.title,
        low: Math.min(...salaries),
        high: Math.max(...salaries),
        steps: scale.steps.length,
      };
    });
}

/**
 * <title> for a state page: "{State} Teacher Salary 2026 (Scale and Step)".
 * One format for all eight so the hub and the state pages stop competing on
 * differently worded titles.
 */
export function teacherStateMetaTitle(state: TeacherPayState): string {
  return `${state.name} Teacher Salary ${teacherRatesYear(state)} (Scale and Step)`;
}

/**
 * The exact anchor text the hub uses to link to each state page, in the form
 * people search: "Victorian teacher salary 2026", "NSW teacher salary 2026".
 */
const ANCHOR_PREFIX: Readonly<Record<TeacherStateSlug, string>> = {
  nsw: "NSW",
  vic: "Victorian",
  qld: "Queensland",
  wa: "Western Australian",
  sa: "South Australian",
  tas: "Tasmanian",
  act: "ACT",
  nt: "Northern Territory",
};

export function teacherAnchorText(state: TeacherPayState): string {
  return `${ANCHOR_PREFIX[state.slug]} teacher salary ${teacherRatesYear(state)}`;
}

export interface PrincipalSummary {
  scaleId: string;
  scaleTitle: string;
  /** Plain-English line from the source scale about what sets the level. */
  intro: string;
  low: number;
  high: number;
  /** Rows counted: principal rows only, deputy and executive rows excluded. */
  rows: number;
}

/**
 * Principal salary range per principal scale a state publishes. Rows labelled
 * deputy, assistant or executive are excluded so a mixed leadership table (the
 * ACT's) reports principals only. Empty when the state publishes none.
 */
export function principalSummaries(state: TeacherPayState): PrincipalSummary[] {
  const ids = state.principalScaleIds ?? [];
  return ids.flatMap((id) => {
    const scale = state.scales.find((s) => s.id === id);
    if (!scale) return [];
    const salaries = scale.steps
      .filter((step) => !/deputy|assistant|executive|director/i.test(step.label))
      .map((step) => step.salary);
    if (salaries.length === 0) return [];
    return [{
      scaleId: scale.id,
      scaleTitle: scale.title,
      intro: scale.intro,
      low: Math.min(...salaries),
      high: Math.max(...salaries),
      rows: salaries.length,
    }];
  });
}

export * from "./types";
