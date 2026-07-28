import type { Metadata } from "next";
import SaptoPage from "@/modules/guide/sapto";
import { SAPTO_FAQS } from "@/modules/guide/sapto-faqs";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebPage, WithContext } from "schema-dts";
import { SITE_CONFIG, formatAUD } from "@/lib/constants";
import { SAPTO_BANDS, SAPTO_INCOME_YEAR } from "@/lib/constants/sapto";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/sapto-calculator/`;

// Derived from the engine constants so the title, description, JSON-LD and
// rendered page can never disagree.
const SINGLE = formatAUD(SAPTO_BANDS.single.maxOffset);
const COUPLE = formatAUD(SAPTO_BANDS.couple.maxOffset);

const TITLE = `SAPTO Calculator — Seniors Tax Offset up to ${SINGLE}`;

export const metadata: Metadata = {
  title: TITLE,
  description: `Work out your seniors and pensioners tax offset instantly. Up to ${SINGLE} single, ${COUPLE} each for a couple, with the ATO's rebate income thresholds and the half-of-combined test for couples. ${SAPTO_INCOME_YEAR} income year.`,
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: "Instant SAPTO calculator using the ATO's published rates and thresholds.",
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
    { "@type": "ListItem", position: 2, name: "SAPTO Calculator", item: URL },
  ],
};

const webPage: WithContext<WebPage> = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "SAPTO Calculator",
  url: URL,
  publisher: { "@type": "Organization", name: SITE_CONFIG.name },
};

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: SAPTO_FAQS.map((f) => ({
    "@type": "Question" as const,
    name: f.q,
    acceptedAnswer: { "@type": "Answer" as const, text: f.a },
  })),
};

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, faq]} />
      <SaptoPage />
    </>
  );
}
