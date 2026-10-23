import { faqPageSchema } from "@/lib/faq";
import { FBT_FAQS } from "@/modules/guide/fringe-benefits-tax-faqs";
import type { Metadata } from "next"; import FringeBenefitsTaxPage from "@/modules/guide/fringe-benefits-tax"; import { JsonLd } from "@/modules/seo/json-ld"; import type { BreadcrumbList, WebPage, WithContext } from "schema-dts"; import { SITE_CONFIG } from "@/lib/constants";
import { withPageEnd } from "@/components/common/content-slots";
import { withFeaturedImage } from "@/lib/featured-image";
import { FBT } from "@/lib/constants/novated-lease";
import { fitDescription, fitTitle } from "@/lib/seo-title";
const BASE = SITE_CONFIG.baseUrl; const URL = `${BASE}/fringe-benefits-tax/`;
// Meta intent pass 23 Oct 2026: top query "fbt gross up rates" (148 impr, pos 9.3), so the
// gross-up rates lead. Figures from FBT in lib/constants/novated-lease.ts (the page's own data).
// 23 Oct 2026: the FBT year (2026-27, ending 31 March 2027) is back in the title now the
// H1 and body match it.
const FBT_PCT = `${Math.round(FBT.rate * 100)}%`;
const BENCH_PCT = `${(FBT.benchmarkInterestRate * 100).toFixed(2)}%`;
const TITLE = fitTitle(
  `FBT Gross-Up Rates ${FBT.yearShort}: ${FBT.grossUpType1} & ${FBT.grossUpType2}, ${FBT_PCT} FBT Rate`,
  `FBT Gross-Up Rates ${FBT.yearShort}: ${FBT.grossUpType1} & ${FBT.grossUpType2}`,
);
const DESCRIPTION = fitDescription(
  `FBT gross-up rates for the year ending ${FBT.yearEnding}: ${FBT.grossUpType1} for Type 1 (GST-creditable), ${FBT.grossUpType2} for Type 2, FBT at ${FBT_PCT}. Benchmark interest ${BENCH_PCT}.`,
  `FBT gross-up rates for the year ending ${FBT.yearEnding}: ${FBT.grossUpType1} for Type 1 (GST-creditable) and ${FBT.grossUpType2} for Type 2, with FBT at ${FBT_PCT}.`,
);
export const metadata: Metadata = withFeaturedImage({ title: TITLE, description: DESCRIPTION, alternates: { canonical: URL }, openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU" } });
const breadcrumb: WithContext<BreadcrumbList> = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE }, { "@type": "ListItem", position: 2, name: "FBT Guide", item: URL }] };
const webPage: WithContext<WebPage> = { "@context": "https://schema.org", "@type": "WebPage", name: `Fringe Benefits Tax Guide ${FBT.yearShort}`, url: URL, publisher: { "@type": "Organization", name: SITE_CONFIG.name } };
const faq = faqPageSchema(FBT_FAQS);
function Page() { return (<><JsonLd code={[breadcrumb, webPage, faq]} /><FringeBenefitsTaxPage /></>); }

export default withPageEnd(Page, "/fringe-benefits-tax/");
