import type { Metadata } from "next";
import type { Article, BreadcrumbList, FAQPage, WebPage, WithContext } from "schema-dts";
import JuniorPayRatesPage from "@/modules/guide/junior-pay-rates";
import { JUNIOR_FAQS } from "@/modules/guide/junior-pay-rates-faqs";
import { JsonLd } from "@/modules/seo/json-ld";
import { SITE_CONFIG, EMPLOYMENT, formatAUD } from "@/lib/constants";
import { AUTHORS } from "@/lib/authors";
import { ADULT_AGE, JUNIOR_RATES, NMW_ORDER } from "@/lib/constants/junior-rates";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/junior-pay-rates/`;

const byAge = (age: string) => JUNIOR_RATES.find((r) => r.age === age)!;
const A16 = byAge("16");
const U16 = byAge("Under 16");

const TITLE = `Junior Pay Rates ${SITE_CONFIG.financialYear} — Minimum Wage by Age`;
const DESCRIPTION = `What under-${ADULT_AGE}s must be paid in Australia from ${NMW_ORDER.operativeFrom}. A 16-year-old earns ${formatAUD(A16.hourly, 2)}/hr (${formatAUD(A16.casualHourly, 2)} casual), under 16 ${formatAUD(U16.hourly, 2)}, rising to the full ${formatAUD(EMPLOYMENT.minimumWageHourly, 2)} at ${ADULT_AGE}. Includes junior scales for the retail, fast food, hospitality and hair & beauty awards, and minimum working age by state.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: `Junior minimum wage by age, plus per-award junior scales and minimum working age by state.`,
    url: URL,
    siteName: SITE_CONFIG.name,
    type: "article",
    locale: "en_AU",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Award Rates", item: `${BASE}/award-rates/` },
    { "@type": "ListItem", position: 3, name: "Junior Pay Rates", item: URL },
  ],
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
  publisher: {
    "@type": "Organization",
    name: SITE_CONFIG.name,
    logo: { "@type": "ImageObject", url: `${BASE}/favicon.ico` },
  },
  mainEntityOfPage: { "@type": "WebPage", "@id": URL },
  isBasedOn: {
    "@type": "Legislation",
    name: `${NMW_ORDER.citation} (${NMW_ORDER.reference})`,
    url: NMW_ORDER.url,
  },
};

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: JUNIOR_FAQS.map((f) => ({
    "@type": "Question" as const,
    name: f.q,
    acceptedAnswer: { "@type": "Answer" as const, text: f.a },
  })),
};

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, article, faq]} />
      <JuniorPayRatesPage />
    </>
  );
}
