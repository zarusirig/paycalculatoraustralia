// F8 (Lever D): instructions page for the embeddable take-home pay widget.
// Indexable. The widget itself (/embed/take-home-pay/) is noindex and served
// by app/embed/take-home-pay/index.html/route.ts.
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, WebPage, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { EMBED_DATA } from "@/lib/embed/take-home-engine";
import { EMBED_DEFAULT_HEIGHT, EMBED_PATH, EMBED_URL, autoResizeSnippet, embedCode } from "@/lib/embed/take-home-widget-html";
import CopySnippet from "@/modules/guide/copy-snippet";
import { withPageEnd } from "@/components/common/content-slots";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/embed/`;
const TITLE = "Free Take-Home Pay Calculator Widget for Your Website";
const DESCRIPTION = `Embed a free Australian take-home pay calculator on your website or blog. ${EMBED_DATA.fy} ATO rates, HECS and super options, updated automatically. One line of code.`;
const HEADING_FONT = { fontFamily: "'Bricolage Grotesque', sans-serif" } as const;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU", images: ["/og-image.png"] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Embed the Calculator", item: URL },
  ],
};

const webPage: WithContext<WebPage> = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: TITLE,
  description: DESCRIPTION,
  url: URL,
  inLanguage: "en-AU",
  isPartOf: { "@type": "WebSite", name: SITE_CONFIG.name, url: BASE },
};

function EmbedPage() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage]} />
      <div className="min-h-screen flex-grow bg-white">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <nav aria-label="breadcrumb" className="mb-6">
            <ol className="flex items-center space-x-1 text-sm text-warmgray">
              <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
              <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
              <li><span className="font-medium text-navy" aria-current="page">Embed the Calculator</span></li>
            </ol>
          </nav>

          <article className="prose prose-lg prose-blue max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark">
            <h1 className="text-4xl font-extrabold leading-tight md:text-5xl" style={HEADING_FONT}>
              Add a free take-home pay calculator to your website
            </h1>
            <p className="lead text-warmgray">
              A small, fast Australian take-home pay calculator you can put on any page with one line of code. It uses the same{" "}
              {EMBED_DATA.fy} ATO tax engine as our <Link href="/take-home-pay-calculator/">take-home pay calculator</Link>, updates
              itself when rates change, and carries no ads, cookies or tracking.
            </p>

            <h2 style={HEADING_FONT}>Preview</h2>
            <div className="not-prose">
              {/* Relative src so the preview works on every environment; the copy-paste code below uses the absolute URL. */}
              <iframe
                src={`${EMBED_PATH}index.html`}
                title="Australian take-home pay calculator (preview)"
                width="100%"
                height={EMBED_DEFAULT_HEIGHT}
                loading="lazy"
                className="w-full max-w-[640px] border-0"
              />
            </div>

            <h2 style={HEADING_FONT}>Copy the code</h2>
            <p>Paste this where you want the calculator to appear. It works in WordPress (Custom HTML block), Squarespace, Wix, Webflow, Ghost, SharePoint and plain HTML.</p>
            <CopySnippet id="embed-code" label="Embed code" text={embedCode()} />
            <p>To open the calculator with a salary already filled in — for example on a job ad or a pay-scale page — add it to the address:</p>
            <CopySnippet id="embed-code-salary" label="Embed code with a starting salary of $90,000" text={embedCode({ salary: 90000 })} />

            <h3 style={HEADING_FONT}>Options</h3>
            <ul>
              <li><code>?salary=85000</code> — starting amount.</li>
              <li><code>?period=52</code> — starting pay period: <code>1</code> year, <code>12</code> month, <code>26</code> fortnight, <code>52</code> week, <code>h</code> hour.</li>
              <li><code>?theme=dark</code> or <code>?theme=light</code> — force a colour scheme (it follows the visitor&apos;s system setting by default).</li>
            </ul>
            <p>Combine options with <code>&amp;</code>, e.g. <code>{`${EMBED_URL}?salary=32&period=h`}</code>.</p>

            <h3 style={HEADING_FONT}>Optional: resize to fit</h3>
            <p>
              The iframe is {EMBED_DEFAULT_HEIGHT}px tall, which fits the calculator on phones and desktops. If you would rather it
              resize itself exactly, add this script once anywhere on the page:
            </p>
            <CopySnippet id="embed-resize" label="Auto-resize script (optional)" text={autoResizeSnippet()} />

            <h2 style={HEADING_FONT}>Terms of use</h2>
            <ul>
              <li>Free for any website, including commercial, government, union, school and university sites.</li>
              <li>Keep the credit line under the calculator visible and linked. That link is the only thing we ask for.</li>
              <li>Don&apos;t alter the calculator or present it as your own work.</li>
              <li>Results are estimates for Australian residents and not tax advice. We keep the rates current, but we can&apos;t guarantee them for any individual&apos;s situation.</li>
            </ul>

            <h2 style={HEADING_FONT}>What the widget calculates</h2>
            <p>
              Income tax on the {EMBED_DATA.fy} resident scale, the low income tax offset, the 2% Medicare levy with low-income
              shading, optional HECS/HELP repayment, and employer super at {EMBED_DATA.sg.rate * 100}% (on top of salary, or taken out
              of a super-inclusive package). It assumes no Medicare levy surcharge, no salary sacrifice and no other offsets. For
              those, send visitors to the <Link href="/take-home-pay-calculator/">full calculator</Link>.
            </p>
            <p>
              Writing about pay? The <Link href="/australian-pay-report-2026/">Australian Pay Report 2026</Link> has citable tables and
              CSV downloads.
            </p>
            <p className="text-sm text-warmgray">
              Questions or a custom version for your organisation: <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a>.
            </p>
          </article>
        </div>
      </div>
    </>
  );
}

export default withPageEnd(EmbedPage, "/embed/");
