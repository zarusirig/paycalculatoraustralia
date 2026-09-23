import type { Metadata } from "next";
import PrivateHealthInsuranceMedicarePage from "@/modules/guide/private-health-insurance-medicare";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, WebPage, Article, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { MLS_INCOME_YEAR } from "@/lib/constants/medicare-levy-surcharge";
import { AUTHORS } from "@/lib/authors";
import { faqPageSchema } from "@/lib/faq";
import { PHI_MEDICARE_FAQS } from "@/modules/guide/private-health-insurance-medicare-faqs";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/private-health-insurance-medicare/`;
// Retitled 23 Sep 2026 (W2): "Medicare levy surcharge" queries belong to
// /medicare-levy-surcharge-calculator/. This page owns the cover decision.
const TITLE = "Private Health Insurance vs the Surcharge: Is Hospital Cover Worth It?";
const DESCRIPTION = `Is private hospital cover cheaper than the Medicare levy surcharge? The ${MLS_INCOME_YEAR} surcharge and rebate tiers, how to find your break-even premium, and lifetime health cover loading.`;

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
    { "@type": "ListItem", position: 2, name: "Private Health Insurance & Medicare", item: URL },
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
  headline: TITLE,
  description: DESCRIPTION,
  author: AUTHORS["james-harrington"].jsonLd,
  publisher: { "@type": "Organization", name: SITE_CONFIG.name, logo: { "@type": "ImageObject", url: `${BASE}/icon-512.png` } },
  mainEntityOfPage: { "@type": "WebPage", "@id": URL },
};

const faq = faqPageSchema(PHI_MEDICARE_FAQS);

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, article, faq]} />
      <PrivateHealthInsuranceMedicarePage />
    </>
  );
}
