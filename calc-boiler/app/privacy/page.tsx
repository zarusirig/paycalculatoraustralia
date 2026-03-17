import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, WebPage, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/privacy/`;
const TITLE = "Privacy Policy — Pay Calculator Australia";
const DESCRIPTION =
  "How Pay Calculator Australia handles your data. All calculations happen in your browser — we don't collect, store, or transmit your salary information.";

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
    { "@type": "ListItem", position: 2, name: "Privacy Policy", item: URL },
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

export default function PrivacyPage() {
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
              Privacy Policy
            </li>
          </ol>
        </nav>

        <article>
          <header className="mb-10">
            <h1 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              Privacy Policy
            </h1>
            <p className="mt-2 text-sm text-warmgray-light">
              Last updated:{" "}
              <time dateTime="2026-03-14">14 March 2026</time>
            </p>
            <p className="mt-4 text-lg leading-relaxed text-warmgray">
              Your privacy matters. Here&apos;s exactly how{" "}
              {SITE_CONFIG.name} handles your data — in plain English,
              not legal jargon.
            </p>
          </header>

          {/* Key point */}
          <div className="mb-10 rounded-xl border border-green-200 bg-eucalyptus-light/30 p-5">
            <p className="font-semibold text-green-900">
              The short version: All calculations happen in your browser. We do
              not collect, store, or transmit your salary information to any
              server.
            </p>
          </div>

          {/* Calculator Data */}
          <section aria-labelledby="calculator-data" className="mb-10">
            <h2
              id="calculator-data"
              className="mb-4 text-2xl font-bold text-navy"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              Your Calculator Data
            </h2>
            <ul className="space-y-3 text-warmgray">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                <span>
                  <strong>We do not collect your salary information.</strong>{" "}
                  When you enter a salary into any of our calculators, the
                  calculation runs entirely in your web browser using JavaScript.
                  No data is sent to our servers or any third party.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                <span>
                  <strong>We do not store calculation results.</strong> Once you
                  close or refresh the page, your inputs and results are gone. We
                  have no database of user calculations.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                <span>
                  <strong>We do not require any personal information.</strong>{" "}
                  No signup, no email, no name — you can use every calculator
                  on this site completely anonymously.
                </span>
              </li>
            </ul>
          </section>

          {/* Analytics */}
          <section aria-labelledby="analytics" className="mb-10">
            <h2
              id="analytics"
              className="mb-4 text-2xl font-bold text-navy"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              Analytics
            </h2>
            <p className="mb-3 leading-relaxed text-warmgray">
              We use Google Analytics 4 (GA4) to understand how visitors use our
              site. This helps us improve our calculators and create content that
              people find useful.
            </p>
            <p className="mb-3 leading-relaxed text-warmgray">
              GA4 collects anonymous usage data such as:
            </p>
            <ul className="mb-3 space-y-1 text-warmgray">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-warmgray-light" />
                Pages visited and time spent on site
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-warmgray-light" />
                Device type, browser, and general geographic region
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-warmgray-light" />
                How you arrived at the site (search engine, direct link, etc.)
              </li>
            </ul>
            <p className="leading-relaxed text-warmgray">
              GA4 does <strong>not</strong> collect your salary inputs,
              calculation results, or any personally identifiable information
              from our calculators.
            </p>
          </section>

          {/* Cookies */}
          <section aria-labelledby="cookies" className="mb-10">
            <h2
              id="cookies"
              className="mb-4 text-2xl font-bold text-navy"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              Cookies
            </h2>
            <p className="mb-3 leading-relaxed text-warmgray">
              We use cookies only for analytics purposes (Google Analytics). These
              are small text files stored on your device that help us understand
              site usage patterns.
            </p>
            <p className="leading-relaxed text-warmgray">
              You can control or delete cookies through your browser settings. Our
              calculators will continue to work normally without cookies enabled.
            </p>
          </section>

          {/* Third-Party Services */}
          <section aria-labelledby="third-party" className="mb-10">
            <h2
              id="third-party"
              className="mb-4 text-2xl font-bold text-navy"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              Third-Party Services
            </h2>
            <p className="mb-3 leading-relaxed text-warmgray">
              We use the following third-party services:
            </p>
            <ul className="space-y-2 text-warmgray">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-warmgray-light" />
                <span>
                  <strong>Google Analytics 4</strong> — anonymous usage
                  statistics (
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-eucalyptus hover:underline"
                  >
                    Google Privacy Policy
                  </a>
                  )
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-warmgray-light" />
                <span>
                  <strong>Vercel</strong> — website hosting and content delivery
                  (
                  <a
                    href="https://vercel.com/legal/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-eucalyptus hover:underline"
                  >
                    Vercel Privacy Policy
                  </a>
                  )
                </span>
              </li>
            </ul>
          </section>

          {/* Data Selling */}
          <section aria-labelledby="data-sharing" className="mb-10">
            <h2
              id="data-sharing"
              className="mb-4 text-2xl font-bold text-navy"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              Data Sharing & Selling
            </h2>
            <p className="leading-relaxed text-warmgray">
              <strong>We do not sell personal data to third parties.</strong> We
              do not share any data with advertisers, data brokers, or any other
              commercial entities beyond the analytics services listed above.
            </p>
          </section>

          {/* Children */}
          <section aria-labelledby="children" className="mb-10">
            <h2
              id="children"
              className="mb-4 text-2xl font-bold text-navy"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              Children&apos;s Privacy
            </h2>
            <p className="leading-relaxed text-warmgray">
              Our site is not directed at children under 13. We do not knowingly
              collect any information from children.
            </p>
          </section>

          {/* Changes */}
          <section aria-labelledby="changes" className="mb-10">
            <h2
              id="changes"
              className="mb-4 text-2xl font-bold text-navy"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              Changes to This Policy
            </h2>
            <p className="leading-relaxed text-warmgray">
              We may update this privacy policy from time to time. Any changes
              will be posted on this page with an updated &quot;Last
              updated&quot; date. We encourage you to review this page
              periodically.
            </p>
          </section>

          {/* Contact */}
          <section aria-labelledby="privacy-contact" className="mb-10">
            <h2
              id="privacy-contact"
              className="mb-4 text-2xl font-bold text-navy"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              Contact
            </h2>
            <p className="leading-relaxed text-warmgray">
              If you have questions about this privacy policy, email us at{" "}
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="font-medium text-eucalyptus hover:underline"
              >
                {SITE_CONFIG.email}
              </a>
              .
            </p>
          </section>

          {/* Back link */}
          <div className="rounded-xl bg-sandstone p-6 text-center">
            <Link
              href="/"
              className="inline-block rounded-lg bg-eucalyptus-dark px-6 py-3 font-medium text-white shadow-md transition hover:bg-navy hover:shadow-lg"
            >
              Back to Pay Calculator →
            </Link>
          </div>
        </article>
      </div>
    </>
  );
}
