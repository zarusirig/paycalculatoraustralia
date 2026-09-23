import type { Metadata } from "next";
import type { Article, BreadcrumbList, FAQPage, WithContext } from "schema-dts";
import MinimumWageAustraliaPage from "@/modules/guide/minimum-wage-australia";
import { MW_DESCRIPTION, MW_FAQS, MW_TITLE } from "@/modules/guide/minimum-wage-australia-data";
import { JsonLd } from "@/modules/seo/json-ld";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS } from "@/lib/authors";
import { NMW_ORDER } from "@/lib/constants/junior-rates";
import { pageDateModified, pageDatePublished } from "@/lib/page-dates";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/minimum-wage-australia/`;

// Current-rate intent ("what is the minimum wage in australia", "minimum wage
// australia 2026", state variants). /minimum-wage-history-australia/ keeps the
// history intent so the two do not compete.
export const metadata: Metadata = {
  title: MW_TITLE,
  description: MW_DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: MW_TITLE, description: MW_DESCRIPTION, url: URL, siteName: SITE_CONFIG.name, type: "article", locale: "en_AU" },
  twitter: { card: "summary_large_image", title: MW_TITLE, description: MW_DESCRIPTION },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Award Rates", item: `${BASE}/award-rates/` },
    { "@type": "ListItem", position: 3, name: "Minimum Wage Australia", item: URL },
  ],
};

const article: WithContext<Article> = {
  "@context": "https://schema.org",
  "@type": "Article",
  datePublished: pageDatePublished("minimum-wage-australia"),
  dateModified: pageDateModified("minimum-wage-australia"),
  headline: MW_TITLE,
  description: MW_DESCRIPTION,
  author: AUTHORS["penny-ward"].jsonLd,
  publisher: {
    "@type": "Organization",
    name: SITE_CONFIG.name,
    logo: { "@type": "ImageObject", url: `${BASE}/icon-512.png` },
  },
  mainEntityOfPage: { "@type": "WebPage", "@id": URL },
  isBasedOn: {
    "@type": "Legislation",
    name: `${NMW_ORDER.citation} (${NMW_ORDER.reference})`,
    url: NMW_ORDER.url,
  },
};

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: MW_FAQS.map((f) => ({
    "@type": "Question" as const,
    name: f.q,
    acceptedAnswer: { "@type": "Answer" as const, text: f.a },
  })),
};

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, article, faq]} />
      <MinimumWageAustraliaPage />
    </>
  );
}
