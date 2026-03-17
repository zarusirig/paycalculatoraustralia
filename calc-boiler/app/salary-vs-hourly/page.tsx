import type { Metadata } from "next";
import SalaryVsHourlyPage from "@/modules/guide/salary-vs-hourly";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebPage, Article, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS } from "@/lib/authors";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/salary-vs-hourly/`;
const TITLE = "Salary vs Hourly Pay Australia — Which Is Better For You?";
const DESCRIPTION = "Salary vs hourly pay: compare the real differences. Overtime access, leave entitlements, stability, and total package value. See which arrangement pays more for your situation.";

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
    { "@type": "ListItem", position: 2, name: "Salary vs Hourly Pay", item: URL },
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
    { "@type": "Question", name: "Is salary or hourly pay better in Australia?", acceptedAnswer: { "@type": "Answer", text: "Neither is universally better. Salary provides income stability, paid leave, and predictable budgeting. Hourly pay ensures you are compensated for every hour worked, including overtime and penalty rates. The best option depends on your industry, role, and personal financial priorities." } },
    { "@type": "Question", name: "How do I convert my salary to an hourly rate?", acceptedAnswer: { "@type": "Answer", text: "Divide your annual salary by 52 weeks, then divide by your standard weekly hours (usually 38 for full-time). For example, $75,000 / 52 / 38 = $38.07 per hour. Use our Hourly to Annual Salary Calculator for an instant conversion." } },
    { "@type": "Question", name: "Do salaried employees get overtime in Australia?", acceptedAnswer: { "@type": "Answer", text: "It depends on the award or enterprise agreement. Many salaried employees have 'reasonable additional hours' clauses meaning they do not receive overtime pay. However, some awards and agreements require overtime compensation for salaried workers who exceed standard hours." } },
  ]
};

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, article, faq]} />
      <SalaryVsHourlyPage />
    </>
  );
}
