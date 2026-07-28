import type { Metadata } from "next";
import TaxDeductionsGuidePage from "@/modules/guide/tax-deductions-guide";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebPage, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS, GUIDE_AUTHORSHIP } from "@/lib/authors";
const BASE = SITE_CONFIG.baseUrl; const URL = `${BASE}/tax-deductions-guide/`;
export const metadata: Metadata = { title: "Tax Deductions Guide Australia — Work-Related Claims", description: "Complete guide to work-related tax deductions in Australia. Common deductions, how to claim, the $300 threshold, and how deductions reduce your taxable income for FY2026-27.", alternates: { canonical: URL }, openGraph: { title: "Tax Deductions Guide Australia 2026-27", description: "Complete guide to work-related tax deductions in Australia for FY2026-27.", url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU" }, twitter: { card: "summary_large_image", title: "Tax Deductions Guide Australia 2026-27", description: "Work-related deductions explained for Australian taxpayers." } };
const breadcrumb: WithContext<BreadcrumbList> = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE }, { "@type": "ListItem", position: 2, name: "Tax Deductions Guide", item: URL }] };
const webPage: WithContext<WebPage> = { "@context": "https://schema.org", "@type": "WebPage", name: "Tax Deductions Guide Australia 2026-27", url: URL, publisher: { "@type": "Organization", name: SITE_CONFIG.name } };
const faq: WithContext<FAQPage> = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [{ "@type": "Question", name: "What is the $300 no-receipt threshold?", acceptedAnswer: { "@type": "Answer", text: "You can claim up to $300 in total work-related deductions without receipts, but you must be able to show how you calculated the amount." } }, { "@type": "Question", name: "How much tax do deductions save?", acceptedAnswer: { "@type": "Answer", text: "Deductions save tax at your marginal rate. A $1,000 deduction saves $160 at 16%, $300 at 30%, $370 at 37%, or $450 at 45%." } }] };
export default function Page() { return (<><JsonLd code={[breadcrumb, webPage, faq]} /><TaxDeductionsGuidePage /></>); }
