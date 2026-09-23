import type { Metadata } from "next";
import NoticeOfAssessmentPage from "@/modules/guide/notice-of-assessment";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, WebPage, Article, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS } from "@/lib/authors";
import { pageDateModified, pageDatePublished } from "@/lib/page-dates";
import { faqPageSchema } from "@/lib/faq";
import { NOTICE_OF_ASSESSMENT_FAQS } from "@/modules/guide/notice-of-assessment-faqs";
import { withPageEnd } from "@/components/common/content-slots";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/notice-of-assessment/`;
const TITLE = "Notice of Assessment — How to Read Your ATO Assessment";
const DESCRIPTION = "How to read your Notice of Assessment from the ATO. Understand taxable income, tax offsets, Medicare levy, credits, and what your refund or debt amount means.";

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
  datePublished: pageDatePublished("notice-of-assessment"),
  dateModified: pageDateModified("notice-of-assessment"),
  headline: TITLE,
  description: DESCRIPTION,
  author: AUTHORS["james-harrington"].jsonLd,
  publisher: { "@type": "Organization", name: SITE_CONFIG.name, logo: { "@type": "ImageObject", url: `${BASE}/icon-512.png` } },
  mainEntityOfPage: { "@type": "WebPage", "@id": URL },
};

const faq = faqPageSchema(NOTICE_OF_ASSESSMENT_FAQS);

function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, article, faq]} />
      <NoticeOfAssessmentPage />
    </>
  );
}

export default withPageEnd(Page, "/notice-of-assessment/");
