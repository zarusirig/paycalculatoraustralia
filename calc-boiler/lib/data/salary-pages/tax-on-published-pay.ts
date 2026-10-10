// =============================================================================
// More published pay near a salary — for /tax-on/[salary]/ (10 Oct 2026,
// second pass).
//
// The first pass listed ABS group figures, JSA occupation medians, state
// teacher and nursing scales and award minimums that round to each page. Those
// stop at about $180,000 and start at the full-time adult minimum wage, so the
// pages below $50,000 and above $200,000 had little or nothing to compare
// against. This adds verified figures the site already prints elsewhere:
//   - Junior minimum wages, full-time (National Minimum Wage Order 2026, from
//     1 July 2026; lib/constants/junior-rates.ts, /minimum-wage-by-age/).
//   - Apprentice minimum wages, full-time, nine trades (modern awards, from
//     1 July 2026; lib/data/apprentice-pay, /apprentice-pay-rates/).
//   - APSC APS Remuneration Data, 31 December 2025: median base salary by APS
//     classification, Graduate to SES Band 3 (lib/data/public-service-pay/aps.ts).
//   - ATO Taxation statistics 2023–24, Individuals Table 15: median salary or
//     wages and average taxable income for the medical and dental occupations,
//     by sex and by state where the ATO publishes it
//     (lib/data/health-salary/ato-2023-24.ts).
//   - Public hospital staff specialist scales, NSW, VIC and QLD
//     (lib/data/health-salary/staff-specialists.ts).
// Nothing is typed in here; every figure is read or derived (weekly × 52, the
// site's convention) from those files.
//
// Each figure appears on exactly one page: the one it is closest to on the
// /tax-on/ grid (payBand). On the $5,000 part of the grid that is the same as
// rounding to the nearest $5,000, which the other lists use.
// =============================================================================

import { APS } from "../public-service-pay/aps";
import { APS_GRADE_SLUGS } from "../public-service-pay/aps-grades";
import { ATO_15A, ATO_15B, ATO_15D, ATO_INCOME_YEAR, ATO_TABLE_15_SOURCE } from "../health-salary/ato-2023-24";
import { STAFF_SPECIALIST_SCALES } from "../health-salary/staff-specialists";
import { HEALTH_SALARY_PAGES } from "../health-salary/index";
import { OCCUPATIONS } from "../job-pay-rates/index";
import type { AtoRow } from "../health-salary/types";
import { JUNIOR_BANDS, NMW_ORDER, juniorWeeklyRate } from "../../constants/junior-rates";
import { APPRENTICE_RATES_FROM, APPRENTICE_TRADES } from "../apprentice-pay/index";
import { EMPLOYMENT } from "../../constants/australian-tax";
import { TAX_ON_SALARIES } from "./index";

export interface PublishedPay {
  id: string;
  /** Who is paid it: "APS 6", "Radiologists", "NSW staff specialist, year 3". */
  who: string;
  /** What the figure is, with its publisher and date: groups the list on the page. */
  measure: string;
  annual: number;
  /** This site's page that prints it. */
  href: string;
  /** The publication the figure was read from. */
  ref: { title: string; url: string; publisher: string };
}

/** The grid page's share of the salary line: halfway to each neighbour (lo inclusive, hi exclusive). */
export function payBand(salary: number): { lo: number; hi: number } | null {
  const i = TAX_ON_SALARIES.indexOf(salary);
  if (i === -1) return null;
  const prev = TAX_ON_SALARIES[i - 1];
  const next = TAX_ON_SALARIES[i + 1];
  const lo = prev === undefined ? salary - (next - salary) / 2 : (prev + salary) / 2;
  const hi = next === undefined ? salary + (salary - prev) / 2 : (salary + next) / 2;
  return { lo, hi };
}

// ---------------------------------------------------------------------------
// Junior and apprentice minimums (full-time, weekly × 52)
// ---------------------------------------------------------------------------

const annualOf = (weekly: number) => Math.round(weekly * EMPLOYMENT.weeksPerYear);

function juniorMinimums(): PublishedPay[] {
  const ref = { title: `${NMW_ORDER.citation} (${NMW_ORDER.reference})`, url: NMW_ORDER.url, publisher: "Fair Work Commission" };
  return JUNIOR_BANDS.filter((b) => b.percentage < 1).map((b) => ({
    id: `junior-${b.years}`,
    who: b.years < 16 ? "Under 16" : `Age ${b.years}`,
    measure: `Junior minimum wage, full-time (from ${NMW_ORDER.operativeFrom})`,
    annual: annualOf(juniorWeeklyRate(b.percentage)),
    href: `/minimum-wage-by-age/${b.years}/`,
    ref,
  }));
}

const TRADE_SHORT: Record<string, string> = {
  electrical: "electrical",
  plumbing: "plumbing",
  building: "building",
  automotive: "automotive",
  hairdressing: "hairdressing",
  "beauty-therapy": "beauty therapy",
  cookery: "cookery",
  manufacturing: "manufacturing",
  meat: "meat",
};

/** Apprentice minimums, one entry per distinct (track, year, Year 12, amount), naming every trade that pays it. */
function apprenticeMinimums(): PublishedPay[] {
  type Group = { track: string; stage: number; y12: string; annual: number; trades: string[]; ref: PublishedPay["ref"] };
  const groups = new Map<string, Group>();
  for (const t of APPRENTICE_TRADES) {
    for (const [track, rows] of [["junior", t.junior], ["adult", t.adult ?? []]] as const) {
      for (const r of rows) {
        const annual = annualOf(r.weekly);
        const key = `${track}|${r.stage}|${r.year12}|${annual}`;
        const g = groups.get(key);
        const name = TRADE_SHORT[t.slug] ?? t.slug;
        if (g) {
          if (!g.trades.includes(name)) g.trades.push(name);
        } else {
          groups.set(key, {
            track,
            stage: r.stage,
            y12: r.year12,
            annual,
            trades: [name],
            ref: { title: t.award.name, url: t.award.url, publisher: "Fair Work Commission" },
          });
        }
      }
    }
  }
  // Where the Year 12 and no-Year 12 rates are the same for the same trades,
  // list them once, then fold every Year 12-independent rate of the same
  // year and amount into one entry.
  for (const g of [...groups.values()]) {
    if (g.y12 !== "completed") continue;
    const twinKey = `${g.track}|${g.stage}|not-completed|${g.annual}`;
    const twin = groups.get(twinKey);
    if (twin && twin.trades.join() === g.trades.join()) {
      g.y12 = "either";
      groups.delete(twinKey);
    }
  }
  const merged = new Map<string, Group>();
  for (const g of groups.values()) {
    const key = `${g.track}|${g.stage}|${g.y12}|${g.annual}`;
    const hit = merged.get(key);
    if (hit) hit.trades.push(...g.trades.filter((t) => !hit.trades.includes(t)));
    else merged.set(key, { ...g, trades: [...g.trades] });
  }
  return [...merged.entries()].map(([key, g]) => {
    const y12 = g.y12 === "completed" ? ", Year 12 done" : g.y12 === "not-completed" ? ", no Year 12" : "";
    const trades = g.trades.length > 1 ? `${g.trades.slice(0, -1).join(", ")} and ${g.trades[g.trades.length - 1]}` : g.trades[0];
    return {
      id: `apprentice-${key}`,
      who: `${g.track === "adult" ? "adult apprentice" : "apprentice"}, year ${g.stage}${y12}: ${trades}`,
      measure: `Apprentice minimum wage, full-time (from ${APPRENTICE_RATES_FROM})`,
      annual: g.annual,
      href: "/apprentice-pay-rates/",
      ref: g.ref,
    };
  });
}

// ---------------------------------------------------------------------------
// APS medians, ATO occupation figures, staff specialist scales
// ---------------------------------------------------------------------------

function apsHref(code: string): string {
  const slug = code.toLowerCase().replace(/^aps (\d)$/, "aps-$1").replace(/^el (\d)$/, "el$1");
  return (APS_GRADE_SLUGS as readonly string[]).includes(slug)
    ? `/public-service-pay-scales/aps/${slug}/`
    : "/public-service-pay-scales/aps/";
}

function apsMedians(): PublishedPay[] {
  const schedule = APS.schedules.find((s) => s.id === "apsc-2025");
  const src = APS.sources.find((x) => x.id === schedule?.sourceId);
  if (!schedule || !src) return [];
  const ref = { title: src.title, url: src.url, publisher: src.publisher };
  return schedule.streams.flatMap((st) =>
    st.bands
      .filter((b) => typeof b.median === "number")
      .map((b) => ({
        id: `aps-${b.code}`,
        who: b.code === "Graduate" ? "APS graduates" : b.code,
        measure: `Median APS base salary (APSC, ${schedule.effectiveFrom})`,
        annual: b.median as number,
        href: apsHref(b.code),
        ref,
      })),
  );
}

type Split = "sex" | "state" | "none";

/** Total rows with their Female and Male rows, single rows, and the state rows (15D). */
const ATO_GROUPS: { rows: readonly AtoRow[]; who: string; href: string; split: Split }[] = [
  { rows: ATO_15A.dentist, who: "Dentists", href: "/job-pay-rates/dentist/", split: "sex" },
  { rows: [ATO_15A.dentalSpecialist], who: "Dental specialists", href: "/job-pay-rates/dentist/", split: "none" },
  { rows: ATO_15D.dentalPractitioner, who: "Dentists and dental specialists", href: "/job-pay-rates/dentist/", split: "state" },
  { rows: ATO_15A.radiologist, who: "Radiologists", href: "/job-pay-rates/radiologist/", split: "sex" },
  { rows: [ATO_15A.radiationOncologist], who: "Radiation oncologists", href: "/job-pay-rates/radiologist/", split: "none" },
  { rows: [ATO_15B.otherMedicalPractitioners], who: "Other medical specialists (ATO group 2539)", href: "/job-pay-rates/radiologist/", split: "none" },
  { rows: ATO_15A.anaesthetist, who: "Anaesthetists", href: "/job-pay-rates/anaesthetist/", split: "sex" },
  { rows: ATO_15D.anaesthetist, who: "Anaesthetists", href: "/job-pay-rates/anaesthetist/", split: "state" },
  { rows: ATO_15A.optometrist, who: "Optometrists", href: "/job-pay-rates/optometrist/", split: "sex" },
  { rows: [ATO_15A.orthoptist], who: "Orthoptists", href: "/job-pay-rates/optometrist/", split: "none" },
  { rows: ATO_15D.optometristOrOrthoptist, who: "Optometrists and orthoptists", href: "/job-pay-rates/optometrist/", split: "state" },
  { rows: ATO_15A.gp, who: "GPs", href: "/job-pay-rates/gp/", split: "sex" },
  { rows: [ATO_15A.residentMedicalOfficer], who: "Resident medical officers", href: "/job-pay-rates/gp/", split: "none" },
  { rows: ATO_15B.surgeon, who: "Surgeons, all specialties", href: "/job-pay-rates/surgeon/", split: "sex" },
  { rows: ATO_15D.surgeon, who: "Surgeons", href: "/job-pay-rates/surgeon/", split: "state" },
  ...ATO_15A.surgicalSpecialties.map((row) => ({ rows: [row] as readonly AtoRow[], who: row.label, href: "/job-pay-rates/surgeon/", split: "none" as Split })),
];

function atoWho(base: string, row: AtoRow, split: Split): string {
  if (split === "none" || row.label === "Total") return base;
  if (split === "sex") return `${base}, ${row.label.toLowerCase()}`;
  return `${base}, ${row.label}`;
}

function atoFigures(): PublishedPay[] {
  const ref = { title: `Taxation statistics ${ATO_INCOME_YEAR}, Individuals Table 15`, url: ATO_TABLE_15_SOURCE.url, publisher: ATO_TABLE_15_SOURCE.publisher };
  return ATO_GROUPS.flatMap(({ rows, who, href, split }) =>
    rows.flatMap((row) => {
      const w = atoWho(who, row, split);
      return [
        { id: `ato-msw-${w}`, who: w, measure: `Median salary or wages (ATO, ${ATO_INCOME_YEAR})`, annual: row.medianSalaryOrWages, href, ref },
        { id: `ato-ati-${w}`, who: w, measure: `Average taxable income, all sources (ATO, ${ATO_INCOME_YEAR})`, annual: row.averageTaxableIncome, href, ref },
      ];
    }),
  );
}

function staffSpecialists(): PublishedPay[] {
  return STAFF_SPECIALIST_SCALES.flatMap((scale) =>
    scale.steps.flatMap((step) => {
      // "Staff specialist, year 1" / "Specialist Year 1" / "L18 (staff specialist entry level)".
      const label = /^L\d/.test(step.label)
        ? `staff specialist ${step.label.replace("(staff specialist entry level)", "(entry level)")}`
        : step.label.charAt(0).toLowerCase() + step.label.slice(1);
      const ref = { title: scale.instrument, url: scale.url, publisher: scale.publisher };
      const base: PublishedPay = {
        id: `ss-${scale.state}-${step.label}`,
        who: `${scale.state} ${label}`,
        measure: "Public hospital staff specialist base salary",
        annual: step.annual,
        href: "/job-pay-rates/anaesthetist/",
        ref,
      };
      if (step.withAllowance === undefined) return [base];
      return [
        base,
        {
          ...base,
          id: `${base.id}-allowance`,
          measure: `Public hospital staff specialist salary ${(scale.allowanceColumn ?? "with allowance").toLowerCase()}`,
          annual: step.withAllowance,
        },
      ];
    }),
  );
}

/**
 * JSA median full-time earnings for the health pages (dentist, GP, surgeon and
 * so on). The occupation list above the published-pay list already covers the
 * /job-pay-rates/ occupations; these unit groups are only on the health pages.
 */
function healthJsaMedians(): PublishedPay[] {
  const covered = new Set(OCCUPATIONS.flatMap((o) => (o.median ? [o.median.anzscoCode] : [])));
  const seen = new Set<string>();
  const out: PublishedPay[] = [];
  for (const page of HEALTH_SALARY_PAGES) {
    const j = page.jsa;
    if (!j || covered.has(j.anzscoCode) || seen.has(j.anzscoCode)) continue;
    seen.add(j.anzscoCode);
    out.push({
      id: `jsa-${j.anzscoCode}`,
      who: j.anzscoTitle,
      measure: "Median full-time earnings (Jobs and Skills Australia, from ABS data for May 2025)",
      annual: Math.round(j.medianWeekly * EMPLOYMENT.weeksPerYear),
      href: `/job-pay-rates/${page.slug}/`,
      ref: { title: `${j.anzscoTitle} (ANZSCO ${j.anzscoCode}) occupation profile`, url: j.url, publisher: "Jobs and Skills Australia" },
    });
  }
  return out;
}

/** Every figure, sorted by annual then id. */
export function publishedPay(): PublishedPay[] {
  return [...juniorMinimums(), ...apprenticeMinimums(), ...apsMedians(), ...healthJsaMedians(), ...atoFigures(), ...staffSpecialists()].sort(
    (a, b) => a.annual - b.annual || a.id.localeCompare(b.id),
  );
}

/** The figures that sit closer to `salary` than to any other /tax-on/ page. */
export function publishedPayNear(salary: number): PublishedPay[] {
  const band = payBand(salary);
  if (!band) return [];
  return publishedPay().filter((p) => p.annual >= band.lo && p.annual < band.hi);
}

/** publishedPayNear grouped by measure, in order of first appearance. */
export function publishedPayGroups(salary: number): { measure: string; items: PublishedPay[] }[] {
  const out: { measure: string; items: PublishedPay[] }[] = [];
  for (const p of publishedPayNear(salary)) {
    const g = out.find((x) => x.measure === p.measure);
    if (g) g.items.push(p);
    else out.push({ measure: p.measure, items: [p] });
  }
  return out;
}
