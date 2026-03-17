import type { Metadata } from "next";
import Division293TaxPage from "@/modules/guide/division-293-tax";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebPage, Article, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS } from "@/lib/authors";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/division-293-tax/`;
const TITLE = "Division 293 Tax Explained — Extra 15% Super Tax for High Earners (2025-26)";
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
  publisher: { "@type": "Organization", name: SITE_CONFIG.name, logo: { "@type": "ImageObject", url: `${BASE}/favicon.ico` } },
  mainEntityOfPage: { "@type": "WebPage", "@id": URL },
};

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "What is Division 293 tax?", acceptedAnswer: { "@type": "Answer", text: "Division 293 is an additional 15% tax on concessional (before-tax) superannuation contributions for individuals whose income plus super contributions exceed $250,000. It effectively doubles the tax on super contributions from 15% to 30% for high-income earners." } },
    { "@type": "Question", name: "How is Division 293 tax calculated?", acceptedAnswer: { "@type": "Answer", text: "The ATO calculates Division 293 by adding your taxable income to your low-tax contributed amounts (concessional super contributions). If the total exceeds $250,000, you pay an additional 15% tax on the lesser of your concessional contributions or the amount over $250,000." } },
    { "@type": "Question", name: "Can I pay Division 293 tax from my super fund?", acceptedAnswer: { "@type": "Answer", text: "Yes. When you receive a Division 293 tax assessment, you can elect to release money from your super fund to pay the tax. You must complete a Division 293 release authority form and submit it to the ATO within 60 days of the assessment." } },
  ]
};

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, article, faq]} />
      <Division293TaxPage />
    </>
  );
}
