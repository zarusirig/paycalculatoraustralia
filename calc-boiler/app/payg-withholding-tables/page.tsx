import type { Metadata } from "next";
import PAYGTablesGuidePage from "@/modules/guide/payg-withholding-tables";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebPage, Article, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS } from "@/lib/authors";
import { PAYG_FINANCIAL_YEAR } from "@/lib/constants/payg-withholding";
import { PAYG_HUB_FAQS } from "@/modules/guide/payg-withholding-tables-faqs";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/payg-withholding-tables/`;
// Hub intent: "which table do I use". The exact-match "weekly / fortnightly /
// monthly tax table" queries belong to the dedicated pages, which this page
// links to with exact-match anchors.
const TITLE = `PAYG Withholding Tax Tables ${PAYG_FINANCIAL_YEAR}: Weekly, Fortnightly, Monthly`;
const DESCRIPTION = `Which ATO PAYG withholding tax table to use in ${PAYG_FINANCIAL_YEAR}: weekly (NAT 1005), fortnightly (NAT 1006) and monthly (NAT 1007) tax tables, Schedule 5 for bonuses, and how Schedule 1 withholding works.`;

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
    { "@type": "ListItem", position: 2, name: "PAYG Withholding Tables", item: URL },
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
  isBasedOn: { "@type": "Legislation", name: "Tax Administration Act 1953", url: "https://www.legislation.gov.au/Details/C2024C00327" },
};

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: PAYG_HUB_FAQS.map((f) => ({
    "@type": "Question" as const,
    name: f.q,
    acceptedAnswer: { "@type": "Answer" as const, text: f.a },
  })),
};

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, article, faq]} />
      <PAYGTablesGuidePage />
    </>
  );
}
