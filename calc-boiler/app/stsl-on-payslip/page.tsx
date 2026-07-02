import type { Metadata } from "next";
import STSLOnPayslipPage from "@/modules/guide/stsl-on-payslip";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebPage, Article, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS } from "@/lib/authors";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/stsl-on-payslip/`;
const TITLE = "What Is STSL on Your Payslip? STSL Tax Explained (2026-27)";
const DESCRIPTION = "STSL on your payslip stands for Study and Training Support Loans — the extra tax withheld to cover your HECS-HELP repayment. See how it's calculated, why the amount changes, and how to stop it once your loan is paid off.";

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
  headline: TITLE,
  description: DESCRIPTION,
  author: AUTHORS["james-harrington"].jsonLd,
  publisher: { "@type": "Organization", name: SITE_CONFIG.name, logo: { "@type": "ImageObject", url: `${BASE}/favicon.ico` } },
  mainEntityOfPage: { "@type": "WebPage", "@id": URL },
  dateModified: "2026-07-02",
};

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "What does STSL mean on a payslip?", acceptedAnswer: { "@type": "Answer", text: "STSL stands for Study and Training Support Loans. It is the extra PAYG amount your employer withholds each pay cycle to cover the compulsory repayment of your HECS-HELP, FEE-HELP, VET Student Loan, or other government study loan. It only applies once your earnings pass the repayment threshold ($69,528 for FY2026-27)." } },
    { "@type": "Question", name: "Is STSL the same as HECS?", acceptedAnswer: { "@type": "Answer", text: "Effectively yes for most people. STSL is the ATO's umbrella term covering HECS-HELP, FEE-HELP, VET Student Loans, SA-HELP, and apprenticeship loans. If your only loan is HECS, the STSL line on your payslip is your HECS withholding." } },
    { "@type": "Question", name: "Why did STSL suddenly appear on my payslip?", acceptedAnswer: { "@type": "Answer", text: "Usually because a pay rise, extra hours, or a bonus pushed your per-pay earnings above the repayment threshold (annualised $69,528 for FY2026-27), or because you updated your TFN declaration to declare a study loan." } },
    { "@type": "Question", name: "Does STSL withholding reduce my HELP debt straight away?", acceptedAnswer: { "@type": "Answer", text: "No. Withheld STSL sits as a credit with the ATO until your tax return is assessed. Your loan balance — including 1 June indexation — is only reduced at assessment. Voluntary repayments are the only way to reduce the balance mid-year." } },
    { "@type": "Question", name: "How do I stop STSL deductions after paying off my HECS?", acceptedAnswer: { "@type": "Answer", text: "Give your employer a Withholding Declaration (or update their payroll portal) stating you no longer have a study loan debt. The ATO does not notify employers automatically. Any extra STSL withheld in the meantime is refunded when you lodge your tax return." } },
  ]
};

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, article, faq]} />
      <STSLOnPayslipPage />
    </>
  );
}
