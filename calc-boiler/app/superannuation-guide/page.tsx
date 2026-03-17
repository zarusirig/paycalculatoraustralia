import type { Metadata } from "next";
import SuperannuationGuidePage from "@/modules/guide/superannuation-guide";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebPage, Article, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS, GUIDE_AUTHORSHIP } from "@/lib/authors";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/superannuation-guide/`;
const TITLE = "Superannuation Guide — How Super Works in Australia (2025-26)";
const DESCRIPTION = "Everything you need to know about Australian Superannuation. Learn about the 12% SG rate, employer obligations, contribution caps, and salary sacrificing into super.";

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
    { "@type": "ListItem", position: 2, name: "Superannuation Guide", item: URL },
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
  isBasedOn: { "@type": "Legislation", name: "Superannuation Guarantee (Administration) Act 1992", url: "https://www.legislation.gov.au/Details/C2024C00199" },
};

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "What is the new Super Guarantee rate for 2025?", acceptedAnswer: { "@type": "Answer", text: "From 1 July 2025, the Superannuation Guarantee (SG) rate legally required to be paid by employers is 12% of a worker's Ordinary Time Earnings (OTE)." } },
    { "@type": "Question", name: "Does superannuation come out of my salary?", acceptedAnswer: { "@type": "Answer", text: "It depends on how your contract is written. If you are offered a 'Base Salary + Super' package, your employer pays the 12% on top of your base pay. If you have a 'Total Remuneration Package' (TRP), the 12% super is deducted from that total figure to determine your taxable base salary." } },
    { "@type": "Question", name: "Can I choose my own super fund?", acceptedAnswer: { "@type": "Answer", text: "Yes, most Australian employees have the right to choose their own superannuation fund. If you don't nominate one, your employer will pay into their default fund or check with the ATO for your 'stapled' fund." } },
  ]
};

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, article, faq]} />
      <SuperannuationGuidePage />
    </>
  );
}
