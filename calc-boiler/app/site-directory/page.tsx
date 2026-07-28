import type { Metadata } from "next";
import Link from "next/link";
import type { BreadcrumbList, WithContext } from "schema-dts";
import { JsonLd } from "@/modules/seo/json-ld";
import { SITE_CONFIG } from "@/lib/constants";
import {
  CALCULATOR_CATEGORIES,
  GUIDE_CATEGORIES,
  STATE_CATEGORIES,
  TAX_ON_SALARY_CATEGORIES,
  FOOTER_NEWS,
} from "@/lib/navigation";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/site-directory/`;

const TITLE = "Site Directory — Every Calculator, Guide & Tax Table";
const DESCRIPTION =
  "Complete index of every calculator, guide, tax table and salary breakdown on Pay Calculator Australia. Browse the full site in one page.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Site Directory", item: URL },
  ],
};

type Item = { href: string; label: string; description?: string };
type Group = { title: string; items: readonly Item[] };

/**
 * The site's mega menu lives in a client component inside a framer-motion
 * AnimatePresence, so none of its links reach the rendered HTML — around 40
 * guide links, all 35 /tax-on/ links and every state link were undiscoverable
 * by crawlers. This page is the server-rendered counterpart: one hub linking
 * everything, built from the same navigation data so it cannot drift.
 */
const SECTIONS: { heading: string; groups: readonly Group[] }[] = [
  {
    heading: "Calculators",
    groups: CALCULATOR_CATEGORIES.map((c) => ({ title: c.title, items: c.calculators })),
  },
  {
    heading: "Guides",
    groups: GUIDE_CATEGORIES.map((c) => ({ title: c.title, items: c.guides })),
  },
  {
    heading: "Tax by Salary",
    groups: TAX_ON_SALARY_CATEGORIES.map((c) => ({ title: c.title, items: c.salaries })),
  },
  {
    heading: "By State",
    groups: STATE_CATEGORIES.map((c) => ({ title: c.title, items: c.states })),
  },
  {
    heading: "Pay & Tax News",
    groups: [{ title: "Latest", items: FOOTER_NEWS }],
  },
];

export default function Page() {
  const total = SECTIONS.reduce(
    (sum, s) => sum + s.groups.reduce((g, group) => g + group.items.length, 0),
    0
  );

  return (
    <>
      <JsonLd code={[breadcrumb]} />
      <div className="min-h-screen flex-grow">
        <div className="mx-auto max-w-7xl space-y-12 px-4 py-8 sm:px-6 lg:px-8">
          <header className="max-w-3xl">
            <nav aria-label="breadcrumb">
              <ol className="flex items-center space-x-1 text-sm text-warmgray">
                <li>
                  <Link href="/" className="hover:text-eucalyptus-dark hover:underline">
                    Pay Calculator
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <span className="font-medium text-navy" aria-current="page">
                    Site Directory
                  </span>
                </li>
              </ol>
            </nav>
            <h1
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              className="mt-4 mb-3 text-3xl font-bold text-navy md:text-4xl"
            >
              Site Directory
            </h1>
            <p className="text-lg leading-relaxed text-warmgray">
              Every calculator, guide, tax table and salary breakdown on this site — {total} pages,
              organised by topic. All figures use official ATO rates for FY{SITE_CONFIG.financialYear}.
            </p>
          </header>

          {SECTIONS.map((section) => (
            <section key={section.heading} aria-labelledby={`s-${section.heading.replace(/\W+/g, "-")}`}>
              <h2
                id={`s-${section.heading.replace(/\W+/g, "-")}`}
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                className="mb-6 border-b border-sandstone-dark/20 pb-2 text-2xl font-bold text-navy"
              >
                {section.heading}
              </h2>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {section.groups.map((group) => (
                  <div key={`${section.heading}-${group.title}`}>
                    <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-eucalyptus-dark">
                      {group.title}
                    </h3>
                    <ul role="list" className="space-y-2 text-sm">
                      {group.items.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className="text-navy transition-colors hover:text-eucalyptus-dark hover:underline"
                          >
                            {item.label}
                          </Link>
                          {item.description && (
                            <span className="block text-xs text-warmgray">{item.description}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          ))}

          <section aria-labelledby="s-reference">
            <h2
              id="s-reference"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              className="mb-6 border-b border-sandstone-dark/20 pb-2 text-2xl font-bold text-navy"
            >
              About &amp; Reference
            </h2>
            <ul role="list" className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {[
                { href: "/about/", label: "About & Methodology" },
                { href: "/contact/", label: "Contact" },
                { href: "/privacy/", label: "Privacy Policy" },
                { href: "/terms/", label: "Terms of Use" },
                { href: "/sitemap.xml", label: "XML Sitemap" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-navy hover:text-eucalyptus-dark hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
