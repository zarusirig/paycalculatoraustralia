import type { Metadata } from "next";
import TaxBracketHistoryPage from "@/modules/guide/tax-bracket-history";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebPage, Article, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS } from "@/lib/authors";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/tax-bracket-history/`;
const TITLE = "Australian Tax Bracket History — Every Rate From 2020 to 2026";
const DESCRIPTION = "Australian tax brackets from FY2020-21 to FY2026-27. See how rates and thresholds changed year by year, including the Stage 3 tax cuts. Historical tax rate comparison.";

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
    { "@type": "ListItem", position: 2, name: "Tax Bracket History", item: URL },
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
    { "@type": "Question", name: "When did the Stage 3 tax cuts take effect?", acceptedAnswer: { "@type": "Answer", text: "The revised Stage 3 tax cuts took effect on 1 July 2024 (FY2024-25). They lowered the 19% rate to 16%, widened the 30% bracket to $135,000, and raised the 37% threshold to $135,001-$190,000." } },
    { "@type": "Question", name: "How much tax do I save at $80,000 under Stage 3?", acceptedAnswer: { "@type": "Answer", text: "At $80,000 taxable income, your tax bill dropped from approximately $17,547 (pre-Stage 3) to around $14,788 (post-Stage 3), a saving of roughly $2,759 per year." } },
    { "@type": "Question", name: "Have tax brackets changed for FY2026-27?", acceptedAnswer: { "@type": "Answer", text: "No. The FY2026-27 tax brackets are the same as FY2024-25: 0% up to $18,200, 16% from $18,201-$45,000, 30% from $45,001-$135,000, 37% from $135,001-$190,000, and 45% above $190,000." } },
    { "@type": "Question", name: "What was the LMITO and when was it removed?", acceptedAnswer: { "@type": "Answer", text: "The Low and Middle Income Tax Offset (LMITO) was a temporary offset worth up to $1,500. It was removed from 1 July 2022 (FY2022-23 onwards), meaning taxpayers no longer receive this additional tax reduction at lodgement." } },
    { "@type": "Question", name: "What are the 4 stages of the Personal Income Tax Plan?", acceptedAnswer: { "@type": "Answer", text: "Stage 1 started FY2018-19 with the increased LMITO. Stage 2 from FY2020-21 raised the 19% threshold to $45,000 and 32.5% threshold to $120,000. Stage 3 (revised) from FY2024-25 cut rates and widened brackets. The original Stage 3 flat 30% rate from $45,001-$200,000 was replaced with the revised version." } },
  ]
};

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, article, faq]} />
      <TaxBracketHistoryPage />
    </>
  );
}
