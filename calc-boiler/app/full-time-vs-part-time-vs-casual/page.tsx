import type { Metadata } from "next";
import FullTimeVsPartTimeVsCasualPage from "@/modules/guide/full-time-vs-part-time-vs-casual";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebPage, Article, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS } from "@/lib/authors";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/full-time-vs-part-time-vs-casual/`;
const TITLE = "Full-Time vs Part-Time vs Casual \u2014 Complete Comparison Guide Australia";
const DESCRIPTION = "Compare full-time, part-time, and casual employment: leave entitlements, notice periods, casual loading (25%), casual conversion, and which type is best for your situation.";

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
    { "@type": "ListItem", position: 2, name: "Full-Time vs Part-Time vs Casual", item: URL },
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
    { "@type": "Question", name: "What is casual loading in Australia?", acceptedAnswer: { "@type": "Answer", text: "Casual loading is typically 25% on top of the base hourly rate, paid to compensate casuals for not receiving paid leave, notice of termination, or redundancy pay. The exact percentage may vary under specific Modern Awards." } },
    { "@type": "Question", name: "Can a casual employee become permanent?", acceptedAnswer: { "@type": "Answer", text: "Yes. Under the Fair Work Act, employers must offer casual conversion to eligible employees who have worked regular hours for 12 months. Casual employees can also request conversion after 6 months of regular and systematic work." } },
    { "@type": "Question", name: "Do part-time employees get the same leave as full-time?", acceptedAnswer: { "@type": "Answer", text: "Part-time employees receive the same types of leave entitlements as full-time employees, but calculated on a pro-rata basis according to their ordinary hours of work." } },
    { "@type": "Question", name: "What are the standard hours for full-time work?", acceptedAnswer: { "@type": "Answer", text: "Full-time employees work 38 ordinary hours per week under the National Employment Standards. Some awards or agreements may average this over a cycle (e.g., 76 hours per fortnight)." } },
    { "@type": "Question", name: "Do casual employees get superannuation?", acceptedAnswer: { "@type": "Answer", text: "Yes. From 1 July 2022, all employees including casuals receive the Super Guarantee regardless of how much they earn. The SG rate is 12% in FY2025-26." } },
    { "@type": "Question", name: "Is casual or part-time better financially?", acceptedAnswer: { "@type": "Answer", text: "It depends on your situation. Casuals earn 25% loading but miss out on paid leave worth roughly 10-15% of salary. Part-time employees get pro-rata leave and job security. For short-term or irregular work, casual can pay more; for ongoing stable work, part-time often provides better overall value." } },
  ]
};

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, article, faq]} />
      <FullTimeVsPartTimeVsCasualPage />
    </>
  );
}
