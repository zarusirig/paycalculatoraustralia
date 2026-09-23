import type { Metadata } from "next";
import Stage3TaxCutsPage from "@/modules/guide/stage-3-tax-cuts";
import { faqPageSchema } from "@/lib/faq";
import { STAGE_3_FAQS } from "@/modules/guide/stage-3-tax-cuts-faqs";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, WebPage, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS, GUIDE_AUTHORSHIP } from "@/lib/authors";
const BASE = SITE_CONFIG.baseUrl; const URL = `${BASE}/stage-3-tax-cuts/`;
export const metadata: Metadata = { title: "Stage 3 Tax Cuts Explained — Before & After (FY2024-25)", description: "How the revised Stage 3 tax cuts affect your pay. Before and after comparison at every income level: see how much more you take home under the new brackets.", alternates: { canonical: URL }, openGraph: { title: "Stage 3 Tax Cuts Explained", description: "Before & after comparison of the revised Stage 3 tax cuts at every income level.", url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU", images: ["/og-image.png"] }, twitter: { card: "summary_large_image", title: "Stage 3 Tax Cuts Explained", description: "See how much more you take home under the revised Stage 3 tax cuts." } };
const breadcrumb: WithContext<BreadcrumbList> = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE }, { "@type": "ListItem", position: 2, name: "Stage 3 Tax Cuts", item: URL }] };
const webPage: WithContext<WebPage> = { "@context": "https://schema.org", "@type": "WebPage", name: "Stage 3 Tax Cuts Explained", url: URL, publisher: { "@type": "Organization", name: SITE_CONFIG.name } };
const faq = faqPageSchema(STAGE_3_FAQS);
export default function Page() { return (<><JsonLd code={[breadcrumb, webPage, faq]} /><Stage3TaxCutsPage /></>); }
