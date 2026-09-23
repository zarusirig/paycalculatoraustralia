import type { Metadata } from "next";
import SalarySacrificeVsMortgagePage from "@/modules/guide/salary-sacrifice-vs-mortgage";
import { faqPageSchema } from "@/lib/faq";
import { SALARY_SACRIFICE_VS_MORTGAGE_FAQS } from "@/modules/guide/salary-sacrifice-vs-mortgage-faqs";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, WebPage, Article, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS } from "@/lib/authors";
import { pageDateModified, pageDatePublished } from "@/lib/page-dates";
import { withPageEnd } from "@/components/common/content-slots";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/salary-sacrifice-vs-mortgage/`;
const TITLE = "Salary Sacrifice to Super vs Extra Mortgage Payments";
const DESCRIPTION = "Should you salary sacrifice into super or make extra mortgage payments? Compare tax savings, returns and access, with real scenarios at different incomes and debts.";

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
    { "@type": "ListItem", position: 2, name: "Salary Sacrifice vs Mortgage", item: URL },
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
  datePublished: pageDatePublished("salary-sacrifice-vs-mortgage"),
  dateModified: pageDateModified("salary-sacrifice-vs-mortgage"),
  headline: TITLE,
  description: DESCRIPTION,
  author: AUTHORS["james-harrington"].jsonLd,
  publisher: { "@type": "Organization", name: SITE_CONFIG.name, logo: { "@type": "ImageObject", url: `${BASE}/icon-512.png` } },
  mainEntityOfPage: { "@type": "WebPage", "@id": URL },
};

const faq = faqPageSchema(SALARY_SACRIFICE_VS_MORTGAGE_FAQS);

function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, article, faq]} />
      <SalarySacrificeVsMortgagePage />
    </>
  );
}

export default withPageEnd(Page, "/salary-sacrifice-vs-mortgage/");
