import type { Metadata } from "next";
import TaxFreeThresholdPage from "@/modules/guide/tax-free-threshold";
import { TAX_FREE_THRESHOLD_FAQS } from "@/modules/guide/tax-free-threshold-faqs";
import { JsonLd } from "@/modules/seo/json-ld";
import type { Article, BreadcrumbList, FAQPage, WebPage, WithContext } from "schema-dts";
import { SITE_CONFIG, TAX_FREE_THRESHOLD, formatAUD } from "@/lib/constants";
import { TFT_PER_PERIOD, effectiveNilTaxIncome } from "@/lib/constants/tax-free-threshold";
import { AUTHORS, GUIDE_AUTHORSHIP } from "@/lib/authors";
import { withPageEnd } from "@/components/common/content-slots";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/tax-free-threshold/`;
const FY = SITE_CONFIG.financialYear;
const T = formatAUD(TAX_FREE_THRESHOLD);
const NIL = formatAUD(effectiveNilTaxIncome());

// Intent split with /tax-brackets/: that page answers "what are the rates";
// this one answers "what is the threshold, and should I claim it on this job".
const TITLE = `Tax-Free Threshold ${FY}: ${T} — Should You Claim It?`;
const DESCRIPTION = `The Australian tax-free threshold is ${T} (${formatAUD(TFT_PER_PERIOD.weekly)} a week) for ${FY}, and no income tax up to ${NIL} with LITO. How to claim it on your TFN declaration.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: SITE_CONFIG.name, type: "article", locale: "en_AU", images: ["/og-image.png"] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Tax Brackets", item: `${BASE}/tax-brackets/` },
    { "@type": "ListItem", position: 3, name: "Tax-Free Threshold", item: URL },
  ],
};

const webPage: WithContext<WebPage> = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: TITLE,
  description: DESCRIPTION,
  url: URL,
  inLanguage: "en-AU",
  publisher: { "@type": "Organization", name: SITE_CONFIG.name },
};

const article: WithContext<Article> = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: `Tax-Free Threshold ${FY}: ${T} Explained`,
  description: DESCRIPTION,
  url: URL,
  datePublished: "2026-09-23",
  dateModified: GUIDE_AUTHORSHIP["tax-free-threshold"].lastReviewed,
  author: AUTHORS["james-harrington"].jsonLd,
  publisher: {
    "@type": "Organization",
    name: SITE_CONFIG.name,
    logo: { "@type": "ImageObject", url: `${BASE}/icon-512.png` },
  },
  mainEntityOfPage: URL,
  inLanguage: "en-AU",
};

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: TAX_FREE_THRESHOLD_FAQS.map((f) => ({
    "@type": "Question" as const,
    name: f.q,
    acceptedAnswer: { "@type": "Answer" as const, text: f.a },
  })),
};

function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, article, faq]} />
      <TaxFreeThresholdPage />
    </>
  );
}

export default withPageEnd(Page, "/tax-free-threshold/");
