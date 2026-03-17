import type { Metadata } from "next";
import MiningFIFOPayGuidePage from "@/modules/guide/mining-fifo-pay-guide";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebPage, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS } from "@/lib/authors";
const BASE = SITE_CONFIG.baseUrl; const URL = `${BASE}/mining-fifo-pay-guide/`;
const TITLE = "Mining & FIFO Pay Guide Australia — Salary, Tax, Rosters & Allowances";
const DESCRIPTION = "Mining and FIFO pay explained: average salaries ($100K–$200K+), roster structures, FIFO allowances, zone tax offset, overtime rates, and take-home pay calculation.";
export const metadata: Metadata = { title: TITLE, description: DESCRIPTION, alternates: { canonical: URL }, openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU" }, twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION } };
const breadcrumb: WithContext<BreadcrumbList> = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE }, { "@type": "ListItem", position: 2, name: "Mining & FIFO Pay Guide", item: URL }] };
const webPage: WithContext<WebPage> = { "@context": "https://schema.org", "@type": "WebPage", name: TITLE, url: URL, publisher: { "@type": "Organization", name: SITE_CONFIG.name } };
const faq: WithContext<FAQPage> = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [{ "@type": "Question", name: "How much do FIFO miners earn in Australia?", acceptedAnswer: { "@type": "Answer", text: "FIFO mining salaries typically range from $100,000 to $200,000+ depending on role, experience, and roster type. Drillers earn $140K–$180K, operators $100K–$140K, and site managers $160K–$220K." } }, { "@type": "Question", name: "Are FIFO workers eligible for the zone tax offset?", acceptedAnswer: { "@type": "Answer", text: "Generally no. Since 2015, FIFO workers who maintain their usual place of residence outside the zone are not eligible for the zone tax offset, even if they work in a remote area." } }, { "@type": "Question", name: "What is LAFHA for FIFO workers?", acceptedAnswer: { "@type": "Answer", text: "Living Away From Home Allowance (LAFHA) is a payment to cover additional expenses when working away from your usual residence. For FIFO workers, it may cover food and accommodation costs and can be tax-free if conditions are met." } }] };
export default function Page() { return (<><JsonLd code={[breadcrumb, webPage, faq]} /><MiningFIFOPayGuidePage /></>); }
