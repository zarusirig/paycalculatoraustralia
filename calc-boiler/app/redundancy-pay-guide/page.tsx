import type { Metadata } from "next";
import RedundancyPayGuidePage from "@/modules/guide/redundancy-pay-guide";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebPage, Article, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS, GUIDE_AUTHORSHIP } from "@/lib/authors";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/redundancy-pay-guide/`;
const TITLE = "Redundancy Pay & Rights Australia — Calculating Your Entitlements";
const DESCRIPTION = "Understand your legal redundancy rights in Australia. Learn about the NES, genuine vs non-genuine redundancy, ETP tax codes, and the tax-free component limits.";

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
    { "@type": "ListItem", position: 2, name: "Redundancy Pay Guide", item: URL },
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
    { "@type": "Question", name: "What is a genuine redundancy in Australia?", acceptedAnswer: { "@type": "Answer", text: "A genuine redundancy happens when your employer's business no longer requires anyone to do your job because of changes in operational requirements, AND they have actively consulted you and tried to redeploy you elsewhere within the business first." } },
    { "@type": "Question", name: "How much redundancy pay am I legally entitled to?", acceptedAnswer: { "@type": "Answer", text: "It depends strictly on your years of continuous service. Under the National Employment Standards (NES), an employee with exactly 3 years of service is entitled to 7 weeks of redundancy pay, while an employee with 9 years gets a maximum of 16 weeks." } },
    { "@type": "Question", name: "Is my redundancy payout tax-free?", acceptedAnswer: { "@type": "Answer", text: "It is partially tax-free. If it is a genuine redundancy, the ATO provides a 'tax-free base limit' of $12,524, plus an extra $6,263 for every complete year of service you have with the company. Any amount paid above this threshold is taxed heavily as an ETP." } },
  ]
};

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, article, faq]} />
      <RedundancyPayGuidePage />
    </>
  );
}
