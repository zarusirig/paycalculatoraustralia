import type { Metadata } from "next";
import NonResidentTaxPage from "@/modules/guide/non-resident-tax";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebPage, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS, GUIDE_AUTHORSHIP } from "@/lib/authors";
const BASE = SITE_CONFIG.baseUrl; const URL = `${BASE}/non-resident-tax/`;
export const metadata: Metadata = { title: "Non-Resident Tax Rates Australia — Foreign Resident Guide", description: "Non-resident tax rates: no tax-free threshold, 30% from dollar one. Comparison table resident vs non-resident. Foreign resident tax guide.", alternates: { canonical: URL }, openGraph: { title: "Non-Resident Tax Rates Australia", description: "Tax rates for foreign residents with comparison tables.", url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU" }, twitter: { card: "summary_large_image", title: "Non-Resident Tax Guide", description: "Foreign resident tax rates and comparison." } };
const breadcrumb: WithContext<BreadcrumbList> = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE }, { "@type": "ListItem", position: 2, name: "Non-Resident Tax", item: URL }] };
const webPage: WithContext<WebPage> = { "@context": "https://schema.org", "@type": "WebPage", name: "Non-Resident Tax Rates Australia", url: URL, publisher: { "@type": "Organization", name: SITE_CONFIG.name } };
const faq: WithContext<FAQPage> = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [{ "@type": "Question", name: "What is the non-resident tax rate?", acceptedAnswer: { "@type": "Answer", text: "Non-residents pay 30% on income up to $135,000, with no tax-free threshold." } }, { "@type": "Question", name: "Do non-residents pay Medicare levy?", acceptedAnswer: { "@type": "Answer", text: "No. Non-residents are exempt from the 2% Medicare levy but cannot access Medicare services." } }] };
export default function Page() { return (<><JsonLd code={[breadcrumb, webPage, faq]} /><NonResidentTaxPage /></>); }
