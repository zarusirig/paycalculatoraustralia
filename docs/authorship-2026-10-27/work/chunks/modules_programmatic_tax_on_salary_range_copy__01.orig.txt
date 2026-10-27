// Copy for the salary-range sections of /tax-on/[salary]/ (10 Oct 2026, second
// pass), shared by the sections and the FAQ so the two never disagree. Which
// section a page carries is decided in lib/data/salary-pages/tax-on-ranges.ts;
// every figure comes from the tax engine and the verified constants, each with
// the income year it belongs to (Medicare levy low-income thresholds are
// 2025-26, the latest the ATO has published; everything else is 2026-27).

import {
  HECS_HELP,
  LITO,
  MEDICARE_LEVY,
  SITE_CONFIG,
  SUPER_GUARANTEE,
  TAX_BRACKETS,
  TAX_BRACKETS_2023_24,
  TAX_BRACKETS_2025_26,
  calculatePayBreakdown,
  formatAUD,
} from "@/lib/constants/australian-tax";
import { MLS_CHILD_INCREMENT, MLS_INCOME_YEAR } from "@/lib/constants/medicare-levy-extra";
import { MLS_APPROPRIATE_COVER_MAX_EXCESS } from "@/lib/constants/medicare-levy-surcharge";
import { CONTRIBUTIONS_TAX_RATE, DIVISION_293 } from "@/lib/constants/super-contributions";
import { compareTakeHome, WATO } from "@/lib/constants/tax-2027-28";
import { incomeTaxAfterLitoOnScale } from "@/lib/constants/tax-rates-reference";
import { salaryFacts } from "@/lib/data/salary-pages";
import { DIV293_SALARY_EQUIVALENT } from "@/lib/data/salary-pages/tax-on-thresholds";
import {
  bracketEdgeNear,
  div293Position,
  litoPosition,
  medicareReduction,
  mlsPosition,
} from "@/lib/data/salary-pages/tax-on-ranges";

const pct = (r: number) => `${Number((r * 100).toFixed(2))}%`;
const cents = (r: number) => `${Number((r * 100).toFixed(1))}c`;
const fy = SITE_CONFIG.financialYear;
const levyYear = SITE_CONFIG.previousFinancialYear;
const takeHome = (salary: number) => calculatePayBreakdown({ grossSalary: salary }).takeHomePay;

// ---------------------------------------------------------------------------
// Low Income Tax Offset (below $66,667)
// ---------------------------------------------------------------------------

export function litoParagraphs(salary: number): string[] {
  const p = litoPosition(salary);
  if (!p) return [];
  const s = formatAUD(salary);
  const max = formatAUD(LITO.maxOffset);
  const ceiling = formatAUD(LITO.fullOffsetCeiling);
  const end1 = formatAUD(LITO.phaseOut1.end);
  const nil = formatAUD(LITO.nilOffsetIncome);
  switch (p.phase) {
    case "cancels-tax":
      return [
        `The full ${max} Low Income Tax Offset (${fy}) cancels the ${formatAUD(p.taxBeforeOffset)} of bracket tax on ${s}, so no income tax is payable. It covers the whole tax up to ${formatAUD(p.nilTaxLimit)}; past that, tax starts at ${cents(TAX_BRACKETS[1].rate)} per dollar.`,
      ];
    case "full":
      return [
        `The full ${max} offset (${fy}) cuts the bracket tax on ${s} from ${formatAUD(p.taxBeforeOffset)} to ${formatAUD(p.taxBeforeOffset - p.offset)}. It stays at ${max} up to ${ceiling}, then shrinks by ${cents(LITO.phaseOut1.rate)} per dollar.`,
      ];
    case "phase-out-fast":
      return salary < LITO.phaseOut1.end
        ? [
            `The offset on ${s} is ${formatAUD(p.offset)}: ${max} less ${cents(LITO.phaseOut1.rate)} for each of the ${formatAUD(p.overPhaseStart)} above ${ceiling} (${fy}). Until ${end1} each extra dollar costs ${cents(p.nextDollarRate)} of income tax, ${cents(TAX_BRACKETS[1].rate)} of bracket tax plus ${cents(LITO.phaseOut1.rate)} of offset lost.`,
          ]
        : [
            `The offset on ${s} is ${formatAUD(p.offset)} (${fy}), the end of the ${cents(LITO.phaseOut1.rate)} phase-out. From the next dollar it shrinks by only ${cents(LITO.phaseOut2.rate)}, but the rate rises to ${cents(TAX_BRACKETS[2].rate)}, so each dollar costs ${cents(p.nextDollarRate)} until the offset runs out at ${nil}.`,
          ];
    case "phase-out-slow": {
      const at45 = LITO.maxOffset - (LITO.phaseOut1.end - LITO.fullOffsetCeiling) * LITO.phaseOut1.rate;
      return [
        `The offset on ${s} is ${formatAUD(p.offset)}: the ${formatAUD(at45)} left at ${end1}, less ${cents(LITO.phaseOut2.rate)} for each of the ${formatAUD(p.overPhaseStart)} above it (${fy}). It runs out at ${nil}, ${formatAUD(LITO.nilOffsetIncome - salary)} higher; until then each extra dollar costs ${cents(p.nextDollarRate)} of income tax.`,
      ];
    }
  }
}

export function litoFaqAnswer(salary: number): string {
  const p = litoPosition(salary)!;
  const s = formatAUD(salary);
  if (p.phase === "cancels-tax" || p.phase === "full") {
    return `The full ${formatAUD(LITO.maxOffset)} in ${fy}, because ${s} is under ${formatAUD(LITO.fullOffsetCeiling)}. It reduces income tax from ${formatAUD(p.taxBeforeOffset)} to ${formatAUD(Math.max(0, p.taxBeforeOffset - p.offset))}.`;
  }
  return `${formatAUD(p.offset)} in ${fy}, reduced from the ${formatAUD(LITO.maxOffset)} maximum because ${s} is above ${formatAUD(LITO.fullOffsetCeiling)}. It reaches nil at ${formatAUD(LITO.nilOffsetIncome)}.`;
}

// ---------------------------------------------------------------------------
// Medicare levy low-income reduction (to $35,013, 2025-26 thresholds)
// ---------------------------------------------------------------------------

export function medicareParagraphs(salary: number): string[] {
  const m = medicareReduction(salary);
  if (!m) return [];
  const s = formatAUD(salary);
  const low = formatAUD(MEDICARE_LEVY.lowIncomeThreshold);
  const full = formatAUD(MEDICARE_LEVY.shadeInThreshold);
  const fam = `families have a ${formatAUD(MEDICARE_LEVY.familyThreshold)} threshold plus ${formatAUD(MEDICARE_LEVY.additionalChild)} per dependent child`;
  if (m.stage === "exempt") {
    return [
      `No Medicare levy on ${s}: singles pay none up to ${low} (${levyYear} threshold, the latest the ATO has published). Above it the levy is ${cents(MEDICARE_LEVY.shadeInRate)} per dollar over ${low} until it reaches ${pct(MEDICARE_LEVY.rate)} of income at ${full}; ${fam}.`,
    ];
  }
  return [
    `The levy on ${s} is ${cents(MEDICARE_LEVY.shadeInRate)} for each of the ${formatAUD(m.overThreshold)} above ${low}: ${formatAUD(m.levy)} instead of ${formatAUD(m.fullLevy)} at ${pct(MEDICARE_LEVY.rate)} (${levyYear} thresholds, the latest published). The reduction ends at ${full}; ${fam}.`,
  ];
}

export function medicareFaqAnswer(salary: number): string {
  const m = medicareReduction(salary)!;
  const s = formatAUD(salary);
  if (m.stage === "exempt") {
    return `No. Singles pay no Medicare levy on income up to ${formatAUD(MEDICARE_LEVY.lowIncomeThreshold)} (${levyYear} threshold), and ${s} is under it.`;
  }
  return `Yes, a reduced ${formatAUD(m.levy)} instead of ${formatAUD(m.fullLevy)}, because ${s} is between the ${formatAUD(MEDICARE_LEVY.lowIncomeThreshold)} and ${formatAUD(MEDICARE_LEVY.shadeInThreshold)} thresholds (${levyYear}).`;
}

// ---------------------------------------------------------------------------
// Bracket edges ($45,000, $135,000, $190,000)
// ---------------------------------------------------------------------------

export function edgeHeading(salary: number): string {
  const e = bracketEdgeNear(salary)!;
  if (e.status === "below") return `What Changes Above ${formatAUD(e.edge)}?`;
  if (e.status === "at") return `${formatAUD(e.edge)} Is the Last Dollar Taxed at ${pct(e.lowerRate)}`;
  return `How Much of ${formatAUD(salary)} Is Taxed at ${pct(e.upperRate)}?`;
}

export function edgeParagraphs(salary: number): string[] {
  const e = bracketEdgeNear(salary);
  if (!e) return [];
  const s = formatAUD(salary);
  const E = formatAUD(e.edge);
  const litoSlows = e.edge === LITO.phaseOut1.end;
  if (e.status === "below") {
    const up = salary + 10_000;
    return [
      `${s} is ${formatAUD(e.distance)} below ${E}, where the rate on each extra dollar rises from ${pct(e.lowerRate)} to ${pct(e.upperRate)} (${fy}). Only dollars above ${E} pay ${pct(e.upperRate)}, so a rise past it never lowers take-home: ${formatAUD(up)} takes home ${formatAUD(takeHome(up))}, ${formatAUD(takeHome(up) - takeHome(salary))} more.${litoSlows ? ` The offset phase-out also slows there, from ${cents(LITO.phaseOut1.rate)} to ${cents(LITO.phaseOut2.rate)} per dollar.` : ""}`,
    ];
  }
  if (e.status === "at") {
    return [
      `${s} is the last dollar at ${pct(e.lowerRate)}: every dollar of a rise is taxed at ${pct(e.upperRate)} (${fy}) plus the ${pct(MEDICARE_LEVY.rate)} levy, while the ${s} already earned is taxed as before. A $5,000 rise adds ${formatAUD(takeHome(salary + 5_000) - takeHome(salary))} of take-home.${litoSlows ? ` The offset phase-out slows here too, to ${cents(LITO.phaseOut2.rate)} per dollar.` : ""}`,
    ];
  }
  return [
    `${formatAUD(e.distance)} of ${s} is above ${E} and taxed at ${pct(e.upperRate)}: ${formatAUD(e.distance * e.upperRate)}, or ${formatAUD(e.distance * (e.upperRate - e.lowerRate))} more than at ${pct(e.lowerRate)} (${fy}). The first ${E} is taxed as before, so take-home is ${formatAUD(takeHome(salary) - takeHome(e.edge))} higher than at ${E}.${litoSlows ? ` The offset also shrinks ${cents(LITO.phaseOut2.rate)} per dollar above ${E}: ${formatAUD(e.distance * LITO.phaseOut2.rate)} less here.` : ""}`,
  ];
}

export function edgeFaqQuestion(salary: number): string {
  const e = bracketEdgeNear(salary)!;
  return e.status === "below"
    ? `Will a pay rise past ${formatAUD(e.edge)} reduce my take-home pay?`
    : `Does going over ${formatAUD(e.edge)} mean all my income is taxed at ${pct(e.upperRate)}?`;
}

export function edgeFaqAnswer(salary: number): string {
  const e = bracketEdgeNear(salary)!;
  const s = formatAUD(salary);
  if (e.status === "below") {
    return `No. Only the dollars above ${formatAUD(e.edge)} are taxed at ${pct(e.upperRate)} (${fy}), so take-home rises with every dollar of salary.`;
  }
  if (e.status === "at") {
    return `No. ${s} is the last dollar at ${pct(e.lowerRate)}; only income above it is taxed at ${pct(e.upperRate)} (${fy}).`;
  }
  return `No. On ${s} only the ${formatAUD(e.distance)} above ${formatAUD(e.edge)} is taxed at ${pct(e.upperRate)} (${fy}); the first ${formatAUD(e.edge)} is taxed as before.`;
}

// ---------------------------------------------------------------------------
// Medicare levy surcharge (from $90,000; 2026-27 tiers)
// ---------------------------------------------------------------------------

export function mlsParagraphs(salary: number): string[] {
  const m = mlsPosition(salary);
  if (!m) return [];
  const s = formatAUD(salary);
  const t = MEDICARE_LEVY.surcharge;
  const base = formatAUD(t.tier1.min - 1);
  const f = m.family;
  const family = !f
    ? ""
    : f.tier === 0
      ? ` As a family's only income it pays none: the family base tier runs to ${formatAUD(t.familyTier1.min - 1)}.`
      : ` As a family's only income it is in family tier ${f.tier}: ${pct(f.rate)}, ${formatAUD(f.amount)}.`;
  if (m.tier === 0) {
    return [
      `No surcharge on ${s}: the ${MLS_INCOME_YEAR} base tier for singles runs to ${base} of income for MLS purposes. Above it, a single without appropriate private hospital cover pays ${pct(t.tier1.rate)} of the whole MLS income, about ${formatAUD(t.tier1.min * t.tier1.rate)}. MLS income adds reportable fringe benefits, reportable super and net investment losses, so it can pass ${base} before salary does. Hospital cover with an excess of ${formatAUD(MLS_APPROPRIATE_COVER_MAX_EXCESS.single)} or less avoids it; families have ${formatAUD(t.familyTier1.min - 1)} combined, plus ${formatAUD(MLS_CHILD_INCREMENT)} per child after the first.`,
    ];
  }
  return [
    `Tier ${m.tier} for ${MLS_INCOME_YEAR}: a single without appropriate private hospital cover pays ${pct(m.rate)} of income for MLS purposes, ${formatAUD(m.amount)} a year. ${m.next ? `Tier ${m.next.tier} (${pct(m.next.rate)}) starts at ${formatAUD(m.next.at)}.` : "There is no higher tier."}${family}`,
  ];
}

export function mlsFaqAnswer(salary: number): string {
  const m = mlsPosition(salary)!;
  const s = formatAUD(salary);
  if (m.tier === 0) {
    return `No. For ${MLS_INCOME_YEAR} it starts at ${formatAUD(MEDICARE_LEVY.surcharge.tier1.min)} of income for MLS purposes (singles without private hospital cover), ${formatAUD(MEDICARE_LEVY.surcharge.tier1.min - salary)} above ${s}.`;
  }
  return `Only without appropriate private hospital cover: ${formatAUD(m.amount)} a year for a single (tier ${m.tier}, ${MLS_INCOME_YEAR}).`;
}

// ---------------------------------------------------------------------------
// HECS-HELP (from $54,528; 2026-27 bands)
// ---------------------------------------------------------------------------

export function hecsParagraph(salary: number): string {
  const f = salaryFacts(salary);
  const s = formatAUD(salary);
  const w = f.withHecs;
  const band = HECS_HELP.bands[f.hecsBandIndex];
  const min = formatAUD(HECS_HELP.minimumThreshold);
  if (f.hecsBandIndex === 0) {
    return `No compulsory repayment on ${s}: it is under the ${min} repayment threshold for ${fy}. Repayments are marginal, ${cents(HECS_HELP.bands[1].marginalRate)} per dollar of repayment income over ${min} and nothing below it.`;
  }
  if (f.hecsBandIndex === HECS_HELP.bands.length - 1) {
    return `The repayment is a flat ${pct(band.marginalRate)} of all repayment income (${fy}): ${formatAUD(w.hecsRepayment)} a year, leaving ${formatAUD(w.takeHomePay)} take-home.`;
  }
  return `Compulsory repayment: ${formatAUD(w.hecsRepayment)} a year (${band.label}, ${fy}), leaving ${formatAUD(w.takeHomePay)} take-home. With the loan, ${(f.nextThousand.effectiveMarginalWithHecs * 100).toFixed(1)}% of a pay rise goes in tax, Medicare and repayments.`;
}

export function hecsFaqAnswer(salary: number): string {
  const f = salaryFacts(salary);
  const s = formatAUD(salary);
  if (f.hecsBandIndex === 0) {
    return `Nothing compulsory. In ${fy} repayments start above ${formatAUD(HECS_HELP.minimumThreshold)} of repayment income, ${formatAUD(HECS_HELP.minimumThreshold - salary)} above ${s}.`;
  }
  return `${formatAUD(f.withHecs.hecsRepayment)} a year in ${fy}, if salary is your only repayment income.`;
}

// ---------------------------------------------------------------------------
// Division 293 (from $210,000; 2026-27)
// ---------------------------------------------------------------------------

export function div293Paragraphs(salary: number): string[] {
  const d = div293Position(salary);
  if (!d) return [];
  const sg = formatAUD(d.employerSuper);
  const T = formatAUD(DIVISION_293.threshold);
  const rate = pct(DIVISION_293.rate);
  if (d.stage === "below") {
    return [
      `Salary plus ${sg} of employer super is ${formatAUD(d.total)}, ${formatAUD(-d.excess)} under the ${T} Division 293 threshold (${fy}). On employer super alone it starts at a salary of ${formatAUD(DIV293_SALARY_EQUIVALENT + 1)}; reportable fringe benefits and net investment losses count too.`,
    ];
  }
  if (d.stage === "part") {
    return [
      `Salary plus ${sg} of employer super is ${formatAUD(d.total)}, ${formatAUD(d.excess)} over ${T} (${fy}), so Division 293 adds ${rate} of that excess: ${formatAUD(d.amount)} a year. The ATO assesses it after you lodge; it can be paid personally or released from super.`,
    ];
  }
  return [
    `Salary plus ${sg} of employer super is ${formatAUD(d.total)}, at least ${sg} over ${T} (${fy}), so all the employer super attracts the extra ${rate}: ${formatAUD(d.amount)} a year, ${pct(CONTRIBUTIONS_TAX_RATE + DIVISION_293.rate)} tax on those contributions in total.${d.superCapped ? ` That is the ceiling on employer super alone, which stops at the ${formatAUD(SUPER_GUARANTEE.maxContributionBaseAnnual)} maximum contribution base.` : ""} The ATO assesses it after you lodge.`,
  ];
}

export function div293FaqAnswer(salary: number): string {
  const d = div293Position(salary)!;
  const s = formatAUD(salary);
  if (d.stage === "below") {
    return `Not on employer super alone: ${s} plus ${formatAUD(d.employerSuper)} of super is ${formatAUD(d.total)}, under the ${formatAUD(DIVISION_293.threshold)} threshold (${fy}).`;
  }
  return `Yes: ${s} plus ${formatAUD(d.employerSuper)} of employer super is ${formatAUD(d.total)}, over ${formatAUD(DIVISION_293.threshold)} (${fy}), so it adds about ${formatAUD(d.amount)} a year.`;
}

// ---------------------------------------------------------------------------
// Income tax by year: one line instead of the four-row table
// ---------------------------------------------------------------------------

export function taxByYearLine(salary: number): string {
  const s = formatAUD(salary);
  const y23 = incomeTaxAfterLitoOnScale(salary, TAX_BRACKETS_2023_24);
  const y25 = incomeTaxAfterLitoOnScale(salary, TAX_BRACKETS_2025_26);
  const now = incomeTaxAfterLitoOnScale(salary, TAX_BRACKETS);
  const y27 = compareTakeHome(salary).y2027_28.incomeTaxPayable;
  if (y23 === 0 && y25 === 0 && now === 0 && y27 === 0) {
    return `No income tax is payable on ${s} in any year from 2023-24 to 2027-28: the offset cancels it each year.`;
  }
  return `Income tax by year: ${formatAUD(y23)} in 2023-24, ${formatAUD(y25)} in 2025-26, ${formatAUD(now)} now, ${formatAUD(y27)} in 2027-28 (after the ${formatAUD(WATO.maxOffset)} Working Australians Tax Offset).`;
}
