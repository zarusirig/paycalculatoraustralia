// =============================================================================
// Health professional salary pages — registry.
//
// Each page is a static route, app/job-pay-rates/{slug}/page.tsx, so it sits
// beside (and takes precedence over) the award-occupation dynamic route
// without touching OCCUPATION_SLUGS. The sitemap, the /job-pay-rates/ hub and
// the related-links registry read HEALTH_SALARY_SLUGS, so a page registered
// here cannot be orphaned.
// =============================================================================

import { HEALTH_SALARY_PAGES_BY_SLUG } from "./pages";
import type { HealthSalaryPage, HealthSalarySlug } from "./types";
import { HEALTH_SALARY_SLUGS } from "./types";

export * from "./types";
export * from "./tax";
export { STAFF_SPECIALIST_SCALES } from "./staff-specialists";

/** Every page, in the order the hub and the sibling links list them. */
export const HEALTH_SALARY_PAGES: HealthSalaryPage[] = HEALTH_SALARY_SLUGS.map((s) => HEALTH_SALARY_PAGES_BY_SLUG[s]);

export function isHealthSalarySlug(value: string): value is HealthSalarySlug {
  return (HEALTH_SALARY_SLUGS as readonly string[]).includes(value);
}

export function getHealthSalaryPage(slug: HealthSalarySlug): HealthSalaryPage {
  return HEALTH_SALARY_PAGES_BY_SLUG[slug];
}

export function healthSalaryPath(slug: HealthSalarySlug): string {
  return `/job-pay-rates/${slug}/`;
}
