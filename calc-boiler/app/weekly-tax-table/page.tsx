import type { Metadata } from "next";
import WeeklyTaxTablePage from "@/modules/tax-tables/weekly-tax-table";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebPage, Article, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS } from "@/lib/authors";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/weekly-tax-table/`;
const TITLE = "Weekly Tax Table 2026-27 — ATO PAYG Withholding Amounts";
const DESCRIPTION = "Weekly tax table for 2026-27: look up the exact PAYG withholding on your weekly pay, with and without the tax-free threshold and HECS-HELP (STSL). Updated 1 July 2026 with the 15% rate cut.";

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
  headline: TITLE,
  description: DESCRIPTION,
  author: AUTHORS["james-harrington"].jsonLd,
  publisher: { "@type": "Organization", name: SITE_CONFIG.name, logo: { "@type": "ImageObject", url: `${BASE}/favicon.ico` } },
  mainEntityOfPage: { "@type": "WebPage", "@id": URL },
  dateModified: "2026-07-01",
  isBasedOn: { "@type": "CreativeWork", name: "ATO Weekly tax table (NAT 1005)", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-table-weekly" },
};

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Which column of the weekly tax table applies to me?", acceptedAnswer: { "@type": "Answer", text: "Use the tax-free threshold column for your main job, the no tax-free threshold column for a second job, and the STSL column if you told your employer you have a HECS-HELP or other study loan. Your TFN declaration answers decide the column." } },
    { "@type": "Question", name: "Does the weekly tax table include the Medicare levy?", acceptedAnswer: { "@type": "Answer", text: "Yes. The standard weekly tax table builds the 2% Medicare levy into every withholding amount. It does not include the Medicare Levy Surcharge, which is assessed on your tax return." } },
    { "@type": "Question", name: "What changed in the weekly tax table for 2026-27?", acceptedAnswer: { "@type": "Answer", text: "From 1 July 2026 the marginal rate on income between $18,201 and $45,000 fell from 16% to 15% under the legislated cost-of-living tax cuts, reducing weekly withholding by up to about $5 a week for anyone earning $45,000 or more." } },
    { "@type": "Question", name: "Is overtime taxed using the weekly tax table?", acceptedAnswer: { "@type": "Answer", text: "Yes. Overtime paid in a normal pay run is added to that week's gross earnings and withheld using the same table. Lump-sum bonuses and back payments use the separate Schedule 5 method instead." } },
  ]
};

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, article, faq]} />
      <WeeklyTaxTablePage />
    </>
  );
}
