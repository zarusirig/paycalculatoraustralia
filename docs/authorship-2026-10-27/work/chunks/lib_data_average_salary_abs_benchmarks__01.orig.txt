// =============================================================================
// ABS pay benchmarks as annual salaries — the group averages and medians
// already verified in ./index.ts (AWE May 2026, EE August 2025), flattened
// into one list so a salary page can name the published figures nearest to it.
//
// No figure is typed in here: every value is a constant from ./index.ts,
// annualised (weekly × 52) exactly as /average-salary-australia/ shows it.
// =============================================================================

import {
  AWE_BY_INDUSTRY,
  AWE_BY_STATE,
  AWE_HEADLINE,
  AWE_RELEASE,
  EE_MEDIAN,
  EE_MEDIAN_BY_AGE,
  EE_MEDIAN_BY_INDUSTRY,
  EE_MEDIAN_BY_STATE,
  EE_RELEASE,
  annualise,
  type AbsRelease,
} from "./index";

export interface AbsBenchmark {
  id: string;
  /** What is measured, e.g. "Average full-time earnings". */
  measure: string;
  /** Who, as a phrase: "in Mining", "in Queensland", "for women", "aged 25–34". */
  group: string;
  weekly: number;
  annual: number;
  release: AbsRelease;
}

const AWE_FT = "Average full-time earnings";
const EE_ALL = "Median earnings, all employees";
const EE_FT = "Median full-time earnings";

/** "in Queensland", "in the Northern Territory". */
function inPlace(label: string): string {
  return /Territory$/.test(label) ? `in the ${label}` : `in ${label}`;
}

function b(id: string, measure: string, group: string, weekly: number, release: AbsRelease): AbsBenchmark {
  return { id, measure, group, weekly, annual: annualise(weekly), release };
}

/**
 * Every benchmark, sorted by annual value. The three national headline figures
 * (all-employee median, full-time median, full-time average) are left out:
 * the salary pages quote those for every salary.
 */
export function absBenchmarks(): AbsBenchmark[] {
  const list: AbsBenchmark[] = [
    b("awe-ft-male", AWE_FT, "for men", AWE_HEADLINE.maleFullTimeOrdinaryWeekly, AWE_RELEASE),
    b("awe-ft-female", AWE_FT, "for women", AWE_HEADLINE.femaleFullTimeOrdinaryWeekly, AWE_RELEASE),
    b("ee-ft-male", EE_FT, "for men", EE_MEDIAN.maleFullTime, EE_RELEASE),
    b("ee-ft-female", EE_FT, "for women", EE_MEDIAN.femaleFullTime, EE_RELEASE),
    ...AWE_BY_INDUSTRY.map((r) => b(`awe-ind-${r.label}`, AWE_FT, `in ${r.label}`, r.weekly, AWE_RELEASE)),
    ...AWE_BY_STATE.map((r) => b(`awe-state-${r.code}`, AWE_FT, inPlace(r.label), r.weekly, AWE_RELEASE)),
    ...EE_MEDIAN_BY_INDUSTRY.map((r) => b(`ee-ind-${r.label}`, EE_ALL, `in ${r.label}`, r.weekly, EE_RELEASE)),
    ...EE_MEDIAN_BY_STATE.map((r) => b(`ee-state-${r.code}`, EE_FT, inPlace(r.label), r.fullTime, EE_RELEASE)),
    ...EE_MEDIAN_BY_AGE.map((r) => b(`ee-age-${r.label}`, EE_FT, `aged ${r.label}`, r.fullTime, EE_RELEASE)),
  ];
  return list.sort((x, y) => x.annual - y.annual || x.id.localeCompare(y.id));
}

/**
 * Benchmarks whose annual value rounds to `salary` on a grid of `step`
 * (Math.round(annual / step) × step). On a $5,000 grid every benchmark lands
 * on exactly one page, so neighbouring pages never list the same figure.
 */
export function benchmarksRoundingTo(salary: number, step = 5_000): AbsBenchmark[] {
  return absBenchmarks().filter((x) => Math.round(x.annual / step) * step === salary);
}

/** Nearest benchmark strictly below and strictly above a salary (null at either end). */
export function nearestBenchmarks(salary: number): { below: AbsBenchmark | null; above: AbsBenchmark | null } {
  const all = absBenchmarks();
  const below = all.filter((x) => x.annual < salary);
  const above = all.filter((x) => x.annual > salary);
  return { below: below.length ? below[below.length - 1] : null, above: above.length ? above[0] : null };
}

export interface BenchmarkGroup {
  measure: string;
  annual: number;
  release: AbsRelease;
  groups: string[];
}

/** Merge benchmarks that share a measure and a value ("Construction, Education & training … $78,000"). */
export function groupBenchmarks(list: readonly AbsBenchmark[]): BenchmarkGroup[] {
  const out: BenchmarkGroup[] = [];
  for (const x of list) {
    const hit = out.find((g) => g.measure === x.measure && g.annual === x.annual && g.release.id === x.release.id);
    if (hit) hit.groups.push(x.group);
    else out.push({ measure: x.measure, annual: x.annual, release: x.release, groups: [x.group] });
  }
  return out;
}
