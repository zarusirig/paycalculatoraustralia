import type { Metadata } from "next";
import TechSalaryGuideAustraliaPage from "@/modules/guide/tech-salary-guide-australia";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, WebPage, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { faqPageSchema } from "@/lib/faq";
import { TECH_SALARY_FAQS } from "@/modules/guide/tech-salary-guide-australia-faqs";
import { withPageEnd } from "@/components/common/content-slots";
const BASE = SITE_CONFIG.baseUrl; const URL = `${BASE}/tech-salary-guide-australia/`;
const TITLE = "Tech Salary Guide Australia — Developer & Engineer Pay";
const DESCRIPTION = "IT and tech salaries in Australia: software developer, data engineer, project manager and cybersecurity pay, contractor vs permanent rates, and salary packaging.";
export const metadata: Metadata = { title: TITLE, description: DESCRIPTION, alternates: { canonical: URL }, openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU", images: ["/og-image.png"] }, twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION } };
const breadcrumb: WithContext<BreadcrumbList> = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE }, { "@type": "ListItem", position: 2, name: "IT & Tech Salary Guide", item: URL }] };
const webPage: WithContext<WebPage> = { "@context": "https://schema.org", "@type": "WebPage", name: TITLE, url: URL, publisher: { "@type": "Organization", name: SITE_CONFIG.name } };
const faq = faqPageSchema(TECH_SALARY_FAQS);
function Page() { return (<><JsonLd code={[breadcrumb, webPage, faq]} /><TechSalaryGuideAustraliaPage /></>); }

export default withPageEnd(Page, "/tech-salary-guide-australia/");
