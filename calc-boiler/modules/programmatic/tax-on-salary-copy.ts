// Salary-specific copy for /tax-on/[salary]/ (10 Oct 2026), shared by the
// page sections and the FAQ so the two never disagree. Every figure comes from
// the tax engine, the verified constants or the ABS data in
// lib/data/average-salary; the wording branches on those facts (bracket
// reached, thresholds within $15,000, position among earners) so neighbouring
// pages say different things, not the same sentence with new numbers.

import {
  calculatePayBreakdown,
  EMPLOYMENT,
  LITO,
  SITE_CONFIG,
  TAX_BRACKETS,
  formatAUD,
} from "@/lib/constants/australian-tax";
import { TAX_ON_SALARIES, salaryFacts } from "@/lib/data/salary-pages";
import { THRESHOLD_WINDOW, allThresholds, thresholdsBetweenNeighbours, type ThresholdPosition } from "@/lib/data/salary-pages/tax-on-thresholds";
import { AWE_HEADLINE, AWE_RELEASE, EE_MEDIAN, EE_RELEASE, annualise } from "@/lib/data/average-salary";
import { ordinal, placeAmongAllEmployees, type AllEmployeePlacement } from "@/lib/data/average-salary/all-employee-percentile";
import { benchmarksRoundingTo, groupBenchmarks, nearestBenchmarks, type AbsBenchmark } from "@/lib/data/average-salary/abs-benchmarks";
import { nearestOccupationMedians, occupationMediansRoundingTo, type OccupationMedian } from "@/lib/data/salary-pages/tax-on-occupations";

const pct = (r: number) => `${Number((r * 100).toFixed(2))}%`;

// ---------------------------------------------------------------------------
// Where the salary sits in the bracket scale
// ---------------------------------------------------------------------------

/** Threshold name for use after "the": lower-case the first letter unless it starts a proper name or acronym. */
export function inSentence(name: string): string {
  return /^(Medicare|LITO|HECS|Division|Family|Parental|\d)/.test(name) ? name : name[0].toLowerCase() + name.slice(1);
}

/** How fast LITO shrinks for the next dollar of income ("5c", "1.5c"), or null when it is not shrinking. */
export function litoShrinkAbove(salary: number): string | null {
  if (salary < LITO.fullOffsetCeiling) return null;
  if (salary < LITO.phaseOut1.end) return `${Number((LITO.phaseOut1.rate * 100).toFixed(1))}c`;
  if (salary < LITO.nilOffsetIncome) return `${Number((LITO.phaseOut2.rate * 100).toFixed(1))}c`;
  return null;
}

/** Salary sacrifice at this salary: what $1,000 costs and saves, and whether it saves tax at all. */
export function sacrificeSentence(salary: number): string {
  const f = salaryFacts(salary);
  const sac = f.sacrificeThousand;
  const saved = 1_000 - sac.takeHomeCost;
  if (saved <= 0) {
    return `Salary sacrifice saves no tax here: $1,000 sacrificed costs ${formatAUD(sac.takeHomeCost)} of take-home and adds ${formatAUD(sac.intoSuper)} to super after contributions tax.`;
  }
  return `Each $1,000 sacrificed cuts tax and Medicare here by ${formatAUD(saved)} and adds ${formatAUD(sac.intoSuper)} to super after contributions tax${sac.netGain > 0 ? `, ${formatAUD(sac.netGain)} ahead overall` : ", so it does not come out ahead"}.`;
}

/** One sentence on the bracket reached and the distance to the next rate. */
export function bracketPositionSentence(salary: number): string {
  const f = salaryFacts(salary);
  const s = formatAUD(salary);
  const b = TAX_BRACKETS[f.bracketIndex];
  const floor = b.min - 1;
  if (f.bracketIndex === 0) {
    return `${s} is inside the ${formatAUD(TAX_BRACKETS[0].max)} tax-free threshold.`;
  }
  if (f.nextBracketStart === null || f.nextBracketRate === null) {
    return `${s} reaches the top ${pct(b.rate)} rate: the ${formatAUD(salary - floor)} above ${formatAUD(floor)} is taxed at ${pct(b.rate)}, with no higher bracket to come.`;
  }
  const nextFloor = f.nextBracketStart - 1;
  if (salary === nextFloor) {
    return `${s} is the last dollar of the ${pct(b.rate)} bracket: every dollar of a pay rise is taxed at ${pct(f.nextBracketRate)}.`;
  }
  return `${s} sits ${formatAUD(salary - floor)} into the ${pct(b.rate)} bracket, ${formatAUD(nextFloor - salary)} short of the ${pct(f.nextBracketRate)} rate that starts above ${formatAUD(nextFloor)}.`;
}

/** Why the tax on the next $1,000 differs from the headline marginal rate, named from the facts. */
export function nextThousandReasons(salary: number): string[] {
  const f = salaryFacts(salary);
  const plus = calculatePayBreakdown({ grossSalary: salary + 1_000 });
  const reasons: string[] = [];
  if (f.nextBracketStart !== null && f.nextBracketRate !== null && salary + 1_000 >= f.nextBracketStart) {
    reasons.push(`part of it falls in the ${pct(f.nextBracketRate)} bracket above ${formatAUD(f.nextBracketStart - 1)}`);
  }
  if (f.breakdown.netIncomeTax === 0 && plus.netIncomeTax === 0) {
    reasons.push("the Low Income Tax Offset still cancels all the income tax");
  } else if (litoShrinkAbove(salary)) {
    reasons.push(`the Low Income Tax Offset shrinks by ${litoShrinkAbove(salary)} per dollar`);
  }
  if (f.breakdown.medicareLevy === 0 && plus.medicareLevy === 0) {
    reasons.push("income is still under the Medicare levy threshold");
  } else if (f.medicareStage !== "full") {
    reasons.push("the Medicare levy is still shading in at 10c per dollar");
  }
  return reasons;
}

/**
 * The next $1,000 in one paragraph (replaces the five-row table): what goes in
 * tax and Medicare, what is kept, why the rate differs from the headline rate
 * when it does, and the study-loan cost only where a repayment applies.
 */
export function nextThousandLine(salary: number): string {
  const f = salaryFacts(salary);
  const up = calculatePayBreakdown({ grossSalary: salary + 1_000 });
  const tax = up.netIncomeTax - f.breakdown.netIncomeTax;
  const levy = up.medicareLevy - f.breakdown.medicareLevy;
  const eff = f.nextThousand.effectiveMarginal;
  const head = f.breakdown.marginalTaxRate;
  const reasons = nextThousandReasons(salary);
  const why =
    Math.abs(eff - head) <= 0.001 || reasons.length === 0
      ? `the bracket rate plus the levy, nothing else in play`
      : `${eff > head ? "above" : "below"} the headline ${pct(head)} because ${list(reasons)}`;
  const hecs = f.nextThousand.takeHome - f.nextThousand.takeHomeWithHecs;
  const loan =
    hecs > 0
      ? ` With a study loan another ${formatAUD(hecs)} goes in repayments, leaving ${formatAUD(f.nextThousand.takeHomeWithHecs)}.`
      : "";
  return `A rise to ${formatAUD(salary + 1_000)} adds ${formatAUD(tax)} of income tax and ${formatAUD(levy)} of Medicare levy, so you keep ${formatAUD(f.nextThousand.takeHome)} of the $1,000: ${pct(eff)} goes, ${why}.${loan}`;
}

// ---------------------------------------------------------------------------
// Thresholds near the salary
// ---------------------------------------------------------------------------

export function list(items: string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

function shortPosition(t: ThresholdPosition): string {
  if (t.status === "at") return `${t.name} at ${formatAUD(t.at)} (this salary)`;
  if (t.status === "passed") return `${t.name} at ${formatAUD(t.at)} (passed ${formatAUD(t.distance)} ago)`;
  return `${t.name} at ${formatAUD(t.at)} (${formatAUD(t.distance)} away)`;
}

/** The thresholds a move to either neighbouring page crosses (tax-on-thresholds.ts). */
export function nearThresholds(salary: number) {
  return thresholdsBetweenNeighbours(salary, TAX_ON_SALARIES);
}

export function thresholdsIntro(salary: number): string {
  const n = nearThresholds(salary);
  const range = `${formatAUD(n.lo)} and ${formatAUD(n.hi)}`;
  if (n.near.length === 0) {
    return `No tax, levy, super or family-payment threshold sits between ${range}.`;
  }
  const ahead = n.near.filter((t) => t.status !== "passed").length;
  const passed = n.near.length - ahead;
  if (n.near.length === 1) return `One threshold between ${range}, ${passed ? "already passed" : "still ahead"}:`;
  const split = passed === 0 ? "all ahead" : ahead === 0 ? "all passed" : `${passed} passed, ${ahead} ahead`;
  return `${n.near.length} thresholds between ${range} (${split}):`;
}

/** Caveats under the thresholds table, only for the kinds of threshold it shows. */
export function thresholdsNote(salary: number): string {
  const kinds = new Set(nearThresholds(salary).near.map((t) => t.kind));
  const parts: string[] = [];
  if (kinds.has("medicare")) {
    parts.push(`The Medicare levy low-income thresholds are ${SITE_CONFIG.previousFinancialYear} figures, the latest the ATO has published.`);
  }
  const wide = [
    kinds.has("mls") ? "MLS" : null,
    kinds.has("hecs") ? "HECS-HELP" : null,
    kinds.has("div293") ? "Division 293" : null,
  ].filter((x): x is string => x !== null);
  if (wide.length > 0) {
    parts.push(`The ${list(wide)} ${wide.length === 1 ? "test also counts" : "tests also count"} reportable fringe benefits and similar items, not just salary.`);
  }
  if (kinds.has("family")) {
    parts.push("Family payment tests use adjusted taxable income, and the family tests add a partner's income.");
  }
  if (kinds.has("super-offset")) {
    parts.push("The super offsets also depend on the contributions made.");
  }
  return parts.join(" ");
}

export function thresholdsBeyond(salary: number): string {
  const n = nearThresholds(salary);
  const parts: string[] = [];
  if (n.nextBeyond) {
    parts.push(`Next further up: the ${inSentence(n.nextBeyond.name)} at ${formatAUD(n.nextBeyond.at)} (${n.nextBeyond.incomeYear}).`);
  } else {
    parts.push("No threshold on this page lies further up.");
  }
  if (n.lastBefore) {
    parts.push(`The last one passed was the ${inSentence(n.lastBefore.name)} at ${formatAUD(n.lastBefore.at)}.`);
  }
  return parts.join(" ");
}

export function thresholdsFaqAnswer(salary: number): string {
  const n = nearThresholds(salary);
  const range = `${formatAUD(n.lo)} and ${formatAUD(n.hi)}`;
  if (n.near.length === 0) {
    const next = n.nextBeyond ? ` The next is the ${inSentence(n.nextBeyond.name)} at ${formatAUD(n.nextBeyond.at)}.` : " None lies further up.";
    const last = n.lastBefore ? ` The last was the ${inSentence(n.lastBefore.name)} at ${formatAUD(n.lastBefore.at)}.` : "";
    return `None between ${range}.${next}${last}`;
  }
  return `Between ${range}: ${list(n.near.map(shortPosition))}.`;
}

/**
 * Thresholds between salary − $10,000 and salary + $10,000 that move the
 * headline figures (income tax, the offset, the Medicare levy). The surcharge,
 * HECS-HELP, Division 293 and super thresholds are left out: the headline
 * take-home excludes them, so its steps do not jump there.
 */
export function comparisonCrossings(salary: number) {
  const lo = Math.max(0, salary - 10_000);
  const hi = salary + 10_000;
  return allThresholds().filter((t) => t.at >= lo && t.at < hi && (t.kind === "income-tax" || t.kind === "lito" || t.kind === "medicare"));
}

/**
 * The ±$10,000 comparison: when a threshold falls inside it, the page shows
 * the table and this sentence names the thresholds; otherwise the table is
 * dropped and this one line gives the step instead.
 */
export function comparisonSentence(salary: number): string {
  const crossed = comparisonCrossings(salary);
  if (crossed.length === 0) {
    const step = calculatePayBreakdown({ grossSalary: salary + 5_000 }).takeHomePay - salaryFacts(salary).breakdown.takeHomePay;
    return `A $5,000 rise adds ${formatAUD(step)} of take-home.`;
  }
  return `The steps are uneven because they cross ${list(crossed.map((t) => `the ${inSentence(t.name)} (${formatAUD(t.at)})`))}.`;
}

// ---------------------------------------------------------------------------
// Where the salary sits among Australian earners (ABS)
// ---------------------------------------------------------------------------

function segmentWords(p: AllEmployeePlacement): string {
  const lo = p.lower?.percentile ?? 0;
  if (lo < 25) return "in the lowest-paid quarter";
  if (lo < 50) return "below the median, in the second quarter";
  if (lo < 75) return "above the median, in the third quarter";
  return "in the top quarter, though short of the top 10%";
}

export function placementSentence(salary: number): string {
  const p = placeAmongAllEmployees(salary);
  const s = formatAUD(salary);
  const wk = formatAUD(p.weekly);
  const src = `ABS ${EE_RELEASE.title}, ${EE_RELEASE.referencePeriod}`;
  if (p.kind === "below-lowest" && p.upper) {
    return `${s} is ${wk} a week, below the 10th percentile of ${formatAUD(p.upper.weekly)} a week: among the lowest-paid 10% of all employees, full-time and part-time (${src}).`;
  }
  if (p.kind === "above-highest" && p.lower) {
    return `${s} is ${wk} a week, above the 90th percentile of ${formatAUD(p.lower.weekly)} a week: in the top 10% of all employees, full-time and part-time (${src}).`;
  }
  const lo = p.lower!;
  const hi = p.upper!;
  return `${s} (${wk} a week) is about the ${ordinal(p.estimate!)} percentile of all employees, ${segmentWords(p)} (our estimate between the published ${ordinal(lo.percentile)} and ${ordinal(hi.percentile)}, ${src}).`;
}

/**
 * The ABS medians and the full-time average, named only when one is within
 * THRESHOLD_WINDOW of the salary (where the comparison tells the reader
 * something); empty otherwise.
 */
export function medianComparisonSentence(salary: number): string {
  const marks = [
    { name: "all-employee median", v: annualise(EE_MEDIAN.allEmployees), period: EE_RELEASE.referencePeriod },
    { name: "full-time median", v: annualise(EE_MEDIAN.fullTime), period: EE_RELEASE.referencePeriod },
    { name: "full-time average", v: annualise(AWE_HEADLINE.fullTimeOrdinaryWeekly), period: AWE_RELEASE.referencePeriod },
  ].filter((m) => Math.abs(salary - m.v) <= THRESHOLD_WINDOW);
  if (marks.length === 0) return "";
  const side = (v: number) => (salary >= v ? `${formatAUD(salary - v)} above` : `${formatAUD(v - salary)} below`);
  return `It is ${list(marks.map((m) => `${side(m.v)} the ${m.name} (${formatAUD(m.v)}, ${m.period})`))}.`;
}

/** Full-time minimum wage as an annual salary (38-hour week × 52). */
export function fullTimeMinimumWageAnnual(): number {
  return Math.round(EMPLOYMENT.minimumWageWeekly * 52);
}

/** Below a full-time minimum-wage income: the hours a week this salary is at the adult minimum wage. */
export function minimumWageHoursSentence(salary: number): string {
  const s = formatAUD(salary);
  const hours = salary / EMPLOYMENT.weeksPerYear / EMPLOYMENT.minimumWageHourly;
  return `A full-time adult on the National Minimum Wage earns ${formatAUD(fullTimeMinimumWageAnnual())} a year from 1 July 2026, so ${s} is usually part-time or casual pay: at the minimum ${formatAUD(EMPLOYMENT.minimumWageHourly, 2)} an hour it is about ${hours.toFixed(1)} hours a week.`;
}

export function placementFaqAnswer(salary: number): string {
  const p = placeAmongAllEmployees(salary);
  const verdict =
    p.kind === "above-highest"
      ? "Yes: it is in the top 10%."
      : p.kind === "below-lowest"
        ? "No: it is in the bottom 10%."
        : p.estimate! >= 75
          ? "Yes: it is in the top quarter."
          : p.estimate! >= 50
            ? "It is above the median, but not in the top quarter."
            : "No: it is below the median.";
  const src = `ABS ${EE_RELEASE.title}, ${EE_RELEASE.referencePeriod}`;
  const where =
    p.kind === "between"
      ? `About the ${ordinal(p.estimate!)} percentile of all employees (our estimate from ${src}).`
      : `${p.kind === "above-highest" ? "Above the 90th" : "Below the 10th"} percentile of all employees (${src}).`;
  return `${verdict} ${where}`;
}

// ---------------------------------------------------------------------------
// ABS group benchmarks that round to this salary
// ---------------------------------------------------------------------------

function who(groups: string[]): string {
  if (groups.every((g) => g.startsWith("in "))) return `in ${list(groups.map((g) => g.slice(3)))}`;
  return list(groups);
}

/** One line per published ABS group figure that rounds to this salary (nearest $5,000). */
export function benchmarkLines(salary: number): string[] {
  return groupBenchmarks(benchmarksRoundingTo(salary)).map(
    (g) => `${g.measure} ${who(g.groups)}: ${formatAUD(g.annual)} (${g.release.referencePeriod})`,
  );
}

function name(x: AbsBenchmark): string {
  return `${x.measure.toLowerCase()} ${x.group} (${formatAUD(x.annual)}, ${x.release.referencePeriod})`;
}

export function benchmarkIntro(salary: number): string {
  const s = formatAUD(salary);
  if (benchmarksRoundingTo(salary).length > 0) {
    return `ABS group figures that round to ${s} at the nearest $5,000:`;
  }
  const { below, above } = nearestBenchmarks(salary);
  if (below && above) {
    return `No ABS group average or median rounds to ${s}. The nearest are the ${name(below)} below it and the ${name(above)} above it.`;
  }
  if (below) {
    return `${s} is above every group average and median in these ABS tables; the highest is the ${name(below)}.`;
  }
  return `${s} is below every group average and median in these ABS tables; the lowest is the ${name(above!)}.`;
}

// ---------------------------------------------------------------------------
// Occupation medians that round to this salary (job pages' JSA figures)
// ---------------------------------------------------------------------------

function occ(o: OccupationMedian): string {
  return `${o.name.toLowerCase()} (${o.anzscoTitle}) at ${formatAUD(o.annual)}`;
}

export function occupationIntro(salary: number): string {
  const s = formatAUD(salary);
  if (occupationMediansRoundingTo(salary).length > 0) {
    return `Occupations whose median full-time pay rounds to ${s} (non-managerial adults; Jobs and Skills Australia, from ABS data for May 2025):`;
  }
  const { below, above } = nearestOccupationMedians(salary);
  if (below && above) {
    return `No occupation median on this site rounds to ${s}. The nearest are ${occ(below)} below it and ${occ(above)} above it, from Jobs and Skills Australia's profiles of ABS data for May 2025.`;
  }
  if (below) {
    return `${s} is above the median full-time pay of every occupation on this site; the highest is ${occ(below)}, from Jobs and Skills Australia's profiles of ABS data for May 2025.`;
  }
  return `${s} is below the median full-time pay of every occupation on this site; the lowest is ${occ(above!)}, from Jobs and Skills Australia's profiles of ABS data for May 2025.`;
}

export interface OccupationGroup {
  anzscoCode: string;
  anzscoTitle: string;
  annual: number;
  weekly: number;
  url: string;
  jobs: { name: string; href: string }[];
}

/** Occupations rounding to this salary, merged where they share one ANZSCO median. */
export function occupationGroupsNear(salary: number): OccupationGroup[] {
  const out: OccupationGroup[] = [];
  for (const o of occupationMediansRoundingTo(salary)) {
    const hit = out.find((g) => g.anzscoCode === o.anzscoCode);
    if (hit) hit.jobs.push({ name: o.name, href: o.href });
    else out.push({ anzscoCode: o.anzscoCode, anzscoTitle: o.anzscoTitle, annual: o.annual, weekly: o.weekly, url: o.url, jobs: [{ name: o.name, href: o.href }] });
  }
  return out;
}
