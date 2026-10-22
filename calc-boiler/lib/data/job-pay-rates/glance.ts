// =============================================================================
// One-line "glance" figures for linking to a pay page from another page.
//
// The October 2026 silent-pages pass (docs/seo/2026-10-22-silent-pages-audit.md)
// adds contextual link blocks on the high-traffic calculators and guides. Every
// figure in those blocks is read here from the same data the destination page
// renders, so an anchor can never quote a number the page itself does not show.
// =============================================================================

import { formatAUD } from "../../constants";
import { HEALTH_SALARY_PAGES_BY_SLUG } from "../health-salary/pages";
import { HEALTH_SALARY_SLUGS, type HealthSalarySlug } from "../health-salary/types";
import { OCCUPATIONS_BY_SLUG, annualFromWeekly, headlineRow, rowAnnual } from "./index";
import type { OccupationSlug } from "./types";

export interface PayGlance {
  slug: string;
  /** "Welder" */
  name: string;
  href: string;
  /** Short figure for an anchor or a table cell: "$29.45/hr award minimum". */
  figure: string;
  /** Where `figure` comes from, for a caption. */
  basis: "award" | "ato" | "jsa";
  /** The hourly award minimum, where the page leads with one. */
  hourly: number | null;
  /** Full-time annual gross on the figure the page leads with. */
  annual: number;
}

function isHealthSlug(slug: string): slug is HealthSalarySlug {
  return (HEALTH_SALARY_SLUGS as readonly string[]).includes(slug);
}

/**
 * The figure a link to a pay page should quote: the award minimum where the
 * page leads with one, otherwise the ATO median salary or wages, otherwise the
 * Jobs and Skills Australia median. Returns null for a slug with no page.
 */
export function payGlance(slug: string): PayGlance | null {
  if (isHealthSlug(slug)) {
    const p = HEALTH_SALARY_PAGES_BY_SLUG[slug];
    return {
      slug,
      name: p.name,
      href: `/job-pay-rates/${slug}/`,
      figure: `${formatAUD(p.ato.medianSalaryOrWages)} median salary`,
      basis: "ato",
      hourly: null,
      annual: p.ato.medianSalaryOrWages,
    };
  }
  const occ = OCCUPATIONS_BY_SLUG[slug as OccupationSlug];
  if (!occ) return null;
  const href = `/job-pay-rates/${slug}/`;
  const headline = headlineRow(occ);
  if (headline && occ.award) {
    return {
      slug,
      name: occ.name,
      href,
      figure: `${formatAUD(headline.hourly, 2)}/hr award minimum`,
      basis: "award",
      hourly: headline.hourly,
      annual: rowAnnual(headline),
    };
  }
  const ato = occ.ato?.rows[0];
  if (ato) {
    return { slug, name: occ.name, href, figure: `${formatAUD(ato.medianSalary)} median salary`, basis: "ato", hourly: null, annual: ato.medianSalary };
  }
  if (occ.median) {
    return {
      slug,
      name: occ.name,
      href,
      figure: `${formatAUD(occ.median.medianWeekly)}/wk median`,
      basis: "jsa",
      hourly: null,
      annual: annualFromWeekly(occ.median.medianWeekly),
    };
  }
  return null;
}

/** Glances for a list of slugs, dropping any slug without a page. */
export function payGlances(slugs: readonly string[]): PayGlance[] {
  return slugs.map(payGlance).filter((g): g is PayGlance => g !== null);
}

/**
 * Jobs grouped the way the linking pages need them. Each list is a set of
 * occupation pages that share a reason to appear together on another page.
 */
export const JOB_GROUPS = {
  /** Trades paid an hourly award minimum: the hourly-to-annual calculator and the minimum wage guide. */
  hourlyTrades: ["welder", "boilermaker", "fitter-and-turner", "bricklayer", "excavator-operator", "landscaper", "forklift-operator", "personal-trainer", "vet-nurse", "flight-attendant", "retail-manager", "payroll-officer", "paralegal"],
  /** Award-free professions: the National Minimum Wage is the only legal floor. */
  awardFree: ["software-engineer", "cyber-security", "data-analyst", "business-analyst", "project-manager", "actuary", "mortgage-broker"],
  /** Professions where bonuses and incentive pay are common. */
  bonusEarners: ["software-engineer", "project-manager", "mortgage-broker", "business-analyst", "data-analyst", "cyber-security", "actuary"],
  /** Professional and administrative roles the state and federal public services also employ. */
  publicServiceRoles: ["payroll-officer", "business-analyst", "project-manager", "data-analyst", "cyber-security", "software-engineer", "paralegal", "civil-engineer", "surveyor", "youth-worker"],
  /** Professions the ADF also employs, under its own specialist pay structures. */
  adfProfessions: ["civil-engineer", "electrical-engineer", "mechanical-engineer", "cyber-security", "surveyor", "gp", "surgeon", "anaesthetist", "radiologist", "dentist", "flight-attendant"],
  /** Salaried professions for the fortnightly pay table. */
  salaried: ["gp", "dentist", "surgeon", "anaesthetist", "radiologist", "optometrist", "software-engineer", "cyber-security", "project-manager", "business-analyst", "data-analyst", "actuary", "civil-engineer", "electrical-engineer", "mechanical-engineer", "surveyor", "mortgage-broker", "paralegal", "payroll-officer"],
  /** Retail and distribution-centre jobs under the awards the big retailers' agreements are built on. */
  retailJobs: ["retail-manager", "forklift-operator", "retail-worker"],
} as const satisfies Record<string, readonly string[]>;
