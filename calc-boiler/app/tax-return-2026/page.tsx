import type { Metadata } from "next";
import type { Article, BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import TaxReturn2026Page from "@/modules/guide/tax-return-2026";
import { TAX_RETURN_2026_FAQS } from "@/modules/guide/tax-return-2026-faqs";
import { JsonLd } from "@/modules/seo/json-ld";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS } from "@/lib/authors";
import { RETURN_2026 } from "@/lib/constants/tax-return-2025-26";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/tax-return-2026/`;
const R = RETURN_2026;

// Year-specific on purpose: /tax-refund-guide/ owns the evergreen "how tax
// returns work" intent and /tax-calendar/ owns the full-year date list.
const TITLE = "Tax Return 2026: 31 Oct Deadline, Refund Estimator & Rates";
const DESCRIPTION = `Your 2026 tax return covers ${R.incomeYear}. Lodge yourself by ${R.selfLodgeDueDate}, or by ${R.agentDueDateMostPeople} with a tax agent. Most online refunds arrive within ${R.onlineRefundTypical}.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: `The ${R.incomeYear} return: deadline, refund timing, what changed and a refund estimator.`,
    url: URL,
    siteName: SITE_CONFIG.name,
    type: "article",
    locale: "en_AU",
    images: ["/og-image.png"],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Tax Returns", item: `${BASE}/tax-refund-guide/` },
    { "@type": "ListItem", position: 3, name: "Tax Return 2026", item: URL },
  ],
};

const article: WithContext<Article> = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: TITLE,
  description: DESCRIPTION,
  author: AUTHORS["james-harrington"].jsonLd,
  publisher: {
    "@type": "Organization",
    name: SITE_CONFIG.name,
    logo: { "@type": "ImageObject", url: `${BASE}/icon-512.png` },
  },
  datePublished: "2026-09-23",
  dateModified: "2026-09-23",
  mainEntityOfPage: { "@type": "WebPage", "@id": URL },
};

const webApp: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Tax Refund Estimator 2026 (2025-26 rates)",
  url: URL,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
  inLanguage: "en-AU",
};

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: TAX_RETURN_2026_FAQS.map((f) => ({
    "@type": "Question" as const,
    name: f.q,
    acceptedAnswer: { "@type": "Answer" as const, text: f.a },
  })),
};

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, article, webApp, faq]} />
      <TaxReturn2026Page />
    </>
  );
}
