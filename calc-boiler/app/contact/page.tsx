import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, WebPage, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { Mail, MessageSquare, Bug } from "lucide-react";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/contact/`;
const TITLE = "Contact Pay Calculator Australia";
const DESCRIPTION =
  "Get in touch with Pay Calculator Australia. Report errors, suggest features, or ask questions about Australian pay, tax, and super calculators.";

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
    { "@type": "ListItem", position: 2, name: "Contact", item: URL },
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

export default function ContactPage() {
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
              Contact
            </li>
          </ol>
        </nav>

        <article>
          <header className="mb-10">
            <h1 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              Contact Us
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-warmgray">
              Have a question about our calculators, found an error in our
              figures, or want to suggest a new feature? We&apos;d love to hear
              from you.
            </p>
          </header>

          {/* Contact Methods */}
          <section aria-labelledby="contact-methods" className="mb-12">
            <h2
              id="contact-methods"
              className="mb-6 text-2xl font-bold text-navy"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              How to Reach Us
            </h2>

            <div className="grid gap-6 sm:grid-cols-3">
              <div className="rounded-xl border border-sandstone-dark/20 p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-eucalyptus-light/40 text-eucalyptus">
                  <Mail className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-semibold text-navy">
                  General Enquiries
                </h3>
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="text-eucalyptus hover:underline"
                >
                  {SITE_CONFIG.email}
                </a>
                <p className="mt-2 text-sm text-warmgray-light">
                  We aim to respond within 2 business days.
                </p>
              </div>

              <div className="rounded-xl border border-sandstone-dark/20 p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
                  <Bug className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-semibold text-navy">
                  Report an Error
                </h3>
                <a
                  href={`mailto:${SITE_CONFIG.email}?subject=Error%20Report`}
                  className="text-eucalyptus hover:underline"
                >
                  {SITE_CONFIG.email}
                </a>
                <p className="mt-2 text-sm text-warmgray-light">
                  Calculator accuracy is our top priority. We investigate every
                  report.
                </p>
              </div>

              <div className="rounded-xl border border-sandstone-dark/20 p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-eucalyptus-light/30 text-eucalyptus">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-semibold text-navy">
                  Feature Requests
                </h3>
                <a
                  href={`mailto:${SITE_CONFIG.email}?subject=Feature%20Request`}
                  className="text-eucalyptus hover:underline"
                >
                  {SITE_CONFIG.email}
                </a>
                <p className="mt-2 text-sm text-warmgray-light">
                  Want a new calculator or feature? Tell us what would help.
                </p>
              </div>
            </div>
          </section>

          {/* Important note */}
          <section aria-labelledby="important-note" className="mb-12">
            <h2
              id="important-note"
              className="mb-4 text-2xl font-bold text-navy"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              Important: We Don&apos;t Provide Tax Advice
            </h2>
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
              <p className="leading-relaxed text-amber-900">
                Pay Calculator Australia provides free calculators and
                educational content based on official ATO rates. We are{" "}
                <strong>not registered tax agents</strong> and cannot provide
                personal financial or tax advice. For advice specific to your
                situation, please consult a{" "}
                <a
                  href="https://www.tpb.gov.au/public-register"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-amber-800 underline hover:text-amber-900"
                >
                  registered tax agent
                </a>
                .
              </p>
            </div>
          </section>

          {/* For official enquiries */}
          <section aria-labelledby="official" className="mb-12">
            <h2
              id="official"
              className="mb-4 text-2xl font-bold text-navy"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              Official Tax & Employment Queries
            </h2>
            <p className="mb-4 leading-relaxed text-warmgray">
              For questions about your actual tax obligations, employment
              entitlements, or super, contact the relevant government body
              directly:
            </p>
            <ul className="space-y-2 text-warmgray">
              <li>
                <strong>Tax questions:</strong>{" "}
                <a
                  href="https://www.ato.gov.au/About-ATO/Contact-us/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-eucalyptus hover:underline"
                >
                  Australian Taxation Office
                </a>{" "}
                — 13 28 61
              </li>
              <li>
                <strong>Workplace rights:</strong>{" "}
                <a
                  href="https://www.fairwork.gov.au/about-us/contact-us"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-eucalyptus hover:underline"
                >
                  Fair Work Ombudsman
                </a>{" "}
                — 13 13 94
              </li>
              <li>
                <strong>Medicare &amp; Centrelink:</strong>{" "}
                <a
                  href="https://www.servicesaustralia.gov.au/contact-us"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-eucalyptus hover:underline"
                >
                  Services Australia
                </a>
              </li>
            </ul>
          </section>

          {/* CTA */}
          <div className="rounded-xl bg-sandstone p-6 text-center">
            <p className="mb-4 text-warmgray">
              Looking for a calculator instead?
            </p>
            <Link
              href="/"
              className="inline-block rounded-lg bg-eucalyptus-dark px-6 py-3 font-medium text-white shadow-md transition hover:bg-navy hover:shadow-lg"
            >
              Calculate Your Take-Home Pay →
            </Link>
          </div>
        </article>
      </div>
    </>
  );
}
