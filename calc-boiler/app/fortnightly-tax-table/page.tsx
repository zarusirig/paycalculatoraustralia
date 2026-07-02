import type { Metadata } from "next";
import FortnightlyTaxTablePage from "@/modules/tax-tables/fortnightly-tax-table";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebPage, Article, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS } from "@/lib/authors";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/fortnightly-tax-table/`;
const TITLE = "Fortnightly Tax Table 2026-27 — ATO PAYG Withholding";
const DESCRIPTION = "Fortnightly tax table for 2026-27: look up the exact PAYG withholding on your fortnightly pay, with and without the tax-free threshold and HECS-HELP (STSL). Updated 1 July 2026 with the 15% rate cut.";

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
  headline: TITLE,
  description: DESCRIPTION,
  author: AUTHORS["james-harrington"].jsonLd,
  publisher: { "@type": "Organization", name: SITE_CONFIG.name, logo: { "@type": "ImageObject", url: `${BASE}/favicon.ico` } },
  mainEntityOfPage: { "@type": "WebPage", "@id": URL },
  dateModified: "2026-07-01",
  isBasedOn: { "@type": "CreativeWork", name: "ATO Fortnightly tax table (NAT 1006)", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-table-fortnightly" },
};

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Is fortnightly withholding just double the weekly amount?", acceptedAnswer: { "@type": "Answer", text: "Almost. The ATO derives the fortnightly table by doubling weekly earnings and doubling the weekly withholding, so it tracks the weekly table exactly apart from rounding." } },
    { "@type": "Question", name: "What happens in a 27-fortnight year?", acceptedAnswer: { "@type": "Answer", text: "Some years contain 27 fortnightly pay days instead of 26. Because the table assumes 26 pays, the extra pay can leave you slightly under-withheld. The ATO publishes an optional additional withholding amount to cover it." } },
    { "@type": "Question", name: "Does the fortnightly tax table include the Medicare levy?", acceptedAnswer: { "@type": "Answer", text: "Yes — the standard columns build the 2% Medicare levy into every amount. The Medicare Levy Surcharge is not included and is assessed on your annual tax return." } },
    { "@type": "Question", name: "What changed in the fortnightly tax table for 2026-27?", acceptedAnswer: { "@type": "Answer", text: "From 1 July 2026 the marginal rate on income between $18,201 and $45,000 dropped from 16% to 15%, reducing fortnightly withholding by up to about $10 a fortnight for anyone earning $45,000 a year or more." } },
  ]
};

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, article, faq]} />
      <FortnightlyTaxTablePage />
    </>
  );
}
