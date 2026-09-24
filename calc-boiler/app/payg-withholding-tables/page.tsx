import type { Metadata } from "next";
import PAYGTablesGuidePage from "@/modules/guide/payg-withholding-tables";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, Dataset, FAQPage, WebPage, Article, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS } from "@/lib/authors";
import { PAYG_FINANCIAL_YEAR } from "@/lib/constants/payg-withholding";
import { PAYG_HUB_FAQS } from "@/modules/guide/payg-withholding-tables-faqs";
import { ATO_FORTNIGHTLY, ATO_MONTHLY, ATO_SCHEDULE_5, ATO_TAX_TABLES_INDEX, ATO_WEEKLY } from "@/modules/tax-tables/ato-schedules";
import { pageDateModified, pageDatePublished } from "@/lib/page-dates";
import { withPageEnd } from "@/components/common/content-slots";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/payg-withholding-tables/`;
// Hub intent: "which table do I use". The exact-match "weekly / fortnightly /
// monthly tax table" queries belong to the dedicated pages, which this page
// links to with exact-match anchors.
const TITLE = `PAYG Withholding Tax Tables ${PAYG_FINANCIAL_YEAR}: Weekly, Fortnightly, Monthly`;
const DESCRIPTION = `Which ATO PAYG withholding tax table to use in ${PAYG_FINANCIAL_YEAR}: weekly (NAT 1005), fortnightly (NAT 1006) and monthly (NAT 1007) tables, plus Schedule 5 for bonuses.`;

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
    { "@type": "ListItem", position: 2, name: "PAYG Withholding Tables", item: URL },
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
  datePublished: pageDatePublished("payg-withholding-tables"),
  dateModified: pageDateModified("payg-withholding-tables"),
  headline: TITLE,
  description: DESCRIPTION,
  author: AUTHORS["james-harrington"].jsonLd,
  publisher: { "@type": "Organization", name: SITE_CONFIG.name, logo: { "@type": "ImageObject", url: `${BASE}/icon-512.png` } },
  mainEntityOfPage: { "@type": "WebPage", "@id": URL },
  isBasedOn: { "@type": "Legislation", name: "Tax Administration Act 1953", url: "https://www.legislation.gov.au/Details/C2024C00327" },
};

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: PAYG_HUB_FAQS.map((f) => ({
    "@type": "Question" as const,
    name: f.q,
    acceptedAnswer: { "@type": "Answer" as const, text: f.a },
  })),
};

// Dataset mirrors the per-table pages (/weekly-tax-table/ etc.) so the whole
// tax-table template carries the same structured data. The hub indexes the
// ATO's own NAT documents (three pay-period tables + Schedule 5), so the
// creator is the ATO and each distribution points at the ATO page and PDF.
const ATO_DOCS = [ATO_WEEKLY, ATO_FORTNIGHTLY, ATO_MONTHLY, ATO_SCHEDULE_5];
const dataset: WithContext<Dataset> = {
  "@context": "https://schema.org",
  "@type": "Dataset",
  name: `ATO PAYG withholding tax tables ${PAYG_FINANCIAL_YEAR} (${ATO_DOCS.map((d) => d.nat).join(", ")})`,
  description: `The ATO PAYG withholding tax tables for the Australian ${PAYG_FINANCIAL_YEAR} financial year: ${ATO_WEEKLY.title.toLowerCase()} (${ATO_WEEKLY.nat}), ${ATO_FORTNIGHTLY.title.toLowerCase()} (${ATO_FORTNIGHTLY.nat}), ${ATO_MONTHLY.title.toLowerCase()} (${ATO_MONTHLY.nat}) and Schedule 5 for back payments, commissions and bonuses (${ATO_SCHEDULE_5.nat}). Amounts to withhold with and without the tax-free threshold, plus study and training support loan components.`,
  url: URL,
  keywords: ["PAYG withholding tables", "weekly tax table", "fortnightly tax table", "monthly tax table", `${PAYG_FINANCIAL_YEAR} tax tables`, "Australia"],
  temporalCoverage: "2026-07-01/2027-06-30",
  spatialCoverage: { "@type": "Country", name: "Australia" },
  creator: { "@type": "Organization", name: "Australian Taxation Office", url: "https://www.ato.gov.au/" },
  includedInDataCatalog: { "@type": "DataCatalog", name: "ATO tax tables", url: ATO_TAX_TABLES_INDEX },
  license: "https://www.ato.gov.au/about-ato/website-information/copyright-notice",
  distribution: ATO_DOCS.flatMap((d) => [
    { "@type": "DataDownload" as const, name: `${d.title} (${d.nat})`, encodingFormat: "text/html", contentUrl: d.pageUrl },
    ...(d.pdfUrl ? [{ "@type": "DataDownload" as const, name: `${d.title} (${d.nat}) PDF`, encodingFormat: "application/pdf", contentUrl: d.pdfUrl }] : []),
  ]),
  dateModified: pageDateModified("payg-withholding-tables"),
};

function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, article, faq, dataset]} />
      <PAYGTablesGuidePage />
    </>
  );
}

export default withPageEnd(Page, "/payg-withholding-tables/");
