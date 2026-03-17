import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, WebPage, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/terms/`;
const TITLE = "Terms of Use — Pay Calculator Australia";
const DESCRIPTION =
  "Terms of use for Pay Calculator Australia. Our calculators provide estimates based on official ATO rates — not financial advice. Read our full terms.";

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
    { "@type": "ListItem", position: 2, name: "Terms of Use", item: URL },
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

export default function TermsPage() {
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
              Terms of Use
            </li>
          </ol>
        </nav>

        <article>
          <header className="mb-10">
            <h1 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              Terms of Use
            </h1>
            <p className="mt-2 text-sm text-warmgray-light">
              Last updated:{" "}
              <time dateTime="2026-03-14">14 March 2026</time>
            </p>
            <p className="mt-4 text-lg leading-relaxed text-warmgray">
              By using {SITE_CONFIG.name} ({SITE_CONFIG.domain}), you agree to
              these terms. Please read them carefully.
            </p>
          </header>

          {/* Key disclaimer */}
          <div className="mb-10 rounded-xl border border-amber-200 bg-amber-50 p-5">
            <p className="font-semibold text-amber-900">
              Important: This website provides estimates and general information
              only. It does not constitute financial, tax, or legal advice.
            </p>
          </div>

          {/* Nature of Service */}
          <section aria-labelledby="nature-of-service" className="mb-10">
            <h2
              id="nature-of-service"
              className="mb-4 text-2xl font-bold text-navy"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              1. Nature of Our Service
            </h2>
            <p className="mb-3 leading-relaxed text-warmgray">
              {SITE_CONFIG.name} provides free online calculators and
              educational guides about Australian pay, income tax,
              superannuation, Medicare levy, HECS-HELP repayments, and related
              employment topics.
            </p>
            <p className="leading-relaxed text-warmgray">
              Our calculators produce{" "}
              <strong>estimates based on the general tax rates</strong>{" "}
              published by the Australian Taxation Office (ATO) for the relevant
              financial year. They do not account for individual circumstances
              such as work-related deductions, private rulings, multiple
              employers, foreign income, or other factors that may affect your
              actual tax liability.
            </p>
          </section>

          {/* Not Financial Advice */}
          <section aria-labelledby="not-advice" className="mb-10">
            <h2
              id="not-advice"
              className="mb-4 text-2xl font-bold text-navy"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              2. Not Financial or Tax Advice
            </h2>
            <p className="mb-3 leading-relaxed text-warmgray">
              The information on this website is provided for general
              informational and educational purposes only. It is{" "}
              <strong>not</strong>:
            </p>
            <ul className="mb-3 space-y-2 text-warmgray">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                Personal financial advice
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                Tax advice or a substitute for a registered tax agent
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                Legal advice about employment law or entitlements
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                A substitute for professional accounting services
              </li>
            </ul>
            <p className="leading-relaxed text-warmgray">
              For advice specific to your personal circumstances, we recommend
              consulting a{" "}
              <a
                href="https://www.tpb.gov.au/public-register"
                target="_blank"
                rel="noopener noreferrer"
                className="text-eucalyptus hover:underline"
              >
                registered tax agent
              </a>{" "}
              or qualified financial adviser.
            </p>
          </section>

          {/* Accuracy */}
          <section aria-labelledby="accuracy" className="mb-10">
            <h2
              id="accuracy"
              className="mb-4 text-2xl font-bold text-navy"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              3. Accuracy of Information
            </h2>
            <p className="mb-3 leading-relaxed text-warmgray">
              We take great care to ensure all figures are sourced from official
              government publications (ATO, Fair Work Commission, Services
              Australia). However, we cannot guarantee that all information is
              complete, current, or error-free at all times.
            </p>
            <p className="leading-relaxed text-warmgray">
              Tax rates and thresholds change at the start of each financial
              year (1 July) and occasionally mid-year following government
              announcements. While we aim to update within 48 hours of any
              change, brief delays may occur.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section aria-labelledby="liability" className="mb-10">
            <h2
              id="liability"
              className="mb-4 text-2xl font-bold text-navy"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              4. Limitation of Liability
            </h2>
            <p className="mb-3 leading-relaxed text-warmgray">
              To the maximum extent permitted by Australian law,{" "}
              {SITE_CONFIG.name} and its operators shall not be liable for any
              loss or damage arising from your use of this website, including but
              not limited to:
            </p>
            <ul className="space-y-2 text-warmgray">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-warmgray-light" />
                Errors or omissions in calculator results
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-warmgray-light" />
                Financial decisions made based on our estimates
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-warmgray-light" />
                Temporary unavailability of the website
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-warmgray-light" />
                Delays in updating rates after government announcements
              </li>
            </ul>
          </section>

          {/* No Affiliation */}
          <section aria-labelledby="no-affiliation" className="mb-10">
            <h2
              id="no-affiliation"
              className="mb-4 text-2xl font-bold text-navy"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              5. No Government Affiliation
            </h2>
            <p className="leading-relaxed text-warmgray">
              {SITE_CONFIG.name} is an independent website. We are{" "}
              <strong>not affiliated with</strong> the Australian Taxation
              Office (ATO), Fair Work Commission, Fair Work Ombudsman, Services
              Australia, or any other government body. References to these
              organisations are for source attribution only.
            </p>
          </section>

          {/* Intellectual Property */}
          <section aria-labelledby="ip" className="mb-10">
            <h2
              id="ip"
              className="mb-4 text-2xl font-bold text-navy"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              6. Intellectual Property
            </h2>
            <p className="leading-relaxed text-warmgray">
              All content, design, code, and branding on this website is owned
              by {SITE_CONFIG.name} unless otherwise stated. You may use our
              calculators freely for personal or professional purposes. You may
              not reproduce, redistribute, or commercially exploit our content
              without written permission.
            </p>
          </section>

          {/* Links */}
          <section aria-labelledby="external-links" className="mb-10">
            <h2
              id="external-links"
              className="mb-4 text-2xl font-bold text-navy"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              7. External Links
            </h2>
            <p className="leading-relaxed text-warmgray">
              Our site contains links to external websites (ATO, Fair Work,
              etc.) for source attribution and user convenience. We are not
              responsible for the content, accuracy, or privacy practices of
              these external sites.
            </p>
          </section>

          {/* Modifications */}
          <section aria-labelledby="modifications" className="mb-10">
            <h2
              id="modifications"
              className="mb-4 text-2xl font-bold text-navy"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              8. Modifications to These Terms
            </h2>
            <p className="leading-relaxed text-warmgray">
              We may update these terms from time to time. Changes will be
              posted on this page with an updated date. Continued use of the
              website after changes constitutes acceptance of the revised terms.
            </p>
          </section>

          {/* Governing Law */}
          <section aria-labelledby="governing-law" className="mb-10">
            <h2
              id="governing-law"
              className="mb-4 text-2xl font-bold text-navy"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              9. Governing Law
            </h2>
            <p className="leading-relaxed text-warmgray">
              These terms are governed by the laws of Australia. Any disputes
              arising from the use of this website shall be subject to the
              jurisdiction of Australian courts.
            </p>
          </section>

          {/* Contact */}
          <section aria-labelledby="terms-contact" className="mb-10">
            <h2
              id="terms-contact"
              className="mb-4 text-2xl font-bold text-navy"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              10. Contact
            </h2>
            <p className="leading-relaxed text-warmgray">
              Questions about these terms? Email us at{" "}
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
