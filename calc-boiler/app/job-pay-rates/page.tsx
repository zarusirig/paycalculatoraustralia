import type { Metadata } from "next";
import type { BreadcrumbList, FAQPage, ItemList, WebPage, WithContext } from "schema-dts";
import JobPayRatesHubPage, { JOB_PAY_HUB_FAQS } from "@/modules/guide/job-pay-rates-hub";
import { JsonLd } from "@/modules/seo/json-ld";
import { SITE_CONFIG } from "@/lib/constants";
import { ORGANIZATION_SCHEMA } from "@/lib/schema";
import { OCCUPATIONS } from "@/lib/data/job-pay-rates";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/job-pay-rates/`;
const TITLE = "Job Pay Rates Australia 2026 — Award Minimums by Occupation";
const DESCRIPTION =
  "Award pay rates for 40+ jobs: nurses and midwives, aged care and childcare workers, chefs, baristas, retail workers, cleaners, mechanics, hairdressers, electricians, truck drivers and more. Hourly, casual and weekly minimums for 2026–27, straight from each modern award.";

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
    { "@type": "ListItem", position: 2, name: "Job Pay Rates", item: URL },
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
  dateModified: "2026-09-23",
  publisher: { "@type": "Organization", name: SITE_CONFIG.name },
};

const itemList: WithContext<ItemList> = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Job pay rates",
  itemListElement: OCCUPATIONS.map((o, i) => ({
    "@type": "ListItem" as const,
    position: i + 1,
    name: `${o.name} pay rates`,
    url: `${BASE}/job-pay-rates/${o.slug}/`,
  })),
};

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: JOB_PAY_HUB_FAQS.map((f) => ({
    "@type": "Question" as const,
    name: f.q,
    acceptedAnswer: { "@type": "Answer" as const, text: f.a },
  })),
};

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, itemList, faq, ORGANIZATION_SCHEMA]} />
      <JobPayRatesHubPage />
    </>
  );
}
