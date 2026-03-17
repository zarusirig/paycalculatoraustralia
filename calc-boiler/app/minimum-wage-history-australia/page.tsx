import type { Metadata } from "next";
import MinimumWageHistoryPage from "@/modules/guide/minimum-wage-history-australia";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebPage, Article, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS } from "@/lib/authors";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/minimum-wage-history-australia/`;
const TITLE = "Minimum Wage History Australia \u2014 Every Rate Since 2010";
const DESCRIPTION = "Australian minimum wage history from 2010 to 2025. Annual Fair Work Commission increases, percentage changes, and how minimum wage compares to inflation and average earnings.";

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
    { "@type": "ListItem", position: 2, name: "Minimum Wage History", item: URL },
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
    { "@type": "Question", name: "What is the current minimum wage in Australia?", acceptedAnswer: { "@type": "Answer", text: "As of 1 July 2024, the national minimum wage is $24.10 per hour or $915.90 per 38-hour week. The Fair Work Commission determines the rate annually." } },
    { "@type": "Question", name: "How often does the minimum wage increase?", acceptedAnswer: { "@type": "Answer", text: "The Fair Work Commission conducts an Annual Wage Review each year, typically announcing the new rate in June with the increase taking effect from 1 July." } },
    { "@type": "Question", name: "What was the largest minimum wage increase?", acceptedAnswer: { "@type": "Answer", text: "The largest recent increase was 8.65% in 2023, raising the hourly rate from $21.38 to $23.23. This was driven by high inflation and cost-of-living pressures." } },
    { "@type": "Question", name: "Does the minimum wage keep up with inflation?", acceptedAnswer: { "@type": "Answer", text: "In most years, minimum wage increases have matched or slightly exceeded CPI inflation. However, during periods of high inflation like 2022-2023, real wage growth temporarily fell behind before the FWC responded with larger increases." } },
  ]
};

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, article, faq]} />
      <MinimumWageHistoryPage />
    </>
  );
}
