// =============================================================================
// Occupation pay rates — registry and derived figures.
//
// Add an occupation by transcribing its award rates into
// lib/data/job-pay-rates/<slug>.ts, adding the slug to OCCUPATION_SLUGS in
// types.ts and registering it below. The route, sitemap, site directory and
// hub all read OCCUPATION_SLUGS, so a registered occupation cannot be orphaned.
// =============================================================================

import { calculatePayBreakdown } from "../../constants/australian-tax";
import { nearestTakeHomeAmount, takeHomeHref, isExactTakeHomeAmount } from "../teacher-pay";
import { ACCOUNTANT } from "./accountant";
import { BUS_DRIVER } from "./bus-driver";
import { DENTAL_ASSISTANT } from "./dental-assistant";
import { DISABILITY_SUPPORT_WORKER } from "./disability-support-worker";
import { ELECTRICIAN } from "./electrician";
import { MEDICAL_RECEPTIONIST } from "./medical-receptionist";
import { PHARMACIST } from "./pharmacist";
import { PROPERTY_MANAGER } from "./property-manager";
import { REAL_ESTATE_AGENT } from "./real-estate-agent";
import { SECURITY_GUARD } from "./security-guard";
import { TRUCK_DRIVER } from "./truck-driver";
import type { Occupation, OccupationSlug, RateRow } from "./types";
import { OCCUPATION_SLUGS } from "./types";

export const OCCUPATIONS_BY_SLUG: Readonly<Record<OccupationSlug, Occupation>> = {
  pharmacist: PHARMACIST,
  "dental-assistant": DENTAL_ASSISTANT,
  electrician: ELECTRICIAN,
  accountant: ACCOUNTANT,
  "disability-support-worker": DISABILITY_SUPPORT_WORKER,
  "real-estate-agent": REAL_ESTATE_AGENT,
  "property-manager": PROPERTY_MANAGER,
  "truck-driver": TRUCK_DRIVER,
  "bus-driver": BUS_DRIVER,
  "medical-receptionist": MEDICAL_RECEPTIONIST,
  "security-guard": SECURITY_GUARD,
};

/** Every occupation, in the order the hub lists them. */
export const OCCUPATIONS: Occupation[] = OCCUPATION_SLUGS.map((slug) => OCCUPATIONS_BY_SLUG[slug]);

export function isOccupationSlug(value: string): value is OccupationSlug {
  return (OCCUPATION_SLUGS as readonly string[]).includes(value);
}

export function getOccupation(slug: string): Occupation | undefined {
  return isOccupationSlug(slug) ? OCCUPATIONS_BY_SLUG[slug] : undefined;
}

/** The row the page leads with, or null for an award-free job. Throws if the pointer is broken. */
export function headlineRow(occ: Occupation): RateRow | null {
  if (!occ.headline) return null;
  const { tableId, label } = occ.headline;
  const table = occ.tables.find((t) => t.id === tableId);
  const row = table?.rows.find((r) => r.label === label);
  if (!row) {
    throw new Error(`headlineRow: ${occ.slug} points at ${tableId} / ${label}, which does not exist`);
  }
  return row;
}

/** Full-time annual equivalent of a weekly rate: 52 weeks, rounded to the dollar. */
export function annualFromWeekly(weekly: number): number {
  return Math.round(weekly * 52);
}

export interface AfterTax {
  grossAnnual: number;
  netAnnual: number;
  netWeekly: number;
  tax: number;
  medicare: number;
}

/**
 * Take-home pay on a full-time award wage, using the same engine as
 * /take-home-pay-on/N/ (2026-27 resident rates, LITO, Medicare levy, no HECS,
 * no private-health surcharge). The page states those assumptions.
 */
export function afterTax(grossAnnual: number): AfterTax {
  const b = calculatePayBreakdown({ grossSalary: grossAnnual, includeHECS: false, hasPrivateHealth: true });
  return {
    grossAnnual,
    netAnnual: b.takeHomePay,
    netWeekly: b.weekly,
    tax: b.netIncomeTax,
    medicare: b.medicareLevy,
  };
}

/** The lowest and highest weekly minimum across every table, or null when there are none. */
export function weeklyRange(occ: Occupation): { min: number; max: number } | null {
  const all = occ.tables.flatMap((t) => t.rows.map((r) => r.weekly));
  return all.length > 0 ? { min: Math.min(...all), max: Math.max(...all) } : null;
}

export { nearestTakeHomeAmount, takeHomeHref, isExactTakeHomeAmount };
export * from "./types";
