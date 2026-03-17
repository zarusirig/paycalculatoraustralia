import Image from "next/image";
import Link from "next/link";
import {
  FOOTER_CALCULATORS,
  FOOTER_GUIDES_TAX,
  FOOTER_GUIDES_SUPER_PAY,
  FOOTER_GUIDES_EMPLOYMENT,
  FOOTER_STATES_AND_LEGAL,
  FOOTER_TAX_ON_SALARY,
} from "@/lib/navigation";
import { SOURCES, SITE_CONFIG } from "@/lib/constants";

type NavItem = { label: string; href: string };

const POPULAR_SALARIES = [
  { salary: "$50K", weekly: "$846/wk" },
  { salary: "$60K", weekly: "$985/wk" },
  { salary: "$75K", weekly: "$1,121/wk" },
  { salary: "$90K", weekly: "$1,291/wk" },
  { salary: "$100K", weekly: "$1,386/wk" },
  { salary: "$120K", weekly: "$1,565/wk" },
  { salary: "$150K", weekly: "$1,790/wk" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="section-dark relative overflow-hidden border-t border-white/5">
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[600px] -translate-x-1/2 rounded-full bg-eucalyptus/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {/* Popular salaries ticker */}
        <div className="mb-12 rounded-xl border border-white/5 bg-white/3 p-4">
          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-widest text-sandstone-dark/60">
            Popular salary breakdowns
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {POPULAR_SALARIES.map((item) => (
              <span key={item.salary} className="text-sm">
                <span className="font-semibold text-sandstone-dark">{item.salary}</span>
                <span className="mx-1 text-warmgray-light/40">&rarr;</span>
                <span className="text-eucalyptus">{item.weekly}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Brand + Primary columns */}
        <div className="grid gap-12 pb-10 xl:grid-cols-5">
          {/* Brand */}
          <div className="space-y-6 xl:col-span-1">
            <div className="flex items-center gap-2.5">
              <Image
                src="/images/logo.svg"
                alt="Pay Calculator Australia"
                width={36}
                height={36}
                className="rounded-lg"
              />
              <span
                className="text-lg font-bold text-white"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                {SITE_CONFIG.name}
              </span>
            </div>

            <p className="text-sm leading-relaxed text-sandstone-dark/50">
              Free Australian pay calculator with income tax, super, Medicare
              levy &amp; HECS. Updated for FY{SITE_CONFIG.financialYear}. Sourced from
              official ATO and Fair Work data.
            </p>

            <div className="flex items-center gap-2 text-xs">
              <span className="live-dot" />
              <span className="text-eucalyptus/80">
                Rates verified {SITE_CONFIG.lastVerified}
              </span>
            </div>

            <div className="flex flex-wrap gap-3 text-xs text-sandstone-dark/40">
              <a
                href={SOURCES.ato.url}
                target="_blank"
                rel="noreferrer noopener"
                className="transition-colors hover:text-eucalyptus"
              >
                ATO.gov.au
              </a>
              <span className="text-white/10">|</span>
              <a
                href={SOURCES.fwo.url}
                target="_blank"
                rel="noreferrer noopener"
                className="transition-colors hover:text-eucalyptus"
              >
                fairwork.gov.au
              </a>
            </div>
          </div>

          {/* Link columns — 4 across on xl */}
          <div className="xl:col-span-4">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              <FooterColumn heading="Calculators" items={FOOTER_CALCULATORS} />
              <FooterColumn heading="Tax & Deductions" items={FOOTER_GUIDES_TAX} />
              <FooterColumn heading="Super & Pay" items={FOOTER_GUIDES_SUPER_PAY} />
              <div className="space-y-8">
                <FooterColumn heading="Employment & Industry" items={FOOTER_GUIDES_EMPLOYMENT} />
              </div>
            </div>
          </div>
        </div>

        {/* Secondary row — States + Tax on Salary */}
        <div className="border-t border-white/5 pt-8 pb-10">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
            <FooterColumn heading="By State" items={FOOTER_STATES_AND_LEGAL} />
            <FooterColumn heading="Tax on Salary" items={FOOTER_TAX_ON_SALARY} />
            <div className="col-span-2 md:col-span-1">
              <h3
                className="mb-4 text-xs font-bold uppercase tracking-widest text-sandstone-dark/50"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                Take-Home Pay
              </h3>
              <ul role="list" className="space-y-2.5">
                {[50000, 60000, 75000, 80000, 90000, 100000, 120000, 150000, 200000].map((s) => (
                  <li key={s}>
                    <Link
                      href={`/take-home-pay-on/${s}/`}
                      className="text-sm text-sandstone-dark/35 transition-colors duration-200 hover:text-eucalyptus"
                    >
                      Take-Home on ${(s / 1000).toFixed(0)}K
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="border-t border-white/5" />

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 pt-8 md:flex-row">
          <p className="text-sm text-sandstone-dark/30">
            &copy; {currentYear} {SITE_CONFIG.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-sandstone-dark/30">
            <a
              href={SOURCES.ato.url}
              target="_blank"
              rel="noreferrer noopener"
              className="transition-colors hover:text-eucalyptus"
            >
              ATO
            </a>
            <span className="text-white/10">|</span>
            <a
              href={SOURCES.fwo.url}
              target="_blank"
              rel="noreferrer noopener"
              className="transition-colors hover:text-eucalyptus"
            >
              Fair Work
            </a>
            <span className="text-white/10">|</span>
            <Link href="/sitemap.xml" className="transition-colors hover:text-eucalyptus">
              Sitemap
            </Link>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 rounded-xl border border-white/5 bg-white/3 p-4">
          <p className="text-center text-xs leading-relaxed text-sandstone-dark/30">
            This website provides general information and calculators based on
            current Australian tax rates published by the {SOURCES.ato.name} (ATO).
            It is not financial advice. For personal tax advice, consult a
            registered tax agent. Last verified: {SITE_CONFIG.lastVerified}.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ heading, items }: { heading: string; items: readonly NavItem[] }) {
  return (
    <div>
      <h3
        className="mb-4 text-xs font-bold uppercase tracking-widest text-sandstone-dark/50"
        style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
      >
        {heading}
      </h3>
      <ul role="list" className="space-y-2.5">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="text-sm text-sandstone-dark/35 transition-colors duration-200 hover:text-eucalyptus"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
