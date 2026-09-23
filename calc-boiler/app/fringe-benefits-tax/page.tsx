import { faqPageSchema } from "@/lib/faq";
import { FBT_FAQS } from "@/modules/guide/fringe-benefits-tax-faqs";
import type { Metadata } from "next"; import FringeBenefitsTaxPage from "@/modules/guide/fringe-benefits-tax"; import { JsonLd } from "@/modules/seo/json-ld"; import type { BreadcrumbList, WebPage, WithContext } from "schema-dts"; import { SITE_CONFIG } from "@/lib/constants";
import { withPageEnd } from "@/components/common/content-slots";
const BASE = SITE_CONFIG.baseUrl; const URL = `${BASE}/fringe-benefits-tax/`;
export const metadata: Metadata = { title: "Fringe Benefits Tax (FBT) — Rate, Gross-Up & Examples", description: "Fringe Benefits Tax in Australia for FY2025-26: the 47% FBT rate, Type 1 (2.0802) and Type 2 (1.8868) gross-up factors, reportable benefits and worked examples.", alternates: { canonical: URL }, openGraph: { title: "Fringe Benefits Tax (FBT) Australia 2025-26 — Rate, Gross-Up & Examples", description: "FBT rate, Type 1 & Type 2 gross-up factors, worked examples, reportable benefits, and employer obligations for FY2025-26.", url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU", images: ["/og-image.png"] } };
const breadcrumb: WithContext<BreadcrumbList> = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE }, { "@type": "ListItem", position: 2, name: "FBT Guide", item: URL }] };
const webPage: WithContext<WebPage> = { "@context": "https://schema.org", "@type": "WebPage", name: "Fringe Benefits Tax Guide", url: URL, publisher: { "@type": "Organization", name: SITE_CONFIG.name } };
const faq = faqPageSchema(FBT_FAQS);
function Page() { return (<><JsonLd code={[breadcrumb, webPage, faq]} /><FringeBenefitsTaxPage /></>); }

export default withPageEnd(Page, "/fringe-benefits-tax/");
