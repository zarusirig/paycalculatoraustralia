import type { ComponentType } from "react";
import type NextLink from "next/link";
import type AdsterraBanner from "@/components/common/adsterra-banner";
import { ChevronRight } from "lucide-react";
import { getRelatedLinks } from "@/lib/related-links";

/**
 * The end of every page: the 300x250 rectangle and "What to check next".
 *
 * These are SERVER components that take the page path explicitly. The links
 * used to be a client component in the root layout that read `usePathname()`,
 * which put the whole link table (lib/related-links.ts, ~10 KB gzip) in the
 * layout chunk on every page. Now only the rendered anchors reach the HTML.
 * (An earlier version portalled itself into `#main-content`; that raced
 * hydration, React error #418.)
 *
 * This module deliberately does not import next/link or AdsterraBanner as
 * values: the caller passes them in. Pages use `withPageEnd` from
 * ./content-slots, which passes the real components. The homepage passes
 * client re-exports of its own (modules/home/templates/home-link.tsx and
 * home-adsterra-banner.tsx). Any client module the root page imports directly
 * wins the chunk lookup for the 404 page and for modules a route does not
 * reference itself, and those routes then download the homepage calculator
 * chunk. See home-link.tsx.
 */

export type LinkComponent = typeof NextLink;
export type BannerComponent = typeof AdsterraBanner;
export type PageEndComponents = { Link: LinkComponent; Banner: BannerComponent };

/**
 * `placement` distinguishes the copy rendered under the calculator
 * (whats-next-inline.tsx) from the one at the page end. It sets a unique
 * heading id (both can be on one page) and `data-next-step-origin`, which
 * engagement-tracking.tsx sends to GA4 as `origin` on `next_step_click`.
 */
export function WhatsNext({
  path,
  Link,
  placement = "page-end",
}: {
  path: string;
  Link: LinkComponent;
  placement?: "page-end" | "inline";
}) {
  const headingId = placement === "inline" ? "whats-next-inline-heading" : "whats-next-heading";
  const links = getRelatedLinks(path);

  if (links.length === 0) return null;

  return (
    <section
      aria-labelledby={headingId}
      className="mx-auto max-w-7xl px-4 pb-12 pt-2 sm:px-6 lg:px-8"
    >
      <h2 id={headingId} className="mb-1 text-2xl font-bold text-navy">
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
              data-next-step-origin={placement}
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

/**
 * Everything that follows the article on every page, in the order the root
 * layout used to render it after `<main>`:
 *
 * 1. The 300x250 rectangle, directly after the article and immediately before
 *    the related links. The reader has finished the content and is looking for
 *    what comes next, so this position is genuinely viewed. Shown on every
 *    breakpoint; on mobile it replaces the old second 320x50, which was the
 *    lowest-CPM unit in the account. It moved here from the layout together
 *    with the links so the ad keeps its place ABOVE them.
 * 2. "What to check next".
 *
 * The layout still renders the bottom 468x60 banner, footer, GA and the social
 * bar after `<main>`.
 */
export function PageEnd({ path, Link, Banner }: { path: string } & PageEndComponents) {
  return (
    <>
      <Banner slot="rectangle" />
      <WhatsNext path={path} Link={Link} />
    </>
  );
}

type RouteParams = Record<string, string | string[] | undefined>;

/**
 * Wraps a route's default export so it renders `<PageEnd>` after the page.
 *
 * `route` is the route's URL pattern as it appears under app/, with a trailing
 * slash, e.g. "/income-tax-calculator/" or "/take-home-pay-on/[salary]/".
 * Dynamic segments are filled from the page's `params`.
 * lib/__tests__/related-links.test.ts checks that every app page.tsx is wrapped
 * with the pattern that matches its folder, so no page can silently lose the
 * rectangle ad or its related links.
 */
export function withPageEndUsing<P extends object>(
  Page: ComponentType<P>,
  route: string,
  components: PageEndComponents,
) {
  async function PageWithEnd(props: P) {
    const maybeParams = (props as { params?: Promise<RouteParams> }).params;
    const params: RouteParams = maybeParams ? await maybeParams : {};
    const path = route.replace(/\[([^\]]+)\]/g, (_, key: string) => {
      const value = params[key];
      return Array.isArray(value) ? value.join("/") : (value ?? "");
    });
    return (
      <>
        <Page {...props} />
        <PageEnd path={path} Link={components.Link} Banner={components.Banner} />
      </>
    );
  }
  PageWithEnd.displayName = `withPageEnd(${Page.displayName ?? Page.name ?? "Page"})`;
  return PageWithEnd;
}
