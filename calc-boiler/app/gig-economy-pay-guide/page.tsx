import type { Metadata } from "next";
import GigEconomyPayGuidePage from "@/modules/guide/gig-economy-pay-guide";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, WebPage, WithContext } from "schema-dts";
import { faqPageSchema } from "@/lib/faq";
import { GIG_ECONOMY_FAQS } from "@/modules/guide/gig-economy-pay-guide-faqs";
import { SITE_CONFIG } from "@/lib/constants";
const BASE = SITE_CONFIG.baseUrl; const URL = `${BASE}/gig-economy-pay-guide/`;
export const metadata: Metadata = { title: "Gig Economy Tax Guide — Uber, Deliveroo & Freelance Pay", description: "Gig worker tax guide: ABN obligations, GST registration, quarterly BAS and deductions for rideshare, delivery and freelance work when you're your own boss.", alternates: { canonical: URL }, openGraph: { title: "Gig Economy Tax Guide Australia", description: "Tax & pay guide for Uber, delivery, and freelance workers in Australia.", url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU", images: ["/og-image.png"] }, twitter: { card: "summary_large_image", title: "Gig Economy Tax Guide Australia", description: "ABN, GST, BAS and deductions for gig workers." } };
const breadcrumb: WithContext<BreadcrumbList> = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE }, { "@type": "ListItem", position: 2, name: "Gig Economy Pay Guide", item: URL }] };
const webPage: WithContext<WebPage> = { "@context": "https://schema.org", "@type": "WebPage", name: "Gig Economy Tax Guide Australia", url: URL, publisher: { "@type": "Organization", name: SITE_CONFIG.name } };
const faq = faqPageSchema(GIG_ECONOMY_FAQS);
export default function Page() { return (<><JsonLd code={[breadcrumb, webPage, faq]} /><GigEconomyPayGuidePage /></>); }
