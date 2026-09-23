import type { Metadata } from "next";
import STSLOnPayslipPage from "@/modules/guide/stsl-on-payslip";
import { faqPageSchema } from "@/lib/faq";
import { STSL_FAQS } from "@/modules/guide/stsl-on-payslip-faqs";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, WebPage, Article, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS } from "@/lib/authors";
import { pageDatePublished } from "@/lib/page-dates";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/stsl-on-payslip/`;
const TITLE = "What Is STSL on Your Payslip? STSL Tax Explained (2026-27)";
const DESCRIPTION = "STSL on your payslip stands for Study and Training Support Loans — the extra tax withheld for your HECS-HELP repayment. How it's calculated and how to stop it.";

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
    { "@type": "ListItem", position: 2, name: "Understanding Your Payslip", item: `${BASE}/understanding-your-payslip/` },
    { "@type": "ListItem", position: 3, name: "STSL on Payslip", item: URL },
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
  datePublished: pageDatePublished("stsl-on-payslip", "2026-07-02"),
  headline: TITLE,
  description: DESCRIPTION,
  author: AUTHORS["james-harrington"].jsonLd,
  publisher: { "@type": "Organization", name: SITE_CONFIG.name, logo: { "@type": "ImageObject", url: `${BASE}/icon-512.png` } },
  mainEntityOfPage: { "@type": "WebPage", "@id": URL },
  dateModified: "2026-07-02",
};

const faq = faqPageSchema(STSL_FAQS);

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, article, faq]} />
      <STSLOnPayslipPage />
    </>
  );
}
