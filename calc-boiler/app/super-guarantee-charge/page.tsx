import type { Metadata } from "next";
import type { Article, BreadcrumbList, FAQPage, WebPage, WithContext } from "schema-dts";
import SuperGuaranteeChargePage from "@/modules/guide/super-guarantee-charge";
import { SGC_FAQS } from "@/modules/guide/super-guarantee-charge-faqs";
import { JsonLd } from "@/modules/seo/json-ld";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS } from "@/lib/authors";
import { SUPER_GUARANTEE, SUPER_GUARANTEE_CHARGE } from "@/lib/constants/australian-tax";
import { pageDateModified, pageDatePublished } from "@/lib/page-dates";
import { withPageEnd } from "@/components/common/content-slots";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/super-guarantee-charge/`;

const C = SUPER_GUARANTEE_CHARGE.current;

const TITLE = "Super Guarantee Charge — What Late Super Costs in 2026-27";
const DESCRIPTION = `Payday Super started ${SUPER_GUARANTEE.paydaySuperStart} and rebuilt the SGC: super must reach the fund within ${C.businessDaysToPay} business days of payday. The charge and notional earnings explained.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: "The four components of the super guarantee charge under Payday Super, and how to reduce the administrative uplift to nil.",
    url: URL,
    siteName: SITE_CONFIG.name,
    type: "article",
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
    { "@type": "ListItem", position: 2, name: "Superannuation", item: `${BASE}/superannuation-guide/` },
    { "@type": "ListItem", position: 3, name: "Super Guarantee Charge", item: URL },
  ],
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
  datePublished: pageDatePublished("super-guarantee-charge"),
  dateModified: pageDateModified("super-guarantee-charge"),
  headline: TITLE,
  description: DESCRIPTION,
  author: AUTHORS["james-harrington"].jsonLd,
  publisher: {
    "@type": "Organization",
    name: SITE_CONFIG.name,
    logo: { "@type": "ImageObject", url: `${BASE}/icon-512.png` },
  },
  mainEntityOfPage: { "@type": "WebPage", "@id": URL },
  isBasedOn: {
    "@type": "Legislation",
    name: "Treasury Laws Amendment (Payday Superannuation) Act 2025",
    url: "https://www.ato.gov.au/businesses-and-organisations/super-for-employers/paying-super-on-payday",
  },
};

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: SGC_FAQS.map((f) => ({
    "@type": "Question" as const,
    name: f.q,
    acceptedAnswer: { "@type": "Answer" as const, text: f.a },
  })),
};

function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, article, faq]} />
      <SuperGuaranteeChargePage />
    </>
  );
}

export default withPageEnd(Page, "/super-guarantee-charge/");
