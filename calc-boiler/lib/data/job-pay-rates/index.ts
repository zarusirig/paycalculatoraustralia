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
import { AGED_CARE_WORKER } from "./aged-care-worker";
import { APPRENTICE_ELECTRICIAN } from "./apprentice-electrician";
import { BARISTA } from "./barista";
import { BARTENDER } from "./bartender";
import { BOOKKEEPER } from "./bookkeeper";
import { BUS_DRIVER } from "./bus-driver";
import { CARPENTER } from "./carpenter";
import { CHEF } from "./chef";
import { CHILDCARE_WORKER } from "./childcare-worker";
import { CLEANER } from "./cleaner";
import { CRANE_OPERATOR } from "./crane-operator";
import { DENTAL_ASSISTANT } from "./dental-assistant";
import { DENTAL_HYGIENIST } from "./dental-hygienist";
// G3 (wave 4)
import { AUDIOLOGIST } from "./audiologist";
import { DIETITIAN } from "./dietitian";
import { PODIATRIST } from "./podiatrist";
import { RADIOGRAPHER } from "./radiographer";
import { SONOGRAPHER } from "./sonographer";
import { SPEECH_PATHOLOGIST } from "./speech-pathologist";
import { VETERINARIAN } from "./veterinarian";
import { DOCTOR } from "./doctor";
import { DISABILITY_SUPPORT_WORKER } from "./disability-support-worker";
import { EARLY_CHILDHOOD_TEACHER } from "./early-childhood-teacher";
import { ELECTRICIAN } from "./electrician";
import { ENGINEER } from "./engineer";
import { HAIRDRESSER } from "./hairdresser";
import { LAB_TECHNICIAN } from "./lab-technician";
import { LAWYER } from "./lawyer";
import { MECHANIC } from "./mechanic";
import { MEDICAL_RECEPTIONIST } from "./medical-receptionist";
import { MIDWIFE } from "./midwife";
import { NURSE } from "./nurse";
import { OCCUPATIONAL_THERAPIST } from "./occupational-therapist";
import { PATHOLOGY_COLLECTOR } from "./pathology-collector";
import { PHARMACIST } from "./pharmacist";
import { PHARMACY_ASSISTANT } from "./pharmacy-assistant";
import { PHYSIOTHERAPIST } from "./physiotherapist";
import { PLUMBER } from "./plumber";
import { PROPERTY_MANAGER } from "./property-manager";
import { PSYCHOLOGIST } from "./psychologist";
import { REAL_ESTATE_AGENT } from "./real-estate-agent";
import { RECEPTIONIST } from "./receptionist";
import { RETAIL_WORKER } from "./retail-worker";
import { SECURITY_GUARD } from "./security-guard";
import { SOCIAL_WORKER } from "./social-worker";
import { TEACHER_AIDE } from "./teacher-aide";
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
  // W4 (wave 2)
  "occupational-therapist": OCCUPATIONAL_THERAPIST,
  physiotherapist: PHYSIOTHERAPIST,
  psychologist: PSYCHOLOGIST,
  "social-worker": SOCIAL_WORKER,
  nurse: NURSE,
  carpenter: CARPENTER,
  plumber: PLUMBER,
  "apprentice-electrician": APPRENTICE_ELECTRICIAN,
  "crane-operator": CRANE_OPERATOR,
  engineer: ENGINEER,
  lawyer: LAWYER,
  doctor: DOCTOR,
  "teacher-aide": TEACHER_AIDE,
  "early-childhood-teacher": EARLY_CHILDHOOD_TEACHER,
  // T5 (wave 3)
  midwife: MIDWIFE,
  "childcare-worker": CHILDCARE_WORKER,
  "aged-care-worker": AGED_CARE_WORKER,
  cleaner: CLEANER,
  chef: CHEF,
  bartender: BARTENDER,
  barista: BARISTA,
  "retail-worker": RETAIL_WORKER,
  mechanic: MECHANIC,
  hairdresser: HAIRDRESSER,
  "lab-technician": LAB_TECHNICIAN,
  "pharmacy-assistant": PHARMACY_ASSISTANT,
  receptionist: RECEPTIONIST,
  bookkeeper: BOOKKEEPER,
  "pathology-collector": PATHOLOGY_COLLECTOR,
  "dental-hygienist": DENTAL_HYGIENIST,
  // G3 (wave 4)
  radiographer: RADIOGRAPHER,
  sonographer: SONOGRAPHER,
  "speech-pathologist": SPEECH_PATHOLOGIST,
  audiologist: AUDIOLOGIST,
  podiatrist: PODIATRIST,
  dietitian: DIETITIAN,
  veterinarian: VETERINARIAN,
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

/** A row's full-time annual figure: the award's published annual salary when it sets one, else weekly x 52. */
export function rowAnnual(row: RateRow): number {
  return row.annual ?? annualFromWeekly(row.weekly);
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
