import type { Metadata } from "next";
import FortnightlyTaxTablePage from "@/modules/tax-tables/fortnightly-tax-table";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, Dataset, FAQPage, WebPage, Article, WithContext } from "schema-dts";
import { SITE_CONFIG, formatAUD } from "@/lib/constants";
import { AUTHORS } from "@/lib/authors";
import { HTML_TABLE_RANGES, PAYG_FINANCIAL_YEAR, calculatePAYGWithholding } from "@/lib/constants/payg-withholding";
import { FORTNIGHTLY_TAX_TABLE_FAQS } from "@/modules/tax-tables/fortnightly-tax-table-faqs";
import {
  ATO_FORTNIGHTLY,
  ATO_SCHEDULE_1,
  ATO_TAX_TABLES_INDEX,
} from "@/modules/tax-tables/ato-schedules";
import { pageDatePublished } from "@/lib/page-dates";
import downloads from "@/modules/tax-tables/downloads-manifest.json";
import { withPageEnd } from "@/components/common/content-slots";
import { withFeaturedImage } from "@/lib/featured-image";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/fortnightly-tax-table/`;
// 5 Oct 2026: "PAYG Calculator" removed (that query belongs to /tax-withheld-calculator/); both financial years named because the 1 July rollover drives search for each.
// 23 Oct 2026 meta pass: GSC 24 Sep to 21 Oct, pos 8.7, CTR 0.51%; "fortnightly tax table 2026" 7,625 impr at
// 9.3, plus "... pdf free download" queries, now served by the hosted PDF/CSV (public/downloads,
// scripts/generate-tax-table-downloads.mjs). 2025-26 has its own page (/fortnightly-tax-table/2025-26/).
// Previous title: "Fortnightly Tax Table 2026-27 and 2025-26 (ATO NAT 1006)".
const files = downloads.fy === PAYG_FINANCIAL_YEAR ? downloads.files.fortnightly : null;
const TITLE = files
  ? `Fortnightly Tax Table ${PAYG_FINANCIAL_YEAR}: Free PDF and CSV (ATO NAT 1006)`
  : `Fortnightly Tax Table ${PAYG_FINANCIAL_YEAR} (ATO NAT 1006)`;
// Previous: "Fortnightly tax table 2026-27 (ATO NAT 1006): enter your fortnightly pay to see tax withheld with or without the tax-free threshold. Full table, HELP/STSL and CSV."
// seo-brain 25 Sep 2026 (Jev-ranked): the HTML table's range from HTML_TABLE_RANGES and the
// $2,000 worked example from the Schedule 1 engine (same call the page body makes).
const TABLE_RANGE = HTML_TABLE_RANGES.fortnightly;
const at2000 = calculatePAYGWithholding(2_000, "fortnightly");
const at2000NoTft = calculatePAYGWithholding(2_000, "fortnightly", { claimsTaxFreeThreshold: false });
// Previous (25 Sep): "ATO fortnightly tax table 2026-27 (NAT 1006), $700 to $8,000 in $100 steps: on $2,000 a fortnight, $276 is withheld with the threshold, $498 without. STSL and CSV."
const DESCRIPTION = files
  ? `Free fortnightly tax table ${PAYG_FINANCIAL_YEAR} PDF and CSV (${ATO_FORTNIGHTLY.nat}), every ${formatAUD(files.step)} to ${formatAUD(files.to)}. On ${formatAUD(2_000)} a fortnight, ${formatAUD(at2000.totalWithheld)} is withheld with the threshold, ${formatAUD(at2000NoTft.totalWithheld)} without.`
  : `ATO fortnightly tax table ${PAYG_FINANCIAL_YEAR} (${ATO_FORTNIGHTLY.nat}), ${formatAUD(TABLE_RANGE.from)} to ${formatAUD(TABLE_RANGE.to)} in ${formatAUD(TABLE_RANGE.step)} steps: on ${formatAUD(2_000)} a fortnight, ${formatAUD(at2000.totalWithheld)} is withheld with the threshold, ${formatAUD(at2000NoTft.totalWithheld)} without. STSL and CSV.`;
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
  author: AUTHORS["anita-bell"].jsonLd,
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
  measurementTechnique: `ATO Schedule 1 (${ATO_SCHEDULE_1.nat}) statement of formulas: weekly coefficient method, doubled`,
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
  license: "https://www.ato.gov.au/about-ato/using-our-website",
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

function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, article, dataset, faq]} />
      <FortnightlyTaxTablePage />
    </>
  );
}

export default withPageEnd(Page, "/fortnightly-tax-table/");
