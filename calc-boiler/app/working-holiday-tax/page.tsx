import type { Metadata } from "next";
import WorkingHolidayTaxPage from "@/modules/guide/working-holiday-tax";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, WebPage, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { faqPageSchema } from "@/lib/faq";
import { WORKING_HOLIDAY_TAX_FAQS } from "@/modules/guide/working-holiday-tax-faqs";
import { withPageEnd } from "@/components/common/content-slots";
import { withFeaturedImage } from "@/lib/featured-image";
const BASE = SITE_CONFIG.baseUrl; const URL = `${BASE}/working-holiday-tax/`;
const TITLE = `Working Holiday Tax Rate ${SITE_CONFIG.financialYear}: 15% to $45K (417 & 462 Visa)`;
const DESCRIPTION = "Working holiday makers on 417 and 462 visas pay 15% from the first dollar to $45,000, then 30%, with no tax-free threshold or Medicare levy. Plus DASP refunds.";
export const metadata: Metadata = withFeaturedImage({ title: TITLE, description: DESCRIPTION, alternates: { canonical: URL }, openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU" }, twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION } });
const breadcrumb: WithContext<BreadcrumbList> = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE }, { "@type": "ListItem", position: 2, name: "Working Holiday Tax", item: URL }] };
const webPage: WithContext<WebPage> = { "@context": "https://schema.org", "@type": "WebPage", name: "Working Holiday Maker Tax Guide", url: URL, publisher: { "@type": "Organization", name: SITE_CONFIG.name } };
const faq = faqPageSchema(WORKING_HOLIDAY_TAX_FAQS);
function Page() { return (<><JsonLd code={[breadcrumb, webPage, faq]} /><WorkingHolidayTaxPage /></>); }

export default withPageEnd(Page, "/working-holiday-tax/");
