import type { Metadata } from "next";
import type { Article, BreadcrumbList, FAQPage, WebPage, WithContext } from "schema-dts";
import HospitalityAwardRatesPage from "@/modules/guide/hospitality-award-rates";
import { HOSPITALITY_FAQS, findRate } from "@/modules/guide/hospitality-award-faqs";
import { JsonLd } from "@/modules/seo/json-ld";
import { SITE_CONFIG, formatAUD } from "@/lib/constants";
import { AUTHORS } from "@/lib/authors";
import { HOSPITALITY_AWARD, HOSPITALITY_RATES } from "@/lib/constants/hospitality-award";
import { pageDateModified, pageDatePublished } from "@/lib/page-dates";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/hospitality-award-rates/`;

// Derived from the constants so title, description, JSON-LD and page agree.
const L1 = findRate(HOSPITALITY_RATES, "Level 1");
const L6 = findRate(HOSPITALITY_RATES, "Level 6");

const TITLE = `Hospitality Award Pay Rates ${SITE_CONFIG.financialYear} (${HOSPITALITY_AWARD.code}) — Penalty Rates`;
const DESCRIPTION = `Current ${HOSPITALITY_AWARD.code} pay rates from ${HOSPITALITY_AWARD.operativeFrom}: Level 1 ${formatAUD(L1.hourly, 2)}/hr up to ${formatAUD(L6.hourly, 2)} at Level 6, plus casual, weekend, public holiday, overtime and junior rates.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: `All ${HOSPITALITY_AWARD.code} classification rates, penalties and junior scales, operative ${HOSPITALITY_AWARD.operativeFrom}.`,
    url: URL,
    siteName: SITE_CONFIG.name,
    type: "article",
    locale: "en_AU",
    images: ["/og-image.png"],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Award Rates", item: `${BASE}/award-rates/` },
    { "@type": "ListItem", position: 3, name: "Hospitality Award Rates", item: URL },
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
  datePublished: pageDatePublished("hospitality-award-rates"),
  dateModified: pageDateModified("hospitality-award-rates"),
  headline: TITLE,
  description: DESCRIPTION,
  author: AUTHORS["penny-ward"].jsonLd,
  publisher: {
    "@type": "Organization",
    name: SITE_CONFIG.name,
    logo: { "@type": "ImageObject", url: `${BASE}/icon-512.png` },
  },
  mainEntityOfPage: { "@type": "WebPage", "@id": URL },
  isBasedOn: {
    "@type": "Legislation",
    name: `${HOSPITALITY_AWARD.name} (${HOSPITALITY_AWARD.code})`,
    url: HOSPITALITY_AWARD.awardTextUrl,
  },
};

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: HOSPITALITY_FAQS.map((f) => ({
    "@type": "Question" as const,
    name: f.q,
    acceptedAnswer: { "@type": "Answer" as const, text: f.a },
  })),
};

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, article, faq]} />
      <HospitalityAwardRatesPage />
    </>
  );
}
