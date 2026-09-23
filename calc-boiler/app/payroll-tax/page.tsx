import type { Metadata } from "next";
import type { Article, BreadcrumbList, FAQPage, WithContext } from "schema-dts";
import PayrollTaxHubPage from "@/modules/payroll-tax/payroll-tax-hub-page";
import { HUB_FAQS } from "@/modules/payroll-tax/content";
import { JsonLd } from "@/modules/seo/json-ld";
import { SITE_CONFIG } from "@/lib/constants";
import { PAYROLL_TAX_FY } from "@/lib/constants/payroll-tax";
import { pageDatePublished } from "@/lib/page-dates";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/payroll-tax/`;

const TITLE = `Payroll Tax Australia ${PAYROLL_TAX_FY}: Rates and Thresholds by State`;
const DESCRIPTION = `Payroll tax rates and thresholds for every state and territory in ${PAYROLL_TAX_FY}, from $1m (VIC, WA) to $2.5m (NT). How it is calculated, who must register, due dates, and what it costs at $1.5m to $10m of wages.`;

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
    { "@type": "ListItem", position: 2, name: "Payroll Tax", item: URL },
  ],
};

const article: WithContext<Article> = {
  "@context": "https://schema.org",
  "@type": "Article",
  datePublished: pageDatePublished("payroll-tax", "2026-09-23"),
  headline: `Payroll Tax in Australia ${PAYROLL_TAX_FY}: Rates and Thresholds by State`,
  description: DESCRIPTION,
  url: URL,
  inLanguage: "en-AU",
  dateModified: "2026-09-23",
  author: { "@type": "Person", name: "James Harrington" },
  publisher: { "@type": "Organization", name: SITE_CONFIG.name, url: BASE },
};

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: HUB_FAQS.map((f) => ({
    "@type": "Question" as const,
    name: f.q,
    acceptedAnswer: { "@type": "Answer" as const, text: f.a },
  })),
};

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, article, faq]} />
      <PayrollTaxHubPage />
    </>
  );
}
