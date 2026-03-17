import type { Metadata } from "next";
import AnnualLeaveGuidePage from "@/modules/guide/annual-leave-guide";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebPage, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS, GUIDE_AUTHORSHIP } from "@/lib/authors";
const BASE = SITE_CONFIG.baseUrl; const URL = `${BASE}/annual-leave-guide/`;
export const metadata: Metadata = { title: "Annual Leave Guide Australia — Entitlements, Loading & Payout Rules", description: "Annual leave explained: NES entitlements, 17.5% leave loading, pro-rata calculation, payout on termination. Complete leave rights guide.", alternates: { canonical: URL }, openGraph: { title: "Annual Leave Guide Australia", description: "Complete guide to annual leave entitlements and payout rules.", url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU" }, twitter: { card: "summary_large_image", title: "Annual Leave Guide", description: "NES leave entitlements, loading and payout rules." } };
const breadcrumb: WithContext<BreadcrumbList> = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE }, { "@type": "ListItem", position: 2, name: "Annual Leave Guide", item: URL }] };
const webPage: WithContext<WebPage> = { "@context": "https://schema.org", "@type": "WebPage", name: "Annual Leave Guide Australia", url: URL, publisher: { "@type": "Organization", name: SITE_CONFIG.name } };
const faq: WithContext<FAQPage> = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [{ "@type": "Question", name: "How much annual leave do I get?", acceptedAnswer: { "@type": "Answer", text: "Full-time employees get 4 weeks (20 days) per year. Part-time employees accrue on a pro-rata basis." } }, { "@type": "Question", name: "Is annual leave paid out when I leave?", acceptedAnswer: { "@type": "Answer", text: "Yes. All accrued but untaken annual leave must be paid out on termination." } }] };
export default function Page() { return (<><JsonLd code={[breadcrumb, webPage, faq]} /><AnnualLeaveGuidePage /></>); }
