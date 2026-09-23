// =============================================================================
// Emergency-service pay — registry and helpers (F5, 24 Sep 2026).
//
// One file per occupation per state under ./paramedic, ./police, ./firefighter.
// Every state is registered, but the dynamic routes build a page only for
// states with a verified table; a state that could not be verified appears on
// the hub as a "not yet verified — see the official source" card instead of
// invented numbers.
// =============================================================================

import { nearestSalary, hasPage } from "../salary-pages";
import type { ServiceOccupation, ServicePayJurisdiction, ServiceStateSlug } from "./types";
import { SERVICE_OCCUPATIONS, SERVICE_STATE_SLUGS } from "./types";

import { NSW_PARAMEDIC_PAY } from "./paramedic/nsw";
import { VIC_PARAMEDIC_PAY } from "./paramedic/vic";
import { QLD_PARAMEDIC_PAY } from "./paramedic/qld";
import { WA_PARAMEDIC_PAY } from "./paramedic/wa";
import { SA_PARAMEDIC_PAY } from "./paramedic/sa";
import { TAS_PARAMEDIC_PAY } from "./paramedic/tas";
import { ACT_PARAMEDIC_PAY } from "./paramedic/act";
import { NT_PARAMEDIC_PAY } from "./paramedic/nt";

import { NSW_POLICE_PAY } from "./police/nsw";
import { VIC_POLICE_PAY } from "./police/vic";
import { QLD_POLICE_PAY } from "./police/qld";
import { WA_POLICE_PAY } from "./police/wa";
import { SA_POLICE_PAY } from "./police/sa";
import { TAS_POLICE_PAY } from "./police/tas";
import { ACT_POLICE_PAY } from "./police/act";
import { NT_POLICE_PAY } from "./police/nt";

import { NSW_FIREFIGHTER_PAY } from "./firefighter/nsw";
import { VIC_FIREFIGHTER_PAY } from "./firefighter/vic";
import { QLD_FIREFIGHTER_PAY } from "./firefighter/qld";
import { WA_FIREFIGHTER_PAY } from "./firefighter/wa";
import { SA_FIREFIGHTER_PAY } from "./firefighter/sa";
import { TAS_FIREFIGHTER_PAY } from "./firefighter/tas";
import { ACT_FIREFIGHTER_PAY } from "./firefighter/act";
import { NT_FIREFIGHTER_PAY } from "./firefighter/nt";

export const SERVICE_PAY: Readonly<
  Record<ServiceOccupation, Readonly<Record<ServiceStateSlug, ServicePayJurisdiction>>>
> = {
  paramedic: {
    nsw: NSW_PARAMEDIC_PAY,
    vic: VIC_PARAMEDIC_PAY,
    qld: QLD_PARAMEDIC_PAY,
    wa: WA_PARAMEDIC_PAY,
    sa: SA_PARAMEDIC_PAY,
    tas: TAS_PARAMEDIC_PAY,
    act: ACT_PARAMEDIC_PAY,
    nt: NT_PARAMEDIC_PAY,
  },
  police: {
    nsw: NSW_POLICE_PAY,
    vic: VIC_POLICE_PAY,
    qld: QLD_POLICE_PAY,
    wa: WA_POLICE_PAY,
    sa: SA_POLICE_PAY,
    tas: TAS_POLICE_PAY,
    act: ACT_POLICE_PAY,
    nt: NT_POLICE_PAY,
  },
  firefighter: {
    nsw: NSW_FIREFIGHTER_PAY,
    vic: VIC_FIREFIGHTER_PAY,
    qld: QLD_FIREFIGHTER_PAY,
    wa: WA_FIREFIGHTER_PAY,
    sa: SA_FIREFIGHTER_PAY,
    tas: TAS_FIREFIGHTER_PAY,
    act: ACT_FIREFIGHTER_PAY,
    nt: NT_FIREFIGHTER_PAY,
  },
};

export function isServiceStateSlug(value: string): value is ServiceStateSlug {
  return (SERVICE_STATE_SLUGS as readonly string[]).includes(value);
}

export function isServiceOccupation(value: string): value is ServiceOccupation {
  return (SERVICE_OCCUPATIONS as readonly string[]).includes(value);
}

/** Every jurisdiction for an occupation, in hub order. */
export function serviceJurisdictions(occupation: ServiceOccupation): ServicePayJurisdiction[] {
  return SERVICE_STATE_SLUGS.map((slug) => SERVICE_PAY[occupation][slug]);
}

export function getServicePay(
  occupation: ServiceOccupation,
  slug: string,
): ServicePayJurisdiction | undefined {
  return isServiceStateSlug(slug) ? SERVICE_PAY[occupation][slug] : undefined;
}

/** A jurisdiction is "verified" when at least one pay table was read from a primary source. */
export function isVerified(j: ServicePayJurisdiction): boolean {
  return j.scales.some((s) => s.steps.length > 0);
}

/** Only the jurisdictions with verified tables — what the sitemap and hub comparison publish. */
export function verifiedJurisdictions(occupation: ServiceOccupation): ServicePayJurisdiction[] {
  return serviceJurisdictions(occupation).filter(isVerified);
}

// ---------------------------------------------------------------------------
// Headline figures. Both read scales[0] — the core operational progression —
// using the jurisdiction's named row where it gives one.
// ---------------------------------------------------------------------------

function rowSalary(j: ServicePayJurisdiction, label: string | undefined, fallback: "first" | "last"): number | null {
  const steps = j.scales[0]?.steps;
  if (!steps || steps.length === 0) return null;
  if (label) {
    const named = steps.find((s) => s.label === label);
    if (named) return named.salary;
  }
  return fallback === "first" ? steps[0].salary : steps[steps.length - 1].salary;
}

/** Entry salary: the `entryStep` row of scales[0], else its first row. */
export function entrySalary(j: ServicePayJurisdiction): number | null {
  return rowSalary(j, j.entryStep, "first");
}

/** Top of the operational scale: the `topStep` row of scales[0], else its last row. */
export function topSalary(j: ServicePayJurisdiction): number | null {
  return rowSalary(j, j.topStep, "last");
}

export function highestPublishedSalary(j: ServicePayJurisdiction): number | null {
  const all = j.scales.flatMap((s) => s.steps.map((step) => step.salary));
  return all.length ? Math.max(...all) : null;
}

/**
 * Year shown in titles. Normally the year the figures were verified, but when
 * the rates in force took effect more than a year before that (an expired
 * agreement with no replacement, e.g. St John NT), the title carries the
 * rates' own year so it never implies a newer table than exists.
 */
export function ratesYear(j: ServicePayJurisdiction): string {
  const verified = j.verifiedOn.match(/\b(20\d{2})\b/)?.[1] ?? "";
  const effective = j.ratesEffectiveFrom.match(/\b(20\d{2})\b/)?.[1];
  if (effective && verified && Number(effective) < Number(verified) - 1) return effective;
  return verified;
}

const MONTHS = ["january","february","march","april","may","june","july","august","september","october","november","december"];

/** "24 September 2026" -> "2026-09-24" for schema.org dates; null if unparseable. */
export function toIsoDate(plain: string): string | null {
  const m = plain.trim().match(/^(\d{1,2}) ([A-Za-z]+) (20\d{2})$/);
  if (!m) return null;
  const month = MONTHS.indexOf(m[2].toLowerCase());
  if (month === -1) return null;
  return `${m[3]}-${String(month + 1).padStart(2, "0")}-${m[1].padStart(2, "0")}`;
}

/** One row per published scale for the at-a-glance table. */
export function scaleRanges(j: ServicePayJurisdiction) {
  return j.scales
    .filter((s) => s.steps.length > 0)
    .map((s) => {
      const salaries = s.steps.map((step) => step.salary);
      return { id: s.id, title: s.title, low: Math.min(...salaries), high: Math.max(...salaries), steps: s.steps.length };
    });
}

// ---------------------------------------------------------------------------
// Take-home links. The /take-home-pay-on/ grid runs in $1,000 steps from $40k
// to $150k, then $5k to $200k and a sparse tail (lib/data/salary-pages). We
// link to the nearest page that exists and the UI says "nearest" when it is
// not the exact salary.
// ---------------------------------------------------------------------------

export function nearestTakeHome(salary: number): number {
  if (!Number.isFinite(salary)) throw new Error(`nearestTakeHome: ${salary} is not finite`);
  return nearestSalary("take-home", salary);
}

export function takeHomeHref(salary: number): string {
  return `/take-home-pay-on/${nearestTakeHome(salary)}/`;
}

export function isExactTakeHome(salary: number): boolean {
  return hasPage("take-home", salary);
}

/** Cheapest and dearest verified entry/top figures across states, for hub copy. */
export function occupationSummary(occupation: ServiceOccupation) {
  const rows = verifiedJurisdictions(occupation)
    .map((j) => ({ j, entry: entrySalary(j), top: topSalary(j) }))
    .filter((r): r is { j: ServicePayJurisdiction; entry: number; top: number } => r.entry !== null && r.top !== null);
  if (rows.length === 0) return null;
  const byEntry = [...rows].sort((a, b) => a.entry - b.entry);
  const byTop = [...rows].sort((a, b) => a.top - b.top);
  return {
    count: rows.length,
    lowestEntry: byEntry[0],
    highestEntry: byEntry[byEntry.length - 1],
    lowestTop: byTop[0],
    highestTop: byTop[byTop.length - 1],
    year: ratesYear(rows[0].j),
  };
}

export { SERVICE_OCCUPATION_CONFIG } from "./occupations";
export * from "./types";
