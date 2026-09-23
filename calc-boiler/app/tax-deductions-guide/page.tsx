import type { Metadata } from "next";
import TaxDeductionsGuidePage from "@/modules/guide/tax-deductions-guide";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, WebPage, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS, GUIDE_AUTHORSHIP } from "@/lib/authors";
import { faqPageSchema } from "@/lib/faq";
import { TAX_DEDUCTIONS_FAQS } from "@/modules/guide/tax-deductions-guide-faqs";
import { withPageEnd } from "@/components/common/content-slots";
const BASE = SITE_CONFIG.baseUrl; const URL = `${BASE}/tax-deductions-guide/`;
export const metadata: Metadata = { title: "Tax Deductions Guide Australia — Work-Related Claims", description: "Guide to work-related tax deductions in Australia: common deductions, how to claim, the $300 threshold, and how deductions cut your taxable income for FY2026-27.", alternates: { canonical: URL }, openGraph: { title: "Tax Deductions Guide Australia 2026-27", description: "Complete guide to work-related tax deductions in Australia for FY2026-27.", url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU", images: ["/og-image.png"] }, twitter: { card: "summary_large_image", title: "Tax Deductions Guide Australia 2026-27", description: "Work-related deductions explained for Australian taxpayers." } };
const breadcrumb: WithContext<BreadcrumbList> = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE }, { "@type": "ListItem", position: 2, name: "Tax Deductions Guide", item: URL }] };
const webPage: WithContext<WebPage> = { "@context": "https://schema.org", "@type": "WebPage", name: "Tax Deductions Guide Australia 2026-27", url: URL, publisher: { "@type": "Organization", name: SITE_CONFIG.name } };
const faq = faqPageSchema(TAX_DEDUCTIONS_FAQS);
function Page() { return (<><JsonLd code={[breadcrumb, webPage, faq]} /><TaxDeductionsGuidePage /></>); }

export default withPageEnd(Page, "/tax-deductions-guide/");
