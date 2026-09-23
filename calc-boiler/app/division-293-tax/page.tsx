import type { Metadata } from "next";
import Division293TaxPage from "@/modules/guide/division-293-tax";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, WebPage, Article, WithContext } from "schema-dts";
import { faqPageSchema } from "@/lib/faq";
import { DIVISION_293_FAQS } from "@/modules/guide/division-293-tax-faqs";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS } from "@/lib/authors";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/division-293-tax/`;
const TITLE = "Division 293 Tax — The Extra 15% Super Tax for High Earners";
const DESCRIPTION = "Division 293 tax: the extra 15% tax on super contributions for income over $250K. Who pays it, how it's calculated, how to pay, and strategies to manage it.";

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
    { "@type": "ListItem", position: 2, name: "Division 293 Tax", item: URL },
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

const faq = faqPageSchema(DIVISION_293_FAQS);

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, article, faq]} />
      <Division293TaxPage />
    </>
  );
}
