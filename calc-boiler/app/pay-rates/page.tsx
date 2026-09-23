import type { Metadata } from "next";
import EmployerPayHubPage from "@/modules/guide/employer-pay-hub";
import { PAY_RATES_HUB_FAQS } from "@/modules/guide/employer-pay-hub-faqs";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, ItemList, WebPage, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { ORGANIZATION_SCHEMA } from "@/lib/schema";
import { EMPLOYERS } from "@/lib/data/employer-pay";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/pay-rates/`;
const TITLE = "Pay Rates by Employer 2026 — Coles, Woolworths, Bunnings & More";
const DESCRIPTION =
  "Hourly pay rates at Coles, Woolworths, McDonald's, Hungry Jack's, Big W, Australia Post and other big Australian employers, from each agreement or award.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU", images: ["/og-image.png"] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Pay Rates by Employer", item: URL },
  ],
};

const webPage: WithContext<WebPage> = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${URL}#webpage`,
  name: TITLE,
  url: URL,
  description: DESCRIPTION,
  inLanguage: "en-AU",
  publisher: { "@type": "Organization", name: SITE_CONFIG.name },
};

const itemList: WithContext<ItemList> = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: EMPLOYERS.map((e, i) => ({
    "@type": "ListItem" as const,
    position: i + 1,
    name: `${e.name} pay rates`,
    url: `${BASE}/pay-rates/${e.slug}/`,
  })),
};

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: PAY_RATES_HUB_FAQS.map((f) => ({
    "@type": "Question" as const,
    name: f.q,
    acceptedAnswer: { "@type": "Answer" as const, text: f.a },
  })),
};

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, itemList, faq, ORGANIZATION_SCHEMA]} />
      <EmployerPayHubPage />
    </>
  );
}
