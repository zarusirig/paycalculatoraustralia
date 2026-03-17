import type { Metadata } from "next";
import SalarySacrificeGuidePage from "@/modules/guide/salary-sacrifice-guide";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebPage, Article, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS, GUIDE_AUTHORSHIP } from "@/lib/authors";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/salary-sacrifice-guide/`;
const TITLE = "Salary Sacrifice Guide — How It Works in Australia (2025)";
const DESCRIPTION = "Learn how salary sacrificing into super or a novated lease can legally reduce your taxable income. Discover the pros, cons, and FBT implications in Australia.";

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
    { "@type": "ListItem", position: 2, name: "Salary Sacrifice Guide", item: URL },
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
  author: AUTHORS["james-harrington"].jsonLd,
  publisher: { "@type": "Organization", name: SITE_CONFIG.name, logo: { "@type": "ImageObject", url: `${BASE}/favicon.ico` } },
  mainEntityOfPage: { "@type": "WebPage", "@id": URL },
  isBasedOn: { "@type": "Legislation", name: "Income Tax Assessment Act 1997", url: "https://www.legislation.gov.au/Details/C2024C00342" },
};

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "What is salary sacrificing?", acceptedAnswer: { "@type": "Answer", text: "Salary sacrificing (or salary packaging) is an arrangement where you agree to forego part of your future pre-tax salary in return for your employer providing benefits of a similar value. This legally reduces your taxable income, meaning you pay less income tax." } },
    { "@type": "Question", name: "Do I pay tax on salary sacrificed super?", acceptedAnswer: { "@type": "Answer", text: "Yes, but the tax rate is usually significantly lower. When you salary sacrifice into superannuation, that money is taxed at a flat rate of 15% when it enters the fund, rather than your higher marginal income tax rate (which could be up to 45%)." } },
    { "@type": "Question", name: "Is salary sacrificing suitable for everyone?", acceptedAnswer: { "@type": "Answer", text: "No. Salary sacrificing is generally most beneficial for middle-to-high income earners. If you earn less than $45,000, your marginal tax rate is already quite low, so the 15% tax concession on super offers minimal benefit and locks your money away until retirement." } },
  ]
};

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, article, faq]} />
      <SalarySacrificeGuidePage />
    </>
  );
}
