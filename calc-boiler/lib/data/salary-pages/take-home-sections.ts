// =============================================================================
// Salary-specific sections for /take-home-pay-on/[salary]/ (10 Oct 2026).
//
// The take-home pages were ~95% the same page with the numbers swapped. Each
// section here exists only where its subject applies to the salary, so the
// page structure itself changes along the range:
//
//   low    (inside the 15% bracket, <= $45,000): hours a week at the national
//          minimum wage and two award entry rates, the full-time junior rate
//          that lands on the page, and the low-income offsets (LITO, the
//          Medicare levy low-income reduction, LISTO, co-contribution);
//   middle ($45,001 to the Medicare levy surcharge threshold): $5,000 of
//          salary sacrifice at this marginal rate, the co-contribution where
//          it is still paid, and a nearing-the-surcharge note;
//   high   (from the surcharge threshold): the surcharge without private
//          hospital cover, Division 293 once income + super passes $250,000,
//          the super guarantee cap, and salary sacrifice while the
//          concessional cap still has room for it;
//   all    the change in take-home since 2025-26 (and the legislated 2027-28
//          change), HECS-HELP only where its rate differs from a neighbouring
//          page, and the published pay that lands on this page (each figure
//          lands on exactly one): JSA occupation medians, public-service
//          scales and the APS pay survey, ADF ranks, police, paramedic,
//          firefighter and prison officer scales, hospital specialists,
//          pilots and air traffic control, employer adult and junior rates,
//          apprentice minimums and the junior minimum wage.
//
// Nothing is typed in. Every figure comes from the tax engine
// (australian-tax.ts), the 2025-26 and 2027-28 engines, the minimum wage,
// junior, award, LISTO, super constants and the lib/data pay datasets, each of
// which carries its own source and effective date.
// =============================================================================

import {
  calculateHECS,
  calculatePayBreakdown,
  HECS_HELP,
  HECS_HELP_2025_26,
  MEDICARE_LEVY,
  SUPER_GUARANTEE,
  TAX_BRACKETS,
  type PayBreakdown,
} from "../../constants/australian-tax";
import { helpRepayment2025_26, incomeTax2025_26, lito2025_26, medicareLevy2025_26 } from "../../constants/tax-return-2025-26";
import { compareTakeHome } from "../../constants/tax-2027-28";
import { NMW, NMW_DECISION } from "../../constants/minimum-wage";
import { JUNIOR_RATES, NMW_ORDER, type JuniorRateRow } from "../../constants/junior-rates";
import { LISTO_2027_28, LISTO_CURRENT, listoFromSalary } from "../../constants/listo";
import { CO_CONTRIBUTION, CONTRIBUTIONS_TAX_RATE, DIVISION_293, division293Estimate, maxCoContribution } from "../../constants/super-contributions";
import { MLS_INCOME_YEAR } from "../../constants/medicare-levy-extra";
import { AWARD_RATE_INDEX, type AwardRateEntry } from "../award-rate-index";
import { OCCUPATION_MEDIANS, type OccupationMedian } from "../occupation-medians/index";
import { JURISDICTIONS } from "../public-service-pay/index";
import { STAFF_SPECIALIST_SCALES } from "../health-salary/staff-specialists";
import { APPRENTICE_RATES_FROM, APPRENTICE_TRADES, STAGE_LABELS, type ApprenticeStage, type Year12 } from "../apprentice-pay/index";
import { APPRENTICE_SPOKES } from "../apprentice-pay/spokes";
import { ADF_PAY_EFFECTIVE, PACMAN_URLS } from "../adf-pay/index";
import { OFFICER_SALARIES, OTHER_RANK_SALARIES } from "../adf-pay/salaries";
import { SERVICE_PAY } from "../service-pay/index";
import { SERVICE_PAY_BUILT } from "../service-pay/built";
import { SERVICE_OCCUPATION_CONFIG } from "../service-pay/occupations";
import type { ServiceOccupation, ServicePayJurisdiction } from "../service-pay/types";
import { AVIATION_PAY, AVIATION_PATHS } from "../aviation-pay/index";
import { EMPLOYERS, annualFor, annualFullTime, entryRate as employerEntryRate, juniorRates } from "../employer-pay/index";
import type { AviationPageSlug, AviationPayPage } from "../aviation-pay/types";
import { TAKE_HOME_SALARIES, prevNext, salaryFacts } from "./index";

const FORTNIGHTS = 26;
const cents = (n: number) => Math.round(n * 100) / 100;

// ---------------------------------------------------------------------------
// Bands
// ---------------------------------------------------------------------------

export type TakeHomeBand = "low" | "middle" | "high";

/** Top of the 15% bracket ($45,000): below it the salary never meets the 30% rate. */
export const LOW_BAND_MAX = TAX_BRACKETS[1].max;
/** First dollar of the Medicare levy surcharge for singles (2026-27). */
export const HIGH_BAND_MIN = MEDICARE_LEVY.surcharge.tier1.min;

export function takeHomeBand(salary: number): TakeHomeBand {
  if (salary <= LOW_BAND_MAX) return "low";
  if (salary < HIGH_BAND_MIN) return "middle";
  return "high";
}

// ---------------------------------------------------------------------------
// Which page a published figure lands on
// ---------------------------------------------------------------------------

/**
 * The kept take-home salary a published annual figure belongs to: the nearest
 * page, provided the figure is within half the gap to the next page either
 * side. So each figure lands on exactly one page and neighbouring pages never
 * repeat each other's list.
 */
export function landingSalary(annual: number): number | null {
  const list = TAKE_HOME_SALARIES;
  for (let i = 0; i < list.length; i++) {
    const s = list[i];
    const below = i > 0 ? (s - list[i - 1]) / 2 : (list[1] - s) / 2;
    const above = i < list.length - 1 ? (list[i + 1] - s) / 2 : (s - list[i - 1]) / 2;
    // Ties at the midpoint go to the lower page, matching nearestSalary().
    if (annual > s - below && annual <= s + above) return s;
    if (i === 0 && annual === s - below) return s;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Change from last year, and the legislated change next year
// ---------------------------------------------------------------------------

export interface YearChange {
  lastYear: string;
  nextYear: string;
  /** Take-home on this salary under 2025-26 rates. */
  lastTakeHome: number;
  thisTakeHome: number;
  /** thisTakeHome − lastTakeHome, a year. */
  change: number;
  changeFortnight: number;
  lastIncomeTax: number;
  thisIncomeTax: number;
  /** HECS-HELP repayment under each year's thresholds (0 below them). */
  lastHecs: number;
  thisHecs: number;
  /** Repayment saved by the indexed threshold: lastHecs − thisHecs. */
  hecsChange: number;
  /** 2027-28 (legislated): 14% second rate plus WATO, all income treated as salary. */
  next: { gain: number; gainFortnight: number; fromRateCut: number; fromWato: number };
}

export function yearChange(salary: number): YearChange {
  const now = salaryFacts(salary).breakdown;
  // Same rounding as calculatePayBreakdown: income tax after LITO, then the levy.
  const lastIncomeTax = Math.max(0, Math.round(incomeTax2025_26(salary) - lito2025_26(salary)));
  const lastMedicare = Math.round(medicareLevy2025_26(salary));
  const lastTakeHome = salary - lastIncomeTax - lastMedicare;
  const change = now.takeHomePay - lastTakeHome;
  const lastHecs = Math.round(helpRepayment2025_26(salary));
  const thisHecs = calculateHECS(salary);
  const cmp = compareTakeHome(salary);
  const gain = Math.round(cmp.gainPerYear);
  return {
    lastYear: "2025-26",
    nextYear: "2027-28",
    lastTakeHome,
    thisTakeHome: now.takeHomePay,
    change,
    changeFortnight: cents(change / FORTNIGHTS),
    lastIncomeTax,
    thisIncomeTax: now.netIncomeTax,
    lastHecs,
    thisHecs,
    hecsChange: lastHecs - thisHecs,
    next: {
      gain,
      gainFortnight: cents(gain / FORTNIGHTS),
      fromRateCut: Math.round(cmp.fromRateCut),
      fromWato: Math.round(cmp.fromWato),
    },
  };
}

/** HECS-HELP thresholds of both years, for the copy. */
export const HECS_THRESHOLDS = {
  last: HECS_HELP_2025_26.minimumThreshold,
  this: HECS_HELP.minimumThreshold,
  indexationRate: HECS_HELP.indexationRate,
  indexationDate: HECS_HELP.indexationDate,
} as const;

// ---------------------------------------------------------------------------
// Low salaries: hours a week, junior rates, offsets
// ---------------------------------------------------------------------------

export interface HoursRow {
  /** "National Minimum Wage" or the award's short name. */
  label: string;
  /** Classification, null for the National Minimum Wage. */
  classification: string | null;
  href: string;
  hourly: number;
  casualHourly: number;
  /** Hours a week over 52 weeks to earn the salary at the permanent rate. */
  hours: number;
  casualHours: number;
  effectiveLabel: string;
  sourceUrl: string;
  sourceLabel: string;
}

/**
 * Two common award entry rates from the award rate index: General Retail
 * Level 1 and Cleaning Level 1 (both adult, full-time ordinary hours).
 */
const ENTRY_RATES: readonly { code: string; classification: string }[] = [
  { code: "MA000004", classification: "Level 1" },
  { code: "MA000022", classification: "Level 1" },
];

function entryRate(code: string, classification: string): AwardRateEntry {
  const e = AWARD_RATE_INDEX.find((r) => r.code === code && r.classification === classification && r.stream === null);
  if (!e) throw new Error(`take-home sections: no award rate ${code} ${classification}`);
  return e;
}

const hoursFor = (salary: number, hourly: number) => Math.round((salary / 52 / hourly) * 10) / 10;

export function hoursRows(salary: number): HoursRow[] {
  const rows: HoursRow[] = [
    {
      label: "National Minimum Wage",
      classification: null,
      href: "/minimum-wage-australia/",
      hourly: NMW.hourly,
      casualHourly: NMW.casualHourly,
      hours: hoursFor(salary, NMW.hourly),
      casualHours: hoursFor(salary, NMW.casualHourly),
      effectiveLabel: NMW_DECISION.operativeFrom,
      sourceUrl: NMW_ORDER.url,
      sourceLabel: `${NMW_ORDER.citation} (${NMW_ORDER.reference})`,
    },
  ];
  for (const { code, classification } of ENTRY_RATES) {
    const e = entryRate(code, classification);
    const casual = Math.round(e.hourly * (1 + e.casualLoading) * 100) / 100;
    rows.push({
      label: e.award,
      classification: e.classification,
      href: e.href ?? "/award-rates/",
      hourly: e.hourly,
      casualHourly: casual,
      hours: hoursFor(salary, e.hourly),
      casualHours: hoursFor(salary, casual),
      effectiveLabel: e.effectiveLabel,
      sourceUrl: e.source.url,
      sourceLabel: e.source.label,
    });
  }
  return rows;
}

export interface JuniorOnPage extends JuniorRateRow {
  /** Full-time junior minimum, weekly × 52. */
  annual: number;
}

/** Full-time minimum wage figures (junior ages, and the adult rate) that land on this page. */
export function minimumWageOnPage(salary: number): { juniors: JuniorOnPage[]; adult: boolean } {
  const juniors = JUNIOR_RATES.filter((r) => r.years < 21)
    .map((r) => ({ ...r, annual: Math.round(r.weekly * 52) }))
    .filter((r) => landingSalary(r.annual) === salary);
  return { juniors, adult: landingSalary(NMW.annual) === salary };
}

export interface LowIncomeHelp {
  /** Bracket tax before LITO and the offset itself. */
  bracketTax: number;
  lito: number;
  litoStage: "full" | "phase-out" | "nil";
  incomeTax: number;
  medicareStage: "exempt" | "shade-in" | "full";
  medicare: number;
  /** The levy at the full 2%, for comparison. */
  medicareFull: number;
  /** LISTO paid into super on employer SG, current rules (0 when over the threshold). */
  listoNow: number;
  listoNowCapped: boolean;
  /** LISTO under the legislated 2027-28 rules. */
  listoNext: number;
  /** Co-contribution for a $1,000 personal after-tax contribution. */
  coContribution: number;
}

export function lowIncomeHelp(salary: number): LowIncomeHelp {
  const f = salaryFacts(salary);
  const b = f.breakdown;
  const sg = salary * SUPER_GUARANTEE.rate;
  const listoNow = listoFromSalary(salary);
  return {
    bracketTax: b.incomeTax,
    lito: Math.min(b.litoOffset, b.incomeTax),
    litoStage: f.litoStage === "full" ? "full" : f.litoStage === "nil" ? "nil" : "phase-out",
    incomeTax: b.netIncomeTax,
    medicareStage: f.medicareStage,
    medicare: b.medicareLevy,
    medicareFull: Math.round(salary * MEDICARE_LEVY.rate),
    listoNow,
    listoNowCapped: listoNow > 0 && sg * LISTO_CURRENT.rate > LISTO_CURRENT.maxPayment,
    listoNext: listoFromSalary(salary, LISTO_2027_28),
    coContribution: maxCoContribution(salary),
  };
}

export const LISTO_RULES = { now: LISTO_CURRENT, next: LISTO_2027_28 } as const;
export const CO_CONTRIBUTION_RULES = CO_CONTRIBUTION;

// ---------------------------------------------------------------------------
// Salary sacrifice ($5,000)
// ---------------------------------------------------------------------------

export interface SacrificeEffect {
  /** What was modelled: $5,000, or the concessional cap room if that is less. */
  amount: number;
  /** Concessional cap left after employer super guarantee. */
  room: number;
  fits: boolean;
  takeHomeCost: number;
  costFortnight: number;
  /** Tax, Medicare and offsets saved: amount − takeHomeCost. */
  saved: number;
  /** saved / amount. */
  rateSaved: number;
  incomeTaxSaved: number;
  medicareSaved: number;
  /** Extra LITO from the lower taxable income. */
  litoGain: number;
  /** What reaches super after contributions tax (and any extra Division 293). */
  intoSuper: number;
  /** intoSuper − takeHomeCost. */
  netGain: number;
  after: PayBreakdown;
}

export const SACRIFICE_AMOUNT = 5_000;

export function sacrificeEffect(salary: number, amount = SACRIFICE_AMOUNT): SacrificeEffect {
  const f = salaryFacts(salary);
  const used = Math.max(0, Math.min(amount, f.concessionalRoom));
  const before = f.breakdown;
  const after = calculatePayBreakdown({ grossSalary: salary, salarySacrifice: used });
  const takeHomeCost = before.takeHomePay - after.takeHomePay;
  // Division 293 counts income plus concessional contributions, so moving
  // salary into super changes it only where the excess exceeds the SG alone.
  const extra293 =
    division293Estimate(salary - used, f.employerSuper + used) - division293Estimate(salary, f.employerSuper);
  const intoSuper = Math.round(used * (1 - CONTRIBUTIONS_TAX_RATE) - extra293);
  const saved = used - takeHomeCost;
  return {
    amount: used,
    room: f.concessionalRoom,
    fits: f.concessionalRoom >= amount,
    takeHomeCost,
    costFortnight: cents(takeHomeCost / FORTNIGHTS),
    saved,
    rateSaved: used > 0 ? saved / used : 0,
    incomeTaxSaved: before.netIncomeTax - after.netIncomeTax,
    medicareSaved: before.medicareLevy - after.medicareLevy,
    litoGain: after.litoOffset - before.litoOffset,
    intoSuper,
    netGain: intoSuper - takeHomeCost,
    after,
  };
}

// ---------------------------------------------------------------------------
// HECS-HELP: only where the rate differs from a neighbouring page
// ---------------------------------------------------------------------------

export interface HecsNeighbour {
  salary: number;
  rate: number;
  repayment: number;
  /** First dollar of that page's band. */
  bandStart: number;
  topBand: boolean;
}

export interface HecsShift {
  rate: number;
  label: string;
  /** First dollar of this salary's band (0 below the threshold). */
  bandStart: number;
  threshold: number;
  repayment: number;
  repaymentFortnight: number;
  takeHome: number;
  topBand: boolean;
  /** The previous page, when it sits in a different band. */
  prev: HecsNeighbour | null;
  /** The next page, when it sits in a different band. */
  next: HecsNeighbour | null;
}

const lastHecsBand = HECS_HELP.bands.length - 1;

function hecsNeighbour(salary: number): HecsNeighbour {
  const i = salaryFacts(salary).hecsBandIndex;
  return {
    salary,
    rate: HECS_HELP.bands[i].marginalRate,
    repayment: calculateHECS(salary),
    bandStart: HECS_HELP.bands[i].min,
    topBand: i === lastHecsBand,
  };
}

export function hecsShift(salary: number): HecsShift | null {
  const { prev, next } = prevNext("take-home", salary);
  const f = salaryFacts(salary);
  const here = hecsNeighbour(salary);
  const p = prev !== null ? hecsNeighbour(prev) : null;
  const n = next !== null ? hecsNeighbour(next) : null;
  const prevDiff = p && p.rate !== here.rate ? p : null;
  const nextDiff = n && n.rate !== here.rate ? n : null;
  if (!prevDiff && !nextDiff) return null;
  return {
    rate: here.rate,
    label: HECS_HELP.bands[f.hecsBandIndex].label,
    bandStart: here.bandStart,
    threshold: HECS_HELP.minimumThreshold,
    repayment: f.withHecs.hecsRepayment,
    repaymentFortnight: cents(f.withHecs.hecsRepayment / FORTNIGHTS),
    takeHome: f.withHecs.takeHomePay,
    topBand: here.topBand,
    prev: prevDiff,
    next: nextDiff,
  };
}

// ---------------------------------------------------------------------------
// High salaries: Medicare levy surcharge, Division 293, the SG cap
// ---------------------------------------------------------------------------

export interface MlsEffect {
  incomeYear: string;
  tier: 1 | 2 | 3;
  rate: number;
  amount: number;
  amountFortnight: number;
  takeHomeWithout: number;
  tierMin: number;
  tierMax: number | null;
  next: { tier: 2 | 3; min: number; rate: number; distance: number } | null;
  familyTier1Min: number;
  /** The previous page, when it sits in a lower tier (or pays none). */
  prevPage: { salary: number; tier: 0 | 1 | 2 | 3; amount: number } | null;
  /** The next page, when it sits in a higher tier. */
  nextPage: { salary: number; tier: 0 | 1 | 2 | 3; amount: number } | null;
}

export function mlsEffect(salary: number): MlsEffect | null {
  const f = salaryFacts(salary);
  if (f.mls.tier === 0) return null;
  const s = MEDICARE_LEVY.surcharge;
  const tiers: readonly { min: number; max: number; rate: number }[] = [s.tier1, s.tier2, s.tier3];
  const t = tiers[f.mls.tier - 1];
  const nextTier = f.mls.tier < 3 ? tiers[f.mls.tier] : null;
  return {
    incomeYear: MLS_INCOME_YEAR,
    tier: f.mls.tier,
    rate: f.mls.rate,
    amount: f.mls.amount,
    amountFortnight: cents(f.mls.amount / FORTNIGHTS),
    takeHomeWithout: f.breakdown.takeHomePay - f.mls.amount,
    tierMin: t.min,
    tierMax: Number.isFinite(t.max) ? t.max : null,
    next: nextTier
      ? { tier: (f.mls.tier + 1) as 2 | 3, min: nextTier.min, rate: nextTier.rate, distance: nextTier.min - salary }
      : null,
    familyTier1Min: s.familyTier1.min,
    prevPage: (() => {
      const { prev } = prevNext("take-home", salary);
      if (prev === null) return null;
      const m = salaryFacts(prev).mls;
      return m.tier < f.mls.tier ? { salary: prev, tier: m.tier, amount: m.amount } : null;
    })(),
    nextPage: (() => {
      const { next } = prevNext("take-home", salary);
      if (next === null) return null;
      const m = salaryFacts(next).mls;
      return m.tier > f.mls.tier ? { salary: next, tier: m.tier, amount: m.amount } : null;
    })(),
  };
}

/** Distance to the surcharge for a middle salary within $10,000 of it, else null. */
export function mlsAhead(salary: number): { min: number; distance: number; tier1Rate: number; firstYear: number } | null {
  const min = MEDICARE_LEVY.surcharge.tier1.min;
  if (salary >= min || min - salary > 10_000) return null;
  return {
    min,
    distance: min - salary,
    tier1Rate: MEDICARE_LEVY.surcharge.tier1.rate,
    firstYear: Math.round(min * MEDICARE_LEVY.surcharge.tier1.rate),
  };
}

export interface Div293Effect {
  threshold: number;
  rate: number;
  incomePlusSuper: number;
  over: number;
  /** The contributions the extra 15% falls on: the lesser of the excess and the SG. */
  base: number;
  amount: number;
  amountFortnight: number;
}

export function div293Effect(salary: number): Div293Effect | null {
  const f = salaryFacts(salary);
  if (f.division293 <= 0) return null;
  const total = salary + f.employerSuper;
  const over = total - DIVISION_293.threshold;
  return {
    threshold: DIVISION_293.threshold,
    rate: DIVISION_293.rate,
    incomePlusSuper: total,
    over,
    base: Math.min(over, f.employerSuper),
    amount: f.division293,
    amountFortnight: cents(f.division293 / FORTNIGHTS),
  };
}

export function sgCap(salary: number): { maxBase: number; maxSG: number; uncapped: number } | null {
  const f = salaryFacts(salary);
  if (!f.superCapped) return null;
  return {
    maxBase: SUPER_GUARANTEE.maxContributionBaseAnnual,
    maxSG: f.employerSuper,
    uncapped: Math.round(salary * SUPER_GUARANTEE.rate),
  };
}

// ---------------------------------------------------------------------------
// Jobs and pay scales that land on this page
// ---------------------------------------------------------------------------

export interface OccupationOnPage extends OccupationMedian {
  diff: number;
  fortnightlyTakeHome: number;
}

/** JSA occupation medians that land on this page, in salary order. */
export function occupationsOnPage(salary: number): OccupationOnPage[] {
  return OCCUPATION_MEDIANS.filter((o) => landingSalary(o.annual) === salary).map((o) => ({
    ...o,
    diff: o.annual - salary,
    fortnightlyTakeHome: calculatePayBreakdown({ grossSalary: o.annual }).fortnightly,
  }));
}

export interface PublicPayOnPage {
  id: string;
  /** One key per service (public service of a state, or a state's specialist scale). */
  groupKey: string;
  service: string;
  href: string;
  classification: string;
  /** Short code as on a payslip: "AO3", "VPS 3.1", "APS 4"; the state for specialists. */
  code: string;
  point: "first" | "top" | "floor" | "step" | "allowance" | "rank" | "scale" | "paid" | "adult" | "junior";
  /** What the figure is, for the small print: "first pay point", a scale title. */
  detail: string;
  annual: number;
  diff: number;
  fortnightlyTakeHome: number;
  effectiveFrom: string;
  sourceUrl: string;
}

/**
 * Service-wide schedules only. Left out: survey schedules (actual pay, not a
 * rate), one-agency examples that repeat a service-wide scale (Treasury,
 * Queensland Department of Education), nursing (on /tax-on/ and the nursing
 * pages) and the Victorian executive bands, which are total remuneration
 * packages including super and so cannot go through a salary calculation.
 */
const EXCLUDED_SCHEDULES = new Set(["treasury-2026", "doe-2026", "qld-nursing-2026", "vic-executives-2026"]);
/** APS-wide thresholds are the lowest bottom an agency's range may have, not a pay point. */
const FLOOR_SCHEDULES = new Set(["aps-thresholds-2026"]);
/** The staff specialist scales are printed on each specialist pay page; this one links them. */
const SPECIALIST_HREF = "/job-pay-rates/surgeon/";

type PayPointBase = Omit<PublicPayOnPage, "diff" | "fortnightlyTakeHome">;

/** "Sergeant (Table 1b)" -> "Sergeant"; "Larger aircraft minimum salaries (clause A.1.2)" -> "Larger aircraft minimum salaries". */
const shortTitle = (title: string) => title.replace(/\s*\([^)]*\)\s*$/, "");

const PUBLIC_PAY_POINTS: readonly PayPointBase[] = (() => {
  const out: PayPointBase[] = [];
  for (const j of JURISDICTIONS) {
    for (const sch of j.schedules) {
      if (EXCLUDED_SCHEDULES.has(sch.id)) continue;
      const source = j.sources.find((src) => src.id === sch.sourceId);
      if (sch.basis === "survey") {
        // Actual pay, not a rate: the median base salary paid at each level, and
        // the 5th and 95th percentiles the survey reports as the range.
        for (const st of sch.streams) {
          for (const b of st.bands) {
            const base = {
              groupKey: `paid|${j.slug}`,
              service: j.name,
              href: `/public-service-pay-scales/${j.slug}/`,
              classification: b.name,
              code: b.code,
              point: "paid" as const,
              effectiveFrom: sch.effectiveFrom,
              sourceUrl: source?.url ?? "",
            };
            if (b.median) out.push({ ...base, id: `${j.slug}|${sch.id}|${b.code}|median`, detail: "median base salary actually paid", annual: b.median });
            out.push({ ...base, id: `${j.slug}|${sch.id}|${b.code}|p5`, detail: "5th percentile of base salaries paid", annual: b.min });
            out.push({ ...base, id: `${j.slug}|${sch.id}|${b.code}|p95`, detail: "95th percentile of base salaries paid", annual: b.max });
          }
        }
        continue;
      }
      for (const st of sch.streams) {
        for (const b of st.bands) {
          const base = {
            groupKey: `ps|${j.slug}`,
            service: j.name,
            href: `/public-service-pay-scales/${j.slug}/`,
            classification: b.name,
            code: b.code,
            effectiveFrom: sch.effectiveFrom,
            sourceUrl: source?.url ?? "",
          };
          if (FLOOR_SCHEDULES.has(sch.id)) {
            out.push({ ...base, id: `${j.slug}|${sch.id}|${b.code}|floor`, point: "floor", detail: "lowest start any agency may set", annual: b.min });
            continue;
          }
          out.push({ ...base, id: `${j.slug}|${sch.id}|${b.code}|first`, point: "first", detail: "first pay point", annual: b.min });
          if (b.max !== b.min) {
            out.push({ ...base, id: `${j.slug}|${sch.id}|${b.code}|top`, point: "top", detail: "top pay point", annual: b.max });
          }
        }
      }
    }
  }
  // Public hospital staff specialists (NSW, VIC, QLD): base salary per step,
  // and NSW's figure with the 17.4% special allowance where the scale prints it.
  for (const sc of STAFF_SPECIALIST_SCALES) {
    for (const step of sc.steps) {
      const base = {
        groupKey: `specialist|${sc.state}`,
        service: `${sc.state} public hospital specialists`,
        href: SPECIALIST_HREF,
        classification: step.label,
        code: sc.state,
        effectiveFrom: sc.effectiveFrom.replace(/^From /, "").replace(/^Wage rates payable from /, ""),
        sourceUrl: sc.url,
      };
      out.push({ ...base, id: `specialist|${sc.state}|${step.label}|step`, point: "step", detail: "base salary", annual: step.annual });
      if (step.withAllowance) {
        out.push({
          ...base,
          id: `specialist|${sc.state}|${step.label}|allowance`,
          point: "allowance",
          detail: "with the 17.4% special allowance",
          annual: step.withAllowance,
        });
      }
    }
  }
  // Australian Defence Force: the lowest increment of each rank at each pay
  // grade (PACMAN Schedules B.3 and B.12). The pay grade is set by the
  // member's employment category, so each figure is a rank-and-category floor.
  for (const t of [...OTHER_RANK_SALARIES, ...OFFICER_SALARIES]) {
    const lowest = t.rows[t.rows.length - 1];
    const byName = new Map<string, string[]>();
    for (const [svc, label] of [["Army", t.names.army], ["Navy", t.names.navy], ["Air Force", t.names.airForce]] as const) {
      if (!label) continue;
      byName.set(label, [...(byName.get(label) ?? []), svc]);
    }
    const classification = [...byName.entries()].map(([name, svcs]) => `${name} (${svcs.join(", ")})`).join(", ");
    const href = t.names.army ? "/adf-pay-scales/army/" : t.names.navy ? "/adf-pay-scales/navy/" : "/adf-pay-scales/air-force/";
    lowest.salaries.forEach((annual, i) => {
      if (annual === null) return;
      out.push({
        id: `adf|${t.id}|${lowest.increment}|pg${i + 1}`,
        groupKey: "adf",
        service: "Australian Defence Force",
        href,
        classification,
        code: `pay grade ${i + 1}`,
        point: "rank",
        detail: "lowest increment of the rank",
        annual,
        effectiveFrom: ADF_PAY_EFFECTIVE,
        sourceUrl: t.group === "officers" ? PACMAN_URLS.officers : PACMAN_URLS.otherRanks,
      });
    });
  }
  // Police, paramedics, firefighters and prison officers: every step of every
  // scale in the states this site publishes (lib/data/service-pay).
  for (const [occupation, states] of Object.entries(SERVICE_PAY) as [ServiceOccupation, Record<string, ServicePayJurisdiction>][]) {
    const cfg = SERVICE_OCCUPATION_CONFIG[occupation];
    for (const slug of SERVICE_PAY_BUILT[occupation]) {
      const j = states[slug];
      if (!j) continue;
      for (const sc of j.scales) {
        for (const step of sc.steps) {
          out.push({
            id: `${occupation}|${slug}|${sc.id}|${step.label}`,
            groupKey: `${occupation}|${slug}`,
            service: j.employer,
            href: `${cfg.hubPath}${slug}/`,
            classification: step.label,
            code: "",
            point: "scale",
            detail: shortTitle(sc.title),
            annual: step.salary,
            effectiveFrom: sc.effectiveFrom ?? j.ratesEffectiveFrom,
            sourceUrl: j.agreementUrl,
          });
        }
      }
    }
  }
  // Employers with a published agreement or award rate (lib/data/employer-pay):
  // each adult classification full-time, and each junior rate full-time.
  for (const e of EMPLOYERS) {
    const base = {
      groupKey: `employer|${e.slug}`,
      service: e.name,
      href: `/pay-rates/${e.slug}/`,
      code: "",
      effectiveFrom: e.ratesEffectiveFrom,
      sourceUrl: e.instrument.url,
    };
    for (const row of e.rates) {
      out.push({ ...base, id: `employer|${e.slug}|${row.level}`, classification: row.level, point: "adult", detail: "adult rate", annual: Math.round(annualFor(e, row)) });
    }
    const entry = employerEntryRate(e);
    for (const j of juniorRates(e)) {
      out.push({
        ...base,
        id: `employer|${e.slug}|${entry.level}|junior|${j.age}`,
        classification: `${entry.level}, aged ${j.age}`,
        point: "junior",
        detail: `${Math.round(j.percentage * 100)}% junior rate`,
        annual: Math.round(annualFullTime(j.hourly)),
      });
    }
  }
  // Pilots (Air Pilots Award minimums) and air traffic control (Airservices agreement).
  for (const [slug, page] of Object.entries(AVIATION_PAY) as [AviationPageSlug, AviationPayPage][]) {
    for (const sc of page.scales) {
      for (const step of sc.steps) {
        out.push({
          id: `aviation|${slug}|${sc.id}|${step.label}`,
          groupKey: `aviation|${slug}`,
          service: slug === "pilot" ? "Air Pilots Award" : "Airservices Australia",
          href: AVIATION_PATHS[slug],
          classification: step.label,
          code: "",
          point: "scale",
          detail: shortTitle(sc.title),
          annual: step.salary,
          effectiveFrom: sc.effectiveFrom ?? page.ratesEffectiveFrom,
          sourceUrl: page.instrument.url,
        });
      }
    }
  }
  return out;
})();

/**
 * Groups whose rows repeat a classification at several figures (an ADF rank
 * at its ten pay grades): at most one row per classification on a page.
 */
const ONE_PER_CLASSIFICATION = new Set(["adf"]);

/** Rows the jobs table will show: employer points at the same rate and kind share a row. */
function rowCount(points: readonly PayPointBase[]): number {
  return new Set(points.map((p) => (p.groupKey.startsWith("employer|") ? `employer|${p.point}|${p.annual}` : p.id))).size;
}

/**
 * Public pay points that land on this page: closest first, one per service
 * before any service gets a second, at most `max`, in salary order.
 */
export function publicPayOnPage(salary: number, max = 14): PublicPayOnPage[] {
  const hits = PUBLIC_PAY_POINTS.filter((p) => landingSalary(p.annual) === salary).sort(
    (a, b) => Math.abs(a.annual - salary) - Math.abs(b.annual - salary) || a.id.localeCompare(b.id),
  );
  const picked: typeof hits = [];
  const services = new Set<string>();
  for (const pass of [true, false]) {
    for (const p of hits) {
      if (rowCount(picked) >= max) break;
      if (picked.includes(p)) continue;
      if (pass && services.has(p.groupKey)) continue;
      if (ONE_PER_CLASSIFICATION.has(p.groupKey) && picked.some((q) => q.groupKey === p.groupKey && q.classification === p.classification)) continue;
      picked.push(p);
      services.add(p.groupKey);
    }
  }
  return picked
    .sort((a, b) => a.annual - b.annual || a.id.localeCompare(b.id))
    .map((p) => ({
      ...p,
      diff: p.annual - salary,
      fortnightlyTakeHome: calculatePayBreakdown({ grossSalary: p.annual }).fortnightly,
    }));
}

// ---------------------------------------------------------------------------
// Apprentice full-time minimums that land on this page
// ---------------------------------------------------------------------------

export interface ApprenticeOnPage {
  id: string;
  track: "junior" | "adult";
  stage: ApprenticeStage;
  stageLabel: string;
  year12: Year12;
  /** Full-time weekly minimum × 52. */
  annual: number;
  weekly: number;
  diff: number;
  fortnightlyTakeHome: number;
  /** Every trade with this exact rate, with a link to its page. */
  trades: { slug: string; name: string; href: string; award: string; awardUrl: string }[];
}

function tradeHref(slug: string, fallback: string | undefined): string {
  const spoke = APPRENTICE_SPOKES.find((sp) => sp.tradeSlug === slug);
  return spoke ? `/apprentice-pay/${spoke.slug}/` : (fallback ?? "/apprentice-pay-rates/");
}

/** "Building and construction (carpentry and other on-site trades)" -> "Building and construction". */
const tradeShortName = (name: string) => name.replace(/\s*\(.*\)\s*$/, "");

/** Apprentice full-time minimums (award rates) landing on this page, one row per rate, trades merged. */
export function apprenticesOnPage(salary: number): ApprenticeOnPage[] {
  // Per trade, a rate that applies whether or not the apprentice finished
  // Year 12 is one entry ("either"), not two.
  const perTrade = new Map<string, { t: (typeof APPRENTICE_TRADES)[number]; track: "junior" | "adult"; stage: ApprenticeStage; annual: number; weekly: number; year12: Set<Year12> }>();
  for (const t of APPRENTICE_TRADES) {
    const tracks: readonly ["junior" | "adult", readonly { stage: ApprenticeStage; year12: Year12; weekly: number }[]][] = [
      ["junior", t.junior],
      ["adult", t.adult ?? []],
    ];
    for (const [track, rates] of tracks) {
      for (const r of rates) {
        const annual = Math.round(r.weekly * 52);
        if (landingSalary(annual) !== salary) continue;
        const key = `${t.slug}|${track}|${r.stage}|${annual}`;
        const hit = perTrade.get(key);
        if (hit) hit.year12.add(r.year12);
        else perTrade.set(key, { t, track, stage: r.stage, annual, weekly: r.weekly, year12: new Set([r.year12]) });
      }
    }
  }
  const rows = new Map<string, ApprenticeOnPage>();
  for (const e of perTrade.values()) {
    const year12: Year12 = e.year12.size > 1 || e.year12.has("either") ? "either" : [...e.year12][0];
    const id = `${e.track}|${e.stage}|${year12}|${e.annual}`;
    const trade = { slug: e.t.slug, name: tradeShortName(e.t.name), href: tradeHref(e.t.slug, e.t.tradePageHref), award: e.t.award.name, awardUrl: e.t.award.url };
    const hit = rows.get(id);
    if (hit) {
      if (!hit.trades.some((x) => x.slug === e.t.slug)) hit.trades.push(trade);
      continue;
    }
    rows.set(id, {
      id,
      track: e.track,
      stage: e.stage,
      stageLabel: STAGE_LABELS[e.stage],
      year12,
      annual: e.annual,
      weekly: e.weekly,
      diff: e.annual - salary,
      fortnightlyTakeHome: calculatePayBreakdown({ grossSalary: e.annual }).fortnightly,
      trades: [trade],
    });
  }
  return [...rows.values()].sort((a, b) => a.annual - b.annual || a.id.localeCompare(b.id));
}

export const APPRENTICE_RATES_EFFECTIVE = APPRENTICE_RATES_FROM;

/** The jobs section shows only where it names at least this many. */
export const JOBS_MIN = 3;

export interface JobsOnPage {
  occupations: OccupationOnPage[];
  publicPay: PublicPayOnPage[];
  apprentices: ApprenticeOnPage[];
  show: boolean;
}

/** Middle and high salaries: occupation medians, public pay points and (around $50k) apprentice rates. */
export function jobsOnPage(salary: number): JobsOnPage {
  const occupations = occupationsOnPage(salary);
  const publicPay = publicPayOnPage(salary);
  const apprentices = apprenticesOnPage(salary);
  return { occupations, publicPay, apprentices, show: occupations.length + publicPay.length + apprentices.length >= JOBS_MIN };
}
