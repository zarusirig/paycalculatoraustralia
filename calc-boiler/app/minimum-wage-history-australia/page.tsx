import type { Metadata } from "next";
import MinimumWageHistoryPage from "@/modules/guide/minimum-wage-history-australia";
import { HISTORY_FAQS, HISTORY_FIRST, HISTORY_LARGEST, HISTORY_LAST, TOTAL_GROWTH } from "@/modules/guide/minimum-wage-history-faqs";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebPage, Article, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS } from "@/lib/authors";
import { pageDateModified, pageDatePublished } from "@/lib/page-dates";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/minimum-wage-history-australia/`;

// History intent only (23 Sep 2026). Current-rate queries ("what is the
// minimum wage in australia", "minimum wage australia 2026") belong to
// /minimum-wage-australia/, so the title leads with "History" and the year
// range rather than today's dollar figure.
const TITLE = `Minimum Wage History Australia: Every Increase ${HISTORY_FIRST.fy.slice(0, 4)}–${HISTORY_LAST.fy.slice(0, 4)}`;
const DESCRIPTION = `History of Australia's National Minimum Wage since ${HISTORY_FIRST.fy.slice(0, 4)}: hourly and weekly rates, every Annual Wage Review increase (largest ${HISTORY_LARGEST.published} in ${HISTORY_LARGEST.operativeFrom.slice(-4)}) and ${(TOTAL_GROWTH * 100).toFixed(0)}% total growth.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: SITE_CONFIG.name, type: "article", locale: "en_AU", images: ["/og-image.png"] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Minimum Wage Australia", item: `${BASE}/minimum-wage-australia/` },
    { "@type": "ListItem", position: 3, name: "Minimum Wage History", item: URL },
  ]
};

const webPage: WithContext<WebPage> = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: TITLE,
  url: URL,
  description: DESCRIPTION,
  publisher: { "@type": "Organization", name: SITE_CONFIG.name },
};

const article: WithContext<Article> = {
  "@context": "https://schema.org",
  "@type": "Article",
  datePublished: pageDatePublished("minimum-wage-history-australia"),
  dateModified: pageDateModified("minimum-wage-history-australia"),
  headline: TITLE,
  description: DESCRIPTION,
  author: AUTHORS["penny-ward"].jsonLd,
  publisher: { "@type": "Organization", name: SITE_CONFIG.name, logo: { "@type": "ImageObject", url: `${BASE}/icon-512.png` } },
  mainEntityOfPage: { "@type": "WebPage", "@id": URL },
};

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: HISTORY_FAQS.map((f) => ({
    "@type": "Question" as const,
    name: f.q,
    acceptedAnswer: { "@type": "Answer" as const, text: f.a },
  })),
};

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, article, faq]} />
      <MinimumWageHistoryPage />
    </>
  );
}
