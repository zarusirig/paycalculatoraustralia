import type { Metadata } from "next";
import WorkFromHomeDeductionsPage from "@/modules/guide/work-from-home-deductions";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, WebPage, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { faqPageSchema } from "@/lib/faq";
import { WFH_FAQS } from "@/modules/guide/work-from-home-deductions-faqs";
const BASE = SITE_CONFIG.baseUrl; const URL = `${BASE}/work-from-home-deductions/`;
export const metadata: Metadata = { title: "Work From Home Tax Deductions — Fixed Rate Method", description: "Claim work from home deductions with the fixed rate method (70c/hour for 2025-26) or actual costs: what you can claim, records to keep and how much you'll save.", alternates: { canonical: URL }, openGraph: { title: "Work From Home Tax Deductions 2025-26", description: "Claim WFH deductions using the revised fixed rate or actual cost method.", url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU", images: ["/og-image.png"] }, twitter: { card: "summary_large_image", title: "Work From Home Tax Deductions 2025-26", description: "WFH deductions: fixed rate vs actual cost method." } };
const breadcrumb: WithContext<BreadcrumbList> = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE }, { "@type": "ListItem", position: 2, name: "Work From Home Deductions", item: URL }] };
const webPage: WithContext<WebPage> = { "@context": "https://schema.org", "@type": "WebPage", name: "Work From Home Tax Deductions 2025-26", url: URL, publisher: { "@type": "Organization", name: SITE_CONFIG.name } };
const faq = faqPageSchema(WFH_FAQS);
export default function Page() { return (<><JsonLd code={[breadcrumb, webPage, faq]} /><WorkFromHomeDeductionsPage /></>); }
