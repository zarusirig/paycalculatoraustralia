// JSON-LD + metadata builder for the W3 Centrelink pages. Server-side only
// (imported by app/<route>/page.tsx). FAQ JSON-LD is built from the same array
// the page renders.
import type { Metadata } from "next";
import type { Thing, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { ORGANIZATION_SCHEMA } from "@/lib/schema";
import type { W3Faq } from "@/modules/calculator/centrelink-w3-faqs";

const BASE = SITE_CONFIG.baseUrl;

export function w3Metadata(slug: string, title: string, description: string): Metadata {
  const url = `${BASE}/${slug}/`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export function w3Schema(opts: { slug: string; name: string; description: string; faqs: readonly W3Faq[]; calculator: boolean; dateModified: string }) {
  const url = `${BASE}/${opts.slug}/`;
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
      { "@type": "ListItem", position: 2, name: "Centrelink Income Test", item: `${BASE}/centrelink-income-test/` },
      { "@type": "ListItem", position: 3, name: opts.name, item: url },
    ],
  };
  const main = opts.calculator
    ? {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: opts.name,
        url,
        description: opts.description,
        applicationCategory: "FinanceApplication",
        operatingSystem: "Web",
        browserRequirements: "Requires JavaScript",
        offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
        creator: { "@type": "Organization", name: SITE_CONFIG.name },
        dateModified: opts.dateModified,
        inLanguage: "en-AU",
      }
    : {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: opts.name,
        url,
        description: opts.description,
        dateModified: opts.dateModified,
        inLanguage: "en-AU",
        publisher: { "@type": "Organization", name: SITE_CONFIG.name },
      };
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: opts.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return [breadcrumb, main, faq, ORGANIZATION_SCHEMA] as unknown as WithContext<Thing>[];
}
