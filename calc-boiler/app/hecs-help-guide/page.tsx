import type { Metadata } from "next";
import HecsHelpGuidePage from "@/modules/guide/hecs-help-guide";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebPage, Article, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS, GUIDE_AUTHORSHIP } from "@/lib/authors";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/hecs-help-guide/`;
const TITLE = "HECS Repayment 2026-27 — Thresholds, Rates & What You Pay";
const DESCRIPTION = "Understand the HECS-HELP marginal repayment system, the 2026-27 repayment thresholds, indexation limits, and how it all impacts your take-home pay in Australia.";

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
    { "@type": "ListItem", position: 2, name: "HECS-HELP Guide", item: URL },
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
  isBasedOn: { "@type": "Legislation", name: "Higher Education Support Act 2003", url: "https://www.legislation.gov.au/Details/C2024C00410" },
};

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "What is the new HECS marginal repayment system?", acceptedAnswer: { "@type": "Answer", text: "Starting dynamically from 1 July 2025, HECS-HELP repayments transition from a 'flat rate' system (where a single percentage applies to your entire income) to a 'marginal rate' system. This means you only apply the repayment percentage to the portion of your income that falls above the minimum repayment threshold, keeping more money in your pocket." } },
    { "@type": "Question", name: "What is the minimum HECS repayment threshold for 2026-27?", acceptedAnswer: { "@type": "Answer", text: "For the 2026-27 financial year, you only start making mandatory HECS-HELP repayments once your repayment income exceeds $69,528. The threshold was $69,528 when the marginal system launched in 2025-26 and is indexed each year." } },
    { "@type": "Question", name: "How is HECS-HELP indexation changing?", acceptedAnswer: { "@type": "Answer", text: "The government has capped the indexation rate for student loans to the lower of either the Consumer Price Index (CPI) or the Wage Price Index (WPI). This ensures your debt will never grow faster than average wages." } },
  ]
};

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, article, faq]} />
      <HecsHelpGuidePage />
    </>
  );
}
