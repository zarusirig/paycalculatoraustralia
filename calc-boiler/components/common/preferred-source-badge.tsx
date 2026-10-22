import { SITE_CONFIG } from "@/lib/constants";

/**
 * Google "Add as a preferred source on Google" badge.
 *
 * Readers who pick the site as a preferred source see it more often in Top
 * Stories, AI Overviews and AI Mode (developers.google.com/search/docs/
 * appearance/preferred-sources, read 23 Oct 2026). The site already appears
 * in the source preferences tool.
 *
 * This is Google's deeplink form with Google's own English badge images
 * (public/images/google-preferred-source-*.png, from the official asset zip).
 * The JavaScript button would load news.google.com/swg/js/v1/publisher.js on
 * every page for the same result, so the plain link is used instead.
 *
 * Clicks are counted as `preferred_source_click` by EngagementTracking.
 */

export const PREFERRED_SOURCE_URL = `https://www.google.com/preferences/source?q=${new URL(SITE_CONFIG.baseUrl).hostname}`;

export default function PreferredSourceBadge({
  theme,
  origin,
  className = "",
}: {
  /** "dark" on dark sections (footer), "light" on white pages. */
  theme: "light" | "dark";
  /** Where the badge sits, sent with the click event. */
  origin: string;
  className?: string;
}) {
  return (
    <a
      href={PREFERRED_SOURCE_URL}
      target="_blank"
      rel="noopener"
      data-engagement="preferred-source"
      data-preferred-source-origin={origin}
      className={`inline-block rounded-lg transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-eucalyptus ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- static export, fixed-size PNG */}
      <img
        src={`/images/google-preferred-source-${theme}.png`}
        alt={`Add ${SITE_CONFIG.name} as a preferred source on Google`}
        width={139}
        height={44}
        loading="lazy"
        decoding="async"
        className="block h-11 w-auto"
      />
    </a>
  );
}
