import type { Metadata } from "next";
import HealthcareWorkerPayPage from "@/modules/guide/healthcare-worker-pay";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebPage, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS } from "@/lib/authors";
const BASE = SITE_CONFIG.baseUrl; const URL = `${BASE}/healthcare-worker-pay/`;
const TITLE = "Healthcare Worker Pay — Nurses, Doctors & Allied Health";
const DESCRIPTION = "Healthcare pay in Australia: nurse salary by classification, doctor pay scales, allied health rates. Shift allowances, penalty rates, and salary packaging for health workers.";
export const metadata: Metadata = { title: TITLE, description: DESCRIPTION, alternates: { canonical: URL }, openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU" }, twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION } };
const breadcrumb: WithContext<BreadcrumbList> = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE }, { "@type": "ListItem", position: 2, name: "Healthcare Worker Pay Guide", item: URL }] };
const webPage: WithContext<WebPage> = { "@context": "https://schema.org", "@type": "WebPage", name: TITLE, url: URL, publisher: { "@type": "Organization", name: SITE_CONFIG.name } };
const faq: WithContext<FAQPage> = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [{ "@type": "Question", name: "How much do nurses earn in Australia?", acceptedAnswer: { "@type": "Answer", text: "Registered nurses earn between $72,000 (Year 1) and $95,000 (Year 8). Clinical nurses earn $100K–$110K, and nurse practitioners earn $115K–$130K." } }, { "@type": "Question", name: "What is salary packaging for healthcare workers?", acceptedAnswer: { "@type": "Answer", text: "Public hospital employees can salary package up to $15,900 of living expenses tax-free, plus $2,650 for meal entertainment. This can increase take-home pay by $4,000–$6,000 per year." } }, { "@type": "Question", name: "What penalty rates do nurses get?", acceptedAnswer: { "@type": "Answer", text: "Nurses receive penalty rates for weekend, evening, night, and public holiday shifts. Saturday attracts a 25% loading, Sunday 50% for full-time/part-time, and public holidays 150% under most enterprise agreements." } }] };
export default function Page() { return (<><JsonLd code={[breadcrumb, webPage, faq]} /><HealthcareWorkerPayPage /></>); }
