import type { Metadata } from "next";
import ContractorVsEmployeeGuidePage from "@/modules/guide/contractor-vs-employee";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebPage, Article, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS, GUIDE_AUTHORSHIP } from "@/lib/authors";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/contractor-vs-employee/`;
const TITLE = "Contractor vs Employee — Key Differences, Tax & Super (2025)";
const DESCRIPTION = "Understand the legal definitions between a contractor and an employee in Australia. Learn about the ATO multi-factor test, tax implications, and superannuation obligations.";

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
    { "@type": "ListItem", position: 2, name: "Contractor vs Employee Guide", item: URL },
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
    { "@type": "Question", name: "What is the main difference between an employee and a contractor?", acceptedAnswer: { "@type": "Answer", text: "An employee works in and is part of the employer's business, taking direction and control from them. A contractor is running their own independent business, providing services to another business for a set result." } },
    { "@type": "Question", name: "Do independent contractors pay their own tax?", acceptedAnswer: { "@type": "Answer", text: "Yes, independent contractors are responsible for managing their own tax affairs through their ABN. They do not have PAYG tax automatically withheld from their invoices like employees do from their payslips, unless a specific voluntary agreement is in place." } },
    { "@type": "Question", name: "Are contractors entitled to superannuation?", acceptedAnswer: { "@type": "Answer", text: "Generally no, but there is a major exception. If a contractor is hired wholly or principally for their personal 'labour and skills', the employer may be legally required to pay the 12% Superannuation Guarantee on their behalf, even if they quote an ABN." } },
  ]
};

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, article, faq]} />
      <ContractorVsEmployeeGuidePage />
    </>
  );
}
