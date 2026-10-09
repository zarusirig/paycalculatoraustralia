// Linkable asset: open Australian tax and pay tables (CSV + JSON).
// Content in modules/guide/australian-tax-and-pay-data.tsx, data in lib/data/open-data,
// downloads in ./data/[file]/route.ts.
import type { Metadata } from "next";
import AustralianTaxAndPayData, { OPEN_DATA_SOURCES } from "@/modules/guide/australian-tax-and-pay-data";
import { OPEN_DATA_FAQS } from "@/modules/guide/australian-tax-and-pay-data-faqs";
import { JsonLd } from "@/modules/seo/json-ld";
import type { Article, BreadcrumbList, Dataset, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS } from "@/lib/authors";
import { DATA_FILES, JSON_FILE, OPEN_DATA, dataHref, suggestedCitation } from "@/lib/data/open-data";
import { faqPageSchema } from "@/lib/faq";
import { withPageEnd } from "@/components/common/content-slots";
import { withFeaturedImage } from "@/lib/featured-image";

const BASE = SITE_CONFIG.baseUrl;
const TITLE = "Australian Tax and Pay Data: Free CSV and JSON Download";
const DESCRIPTION = `Download Australian tax rates, Medicare levy, super guarantee, HECS-HELP thresholds and National Minimum Wage history (2010 to ${SITE_CONFIG.financialYear}) as CSV and JSON. Sourced to the ATO and Fair Work Commission, free to reuse with a link.`;

export const metadata: Metadata = withFeaturedImage({
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: OPEN_DATA.url },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: OPEN_DATA.url,
    siteName: SITE_CONFIG.name,
    type: "article",
    locale: "en_AU",
    publishedTime: OPEN_DATA.publishedIso,
    modifiedTime: OPEN_DATA.updatedIso,
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
});

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: OPEN_DATA.title, item: OPEN_DATA.url },
  ],
};

const article: WithContext<Article> = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: TITLE,
  description: DESCRIPTION,
  datePublished: OPEN_DATA.publishedIso,
  dateModified: OPEN_DATA.updatedIso,
  inLanguage: "en-AU",
  author: AUTHORS["anita-bell"].jsonLd,
  publisher: { "@type": "Organization", name: SITE_CONFIG.name, logo: { "@type": "ImageObject", url: `${BASE}/favicon.ico` } },
  mainEntityOfPage: { "@type": "WebPage", "@id": OPEN_DATA.url },
  citation: OPEN_DATA_SOURCES.map((s) => s.url),
  license: OPEN_DATA.license,
};

const dataset: WithContext<Dataset> = {
  "@context": "https://schema.org",
  "@type": "Dataset",
  name: `${OPEN_DATA.title}: tax rates, Medicare levy, super guarantee, HECS-HELP and minimum wage`,
  description:
    `Australian tax and pay reference tables as CSV and JSON: resident income tax scales for 2025-26, ${SITE_CONFIG.financialYear} and the legislated 2027-28 scale; the Medicare levy and surcharge; the super guarantee rate by year; HECS-HELP repayment thresholds; the National Minimum Wage from 2010-11 to ${SITE_CONFIG.financialYear}; and junior minimum wage rates. Figures are taken from the Australian Taxation Office and the Fair Work Commission.`,
  url: OPEN_DATA.url,
  inLanguage: "en-AU",
  isAccessibleForFree: true,
  datePublished: OPEN_DATA.publishedIso,
  dateModified: OPEN_DATA.updatedIso,
  version: OPEN_DATA.version,
  temporalCoverage: "2010-07-01/2028-06-30",
  spatialCoverage: { "@type": "Place", name: "Australia" },
  keywords: ["Australian tax rates", "tax brackets", "Medicare levy", "super guarantee rate", "HECS-HELP thresholds", "National Minimum Wage", "minimum wage history"],
  variableMeasured: ["Marginal tax rate", "Medicare levy threshold", "Super guarantee rate", "HELP repayment threshold", "National Minimum Wage per hour", "National Minimum Wage per week"],
  creator: { "@type": "Organization", name: SITE_CONFIG.name, url: BASE },
  license: OPEN_DATA.license,
  citation: suggestedCitation(),
  isBasedOn: OPEN_DATA_SOURCES.map((s) => s.url),
  distribution: [
    ...DATA_FILES.map((f) => ({
      "@type": "DataDownload" as const,
      name: f.title,
      encodingFormat: "text/csv",
      contentUrl: `${BASE}${dataHref(f.file)}`,
    })),
    {
      "@type": "DataDownload" as const,
      name: "All tables in one JSON file",
      encodingFormat: "application/json",
      contentUrl: `${BASE}${dataHref(JSON_FILE)}`,
    },
  ],
};

function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, article, dataset, faqPageSchema(OPEN_DATA_FAQS)]} />
      <AustralianTaxAndPayData />
    </>
  );
}

export default withPageEnd(Page, "/australian-tax-and-pay-data/");
