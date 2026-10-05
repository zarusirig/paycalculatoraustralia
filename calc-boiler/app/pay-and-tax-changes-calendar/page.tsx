// Linkable asset: dated "what changes and when" calendar with an .ics download.
// Content in modules/guide/pay-and-tax-changes-calendar.tsx, data in
// lib/constants/pay-tax-changes-calendar.ts, .ics in ./pay-and-tax-changes-2026-27.ics/route.ts.
import type { Metadata } from "next";
import PayAndTaxChangesCalendar, { CHANGES_SOURCE_LINKS } from "@/modules/guide/pay-and-tax-changes-calendar";
import { CHANGES_CALENDAR_FAQS } from "@/modules/guide/pay-and-tax-changes-calendar-faqs";
import { JsonLd } from "@/modules/seo/json-ld";
import type { Article, BreadcrumbList, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS } from "@/lib/authors";
import { CHANGES_CALENDAR } from "@/lib/constants/pay-tax-changes-calendar";
import { faqPageSchema } from "@/lib/faq";
import { withPageEnd } from "@/components/common/content-slots";

const BASE = SITE_CONFIG.baseUrl;
const TITLE = "What Changes and When: Australian Pay and Tax Dates 2026-27";
const DESCRIPTION =
  "What changed on 1 July 2026, what changes on 1 December 2026 (junior award phase-in), what does not change on 1 January 2027, and what is legislated for 1 July 2027. Sourced to the ATO and Fair Work Commission, with a calendar download.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: CHANGES_CALENDAR.url },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: CHANGES_CALENDAR.url,
    siteName: SITE_CONFIG.name,
    type: "article",
    locale: "en_AU",
    publishedTime: CHANGES_CALENDAR.publishedIso,
    modifiedTime: CHANGES_CALENDAR.updatedIso,
    images: ["/og-image.png"],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: CHANGES_CALENDAR.title, item: CHANGES_CALENDAR.url },
  ],
};

const article: WithContext<Article> = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: TITLE,
  description: DESCRIPTION,
  datePublished: CHANGES_CALENDAR.publishedIso,
  dateModified: CHANGES_CALENDAR.updatedIso,
  inLanguage: "en-AU",
  author: AUTHORS["anita-bell"].jsonLd,
  publisher: { "@type": "Organization", name: SITE_CONFIG.name, logo: { "@type": "ImageObject", url: `${BASE}/favicon.ico` } },
  mainEntityOfPage: { "@type": "WebPage", "@id": CHANGES_CALENDAR.url },
  citation: CHANGES_SOURCE_LINKS.map((s) => s.url),
};

function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, article, faqPageSchema(CHANGES_CALENDAR_FAQS)]} />
      <PayAndTaxChangesCalendar />
    </>
  );
}

export default withPageEnd(Page, "/pay-and-tax-changes-calendar/");
