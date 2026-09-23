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
 *
 * Styling for the ~300 repeated links lives in globals.css (`.sn-*`), not in
 * utility strings: this markup ships in every page's HTML and RSC payload.
 */

const HEADING_FONT = { fontFamily: "'Bricolage Grotesque', sans-serif" } as const;

export default function Navbar() {
  return (
    <header
      id="site-header"
      data-scrolled="false"
      data-mobile-open="false"
      className="group/header fixed inset-x-0 top-0 z-50 border-b border-transparent bg-white/85 backdrop-blur-md transition-[background-color,box-shadow,border-color] duration-300 data-[scrolled=true]:border-sandstone-dark/40 data-[scrolled=true]:bg-white/95 data-[scrolled=true]:shadow-md max-lg:data-[mobile-open=true]:bg-white"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href={navigationLogo.href} className="sn-ring group flex shrink-0 items-center gap-2.5 rounded-lg">
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
          className="sn-ring -mr-2 flex h-11 w-11 items-center justify-center rounded-lg text-navy transition-colors hover:bg-sandstone lg:hidden"
        >
          <span className="sr-only group-data-[mobile-open=true]/header:hidden">Open menu</span>
          <span className="sr-only hidden group-data-[mobile-open=true]/header:inline">Close menu</span>
          <Menu aria-hidden="true" className="h-6 w-6 group-data-[mobile-open=true]/header:hidden" />
          <X aria-hidden="true" className="hidden h-6 w-6 group-data-[mobile-open=true]/header:block" />
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
                <Link href={link.href} className="sn-top">
                  <span>{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="space-y-3 px-4 pb-10 pt-4 lg:contents lg:space-y-0">
            <Link
              href={NAV_CTA.href}
              className="sn-ring flex min-h-12 items-center justify-center gap-1.5 rounded-lg bg-eucalyptus-dark px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-navy lg:ml-2 lg:min-h-9"
            >
              {NAV_CTA.label}
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            <Link
              href="/site-directory/"
              className="sn-ring flex min-h-11 items-center justify-center rounded-lg text-sm font-medium text-warmgray underline-offset-4 hover:text-navy hover:underline lg:hidden"
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
    <li data-menu-item>
      <button
        type="button"
        id={`nav-btn-${menu.id}`}
        data-menu-button
        aria-expanded="false"
        aria-controls={panelId}
        className="sn-top"
      >
        <span>{menu.label}</span>
        <ChevronDown aria-hidden="true" />
      </button>

      <div id={panelId} data-menu-panel role="region" aria-labelledby={`nav-btn-${menu.id}`} hidden className="sn-panel">
        <div className="sn-body">
          <div className="sn-rail">
            <p>Start here</p>
            <ul>
              {menu.featured.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="sn-hub">
                    <b>{l.label}</b>
                    {l.description}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            {menu.stateGrid && <StateGrid grid={menu.stateGrid} />}
            <div className={menu.stateGrid ? "sn-groups sn-m" : "sn-groups"}>
              {menu.groups.map((g) => (
                <Group key={g.title} group={g} id={`nav-grp-${menu.id}-${slug(g.title)}`} />
              ))}
            </div>
          </div>
        </div>
        <div className="sn-foot">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-3 text-sm">
            <span className="text-warmgray">{menu.intro}</span>
            <Link
              href="/site-directory/"
              className="sn-ring inline-flex items-center gap-1 rounded font-medium text-eucalyptus-dark hover:text-navy hover:underline"
            >
              Browse every page <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </li>
  );
}

function Group({ group, id }: { group: MenuGroup; id: string }) {
  const hubListed = !group.href || group.links.some((l) => l.href === group.href);
  return (
    <section aria-labelledby={`${id}-h`}>
      {/* Desktop heading, linking to the group's hub when it has one. */}
      <h3 id={`${id}-h`} className="sn-gh">
        {group.href ? <Link href={group.href}>{group.title}</Link> : group.title}
      </h3>
      {/* Mobile accordion trigger. */}
      <button type="button" data-group-button aria-expanded="false" aria-controls={id} className="sn-gb">
        <span>
          {group.title}
          <i>{group.links.length}</i>
        </span>
      </button>
      <ul id={id} data-open="false" className="sn-list">
        {group.links.map((l) => (
          <li key={l.href}>
            <Link href={l.href}>{l.label}</Link>
          </li>
        ))}
        {!hubListed && (
          <li>
            <Link href={group.href!} className="sn-all">
              All {group.title.toLowerCase()}
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
    <table className="sn-grid">
      <caption className="sr-only">State pages by topic</caption>
      <thead>
        <tr>
          <th scope="col">State</th>
          {grid.topics.map((t) => (
            <th key={t.key} scope="col">
              <Link href={t.hub}>{t.label}</Link>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {grid.rows.map((row) => (
          <tr key={row.code}>
            <th scope="row">
              <b>{row.code}</b> <small>{row.name}</small>
            </th>
            {grid.topics.map((t) => {
              const href = row.cells[t.key];
              return (
                <td key={t.key}>
                  {href ? (
                    <Link href={href} aria-label={`${row.code} ${t.label.toLowerCase()}`}>
                      {row.code}
                    </Link>
                  ) : (
                    <span aria-label="No page">–</span>
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
