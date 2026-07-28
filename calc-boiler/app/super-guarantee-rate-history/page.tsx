import type { Metadata } from "next";
import SuperGuaranteeRateHistoryPage from "@/modules/guide/super-guarantee-rate-history";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebPage, Article, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS } from "@/lib/authors";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/super-guarantee-rate-history/`;
const TITLE = "Super Guarantee Rate History — Every SG Rate 1992 to 2026";
const DESCRIPTION = "History of the super guarantee rate from 3% in 1992 to 12% in 2025-26. See every rate change, the path to 12%, and what it means for your retirement savings.";

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
    { "@type": "ListItem", position: 2, name: "Super Guarantee Rate History", item: URL },
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
    { "@type": "Question", name: "What is the super guarantee rate for 2026-27?", acceptedAnswer: { "@type": "Answer", text: "The super guarantee rate for FY2026-27 is 12%. This is the legislated ceiling and represents the final increase in the gradual path from 9.5% that resumed in 2021." } },
    { "@type": "Question", name: "Why was the super guarantee frozen at 9.5%?", acceptedAnswer: { "@type": "Answer", text: "The Coalition government froze the SG rate at 9.5% from 2014 to 2021, arguing that increases would come at the expense of wage growth. The freeze was lifted and annual 0.5% increases resumed from 1 July 2021." } },
    { "@type": "Question", name: "Will the super guarantee rate increase beyond 12%?", acceptedAnswer: { "@type": "Answer", text: "There are currently no legislated plans to increase the SG rate beyond 12%. Some industry groups advocate for 15%, but no legislation has been introduced." } },
    { "@type": "Question", name: "How has the SG rate affected take-home pay?", acceptedAnswer: { "@type": "Answer", text: "Each SG increase is typically absorbed by employers as an additional cost, though economic evidence suggests some of the cost is passed to employees through slower wage growth over time." } },
  ]
};

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, article, faq]} />
      <SuperGuaranteeRateHistoryPage />
    </>
  );
}
