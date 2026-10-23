import type { Metadata } from "next";
import AnnualLeaveGuidePage from "@/modules/guide/annual-leave-guide";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, WebPage, WithContext } from "schema-dts";
import { faqPageSchema } from "@/lib/faq";
import { ANNUAL_LEAVE_FAQS } from "@/modules/guide/annual-leave-guide-faqs";
import { SITE_CONFIG } from "@/lib/constants";
import { withPageEnd } from "@/components/common/content-slots";
import { withFeaturedImage } from "@/lib/featured-image";
import { ANNUAL_LEAVE, annualLeaveHoursPerYear } from "@/lib/constants/annual-leave";
const BASE = SITE_CONFIG.baseUrl; const URL = `${BASE}/annual-leave-guide/`;
// Meta pass 23 Oct 2026: old title used an em dash and "Guide" (nobody types
// it); queries are "annual leave entitlement", "annual leave pay rate",
// "annual leave pay". Description answers with the NES figures from
// lib/constants/annual-leave.ts. The WebPage JSON-LD name is unchanged.
// Previous: "Annual Leave Guide Australia — Entitlements & Payout Rules".
const TITLE = "Annual Leave Entitlements Australia: Pay Rate, Loading & Payout";
const DESCRIPTION = `Full-time staff get ${ANNUAL_LEAVE.weeksPerYear} weeks of paid annual leave a year (${annualLeaveHoursPerYear(ANNUAL_LEAVE.standardWeeklyHours)} hours), shiftworkers ${ANNUAL_LEAVE.shiftworkerWeeksPerYear}, often plus ${ANNUAL_LEAVE.loadingRate * 100}% loading. Unused leave is paid out when you leave.`;
export const metadata: Metadata = withFeaturedImage({ title: TITLE, description: DESCRIPTION, alternates: { canonical: URL }, openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU" }, twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION } });
const breadcrumb: WithContext<BreadcrumbList> = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE }, { "@type": "ListItem", position: 2, name: "Annual Leave Guide", item: URL }] };
const webPage: WithContext<WebPage> = { "@context": "https://schema.org", "@type": "WebPage", name: "Annual Leave Guide Australia", url: URL, publisher: { "@type": "Organization", name: SITE_CONFIG.name } };
const faq = faqPageSchema(ANNUAL_LEAVE_FAQS);
function Page() { return (<><JsonLd code={[breadcrumb, webPage, faq]} /><AnnualLeaveGuidePage /></>); }

export default withPageEnd(Page, "/annual-leave-guide/");
