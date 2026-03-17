import type { Metadata } from "next";
import ConstructionTradesPayPage from "@/modules/guide/construction-trades-pay";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebPage, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS } from "@/lib/authors";
const BASE = SITE_CONFIG.baseUrl; const URL = `${BASE}/construction-trades-pay/`;
const TITLE = "Construction & Trades Pay Guide — Apprentice, Tradie & Labourer Pay Rates";
const DESCRIPTION = "Construction and trades pay rates: apprentice wages, qualified trade rates, labourer pay, overtime, site allowances, and take-home pay for tradies in Australia.";
export const metadata: Metadata = { title: TITLE, description: DESCRIPTION, alternates: { canonical: URL }, openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU" }, twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION } };
const breadcrumb: WithContext<BreadcrumbList> = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE }, { "@type": "ListItem", position: 2, name: "Construction & Trades Pay Guide", item: URL }] };
const webPage: WithContext<WebPage> = { "@context": "https://schema.org", "@type": "WebPage", name: TITLE, url: URL, publisher: { "@type": "Organization", name: SITE_CONFIG.name } };
const faq: WithContext<FAQPage> = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [{ "@type": "Question", name: "How much do tradies earn in Australia?", acceptedAnswer: { "@type": "Answer", text: "Qualified tradies earn between $65,000 and $120,000 depending on trade and experience. Electricians earn $80K–$110K, plumbers $75K–$105K, and boilermakers $85K–$120K." } }, { "@type": "Question", name: "How much do apprentices get paid?", acceptedAnswer: { "@type": "Answer", text: "Apprentice wages start at approximately 55% of the qualified trade rate in Year 1, increasing to 65% in Year 2, 80% in Year 3, and 95% in Year 4. Adult apprentices (21+) receive higher rates." } }, { "@type": "Question", name: "What overtime rates apply in construction?", acceptedAnswer: { "@type": "Answer", text: "Under the Building and Construction General On-site Award, overtime is paid at time-and-a-half for the first 2 hours and double time thereafter. Saturday work is time-and-a-half, and Sunday work is double time." } }] };
export default function Page() { return (<><JsonLd code={[breadcrumb, webPage, faq]} /><ConstructionTradesPayPage /></>); }
