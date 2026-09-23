import type { Metadata } from "next";
import FirstJobPayGuidePage from "@/modules/guide/first-job-pay-guide";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, WebPage, WithContext } from "schema-dts";
import { faqPageSchema } from "@/lib/faq";
import { FIRST_JOB_FAQS } from "@/modules/guide/first-job-pay-guide-faqs";
import { SITE_CONFIG } from "@/lib/constants";
import { withPageEnd } from "@/components/common/content-slots";
const BASE = SITE_CONFIG.baseUrl; const URL = `${BASE}/first-job-pay-guide/`;
export const metadata: Metadata = { title: "First Job Pay Guide — Tax, Super & Your First Payslip", description: "Starting your first job? Your tax file number, super, the tax-free threshold, how to read your first payslip and how much you'll actually take home.", alternates: { canonical: URL }, openGraph: { title: "First Job Pay Guide Australia", description: "Tax, super & your first payslip explained for new Australian workers.", url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU", images: ["/og-image.png"] }, twitter: { card: "summary_large_image", title: "First Job Pay Guide Australia", description: "Everything you need to know about your first pay." } };
const breadcrumb: WithContext<BreadcrumbList> = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE }, { "@type": "ListItem", position: 2, name: "First Job Pay Guide", item: URL }] };
const webPage: WithContext<WebPage> = { "@context": "https://schema.org", "@type": "WebPage", name: "First Job Pay Guide Australia", url: URL, publisher: { "@type": "Organization", name: SITE_CONFIG.name } };
const faq = faqPageSchema(FIRST_JOB_FAQS);
function Page() { return (<><JsonLd code={[breadcrumb, webPage, faq]} /><FirstJobPayGuidePage /></>); }

export default withPageEnd(Page, "/first-job-pay-guide/");
