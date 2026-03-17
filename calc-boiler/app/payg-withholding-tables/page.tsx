import type { Metadata } from "next";
import PAYGTablesGuidePage from "@/modules/guide/payg-withholding-tables";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebPage, Article, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS, GUIDE_AUTHORSHIP } from "@/lib/authors";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/payg-withholding-tables/`;
const TITLE = "PAYG Withholding Tax Tables 2025-26 — Australia";
const DESCRIPTION = "View the official ATO PAYG withholding tax tables for weekly, fortnightly, and monthly pay cycles. Understand how your employer calculates your tax deductions before paying you.";

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
    { "@type": "ListItem", position: 2, name: "PAYG Withholding Tables", item: URL },
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
  isBasedOn: { "@type": "Legislation", name: "Tax Administration Act 1953", url: "https://www.legislation.gov.au/Details/C2024C00327" },
};

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "What does PAYG mean in Australia?", acceptedAnswer: { "@type": "Answer", text: "PAYG stands for 'Pay As You Go'. It is the system where your employer automatically deducts income tax from your gross wages and sends it to the Australian Taxation Office (ATO) on your behalf before you receive your take-home pay." } },
    { "@type": "Question", name: "Why does my PAYG withholding seem higher than my actual tax bracket?", acceptedAnswer: { "@type": "Answer", text: "PAYG withholding tables are designed by the ATO to ensure you don't face a large tax bill at the end of the year. They often account for the Medicare Levy (2%) and assume a steady income. If too much tax is withheld during the year, you will receive it back as a tax refund when you lodge your return." } },
    { "@type": "Question", name: "How does my employer know how much tax to withhold?", acceptedAnswer: { "@type": "Answer", text: "When you start a job, you fill out a Tax File Number (TFN) Declaration. Your answers (such as whether you are claiming the tax-free threshold or have a HECS debt) determine exactly which ATO PAYG formula your employer's payroll software must use to calculate your tax each pay cycle." } },
  ]
};

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, article, faq]} />
      <PAYGTablesGuidePage />
    </>
  );
}
