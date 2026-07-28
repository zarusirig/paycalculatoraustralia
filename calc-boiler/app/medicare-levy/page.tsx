import type { Metadata } from "next";
import MedicareLevyPage from "@/modules/guide/medicare-levy";
import { MEDICARE_LEVY_FAQS } from "@/modules/guide/medicare-levy-faqs";
import { JsonLd } from "@/modules/seo/json-ld";
import type {
  Article,
  BreadcrumbList,
  FAQPage,
  WebApplication,
  WebPage,
  WithContext,
} from "schema-dts";
import { MEDICARE_LEVY, SITE_CONFIG, formatAUD, formatPercent } from "@/lib/constants";
import {
  MEDICARE_LEVY_INCOME_YEAR,
  MLS_INCOME_YEAR,
} from "@/lib/constants/medicare-levy-extra";
import { AUTHORS, GUIDE_AUTHORSHIP } from "@/lib/authors";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/medicare-levy/`;

// Derived from the constants so the title, description, JSON-LD and rendered
// page can never disagree.
const RATE = formatPercent(MEDICARE_LEVY.rate, 0);
const LOWER = formatAUD(MEDICARE_LEVY.lowIncomeThreshold);
const UPPER = formatAUD(MEDICARE_LEVY.shadeInThreshold);

const TITLE = `Medicare Levy Calculator — ${RATE} Rate, Thresholds & Surcharge`;
const DESCRIPTION = `Calculate your Medicare levy instantly, including the low-income shade-in between ${LOWER} and ${UPPER} that most calculators get wrong. Family and seniors thresholds plus the surcharge.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: `Work out your Medicare levy including the shade-in, family and seniors thresholds, and the separate Medicare levy surcharge.`,
    url: URL,
    siteName: SITE_CONFIG.name,
    type: "article",
    locale: "en_AU",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: `Medicare levy calculator with the low-income shade-in, family and seniors thresholds, and the surcharge.`,
  },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Medicare Levy Calculator", item: URL },
  ],
};

const webPage: WithContext<WebPage> = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Medicare Levy Calculator",
  description: DESCRIPTION,
  url: URL,
  inLanguage: "en-AU",
  publisher: { "@type": "Organization", name: SITE_CONFIG.name },
};

const webApp: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Medicare Levy Calculator",
  description: `Works out the ${RATE} Medicare levy including the low-income shade-in, family and seniors thresholds, and the Medicare levy surcharge. Levy thresholds are the ATO's ${MEDICARE_LEVY_INCOME_YEAR} figures; surcharge tiers are ${MLS_INCOME_YEAR}.`,
  url: URL,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
  creator: { "@type": "Organization", name: SITE_CONFIG.name },
  dateModified: GUIDE_AUTHORSHIP["medicare-levy"].lastReviewed,
  inLanguage: "en-AU",
};

const article: WithContext<Article> = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: `Medicare Levy — ${RATE} Rate, Thresholds, Surcharge and Exemptions`,
  url: URL,
  datePublished: "2025-07-01",
  dateModified: GUIDE_AUTHORSHIP["medicare-levy"].lastReviewed,
  author: AUTHORS["james-harrington"].jsonLd,
  publisher: {
    "@type": "Organization",
    name: SITE_CONFIG.name,
    logo: { "@type": "ImageObject", url: `${BASE}/logo.png` },
  },
  mainEntityOfPage: URL,
  inLanguage: "en-AU",
  isBasedOn: {
    "@type": "Legislation",
    name: "Medicare Levy Act 1986",
    url: "https://www.legislation.gov.au/Details/C2023C00287",
  },
};

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: MEDICARE_LEVY_FAQS.map((f) => ({
    "@type": "Question" as const,
    name: f.q,
    acceptedAnswer: { "@type": "Answer" as const, text: f.a },
  })),
};

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, webApp, article, faq]} />
      <MedicareLevyPage />
    </>
  );
}
