"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * Next-step links rendered INSIDE a calculator's result card.
 *
 * Why this exists (GA4, 1 Jan–26 Sep 2026): 1.10 pages per session and only
 * 53 clicks on the page-end "What to check next" block in nine months. The
 * answer card was a dead end — the first internal link after the result sat
 * 1,700px further down the page. Every click on these links fires the existing
 * `next_step_click` event (see engagement-tracking.tsx) via `data-engagement`,
 * with `data-next-step-origin="result"` so it can be split from the page-end
 * block in GA4.
 *
 * Keep it to 2–4 links. Prefer links that carry the visitor's own number
 * (e.g. /take-home-pay-on/100000/) — use `nearestSalary` + `salaryHref` from
 * lib/data/salary-pages to build those.
 */
export type ResultNextStep = {
  href: string;
  /** Short verb phrase, e.g. "See your full take-home pay on $100,000". */
  label: string;
  /** Optional one-line detail under the label. */
  detail?: string;
};

export default function ResultNextSteps({
  links,
  heading = "Next, work out",
  className = "",
}: {
  links: ResultNextStep[];
  heading?: string;
  className?: string;
}) {
  if (links.length === 0) return null;

  return (
    <nav aria-label={heading} className={`mt-4 border-t border-sandstone-dark/20 pt-4 text-left ${className}`}>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-warmgray">{heading}</p>
      <ul className="space-y-1.5">
        {links.slice(0, 4).map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              data-engagement="next-step"
              data-next-step-href={l.href}
              data-next-step-origin="result"
              className="group flex items-start gap-2 rounded-md px-1 py-1 text-sm font-medium text-eucalyptus-dark hover:bg-eucalyptus-light/60 hover:underline"
            >
              <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 transition group-hover:translate-x-0.5" aria-hidden="true" />
              <span>
                {l.label}
                {l.detail ? <span className="block text-xs font-normal text-warmgray no-underline">{l.detail}</span> : null}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
