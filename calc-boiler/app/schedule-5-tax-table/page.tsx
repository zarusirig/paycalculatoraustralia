import type { Metadata } from "next";
import Schedule5TaxTablePage from "@/modules/tax-tables/schedule-5-tax-table";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, Dataset, FAQPage, WebPage, Article, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS } from "@/lib/authors";
import { SCHEDULE_5_FAQS } from "@/modules/tax-tables/schedule-5-tax-table-faqs";
import {
  ATO_SCHEDULE_1,
  ATO_SCHEDULE_5,
  ATO_TAX_TABLES_INDEX,
  SCHEDULE_5_BONUS_ROWS,
} from "@/modules/tax-tables/ato-schedules";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/schedule-5-tax-table/`;
const TITLE = "Schedule 5 Tax Table 2026-27 (NAT 3348) — Bonus PAYG";
const DESCRIPTION =
  "ATO Schedule 5 (NAT 3348) for 2026-27: how PAYG is withheld from bonuses, commissions and back payments. Method A, B(i) and B(ii) step by step, the 47% withholding limit, and a 30-row ready reckoner.";
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
    { "@type": "ListItem", position: 3, name: "Schedule 5 Tax Table", item: URL },
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
  isBasedOn: { "@type": "CreativeWork", name: `ATO ${ATO_SCHEDULE_5.title} (${ATO_SCHEDULE_5.nat})`, url: ATO_SCHEDULE_5.pageUrl },
};

// These pages are published data tables, so they carry Dataset alongside Article.
const dataset: WithContext<Dataset> = {
  "@context": "https://schema.org",
  "@type": "Dataset",
  name: `Schedule 5 additional-payment withholding 2026-27 (ATO ${ATO_SCHEDULE_5.nat})`,
  description:
    `PAYG withholding on additional payments — bonuses, commissions and back payments — for the Australian 2026-27 financial year, computed by applying the ATO Schedule 5 (${ATO_SCHEDULE_5.nat}) apportionment steps to the Schedule 1 (${ATO_SCHEDULE_1.nat}) coefficient tables across ${SCHEDULE_5_BONUS_ROWS.length} additional-payment amounts. Includes the apportioned per-period slice, amount withheld, effective rate and net payment.`,
  url: URL,
  identifier: ATO_SCHEDULE_5.nat,
  keywords: [
    "Schedule 5 tax table",
    ATO_SCHEDULE_5.nat,
    "bonus tax",
    "back payment withholding",
    "PAYG withholding",
    "2026-27 tax tables",
    "Australia",
  ],
  temporalCoverage: "2026-07-01/2027-06-30",
  spatialCoverage: { "@type": "Country", name: "Australia" },
  measurementTechnique: `ATO Schedule 5 (${ATO_SCHEDULE_5.nat}) apportionment applied to Schedule 1 (${ATO_SCHEDULE_1.nat}) coefficient tables`,
  variableMeasured: [
    "Additional payment amount",
    "Amount apportioned to each pay period",
    "Tax withheld from the additional payment",
    "Effective withholding rate on the additional payment",
    "Net additional payment received",
  ],
  creator: { "@type": "Organization", name: SITE_CONFIG.name, url: BASE },
  isBasedOn: { "@type": "CreativeWork", name: `ATO ${ATO_SCHEDULE_5.title} (${ATO_SCHEDULE_5.nat})`, url: ATO_SCHEDULE_5.pageUrl },
  includedInDataCatalog: { "@type": "DataCatalog", name: "ATO tax tables", url: ATO_TAX_TABLES_INDEX },
  license: "https://www.ato.gov.au/about-ato/website-information/copyright-notice",
  dateModified: MODIFIED,
};

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: SCHEDULE_5_FAQS.map((f) => ({
    "@type": "Question" as const,
    name: f.q,
    acceptedAnswer: { "@type": "Answer" as const, text: f.a },
  })),
};

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, article, dataset, faq]} />
      <Schedule5TaxTablePage />
    </>
  );
}
