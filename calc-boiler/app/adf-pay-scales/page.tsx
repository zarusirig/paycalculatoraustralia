import type { Metadata } from "next";
import type { BreadcrumbList, FAQPage, WebPage, WithContext } from "schema-dts";
import { AdfPayScalesHub, ADF_HUB_FAQS } from "@/modules/guide/adf-pay-scales";
import { JsonLd } from "@/modules/seo/json-ld";
import { SITE_CONFIG } from "@/lib/constants";
import { ORGANIZATION_SCHEMA } from "@/lib/schema";
import { withPageEnd } from "@/components/common/content-slots";
import { withFeaturedImage } from "@/lib/featured-image";
import { ADF_HUB_SEARCH_TITLE, adfHubSearchDescription } from "@/lib/data/adf-pay/meta";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/adf-pay-scales/`;
const TITLE = "ADF Ranks & Pay Scales 2026: Army, Navy & RAAF Salary";
const DESCRIPTION =
  "Army, Navy and RAAF ranks and pay (PACMAN, from 6 November 2025): Private $79,096–$126,292, officers from $87,091, recruits $60,517. Rank list and take-home pay.";

// Search-shaped metadata (23 Oct 2026, lib/data/adf-pay/meta.ts): "adf pay scales" first. The schema below keeps TITLE/DESCRIPTION.
const META_TITLE = ADF_HUB_SEARCH_TITLE;
const META_DESCRIPTION = adfHubSearchDescription();

export const metadata: Metadata = withFeaturedImage({
  title: META_TITLE,
  description: META_DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: META_TITLE, description: META_DESCRIPTION, url: URL, siteName: SITE_CONFIG.name, type: "article", locale: "en_AU" },
  twitter: { card: "summary_large_image", title: META_TITLE, description: META_DESCRIPTION },
});

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "ADF Pay Scales", item: URL },
  ],
};

const webPage: WithContext<WebPage> = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${URL}#webpage`,
  name: TITLE,
  url: URL,
  description: DESCRIPTION,
  inLanguage: "en-AU",
  dateModified: "2026-09-23",
  publisher: { "@type": "Organization", name: SITE_CONFIG.name },
};

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: ADF_HUB_FAQS.map((f) => ({
    "@type": "Question" as const,
    name: f.q,
    acceptedAnswer: { "@type": "Answer" as const, text: f.a },
  })),
};

function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, faq, ORGANIZATION_SCHEMA]} />
      <AdfPayScalesHub />
    </>
  );
}

export default withPageEnd(Page, "/adf-pay-scales/");
