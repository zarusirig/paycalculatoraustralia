import type { Metadata } from "next";
import ZoneTaxOffsetPage from "@/modules/guide/zone-tax-offset";
import { ZONE_FAQS } from "@/modules/guide/zone-tax-offset-faqs";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebPage, WithContext } from "schema-dts";
import { SITE_CONFIG, formatAUD } from "@/lib/constants";
import { ZONE_AREA_RATES, ZONE_OFFSET_INCOME_YEAR } from "@/lib/constants/zone-tax-offset";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/zone-tax-offset/`;

// Derived from the engine constants so a figure can never drift between the
// title, the description, the JSON-LD and the rendered page. Divergence between
// those is what put stale numbers into Google's index on /tax-on/.
const A = formatAUD(ZONE_AREA_RATES.zoneA.fixedAmount);
const B = formatAUD(ZONE_AREA_RATES.zoneB.fixedAmount);
const SPECIAL = formatAUD(ZONE_AREA_RATES.specialArea.fixedAmount);

const TITLE = `Zone Tax Offset Calculator — ${A} Zone A, ${SPECIAL} Special Area`;

export const metadata: Metadata = {
  title: TITLE,
  description: `Work out your zone tax offset instantly. Zone A ${A}, Zone B ${B}, special area ${SPECIAL}, plus dependant base amounts. Follows the ATO's T4 worksheets for the ${ZONE_OFFSET_INCOME_YEAR} income year.`,
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: "Instant zone and overseas forces tax offset calculator for remote-area Australians.",
    url: URL,
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: "en_AU",
  },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Zone Tax Offset Calculator", item: URL },
  ],
};

const webPage: WithContext<WebPage> = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Zone Tax Offset Calculator",
  url: URL,
  publisher: { "@type": "Organization", name: SITE_CONFIG.name },
};

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: ZONE_FAQS.map((f) => ({
    "@type": "Question" as const,
    name: f.q,
    acceptedAnswer: { "@type": "Answer" as const, text: f.a },
  })),
};

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, faq]} />
      <ZoneTaxOffsetPage />
    </>
  );
}
