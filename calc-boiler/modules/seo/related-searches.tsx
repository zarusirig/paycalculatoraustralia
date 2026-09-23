import Link from "next/link";

// A short row of internal links that mirrors Google's "related searches" for
// the page's main query. Each label is the searcher's own phrasing (taken from
// the live Google AU SERP, see docs/seo/2026-09-24-paa-optimisation.md) and
// each href is an existing page on this site that answers it. Plain markup, no
// hooks, so it renders inside both server and client page modules.

export interface RelatedSearch {
  label: string;
  href: string;
}

export function RelatedSearches({
  items,
  heading = "Related searches",
}: {
  items: readonly RelatedSearch[];
  heading?: string;
}) {
  if (items.length === 0) return null;
  return (
    <nav aria-label={heading} className="not-prose">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-navy mb-3">{heading}</h2>
      <ul className="flex flex-wrap gap-2">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="inline-block rounded-full border border-sandstone-dark/30 px-3 py-1.5 text-sm text-eucalyptus-dark hover:bg-sandstone hover:underline"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
