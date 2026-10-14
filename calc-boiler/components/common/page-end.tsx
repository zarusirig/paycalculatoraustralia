import type { ComponentType, ReactNode } from "react";
import type NextLink from "next/link";
import type AdsterraBanner from "@/components/common/adsterra-banner";
import { ChevronRight } from "lucide-react";
import { getRelatedLinks } from "@/lib/related-links";
import { setPageRoute } from "@/lib/page-route";
import { templateFor } from "@/lib/page-template";

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

/** Site hubs, the same on every sidebar; the related card above it is per page. */
const BROWSE_LINKS = [
  { href: "/award-rates/", label: "Award rates A–Z" },
  { href: "/job-pay-rates/", label: "Pay rates by job" },
  { href: "/take-home-pay-on/", label: "Take-home pay on every salary" },
  { href: "/tax-brackets/", label: "Tax brackets 2026-27" },
  { href: "/payg-withholding-tables/", label: "PAYG tax tables" },
  { href: "/news/", label: "Pay & tax news" },
] as const;

function SidebarLink({ href, label, Link }: { href: string; label: string; Link: LinkComponent }) {
  return (
    <Link
      href={href}
      data-engagement="next-step"
      data-next-step-href={href}
      data-next-step-origin="sidebar"
      className="group flex items-center justify-between rounded-lg border border-sandstone-dark/20 bg-white p-3 transition-all hover:border-eucalyptus hover:shadow-sm"
    >
      <span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">{label}</span>
      <ChevronRight className="h-4 w-4 shrink-0 text-warmgray-light group-hover:text-eucalyptus" />
    </Link>
  );
}

function SidebarCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-sandstone-dark/20 bg-sandstone p-6">
      <h3 className="mb-3 font-bold text-navy">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

/**
 * The right-hand sidebar for layouts that did not have one: calculator pages
 * (via withPageEndUsing below) and the homepage (modules/home/templates). Same
 * markup contract as the guide sidebars — `<aside>` as a stretched flex item,
 * `.mv-sidebar` as the innermost container, nothing sticky — so Mediavine's
 * sticky sidebar unit can run on these pages too (Oct 2026). The column is
 * sized for a 300px-wide unit at every breakpoint it exists on: 22rem minus
 * the 2rem right gutter at lg, 26rem at xl.
 *
 * Links are the page's own related links (the first six; the page end shows
 * all of them with blurbs) and the site hubs, so the column is useful before
 * any ad fills, and differs between pages.
 */
export function PageSidebar({
  path,
  Link,
  className = "lg:pt-8",
}: {
  path: string;
  Link: LinkComponent;
  /** Top padding at lg, matched to the content column's so the first card lines up with it. */
  className?: string;
}) {
  const related = getRelatedLinks(path).slice(0, 6);
  return (
    <aside className={`shrink-0 px-4 pb-12 sm:px-6 lg:w-[22rem] lg:px-0 lg:pr-8 xl:w-[26rem] ${className}`}>
      <div className="mv-sidebar space-y-6">
        {related.length > 0 && (
          <SidebarCard title="Related calculators">
            {related.map((link) => (
              <SidebarLink key={link.href} href={link.href} label={link.title} Link={Link} />
            ))}
          </SidebarCard>
        )}
        <SidebarCard title="Browse">
          {BROWSE_LINKS.map((link) => (
            <SidebarLink key={link.href} href={link.href} label={link.label} Link={Link} />
          ))}
        </SidebarCard>
      </div>
    </aside>
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
 *
 * Calculator-layout pages (lib/page-template.ts) are also given the two-column
 * shell here: the page and its end in a `.mv-content` column, `<PageSidebar>`
 * beside it. The page keeps its own `max-w-7xl … px-4 sm:px-6 lg:px-8`
 * wrapper, which is why the shell has no horizontal padding of its own and
 * the sidebar carries the right gutter. Guide-layout pages already render
 * their own article + sidebar row and are left alone.
 */
export function withPageEndUsing<P extends object>(
  Page: ComponentType<P>,
  route: string,
  components: PageEndComponents,
) {
  const template = templateFor(route);
  async function PageWithEnd(props: P) {
    const maybeParams = (props as { params?: Promise<RouteParams> }).params;
    const params: RouteParams = maybeParams ? await maybeParams : {};
    const path = route.replace(/\[([^\]]+)\]/g, (_, key: string) => {
      const value = params[key];
      return Array.isArray(value) ? value.join("/") : (value ?? "");
    });
    // For the featured image and JSON-LD further down the tree (lib/page-route.ts).
    setPageRoute(path);
    const body = (
      <>
        <Page {...props} />
        <PageEnd path={path} Link={components.Link} Banner={components.Banner} />
      </>
    );
    if (template !== "calculator") return body;
    return (
      <div className="mx-auto max-w-7xl lg:flex lg:gap-4">
        <div className="mv-content min-w-0 lg:flex-1">{body}</div>
        <PageSidebar path={path} Link={components.Link} />
      </div>
    );
  }
  PageWithEnd.displayName = `withPageEnd(${Page.displayName ?? Page.name ?? "Page"})`;
  return PageWithEnd;
}
