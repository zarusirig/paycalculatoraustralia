// Metadata and JSON-LD for the data-driven award pages. Title, description,
// Article, Breadcrumb, FAQPage and the pay table's Dataset all read from the
// same copy and constants the page renders, so none of them can drift.

import type { Metadata } from "next";
import type { Article, BreadcrumbList, Dataset, FAQPage, WebPage, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS } from "@/lib/authors";
import { MODERN_AWARDS, type ModernAwardKey } from "@/lib/constants/modern-awards";
import { getAwardPageCopy } from "@/modules/guide/modern-award-content";

const BASE = SITE_CONFIG.baseUrl;

export function buildAwardMetadata(key: ModernAwardKey): Metadata {
  const award = MODERN_AWARDS[key];
  const copy = getAwardPageCopy(key);
  const url = `${BASE}${award.meta.href}`;
  return {
    title: copy.title,
    description: copy.description,
    alternates: { canonical: url },
    openGraph: {
      title: copy.title,
      description: `All ${award.meta.code} classification rates, penalties, junior rates and allowances, operative ${award.meta.operativeFrom}.`,
      url,
      siteName: SITE_CONFIG.name,
      type: "article",
      locale: "en_AU",
      images: ["/og-image.png"],
    },
    twitter: { card: "summary_large_image", title: copy.title, description: copy.description },
  };
}

export function buildAwardJsonLd(key: ModernAwardKey) {
  const award = MODERN_AWARDS[key];
  const copy = getAwardPageCopy(key);
  const url = `${BASE}${award.meta.href}`;

  const breadcrumb: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
      { "@type": "ListItem", position: 2, name: "Award Rates", item: `${BASE}/award-rates/` },
      { "@type": "ListItem", position: 3, name: copy.crumb, item: url },
    ],
  };

  const webPage: WithContext<WebPage> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: copy.title,
    url,
    description: copy.description,
    publisher: { "@type": "Organization", name: SITE_CONFIG.name },
  };

  const article: WithContext<Article> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: copy.title,
    image: `${BASE}/og-image.png`,
    description: copy.description,
    author: AUTHORS["penny-ward"].jsonLd,
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      logo: { "@type": "ImageObject", url: `${BASE}/icon-512.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    isBasedOn: {
      "@type": "Legislation",
      name: `${award.meta.name} (${award.meta.code})`,
      url: award.meta.awardTextUrl,
    },
  };

  const dataset: WithContext<Dataset> = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `${award.meta.name} minimum pay rates ${SITE_CONFIG.financialYear}`,
    description: `Minimum weekly and hourly rates for every classification in the ${award.meta.name} (${award.meta.code}), operative from the first full pay period on or after ${award.meta.operativeFrom}, with casual, penalty and overtime rates.`,
    url,
    temporalCoverage: "2026-07-01/2027-06-30",
    spatialCoverage: { "@type": "Country", name: "Australia" },
    isBasedOn: award.meta.awardTextUrl,
    creator: { "@type": "Organization", name: SITE_CONFIG.name },
  };

  const faq: WithContext<FAQPage> = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: copy.faqs.map((f) => ({
      "@type": "Question" as const,
      name: f.q,
      acceptedAnswer: { "@type": "Answer" as const, text: f.a },
    })),
  };

  return [breadcrumb, webPage, article, dataset, faq];
}
