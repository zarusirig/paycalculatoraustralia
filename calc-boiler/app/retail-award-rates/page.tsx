import type { Metadata } from "next";
import type { Article, BreadcrumbList, FAQPage, WebPage, WithContext } from "schema-dts";
import RetailAwardRatesPage from "@/modules/guide/retail-award-rates";
import { RETAIL_FAQS } from "@/modules/guide/retail-award-faqs";
import { findRate } from "@/modules/guide/hospitality-award-faqs";
import { JsonLd } from "@/modules/seo/json-ld";
import { SITE_CONFIG, formatAUD } from "@/lib/constants";
import { AUTHORS } from "@/lib/authors";
import { RETAIL_AWARD, RETAIL_RATES } from "@/lib/constants/hospitality-award";
import { casualHourly } from "@/modules/guide/hospitality-award-faqs";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/retail-award-rates/`;

const L1 = findRate(RETAIL_RATES, "Level 1");
const L8 = findRate(RETAIL_RATES, "Level 8");

const TITLE = `Retail Award Rates ${SITE_CONFIG.financialYear} — Pay by Level & Penalty Rates`;
const DESCRIPTION = `Current ${RETAIL_AWARD.code} pay rates from ${RETAIL_AWARD.operativeFrom}: level 1 ${formatAUD(L1.hourly, 2)}/hr up to ${formatAUD(L8.hourly, 2)} at level 8, casual ${formatAUD(casualHourly(L1.hourly, RETAIL_AWARD.casualLoading), 2)}. Weekend, evening and public holiday penalties, overtime with the casual loading included, and junior rates by age.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: `All ${RETAIL_AWARD.code} classification rates, penalties and junior scales, operative ${RETAIL_AWARD.operativeFrom}.`,
    url: URL,
    siteName: SITE_CONFIG.name,
    type: "article",
    locale: "en_AU",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Award Rates", item: `${BASE}/award-rates/` },
    { "@type": "ListItem", position: 3, name: "Retail Award Rates", item: URL },
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
  author: AUTHORS["penny-ward"].jsonLd,
  publisher: {
    "@type": "Organization",
    name: SITE_CONFIG.name,
    logo: { "@type": "ImageObject", url: `${BASE}/favicon.ico` },
  },
  mainEntityOfPage: { "@type": "WebPage", "@id": URL },
  isBasedOn: {
    "@type": "Legislation",
    name: `${RETAIL_AWARD.name} (${RETAIL_AWARD.code})`,
    url: RETAIL_AWARD.awardTextUrl,
  },
};

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: RETAIL_FAQS.map((f) => ({
    "@type": "Question" as const,
    name: f.q,
    acceptedAnswer: { "@type": "Answer" as const, text: f.a },
  })),
};

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, article, faq]} />
      <RetailAwardRatesPage />
    </>
  );
}
