// =============================================================================
// Australian Pay Report 2026 — the data behind /australian-pay-report-2026/
// and its CSV downloads.
//
// Defines NO figure of its own. Every number is computed from the site's
// single sources of truth, so the report, the CSVs and the Dataset JSON-LD
// move with them when a rate is refreshed:
//   constants/australian-tax.ts      tax scales, LITO, Medicare, the engine
//   constants/tax-rates-reference.ts the legislated 2027-28 scale
//   constants/minimum-wage.ts        National Minimum Wage (AWR 2026)
//   constants/award-directory.ts     entry-level rate of every award we publish
//   data/average-salary              ABS AWE (May 2026) and EE (Aug 2025)
//   data/teacher-pay, nursing-pay, public-service-pay  verified state scales
//
// Relative imports only, so `npm test` can compile it without path aliases.
// =============================================================================

import {
  EMPLOYMENT,
  SITE_CONFIG,
  TAX_BRACKETS_2025_26,
  TAX_BRACKETS_2026_27,
  calculateLITO,
  calculateMedicareLevy,
  type TaxBracket,
} from "../../constants/australian-tax";
import { TAX_BRACKETS_2027_28, taxOnScale } from "../../constants/tax-rates-reference";
import { NMW, NMW_DECISION } from "../../constants/minimum-wage";
import { AWARD_DIRECTORY } from "../../constants/award-directory";
import {
  AWE_HEADLINE,
  AWE_RELEASE,
  EE_MEDIAN,
  EE_RELEASE,
  HEADLINE,
} from "../average-salary";
import { TEACHER_PAY_STATES, graduateSalary, topOfClassroomScale } from "../teacher-pay";
import { NURSING_PAY_STATES, getNursingPay, registeredNurseRange } from "../nursing-pay";
import { JURISDICTIONS } from "../public-service-pay";

// ---------------------------------------------------------------------------
// Report identity
// ---------------------------------------------------------------------------

export const REPORT = {
  slug: "australian-pay-report-2026",
  path: "/australian-pay-report-2026/",
  url: `${SITE_CONFIG.baseUrl}/australian-pay-report-2026/`,
  title: "Australian Pay Report 2026",
  /** First published. */
  publishedIso: "2026-09-24",
  publishedOn: "24 September 2026",
  /** Last time any input was re-checked against its source. */
  updatedIso: "2026-09-24",
  updatedOn: "24 September 2026",
  version: "1.0",
  license: "https://creativecommons.org/licenses/by/4.0/",
  licenseName: "CC BY 4.0",
} as const;

const HOURS_PER_YEAR = EMPLOYMENT.hoursPerYear; // 1,976 = 38 × 52

// ---------------------------------------------------------------------------
// Take-home engine (resident, full year, no HECS, no MLS, SG on top)
// ---------------------------------------------------------------------------

/**
 * Income tax after LITO plus Medicare levy on any resident scale, rounded the
 * same way calculatePayBreakdown rounds (whole dollars, LITO non-refundable).
 * Medicare low-income thresholds are the single MEDICARE_LEVY object for both
 * years — the ATO had not published 2026-27 levy thresholds when this was
 * checked — so the year-on-year difference is purely the rate cut.
 */
export function totalTaxOn(income: number, scale: readonly TaxBracket[]): number {
  if (income <= 0) return 0;
  const incomeTax = Math.max(0, Math.round(taxOnScale(income, scale) - calculateLITO(income)));
  return incomeTax + calculateMedicareLevy(income);
}

export function takeHomeOn(income: number, scale: readonly TaxBracket[] = TAX_BRACKETS_2026_27): number {
  return income - totalTaxOn(income, scale);
}

// ---------------------------------------------------------------------------
// Table 1 — take-home pay by salary, 2025-26 vs 2026-27 (and 2027-28)
// ---------------------------------------------------------------------------

export const REPORT_SALARIES: readonly number[] = [
  20_000, 25_000, 30_000, 35_000, 40_000, 45_000, 50_000, 55_000, 60_000, 65_000, 70_000, 75_000, 80_000,
  90_000, 100_000, 110_000, 120_000, 130_000, 135_000, 150_000, 175_000, 190_000, 200_000, 250_000, 300_000,
];

export interface TakeHomeRow {
  salary: number;
  tax2025: number;
  takeHome2025: number;
  tax2026: number;
  takeHome2026: number;
  /** 2026-27 take-home minus 2025-26 take-home, per year. */
  gainYear: number;
  gainWeek: number;
  /** Legislated 15% → 14% from 1 July 2027. */
  takeHome2027: number;
  /** 2027-28 minus 2025-26 — the two cuts combined. */
  gainBy2027: number;
  /** (Income tax + Medicare) ÷ salary, 2026-27. */
  averageRate2026: number;
}

export function takeHomeRows(salaries: readonly number[] = REPORT_SALARIES): TakeHomeRow[] {
  return salaries.map((salary) => {
    const tax2025 = totalTaxOn(salary, TAX_BRACKETS_2025_26);
    const tax2026 = totalTaxOn(salary, TAX_BRACKETS_2026_27);
    const tax2027 = totalTaxOn(salary, TAX_BRACKETS_2027_28);
    const gainYear = tax2025 - tax2026;
    return {
      salary,
      tax2025,
      takeHome2025: salary - tax2025,
      tax2026,
      takeHome2026: salary - tax2026,
      gainYear,
      gainWeek: Math.round((gainYear / 52) * 100) / 100,
      takeHome2027: salary - tax2027,
      gainBy2027: tax2025 - tax2027,
      averageRate2026: salary > 0 ? tax2026 / salary : 0,
    };
  });
}

/** The largest annual gain from the 1 July 2026 cut, and from where it applies. */
export function maxTaxCutGain(): { perYear: number; perWeek: number; fromIncome: number } {
  // The cut is 1 percentage point on the $18,201–$45,000 band: $26,800 × 1%.
  const band = TAX_BRACKETS_2026_27[1];
  const perYear = Math.round((band.max - (band.min - 1)) * (TAX_BRACKETS_2025_26[1].rate - band.rate));
  return { perYear, perWeek: Math.round((perYear / 52) * 100) / 100, fromIncome: band.max };
}

// ---------------------------------------------------------------------------
// Table 2 — minimum wage vs median vs average
// ---------------------------------------------------------------------------

export interface WageBenchmark {
  id: string;
  label: string;
  weekly: number;
  annual: number;
  /** Gross hourly equivalent, where one is meaningful. */
  hourly: number | null;
  takeHome: number;
  /** annual ÷ NMW annual. */
  timesMinimum: number;
  /** annual ÷ full-time average annual. */
  shareOfAverage: number;
  source: string;
}

export function wageBenchmarks(): WageBenchmark[] {
  const avgFt = HEADLINE.averageAnnual;
  const nmwAnnual = Math.round(NMW.annual);
  const rows: Omit<WageBenchmark, "takeHome" | "timesMinimum" | "shareOfAverage">[] = [
    {
      id: "nmw",
      label: "National Minimum Wage (full-time, 38 hours)",
      weekly: NMW.weekly,
      annual: nmwAnnual,
      hourly: NMW.hourly,
      source: `Fair Work Commission, ${NMW_DECISION.name} ${NMW_DECISION.citation}, from ${NMW_DECISION.operativeFrom}`,
    },
    {
      id: "median-all",
      label: "Median earnings, all employees (incl. part-time)",
      weekly: EE_MEDIAN.allEmployees,
      annual: HEADLINE.medianAllAnnual,
      hourly: EE_MEDIAN.hourlyAll,
      source: `ABS ${EE_RELEASE.title}, ${EE_RELEASE.referencePeriod}`,
    },
    {
      id: "median-ft",
      label: "Median earnings, full-time employees",
      weekly: EE_MEDIAN.fullTime,
      annual: HEADLINE.medianFullTimeAnnual,
      hourly: Math.round((HEADLINE.medianFullTimeAnnual / HOURS_PER_YEAR) * 100) / 100,
      source: `ABS ${EE_RELEASE.title}, ${EE_RELEASE.referencePeriod}`,
    },
    {
      id: "average-all",
      label: "Average earnings, all employees (total earnings)",
      weekly: AWE_HEADLINE.allEmployeesTotalWeekly,
      annual: HEADLINE.averageAllEmployeesAnnual,
      hourly: null,
      source: `ABS ${AWE_RELEASE.title}, ${AWE_RELEASE.referencePeriod}`,
    },
    {
      id: "average-ft",
      label: "Average full-time earnings (AWOTE)",
      weekly: AWE_HEADLINE.fullTimeOrdinaryWeekly,
      annual: avgFt,
      hourly: Math.round((AWE_HEADLINE.fullTimeOrdinaryWeekly / EMPLOYMENT.standardWeeklyHours) * 100) / 100,
      source: `ABS ${AWE_RELEASE.title}, ${AWE_RELEASE.referencePeriod}`,
    },
  ];
  return rows
    .map((r) => ({
      ...r,
      takeHome: takeHomeOn(r.annual),
      timesMinimum: r.annual / nmwAnnual,
      shareOfAverage: r.annual / avgFt,
    }))
    .sort((a, b) => a.annual - b.annual);
}

// ---------------------------------------------------------------------------
// Table 3 — award minimums ranked
// ---------------------------------------------------------------------------

export interface AwardRankRow {
  rank: number;
  name: string;
  code: string;
  href: string;
  classification: string;
  hourly: number;
  weekly: number;
  annual: number;
  /** hourly ÷ NMW hourly − 1. */
  premiumOverNmw: number;
  takeHome: number;
}

export function awardRanking(): AwardRankRow[] {
  return [...AWARD_DIRECTORY]
    .sort((a, b) => b.headlineHourly - a.headlineHourly || a.name.localeCompare(b.name, "en-AU"))
    .map((a, i) => {
      const annual = Math.round(a.headlineWeekly * EMPLOYMENT.weeksPerYear);
      return {
        rank: i + 1,
        name: a.name,
        code: a.code,
        href: a.href,
        classification: a.headlineLevel,
        hourly: a.headlineHourly,
        weekly: a.headlineWeekly,
        annual,
        premiumOverNmw: a.headlineHourly / NMW.hourly - 1,
        takeHome: takeHomeOn(annual),
      };
    });
}

// ---------------------------------------------------------------------------
// Table 4 — public-sector pay by state
// ---------------------------------------------------------------------------

export type PublicSectorGroup = "Teachers" | "Registered nurses" | "Public service";

export interface PublicSectorRow {
  group: PublicSectorGroup;
  jurisdiction: string;
  code: string;
  /** What the "entry" and "top" columns are. */
  entryLabel: string;
  entry: number;
  topLabel: string;
  top: number;
  href: string;
  /** Date the figures were verified or took effect, as the source module records it. */
  asAt: string;
}

/**
 * The public service comparison uses each service's general administrative
 * stream, bottom of the entry grade to top of the highest non-executive
 * grade (VPS 6.2 rather than the VPS 7 senior technical specialist ranges,
 * the closest match to APS EL 2). Picked explicitly (not "first stream") so a data module reordering
 * its schedules cannot silently change what is compared; the test proves
 * every pick resolves.
 */
export const PUBLIC_SERVICE_PICKS = [
  { slug: "aps", scheduleId: "aps-thresholds-2026", streamId: "aps-thresholds", entryCode: "APS 1", topCode: "EL 2" },
  { slug: "nsw", scheduleId: "nsw-crown-2026", streamId: "nsw-clerks", entryCode: "Clerk Grade 1", topCode: "Clerk Grade 12" },
  { slug: "vic", scheduleId: "vps-2026", streamId: "vps-grades", entryCode: "VPS 1.1", topCode: "VPS 6.2" },
  { slug: "qld", scheduleId: "award-2026", streamId: "ao-award", entryCode: "AO1", topCode: "AO8" },
  { slug: "wa", scheduleId: "wa-csa-2026", streamId: "wa-general", entryCode: "Level 1", topCode: "Level 9" },
  { slug: "sa", scheduleId: "sa-salaried-2026", streamId: "sa-aso", entryCode: "ASO-1", topCode: "ASO-8" },
] as const;

function publicServiceRows(): PublicSectorRow[] {
  return PUBLIC_SERVICE_PICKS.map((pick) => {
    const j = JURISDICTIONS.find((x) => x.slug === pick.slug);
    const schedule = j?.schedules.find((s) => s.id === pick.scheduleId);
    const stream = schedule?.streams.find((s) => s.id === pick.streamId);
    const entry = stream?.bands.find((b) => b.code === pick.entryCode);
    const top = stream?.bands.find((b) => b.code === pick.topCode);
    if (!j || !schedule || !entry || !top) {
      throw new Error(`pay report: public service pick ${pick.slug}/${pick.scheduleId} did not resolve`);
    }
    return {
      group: "Public service" as const,
      jurisdiction: j.name,
      code: j.shortName,
      entryLabel: `${entry.code} (bottom)`,
      entry: entry.min,
      topLabel: `${top.code} (top)`,
      top: top.max,
      href: `/public-service-pay-scales/${j.slug}/`,
      asAt: `from ${schedule.effectiveFrom}`,
    };
  });
}

function teacherRows(): PublicSectorRow[] {
  return TEACHER_PAY_STATES.flatMap((s) => {
    const entry = graduateSalary(s);
    const top = topOfClassroomScale(s);
    if (entry === null || top === null) return [];
    return [{
      group: "Teachers" as const,
      jurisdiction: s.name,
      code: s.code,
      entryLabel: "Graduate classroom teacher",
      entry,
      topLabel: "Top of classroom scale",
      top,
      href: `/teacher-pay-australia/${s.slug}/`,
      asAt: `verified ${s.verifiedOn}`,
    }];
  });
}

function nurseRows(): PublicSectorRow[] {
  return NURSING_PAY_STATES.flatMap((slug) => {
    const s = getNursingPay(slug);
    const range = s ? registeredNurseRange(s) : null;
    if (!s || !range) return [];
    return [{
      group: "Registered nurses" as const,
      jurisdiction: s.name,
      code: s.code,
      entryLabel: range.entryLabel,
      entry: range.entry,
      topLabel: range.topLabel,
      top: range.top,
      href: `/healthcare-worker-pay/${s.slug}/`,
      asAt: `verified ${s.verifiedOn}`,
    }];
  });
}

export function publicSectorRows(): PublicSectorRow[] {
  return [...teacherRows(), ...nurseRows(), ...publicServiceRows()];
}

/** Occupations we do not yet hold verified state scales for. Said on the page, never estimated. */
export const PUBLIC_SECTOR_NOT_COVERED = [
  "Police (no state police enterprise agreement scales are in our verified dataset yet)",
  "Registered nurses in the ACT and NT",
  "Public servants in Tasmania, the ACT and the NT",
] as const;

// ---------------------------------------------------------------------------
// Table 5 — hours of work to earn $X
// ---------------------------------------------------------------------------

export interface HoursRow {
  id: string;
  label: string;
  grossHourly: number;
  /** Take-home per hour worked, if the rate is worked 38 hours a week all year. */
  netHourly: number;
  hoursFor1000Gross: number;
  hoursFor1000Net: number;
  /** Hours to earn the 1 July 2026 tax cut's maximum annual value after tax. */
  hoursForTaxCut: number;
  /** Weeks at 38 hours to take home $10,000. */
  weeksFor10000Net: number;
}

export function hoursToEarn(): HoursRow[] {
  const casualHourly = NMW.casualHourly;
  const rates = [
    { id: "nmw", label: "National Minimum Wage", hourly: NMW.hourly },
    { id: "nmw-casual", label: "National Minimum Wage, casual (+25%)", hourly: casualHourly },
    { id: "median-hourly", label: "Median hourly earnings, all employees", hourly: EE_MEDIAN.hourlyAll },
    {
      id: "average-ft",
      label: "Average full-time earnings (AWOTE ÷ 38)",
      hourly: Math.round((AWE_HEADLINE.fullTimeOrdinaryWeekly / EMPLOYMENT.standardWeeklyHours) * 100) / 100,
    },
  ];
  const cut = maxTaxCutGain().perYear;
  const r1 = (n: number) => Math.round(n * 10) / 10;
  return rates.map((r) => {
    const annual = Math.round(r.hourly * HOURS_PER_YEAR);
    const netHourly = Math.round((takeHomeOn(annual) / HOURS_PER_YEAR) * 100) / 100;
    return {
      id: r.id,
      label: r.label,
      grossHourly: r.hourly,
      netHourly,
      hoursFor1000Gross: r1(1000 / r.hourly),
      hoursFor1000Net: r1(1000 / netHourly),
      hoursForTaxCut: r1(cut / netHourly),
      weeksFor10000Net: r1(10_000 / (netHourly * EMPLOYMENT.standardWeeklyHours)),
    };
  });
}

// ---------------------------------------------------------------------------
// Key findings — computed sentences, quoted on the page and in the meta
// ---------------------------------------------------------------------------

const aud = (n: number, dp = 0) =>
  `$${n.toLocaleString("en-AU", { minimumFractionDigits: dp, maximumFractionDigits: dp })}`;
const pct = (n: number, dp = 1) => `${(n * 100).toFixed(dp)}%`;

export function keyFindings(): string[] {
  const cut = maxTaxCutGain();
  const bench = wageBenchmarks();
  const nmw = bench.find((b) => b.id === "nmw")!;
  const avg = bench.find((b) => b.id === "average-ft")!;
  const medFt = bench.find((b) => b.id === "median-ft")!;
  const awards = awardRanking();
  const hi = awards[0];
  const atOrAbove = awards.filter((a) => a.premiumOverNmw >= -1e-9);
  const lo = atOrAbove[atOrAbove.length - 1];
  const below = awards.filter((a) => a.premiumOverNmw < -1e-9);
  const short = (name: string) => name.replace(/ Award \d{4}$/, "");
  const tiedLow = atOrAbove.filter((a) => a.hourly === lo.hourly).map((a) => short(a.name));
  const hours = hoursToEarn();
  const hNmw = hours.find((h) => h.id === "nmw")!;
  const hAvg = hours.find((h) => h.id === "average-ft")!;
  const ps = publicSectorRows();
  const teachers = ps.filter((r) => r.group === "Teachers");
  const topTeacher = [...teachers].sort((a, b) => b.entry - a.entry)[0];
  const lowTeacher = [...teachers].sort((a, b) => a.entry - b.entry)[0];

  return [
    `The 1 July 2026 tax cut is worth at most ${aud(cut.perYear)} a year (${aud(cut.perWeek, 2)} a week), reached by every resident earning ${aud(cut.fromIncome)} or more. The legislated second cut on 1 July 2027 doubles that to ${aud(cut.perYear * 2)} a year against 2025-26.`,
    `A full-time worker on the National Minimum Wage (${aud(nmw.annual)} a year) takes home ${aud(nmw.takeHome)} in ${SITE_CONFIG.financialYear}; on the average full-time salary (${aud(avg.annual)}) take-home is ${aud(avg.takeHome)}. The average full-time wage is ${avg.timesMinimum.toFixed(2)} times the minimum wage.`,
    `The full-time median (${aud(medFt.annual)}) is ${pct(1 - medFt.shareOfAverage)} below the full-time average, because a minority of very high earners lift the mean.`,
    `Of the ${awards.length} modern awards we track, the highest entry-level adult rate is ${hi.name} (${hi.classification}) at ${aud(hi.hourly, 2)} an hour, ${pct(hi.premiumOverNmw)} above the minimum wage; the lowest are ${tiedLow.join(" and ")} at ${aud(lo.hourly, 2)}${Math.abs(lo.premiumOverNmw) < 1e-9 ? ", exactly the minimum wage" : ""}${below.length ? ` (the ${below.map((b) => `${short(b.name)} ${b.classification}`).join(", ")} induction rate is lower, ${aud(below[0].hourly, 2)}, but applies only for the first 38 hours)` : ""}.`,
    `A minimum-wage worker needs ${hNmw.hoursFor1000Net} hours to take home $1,000; an average full-time earner needs ${hAvg.hoursFor1000Net}.`,
    ...(topTeacher && lowTeacher
      ? [`Graduate teacher pay ranges from ${aud(lowTeacher.entry)} (${lowTeacher.code}) to ${aud(topTeacher.entry)} (${topTeacher.code}) depending on the state.`]
      : []),
  ];
}

// ---------------------------------------------------------------------------
// CSV downloads
// ---------------------------------------------------------------------------

export const REPORT_CSV_FILES = [
  { file: "take-home-pay-by-salary-2025-26-vs-2026-27.csv", title: "Take-home pay by salary, 2025-26 vs 2026-27 (and legislated 2027-28)" },
  { file: "minimum-vs-median-vs-average-wage.csv", title: "Minimum wage vs median vs average earnings" },
  { file: "award-minimum-rates-ranked.csv", title: "Entry-level award minimum rates, ranked" },
  { file: "public-sector-pay-by-state.csv", title: "Public-sector pay by state: teachers, registered nurses, public service" },
  { file: "hours-of-work-to-earn.csv", title: "Hours of work to earn $1,000" },
] as const;

export type ReportCsvFile = (typeof REPORT_CSV_FILES)[number]["file"];

function csvCell(v: string | number | null): string {
  if (v === null) return "";
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/**
 * Plain RFC 4180 CSV: header row first, no comment lines, so Excel, Sheets and
 * pandas open it without skipping rows. Attribution travels in the Dataset
 * JSON-LD, the page's citation box and the file name.
 */
function toCsv(head: string[], rows: (string | number | null)[][]): string {
  return [head.map(csvCell).join(","), ...rows.map((r) => r.map(csvCell).join(","))].join("\n") + "\n";
}

const r2 = (n: number) => Math.round(n * 100) / 100;
const r4 = (n: number) => Math.round(n * 10_000) / 10_000;

export function reportCsv(file: ReportCsvFile): string {
  switch (file) {
    case "take-home-pay-by-salary-2025-26-vs-2026-27.csv":
      return toCsv(
        ["salary_aud", "tax_and_medicare_2025_26", "take_home_2025_26", "tax_and_medicare_2026_27", "take_home_2026_27", "gain_per_year", "gain_per_week", "take_home_2027_28_legislated", "gain_2027_28_vs_2025_26", "average_rate_2026_27"],
        takeHomeRows().map((r) => [r.salary, r.tax2025, r.takeHome2025, r.tax2026, r.takeHome2026, r.gainYear, r.gainWeek, r.takeHome2027, r.gainBy2027, r4(r.averageRate2026)]),
      );
    case "minimum-vs-median-vs-average-wage.csv":
      return toCsv(
        ["measure", "weekly_aud", "annual_aud", "hourly_aud", "take_home_2026_27", "times_minimum_wage", "share_of_fulltime_average", "source"],
        wageBenchmarks().map((b) => [b.label, b.weekly, b.annual, b.hourly, b.takeHome, r2(b.timesMinimum), r4(b.shareOfAverage), b.source]),
      );
    case "award-minimum-rates-ranked.csv":
      return toCsv(
        ["rank", "award", "award_code", "classification", "hourly_aud", "weekly_aud", "annual_aud", "premium_over_nmw", "take_home_2026_27"],
        awardRanking().map((a) => [a.rank, a.name, a.code, a.classification, a.hourly, a.weekly, a.annual, r4(a.premiumOverNmw), a.takeHome]),
      );
    case "public-sector-pay-by-state.csv":
      return toCsv(
        ["group", "jurisdiction", "entry_point", "entry_annual_aud", "top_point", "top_annual_aud", "as_at"],
        publicSectorRows().map((p) => [p.group, p.jurisdiction, p.entryLabel, p.entry, p.topLabel, p.top, p.asAt]),
      );
    case "hours-of-work-to-earn.csv":
      return toCsv(
        ["rate", "gross_hourly_aud", "take_home_per_hour_aud", "hours_to_earn_1000_gross", "hours_to_take_home_1000", "hours_to_take_home_max_tax_cut", "weeks_38h_to_take_home_10000"],
        hoursToEarn().map((h) => [h.label, h.grossHourly, h.netHourly, h.hoursFor1000Gross, h.hoursFor1000Net, h.hoursForTaxCut, h.weeksFor10000Net]),
      );
  }
}

export function isReportCsvFile(value: string): value is ReportCsvFile {
  return REPORT_CSV_FILES.some((f) => f.file === value);
}

export function reportCsvHref(file: ReportCsvFile): string {
  return `${REPORT.path}data/${file}`;
}

// ---------------------------------------------------------------------------
// Citation
// ---------------------------------------------------------------------------

export function suggestedCitation(accessed = REPORT.updatedOn): string {
  return `${SITE_CONFIG.name} (2026). ${REPORT.title}: take-home pay, minimum wages and award rates (version ${REPORT.version}). Retrieved ${accessed}, from ${REPORT.url}`;
}

export function citationHtml(): string {
  return `<a href="${REPORT.url}">${REPORT.title}</a> (${SITE_CONFIG.name})`;
}
