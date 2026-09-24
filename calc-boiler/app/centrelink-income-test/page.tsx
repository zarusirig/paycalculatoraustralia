import type { Metadata } from "next"; import CentrelinkIncomeTestPage from "@/modules/guide/centrelink-income-test"; import { JsonLd } from "@/modules/seo/json-ld"; import type { BreadcrumbList, WebPage, WithContext } from "schema-dts"; import { faqPageSchema } from "@/lib/faq"; import { CENTRELINK_INCOME_TEST_FAQS } from "@/modules/guide/centrelink-income-test-faqs"; import { SITE_CONFIG } from "@/lib/constants";
import { withPageEnd } from "@/components/common/content-slots";
import { formatAUD } from "@/lib/constants";
import { JOBSEEKER_INCOME_TEST } from "@/lib/constants/centrelink-income-test";
const BASE = SITE_CONFIG.baseUrl; const URL = `${BASE}/centrelink-income-test/`;
// Previous: "Centrelink Income Test — How Income Affects Your Payment"
// seo-brain 25 Sep 2026 (Jev-ranked): names the calculators and the three payments searched with the term.
const TITLE = "Centrelink Income Test Calculator Guide: JobSeeker, FTB, Pension";
// Previous: "Centrelink income test explained: free areas, tapers and cut-offs for JobSeeker, FTB, Age Pension, DSP and CCS, plus the assets test and deeming, from 20 Sep 2026."
// seo-brain 25 Sep 2026 (Jev-ranked): JobSeeker free area and tapers from JOBSEEKER_INCOME_TEST, never typed.
const JS_TEST = JOBSEEKER_INCOME_TEST;
const DESCRIPTION = `JobSeeker income test: ${formatAUD(JS_TEST.freeArea)} free area, ${Math.round(JS_TEST.taper1 * 100)}c per dollar to ${formatAUD(JS_TEST.band1End)}, then ${Math.round(JS_TEST.taper2 * 100)}c. How income affects each Centrelink payment from 20 Sep 2026, with calculators.`;
export const metadata: Metadata = { title: TITLE, description: DESCRIPTION, alternates: { canonical: URL }, openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU", images: ["/og-image.png"] } };
const breadcrumb: WithContext<BreadcrumbList> = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE }, { "@type": "ListItem", position: 2, name: "Centrelink Income Test", item: URL }] };
const webPage: WithContext<WebPage> = { "@context": "https://schema.org", "@type": "WebPage", name: "Centrelink Income Test Guide", url: URL, publisher: { "@type": "Organization", name: SITE_CONFIG.name } };
const faq = faqPageSchema(CENTRELINK_INCOME_TEST_FAQS);
function Page() { return (<><JsonLd code={[breadcrumb, webPage, faq]} /><CentrelinkIncomeTestPage /></>); }

export default withPageEnd(Page, "/centrelink-income-test/");
