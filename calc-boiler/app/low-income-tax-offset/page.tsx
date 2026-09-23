import type { Metadata } from "next";
import LowIncomeTaxOffsetPage from "@/modules/guide/low-income-tax-offset";
import { LITO_FAQS, LITO_MID, NIL_NOW } from "@/modules/guide/low-income-tax-offset-faqs";
import { JsonLd } from "@/modules/seo/json-ld";
import type { Article, BreadcrumbList, FAQPage, WebPage, WithContext } from "schema-dts";
import { LITO, SITE_CONFIG, formatAUD } from "@/lib/constants";
import { AUTHORS, GUIDE_AUTHORSHIP } from "@/lib/authors";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/low-income-tax-offset/`;
const FY = SITE_CONFIG.financialYear;
const m = (n: number) => formatAUD(n);

// Targets "lito" (5.4k), "low income tax offset" (3.6k) and the calculator
// variants GSC already shows ("low income tax offset calculator", "lito
// calculator"). Answer-first: amount, both phase-out bands, cut-out.
const TITLE = `LITO Calculator ${FY}: Low Income Tax Offset (${m(LITO.maxOffset)} Max)`;
const DESCRIPTION = `The low income tax offset is ${m(LITO.maxOffset)} up to ${m(LITO.fullOffsetCeiling)}, ${m(LITO_MID)} at ${m(LITO.phaseOut1.end)} and nil at ${m(LITO.nilOffsetIncome)}. Work out your LITO for ${FY}, the tax it saves, and why you pay no tax up to ${m(NIL_NOW)}.`;

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
    { "@type": "ListItem", position: 2, name: "Tax Brackets", item: `${BASE}/tax-brackets/` },
    { "@type": "ListItem", position: 3, name: "Low Income Tax Offset", item: URL },
  ],
};

const webPage: WithContext<WebPage> = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: TITLE,
  url: URL,
  description: DESCRIPTION,
  inLanguage: "en-AU",
  publisher: { "@type": "Organization", name: SITE_CONFIG.name },
};

const article: WithContext<Article> = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: `Low Income Tax Offset (LITO) ${FY}`,
  description: DESCRIPTION,
  url: URL,
  datePublished: "2025-07-01",
  dateModified: GUIDE_AUTHORSHIP["low-income-tax-offset"].lastReviewed,
  author: AUTHORS["james-harrington"].jsonLd,
  publisher: { "@type": "Organization", name: SITE_CONFIG.name, logo: { "@type": "ImageObject", url: `${BASE}/icon-512.png` } },
  mainEntityOfPage: URL,
  inLanguage: "en-AU",
};

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: LITO_FAQS.map((f) => ({
    "@type": "Question" as const,
    name: f.q,
    acceptedAnswer: { "@type": "Answer" as const, text: f.a },
  })),
};

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, article, faq]} />
      <LowIncomeTaxOffsetPage />
    </>
  );
}
