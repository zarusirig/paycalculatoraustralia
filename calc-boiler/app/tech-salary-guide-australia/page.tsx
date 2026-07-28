import type { Metadata } from "next";
import TechSalaryGuideAustraliaPage from "@/modules/guide/tech-salary-guide-australia";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebPage, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS } from "@/lib/authors";
const BASE = SITE_CONFIG.baseUrl; const URL = `${BASE}/tech-salary-guide-australia/`;
const TITLE = "Tech Salary Guide Australia — Developer & Engineer Pay";
const DESCRIPTION = "IT and tech salaries in Australia: software developer, data engineer, project manager, cybersecurity pay. Contractor vs permanent rates, and salary packaging for tech workers.";
export const metadata: Metadata = { title: TITLE, description: DESCRIPTION, alternates: { canonical: URL }, openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU" }, twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION } };
const breadcrumb: WithContext<BreadcrumbList> = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE }, { "@type": "ListItem", position: 2, name: "IT & Tech Salary Guide", item: URL }] };
const webPage: WithContext<WebPage> = { "@context": "https://schema.org", "@type": "WebPage", name: TITLE, url: URL, publisher: { "@type": "Organization", name: SITE_CONFIG.name } };
const faq: WithContext<FAQPage> = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [{ "@type": "Question", name: "How much do software developers earn in Australia?", acceptedAnswer: { "@type": "Answer", text: "Junior developers earn $65K–$80K, mid-level developers $90K–$120K, senior developers $130K–$170K, and lead/principal engineers $160K–$200K in Australia." } }, { "@type": "Question", name: "Is it better to be a contractor or permanent employee in tech?", acceptedAnswer: { "@type": "Answer", text: "Contractors typically earn 30–50% more in gross terms but miss out on paid leave, superannuation guarantee, and job security. The break-even point depends on your day rate, leave preferences, and whether you operate through a Pty Ltd company." } }, { "@type": "Question", name: "How do tech salaries vary by city in Australia?", acceptedAnswer: { "@type": "Answer", text: "Sydney pays 10–15% above the national average, Melbourne is the baseline, Brisbane is 5–10% below, Perth is variable depending on mining-tech demand, and remote roles are increasingly competitive on salary." } }] };
export default function Page() { return (<><JsonLd code={[breadcrumb, webPage, faq]} /><TechSalaryGuideAustraliaPage /></>); }
