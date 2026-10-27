import type { Metadata } from "next";
import GigEconomyPayGuidePage from "@/modules/guide/gig-economy-pay-guide";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, WebPage, WithContext } from "schema-dts";
import { faqPageSchema } from "@/lib/faq";
import { GIG_ECONOMY_FAQS } from "@/modules/guide/gig-economy-pay-guide-faqs";
import { SITE_CONFIG } from "@/lib/constants";
import { withPageEnd } from "@/components/common/content-slots";
import { withFeaturedImage } from "@/lib/featured-image";
const BASE = SITE_CONFIG.baseUrl; const URL = `${BASE}/gig-economy-pay-guide/`;
// Meta intent pass, 23 Oct 2026: the page is found for "gig economy pay guide"
// (its H1), but the title said "Tax Guide". Social titles now match the page title.
const TITLE = "Gig Economy Pay Guide Australia: Uber, Delivery & Freelance Tax";
const DESCRIPTION =
  "How gig workers are paid and taxed in Australia: when you need an ABN, why rideshare drivers must register for GST from day one, quarterly BAS and deductions.";
export const metadata: Metadata = withFeaturedImage({ title: TITLE, description: DESCRIPTION, alternates: { canonical: URL }, openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU" }, twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION } });
const breadcrumb: WithContext<BreadcrumbList> = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE }, { "@type": "ListItem", position: 2, name: "Gig Economy Pay Guide", item: URL }] };
const webPage: WithContext<WebPage> = { "@context": "https://schema.org", "@type": "WebPage", name: TITLE, url: URL, publisher: { "@type": "Organization", name: SITE_CONFIG.name } };
const faq = faqPageSchema(GIG_ECONOMY_FAQS);
function Page() { return (<><JsonLd code={[breadcrumb, webPage, faq]} /><GigEconomyPayGuidePage /></>); }

export default withPageEnd(Page, "/gig-economy-pay-guide/");
