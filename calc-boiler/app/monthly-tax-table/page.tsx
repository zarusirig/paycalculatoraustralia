import type { Metadata } from "next";
import MonthlyTaxTablePage from "@/modules/tax-tables/monthly-tax-table";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebPage, Article, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS } from "@/lib/authors";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/monthly-tax-table/`;
const TITLE = "Monthly Tax Table 2026-27 — ATO PAYG Withholding Amounts";
const DESCRIPTION = "Monthly tax table for 2026-27: look up the exact PAYG withholding on your monthly salary, with and without the tax-free threshold and HECS-HELP (STSL). Updated 1 July 2026 with the 15% rate cut.";

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
  dateModified: "2026-07-01",
  isBasedOn: { "@type": "CreativeWork", name: "ATO Monthly tax table (NAT 1007)", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-table-monthly" },
};

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Is monthly withholding just the weekly amount times four?", acceptedAnswer: { "@type": "Answer", text: "No. A month is longer than four weeks, so the ATO converts monthly pay to a weekly equivalent by multiplying by 12 and dividing by 52 (about 4.33 weeks per month)." } },
    { "@type": "Question", name: "Does the monthly tax table include the Medicare levy?", acceptedAnswer: { "@type": "Answer", text: "Yes — the 2% Medicare levy is built into every standard column. The Medicare Levy Surcharge is not included and is assessed on your annual tax return." } },
    { "@type": "Question", name: "What changed in the monthly tax table for 2026-27?", acceptedAnswer: { "@type": "Answer", text: "From 1 July 2026 the marginal rate on income between $18,201 and $45,000 fell from 16% to 15%, so the monthly table withholds up to about $22 less per month than 2025-26 for anyone earning $45,000 a year or more." } },
    { "@type": "Question", name: "Why was so much tax withheld in the month I got my bonus?", acceptedAnswer: { "@type": "Answer", text: "Adding a bonus to a normal monthly pay and using this table annualises the bonus as if you earn it every month. Bonuses should be withheld under the Schedule 5 method instead, which spreads the payment across the year." } },
  ]
};

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, article, faq]} />
      <MonthlyTaxTablePage />
    </>
  );
}
