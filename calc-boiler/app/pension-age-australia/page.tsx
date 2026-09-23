import type { Metadata } from "next";
import type { Article, BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import PensionAgeAustraliaPage from "@/modules/guide/pension-age-australia";
import { PENSION_AGE_FAQS } from "@/modules/guide/pension-age-australia-faqs";
import { JsonLd } from "@/modules/seo/json-ld";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS } from "@/lib/authors";
import { AGE_PENSION_AGE } from "@/lib/constants/pension-age";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/pension-age-australia/`;

const TITLE = `Pension Age Australia: ${AGE_PENSION_AGE}, Plus Retirement Age Calculator`;
const DESCRIPTION = `Age Pension age in Australia is ${AGE_PENSION_AGE}. There is no compulsory retirement age and super preservation age is 60. Enter your birth date to see your pension dates.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: "Age Pension age, retirement age and super preservation age by date of birth.",
    url: URL,
    siteName: SITE_CONFIG.name,
    type: "article",
    locale: "en_AU",
    images: ["/og-image.png"],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Superannuation", item: `${BASE}/superannuation-guide/` },
    { "@type": "ListItem", position: 3, name: "Pension Age Australia", item: URL },
  ],
};

const article: WithContext<Article> = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: TITLE,
  description: DESCRIPTION,
  author: AUTHORS["james-harrington"].jsonLd,
  publisher: {
    "@type": "Organization",
    name: SITE_CONFIG.name,
    logo: { "@type": "ImageObject", url: `${BASE}/icon-512.png` },
  },
  datePublished: "2026-09-23",
  dateModified: "2026-09-23",
  mainEntityOfPage: { "@type": "WebPage", "@id": URL },
  isBasedOn: {
    "@type": "Legislation",
    name: "Social Security Act 1991, section 23(5A)–(5D) (pension age)",
    url: "https://guides.dss.gov.au/social-security-guide/3/4/1/10",
  },
};

const webApp: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Pension Age Calculator",
  url: URL,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
  inLanguage: "en-AU",
};

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: PENSION_AGE_FAQS.map((f) => ({
    "@type": "Question" as const,
    name: f.q,
    acceptedAnswer: { "@type": "Answer" as const, text: f.a },
  })),
};

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, article, webApp, faq]} />
      <PensionAgeAustraliaPage />
    </>
  );
}
