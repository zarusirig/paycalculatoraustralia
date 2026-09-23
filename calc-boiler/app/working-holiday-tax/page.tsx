import type { Metadata } from "next";
import WorkingHolidayTaxPage from "@/modules/guide/working-holiday-tax";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, WebPage, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { faqPageSchema } from "@/lib/faq";
import { WORKING_HOLIDAY_TAX_FAQS } from "@/modules/guide/working-holiday-tax-faqs";
const BASE = SITE_CONFIG.baseUrl; const URL = `${BASE}/working-holiday-tax/`;
export const metadata: Metadata = { title: "Working Holiday Maker Tax Rate — 417 & 462 Visa Guide", description: "Working holiday tax rates explained: 15% flat rate up to $45K, employer obligations, departure refunds. Complete backpacker tax guide for FY2026-27.", alternates: { canonical: URL }, openGraph: { title: "Working Holiday Tax Rate Australia", description: "417 & 462 visa tax rates, employer registration, and DASP claims.", url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU", images: ["/og-image.png"] }, twitter: { card: "summary_large_image", title: "Working Holiday Tax Guide", description: "15% flat rate explained for 417/462 visa holders." } };
const breadcrumb: WithContext<BreadcrumbList> = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE }, { "@type": "ListItem", position: 2, name: "Working Holiday Tax", item: URL }] };
const webPage: WithContext<WebPage> = { "@context": "https://schema.org", "@type": "WebPage", name: "Working Holiday Maker Tax Guide", url: URL, publisher: { "@type": "Organization", name: SITE_CONFIG.name } };
const faq = faqPageSchema(WORKING_HOLIDAY_TAX_FAQS);
export default function Page() { return (<><JsonLd code={[breadcrumb, webPage, faq]} /><WorkingHolidayTaxPage /></>); }
