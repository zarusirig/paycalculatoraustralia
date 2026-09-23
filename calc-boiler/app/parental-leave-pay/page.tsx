import type { Metadata } from "next";
import ParentalLeavePayPage from "@/modules/guide/parental-leave-pay";
import { PPL_FAQS } from "@/modules/calculator/centrelink-w3-faqs";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import { SITE_CONFIG, formatAUD } from "@/lib/constants";
import { ORGANIZATION_SCHEMA } from "@/lib/schema";
import { PPL_CURRENT_FY, PPL_ENTITLEMENT, PPL_RATES, PPL_SOURCES } from "@/lib/constants/paid-parental-leave";
import { withPageEnd } from "@/components/common/content-slots";

// W3 (23 Sep 2026): retargeted from "Parental Leave Pay Guide" to
// "Paid Parental Leave" (14.8k) / "paid parental leave australia" (6.6k) /
// "parental leave centrelink" (5.4k). URL unchanged.

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/parental-leave-pay/`;
const NOW = PPL_ENTITLEMENT[PPL_ENTITLEMENT.length - 1];
const RATE = PPL_RATES[PPL_CURRENT_FY];
const TITLE = "Paid Parental Leave Calculator 2026 — 26 Weeks, Pay & Super";
const DESCRIPTION = `Paid Parental Leave in Australia: ${NOW.weeks} weeks (${NOW.days} days) for babies born from ${NOW.label}, ${formatAUD(RATE.weekly, 2)} a week in 2026-27, ${NOW.reservedForPartner} days for partners, 12% super.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU", images: ["/og-image.png"] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Paid Parental Leave Calculator", item: URL },
  ],
};

const webApp: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Paid Parental Leave Calculator",
  url: URL,
  description: DESCRIPTION,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
  creator: { "@type": "Organization", name: SITE_CONFIG.name },
  dateModified: PPL_SOURCES.verifiedOnISO,
  inLanguage: "en-AU",
};

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: PPL_FAQS.map((f) => ({ "@type": "Question" as const, name: f.q, acceptedAnswer: { "@type": "Answer" as const, text: f.a } })),
};

function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webApp, faq, ORGANIZATION_SCHEMA as unknown as WithContext<WebApplication>]} />
      <ParentalLeavePayPage />
    </>
  );
}

export default withPageEnd(Page, "/parental-leave-pay/");
