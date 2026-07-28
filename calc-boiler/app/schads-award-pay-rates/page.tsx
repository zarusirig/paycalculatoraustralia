import type { Metadata } from "next";
import type { Article, BreadcrumbList, FAQPage, WebPage, WithContext } from "schema-dts";
import SchadsAwardPayRatesPage from "@/modules/guide/schads-award-pay-rates";
import { SCHADS_FAQS, CLAUSE_15_LEVEL_4 } from "@/modules/guide/schads-award-faqs";
import { JsonLd } from "@/modules/seo/json-ld";
import { SITE_CONFIG, formatAUD } from "@/lib/constants";
import { AUTHORS } from "@/lib/authors";
import { SCHADS_AWARD, SCHADS_SACS } from "@/lib/constants/schads-award";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/schads-award-pay-rates/`;

// Derived from the engine constants so the title, description, JSON-LD and
// rendered page can never disagree — the defect class that put a stale $5,538
// into Google's index on /tax-on/50000/.
const L1 = SCHADS_SACS[0];
const L4 = SCHADS_SACS.find((r) => r.classification === "Level 4 pay point 1")!;
const L8 = SCHADS_SACS[SCHADS_SACS.length - 1];

const TITLE = `SCHADS Award Pay Rates ${SITE_CONFIG.financialYear} — All Levels & Pay Points`;
// The ERO is attributed to Level 4 specifically, not to the whole range —
// its tables begin at Level 2 and Level 1 receives no uplift. An earlier
// draft read "Level 1 … to Level 8, with the Equal Remuneration Order
// applied", which implied otherwise in the format Google trusts most.
const DESCRIPTION = `Every SCHADS classification rate from ${SCHADS_AWARD.operativeFrom}, Level 1 ${formatAUD(L1.hourly, 2)}/hr to Level 8 ${formatAUD(L8.hourly, 2)}/hr. Level 4 is ${formatAUD(L4.weekly, 2)} a week once the Equal Remuneration Order is applied — not the ${formatAUD(CLAUSE_15_LEVEL_4, 2)} printed in clause 15. Penalty rates, allowances and casual loading included.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: `All ${SCHADS_AWARD.code} classification rates, ERO-inclusive, operative ${SCHADS_AWARD.operativeFrom}.`,
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
    { "@type": "ListItem", position: 2, name: "Award Rates", item: `${BASE}/award-rates/` },
    { "@type": "ListItem", position: 3, name: "SCHADS Award Pay Rates", item: URL },
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
  author: AUTHORS["penny-ward"].jsonLd,
  publisher: {
    "@type": "Organization",
    name: SITE_CONFIG.name,
    logo: { "@type": "ImageObject", url: `${BASE}/favicon.ico` },
  },
  mainEntityOfPage: { "@type": "WebPage", "@id": URL },
  isBasedOn: {
    "@type": "Legislation",
    name: `${SCHADS_AWARD.name} (${SCHADS_AWARD.code})`,
    url: SCHADS_AWARD.awardTextUrl,
  },
};

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: SCHADS_FAQS.map((f) => ({
    "@type": "Question" as const,
    name: f.q,
    acceptedAnswer: { "@type": "Answer" as const, text: f.a },
  })),
};

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, article, faq]} />
      <SchadsAwardPayRatesPage />
    </>
  );
}
