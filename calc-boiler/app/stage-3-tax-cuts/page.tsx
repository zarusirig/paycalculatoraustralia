import type { Metadata } from "next";
import Stage3TaxCutsPage from "@/modules/guide/stage-3-tax-cuts";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebPage, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS, GUIDE_AUTHORSHIP } from "@/lib/authors";
const BASE = SITE_CONFIG.baseUrl; const URL = `${BASE}/stage-3-tax-cuts/`;
export const metadata: Metadata = { title: "Stage 3 Tax Cuts Explained — Before & After Comparison (FY2024-25)", description: "How the revised Stage 3 tax cuts affect your pay. Before and after comparison at every income level. See exactly how much more you take home under the new tax brackets.", alternates: { canonical: URL }, openGraph: { title: "Stage 3 Tax Cuts Explained", description: "Before & after comparison of the revised Stage 3 tax cuts at every income level.", url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU" }, twitter: { card: "summary_large_image", title: "Stage 3 Tax Cuts Explained", description: "See how much more you take home under the revised Stage 3 tax cuts." } };
const breadcrumb: WithContext<BreadcrumbList> = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE }, { "@type": "ListItem", position: 2, name: "Stage 3 Tax Cuts", item: URL }] };
const webPage: WithContext<WebPage> = { "@context": "https://schema.org", "@type": "WebPage", name: "Stage 3 Tax Cuts Explained", url: URL, publisher: { "@type": "Organization", name: SITE_CONFIG.name } };
const faq: WithContext<FAQPage> = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [{ "@type": "Question", name: "How much do the Stage 3 tax cuts save?", acceptedAnswer: { "@type": "Answer", text: "Savings range from $354 at $30,000 income to $9,075 at $200,000+. Every taxpayer earning above $18,200 receives a tax cut under the revised plan." } }, { "@type": "Question", name: "When did the Stage 3 tax cuts start?", acceptedAnswer: { "@type": "Answer", text: "The revised Stage 3 tax cuts took effect on 1 July 2024, applying from FY2024-25 onwards." } }] };
export default function Page() { return (<><JsonLd code={[breadcrumb, webPage, faq]} /><Stage3TaxCutsPage /></>); }
