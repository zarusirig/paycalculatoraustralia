import type { Metadata } from "next";
import MiningFIFOPayGuidePage from "@/modules/guide/mining-fifo-pay-guide";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, WebPage, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS } from "@/lib/authors";
import { faqPageSchema } from "@/lib/faq";
import { MINING_FIFO_FAQS } from "@/modules/guide/mining-fifo-pay-guide-faqs";
const BASE = SITE_CONFIG.baseUrl; const URL = `${BASE}/mining-fifo-pay-guide/`;
const TITLE = "Mining & FIFO Pay Guide — Salary, Rosters & Allowances";
const DESCRIPTION = "Mining and FIFO pay explained: average salaries ($100K–$200K+), roster structures, FIFO allowances, zone tax offset, overtime rates, and take-home pay calculation.";
export const metadata: Metadata = { title: TITLE, description: DESCRIPTION, alternates: { canonical: URL }, openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU" }, twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION } };
const breadcrumb: WithContext<BreadcrumbList> = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE }, { "@type": "ListItem", position: 2, name: "Mining & FIFO Pay Guide", item: URL }] };
const webPage: WithContext<WebPage> = { "@context": "https://schema.org", "@type": "WebPage", name: TITLE, url: URL, publisher: { "@type": "Organization", name: SITE_CONFIG.name } };
const faq = faqPageSchema(MINING_FIFO_FAQS);
export default function Page() { return (<><JsonLd code={[breadcrumb, webPage, faq]} /><MiningFIFOPayGuidePage /></>); }
