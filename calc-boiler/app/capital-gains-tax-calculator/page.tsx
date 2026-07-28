import type { Metadata } from "next";
import type { Article, BreadcrumbList, FAQPage, WebPage, WithContext } from "schema-dts";
import CapitalGainsTaxPage from "@/modules/guide/capital-gains-tax";
import { CGT_FAQS } from "@/modules/guide/capital-gains-tax-faqs";
import { JsonLd } from "@/modules/seo/json-ld";
import { SITE_CONFIG, formatPercent } from "@/lib/constants";
import { AUTHORS } from "@/lib/authors";
import {
  CGT_DISCOUNT_RATES,
  CGT_INCOME_YEAR,
  CGT_MINIMUM_OWNERSHIP_MONTHS,
} from "@/lib/constants/capital-gains-tax";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/capital-gains-tax-calculator/`;

// Derived from the engine constants so the title, description, JSON-LD and
// rendered page can never disagree.
const DISCOUNT = formatPercent(CGT_DISCOUNT_RATES.individual, 0);
const TAXED_SHARE = formatPercent(1 - CGT_DISCOUNT_RATES.individual, 0);

const TITLE = `Capital Gains Tax Calculator — ${DISCOUNT} Discount, ${CGT_INCOME_YEAR}`;
const DESCRIPTION = `There is no capital gains tax rate in Australia — CGT is part of your income tax, so your gain is taxed at your marginal rate. Hold an asset ${CGT_MINIMUM_OWNERSHIP_MONTHS} months and only ${TAXED_SHARE} of the gain is taxed. Work out your ${CGT_INCOME_YEAR} bill with cost base, capital losses and the main residence exemption.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: `Instant CGT calculator using the ATO's own 8-step method and the ${DISCOUNT} discount.`,
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
    { "@type": "ListItem", position: 2, name: "Capital Gains Tax Calculator", item: URL },
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
  author: AUTHORS["james-harrington"].jsonLd,
  publisher: {
    "@type": "Organization",
    name: SITE_CONFIG.name,
    logo: { "@type": "ImageObject", url: `${BASE}/favicon.ico` },
  },
  mainEntityOfPage: { "@type": "WebPage", "@id": URL },
};

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: CGT_FAQS.map((f) => ({
    "@type": "Question" as const,
    name: f.q,
    acceptedAnswer: { "@type": "Answer" as const, text: f.a },
  })),
};

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, article, faq]} />
      <CapitalGainsTaxPage />
    </>
  );
}
