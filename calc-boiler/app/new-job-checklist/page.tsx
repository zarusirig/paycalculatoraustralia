import type { Metadata } from "next";
import NewJobChecklistPage from "@/modules/guide/new-job-checklist";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebPage, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS, GUIDE_AUTHORSHIP } from "@/lib/authors";
const BASE = SITE_CONFIG.baseUrl; const URL = `${BASE}/new-job-checklist/`;
export const metadata: Metadata = { title: "New Job Pay Checklist Australia — TFN, Super & Pay Setup Guide", description: "Starting a new job? Complete checklist: TFN declaration, super fund choice, salary negotiation tips, understanding your offer, and setting up your pay correctly from day one.", alternates: { canonical: URL }, openGraph: { title: "New Job Pay Checklist Australia", description: "TFN, super & pay setup checklist for your new Australian job.", url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU" }, twitter: { card: "summary_large_image", title: "New Job Pay Checklist Australia", description: "Set up your pay correctly from day one." } };
const breadcrumb: WithContext<BreadcrumbList> = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE }, { "@type": "ListItem", position: 2, name: "New Job Checklist", item: URL }] };
const webPage: WithContext<WebPage> = { "@context": "https://schema.org", "@type": "WebPage", name: "New Job Pay Checklist Australia", url: URL, publisher: { "@type": "Organization", name: SITE_CONFIG.name } };
const faq: WithContext<FAQPage> = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [{ "@type": "Question", name: "What paperwork do I need for a new job?", acceptedAnswer: { "@type": "Answer", text: "You need to complete a TFN declaration, choose a super fund (or provide your existing fund details), and provide your bank account details for salary payments." } }, { "@type": "Question", name: "Should I claim the tax-free threshold at my new job?", acceptedAnswer: { "@type": "Answer", text: "Claim the tax-free threshold at only one employer — usually the one paying you the most. If this is your only job, always claim it." } }] };
export default function Page() { return (<><JsonLd code={[breadcrumb, webPage, faq]} /><NewJobChecklistPage /></>); }
