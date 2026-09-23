import type { Metadata } from "next";
import SuperGuaranteeRateHistoryPage from "@/modules/guide/super-guarantee-rate-history";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebPage, Article, WithContext } from "schema-dts";
import { SITE_CONFIG, SUPER_GUARANTEE, formatPercent } from "@/lib/constants";
import { SG_RATE_FAQS } from "@/modules/guide/super-guarantee-rate-faqs";
import { AUTHORS } from "@/lib/authors";
import { pageDateModified, pageDatePublished } from "@/lib/page-dates";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/super-guarantee-rate-history/`;
// Retargeted 23 Sep 2026 (W2) for "superannuation rate" and "super guarantee
// rate": the title, H1 and intro answer the current rate first; history second.
const RATE = formatPercent(SUPER_GUARANTEE.rate, 0);
const TITLE = `Super Guarantee Rate ${SITE_CONFIG.financialYear}: ${RATE} | Superannuation Rate History`;
const DESCRIPTION = `The superannuation guarantee rate is ${RATE} from ${SUPER_GUARANTEE.effectiveDate} and stays ${RATE} for ${SITE_CONFIG.financialYear}, now paid every payday. What your employer pays, and every SG rate since 2002.`;

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
    { "@type": "ListItem", position: 2, name: "Superannuation", item: `${BASE}/superannuation-guide/` },
    { "@type": "ListItem", position: 3, name: "Super Guarantee Rate", item: URL },
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
  datePublished: pageDatePublished("super-guarantee-rate-history"),
  dateModified: pageDateModified("super-guarantee-rate-history"),
  headline: TITLE,
  description: DESCRIPTION,
  author: AUTHORS["james-harrington"].jsonLd,
  publisher: { "@type": "Organization", name: SITE_CONFIG.name, logo: { "@type": "ImageObject", url: `${BASE}/icon-512.png` } },
  mainEntityOfPage: { "@type": "WebPage", "@id": URL },
};

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: SG_RATE_FAQS.map((f) => ({
    "@type": "Question" as const,
    name: f.q,
    acceptedAnswer: { "@type": "Answer" as const, text: f.a },
  })),
};

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, article, faq]} />
      <SuperGuaranteeRateHistoryPage />
    </>
  );
}
