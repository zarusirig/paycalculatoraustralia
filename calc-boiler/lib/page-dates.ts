/**
 * Truthful JSON-LD dates for a page (build-time only: server components and
 * generateMetadata, never "use client" files — it reads git via Node APIs).
 *
 *   dateModified  = the sitemap lastmod (lib/sitemap-lastmod.ts): last commit
 *                   that touched the page's content files, or its displayed
 *                   lastReviewed date (lib/authors.ts) if that is later.
 *   datePublished = oldest commit of the route's page file.
 *
 * Both are YYYY-MM-DD in Australian Eastern time, the same date the page and
 * sitemap would show. Never `new Date()` in JSON-LD: a build date claims
 * freshness the content doesn't have.
 */
import { GUIDE_AUTHORSHIP } from "@/lib/authors";
import { lastModifiedForSlug, publishedForSlug } from "@/lib/sitemap-lastmod";

const BUILD_DATE = new Date();

function isoDay(d: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Australia/Sydney",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

const clean = (slug: string) => slug.replace(/^\/+|\/+$/g, "");

/** dateModified for a URL slug ("" or "/" = homepage, "tax-on/50000"). */
export function pageDateModified(slug: string, reviewed?: string): string {
  const s = clean(slug);
  return isoDay(lastModifiedForSlug(s, BUILD_DATE, reviewed ?? GUIDE_AUTHORSHIP[s]?.lastReviewed));
}

/**
 * datePublished for a URL slug, or undefined when there is no truthful date.
 * `notAfter` (YYYY-MM-DD) clamps it to a hand-set dateModified on the page:
 * a commit late in the day abroad can land on the next AEST day.
 */
export function pageDatePublished(slug: string, notAfter?: string): string | undefined {
  const d = publishedForSlug(clean(slug));
  if (!d) return undefined;
  const day = isoDay(d);
  return notAfter && notAfter < day ? notAfter : day;
}

/** `{ datePublished?, dateModified }` to spread into a JSON-LD node. */
export function pageDates(slug: string, reviewed?: string): { datePublished?: string; dateModified: string } {
  const published = pageDatePublished(slug);
  const modified = pageDateModified(slug, reviewed);
  return published ? { datePublished: published < modified ? published : modified, dateModified: modified } : { dateModified: modified };
}
