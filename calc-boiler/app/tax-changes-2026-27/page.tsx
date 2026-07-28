import type { Metadata } from "next";
import TaxChanges202627Page from "@/modules/guide/tax-changes-2026-27";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebPage, Article, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS } from "@/lib/authors";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/tax-changes-2026-27/`;
const TITLE = "Tax Changes 2026-27 — What Changed From 1 July 2026";
const DESCRIPTION = "Preview of Australian tax changes for FY2026-27. Upcoming rate changes, super guarantee at 12%, HECS threshold updates, and what it means for your take-home pay from July 2026.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: SITE_CONFIG.name, type: "article", locale: "en_AU" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Tax Changes 2026-27", item: URL },
  ]
};

const webPage: WithContext<WebPage> = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: TITLE,
  url: URL,
  description: DESCRIPTION,
  publisher: { "@type": "Organization", name: SITE_CONFIG.name },
};

const article: WithContext<Article> = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: TITLE,
  description: DESCRIPTION,
  author: AUTHORS["james-harrington"].jsonLd,
  publisher: { "@type": "Organization", name: SITE_CONFIG.name, logo: { "@type": "ImageObject", url: `${BASE}/favicon.ico` } },
  mainEntityOfPage: { "@type": "WebPage", "@id": URL },
};

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "What are the main tax changes for FY2026-27?", acceptedAnswer: { "@type": "Answer", text: "The headline change is the legislated cost-of-living tax cut: the rate on income between $18,201 and $45,000 drops from 16% to 15% on 1 July 2026, worth up to $268 a year. The super guarantee stays at 12%, the HECS-HELP repayment threshold rises to $69,528, and Medicare levy low-income thresholds are indexed." } },
    { "@type": "Question", name: "Will tax brackets change in 2026-27?", acceptedAnswer: { "@type": "Answer", text: "Yes. From 1 July 2026 the marginal rate on income between $18,201 and $45,000 falls from 16% to 15% under the legislated cost-of-living tax cuts, with a further cut to 14% from 1 July 2027. Bracket thresholds themselves are unchanged." } },
    { "@type": "Question", name: "What is the super guarantee rate for 2026-27?", acceptedAnswer: { "@type": "Answer", text: "The super guarantee rate remains at 12% for FY2026-27. The rate reached its legislated ceiling of 12% on 1 July 2025 and no further increases are currently scheduled." } },
  ]
};

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, article, faq]} />
      <TaxChanges202627Page />
    </>
  );
}
