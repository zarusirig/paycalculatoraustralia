import type { Metadata } from "next";
import SuperannuationGuidePage from "@/modules/guide/superannuation-guide";
import { faqPageSchema } from "@/lib/faq";
import { SUPERANNUATION_GUIDE_FAQS } from "@/modules/guide/superannuation-guide-faqs";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, WebPage, Article, WithContext } from "schema-dts";
import { SITE_CONFIG, SUPER_GUARANTEE, formatAUD } from "@/lib/constants";
import { AUTHORS, GUIDE_AUTHORSHIP } from "@/lib/authors";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/superannuation-guide/`;
const TITLE = "Superannuation Guide — How Super Works in Australia";
const DESCRIPTION = `How super works in ${SITE_CONFIG.financialYear}: the 12% SG rate, Payday Super from ${SUPER_GUARANTEE.paydaySuperStart}, the ${formatAUD(SUPER_GUARANTEE.concessionalCap)} concessional cap, transfer balance cap and salary sacrifice.`;

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
  publisher: { "@type": "Organization", name: SITE_CONFIG.name, logo: { "@type": "ImageObject", url: `${BASE}/icon-512.png` } },
  mainEntityOfPage: { "@type": "WebPage", "@id": URL },
  isBasedOn: { "@type": "Legislation", name: "Superannuation Guarantee (Administration) Act 1992", url: "https://www.legislation.gov.au/Details/C2024C00199" },
};

const faq = faqPageSchema(SUPERANNUATION_GUIDE_FAQS);

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, article, faq]} />
      <SuperannuationGuidePage />
    </>
  );
}
