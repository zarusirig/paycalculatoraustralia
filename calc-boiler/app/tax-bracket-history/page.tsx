import type { Metadata } from "next";
import TaxBracketHistoryPage from "@/modules/guide/tax-bracket-history";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, WebPage, Article, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS } from "@/lib/authors";
import { pageDateModified, pageDatePublished } from "@/lib/page-dates";
import { faqPageSchema } from "@/lib/faq";
import { TAX_BRACKET_HISTORY_FAQS } from "@/modules/guide/tax-bracket-history-faqs";
import { withPageEnd } from "@/components/common/content-slots";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/tax-bracket-history/`;
const TITLE = "Australian Tax Bracket History — Every Rate From 2020 to 2026";
const DESCRIPTION = "Australian tax brackets from FY2020-21 to FY2026-27: how rates and thresholds changed year by year, including the Stage 3 tax cuts. Historical rate comparison.";

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
  datePublished: pageDatePublished("tax-bracket-history"),
  dateModified: pageDateModified("tax-bracket-history"),
  headline: TITLE,
  description: DESCRIPTION,
  author: AUTHORS["james-harrington"].jsonLd,
  publisher: { "@type": "Organization", name: SITE_CONFIG.name, logo: { "@type": "ImageObject", url: `${BASE}/icon-512.png` } },
  mainEntityOfPage: { "@type": "WebPage", "@id": URL },
};

const faq = faqPageSchema(TAX_BRACKET_HISTORY_FAQS);

function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, article, faq]} />
      <TaxBracketHistoryPage />
    </>
  );
}

export default withPageEnd(Page, "/tax-bracket-history/");
