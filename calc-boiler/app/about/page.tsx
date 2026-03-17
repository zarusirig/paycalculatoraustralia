import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, WebPage, WithContext } from "schema-dts";
import { SITE_CONFIG, SOURCES } from "@/lib/constants";
import { ShieldCheck, Database, RefreshCw, ExternalLink } from "lucide-react";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/about/`;
const TITLE = "About Pay Calculator Australia — Our Methodology & Data Sources";
const DESCRIPTION =
  "Learn how Pay Calculator Australia ensures accuracy. Our methodology, data sources (ATO, Fair Work), and commitment to free, up-to-date Australian pay calculators.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: "en_AU",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "About", item: URL },
  ],
};

const webPage: WithContext<WebPage> = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: TITLE,
  url: URL,
  description: DESCRIPTION,
  publisher: { "@type": "Organization", name: SITE_CONFIG.name },
};

export default function AboutPage() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage]} />

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-warmgray-light">
            <li>
              <Link href="/" className="hover:text-eucalyptus">
                Pay Calculator
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="font-medium text-navy">
              About
            </li>
          </ol>
        </nav>

        <article>
          <header className="mb-10">
            <h1 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              About Pay Calculator Australia
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-warmgray">
              Pay Calculator Australia provides free, accurate pay calculation
              tools for Australian workers, employers, and HR professionals. We
              built this site because understanding your pay shouldn&apos;t
              require an accounting degree.
            </p>
          </header>

          {/* Mission */}
          <section aria-labelledby="mission" className="mb-12">
            <h2
              id="mission"
              className="mb-4 text-2xl font-bold text-navy"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              Our Mission
            </h2>
            <p className="leading-relaxed text-warmgray">
              Every Australian worker deserves to understand exactly what they
              earn, what gets deducted, and why. We provide instant, accurate
              calculators backed by official government data — completely free,
              with no signups, no paywalls, and no misleading complexity.
            </p>
          </section>

          {/* Methodology */}
          <section aria-labelledby="methodology" className="mb-12">
            <h2
              id="methodology"
              className="mb-6 text-2xl font-bold text-navy"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              Our Methodology
            </h2>
            <p className="mb-6 leading-relaxed text-warmgray">
              Every calculator on this site uses the official tax tables and
              rates published by the Australian Taxation Office (ATO), Fair Work
              Commission (FWC), and Services Australia. We update our
              calculators within 48 hours of any rate change announcement.
            </p>

            <div className="grid gap-6 sm:grid-cols-3">
              <div className="rounded-xl border border-sandstone-dark/20 p-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-eucalyptus-light/40 text-eucalyptus">
                  <Database className="h-5 w-5" />
                </div>
                <h3 className="mb-2 font-semibold text-navy">
                  Official Sources Only
                </h3>
                <p className="text-sm leading-relaxed text-warmgray">
                  All tax brackets, super rates, and thresholds are sourced
                  directly from ATO.gov.au and verified against published
                  schedules.
                </p>
              </div>

              <div className="rounded-xl border border-sandstone-dark/20 p-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-eucalyptus-light/30 text-eucalyptus">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="mb-2 font-semibold text-navy">
                  Cross-Checked Results
                </h3>
                <p className="text-sm leading-relaxed text-warmgray">
                  Calculator outputs are cross-checked against the ATO&apos;s
                  official simple tax calculator at multiple salary levels
                  ($50K, $80K, $100K, $150K, $200K).
                </p>
              </div>

              <div className="rounded-xl border border-sandstone-dark/20 p-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                  <RefreshCw className="h-5 w-5" />
                </div>
                <h3 className="mb-2 font-semibold text-navy">
                  Updated Every Financial Year
                </h3>
                <p className="text-sm leading-relaxed text-warmgray">
                  Rates are reviewed and updated each July when the new
                  financial year begins, and whenever mid-year changes are
                  announced.
                </p>
              </div>
            </div>
          </section>

          {/* How We Ensure Accuracy */}
          <section aria-labelledby="accuracy" className="mb-12">
            <h2
              id="accuracy"
              className="mb-4 text-2xl font-bold text-navy"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              How We Ensure Accuracy
            </h2>
            <ol className="space-y-3 text-warmgray">
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-eucalyptus-light text-sm font-bold text-eucalyptus-dark">
                  1
                </span>
                <span>
                  All tax brackets, super rates, and thresholds are sourced
                  directly from{" "}
                  <a
                    href={SOURCES.ato.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-eucalyptus hover:underline"
                  >
                    ATO.gov.au
                  </a>{" "}
                  and verified against published schedules
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-eucalyptus-light text-sm font-bold text-eucalyptus-dark">
                  2
                </span>
                <span>
                  Calculator outputs are cross-checked against the ATO&apos;s
                  official simple tax calculator at multiple salary levels
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-eucalyptus-light text-sm font-bold text-eucalyptus-dark">
                  3
                </span>
                <span>
                  HECS-HELP repayment rates are verified against the ATO&apos;s
                  study and training loan repayment thresholds
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-eucalyptus-light text-sm font-bold text-eucalyptus-dark">
                  4
                </span>
                <span>
                  Superannuation Guarantee rates are confirmed against Treasury
                  legislation
                </span>
              </li>
            </ol>
          </section>

          {/* Data Sources */}
          <section aria-labelledby="data-sources" className="mb-12">
            <h2
              id="data-sources"
              className="mb-4 text-2xl font-bold text-navy"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              Our Data Sources
            </h2>
            <ul className="space-y-3">
              {[
                { name: SOURCES.ato.name, url: SOURCES.ato.url, desc: "Tax rates, brackets, HECS thresholds, super rates" },
                { name: SOURCES.fwc.name, url: SOURCES.fwc.url, desc: "Minimum wage, award rate decisions" },
                { name: "Fair Work Ombudsman", url: SOURCES.fwo.url, desc: "Award rates, penalty rates, employment entitlements" },
                { name: SOURCES.servicesAustralia.name, url: SOURCES.servicesAustralia.url, desc: "Medicare levy thresholds" },
                { name: SOURCES.abs.name, url: SOURCES.abs.url, desc: "Average wage statistics" },
              ].map((source) => (
                <li key={source.url} className="flex items-start gap-3">
                  <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-warmgray-light" />
                  <div>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-eucalyptus hover:underline"
                    >
                      {source.name}
                    </a>
                    <span className="text-warmgray-light"> — {source.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* What We Cover */}
          <section aria-labelledby="coverage" className="mb-12">
            <h2
              id="coverage"
              className="mb-4 text-2xl font-bold text-navy"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              What We Cover
            </h2>
            <p className="mb-4 leading-relaxed text-warmgray">
              Our calculators and guides cover the full scope of Australian pay
              calculation, including:
            </p>
            <ul className="grid gap-2 text-warmgray sm:grid-cols-2">
              {[
                "Income tax brackets and rates",
                "Superannuation Guarantee (12%)",
                "Medicare levy and surcharge",
                "HECS-HELP repayments (new marginal system)",
                "Salary sacrifice into super",
                "Pay frequency conversions",
                "Redundancy pay entitlements",
                "Contractor vs employee comparison",
                "State-specific payroll tax",
                "Award rates and penalty rates",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-eucalyptus" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Contact */}
          <section aria-labelledby="about-contact" className="mb-12">
            <h2
              id="about-contact"
              className="mb-4 text-2xl font-bold text-navy"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              Contact Us
            </h2>
            <p className="leading-relaxed text-warmgray">
              Have a question, found an error, or want to suggest a feature?
              We&apos;d love to hear from you.
            </p>
            <p className="mt-3 text-warmgray">
              Email:{" "}
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="font-medium text-eucalyptus hover:underline"
              >
                {SITE_CONFIG.email}
              </a>
            </p>
            <p className="mt-2 text-sm text-warmgray-light">
              You can also visit our{" "}
              <Link href="/contact/" className="text-eucalyptus hover:underline">
                contact page
              </Link>{" "}
              for more details.
            </p>
          </section>

          {/* Last updated */}
          <aside
            className="rounded-xl bg-sandstone p-5 text-sm text-warmgray-light"
            aria-label="Page information"
          >
            <p>
              Last updated:{" "}
              <time dateTime="2026-03-14">14 March 2026</time>. All rates apply
              for FY{SITE_CONFIG.financialYear} ({SITE_CONFIG.financialYearStart}{" "}
              – {SITE_CONFIG.financialYearEnd}).
            </p>
          </aside>
        </article>
      </div>
    </>
  );
}
