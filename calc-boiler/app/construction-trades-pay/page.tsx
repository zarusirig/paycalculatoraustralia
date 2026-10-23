import type { Metadata } from "next";
import ConstructionTradesPayPage from "@/modules/guide/construction-trades-pay";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, WebPage, WithContext } from "schema-dts";
import { faqPageSchema } from "@/lib/faq";
import { APPRENTICE_ELECTRICIAN, CONSTRUCTION_TRADES_FAQS } from "@/modules/guide/construction-trades-pay-faqs";
import { SITE_CONFIG, formatAUD } from "@/lib/constants";
import { withPageEnd } from "@/components/common/content-slots";
import { withFeaturedImage } from "@/lib/featured-image";
const BASE = SITE_CONFIG.baseUrl; const URL = `${BASE}/construction-trades-pay/`;
// Meta intent pass, 23 Oct 2026: found for apprentice wage and "how much do
// tradesmen make" queries (pos 9.7, 0.4% CTR). Title leads with pay rates and
// the year; the description quotes the apprentice electrician rates the page
// opens with (MA000025 Schedule B.4).
const TITLE = "Construction & Trades Pay Rates 2026: Tradie & Apprentice Wages";
const DESCRIPTION = `What tradies earn in Australia: salary ranges by trade, apprentice electrician wages from ${formatAUD(APPRENTICE_ELECTRICIAN[0].hourly, 2)} to ${formatAUD(APPRENTICE_ELECTRICIAN[3].hourly, 2)} an hour, site allowances, overtime and take-home pay.`;
export const metadata: Metadata = withFeaturedImage({ title: TITLE, description: DESCRIPTION, alternates: { canonical: URL }, openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU" }, twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION } });
const breadcrumb: WithContext<BreadcrumbList> = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE }, { "@type": "ListItem", position: 2, name: "Construction & Trades Pay Guide", item: URL }] };
const webPage: WithContext<WebPage> = { "@context": "https://schema.org", "@type": "WebPage", name: "Construction & Trades Pay Guide - Tradie & Apprentice Rates", url: URL, publisher: { "@type": "Organization", name: SITE_CONFIG.name } };
const faq = faqPageSchema(CONSTRUCTION_TRADES_FAQS);
function Page() { return (<><JsonLd code={[breadcrumb, webPage, faq]} /><ConstructionTradesPayPage /></>); }

export default withPageEnd(Page, "/construction-trades-pay/");
