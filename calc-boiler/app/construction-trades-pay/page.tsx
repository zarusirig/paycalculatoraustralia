import type { Metadata } from "next";
import ConstructionTradesPayPage from "@/modules/guide/construction-trades-pay";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, WebPage, WithContext } from "schema-dts";
import { faqPageSchema } from "@/lib/faq";
import { CONSTRUCTION_TRADES_FAQS } from "@/modules/guide/construction-trades-pay-faqs";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS } from "@/lib/authors";
const BASE = SITE_CONFIG.baseUrl; const URL = `${BASE}/construction-trades-pay/`;
const TITLE = "Construction & Trades Pay Guide — Tradie & Apprentice Rates";
const DESCRIPTION = "Construction and trades pay rates: apprentice wages, qualified trade rates, labourer pay, overtime, site allowances, and take-home pay for tradies in Australia.";
export const metadata: Metadata = { title: TITLE, description: DESCRIPTION, alternates: { canonical: URL }, openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU" }, twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION } };
const breadcrumb: WithContext<BreadcrumbList> = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE }, { "@type": "ListItem", position: 2, name: "Construction & Trades Pay Guide", item: URL }] };
const webPage: WithContext<WebPage> = { "@context": "https://schema.org", "@type": "WebPage", name: TITLE, url: URL, publisher: { "@type": "Organization", name: SITE_CONFIG.name } };
const faq = faqPageSchema(CONSTRUCTION_TRADES_FAQS);
export default function Page() { return (<><JsonLd code={[breadcrumb, webPage, faq]} /><ConstructionTradesPayPage /></>); }
