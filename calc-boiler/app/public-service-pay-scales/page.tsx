import type { Metadata } from "next";
import PublicServicePayScalesPage from "@/modules/guide/public-service-pay-scales";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, ItemList, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { ORGANIZATION_SCHEMA } from "@/lib/schema";
import { JURISDICTIONS, PUBLIC_SERVICE_PAY_FAQS } from "@/lib/data/public-service-pay";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/public-service-pay-scales/`;
const TITLE = "Public Service Pay Scales Australia — APS, VPS and QLD Salary Bands";
const DESCRIPTION =
  "What every public service classification pays: APS 1–6, EL1, EL2 and SES from the APSC's remuneration data, VPS grades 1–7 from the Victorian enterprise agreement, and Queensland AO, PO, TO and OO rates from the state award — each with its source and effective date.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: "en_AU",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Public Service Pay Scales", item: URL },
  ],
};

// Built from the same array the page renders, so the structured data cannot
// drift from the visible answers.
const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: PUBLIC_SERVICE_PAY_FAQS.map((f) => ({
    "@type": "Question" as const,
    name: f.q,
    acceptedAnswer: { "@type": "Answer" as const, text: f.a },
  })),
};

const itemList: WithContext<ItemList> = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Australian public service pay scales",
  itemListElement: JURISDICTIONS.map((jurisdiction, index) => ({
    "@type": "ListItem" as const,
    position: index + 1,
    name: `${jurisdiction.name} pay scales`,
    url: `${BASE}/public-service-pay-scales/${jurisdiction.slug}/`,
  })),
};

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, faq, itemList, ORGANIZATION_SCHEMA]} />
      <PublicServicePayScalesPage />
    </>
  );
}
