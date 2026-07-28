import type { Metadata } from "next";
import type { Article, BreadcrumbList, FAQPage, WebPage, WithContext } from "schema-dts";
import HecsRepaymentThresholdPage from "@/modules/guide/hecs-repayment-threshold";
import { HECS_THRESHOLD_FAQS } from "@/modules/guide/hecs-repayment-threshold-faqs";
import { JsonLd } from "@/modules/seo/json-ld";
import { HECS_HELP, SITE_CONFIG, formatAUD } from "@/lib/constants";
import { AUTHORS } from "@/lib/authors";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/hecs-repayment-threshold/`;

// The year lives in the H1, title and copy — never in the slug. This URL has to
// survive indexation each 1 July without a redirect or a lost ranking.
const T = formatAUD(HECS_HELP.minimumThreshold);
const TITLE = `HECS Repayment Threshold ${SITE_CONFIG.financialYear}: ${T}`;
const DESCRIPTION = `Compulsory HECS-HELP repayments start once repayment income passes ${T} in ${SITE_CONFIG.financialYear}. The full ATO threshold and rate table, what counts as repayment income, and every study loan the threshold covers.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: `The ${SITE_CONFIG.financialYear} study and training loan repayment thresholds and rates, straight from the ATO schedule.`,
    url: URL,
    siteName: SITE_CONFIG.name,
    type: "article",
    locale: "en_AU",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "HECS Repayment Threshold", item: URL },
  ],
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
  isBasedOn: {
    "@type": "WebPage",
    name: "Study and training loan repayment thresholds and rates",
    url: "https://www.ato.gov.au/tax-rates-and-codes/study-and-training-support-loans-rates-and-repayment-thresholds",
  },
};

// Same array the accordion renders, so the structured data cannot drift.
const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: HECS_THRESHOLD_FAQS.map((f) => ({
    "@type": "Question" as const,
    name: f.q,
    acceptedAnswer: { "@type": "Answer" as const, text: f.a },
  })),
};

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, article, faq]} />
      <HecsRepaymentThresholdPage />
    </>
  );
}
