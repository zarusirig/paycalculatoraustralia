import type { Metadata } from "next";
import AverageSalaryAustraliaPage from "@/modules/guide/average-salary-australia";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebPage, Article, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS } from "@/lib/authors";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/average-salary-australia/`;
const TITLE = "Average Salary in Australia — By Industry, State & Age";
const DESCRIPTION = "Average salaries in Australia by industry, state, and experience level. From mining ($120K+) to hospitality ($55K). See where your salary sits and calculate your take-home pay.";

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
    { "@type": "ListItem", position: 2, name: "Average Salary Australia", item: URL },
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
    { "@type": "Question", name: "What is the average salary in Australia?", acceptedAnswer: { "@type": "Answer", text: "The average full-time salary in Australia is approximately $98,000 per year (before tax) as of late 2025. However, the median salary — which better represents a 'typical' worker — is around $72,000. The gap between mean and median reflects high earners in mining, finance, and technology pulling the average upward." } },
    { "@type": "Question", name: "What is the highest paying industry in Australia?", acceptedAnswer: { "@type": "Answer", text: "Mining is the highest paying industry in Australia with an average full-time salary of approximately $130,000. This is followed by Information Technology ($110,000), Financial Services ($105,000), and Construction ($95,000)." } },
    { "@type": "Question", name: "Which state has the highest average salary?", acceptedAnswer: { "@type": "Answer", text: "Western Australia has the highest average salary at approximately $110,000 per year, driven by the mining and resources sector. New South Wales follows at $102,000, with the ACT at $100,000 reflecting its concentration of public service roles." } },
  ]
};

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, article, faq]} />
      <AverageSalaryAustraliaPage />
    </>
  );
}
