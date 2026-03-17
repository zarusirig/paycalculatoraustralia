import type { Metadata } from "next";
import WorkFromHomeDeductionsPage from "@/modules/guide/work-from-home-deductions";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebPage, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS, GUIDE_AUTHORSHIP } from "@/lib/authors";
const BASE = SITE_CONFIG.baseUrl; const URL = `${BASE}/work-from-home-deductions/`;
export const metadata: Metadata = { title: "Work From Home Tax Deductions 2025-26 — Revised Fixed Rate Method", description: "Claim work from home deductions using the revised fixed rate method (67c/hour) or actual cost method. What you can claim, records to keep, and how much you'll save.", alternates: { canonical: URL }, openGraph: { title: "Work From Home Tax Deductions 2025-26", description: "Claim WFH deductions using the revised fixed rate or actual cost method.", url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU" }, twitter: { card: "summary_large_image", title: "Work From Home Tax Deductions 2025-26", description: "WFH deductions: fixed rate vs actual cost method." } };
const breadcrumb: WithContext<BreadcrumbList> = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE }, { "@type": "ListItem", position: 2, name: "Work From Home Deductions", item: URL }] };
const webPage: WithContext<WebPage> = { "@context": "https://schema.org", "@type": "WebPage", name: "Work From Home Tax Deductions 2025-26", url: URL, publisher: { "@type": "Organization", name: SITE_CONFIG.name } };
const faq: WithContext<FAQPage> = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [{ "@type": "Question", name: "What is the fixed rate for working from home?", acceptedAnswer: { "@type": "Answer", text: "The revised fixed rate is 67 cents per hour, covering electricity, phone, internet, stationery, and computer consumables." } }, { "@type": "Question", name: "Do I need a dedicated home office?", acceptedAnswer: { "@type": "Answer", text: "No. You do not need a dedicated room to claim WFH deductions under the fixed rate method. You need a workspace where you perform work duties." } }] };
export default function Page() { return (<><JsonLd code={[breadcrumb, webPage, faq]} /><WorkFromHomeDeductionsPage /></>); }
