import type { Metadata } from "next";
import PublicServicePayScalesPage from "@/modules/guide/public-service-pay-scales";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, ItemList, WithContext } from "schema-dts";
import { SITE_CONFIG, formatAUD } from "@/lib/constants";
import { ORGANIZATION_SCHEMA } from "@/lib/schema";
import { JURISDICTIONS, PUBLIC_SERVICE_PAY_FAQS } from "@/lib/data/public-service-pay";
import { APS } from "@/lib/data/public-service-pay/aps";
import { withPageEnd } from "@/components/common/content-slots";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/public-service-pay-scales/`;
// "vps salary": the hub outranked /vic/ (Sep 2026). VPS-specific terms stay
// out of this title, H1, intro and description; the hub links to /vic/ with
// the anchor "VPS salary 2026" instead.
// Previous: "Public Service Pay Scales 2026 — APS, States & Territories"
// seo-brain 25 Sep 2026 (Jev-ranked): keep tokens public/service/scale; "APS level salaries" is
// the phrasing behind the page's top queries.
const TITLE = "Public Service Pay Scales 2026: APS Level Salaries and All States";
// APSC survey figures (31 Dec 2025) from lib/data/public-service-pay/aps —
// the same bands the APS section renders, so the description cannot drift.
const APSC_SURVEY = APS.schedules.find((s) => s.id === "apsc-2025")!;
const apsBand = (code: string) => APSC_SURVEY.streams[0].bands.find((b) => b.code === code)!;
const APS4 = apsBand("APS 4");
const APS6 = apsBand("APS 6");
// Previous: "What every public service level pays in 2026: APS, Victoria, QLD AO, NSW Clerk, WA, SA ASO, TAS Band, ACT ASO and NT AO rates, each with source and take-home pay."
// seo-brain 25 Sep 2026 (Jev-ranked): answers "aps 4 salary" / "aps 6 salary" with the survey figures.
const DESCRIPTION =
  `APS 4 salary: ${formatAUD(APS4.median!)} median at 31 Dec 2025; 90% of APS 6 staff earn ${formatAUD(APS6.min)} to ${formatAUD(APS6.max)}. Pay scale tables for the APS and all ${JURISDICTIONS.length - 1} state and territory services.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: "en_AU",
    images: ["/og-image.png"],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Public Service Pay Scales", item: URL },
  ],
};

// Built from the same array the page renders, so the structured data cannot
// drift from the visible answers.
const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: PUBLIC_SERVICE_PAY_FAQS.map((f) => ({
    "@type": "Question" as const,
    name: f.q,
    acceptedAnswer: { "@type": "Answer" as const, text: f.a },
  })),
};

const itemList: WithContext<ItemList> = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Australian public service pay scales",
  itemListElement: JURISDICTIONS.map((jurisdiction, index) => ({
    "@type": "ListItem" as const,
    position: index + 1,
    name: `${jurisdiction.name} pay scales`,
    url: `${BASE}/public-service-pay-scales/${jurisdiction.slug}/`,
  })),
};

function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, faq, itemList, ORGANIZATION_SCHEMA]} />
      <PublicServicePayScalesPage />
    </>
  );
}

export default withPageEnd(Page, "/public-service-pay-scales/");
