import type { Metadata } from "next";
import type { Article, BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import PaydaySuperPage from "@/modules/guide/payday-super";
import { PAYDAY_SUPER_FAQS } from "@/modules/guide/payday-super-faqs";
import { JsonLd } from "@/modules/seo/json-ld";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS } from "@/lib/authors";
import { SUPER_GUARANTEE, SUPER_GUARANTEE_CHARGE } from "@/lib/constants/australian-tax";
import { PAYDAY_SUPER_LAW, PAYDAY_SUPER_SOURCES } from "@/lib/constants/payday-super";
import { withPageEnd } from "@/components/common/content-slots";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/payday-super/`;
const RATE = `${SUPER_GUARANTEE.rate * 100}%`;
const DAYS = SUPER_GUARANTEE_CHARGE.current.businessDaysToPay;

const TITLE = "Payday Super 2026: Super Paid Every Payday + Calculator";
const DESCRIPTION = `Payday Super started ${SUPER_GUARANTEE.paydaySuperStart}: employers pay ${RATE} super with every pay, received by your fund within ${DAYS} business days. Calculate super per pay and the due date.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: `How Payday Super works from ${SUPER_GUARANTEE.paydaySuperStart}, the ${DAYS}-business-day rule, and what to check on your payslip.`,
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
    { "@type": "ListItem", position: 3, name: "Payday Super", item: URL },
  ],
};

const article: WithContext<Article> = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: TITLE,
  description: DESCRIPTION,
  author: AUTHORS["james-harrington"].jsonLd,
  publisher: {
    "@type": "Organization",
    name: SITE_CONFIG.name,
    logo: { "@type": "ImageObject", url: `${BASE}/icon-512.png` },
  },
  datePublished: "2026-09-23",
  dateModified: "2026-09-23",
  mainEntityOfPage: { "@type": "WebPage", "@id": URL },
  isBasedOn: {
    "@type": "Legislation",
    name: `${PAYDAY_SUPER_LAW.act} (${PAYDAY_SUPER_LAW.actNumber})`,
    url: PAYDAY_SUPER_SOURCES.act,
  },
};

const webApp: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Payday Super Calculator",
  url: URL,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
  inLanguage: "en-AU",
};

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: PAYDAY_SUPER_FAQS.map((f) => ({
    "@type": "Question" as const,
    name: f.q,
    acceptedAnswer: { "@type": "Answer" as const, text: f.a },
  })),
};

function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, article, webApp, faq]} />
      <PaydaySuperPage />
    </>
  );
}

export default withPageEnd(Page, "/payday-super/");
