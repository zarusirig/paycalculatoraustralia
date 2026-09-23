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
  FOOTER_CALCULATORS,
  FOOTER_GUIDES_TAX,
  FOOTER_GUIDES_SUPER_PAY,
  FOOTER_GUIDES_EMPLOYMENT,
  FOOTER_STATES_AND_LEGAL,
  FOOTER_NEWS,
  MEGA_MENU,
} from "@/lib/navigation";
import { ALL_RATES, hourlyRateSlug } from "@/modules/programmatic/hourly-to-salary";
import { getAllNews } from "@/lib/news";
import { JURISDICTION_CODES } from "@/lib/constants/long-service-leave";
import { TEACHER_STATE_SLUGS } from "@/lib/data/teacher-pay/types";
import { NURSING_PAY_STATES } from "@/lib/data/nursing-pay";
import { JURISDICTIONS as PUBLIC_SERVICE_JURISDICTIONS } from "@/lib/data/public-service-pay";
import { formatAUD } from "@/lib/constants";
// C1 employer pay rates (2026-09-23)
import { EMPLOYERS } from "@/lib/data/employer-pay";
import { MIN_WAGE_AGES } from "@/lib/constants/minimum-wage"; // minimum wage cluster (C5)
// C2 occupation pay rates + C5 ADF pay scales (2026-09-23)
import { OCCUPATIONS } from "@/lib/data/job-pay-rates";
import { ADF_SERVICE_LIST } from "@/lib/data/adf-pay";
// --- T2 payroll tax cluster (23 Sep 2026) ---
import { PAYROLL_TAX_STATE_CODES, PAYROLL_TAX_STATES } from "@/lib/constants/payroll-tax";
// --- end T2 ---

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
 * Until Sep 2026 the mega menu lived in a client component inside a
 * framer-motion AnimatePresence, so none of its links reached the rendered
 * HTML. The header is now server-rendered with every menu link in the HTML,
 * but it is curated (hubs + popular leaves). This page stays the complete
 * index: one hub linking everything, built from the same navigation data so
 * it cannot drift.
 */
/**
 * The programmatic clusters below were the site's real orphan problem. Measured
 * on 28 Jul 2026 against the built output: of 250 real pages, 90 had NO inbound
 * link from the footer, the nav, or this page — /salary-to-hourly/ (20 of 20),
 * /hourly-to-salary/ (28 of 30), /take-home-pay-on/ (26 of 35) and 16 of 25
 * news articles. They were reachable only from the sitemap.
 *
 * Each list is derived from the same constant the route's generateStaticParams
 * uses, so a page cannot be built without appearing here.
 */

// /take-home-pay-on/[salary] builds 30000..200000 step 5000.
const TAKE_HOME_SALARIES = Array.from({ length: 35 }, (_, i) => 30000 + i * 5000);

// /salary-to-hourly/[amount] — mirrors SALARY_LIST in that route.
const SALARY_TO_HOURLY = [
  30000, 40000, 45000, 50000, 55000, 60000, 65000, 70000, 75000, 80000, 85000,
  90000, 95000, 100000, 110000, 120000, 130000, 140000, 150000, 200000,
];

// Pay-scale and entitlement spokes. Each list is the same constant the route's
// generateStaticParams uses, so a spoke cannot be built without appearing here.
const up = (c: string) => c.toUpperCase();

const payScaleGroups: Group[] = [
  {
    title: "Long Service Leave by State",
    items: JURISDICTION_CODES.map((c) => ({
      href: `/long-service-leave-calculator/${c}/`,
      label: `Long Service Leave ${up(c)}`,
    })),
  },
  {
    title: "Teacher Salary by State",
    items: TEACHER_STATE_SLUGS.map((c) => ({
      href: `/teacher-pay-australia/${c}/`,
      label: `${up(c)} Teacher Salary`,
    })),
  },
  {
    title: "Public Service Pay Scales",
    items: [
      { href: "/public-service-pay-scales/", label: "Public Service Pay Scales" },
      ...PUBLIC_SERVICE_JURISDICTIONS.map((j) => ({
        href: `/public-service-pay-scales/${j.slug}/`,
        label: j.label,
      })),
    ],
  },
  {
    title: "Nurse Pay by State",
    items: NURSING_PAY_STATES.map((c) => ({
      href: `/healthcare-worker-pay/${c}/`,
      label: `Nurse Pay Rates ${up(c)}`,
    })),
  },
  // --- C1: employer pay-rate pages, 2026-09-23 ---
  {
    title: "Pay Rates by Employer",
    items: [
      { href: "/pay-rates/", label: "Pay Rates by Employer" },
      ...EMPLOYERS.map((e) => ({ href: `/pay-rates/${e.slug}/`, label: `${e.name} Pay Rates` })),
    ],
  },
  // --- end C1 ---
  // --- Minimum wage cluster (C5 workstream, 23 Sep 2026) ---
  {
    title: "Minimum Wage by Age",
    items: [
      { href: "/junior-pay-rates/", label: "Minimum Wage by Age (all ages)" },
      ...MIN_WAGE_AGES.map((a) => ({
        href: `/minimum-wage-by-age/${a}/`,
        label: `Minimum Wage for a ${a} Year Old`,
      })),
    ],
  },
  // --- end minimum wage cluster ---
  // --- C2 occupation pay rates + C5 ADF pay scales (23 Sep 2026) ---
  {
    title: "Pay Rates by Job",
    items: [
      { href: "/job-pay-rates/", label: "Job Pay Rates (all jobs)" },
      ...OCCUPATIONS.map((o) => ({ href: `/job-pay-rates/${o.slug}/`, label: `${o.name} Pay Rates` })),
    ],
  },
  {
    title: "ADF Pay Scales",
    items: [
      { href: "/adf-pay-scales/", label: "ADF Pay Scales" },
      ...ADF_SERVICE_LIST.map((s) => ({ href: `/adf-pay-scales/${s.slug}/`, label: `${s.name} Pay Scales` })),
    ],
  },
  // --- end C2/C5 ---
  // --- T2 payroll tax cluster (23 Sep 2026) ---
  {
    title: "Payroll Tax by State",
    items: [
      { href: "/payroll-tax/", label: "Payroll Tax Rates by State" },
      { href: "/payroll-tax-calculator/", label: "Payroll Tax Calculator" },
      ...PAYROLL_TAX_STATE_CODES.map((c) => ({
        href: `/payroll-tax/${c}/`,
        label: `${PAYROLL_TAX_STATES[c].abbr} Payroll Tax`,
      })),
    ],
  },
  // --- end T2 ---
  // --- F8 Lever D linkable assets (24 Sep 2026) ---
  {
    title: "Data & Tools for Other Sites",
    items: [
      { href: "/australian-pay-report-2026/", label: "Australian Pay Report 2026 (data study)" },
      { href: "/embed/", label: "Embed the Take-Home Pay Calculator" },
    ],
  },
  // --- end F8 ---
];

/** Split a long flat list into evenly sized, readable columns. */
function chunk<T>(items: readonly T[], parts: number): T[][] {
  const size = Math.ceil(items.length / parts);
  return Array.from({ length: parts }, (_, i) => items.slice(i * size, (i + 1) * size)).filter(
    (c) => c.length > 0,
  );
}

const takeHomeGroups: Group[] = chunk(TAKE_HOME_SALARIES, 3).map((col, i) => ({
  title: `Salaries ${i + 1}`,
  items: col.map((s) => ({
    href: `/take-home-pay-on/${s}/`,
    label: `Take-home pay on ${formatAUD(s, 0)}`,
  })),
}));

const salaryToHourlyGroups: Group[] = chunk(SALARY_TO_HOURLY, 2).map((col, i) => ({
  title: `Salary to hourly ${i + 1}`,
  items: col.map((s) => ({
    href: `/salary-to-hourly/${s}/`,
    label: `${formatAUD(s, 0)} a year as an hourly rate`,
  })),
}));

const hourlyToSalaryGroups: Group[] = chunk(ALL_RATES, 3).map((col, i) => ({
  title: `Hourly to salary ${i + 1}`,
  items: col.map((r) => ({
    href: `/hourly-to-salary/${hourlyRateSlug(r)}/`,
    label: `${formatAUD(r, 2)} an hour as a salary`,
  })),
}));

const newsGroups: Group[] = chunk(getAllNews(), 3).map((col, i) => ({
  title: `Articles ${i + 1}`,
  items: col.map((a) => ({ href: `/news/${a.slug}/`, label: a.title })),
}));

// --- T6: programmatic salary hubs (2026-09-23) ---
// The salary grid is now 138 take-home/tax pages and 135 hourly pages, too
// many to list here. Each hub below links every page in its family, grouped by
// band, so everything stays two clicks from this directory.
const salaryHubGroups: Group[] = [
  {
    title: "All salaries",
    items: [
      { href: "/take-home-pay-on/", label: "Take-home pay on every salary", description: "$20,000 to $500,000, $1k steps from $40k to $150k" },
      { href: "/tax-on/", label: "Tax on every salary", description: "Income tax and Medicare levy, same grid" },
      { href: "/salary-to-hourly/", label: "Every salary as an hourly rate", description: "$30,000 to $500,000 on a 38-hour week" },
    ],
  },
];
// --- end T6 ---

const BASE_SECTIONS: { heading: string; groups: readonly Group[] }[] = [
  { heading: "Salary Tables", groups: salaryHubGroups }, // T6
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
    heading: "Take-Home Pay by Salary",
    groups: takeHomeGroups,
  },
  {
    heading: "Salary to Hourly Rate",
    groups: salaryToHourlyGroups,
  },
  {
    heading: "Hourly Rate to Salary",
    groups: hourlyToSalaryGroups,
  },
  {
    heading: "Pay Scales & Entitlements by State",
    groups: payScaleGroups,
  },
  {
    heading: "By State",
    groups: STATE_CATEGORIES.map((c) => ({ title: c.title, items: c.states })),
  },
  {
    heading: "Pay & Tax News",
    groups: newsGroups,
  },
];

// The header and footer now show a curated subset, and the older per-column
// footer lists (still maintained in lib/navigation.ts) no longer render
// anywhere else. Anything in them or in the menu that the sections above do
// not already list goes here, so no page loses its last sitewide link.
const listed = new Set(BASE_SECTIONS.flatMap((s) => s.groups.flatMap((g) => g.items.map((i) => i.href))));
const extraItems: Item[] = [];
for (const item of [
  ...FOOTER_CALCULATORS,
  ...FOOTER_GUIDES_TAX,
  ...FOOTER_GUIDES_SUPER_PAY,
  ...FOOTER_GUIDES_EMPLOYMENT,
  ...FOOTER_STATES_AND_LEGAL,
  ...FOOTER_NEWS,
  ...MEGA_MENU.flatMap((m) => [...m.featured, ...m.groups.flatMap((g) => g.links)]),
]) {
  if (!listed.has(item.href)) {
    listed.add(item.href);
    extraItems.push({ href: item.href, label: item.label });
  }
}

const SECTIONS: { heading: string; groups: readonly Group[] }[] = extraItems.length
  ? [
      ...BASE_SECTIONS,
      {
        heading: "More Guides & Tools",
        groups: chunk(extraItems, 3).map((col, i) => ({ title: `More ${i + 1}`, items: col })),
      },
    ]
  : BASE_SECTIONS;

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
