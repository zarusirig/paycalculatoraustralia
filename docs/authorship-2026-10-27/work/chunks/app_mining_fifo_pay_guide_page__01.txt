import type { Metadata } from "next";
import MiningFIFOPayGuidePage from "@/modules/guide/mining-fifo-pay-guide";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, WebPage, WithContext } from "schema-dts";
import { SITE_CONFIG, formatAUD } from "@/lib/constants";
import { AWE_BY_INDUSTRY, AWE_RELEASE, annualise } from "@/lib/data/average-salary";
import { faqPageSchema } from "@/lib/faq";
import { MINING_FIFO_FAQS } from "@/modules/guide/mining-fifo-pay-guide-faqs";
import { withPageEnd } from "@/components/common/content-slots";
import { withFeaturedImage } from "@/lib/featured-image";
const BASE = SITE_CONFIG.baseUrl; const URL = `${BASE}/mining-fifo-pay-guide/`;
// Meta intent pass, 23 Oct 2026: searched as "fifo average salary", "fifo
// salary australia per month" and "fifo wages" (pos 6 to 9, 0.7% CTR); the old
// title buried "salary". The average is the ABS mining figure the page quotes.
const MINING_AVG = annualise(AWE_BY_INDUSTRY.find((r) => r.label === "Mining")?.weekly ?? 0);
const TITLE = `FIFO & Mining Salary Australia 2026: ${formatAUD(MINING_AVG)} Average (ABS)`;
const DESCRIPTION = `Mining workers average ${formatAUD(MINING_AVG)} a year full-time (ABS, ${AWE_RELEASE.referencePeriod}). See FIFO pay by role, rosters, allowances, the zone tax offset and take-home pay.`;
export const metadata: Metadata = withFeaturedImage({ title: TITLE, description: DESCRIPTION, alternates: { canonical: URL }, openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU" }, twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION } });
const breadcrumb: WithContext<BreadcrumbList> = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE }, { "@type": "ListItem", position: 2, name: "Mining & FIFO Pay Guide", item: URL }] };
const webPage: WithContext<WebPage> = { "@context": "https://schema.org", "@type": "WebPage", name: "Mining & FIFO Pay Guide - Salary, Rosters & Allowances", url: URL, publisher: { "@type": "Organization", name: SITE_CONFIG.name } };
const faq = faqPageSchema(MINING_FIFO_FAQS);
function Page() { return (<><JsonLd code={[breadcrumb, webPage, faq]} /><MiningFIFOPayGuidePage /></>); }

export default withPageEnd(Page, "/mining-fifo-pay-guide/");
