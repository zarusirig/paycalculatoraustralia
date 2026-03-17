import type { Metadata } from "next";
import LowIncomeTaxOffsetPage from "@/modules/guide/low-income-tax-offset";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebPage, Article, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS, GUIDE_AUTHORSHIP } from "@/lib/authors";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/low-income-tax-offset/`;
const TITLE = "Low Income Tax Offset (LITO) 2025-26 — Up to $700 Tax Reduction";
const DESCRIPTION = "Learn how the Low Income Tax Offset (LITO) works in Australia. Understand the income thresholds, how to claim the $700 offset, and how it effectively raises your tax-free threshold.";

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
    { "@type": "ListItem", position: 2, name: "Low Income Tax Offset", item: URL },
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
  isBasedOn: { "@type": "Legislation", name: "Income Tax Assessment Act 1997", url: "https://www.legislation.gov.au/Details/C2024C00342" },
};

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "What is the Low Income Tax Offset (LITO)?", acceptedAnswer: { "@type": "Answer", text: "The LITO is a non-refundable tax offset provided by the Australian government to lower-income earners. It directly reduces the amount of income tax you have to pay, offering a maximum reduction of $700 for those earning under $37,500." } },
    { "@type": "Question", name: "How do I claim the LITO?", acceptedAnswer: { "@type": "Answer", text: "You don't need to do anything special to claim it. When you lodge your tax return at the end of the financial year, the ATO automatically calculates your eligibility based on your taxable income and applies the offset to reduce your overall tax bill." } },
    { "@type": "Question", name: "What is the real tax-free threshold in Australia?", acceptedAnswer: { "@type": "Answer", text: "While the official tax-free threshold is $18,200, the addition of the $700 LITO means you can effectively earn up to $22,575 before you actually have to pay any income tax out of your pocket in Australia." } },
  ]
};

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, article, faq]} />
      <LowIncomeTaxOffsetPage />
    </>
  );
}
