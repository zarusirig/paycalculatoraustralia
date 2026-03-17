import type { Metadata } from "next";
import EmployeeVsSoleTraderVsCompanyPage from "@/modules/guide/employee-vs-sole-trader-vs-company";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebPage, Article, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS } from "@/lib/authors";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/employee-vs-sole-trader-vs-company/`;
const TITLE = "Employee vs Sole Trader vs Company — Pay, Tax & Structure Comparison";
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
  publisher: { "@type": "Organization", name: SITE_CONFIG.name, logo: { "@type": "ImageObject", url: `${BASE}/favicon.ico` } },
  mainEntityOfPage: { "@type": "WebPage", "@id": URL },
};

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "When should I switch from sole trader to a company?", acceptedAnswer: { "@type": "Answer", text: "Consider switching when your taxable income consistently exceeds $120,000-$135,000, when you need asset protection from business liabilities, or when you want to retain profits in the business at the 25% company tax rate rather than paying individual marginal rates up to 45%." } },
    { "@type": "Question", name: "Do sole traders pay the same tax as employees?", acceptedAnswer: { "@type": "Answer", text: "Yes, sole traders pay individual income tax at the same marginal rates as employees. However, sole traders must also pay their own superannuation (optional but recommended), manage GST registration if turnover exceeds $75,000, and lodge a Business Activity Statement (BAS) quarterly." } },
    { "@type": "Question", name: "What is the company tax rate in Australia?", acceptedAnswer: { "@type": "Answer", text: "The base rate entity company tax rate is 25% for companies with aggregated turnover under $50 million. This flat rate applies to all taxable company income, compared to individual marginal rates that range from 0% to 45% plus the 2% Medicare levy." } },
  ]
};

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, article, faq]} />
      <EmployeeVsSoleTraderVsCompanyPage />
    </>
  );
}
