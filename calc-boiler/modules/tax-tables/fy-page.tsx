import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { BreadcrumbList, Dataset, FAQPage, WebPage, Article, WithContext } from "schema-dts";
import { JsonLd } from "@/modules/seo/json-ld";
import { SITE_CONFIG, formatAUD } from "@/lib/constants";
import { AUTHORS } from "@/lib/authors";
import { fitDescription, fitTitle } from "@/lib/seo-title";
import { pageDateModified, pageDatePublished } from "@/lib/page-dates";
import {
  PAYG_YEAR_INFO,
  calculatePAYGWithholding,
  type PayFrequency,
  type PaygFinancialYear,
} from "@/lib/constants/payg-withholding";
import FyTaxTablePage from "./fy-tax-table";
import { fyTaxTableFaqs } from "./fy-tax-table-faqs";
import { FY_CYCLES, fyLabel, fyPath, fyWindow, longDate, parseFy } from "./fy-tax-table-data";
import { ATO_SCHEDULE_1, ATO_TAX_TABLES_INDEX } from "./ato-schedules";

const BASE = SITE_CONFIG.baseUrl;

export function fyCanonical(frequency: PayFrequency, fy: PaygFinancialYear): string {
  return `${BASE}${fyPath(frequency, fy)}`;
}

function titleFor(frequency: PayFrequency, fy: PaygFinancialYear): string {
  const c = FY_CYCLES[frequency];
  const label = fyLabel(fy);
  return fitTitle(
    `${c.label} Tax Table ${label}: ATO ${c.ato.nat} Withholding Amounts`,
    `${c.label} Tax Table ${label}: ATO ${c.ato.nat} Amounts`,
    `${c.label} Tax Table ${label} (${c.ato.nat})`,
  );
}

function descriptionFor(frequency: PayFrequency, fy: PaygFinancialYear): string {
  const c = FY_CYCLES[frequency];
  const r = calculatePAYGWithholding(c.exampleGross, frequency, { financialYear: fy });
  const info = PAYG_YEAR_INFO[fy];
  const label = fyLabel(fy);
  const shared = info.coversYears.length > 1 ? " One ATO table for both years." : "";
  return fitDescription(
    `${c.label} tax table for ${label} (${c.ato.nat}): amounts to withhold for pay dates ${longDate(info.payDatesFrom)} to ${longDate(info.payDatesTo)}.${shared} ${formatAUD(c.exampleGross)} a ${c.period} has ${formatAUD(r.totalWithheld)} withheld.`,
    `${c.label} tax table ${label} (${c.ato.nat}): amounts to withhold for pay dates ${fyWindow(fy)}. ${formatAUD(c.exampleGross)} a ${c.period}: ${formatAUD(r.totalWithheld)} withheld.`,
    `${c.label} tax table ${label} (${c.ato.nat}): ATO amounts to withhold, which table applies to your pay date, worked example and CSV.`,
  );
}

export function fyMetadata(frequency: PayFrequency, rawFy: string): Metadata {
  const fy = parseFy(rawFy);
  if (!fy) return {};
  const title = titleFor(frequency, fy);
  const description = descriptionFor(frequency, fy);
  const url = fyCanonical(frequency, fy);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: SITE_CONFIG.name, type: "article", locale: "en_AU" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export function FyRoutePage({ frequency, rawFy }: { frequency: PayFrequency; rawFy: string }) {
  const fy = parseFy(rawFy);
  if (!fy) notFound();
  const c = FY_CYCLES[frequency];
  const info = PAYG_YEAR_INFO[fy];
  const url = fyCanonical(frequency, fy);
  const title = titleFor(frequency, fy);
  const description = descriptionFor(frequency, fy);
  const slug = `${c.slug}/${fy}`;

  const breadcrumb: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
      { "@type": "ListItem", position: 2, name: "PAYG Withholding Tables", item: `${BASE}/payg-withholding-tables/` },
      { "@type": "ListItem", position: 3, name: `${c.label} Tax Table`, item: `${BASE}/${c.slug}/` },
      { "@type": "ListItem", position: 4, name: info.label, item: url },
    ],
  };
  const webPage: WithContext<WebPage> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    url,
    description,
    inLanguage: "en-AU",
    publisher: { "@type": "Organization", name: SITE_CONFIG.name },
  };
  const article: WithContext<Article> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    datePublished: pageDatePublished(slug),
    dateModified: pageDateModified(slug),
    author: AUTHORS["anita-bell"].jsonLd,
    publisher: { "@type": "Organization", name: SITE_CONFIG.name, logo: { "@type": "ImageObject", url: `${BASE}/icon-512.png` } },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    isBasedOn: { "@type": "CreativeWork", name: `ATO ${ATO_SCHEDULE_1.title} (${ATO_SCHEDULE_1.nat})`, url: info.schedule1Url },
  };
  const dataset: WithContext<Dataset> = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `${c.label} PAYG withholding amounts ${info.label} (ATO ${c.ato.nat})`,
    description: `PAYG withholding amounts for ${c.period}ly payments made from ${fyWindow(fy)}, computed from the ATO Schedule 1 (${ATO_SCHEDULE_1.nat}) coefficient method, with and without the tax-free threshold.`,
    url,
    identifier: c.ato.nat,
    keywords: [`${c.period}ly tax table`, c.ato.nat, "PAYG withholding", ...info.coversYears.map((y) => `${y} tax tables`), "Australia"],
    temporalCoverage: `${info.payDatesFrom}/${info.payDatesTo}`,
    spatialCoverage: { "@type": "Country", name: "Australia" },
    creator: { "@type": "Organization", name: SITE_CONFIG.name, url: BASE },
    isBasedOn: { "@type": "CreativeWork", name: `ATO ${ATO_SCHEDULE_1.title} (${ATO_SCHEDULE_1.nat})`, url: info.schedule1Url },
    includedInDataCatalog: { "@type": "DataCatalog", name: "ATO tax tables", url: ATO_TAX_TABLES_INDEX },
    license: "https://www.ato.gov.au/about-ato/website-information/copyright-notice",
  };
  const faq: WithContext<FAQPage> = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: fyTaxTableFaqs(c, fy).map((f) => ({
      "@type": "Question" as const,
      name: f.q,
      acceptedAnswer: { "@type": "Answer" as const, text: f.a },
    })),
  };

  return (
    <>
      <JsonLd code={[breadcrumb, webPage, article, dataset, faq]} />
      <FyTaxTablePage frequency={frequency} fy={fy} />
    </>
  );
}
