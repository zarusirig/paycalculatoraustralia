import type { Metadata } from "next";
import RetailHospitalityPayGuidePage from "@/modules/guide/retail-hospitality-pay-guide";
import { JsonLd } from "@/modules/seo/json-ld";
import { faqPageSchema } from "@/lib/faq";
import { RETAIL_HOSPITALITY_FAQS } from "@/modules/guide/retail-hospitality-pay-guide-faqs";
import type { BreadcrumbList, WebPage, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
const BASE = SITE_CONFIG.baseUrl; const URL = `${BASE}/retail-hospitality-pay-guide/`;
const TITLE = "Retail & Hospitality Pay — Award Rates, Penalties & Loading";
const DESCRIPTION = "Retail and hospitality pay rates: General Retail and Hospitality Industry Awards, casual loading (25%), weekend penalties and public holiday rates explained.";
export const metadata: Metadata = { title: TITLE, description: DESCRIPTION, alternates: { canonical: URL }, openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU", images: ["/og-image.png"] }, twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION } };
const breadcrumb: WithContext<BreadcrumbList> = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE }, { "@type": "ListItem", position: 2, name: "Retail & Hospitality Pay Guide", item: URL }] };
const webPage: WithContext<WebPage> = { "@context": "https://schema.org", "@type": "WebPage", name: TITLE, url: URL, publisher: { "@type": "Organization", name: SITE_CONFIG.name } };
const faq = faqPageSchema(RETAIL_HOSPITALITY_FAQS);
export default function Page() { return (<><JsonLd code={[breadcrumb, webPage, faq]} /><RetailHospitalityPayGuidePage /></>); }
