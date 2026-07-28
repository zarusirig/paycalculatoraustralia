"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { getRelatedLinks } from "@/lib/related-links";

/**
 * "What to check next" — related-page links rendered after the article body.
 *
 * An earlier version of this portalled itself into `#main-content` so it could
 * sit mid-content without editing 111 page modules. That was wrong: inserting a
 * node into a React-owned subtree races hydration, and React reported a
 * mismatch (error #418) on roughly a third of loads. Hydration is concurrent
 * and interruptible, so no `load`/rAF/timeout heuristic can schedule around it
 * reliably — the injected node was already in the DOM when React reached that
 * segment.
 *
 * Rendering from the layout instead is not merely safer, it is better: these
 * anchors now ship in the static HTML, so they are crawlable. Client-injected
 * links are not reliably indexed, which would have defeated the internal
 * linking goal that motivated the block.
 */
export function WhatsNext() {
  const pathname = usePathname();
  const links = getRelatedLinks(pathname);

  if (links.length === 0) return null;

  return (
    <section
      aria-labelledby="whats-next-heading"
      className="mx-auto max-w-7xl px-4 pb-12 pt-2 sm:px-6 lg:px-8"
    >
      <h2 id="whats-next-heading" className="mb-1 text-2xl font-bold text-navy">
        What to check next
      </h2>
      <p className="mb-6 text-sm text-warmgray">
        People reading this page usually work these out too.
      </p>

      <ul className="grid gap-3 sm:grid-cols-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              data-engagement="next-step"
              data-next-step-href={link.href}
              className="group flex h-full items-start justify-between gap-3 rounded-lg border border-warmgray-light/40 bg-white p-4 transition hover:border-eucalyptus-dark hover:shadow-sm"
            >
              <span>
                <span className="block font-semibold text-navy group-hover:text-eucalyptus-dark">
                  {link.title}
                </span>
                <span className="mt-0.5 block text-sm text-warmgray">{link.blurb}</span>
              </span>
              <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-warmgray-light transition group-hover:translate-x-0.5 group-hover:text-eucalyptus-dark" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
