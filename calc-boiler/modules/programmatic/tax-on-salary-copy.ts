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
  TAX_BRACKETS_2023_24,
  TAX_BRACKETS_2025_26,
  formatAUD,
} from "@/lib/constants/australian-tax";
import { RESIDENT_SCALES, incomeTaxAfterLitoOnScale } from "@/lib/constants/tax-rates-reference";
import { salaryFacts } from "@/lib/data/salary-pages";
import { THRESHOLD_WINDOW, allThresholds, thresholdsNear, type ThresholdPosition } from "@/lib/data/salary-pages/tax-on-thresholds";
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
  return /^(Medicare|LITO|HECS|Division|\d)/.test(name) ? name : name[0].toLowerCase() + name.slice(1);
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

/** The bracket-by-bracket walk: "the first $18,200 is tax-free, $26,800 at 15% ($4,020) and …". */
export function bracketWalk(salary: number): string {
  const parts: string[] = [];
  TAX_BRACKETS.forEach((b, i) => {
    if (salary < b.min) return;
    const inBracket = Math.min(salary, b.max) - (i === 0 ? 0 : b.min - 1);
    if (i === 0) parts.push(`the first ${formatAUD(inBracket)} is tax-free`);
    else parts.push(`${formatAUD(inBracket)} is taxed at ${pct(b.rate)} (${formatAUD(inBracket * b.rate)})`);
  });
  if (parts.length === 1) return `All of ${formatAUD(salary)} is under the tax-free threshold.`;
  const last = parts.pop();
  return `Of ${formatAUD(salary)}, ${parts.join(", ")} and ${last}.`;
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

/** One sentence under the next-$1,000 table: why its rate matches or differs from the headline rate. */
export function nextThousandSentence(salary: number): string {
  const f = salaryFacts(salary);
  const eff = f.nextThousand.effectiveMarginal;
  const head = f.breakdown.marginalTaxRate;
  const reasons = nextThousandReasons(salary);
  if (Math.abs(eff - head) <= 0.001 || reasons.length === 0) {
    return `Here the whole $1,000 is taxed at the same ${pct(eff)}: the bracket rate plus the Medicare levy, with no offset or levy shade-in in play.`;
  }
  return `The rate on the next $1,000 is ${eff > head ? "higher" : "lower"} than the headline ${pct(head)} because ${list(reasons)}.`;
}

// ---------------------------------------------------------------------------
// Income tax by year (the Stage 3 and 1 July 2026 cuts, applied to this salary)
// ---------------------------------------------------------------------------

export interface YearRow {
  year: string;
  note: string;
  tax: number;
}

export function taxByYear(salary: number): YearRow[] {
  const fy = SITE_CONFIG.financialYear;
  return [
    { year: "2023-24", note: `last year before Stage 3, ${pct(TAX_BRACKETS_2023_24[1].rate)} second rate`, tax: incomeTaxAfterLitoOnScale(salary, TAX_BRACKETS_2023_24) },
    { year: "2025-26", note: `Stage 3 scale, ${pct(TAX_BRACKETS_2025_26[1].rate)} second rate`, tax: incomeTaxAfterLitoOnScale(salary, TAX_BRACKETS_2025_26) },
    { year: fy, note: `this year, ${pct(TAX_BRACKETS[1].rate)} second rate`, tax: incomeTaxAfterLitoOnScale(salary, TAX_BRACKETS) },
    { year: "2027-28", note: `legislated, ${pct(RESIDENT_SCALES["2027-28"][1].rate)} second rate`, tax: incomeTaxAfterLitoOnScale(salary, RESIDENT_SCALES["2027-28"]) },
  ];
}

export function taxByYearSentence(salary: number): string {
  const s = formatAUD(salary);
  const rows = taxByYear(salary);
  const [y23, y25, now, y27] = rows;
  if (rows.every((r) => r.tax === 0)) {
    return `No income tax is payable on ${s} under any of these scales: the Low Income Tax Offset cancels it each year.`;
  }
  const vs23 = y23.tax - now.tax;
  const vs25 = y25.tax - now.tax;
  const next = now.tax - y27.tax;
  return `Income tax on ${s} is ${formatAUD(vs23)} a year lower than under the pre-Stage 3 scale and ${formatAUD(vs25)} lower than in 2025-26; the legislated cut from 1 July 2027 takes off another ${formatAUD(next)}. Medicare levy excluded.`;
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

export function thresholdsIntro(salary: number): string {
  const n = thresholdsNear(salary);
  const s = formatAUD(salary);
  const w = formatAUD(THRESHOLD_WINDOW);
  if (n.near.length === 0) {
    return `No tax, levy or super threshold falls within ${w} of ${s}, so the same rules apply to a rise or a cut of that size.`;
  }
  const ahead = n.near.filter((t) => t.status !== "passed").length;
  const passed = n.near.length - ahead;
  const count = n.near.length === 1 ? "One threshold falls" : `${n.near.length} thresholds fall`;
  const split =
    passed === 0
      ? "all still ahead"
      : ahead === 0
        ? "all already passed"
        : `${passed} already passed and ${ahead} still ahead`;
  return `${count} within ${w} of ${s}, ${n.near.length === 1 ? (passed ? "already passed" : "still ahead") : split}. Each changes what the next dollar costs or what a pay cut saves.`;
}

export function thresholdsBeyond(salary: number): string {
  const n = thresholdsNear(salary);
  const parts: string[] = [];
  if (n.nextBeyond) {
    parts.push(`The next one further up is the ${inSentence(n.nextBeyond.name)} at ${formatAUD(n.nextBeyond.at)}, ${formatAUD(n.nextBeyond.distance)} above ${formatAUD(salary)} (${n.nextBeyond.incomeYear}).`);
  } else {
    const top = allThresholds().slice(-1)[0];
    parts.push(`Nothing changes further up: above ${formatAUD(top.at)} every rate on this page is flat.`);
  }
  if (n.near.length === 0 && n.lastBefore) {
    parts.push(`The last one passed was the ${inSentence(n.lastBefore.name)} at ${formatAUD(n.lastBefore.at)}, ${formatAUD(n.lastBefore.distance)} below.`);
  }
  return parts.join(" ");
}

export function thresholdsFaqAnswer(salary: number): string {
  const n = thresholdsNear(salary);
  const s = formatAUD(salary);
  if (n.near.length === 0) {
    const next = n.nextBeyond ? ` The next is the ${inSentence(n.nextBeyond.name)} at ${formatAUD(n.nextBeyond.at)}, ${formatAUD(n.nextBeyond.distance)} higher.` : " None lies further up.";
    const last = n.lastBefore ? ` The last was the ${inSentence(n.lastBefore.name)} at ${formatAUD(n.lastBefore.at)}, ${formatAUD(n.lastBefore.distance)} lower.` : "";
    return `None within ${formatAUD(THRESHOLD_WINDOW)} of ${s}.${next}${last}`;
  }
  return `Within ${formatAUD(THRESHOLD_WINDOW)} of ${s}: ${list(n.near.map(shortPosition))}.`;
}

/** Thresholds crossed inside the ±$10,000 comparison table. */
export function comparisonRangeSentence(salary: number): string {
  const lo = Math.max(0, salary - 10_000);
  const hi = salary + 10_000;
  const crossed = allThresholds().filter((t) => t.at >= lo && t.at < hi);
  const range = `${formatAUD(lo)} to ${formatAUD(hi)}`;
  if (crossed.length === 0) {
    return `No threshold sits between ${range}, so each $5,000 step in the table moves take-home by close to the same amount.`;
  }
  return `Between ${range} the table crosses ${list(crossed.map((t) => `the ${inSentence(t.name)} (${formatAUD(t.at)})`))}, which is why the steps are uneven.`;
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
    return `${s} is ${wk} a week, below the 10th percentile of ${formatAUD(p.upper.weekly)} a week (${formatAUD(annualise(p.upper.weekly))} a year): among the lowest-paid 10% of all employees, full-time and part-time (${src}).`;
  }
  if (p.kind === "above-highest" && p.lower) {
    return `${s} is ${wk} a week, above the 90th percentile of ${formatAUD(p.lower.weekly)} a week (${formatAUD(annualise(p.lower.weekly))} a year): in the top 10% of all employees, full-time and part-time (${src}).`;
  }
  const lo = p.lower!;
  const hi = p.upper!;
  return `${s} is ${wk} a week. Among all employees, full-time and part-time, that is about the ${ordinal(p.estimate!)} percentile, ${segmentWords(p)}. This is our estimate from ABS percentiles, read between the published ${ordinal(lo.percentile)} (${formatAUD(lo.weekly)} a week) and ${ordinal(hi.percentile)} (${formatAUD(hi.weekly)} a week) in ${src}.`;
}

export function medianComparisonSentence(salary: number): string {
  const allMedian = annualise(EE_MEDIAN.allEmployees);
  const ftMedian = annualise(EE_MEDIAN.fullTime);
  const avg = annualise(AWE_HEADLINE.fullTimeOrdinaryWeekly);
  const side = (v: number) => (salary >= v ? `${formatAUD(salary - v)} above` : `${formatAUD(v - salary)} below`);
  return `It is ${side(allMedian)} the all-employee median of ${formatAUD(allMedian)}, ${side(ftMedian)} the full-time median of ${formatAUD(ftMedian)} (${EE_RELEASE.referencePeriod}) and ${side(avg)} the full-time average of ${formatAUD(avg)} (${AWE_RELEASE.title}, ${AWE_RELEASE.referencePeriod}).`;
}

/** Full-time minimum wage as an annual salary (38-hour week × 52). */
export function fullTimeMinimumWageAnnual(): number {
  return Math.round(EMPLOYMENT.minimumWageWeekly * 52);
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
  const wk = formatAUD(p.weekly);
  const src = `ABS ${EE_RELEASE.title}, ${EE_RELEASE.referencePeriod}`;
  const where =
    p.kind === "between"
      ? `At ${wk} a week it is about the ${ordinal(p.estimate!)} percentile of all employees, full-time and part-time (our estimate from ${src} percentiles).`
      : `At ${wk} a week it is ${p.kind === "above-highest" ? "above the 90th" : "below the 10th"} percentile of all employees, full-time and part-time (${src}).`;
  const ftMedian = annualise(EE_MEDIAN.fullTime);
  const vsFt = salary >= ftMedian ? `${formatAUD(salary - ftMedian)} above` : `${formatAUD(ftMedian - salary)} below`;
  return `${verdict} ${where} It is ${vsFt} the full-time median of ${formatAUD(ftMedian)}.`;
}

// ---------------------------------------------------------------------------
// ABS group benchmarks that round to this salary
// ---------------------------------------------------------------------------

function who(groups: string[]): string {
  if (groups.every((g) => g.startsWith("in "))) return `in ${list(groups.map((g) => g.slice(3)))}`;
  return list(groups);
}

export function versus(annual: number, salary: number): string {
  if (annual === salary) return `exactly ${formatAUD(salary)}`;
  return `${formatAUD(Math.abs(annual - salary))} ${annual > salary ? "above" : "below"} ${formatAUD(salary)}`;
}

/** One line per published ABS group figure that rounds to this salary (nearest $5,000). */
export function benchmarkLines(salary: number): string[] {
  return groupBenchmarks(benchmarksRoundingTo(salary)).map(
    (g) => `${g.measure} ${who(g.groups)}: ${formatAUD(g.annual)}, ${versus(g.annual, salary)} (${g.release.title}, ${g.release.referencePeriod}).`,
  );
}

function name(x: AbsBenchmark): string {
  return `${x.measure.toLowerCase()} ${x.group} (${formatAUD(x.annual)}, ${x.release.referencePeriod})`;
}

export function benchmarkIntro(salary: number): string {
  const s = formatAUD(salary);
  if (benchmarksRoundingTo(salary).length > 0) {
    return `These published ABS group figures round to ${s} at the nearest $5,000, so they describe pay close to this salary:`;
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
    return `Occupations whose median full-time pay rounds to ${s}. These are full-time, non-managerial adults, from Jobs and Skills Australia's profiles of the ABS Survey of Employee Earnings and Hours, May 2025:`;
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
