import type { Metadata } from "next";
import TaxChanges202627Page from "@/modules/guide/tax-changes-2026-27";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebPage, Article, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS } from "@/lib/authors";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/tax-changes-2026-27/`;
const TITLE = "Tax Changes 2026-27 Australia — What's Coming From 1 July 2026";
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
    { "@type": "Question", name: "What are the main tax changes for FY2026-27?", acceptedAnswer: { "@type": "Answer", text: "Key confirmed changes include super guarantee remaining at 12%, updated HECS-HELP repayment thresholds, and revised Medicare levy low-income thresholds. Further changes may be announced in the May 2026 federal budget." } },
    { "@type": "Question", name: "Will tax brackets change in 2026-27?", acceptedAnswer: { "@type": "Answer", text: "No bracket changes have been legislated for FY2026-27. The Stage 3 tax cut brackets from 1 July 2024 remain in effect. Any future bracket indexation would require new legislation." } },
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
