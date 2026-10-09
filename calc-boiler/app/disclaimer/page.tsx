import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, WebPage, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { withPageEnd } from "@/components/common/content-slots";
import { withFeaturedImage } from "@/lib/featured-image";
import FeaturedImage from "@/components/common/featured-image";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/disclaimer/`;
const TITLE = "Disclaimer — Pay Calculator Australia";
const DESCRIPTION =
  "Pay Calculator Australia gives general information and estimates only. It is not financial, tax, legal or employment advice.";

export const metadata: Metadata = withFeaturedImage({
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
});

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Disclaimer", item: URL },
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

function DisclaimerPage() {
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
              Disclaimer
            </li>
          </ol>
        </nav>

        <article>
          <header className="mb-10">
            <h1 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              Disclaimer
            </h1>
            <p className="mt-2 text-sm text-warmgray-light">
              Last updated:{" "}
              <time dateTime="2026-10-05">5 October 2026</time>
            </p>
            <p className="mt-4 text-lg leading-relaxed text-warmgray">
              {SITE_CONFIG.name} gives general information and estimates. Please
              read this before you rely on anything on this site.
            </p>
            <FeaturedImage className="mb-0 mt-6" />
          </header>

          <div className="mb-10 rounded-xl border border-amber-200 bg-amber-50 p-5">
            <p className="font-semibold text-amber-900">
              Nothing on this site is financial, tax, legal or employment
              advice. Our calculators give estimates only.
            </p>
          </div>

          <section aria-labelledby="general" className="mb-10">
            <h2
              id="general"
              className="mb-4 text-2xl font-bold text-navy"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              General information only
            </h2>
            <p className="mb-3 leading-relaxed text-warmgray">
              The calculators, guides and tables on this site are general information about Australian pay, tax, superannuation and government payments. They do not take your personal situation into account.
            </p>
            <p className="mb-3 leading-relaxed text-warmgray">
              Your real tax, pay or payment can differ from our estimate. Deductions, offsets, multiple employers, salary sacrifice, foreign income, private rulings and award or agreement terms can all change the result.
            </p>
          </section>

          <section aria-labelledby="professional-advice" className="mb-10">
            <h2
              id="professional-advice"
              className="mb-4 text-2xl font-bold text-navy"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              Get professional advice
            </h2>
            <p className="mb-3 leading-relaxed text-warmgray">
              Before you make a financial, tax or employment decision, check the result with a registered tax agent, accountant or financial adviser, or with the ATO, Fair Work Ombudsman or Services Australia.
            </p>
            <p className="mb-3 leading-relaxed text-warmgray">
              We are not registered tax agents or licensed financial advisers, and this site does not provide a tax agent service or financial product advice.
            </p>
          </section>

          <section aria-labelledby="accuracy" className="mb-10">
            <h2
              id="accuracy"
              className="mb-4 text-2xl font-bold text-navy"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              Accuracy and rate changes
            </h2>
            <p className="mb-3 leading-relaxed text-warmgray">
              We aim to use current rates from the ATO, Fair Work Commission and Services Australia, and we update them when they change. Rates, thresholds and laws change often, and some changes take effect before we can update the site. We do not promise that every figure is current, complete or error-free.
            </p>
            <p className="mb-3 leading-relaxed text-warmgray">
              If you find a mistake, please tell us on the contact page and we will check it.
            </p>
          </section>

          <section aria-labelledby="government" className="mb-10">
            <h2
              id="government"
              className="mb-4 text-2xl font-bold text-navy"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              No government affiliation
            </h2>
            <p className="mb-3 leading-relaxed text-warmgray">
              Pay Calculator Australia is an independent website. We are not part of, or endorsed by, the ATO, Fair Work Commission, Fair Work Ombudsman, Services Australia or any other government body.
            </p>
          </section>

          <section aria-labelledby="liability" className="mb-10">
            <h2
              id="liability"
              className="mb-4 text-2xl font-bold text-navy"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              Liability and external links
            </h2>
            <p className="mb-3 leading-relaxed text-warmgray">
              To the extent the law allows, we are not responsible for loss or damage that results from using the information on this site. Links to other sites are for your convenience. We do not control those sites and are not responsible for their content.
            </p>
            <p className="mb-3 leading-relaxed text-warmgray">
              This site shows advertising. Ads are labelled, and they do not affect our calculator results. See our Privacy Policy for how advertising cookies work.
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

export default withPageEnd(DisclaimerPage, "/disclaimer/");
