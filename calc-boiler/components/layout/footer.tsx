import Image from "next/image";
import Link from "next/link";
import {
  FOOTER_COLUMNS,
  FOOTER_COMPANY,
  type MenuLink,
} from "@/lib/navigation";
import { SOURCES, SITE_CONFIG } from "@/lib/constants";

/*
 * Columns mirror the header menus (lib/navigation.ts): hubs plus the key
 * leaves, not every page. Everything else is one click away via the Site
 * directory link, which lists every built page.
 */

const HEADING_FONT = { fontFamily: "'Bricolage Grotesque', sans-serif" } as const;
const linkBase =
  "rounded text-sandstone-dark/75 transition-colors hover:text-white hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-eucalyptus";
const linkClass = `${linkBase} inline-flex min-h-7 items-center text-sm`;
const smallLink = `${linkBase} text-xs`;

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [calculators, payRates, guides, states] = FOOTER_COLUMNS;

  return (
    <footer className="section-dark border-t border-white/5">
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-12 sm:px-6 lg:px-8">
        {/* Brand + trust */}
        <div className="flex flex-col gap-5 border-b border-white/10 pb-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-md space-y-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-eucalyptus"
            >
              <Image src="/images/logo.svg" alt="" width={32} height={32} className="rounded-lg" />
              <span className="text-lg font-bold text-white" style={HEADING_FONT}>
                {SITE_CONFIG.name}
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-sandstone-dark/75">
              Free Australian pay calculators with income tax, super, Medicare levy &amp; HECS. Updated for
              FY{SITE_CONFIG.financialYear} from official ATO and Fair Work data.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
            <span className="inline-flex items-center gap-2 text-eucalyptus-light/90">
              <span className="live-dot" />
              Rates verified {SITE_CONFIG.lastVerified}
            </span>
            <span className="hidden text-white/20 sm:inline" aria-hidden="true">
              |
            </span>
            <span className="text-sandstone-dark/75">
              Sources:{" "}
              <a href={SOURCES.ato.url} target="_blank" rel="noreferrer noopener" className={smallLink}>
                ATO.gov.au
              </a>
              {" · "}
              <a href={SOURCES.fwo.url} target="_blank" rel="noreferrer noopener" className={smallLink}>
                fairwork.gov.au
              </a>
            </span>
          </div>
        </div>

        {/* Link columns: one per menu cluster */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-9 py-10 sm:grid-cols-3 lg:grid-cols-5">
          <FooterColumn title={calculators.title} links={calculators.links} />
          <FooterColumn title={payRates.title} links={payRates.links} />
          <FooterColumn title={guides.title} links={guides.links} />
          <FooterColumn title={states.title} links={states.links} />
          <FooterColumn title="Company" links={FOOTER_COMPANY} />
        </div>

        {/* Disclaimer + bottom bar */}
        <div className="space-y-5 border-t border-white/10 pt-6">
          <p className="max-w-4xl text-xs leading-relaxed text-sandstone-dark/65">
            This website provides general information and calculators based on current Australian tax rates
            published by the {SOURCES.ato.name} (ATO). It is not financial advice. For personal tax advice,
            consult a registered tax agent. Last verified: {SITE_CONFIG.lastVerified}.
          </p>
          <div className="flex flex-col gap-2 text-xs text-sandstone-dark/65 sm:flex-row sm:items-center sm:justify-between">
            <p>
              &copy; {currentYear} {SITE_CONFIG.name}. All rights reserved.
            </p>
            <p className="flex flex-wrap gap-x-4 gap-y-1">
              <Link href="/site-directory/" className={smallLink}>
                Site directory
              </Link>
              <a href="/sitemap.xml" className={smallLink}>
                Sitemap
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function ColumnHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-sandstone" style={HEADING_FONT}>
      {children}
    </h3>
  );
}

function FooterColumn({ title, links }: { title: string; links: readonly MenuLink[] }) {
  return (
    <div>
      <ColumnHeading>{title}</ColumnHeading>
      <ul role="list" className="space-y-1">
        {links.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className={linkClass}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
