import type { Metadata } from "next";
import OvertimePenaltyRatesGuidePage from "@/modules/guide/overtime-penalty-rates-guide";
import { JsonLd } from "@/modules/seo/json-ld";
import type { Article, BreadcrumbList, WebPage, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS, GUIDE_AUTHORSHIP } from "@/lib/authors";
import { RETAIL_PENALTIES } from "@/lib/constants/hospitality-award";
import { faqPageSchema } from "@/lib/faq";
import { PENALTY_RATES_FAQS } from "@/modules/guide/overtime-penalty-rates-guide-faqs";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/overtime-penalty-rates-guide/`;


const TITLE = "Penalty Rates Australia — Weekend, Public Holiday & Overtime Loadings";
const DESCRIPTION = `What you must be paid for weekends, public holidays, evenings and overtime. Verified retail, hospitality and SCHADS penalty tables — Saturday ${(RETAIL_PENALTIES.saturday * 100).toFixed(0)}%, Sunday ${(RETAIL_PENALTIES.sunday * 100).toFixed(0)}%, public holidays ${(RETAIL_PENALTIES.publicHoliday * 100).toFixed(0)}%, and casual loadings that add rather than compound. Hospitality evening and night work adds flat cash, not a multiplier.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: "Penalty rate tables by award, casual vs permanent, and how loadings are taxed.", url: URL, siteName: SITE_CONFIG.name, type: "article", locale: "en_AU" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const breadcrumb: WithContext<BreadcrumbList> = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE }, { "@type": "ListItem", position: 2, name: "Award Rates", item: `${BASE}/award-rates/` }, { "@type": "ListItem", position: 3, name: "Penalty Rates", item: URL }] };
const webPage: WithContext<WebPage> = { "@context": "https://schema.org", "@type": "WebPage", name: TITLE, url: URL, description: DESCRIPTION, publisher: { "@type": "Organization", name: SITE_CONFIG.name } };
const faq = faqPageSchema(PENALTY_RATES_FAQS);

const article: WithContext<Article> = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: TITLE,
  description: DESCRIPTION,
  author: AUTHORS[GUIDE_AUTHORSHIP["overtime-penalty-rates-guide"].authorId].jsonLd,
  publisher: { "@type": "Organization", name: SITE_CONFIG.name, logo: { "@type": "ImageObject", url: `${BASE}/icon-512.png` } },
  mainEntityOfPage: { "@type": "WebPage", "@id": URL },
  isBasedOn: { "@type": "Legislation", name: "Fair Work Act 2009", url: "https://www.legislation.gov.au/Details/C2024C00301" },
};

export default function Page() {
  return (<><JsonLd code={[breadcrumb, webPage, article, faq]} /><OvertimePenaltyRatesGuidePage /></>);
}
