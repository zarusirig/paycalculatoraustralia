import type { Metadata } from "next";
import type { Article, BreadcrumbList, FAQPage, WebPage, WithContext } from "schema-dts";
import JuniorPayRatesPage from "@/modules/guide/junior-pay-rates";
import { JUNIOR_FAQS } from "@/modules/guide/junior-pay-rates-faqs";
import { JsonLd } from "@/modules/seo/json-ld";
import { SITE_CONFIG, EMPLOYMENT, formatAUD } from "@/lib/constants";
import { AUTHORS } from "@/lib/authors";
import { ADULT_AGE, JUNIOR_RATES, NMW_ORDER } from "@/lib/constants/junior-rates";
import { pageDateModified, pageDatePublished } from "@/lib/page-dates";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/junior-pay-rates/`;

const byAge = (age: string) => JUNIOR_RATES.find((r) => r.age === age)!;
const A16 = byAge("16");
const U16 = byAge("Under 16");

// Retitled 23 Sep 2026: GSC shows the demand is age-led ("minimum wage for 15
// year old australia" 2.1k impressions, 16/14/17 variants) and the old
// "Junior Pay Rates" title earned 0.43% CTR at position 6.2.
const TITLE = `Minimum Wage by Age ${SITE_CONFIG.financialYear}: 14, 15, 16, 17 Year Olds (Australia)`;
const DESCRIPTION = `Minimum wage by age from ${NMW_ORDER.operativeFrom}: under 16 ${formatAUD(U16.hourly, 2)}/hr, 16 ${formatAUD(A16.hourly, 2)}, 17 ${formatAUD(byAge("17").hourly, 2)}, 18 ${formatAUD(byAge("18").hourly, 2)}, 19 ${formatAUD(byAge("19").hourly, 2)}, 20 ${formatAUD(byAge("20").hourly, 2)}, then ${formatAUD(EMPLOYMENT.minimumWageHourly, 2)} at ${ADULT_AGE}. Casual and award junior rates.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: `Minimum wage by age for 14 to 20 year olds in Australia, plus retail, fast food and hospitality junior rates.`,
    url: URL,
    siteName: SITE_CONFIG.name,
    type: "article",
    locale: "en_AU",
    images: ["/og-image.png"],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Award Rates", item: `${BASE}/award-rates/` },
    { "@type": "ListItem", position: 3, name: "Minimum Wage by Age", item: URL },
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
  datePublished: pageDatePublished("junior-pay-rates"),
  dateModified: pageDateModified("junior-pay-rates"),
  headline: TITLE,
  description: DESCRIPTION,
  author: AUTHORS["penny-ward"].jsonLd,
  publisher: {
    "@type": "Organization",
    name: SITE_CONFIG.name,
    logo: { "@type": "ImageObject", url: `${BASE}/icon-512.png` },
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
