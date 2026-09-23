import type { Metadata } from "next";
import AwardRatesGuidePage from "@/modules/guide/award-rates";
import { JsonLd } from "@/modules/seo/json-ld";
import type { Article, BreadcrumbList, FAQPage, ItemList, WebPage, WithContext } from "schema-dts";
import { SITE_CONFIG, EMPLOYMENT, formatAUD } from "@/lib/constants";
import { AUTHORS, GUIDE_AUTHORSHIP } from "@/lib/authors";
import { AWARD_DIRECTORY } from "@/lib/constants/award-directory";
import { AWARD_HUB_FAQS } from "@/modules/guide/award-rates-faqs";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/award-rates/`;
const low = Math.min(...AWARD_DIRECTORY.map((a) => a.headlineHourly));
const high = Math.max(...AWARD_DIRECTORY.map((a) => a.headlineHourly));

const TITLE = `Award Rates ${SITE_CONFIG.financialYear} — A–Z Pay Rates for ${AWARD_DIRECTORY.length} Modern Awards`;
const DESCRIPTION = `Current award rates in Australia from 1 July 2026: Level 1 pay ${formatAUD(low, 2)}–${formatAUD(high, 2)}/hr across the fast food, retail, hospitality, pharmacy, manufacturing, clerks, security and SCHADS awards, with casual, penalty and junior rates. National minimum wage ${formatAUD(EMPLOYMENT.minimumWageHourly, 2)}/hr.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: SITE_CONFIG.name, type: "article", locale: "en_AU" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Award Rates", item: URL },
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

const article: WithContext<Article> = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: TITLE,
  description: DESCRIPTION,
  author: AUTHORS[GUIDE_AUTHORSHIP["award-rates"].authorId].jsonLd,
  publisher: { "@type": "Organization", name: SITE_CONFIG.name, logo: { "@type": "ImageObject", url: `${BASE}/icon-512.png` } },
  mainEntityOfPage: { "@type": "WebPage", "@id": URL },
  isBasedOn: { "@type": "Legislation", name: "Fair Work Act 2009", url: "https://www.legislation.gov.au/Details/C2024C00301" },
};

const itemList: WithContext<ItemList> = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Modern award pay rates A–Z",
  itemListOrder: "https://schema.org/ItemListOrderAscending",
  numberOfItems: AWARD_DIRECTORY.length,
  itemListElement: AWARD_DIRECTORY.map((a, i) => ({
    "@type": "ListItem" as const,
    position: i + 1,
    name: `${a.name} (${a.code})`,
    url: `${BASE}${a.href}`,
  })),
};

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: AWARD_HUB_FAQS.map((f) => ({
    "@type": "Question" as const,
    name: f.q,
    acceptedAnswer: { "@type": "Answer" as const, text: f.a },
  })),
};

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, article, itemList, faq]} />
      <AwardRatesGuidePage />
    </>
  );
}
