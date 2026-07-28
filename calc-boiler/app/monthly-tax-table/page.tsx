import type { Metadata } from "next";
import MonthlyTaxTablePage from "@/modules/tax-tables/monthly-tax-table";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, Dataset, FAQPage, WebPage, Article, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS } from "@/lib/authors";
import { MONTHLY_TAX_TABLE_FAQS } from "@/modules/tax-tables/monthly-tax-table-faqs";
import {
  ATO_MONTHLY,
  ATO_SCHEDULE_1,
  ATO_TAX_TABLES_INDEX,
  MONTHLY_TABLE_ROWS,
} from "@/modules/tax-tables/ato-schedules";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/monthly-tax-table/`;
const TITLE = "Monthly Tax Table 2026-27 (NAT 1007) — ATO PAYG Amounts";
const DESCRIPTION =
  "ATO monthly tax table (NAT 1007) for 2026-27: PAYG withholding at 30 salary levels, with and without the tax-free threshold, plus HECS-HELP (STSL) and foreign resident amounts. Why monthly is not weekly times four. Direct ATO PDF and XLSX links.";
const MODIFIED = "2026-07-28";

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
    { "@type": "ListItem", position: 3, name: "Monthly Tax Table", item: URL },
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
  headline: TITLE,
  description: DESCRIPTION,
  author: AUTHORS["james-harrington"].jsonLd,
  publisher: { "@type": "Organization", name: SITE_CONFIG.name, logo: { "@type": "ImageObject", url: `${BASE}/favicon.ico` } },
  mainEntityOfPage: { "@type": "WebPage", "@id": URL },
  dateModified: MODIFIED,
  isBasedOn: { "@type": "CreativeWork", name: `ATO ${ATO_MONTHLY.title} (${ATO_MONTHLY.nat})`, url: ATO_MONTHLY.pageUrl },
};

// These pages are published data tables, so they carry Dataset alongside Article.
const dataset: WithContext<Dataset> = {
  "@context": "https://schema.org",
  "@type": "Dataset",
  name: `Monthly PAYG withholding amounts 2026-27 (ATO ${ATO_MONTHLY.nat})`,
  description:
    `PAYG withholding amounts for monthly pay periods in the Australian 2026-27 financial year, computed from the ATO Schedule 1 (${ATO_SCHEDULE_1.nat}) coefficient method across ${MONTHLY_TABLE_ROWS.length} gross earnings levels. Covers the tax-free threshold claimed and not claimed, study and training support loan (STSL) components, and foreign resident (Scale 3) amounts.`,
  url: URL,
  identifier: ATO_MONTHLY.nat,
  keywords: [
    "monthly tax table",
    ATO_MONTHLY.nat,
    "PAYG withholding",
    "2026-27 tax tables",
    "Australia",
  ],
  temporalCoverage: "2026-07-01/2027-06-30",
  spatialCoverage: { "@type": "Country", name: "Australia" },
  measurementTechnique: `ATO Schedule 1 (${ATO_SCHEDULE_1.nat}) statement of formulas — weekly coefficient method, converted by 13/3`,
  variableMeasured: [
    "Gross monthly earnings",
    "Amount to be withheld with the tax-free threshold",
    "Amount to be withheld without the tax-free threshold",
    "Study and training support loan (STSL) component",
    "Foreign resident amount to be withheld",
    "Net monthly pay",
  ],
  creator: { "@type": "Organization", name: SITE_CONFIG.name, url: BASE },
  isBasedOn: { "@type": "CreativeWork", name: `ATO ${ATO_MONTHLY.title} (${ATO_MONTHLY.nat})`, url: ATO_MONTHLY.pageUrl },
  includedInDataCatalog: { "@type": "DataCatalog", name: "ATO tax tables", url: ATO_TAX_TABLES_INDEX },
  distribution: [
    { "@type": "DataDownload", name: ATO_MONTHLY.pdfLabel, encodingFormat: "application/pdf", contentUrl: ATO_MONTHLY.pdfUrl },
    {
      "@type": "DataDownload",
      name: ATO_MONTHLY.xlsxLabel,
      encodingFormat: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      contentUrl: ATO_MONTHLY.xlsxUrl,
    },
  ],
  license: "https://www.ato.gov.au/about-ato/website-information/copyright-notice",
  dateModified: MODIFIED,
};

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: MONTHLY_TAX_TABLE_FAQS.map((f) => ({
    "@type": "Question" as const,
    name: f.q,
    acceptedAnswer: { "@type": "Answer" as const, text: f.a },
  })),
};

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, article, dataset, faq]} />
      <MonthlyTaxTablePage />
    </>
  );
}
