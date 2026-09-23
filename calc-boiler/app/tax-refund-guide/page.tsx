import type { Metadata } from "next";
import TaxRefundGuidePage from "@/modules/guide/tax-refund-guide";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebPage, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { RETURN_2026 } from "@/lib/constants/tax-return-2025-26";
import { AUTHORS, GUIDE_AUTHORSHIP } from "@/lib/authors";
const BASE = SITE_CONFIG.baseUrl; const URL = `${BASE}/tax-refund-guide/`;
export const metadata: Metadata = { title: "Tax Refund Guide — How Tax Returns Work in Australia", description: "How tax refunds work: over-withholding explained, common deductions, myTax process, expected timelines. Understand your tax return.", alternates: { canonical: URL }, openGraph: { title: "Tax Refund Guide Australia", description: "Complete guide to tax refunds, deductions, and lodging.", url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU", images: ["/og-image.png"] }, twitter: { card: "summary_large_image", title: "Tax Refund Guide", description: "Understand how tax refunds work in Australia." } };
const breadcrumb: WithContext<BreadcrumbList> = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE }, { "@type": "ListItem", position: 2, name: "Tax Refund Guide", item: URL }] };
const webPage: WithContext<WebPage> = { "@context": "https://schema.org", "@type": "WebPage", name: "Tax Refund Guide", url: URL, publisher: { "@type": "Organization", name: SITE_CONFIG.name } };
const faq: WithContext<FAQPage> = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [{ "@type": "Question", name: "How long does a tax refund take?", acceptedAnswer: { "@type": "Answer", text: `The ATO says most returns lodged online with myTax process in ${RETURN_2026.onlineProcessingBusinessDays} business days and most refunds issue within ${RETURN_2026.onlineRefundTypical}. For paper returns, most refunds issue within ${RETURN_2026.paperRefundBusinessDays} business days.` } }] };
export default function Page() { return (<><JsonLd code={[breadcrumb, webPage, faq]} /><TaxRefundGuidePage /></>); }
