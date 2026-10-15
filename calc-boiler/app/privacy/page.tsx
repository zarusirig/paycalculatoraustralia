import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, WebPage, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { withPageEnd } from "@/components/common/content-slots";
import { withFeaturedImage } from "@/lib/featured-image";
import FeaturedImage from "@/components/common/featured-image";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/privacy/`;
const TITLE = "Privacy Policy — Pay Calculator Australia";
const DESCRIPTION =
  "How Pay Calculator Australia handles your data. All calculations happen in your browser — we don't collect, store, or transmit your salary information.";

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

function PrivacyPage() {
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
              <time dateTime="2026-10-16">16 October 2026</time>
            </p>
            <p className="mt-4 text-lg leading-relaxed text-warmgray">
              Your privacy matters. Here&apos;s exactly how{" "}
              {SITE_CONFIG.name} handles your data — in plain English,
              not legal jargon.
            </p>
            <FeaturedImage className="mb-0 mt-6" />
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
              We use cookies for analytics (Google Analytics) and, where
              advertising is shown, for serving and measuring ads (see
              Advertising below). Cookies are small text files stored on your
              device.
            </p>
            <p className="leading-relaxed text-warmgray">
              You can control or delete cookies through your browser settings. Our
              calculators will continue to work normally without cookies enabled.
            </p>
          </section>

          {/* Advertising */}
          <section aria-labelledby="advertising" className="mb-10">
            <h2
              id="advertising"
              className="mb-4 text-2xl font-bold text-navy"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              Advertising
            </h2>
            <p className="mb-3 leading-relaxed text-warmgray">
              This site is free because it shows advertising. Third-party
              vendors, including Google, use cookies to serve ads based on your
              prior visits to this website or other websites.
            </p>
            <p className="mb-3 leading-relaxed text-warmgray">
              Google&apos;s use of advertising cookies enables it and its
              partners to serve ads to you based on your visit to this site
              and/or other sites on the internet.
            </p>
            <p className="mb-3 leading-relaxed text-warmgray">
              You can opt out of personalised advertising by visiting{" "}
              <a
                href="https://adssettings.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-eucalyptus hover:underline"
              >
                Google Ads Settings
              </a>
              . You can also opt out of some third-party vendors&apos; use of
              cookies for personalised advertising at{" "}
              <a
                href="https://www.aboutads.info"
                target="_blank"
                rel="noopener noreferrer"
                className="text-eucalyptus hover:underline"
              >
                aboutads.info
              </a>
              .
            </p>
            <p className="leading-relaxed text-warmgray">
              Our ad partners may include Google AdSense and Mediavine. They
              may collect cookie identifiers and device information to show and
              measure ads. We never give them your salary inputs or calculation
              results, which stay in your browser.
            </p>
          </section>

          {/* Mediavine required language (Ver 1.1, help.mediavine.com/privacy-policy-language). Keep verbatim: their dashboard health check matches it. */}
          <section aria-labelledby="mediavine" className="mb-10 space-y-3 leading-relaxed text-warmgray [&_a]:text-eucalyptus [&_a:hover]:underline [&_ul]:list-disc [&_ul]:pl-6">
            <h3 id="mediavine" className="text-xl font-bold text-navy">Mediavine Programmatic Advertising (Ver 1.1)</h3>
            <p>The Website works with Mediavine to manage third-party interest-based advertising appearing on the Website. Mediavine serves content and advertisements when you visit the Website, which may use first and third-party cookies. A cookie is a small text file which is sent to your computer or mobile device (referred to in this policy as a “device”) by the web server so that a website can remember some information about your browsing activity on the Website.</p>
            <p>First party cookies are created by the website that you are visiting. A third-party cookie is frequently used in behavioral advertising and analytics and is created by a domain other than the website you are visiting. Third-party cookies, tags, pixels, beacons and other similar technologies (collectively, “Tags”) may be placed on the Website to monitor interaction with advertising content and to target and optimize advertising. Each internet browser has functionality so that you can block both first and third-party cookies and clear your browser’s cache. The &quot;help&quot; feature of the menu bar on most browsers will tell you how to stop accepting new cookies, how to receive notification of new cookies, how to disable existing cookies and how to clear your browser’s cache. For more information about cookies and how to disable them, you can consult the information at <a href="https://www.allaboutcookies.org/manage-cookies/" target="_blank" rel="noreferrer noopener nofollow">All About Cookies</a>.</p>
            <p>Without cookies you may not be able to take full advantage of the Website content and features. Please note that rejecting cookies does not mean that you will no longer see ads when you visit our Site. In the event you opt-out, you will still see non-personalized advertisements on the Website.</p>
            <p>The Website collects the following data using a cookie when serving personalized ads:</p>
            <ul><li>IP Address</li><li>Operating System type</li><li>Operating System version</li><li>Device Type</li><li>Language of the website</li><li>Web browser type</li><li>Email (in hashed form)</li></ul>
            <p>Mediavine Partners (companies listed below with whom Mediavine shares data) may also use this data to link to other end user information the partner has independently collected to deliver targeted advertisements. Mediavine Partners may also separately collect data about end users from other sources, such as advertising IDs or pixels, and link that data to data collected from Mediavine publishers in order to provide interest-based advertising across your online experience, including devices, browsers and apps. This data includes usage data, cookie information, device information, information about interactions between users and advertisements and websites, geolocation data, traffic data, and information about a visitor’s referral source to a particular website. Mediavine Partners may also create unique IDs to create audience segments, which are used to provide targeted advertising.</p>
            <p>If you would like more information about this practice and to know your choices to opt-in or opt-out of this data collection, please visit <a href="https://thenai.org/opt-out/" target="_blank" rel="noreferrer noopener nofollow">National Advertising Initiative opt out page</a>. You may also visit <a href="http://optout.aboutads.info/#/" target="_blank" rel="noreferrer noopener nofollow">Digital Advertising Alliance website</a> and <a href="http://optout.networkadvertising.org/#" target="_blank" rel="noreferrer noopener nofollow">Network Advertising Initiative website</a> to learn more information about interest-based advertising. You may download the AppChoices app at <a href="https://youradchoices.com/appchoices" target="_blank" rel="noreferrer noopener nofollow">Digital Advertising Alliance’s AppChoices app</a> to opt out in connection with mobile apps, or use the platform controls on your mobile device to opt out.</p>
            <p>For specific information about Mediavine Partners, the data each collects and their data collection and privacy policies, please visit <a href="https://www.mediavine.com/ad-partners/" target="_blank" rel="noreferrer noopener nofollow">Mediavine Partners</a>.</p>
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
                  <strong>Google Firebase Hosting and Cloudflare</strong> —
                  website hosting and content delivery
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-warmgray-light" />
                <span>
                  <strong>Google AdSense and Mediavine</strong> — advertising
                  (see Advertising above)
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
              do not give advertisers or data brokers your salary inputs or
              calculation results. Our advertising partners collect cookie and
              device data as described under Advertising above.
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

export default withPageEnd(PrivacyPage, "/privacy/");
