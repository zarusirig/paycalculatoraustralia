import type { Metadata } from "next";
import OvertimePenaltyRatesGuidePage from "@/modules/guide/overtime-penalty-rates-guide";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebPage, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS, GUIDE_AUTHORSHIP } from "@/lib/authors";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/overtime-penalty-rates-guide/`;

export const metadata: Metadata = {
  title: "Overtime & Penalty Rates — NES Provisions & Award Rates",
  description: "Overtime and penalty rates: NES provisions, common award multipliers, casual vs permanent rates. Tables for weekend, public holiday and overtime pay.",
  alternates: { canonical: URL },
  openGraph: { title: "Overtime & Penalty Rates Guide", description: "Complete guide to overtime pay and penalty rates in Australia.", url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU" },
  twitter: { card: "summary_large_image", title: "Overtime & Penalty Rates Guide", description: "Penalty rate tables by award and NES overtime rules." },
};

const breadcrumb: WithContext<BreadcrumbList> = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE }, { "@type": "ListItem", position: 2, name: "Overtime & Penalty Rates Guide", item: URL }] };
const webPage: WithContext<WebPage> = { "@context": "https://schema.org", "@type": "WebPage", name: "Overtime & Penalty Rates Guide", url: URL, description: "NES overtime provisions and common award penalty rate tables.", publisher: { "@type": "Organization", name: SITE_CONFIG.name } };
const faq: WithContext<FAQPage> = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [
  { "@type": "Question", name: "How is overtime taxed?", acceptedAnswer: { "@type": "Answer", text: "Overtime is added to your regular income and taxed at your marginal rate." } },
  { "@type": "Question", name: "Do I get super on overtime?", acceptedAnswer: { "@type": "Answer", text: "Generally no. Overtime is not considered Ordinary Time Earnings (OTE) and does not attract the 12% SG." } },
] };

export default function Page() {
  return (<><JsonLd code={[breadcrumb, webPage, faq]} /><OvertimePenaltyRatesGuidePage /></>);
}
