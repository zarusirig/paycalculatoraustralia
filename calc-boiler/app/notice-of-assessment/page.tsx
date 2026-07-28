import type { Metadata } from "next";
import NoticeOfAssessmentPage from "@/modules/guide/notice-of-assessment";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebPage, Article, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS } from "@/lib/authors";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/notice-of-assessment/`;
const TITLE = "Notice of Assessment — How to Read Your ATO Assessment";
const DESCRIPTION = "How to read your Notice of Assessment from the ATO. Understand taxable income, tax offsets, Medicare levy, credits, and what your refund or debt amount means.";

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
    { "@type": "ListItem", position: 2, name: "Notice of Assessment", item: URL },
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
};

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "What is a Notice of Assessment?", acceptedAnswer: { "@type": "Answer", text: "A Notice of Assessment (NOA) is an official document issued by the Australian Taxation Office after processing your tax return. It shows your taxable income, the tax calculated, any offsets applied, Medicare levy, HECS-HELP repayment, tax credits, and the final result — either a refund or an amount owing." } },
    { "@type": "Question", name: "How long does it take to receive a Notice of Assessment?", acceptedAnswer: { "@type": "Answer", text: "If you lodge electronically through myTax or a tax agent, the ATO typically issues your Notice of Assessment within 2 weeks. Paper lodgements take 10-12 weeks. Complex returns requiring manual review may take longer." } },
    { "@type": "Question", name: "What can I do if I disagree with my Notice of Assessment?", acceptedAnswer: { "@type": "Answer", text: "You have 2 years from the date of the assessment to request an amendment for most individual taxpayers (4 years for more complex affairs). You can lodge an objection through myGov, your tax agent, or by writing to the ATO. If the objection is disallowed, you can escalate to the Administrative Appeals Tribunal." } },
  ]
};

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, article, faq]} />
      <NoticeOfAssessmentPage />
    </>
  );
}
