import type { Metadata } from "next";
import TeacherPayAustraliaPage from "@/modules/guide/teacher-pay-australia";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebPage, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS } from "@/lib/authors";
const BASE = SITE_CONFIG.baseUrl; const URL = `${BASE}/teacher-pay-australia/`;
const TITLE = "Teacher Pay Australia — Salary by State & Experience";
const DESCRIPTION = "Teacher salaries in every Australian state. Starting salary, top of band, head teacher rates, and how teacher pay compares. Classification levels and progression explained.";
export const metadata: Metadata = { title: TITLE, description: DESCRIPTION, alternates: { canonical: URL }, openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU" }, twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION } };
const breadcrumb: WithContext<BreadcrumbList> = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE }, { "@type": "ListItem", position: 2, name: "Teacher Pay Australia", item: URL }] };
const webPage: WithContext<WebPage> = { "@context": "https://schema.org", "@type": "WebPage", name: TITLE, url: URL, publisher: { "@type": "Organization", name: SITE_CONFIG.name } };
const faq: WithContext<FAQPage> = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [{ "@type": "Question", name: "What is the starting salary for teachers in Australia?", acceptedAnswer: { "@type": "Answer", text: "Starting teacher salaries range from $70,000 in Tasmania to $78,000 in the ACT. NSW starts at $75,000 and Victoria at $76,000 for graduate teachers." } }, { "@type": "Question", name: "What is the top of band salary for teachers?", acceptedAnswer: { "@type": "Answer", text: "Top of band salaries range from $104,000 in Tasmania to $118,000 in the ACT. Most states reach $108K–$115K at the top of the classroom teacher scale." } }, { "@type": "Question", name: "How does teacher pay progress?", acceptedAnswer: { "@type": "Answer", text: "Teachers progress through salary bands based on years of experience and achieving proficiency standards. Graduate teachers move to Proficient after 1-2 years, then progress annually through increments to the top of band." } }] };
export default function Page() { return (<><JsonLd code={[breadcrumb, webPage, faq]} /><TeacherPayAustraliaPage /></>); }
