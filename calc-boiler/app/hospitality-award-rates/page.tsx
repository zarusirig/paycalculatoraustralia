import type { Metadata } from "next";
import type { Article, BreadcrumbList, FAQPage, WebPage, WithContext } from "schema-dts";
import HospitalityAwardRatesPage from "@/modules/guide/hospitality-award-rates";
import { HOSPITALITY_FAQS, findRate } from "@/modules/guide/hospitality-award-faqs";
import { JsonLd } from "@/modules/seo/json-ld";
import { SITE_CONFIG, formatAUD } from "@/lib/constants";
import { AUTHORS } from "@/lib/authors";
import { HOSPITALITY_AWARD, HOSPITALITY_RATES } from "@/lib/constants/hospitality-award";
import { pageDateModified, pageDatePublished } from "@/lib/page-dates";
import { withPageEnd } from "@/components/common/content-slots";
import { withFeaturedImage } from "@/lib/featured-image";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/hospitality-award-rates/`;

// Derived from the constants so title, description, JSON-LD and page agree.
const L1 = findRate(HOSPITALITY_RATES, "Level 1");
const L6 = findRate(HOSPITALITY_RATES, "Level 6");

// CTR test (5 Oct 2026): the page has 14.6k impressions at position 7.9 under the older
// "Hospitality Award Pay Rates ... Penalty Rates" title. The new title leads with the head
// term and the table's columns; the description leads with the Level 1 casual figure.
const TITLE = `Hospitality Award Rates ${SITE_CONFIG.financialYear.slice(0, 4)}: Level 1–6, Casual, Sat, Sun & PH`;
const DESCRIPTION = `Hospitality award rates from ${HOSPITALITY_AWARD.operativeFrom} (${HOSPITALITY_AWARD.code}): Level 1 is ${formatAUD(L1.hourly, 2)}/hr, ${formatAUD(Math.round(L1.hourly * 125) / 100, 2)} casual. Table for Levels 1–6 with Saturday, Sunday and public holiday rates.`;

export const metadata: Metadata = withFeaturedImage({
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: `All ${HOSPITALITY_AWARD.code} classification rates, penalties and junior scales, operative ${HOSPITALITY_AWARD.operativeFrom}.`,
    url: URL,
    siteName: SITE_CONFIG.name,
    type: "article",
    locale: "en_AU",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
});

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Award Rates", item: `${BASE}/award-rates/` },
    { "@type": "ListItem", position: 3, name: "Hospitality Award Rates", item: URL },
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
  datePublished: pageDatePublished("hospitality-award-rates"),
  dateModified: pageDateModified("hospitality-award-rates"),
  headline: TITLE,
  description: DESCRIPTION,
  author: AUTHORS["anita-bell"].jsonLd,
  publisher: {
    "@type": "Organization",
    name: SITE_CONFIG.name,
    logo: { "@type": "ImageObject", url: `${BASE}/icon-512.png` },
  },
  mainEntityOfPage: { "@type": "WebPage", "@id": URL },
  isBasedOn: {
    "@type": "Legislation",
    name: `${HOSPITALITY_AWARD.name} (${HOSPITALITY_AWARD.code})`,
    url: HOSPITALITY_AWARD.awardTextUrl,
  },
};

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: HOSPITALITY_FAQS.map((f) => ({
    "@type": "Question" as const,
    name: f.q,
    acceptedAnswer: { "@type": "Answer" as const, text: f.a },
  })),
};

function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, article, faq]} />
      <HospitalityAwardRatesPage />
    </>
  );
}

export default withPageEnd(Page, "/hospitality-award-rates/");
