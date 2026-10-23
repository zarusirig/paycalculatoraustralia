import type { Metadata } from "next";
import NonResidentTaxPage from "@/modules/guide/non-resident-tax";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, WebPage, WithContext } from "schema-dts";
import { SITE_CONFIG, NON_RESIDENT_TAX_BRACKETS, formatAUD } from "@/lib/constants";
import { faqPageSchema } from "@/lib/faq";
import { NON_RESIDENT_FAQS } from "@/modules/guide/non-resident-tax-faqs";
import { withPageEnd } from "@/components/common/content-slots";
import { withFeaturedImage } from "@/lib/featured-image";
const BASE = SITE_CONFIG.baseUrl; const URL = `${BASE}/non-resident-tax/`;
// Meta intent pass 23 Oct 2026: top query "australian tax for non residents calculator";
// the description now gives the rates themselves, built from NON_RESIDENT_TAX_BRACKETS.
const [NR1, NR2, NR3] = NON_RESIDENT_TAX_BRACKETS;
const pct = (r: number) => `${Math.round(r * 100)}%`;
const TITLE = `Non-Resident Tax Rates Australia ${SITE_CONFIG.financialYear}: No Tax-Free Threshold`;
const DESCRIPTION = `Non-residents pay ${pct(NR1.rate)} from the first dollar to ${formatAUD(NR1.max)}, ${pct(NR2.rate)} to ${formatAUD(NR2.max)} and ${pct(NR3.rate)} above in ${SITE_CONFIG.financialYear}. Resident vs non-resident tax compared, with a calculator link.`;
export const metadata: Metadata = withFeaturedImage({ title: TITLE, description: DESCRIPTION, alternates: { canonical: URL }, openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU" }, twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION } });
const breadcrumb: WithContext<BreadcrumbList> = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE }, { "@type": "ListItem", position: 2, name: "Non-Resident Tax", item: URL }] };
const webPage: WithContext<WebPage> = { "@context": "https://schema.org", "@type": "WebPage", name: "Non-Resident Tax Rates Australia", url: URL, publisher: { "@type": "Organization", name: SITE_CONFIG.name } };
const faq = faqPageSchema(NON_RESIDENT_FAQS);
function Page() { return (<><JsonLd code={[breadcrumb, webPage, faq]} /><NonResidentTaxPage /></>); }

export default withPageEnd(Page, "/non-resident-tax/");
