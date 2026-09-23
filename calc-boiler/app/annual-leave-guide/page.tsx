import type { Metadata } from "next";
import AnnualLeaveGuidePage from "@/modules/guide/annual-leave-guide";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, WebPage, WithContext } from "schema-dts";
import { faqPageSchema } from "@/lib/faq";
import { ANNUAL_LEAVE_FAQS } from "@/modules/guide/annual-leave-guide-faqs";
import { SITE_CONFIG } from "@/lib/constants";
const BASE = SITE_CONFIG.baseUrl; const URL = `${BASE}/annual-leave-guide/`;
export const metadata: Metadata = { title: "Annual Leave Guide Australia — Entitlements & Payout Rules", description: "Annual leave explained: NES entitlements, 17.5% leave loading, pro-rata calculation, payout on termination. Complete leave rights guide.", alternates: { canonical: URL }, openGraph: { title: "Annual Leave Guide Australia", description: "Complete guide to annual leave entitlements and payout rules.", url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU", images: ["/og-image.png"] }, twitter: { card: "summary_large_image", title: "Annual Leave Guide", description: "NES leave entitlements, loading and payout rules." } };
const breadcrumb: WithContext<BreadcrumbList> = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE }, { "@type": "ListItem", position: 2, name: "Annual Leave Guide", item: URL }] };
const webPage: WithContext<WebPage> = { "@context": "https://schema.org", "@type": "WebPage", name: "Annual Leave Guide Australia", url: URL, publisher: { "@type": "Organization", name: SITE_CONFIG.name } };
const faq = faqPageSchema(ANNUAL_LEAVE_FAQS);
export default function Page() { return (<><JsonLd code={[breadcrumb, webPage, faq]} /><AnnualLeaveGuidePage /></>); }
