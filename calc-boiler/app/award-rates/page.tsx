import type { Metadata } from "next";
import AwardRatesGuidePage from "@/modules/guide/award-rates";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebPage, Article, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS, GUIDE_AUTHORSHIP } from "@/lib/authors";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/award-rates/`;
const TITLE = "Award Rates in Australia (2025-26) — Find Your Minimum Wage";
const DESCRIPTION = "Understand the Australian Award system. Learn how modern awards set legal minimum wages, penalty rates, and working conditions for different industries.";

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
    { "@type": "ListItem", position: 2, name: "Award Rates Guide", item: URL },
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
  author: AUTHORS["penny-ward"].jsonLd,
  publisher: { "@type": "Organization", name: SITE_CONFIG.name, logo: { "@type": "ImageObject", url: `${BASE}/favicon.ico` } },
  mainEntityOfPage: { "@type": "WebPage", "@id": URL },
  isBasedOn: { "@type": "Legislation", name: "Fair Work Act 2009", url: "https://www.legislation.gov.au/Details/C2024C00301" },
};

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "What is an Award in Australia?", acceptedAnswer: { "@type": "Answer", text: "A modern award is a legal document that outlines the minimum pay rates and conditions of employment for employees working in specific industries or occupations in Australia." } },
    { "@type": "Question", name: "Are Award rates higher than the National Minimum Wage?", acceptedAnswer: { "@type": "Answer", text: "Yes, they almost always are. While the National Minimum Wage is the absolute baseline for anyone working in Australia, Award rates are tailored to specific roles and usually mandate higher pay rates depending on your experience and classification level within that industry." } },
    { "@type": "Question", name: "How do I find out which Award applies to me?", acceptedAnswer: { "@type": "Answer", text: "You can find your Award by using the 'Find my award' tool on the official Fair Work Ombudsman website. Common examples include the Retail Award, and the Fast Food Award. If your role isn't covered by an industry or occupational award, you fall back to the National Minimum Wage." } },
  ]
};

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, article, faq]} />
      <AwardRatesGuidePage />
    </>
  );
}
