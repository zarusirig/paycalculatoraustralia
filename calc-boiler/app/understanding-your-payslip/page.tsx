import type { Metadata } from "next";
import UnderstandingYourPayslipPage from "@/modules/guide/understanding-your-payslip";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebPage, Article, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS, GUIDE_AUTHORSHIP } from "@/lib/authors";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/understanding-your-payslip/`;
const TITLE = "Understanding Your Payslip in Australia — A Complete Guide";
const DESCRIPTION = "Learn how to read your Australian payslip. Understand gross pay, NET pay, PAYG withholding, superannuation contributions, and your legal rights under the Fair Work Ombudsman.";

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
    { "@type": "ListItem", position: 2, name: "Understanding Your Payslip", item: URL },
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
  isBasedOn: { "@type": "Legislation", name: "Fair Work Act 2009", url: "https://www.legislation.gov.au/Details/C2024C00301" },
};

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "What is the difference between Gross and Net Pay?", acceptedAnswer: { "@type": "Answer", text: "Gross pay is the total amount of money you earned during the pay period before any deductions (like tax or HECS) are taken out. Net pay (or take-home pay) is the final amount that actually lands in your bank account after all taxes and deductions have been subtracted." } },
    { "@type": "Question", name: "What must be legally included on an Australian payslip?", acceptedAnswer: { "@type": "Answer", text: "Under Fair Work laws, a payslip must include the employer's name and ABN, the employee's name, pay period dates, gross and net pay amounts, any loadings or penalty rates, specific deductions (like PAYG tax), and any superannuation contributions made." } },
    { "@type": "Question", name: "What is PAYG Withholding?", acceptedAnswer: { "@type": "Answer", text: "Pay As You Go (PAYG) withholding is the amount of income tax your employer legally deducts from your gross salary and sends directly to the ATO on your behalf. This ensures you gradually pay your income tax throughout the year rather than facing a massive bill at tax time." } },
  ]
};

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, article, faq]} />
      <UnderstandingYourPayslipPage />
    </>
  );
}
