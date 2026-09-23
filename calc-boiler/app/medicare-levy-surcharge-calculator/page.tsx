import type { Metadata } from "next";
import MedicareLevySurchargePage from "@/modules/guide/medicare-levy-surcharge";
import { MLS_FAQS } from "@/modules/guide/medicare-levy-surcharge-faqs";
import { JsonLd } from "@/modules/seo/json-ld";
import type { Article, BreadcrumbList, FAQPage, WebApplication, WebPage, WithContext } from "schema-dts";
import { MEDICARE_LEVY, SITE_CONFIG, formatAUD } from "@/lib/constants";
import { MLS_INCOME_YEAR, familyBaseThreshold } from "@/lib/constants/medicare-levy-surcharge";
import { AUTHORS, GUIDE_AUTHORSHIP } from "@/lib/authors";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/medicare-levy-surcharge-calculator/`;
const SINGLE = formatAUD(MEDICARE_LEVY.surcharge.tier1.min - 1);
const FAMILY = formatAUD(familyBaseThreshold(0));

// Canonical page for "medicare levy surcharge" intent. /medicare-levy/ owns the
// 2% levy itself and links here for the surcharge.
const TITLE = `Medicare Levy Surcharge Calculator ${MLS_INCOME_YEAR}: Thresholds & Rates`;
const DESCRIPTION = `Medicare levy surcharge calculator for ${MLS_INCOME_YEAR}: 1% to 1.5% above ${SINGLE} (singles) or ${FAMILY} (families) without hospital cover. Income for MLS purposes, family and child thresholds, and whether cover is cheaper than the surcharge.`;
const LAST = GUIDE_AUTHORSHIP["medicare-levy-surcharge-calculator"].lastReviewed;

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
    { "@type": "ListItem", position: 2, name: "Medicare Levy", item: `${BASE}/medicare-levy/` },
    { "@type": "ListItem", position: 3, name: "Medicare Levy Surcharge Calculator", item: URL },
  ],
};

const webPage: WithContext<WebPage> = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: TITLE,
  description: DESCRIPTION,
  url: URL,
  inLanguage: "en-AU",
  publisher: { "@type": "Organization", name: SITE_CONFIG.name },
};

const webApp: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Medicare Levy Surcharge Calculator",
  description: `Works out the Medicare levy surcharge from income for MLS purposes using the ATO's ${MLS_INCOME_YEAR} tiers, including family thresholds, part-year hospital cover and a comparison with private hospital cover after the rebate.`,
  url: URL,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
  creator: { "@type": "Organization", name: SITE_CONFIG.name },
  dateModified: LAST,
  inLanguage: "en-AU",
};

const article: WithContext<Article> = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: `Medicare Levy Surcharge ${MLS_INCOME_YEAR}: Thresholds, Rates and Calculator`,
  description: DESCRIPTION,
  url: URL,
  datePublished: "2026-09-23",
  dateModified: LAST,
  author: AUTHORS["james-harrington"].jsonLd,
  publisher: {
    "@type": "Organization",
    name: SITE_CONFIG.name,
    logo: { "@type": "ImageObject", url: `${BASE}/icon-512.png` },
  },
  mainEntityOfPage: URL,
  inLanguage: "en-AU",
};

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: MLS_FAQS.map((f) => ({
    "@type": "Question" as const,
    name: f.q,
    acceptedAnswer: { "@type": "Answer" as const, text: f.a },
  })),
};

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, webApp, article, faq]} />
      <MedicareLevySurchargePage />
    </>
  );
}
