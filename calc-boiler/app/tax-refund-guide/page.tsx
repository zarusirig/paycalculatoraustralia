import type { Metadata } from "next";
import TaxRefundGuidePage from "@/modules/guide/tax-refund-guide";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, WebPage, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS, GUIDE_AUTHORSHIP } from "@/lib/authors";
import { faqPageSchema } from "@/lib/faq";
import { TAX_REFUND_FAQS } from "@/modules/guide/tax-refund-guide-faqs";
const BASE = SITE_CONFIG.baseUrl; const URL = `${BASE}/tax-refund-guide/`;
export const metadata: Metadata = { title: "Tax Refund Guide — How Tax Returns Work in Australia", description: "How tax refunds work: over-withholding explained, common deductions, myTax process, expected timelines. Understand your tax return.", alternates: { canonical: URL }, openGraph: { title: "Tax Refund Guide Australia", description: "Complete guide to tax refunds, deductions, and lodging.", url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU" }, twitter: { card: "summary_large_image", title: "Tax Refund Guide", description: "Understand how tax refunds work in Australia." } };
const breadcrumb: WithContext<BreadcrumbList> = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE }, { "@type": "ListItem", position: 2, name: "Tax Refund Guide", item: URL }] };
const webPage: WithContext<WebPage> = { "@context": "https://schema.org", "@type": "WebPage", name: "Tax Refund Guide", url: URL, publisher: { "@type": "Organization", name: SITE_CONFIG.name } };
const faq = faqPageSchema(TAX_REFUND_FAQS);
export default function Page() { return (<><JsonLd code={[breadcrumb, webPage, faq]} /><TaxRefundGuidePage /></>); }
