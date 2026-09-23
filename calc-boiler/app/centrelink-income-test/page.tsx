import type { Metadata } from "next"; import CentrelinkIncomeTestPage from "@/modules/guide/centrelink-income-test"; import { JsonLd } from "@/modules/seo/json-ld"; import type { BreadcrumbList, WebPage, WithContext } from "schema-dts"; import { faqPageSchema } from "@/lib/faq"; import { CENTRELINK_INCOME_TEST_FAQS } from "@/modules/guide/centrelink-income-test-faqs"; import { SITE_CONFIG } from "@/lib/constants";
import { withPageEnd } from "@/components/common/content-slots";
const BASE = SITE_CONFIG.baseUrl; const URL = `${BASE}/centrelink-income-test/`;
export const metadata: Metadata = { title: "Centrelink Income Test — How Income Affects Your Payment", description: "Centrelink income test explained: free areas, tapers and cut-offs for JobSeeker, FTB, Age Pension, DSP and CCS, plus the assets test and deeming, from 20 Sep 2026.", alternates: { canonical: URL }, openGraph: { title: "Centrelink Income Test Guide", description: "How your income affects Centrelink payments.", url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU", images: ["/og-image.png"] } };
const breadcrumb: WithContext<BreadcrumbList> = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE }, { "@type": "ListItem", position: 2, name: "Centrelink Income Test", item: URL }] };
const webPage: WithContext<WebPage> = { "@context": "https://schema.org", "@type": "WebPage", name: "Centrelink Income Test Guide", url: URL, publisher: { "@type": "Organization", name: SITE_CONFIG.name } };
const faq = faqPageSchema(CENTRELINK_INCOME_TEST_FAQS);
function Page() { return (<><JsonLd code={[breadcrumb, webPage, faq]} /><CentrelinkIncomeTestPage /></>); }

export default withPageEnd(Page, "/centrelink-income-test/");
