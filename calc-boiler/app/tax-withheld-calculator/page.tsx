import type { Metadata } from "next";
import TaxWithheldCalculatorPage from "@/modules/guide/tax-withheld-calculator";
import { TAX_WITHHELD_FAQS } from "@/modules/guide/tax-withheld-calculator-faqs";
import { JsonLd } from "@/modules/seo/json-ld";
import type { Article, BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS, GUIDE_AUTHORSHIP } from "@/lib/authors";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/tax-withheld-calculator/`;
const FY = SITE_CONFIG.financialYear;

// Targets "tax withholding estimator" (27.1k), "tax withheld calculator",
// "ato tax withheld calculator" (5.4k), "tax withheld" (6.6k), "payg tax"
// (9.9k). Distinct from the /weekly|fortnightly|monthly-tax-table/ pages,
// which are lookup tables; this is per-pay withholding → year-end refund/bill.
const TITLE = `Tax Withheld Calculator ${FY}: ATO PAYG Withholding Estimator`;
const DESCRIPTION = `Work out the tax withheld from your weekly, fortnightly or monthly pay for ${FY} using the ATO's PAYG withholding formulas, with or without the tax-free threshold and HECS-HELP, then see your likely refund or tax bill.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "PAYG Withholding Tables", item: `${BASE}/payg-withholding-tables/` },
    { "@type": "ListItem", position: 3, name: "Tax Withheld Calculator", item: URL },
  ],
};

const app: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: `Tax Withheld Calculator ${FY}`,
  description: DESCRIPTION,
  url: URL,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Any",
  inLanguage: "en-AU",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
  publisher: { "@type": "Organization", name: SITE_CONFIG.name },
};

const article: WithContext<Article> = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: `Tax Withheld Calculator ${FY}`,
  description: DESCRIPTION,
  url: URL,
  datePublished: "2026-09-23",
  dateModified: GUIDE_AUTHORSHIP["tax-withheld-calculator"].lastReviewed,
  author: AUTHORS["james-harrington"].jsonLd,
  publisher: { "@type": "Organization", name: SITE_CONFIG.name, logo: { "@type": "ImageObject", url: `${BASE}/icon-512.png` } },
  mainEntityOfPage: URL,
  inLanguage: "en-AU",
};

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: TAX_WITHHELD_FAQS.map((f) => ({
    "@type": "Question" as const,
    name: f.q,
    acceptedAnswer: { "@type": "Answer" as const, text: f.a },
  })),
};

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, app, article, faq]} />
      <TaxWithheldCalculatorPage />
    </>
  );
}
