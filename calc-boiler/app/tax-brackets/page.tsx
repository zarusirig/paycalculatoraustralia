import type { Metadata } from "next";
import TaxBracketsGuidePage from "@/modules/guides/tax-brackets";
import { TAX_BRACKETS_FAQS } from "@/modules/guides/tax-brackets-faqs";
import { JsonLd } from "@/modules/seo/json-ld";
import type { Article, BreadcrumbList, FAQPage, Table, WebPage, WithContext } from "schema-dts";
import { SITE_CONFIG, TAX_BRACKETS_2025_26, TAX_BRACKETS_2026_27, formatAUD, formatPercent } from "@/lib/constants";
import { AUTHORS, GUIDE_AUTHORSHIP } from "@/lib/authors";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/tax-brackets/`;
const FY = SITE_CONFIG.financialYear;
const PREV = SITE_CONFIG.previousFinancialYear;
const B = TAX_BRACKETS_2026_27;
const pct = (r: number) => formatPercent(r, 0);

// Intent: "tax brackets australia", "tax brackets 2026", "tax thresholds 2026",
// "tax rates 2025-26", "marginal tax rate(s)". The year leads the title
// because every page-one result for the head term carries one.
const TITLE = `Tax Brackets Australia ${FY}: Income Tax Rates & Thresholds`;
const DESCRIPTION = `ATO tax brackets for ${FY} and ${PREV}: nil to ${formatAUD(B[0].max)}, ${pct(B[1].rate)} to ${formatAUD(B[1].max)} (was ${pct(TAX_BRACKETS_2025_26[1].rate)}), ${pct(B[2].rate)}, ${pct(B[3].rate)}, ${pct(B[4].rate)}. Tax on any income, marginal vs average rate, and the 2027-28 cut.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: SITE_CONFIG.name, type: "article", locale: "en_AU", images: ["/og-image.png"] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Tax Brackets", item: URL },
  ],
};

const webPage: WithContext<WebPage> = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: TITLE,
  description: DESCRIPTION,
  url: URL,
  inLanguage: "en-AU",
  publisher: { "@type": "Organization", name: SITE_CONFIG.name },
};

const article: WithContext<Article> = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: `Tax Brackets Australia ${FY}: Income Tax Rates & Thresholds`,
  description: DESCRIPTION,
  url: URL,
  datePublished: "2025-07-01",
  dateModified: GUIDE_AUTHORSHIP["tax-brackets"].lastReviewed,
  author: AUTHORS["james-harrington"].jsonLd,
  publisher: { "@type": "Organization", name: SITE_CONFIG.name, logo: { "@type": "ImageObject", url: `${BASE}/icon-512.png` } },
  mainEntityOfPage: URL,
  inLanguage: "en-AU",
  isBasedOn: { "@type": "Legislation", name: "Income Tax Rates Act 1986" },
};

const tableSchema: WithContext<Table> = {
  "@context": "https://schema.org",
  "@type": "Table",
  about: `Australian resident income tax brackets ${FY}`,
  name: `Tax brackets ${FY}`,
  description: `Resident income tax rates and thresholds for ${FY} and ${PREV}, excluding the Medicare levy.`,
};

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: TAX_BRACKETS_FAQS.map((f) => ({
    "@type": "Question" as const,
    name: f.q,
    acceptedAnswer: { "@type": "Answer" as const, text: f.a },
  })),
};

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, article, tableSchema, faq]} />
      <TaxBracketsGuidePage />
    </>
  );
}
