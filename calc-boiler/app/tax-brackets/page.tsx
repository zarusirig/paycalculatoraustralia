import type { Metadata } from "next";
import TaxBracketsGuidePage from "@/modules/guides/tax-brackets";
import { JsonLd } from "@/modules/seo/json-ld";
import type { Article, BreadcrumbList, FAQPage, Table, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS, GUIDE_AUTHORSHIP } from "@/lib/authors";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/tax-brackets/`;

export const metadata: Metadata = {
  title: "Australian Tax Rates & Income Tax Brackets",
  description: "Complete guide to Australian income tax brackets for FY2026-27. Rates, thresholds, worked examples, LITO, Stage 3 tax cuts, and what changed. Official ATO data.",
  alternates: { canonical: URL },
  openGraph: { title: "Australian Tax Brackets 2025-26", description: "Complete guide with rates, thresholds, worked examples. All ATO data.", url: URL, siteName: SITE_CONFIG.name, type: "article", locale: "en_AU" },
  twitter: { card: "summary_large_image", title: "Australian Tax Brackets 2025-26", description: "Rates, thresholds, and worked examples for FY2026-27." },
};

const breadcrumb: WithContext<BreadcrumbList> = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
  { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
  { "@type": "ListItem", position: 2, name: "Tax Brackets", item: URL },
]};

const article: WithContext<Article> = { "@context": "https://schema.org", "@type": "Article",
  headline: "Australian Tax Brackets 2025-26 — Income Tax Rates & Thresholds",
  url: URL, datePublished: "2025-07-01", dateModified: GUIDE_AUTHORSHIP["tax-brackets"].lastReviewed,
  author: AUTHORS["james-harrington"].jsonLd,
  publisher: { "@type": "Organization", name: SITE_CONFIG.name, logo: { "@type": "ImageObject", url: `${BASE}/logo.png` } },
  mainEntityOfPage: URL, inLanguage: "en-AU",
  isBasedOn: { "@type": "Legislation", name: "Income Tax Assessment Act 1997", url: "https://www.legislation.gov.au/Details/C2024C00342" },
};

const tableSchema: WithContext<Table> = { "@context": "https://schema.org", "@type": "Table",
  about: "Australian income tax brackets for FY2026-27",
  name: "FY2026-27 Tax Brackets", description: "Progressive income tax rates for Australian residents",
};

const faq: WithContext<FAQPage> = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [
  { "@type": "Question", name: "How much tax do I pay on $100,000 in Australia?", acceptedAnswer: { "@type": "Answer", text: "On $100,000, you pay $20,788 in income tax (effective rate 20.79%). Add the 2% Medicare levy ($2,000) for total tax of $22,788. Take-home: ~$77,212/year." } },
  { "@type": "Question", name: "What is the highest tax rate in Australia?", acceptedAnswer: { "@type": "Answer", text: "45% on income over $190,000. Including Medicare levy, the top marginal rate is effectively 47%, or 48.5% with Medicare Surcharge." } },
  { "@type": "Question", name: "When do the new tax rates start?", acceptedAnswer: { "@type": "Answer", text: "Current rates apply from 1 July 2025. Next change: lowest bracket drops from 16% to 15% from 1 July 2026." } },
  { "@type": "Question", name: "What's the difference between marginal rate and effective rate?", acceptedAnswer: { "@type": "Answer", text: "Marginal rate is the rate on the last dollar you earn. Effective rate is the average across all income. On $80,000: marginal 30%, effective 18.49%." } },
]};

export default function Page() {
  return (<><JsonLd code={[breadcrumb, article, tableSchema, faq]} /><TaxBracketsGuidePage /></>);
}
