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
import { withPageEnd } from "@/components/common/content-slots";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/medicare-levy/`;

// Derived from the constants so the title, description, JSON-LD and rendered
// page can never disagree.
const RATE = formatPercent(MEDICARE_LEVY.rate, 0);
const LOWER = formatAUD(MEDICARE_LEVY.lowIncomeThreshold);
const UPPER = formatAUD(MEDICARE_LEVY.shadeInThreshold);

// Retitled in place (23 Sep 2026) rather than moved to /medicare-levy-calculator/:
// that URL already 301s here, and a move would touch ~20 files other
// workstreams own. The thresholds themselves stay unlabelled in the title:
// they are the ATO's latest (2025-26, they lag a year).
//
// Intent split (W2, 23 Sep 2026): "Medicare levy surcharge" queries now belong
// to /medicare-levy-surcharge-calculator/. This page owns the 2% levy and keeps
// only a short surcharge summary that links there.
// Previous: "Medicare Levy Calculator: 2% Levy, Low-Income & Family Thresholds"
// seo-brain 25 Sep 2026 (Jev-ranked): keep tokens medicare/levy/calculator; the year is the
// FY start year from SITE_CONFIG so it rolls over with the site.
const TITLE = `Medicare Levy Calculator ${SITE_CONFIG.financialYear.slice(0, 4)}: ${RATE} Levy, Low-Income, Family Limits`;
const DESCRIPTION = `Free Medicare levy calculator: the ${RATE} levy, the low-income shade-in from ${LOWER} to ${UPPER}, and exemptions. The ${MLS_INCOME_YEAR} surcharge has its own calculator.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: `Work out your Medicare levy including the low-income shade-in and the family and seniors thresholds.`,
    url: URL,
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: "en_AU",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: `Medicare levy calculator with the low-income shade-in and the family and seniors thresholds.`,
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
  description: `Works out the ${RATE} Medicare levy including the low-income shade-in and the family and seniors thresholds, using the ATO's ${MEDICARE_LEVY_INCOME_YEAR} figures.`,
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
  headline: `Medicare Levy — ${RATE} Rate, Thresholds and Exemptions`,
  url: URL,
  datePublished: "2025-07-01",
  dateModified: GUIDE_AUTHORSHIP["medicare-levy"].lastReviewed,
  author: AUTHORS["james-harrington"].jsonLd,
  publisher: {
    "@type": "Organization",
    name: SITE_CONFIG.name,
    logo: { "@type": "ImageObject", url: `${BASE}/icon-512.png` },
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

function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, webApp, article, faq]} />
      <MedicareLevyPage />
    </>
  );
}

export default withPageEnd(Page, "/medicare-levy/");
