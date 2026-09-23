import type { Metadata } from "next";
import FortnightlyTaxTablePage from "@/modules/tax-tables/fortnightly-tax-table";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, Dataset, FAQPage, WebPage, Article, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS } from "@/lib/authors";
import { PAYG_FINANCIAL_YEAR, PAYG_PREVIOUS_FINANCIAL_YEAR } from "@/lib/constants/payg-withholding";
import { FORTNIGHTLY_TAX_TABLE_FAQS } from "@/modules/tax-tables/fortnightly-tax-table-faqs";
import {
  ATO_FORTNIGHTLY,
  ATO_SCHEDULE_1,
  ATO_TAX_TABLES_INDEX,
} from "@/modules/tax-tables/ato-schedules";
import { pageDatePublished } from "@/lib/page-dates";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/fortnightly-tax-table/`;
const TITLE = `Fortnightly Tax Table ${PAYG_FINANCIAL_YEAR} (ATO NAT 1006) — PAYG Calculator`;
const DESCRIPTION =
  `Fortnightly tax table ${PAYG_FINANCIAL_YEAR} (ATO NAT 1006): enter your fortnightly pay to see the tax withheld with or without the tax-free threshold. Full table, HELP/STSL, ${PAYG_PREVIOUS_FINANCIAL_YEAR} toggle and CSV download.`;
const MODIFIED = "2026-09-23";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: SITE_CONFIG.name, type: "article", locale: "en_AU" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "PAYG Withholding Tables", item: `${BASE}/payg-withholding-tables/` },
    { "@type": "ListItem", position: 3, name: "Fortnightly Tax Table", item: URL },
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
  datePublished: pageDatePublished("fortnightly-tax-table"),
  headline: TITLE,
  description: DESCRIPTION,
  author: AUTHORS["james-harrington"].jsonLd,
  publisher: { "@type": "Organization", name: SITE_CONFIG.name, logo: { "@type": "ImageObject", url: `${BASE}/icon-512.png` } },
  mainEntityOfPage: { "@type": "WebPage", "@id": URL },
  dateModified: MODIFIED,
  isBasedOn: { "@type": "CreativeWork", name: `ATO ${ATO_FORTNIGHTLY.title} (${ATO_FORTNIGHTLY.nat})`, url: ATO_FORTNIGHTLY.pageUrl },
};

// These pages are published data tables, so they carry Dataset alongside Article.
const dataset: WithContext<Dataset> = {
  "@context": "https://schema.org",
  "@type": "Dataset",
  name: `Fortnightly PAYG withholding amounts 2026-27 (ATO ${ATO_FORTNIGHTLY.nat})`,
  description:
    `PAYG withholding amounts for fortnightly pay periods in the Australian 2026-27 financial year, computed from the ATO Schedule 1 (${ATO_SCHEDULE_1.nat}) coefficient method for every $2 of fortnightly earnings (CSV download) and in $100 steps (HTML table). Covers the tax-free threshold claimed and not claimed, study and training support loan (STSL) components, and foreign resident (Scale 3) amounts.`,
  url: URL,
  identifier: ATO_FORTNIGHTLY.nat,
  keywords: [
    "fortnightly tax table",
    ATO_FORTNIGHTLY.nat,
    "PAYG withholding",
    "2026-27 tax tables",
    "Australia",
  ],
  temporalCoverage: "2026-07-01/2027-06-30",
  spatialCoverage: { "@type": "Country", name: "Australia" },
  measurementTechnique: `ATO Schedule 1 (${ATO_SCHEDULE_1.nat}) statement of formulas — weekly coefficient method, doubled`,
  variableMeasured: [
    "Gross fortnightly earnings",
    "Amount to be withheld with the tax-free threshold",
    "Amount to be withheld without the tax-free threshold",
    "Study and training support loan (STSL) component",
    "Foreign resident amount to be withheld",
    "Net fortnightly pay",
  ],
  creator: { "@type": "Organization", name: SITE_CONFIG.name, url: BASE },
  isBasedOn: { "@type": "CreativeWork", name: `ATO ${ATO_FORTNIGHTLY.title} (${ATO_FORTNIGHTLY.nat})`, url: ATO_FORTNIGHTLY.pageUrl },
  includedInDataCatalog: { "@type": "DataCatalog", name: "ATO tax tables", url: ATO_TAX_TABLES_INDEX },
  distribution: [
    { "@type": "DataDownload", name: ATO_FORTNIGHTLY.pdfLabel, encodingFormat: "application/pdf", contentUrl: ATO_FORTNIGHTLY.pdfUrl },
    {
      "@type": "DataDownload",
      name: ATO_FORTNIGHTLY.xlsxLabel,
      encodingFormat: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      contentUrl: ATO_FORTNIGHTLY.xlsxUrl,
    },
  ],
  license: "https://www.ato.gov.au/about-ato/website-information/copyright-notice",
  dateModified: MODIFIED,
};

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FORTNIGHTLY_TAX_TABLE_FAQS.map((f) => ({
    "@type": "Question" as const,
    name: f.q,
    acceptedAnswer: { "@type": "Answer" as const, text: f.a },
  })),
};

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, article, dataset, faq]} />
      <FortnightlyTaxTablePage />
    </>
  );
}
