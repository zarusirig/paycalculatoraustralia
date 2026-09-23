import type { Metadata } from "next";
import EmployeeVsSoleTraderVsCompanyPage from "@/modules/guide/employee-vs-sole-trader-vs-company";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, WebPage, Article, WithContext } from "schema-dts";
import { faqPageSchema } from "@/lib/faq";
import { SOLE_TRADER_COMPANY_FAQS } from "@/modules/guide/employee-vs-sole-trader-vs-company-faqs";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS } from "@/lib/authors";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/employee-vs-sole-trader-vs-company/`;
const TITLE = "Employee vs Sole Trader vs Company — Which Pays More?";
const DESCRIPTION = "Compare employee, sole trader, and company structures in Australia. Tax rates, super obligations, personal liability, GST, and real take-home pay comparison at different income levels.";

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
    { "@type": "ListItem", position: 2, name: "Employee vs Sole Trader vs Company", item: URL },
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
  author: AUTHORS["penny-ward"].jsonLd,
  publisher: { "@type": "Organization", name: SITE_CONFIG.name, logo: { "@type": "ImageObject", url: `${BASE}/icon-512.png` } },
  mainEntityOfPage: { "@type": "WebPage", "@id": URL },
};

const faq = faqPageSchema(SOLE_TRADER_COMPANY_FAQS);

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, article, faq]} />
      <EmployeeVsSoleTraderVsCompanyPage />
    </>
  );
}
