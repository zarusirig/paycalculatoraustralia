// F8 (Lever D): linkable data study. Content in modules/guide/australian-pay-report.tsx,
// data in lib/data/pay-report, CSVs in ./data/[file]/route.ts.
import type { Metadata } from "next";
import AustralianPayReport, { REPORT_SOURCES } from "@/modules/guide/australian-pay-report";
import { JsonLd } from "@/modules/seo/json-ld";
import type { Article, BreadcrumbList, Dataset, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS } from "@/lib/authors";
import { REPORT, REPORT_CSV_FILES, maxTaxCutGain, reportCsvHref, suggestedCitation } from "@/lib/data/pay-report";

const BASE = SITE_CONFIG.baseUrl;
const cut = maxTaxCutGain();
const TITLE = `${REPORT.title}: Take-Home Pay, Minimum Wage & Award Rates`;
const DESCRIPTION = `Data study: take-home pay at every salary ${SITE_CONFIG.previousFinancialYear} vs ${SITE_CONFIG.financialYear} (the tax cut is worth at most $${cut.perYear} a year), minimum vs median vs average wage, 14 award minimums ranked and public-sector pay by state. Free CSV downloads.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: REPORT.url },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: REPORT.url,
    siteName: SITE_CONFIG.name,
    type: "article",
    locale: "en_AU",
    publishedTime: REPORT.publishedIso,
    modifiedTime: REPORT.updatedIso,
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: REPORT.title, item: REPORT.url },
  ],
};

const article: WithContext<Article> = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: TITLE,
  description: DESCRIPTION,
  datePublished: REPORT.publishedIso,
  dateModified: REPORT.updatedIso,
  inLanguage: "en-AU",
  author: AUTHORS["penny-ward"].jsonLd,
  publisher: { "@type": "Organization", name: SITE_CONFIG.name, logo: { "@type": "ImageObject", url: `${BASE}/favicon.ico` } },
  mainEntityOfPage: { "@type": "WebPage", "@id": REPORT.url },
  citation: REPORT_SOURCES.map((s) => s.url),
  license: REPORT.license,
};

const dataset: WithContext<Dataset> = {
  "@context": "https://schema.org",
  "@type": "Dataset",
  name: `${REPORT.title} — take-home pay, minimum wage, award rates and public-sector pay`,
  description:
    `Australian pay figures computed from ATO resident tax scales (${SITE_CONFIG.previousFinancialYear}, ${SITE_CONFIG.financialYear} and legislated 2027-28), the Fair Work Commission Annual Wage Review 2026, modern award pay guides, ABS Average Weekly Earnings (May 2026) and Employee Earnings (August 2025), and published state teacher, nurse and public service pay scales. Five tables: take-home pay by salary before and after the 1 July 2026 tax cut; minimum vs median vs average earnings; entry-level award minimums ranked; public-sector pay by state; hours of work to earn $1,000.`,
  url: REPORT.url,
  inLanguage: "en-AU",
  isAccessibleForFree: true,
  datePublished: REPORT.publishedIso,
  dateModified: REPORT.updatedIso,
  version: REPORT.version,
  temporalCoverage: "2025-07-01/2028-06-30",
  spatialCoverage: { "@type": "Place", name: "Australia" },
  keywords: ["Australian pay", "take-home pay", "tax cut 2026", "minimum wage Australia", "award rates", "average salary Australia", "teacher pay", "nurse pay", "public service pay"],
  variableMeasured: ["Take-home pay", "Income tax and Medicare levy", "National Minimum Wage", "Median weekly earnings", "Average weekly ordinary time earnings", "Award minimum hourly rate", "Public-sector salary"],
  creator: { "@type": "Organization", name: SITE_CONFIG.name, url: BASE },
  license: REPORT.license,
  citation: suggestedCitation(),
  isBasedOn: REPORT_SOURCES.map((s) => s.url),
  distribution: REPORT_CSV_FILES.map((f) => ({
    "@type": "DataDownload" as const,
    name: f.title,
    encodingFormat: "text/csv",
    contentUrl: `${BASE}${reportCsvHref(f.file)}`,
  })),
};

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, article, dataset]} />
      <AustralianPayReport />
    </>
  );
}
