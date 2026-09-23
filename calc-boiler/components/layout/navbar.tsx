import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";

import {
  MEGA_MENU,
  NAV_CTA,
  PRIMARY_NAV_LINKS,
  navigationLogo,
  type MegaMenu,
  type MenuGroup,
} from "@/lib/navigation";
import NavbarBehavior from "./navbar-behavior";

/*
 * Server component. Every menu link is in the static HTML of every page: the
 * panels are always rendered and hidden with the `hidden` attribute, which
 * NavbarBehavior (a small client island with no markup of its own) toggles.
 * Before Sep 2026 the menu mounted its links inside framer-motion's
 * AnimatePresence, so crawlers saw 5 header links and none of the menu.
 *
 * One DOM serves both breakpoints. From `lg` the panels are dropdown sheets
 * under the bar; below `lg` the same <nav> becomes a full-height drawer and
 * each panel an accordion section, with the groups inside it as nested
 * accordions. Group headings render twice (a heading for desktop, a button
 * for mobile) because only mobile needs them to be interactive.
 */

const HEADING_FONT = {
  fontFamily: "'Bricolage Grotesque', sans-serif",
} as const;

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-eucalyptus-dark";

export default function Navbar() {
  return (
    <header
      id="site-header"
      data-scrolled="false"
      data-mobile-open="false"
      className="group/header fixed inset-x-0 top-0 z-50 border-b border-transparent bg-white/85 backdrop-blur-md transition-[background-color,box-shadow,border-color] duration-300 data-[scrolled=true]:border-sandstone-dark/40 data-[scrolled=true]:bg-white/95 data-[scrolled=true]:shadow-md max-lg:data-[mobile-open=true]:bg-white"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href={navigationLogo.href}
          className={`group flex shrink-0 items-center gap-2.5 rounded-lg ${focusRing}`}
        >
          <Image
            src="/images/logo.svg"
            alt=""
            width={36}
            height={36}
            className="rounded-lg shadow-md transition-transform duration-200 group-hover:scale-105"
            priority
          />
          <span
            className="text-base font-bold tracking-tight text-navy transition-colors group-hover:text-eucalyptus-dark"
            style={HEADING_FONT}
          >
            {navigationLogo.label}
          </span>
        </Link>

        <button
          type="button"
          id="nav-toggle"
          aria-controls="site-nav"
          aria-expanded="false"
          className={`-mr-2 flex h-11 w-11 items-center justify-center rounded-lg text-navy transition-colors hover:bg-sandstone lg:hidden ${focusRing}`}
        >
          <span className="sr-only group-data-[mobile-open=true]/header:hidden">
            Open menu
          </span>
          <span className="sr-only hidden group-data-[mobile-open=true]/header:inline">
            Close menu
          </span>
          <Menu
            aria-hidden="true"
            className="h-6 w-6 group-data-[mobile-open=true]/header:hidden"
          />
          <X
            aria-hidden="true"
            className="hidden h-6 w-6 group-data-[mobile-open=true]/header:block"
          />
        </button>

        <nav
          id="site-nav"
          aria-label="Main"
          className="max-lg:absolute max-lg:inset-x-0 max-lg:top-full max-lg:hidden max-lg:h-[calc(100dvh-4rem)] max-lg:overflow-y-auto max-lg:overscroll-contain max-lg:border-t max-lg:border-sandstone-dark/40 max-lg:bg-white max-lg:group-data-[mobile-open=true]/header:block lg:flex lg:items-center lg:gap-2"
        >
          <ul className="max-lg:divide-y max-lg:divide-sandstone-dark/50 max-lg:px-4 lg:flex lg:items-center lg:gap-0.5">
            {MEGA_MENU.map((menu) => (
              <MenuItem key={menu.id} menu={menu} />
            ))}
            {PRIMARY_NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  data-nav-link
                  className={`flex items-center rounded-md font-medium text-navy/80 transition-colors hover:text-navy aria-[current=page]:text-eucalyptus-dark max-lg:min-h-14 max-lg:text-lg max-lg:text-navy lg:px-3 lg:py-2 lg:text-sm ${focusRing}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="space-y-3 px-4 pb-10 pt-4 lg:contents lg:space-y-0">
            <Link
              href={NAV_CTA.href}
              className={`flex min-h-12 items-center justify-center gap-1.5 rounded-lg bg-eucalyptus-dark px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-navy lg:ml-2 lg:min-h-9 ${focusRing}`}
            >
              {NAV_CTA.label}
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            <Link
              href="/site-directory/"
              className={`flex min-h-11 items-center justify-center rounded-lg text-sm font-medium text-warmgray underline-offset-4 hover:text-navy hover:underline lg:hidden ${focusRing}`}
            >
              Browse every page in the site directory
            </Link>
          </div>
        </nav>
      </div>

      <NavbarBehavior />
    </header>
  );
}

function MenuItem({ menu }: { menu: MegaMenu }) {
  const panelId = `nav-panel-${menu.id}`;
  return (
    <li data-menu-item className="group/item">
      <button
        type="button"
        id={`nav-btn-${menu.id}`}
        data-menu-button
        aria-expanded="false"
        aria-controls={panelId}
        className={`flex w-full items-center justify-between gap-1 rounded-md font-medium text-navy/80 transition-colors hover:text-navy aria-expanded:text-navy group-data-[active=true]/item:text-eucalyptus-dark max-lg:min-h-14 max-lg:text-lg max-lg:text-navy lg:px-3 lg:py-2 lg:text-sm ${focusRing}`}
      >
        <span className="max-lg:font-semibold" style={HEADING_FONT}>
          {menu.label}
        </span>
        <ChevronDown
          aria-hidden="true"
          className="h-4 w-4 text-warmgray-light transition-transform duration-200 group-has-[[aria-expanded=true]]/item:rotate-180 lg:h-3.5 lg:w-3.5"
        />
      </button>

      <div
        id={panelId}
        data-menu-panel
        role="region"
        aria-labelledby={`nav-btn-${menu.id}`}
        hidden
        className="lg:absolute lg:inset-x-0 lg:top-full lg:max-h-[calc(100dvh-4rem)] lg:overflow-y-auto lg:border-y lg:border-sandstone-dark/50 lg:bg-white lg:shadow-[0_24px_48px_-24px_rgba(26,39,68,0.35)]"
      >
        <div className="pb-5 lg:mx-auto lg:grid lg:max-w-7xl lg:grid-cols-[17rem_1fr] lg:gap-10 lg:px-8 lg:pb-0 lg:pt-7">
          <Rail menu={menu} />
          <div className="lg:pb-7">
            {menu.stateGrid ? (
              <>
                <StateGrid grid={menu.stateGrid} />
                <GroupList menu={menu} mobileOnly />
              </>
            ) : (
              <GroupList menu={menu} />
            )}
          </div>
        </div>
        <div className="hidden border-t border-sandstone-dark/40 bg-sandstone/60 lg:block">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-3 text-sm">
            <span className="text-warmgray">{menu.intro}</span>
            <Link
              href="/site-directory/"
              className={`inline-flex items-center gap-1 rounded font-medium text-eucalyptus-dark hover:text-navy hover:underline ${focusRing}`}
            >
              Browse every page{" "}
              <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </li>
  );
}

/** "Start here" hubs. Desktop: a sandstone rail. Mobile: the first rows of the section. */
function Rail({ menu }: { menu: MegaMenu }) {
  return (
    <div className="lg:mb-7 lg:self-start lg:rounded-xl lg:bg-sandstone lg:p-3">
      <p className="hidden px-3 pb-2 pt-1 text-[11px] font-bold uppercase tracking-[0.14em] text-warmgray lg:block">
        Start here
      </p>
      <ul className="max-lg:mb-2 max-lg:grid max-lg:grid-cols-2 max-lg:gap-2">
        {menu.featured.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              data-nav-link
              className={`group/f flex h-full flex-col rounded-lg px-3 py-2.5 transition-colors hover:bg-white max-lg:min-h-16 max-lg:bg-sandstone aria-[current=page]:bg-eucalyptus-light aria-[current=page]:ring-1 aria-[current=page]:ring-eucalyptus/40 ${focusRing}`}
            >
              <span className="flex items-center gap-1 text-sm font-semibold text-navy group-hover/f:text-eucalyptus-dark">
                {l.label}
                <ArrowRight
                  aria-hidden="true"
                  className="hidden h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all group-hover/f:translate-x-0 group-hover/f:opacity-100 lg:inline"
                />
              </span>
              {l.description && (
                <span className="mt-0.5 text-xs leading-snug text-warmgray-light">
                  {l.description}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function GroupList({
  menu,
  mobileOnly = false,
}: {
  menu: MegaMenu;
  mobileOnly?: boolean;
}) {
  return (
    <div
      className={`max-lg:divide-y max-lg:divide-sandstone-dark/40 max-lg:border-t max-lg:border-sandstone-dark/40 ${
        mobileOnly
          ? "lg:hidden"
          : "lg:grid lg:grid-cols-3 lg:gap-x-10 lg:gap-y-7"
      }`}
    >
      {menu.groups.map((g) => (
        <Group
          key={g.title}
          group={g}
          id={`nav-grp-${menu.id}-${slug(g.title)}`}
        />
      ))}
    </div>
  );
}

function Group({ group, id }: { group: MenuGroup; id: string }) {
  const hubListed = group.href
    ? group.links.some((l) => l.href === group.href)
    : true;
  return (
    <section aria-labelledby={`${id}-h`}>
      {/* Desktop heading (links to the hub when there is one). */}
      <h3
        id={`${id}-h`}
        className="mb-2 hidden border-b border-eucalyptus/25 pb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-eucalyptus-dark lg:block"
      >
        {group.href ? (
          <Link
            href={group.href}
            data-nav-link
            className={`group/h inline-flex items-center gap-1 rounded hover:text-navy ${focusRing}`}
          >
            {group.title}
            <ArrowRight
              aria-hidden="true"
              className="h-3 w-3 transition-transform group-hover/h:translate-x-0.5"
            />
          </Link>
        ) : (
          group.title
        )}
      </h3>
      {/* Mobile accordion trigger. */}
      <button
        type="button"
        data-group-button
        aria-expanded="false"
        aria-controls={id}
        className={`flex min-h-12 w-full items-center justify-between rounded-md text-left text-[15px] font-medium text-navy lg:hidden ${focusRing}`}
      >
        <span>
          {group.title}
          <span className="ml-2 rounded-full bg-sandstone px-2 py-0.5 text-xs font-normal text-warmgray">
            {group.links.length}
          </span>
        </span>
        <ChevronDown
          aria-hidden="true"
          className="h-4 w-4 text-warmgray-light transition-transform [[aria-expanded=true]>&]:rotate-180"
        />
      </button>
      <ul
        id={id}
        data-open="false"
        className="hidden pb-3 data-[open=true]:block lg:block lg:pb-0"
      >
        {group.links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              data-nav-link
              className={`flex items-center rounded text-warmgray transition-colors hover:text-eucalyptus-dark aria-[current=page]:font-semibold aria-[current=page]:text-eucalyptus-dark max-lg:min-h-11 max-lg:pl-3 max-lg:text-[15px] lg:py-1 lg:text-sm ${focusRing}`}
            >
              {l.label}
            </Link>
          </li>
        ))}
        {!hubListed && group.href && (
          <li className="lg:hidden">
            <Link
              href={group.href}
              data-nav-link
              className={`flex min-h-11 items-center gap-1 rounded pl-3 text-[15px] font-medium text-eucalyptus-dark ${focusRing}`}
            >
              All {group.title.toLowerCase()}{" "}
              <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
            </Link>
          </li>
        )}
      </ul>
    </section>
  );
}

/** Desktop-only: states down, topics across, so a reader finds their state once. */
function StateGrid({ grid }: { grid: NonNullable<MegaMenu["stateGrid"]> }) {
  return (
    <table className="hidden w-full border-separate border-spacing-0 text-sm lg:table">
      <caption className="sr-only">State pages by topic</caption>
      <thead>
        <tr>
          <th
            scope="col"
            className="pb-2 text-left text-[11px] font-bold uppercase tracking-[0.14em] text-warmgray"
          >
            State
          </th>
          {grid.topics.map((t) => (
            <th
              key={t.key}
              scope="col"
              className="pb-2 text-left text-[11px] font-bold uppercase tracking-[0.14em]"
            >
              <Link
                href={t.hub}
                data-nav-link
                className={`rounded text-eucalyptus-dark hover:text-navy hover:underline ${focusRing}`}
              >
                {t.label}
              </Link>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {grid.rows.map((row) => (
          <tr key={row.code} className="group/row">
            <th
              scope="row"
              className="border-t border-sandstone-dark/40 py-1.5 pr-4 text-left font-normal group-hover/row:bg-sandstone/50"
            >
              <span className="font-semibold text-navy">{row.code}</span>{" "}
              <span className="text-xs text-warmgray-light">{row.name}</span>
            </th>
            {grid.topics.map((t) => {
              const href = row.cells[t.key];
              return (
                <td
                  key={t.key}
                  className="border-t border-sandstone-dark/40 py-1.5 pr-3 group-hover/row:bg-sandstone/50"
                >
                  {href ? (
                    <Link
                      href={href}
                      data-nav-link
                      aria-label={`${row.code} ${t.label.toLowerCase()}`}
                      className={`inline-flex min-w-11 items-center justify-center rounded-md border border-sandstone-dark/60 bg-white px-2 py-0.5 text-xs font-semibold text-navy transition-colors hover:border-eucalyptus hover:bg-eucalyptus-light hover:text-eucalyptus-dark aria-[current=page]:border-eucalyptus aria-[current=page]:bg-eucalyptus-light ${focusRing}`}
                    >
                      {row.code}
                    </Link>
                  ) : (
                    <span
                      className="inline-block min-w-11 text-center text-warmgray-light/60"
                      aria-label="No page"
                    >
                      –
                    </span>
                  )}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function slug(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
