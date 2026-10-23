import type { Metadata } from "next";
import WeeklyTaxTablePage from "@/modules/tax-tables/weekly-tax-table";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, Dataset, FAQPage, WebPage, Article, WithContext } from "schema-dts";
import { SITE_CONFIG, formatAUD } from "@/lib/constants";
import { AUTHORS } from "@/lib/authors";
import { PAYG_FINANCIAL_YEAR, calculatePAYGWithholding } from "@/lib/constants/payg-withholding";
import downloads from "@/modules/tax-tables/downloads-manifest.json";
import { WEEKLY_TAX_TABLE_FAQS } from "@/modules/tax-tables/weekly-tax-table-faqs";
import {
  ATO_SCHEDULE_1,
  ATO_TAX_TABLES_INDEX,
  ATO_WEEKLY,
} from "@/modules/tax-tables/ato-schedules";
import { pageDatePublished } from "@/lib/page-dates";
import { withPageEnd } from "@/components/common/content-slots";
import { withFeaturedImage } from "@/lib/featured-image";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/weekly-tax-table/`;
// 23 Oct 2026 meta pass: GSC 24 Sep to 21 Oct, pos 8.2, CTR 0.39%; "weekly tax table 2026 pdf" (601 impr),
// "... pdf free download" (186) and "weekly tax table 2027 pdf" (131) now land on the hosted PDF/CSV
// (public/downloads, scripts/generate-tax-table-downloads.mjs). 2025-26 dropped from the title: it has
// its own page (/weekly-tax-table/2025-26/) and "2025 weekly tax table" had 4 impressions.
// Previous title: "Weekly Tax Table 2026-27 and 2025-26 (ATO NAT 1005)".
// Previous description: "Weekly tax table 2026-27 (ATO NAT 1005): enter your weekly pay to see the tax withheld with or without the tax-free threshold. Full table, HELP/STSL and CSV."
const files = downloads.fy === PAYG_FINANCIAL_YEAR ? downloads.files.weekly : null;
const at1000 = calculatePAYGWithholding(1_000, "weekly");
const at1000NoTft = calculatePAYGWithholding(1_000, "weekly", { claimsTaxFreeThreshold: false });
const TITLE = files
  ? `Weekly Tax Table ${PAYG_FINANCIAL_YEAR}: Free PDF and CSV (ATO NAT 1005)`
  : `Weekly Tax Table ${PAYG_FINANCIAL_YEAR} (ATO NAT 1005)`;
const DESCRIPTION = files
  ? `Free weekly tax table ${PAYG_FINANCIAL_YEAR} PDF and CSV (ATO NAT 1005), every ${formatAUD(files.step)} to ${formatAUD(files.to)}. ${formatAUD(1_000)} a week has ${formatAUD(at1000.totalWithheld)} withheld with the tax-free threshold, ${formatAUD(at1000NoTft.totalWithheld)} without.`
  : `Weekly tax table ${PAYG_FINANCIAL_YEAR} (ATO NAT 1005): ${formatAUD(1_000)} a week has ${formatAUD(at1000.totalWithheld)} withheld with the tax-free threshold, ${formatAUD(at1000NoTft.totalWithheld)} without. Full table and CSV.`;
const MODIFIED = "2026-09-23";

export const metadata: Metadata = withFeaturedImage({
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: SITE_CONFIG.name, type: "article", locale: "en_AU" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
});

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "PAYG Withholding Tables", item: `${BASE}/payg-withholding-tables/` },
    { "@type": "ListItem", position: 3, name: "Weekly Tax Table", item: URL },
  ]
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
  datePublished: pageDatePublished("weekly-tax-table"),
  headline: TITLE,
  description: DESCRIPTION,
  author: AUTHORS["anita-bell"].jsonLd,
  publisher: { "@type": "Organization", name: SITE_CONFIG.name, logo: { "@type": "ImageObject", url: `${BASE}/icon-512.png` } },
  mainEntityOfPage: { "@type": "WebPage", "@id": URL },
  dateModified: MODIFIED,
  isBasedOn: { "@type": "CreativeWork", name: `ATO ${ATO_WEEKLY.title} (${ATO_WEEKLY.nat})`, url: ATO_WEEKLY.pageUrl },
};

// These pages are published data tables, so they carry Dataset alongside Article.
const dataset: WithContext<Dataset> = {
  "@context": "https://schema.org",
  "@type": "Dataset",
  name: `Weekly PAYG withholding amounts 2026-27 (ATO ${ATO_WEEKLY.nat})`,
  description:
    `PAYG withholding amounts for weekly pay periods in the Australian 2026-27 financial year, computed from the ATO Schedule 1 (${ATO_SCHEDULE_1.nat}) coefficient method for every $1 of weekly earnings (CSV download) and in $50 steps (HTML table). Covers the tax-free threshold claimed and not claimed, study and training support loan (STSL) components, and foreign resident (Scale 3) amounts.`,
  url: URL,
  identifier: ATO_WEEKLY.nat,
  keywords: [
    "weekly tax table",
    ATO_WEEKLY.nat,
    "PAYG withholding",
    "2026-27 tax tables",
    "Australia",
  ],
  temporalCoverage: "2026-07-01/2027-06-30",
  spatialCoverage: { "@type": "Country", name: "Australia" },
  measurementTechnique: `ATO Schedule 1 (${ATO_SCHEDULE_1.nat}) statement of formulas, weekly coefficient method`,
  variableMeasured: [
    "Gross weekly earnings",
    "Amount to be withheld with the tax-free threshold",
    "Amount to be withheld without the tax-free threshold",
    "Study and training support loan (STSL) component",
    "Foreign resident amount to be withheld",
    "Net weekly pay",
  ],
  creator: { "@type": "Organization", name: SITE_CONFIG.name, url: BASE },
  isBasedOn: { "@type": "CreativeWork", name: `ATO ${ATO_WEEKLY.title} (${ATO_WEEKLY.nat})`, url: ATO_WEEKLY.pageUrl },
  includedInDataCatalog: { "@type": "DataCatalog", name: "ATO tax tables", url: ATO_TAX_TABLES_INDEX },
  distribution: [
    { "@type": "DataDownload", name: ATO_WEEKLY.pdfLabel, encodingFormat: "application/pdf", contentUrl: ATO_WEEKLY.pdfUrl },
    {
      "@type": "DataDownload",
      name: ATO_WEEKLY.xlsxLabel,
      encodingFormat: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      contentUrl: ATO_WEEKLY.xlsxUrl,
    },
  ],
  license: "https://www.ato.gov.au/about-ato/using-our-website",
  dateModified: MODIFIED,
};

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: WEEKLY_TAX_TABLE_FAQS.map((f) => ({
    "@type": "Question" as const,
    name: f.q,
    acceptedAnswer: { "@type": "Answer" as const, text: f.a },
  })),
};

function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, article, dataset, faq]} />
      <WeeklyTaxTablePage />
    </>
  );
}

export default withPageEnd(Page, "/weekly-tax-table/");
