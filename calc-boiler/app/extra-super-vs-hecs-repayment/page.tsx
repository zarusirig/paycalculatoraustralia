import type { Metadata } from "next";
import ExtraSuperVsHecsRepaymentPage from "@/modules/guide/extra-super-vs-hecs-repayment";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebPage, Article, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS } from "@/lib/authors";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/extra-super-vs-hecs-repayment/`;
const TITLE = "Extra Super vs Voluntary HECS Repayment — Which Is Smarter?";
const DESCRIPTION = "Should you put extra money into super or pay off your HECS debt faster? Compare tax benefits, HECS indexation, and long-term outcomes. Decision framework for Australian workers.";

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
    { "@type": "ListItem", position: 2, name: "Extra Super vs HECS Repayment", item: URL },
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
    { "@type": "Question", name: "Is it better to pay off HECS or put extra into super?", acceptedAnswer: { "@type": "Answer", text: "For most young workers, extra super contributions provide better long-term returns due to the tax benefit (15% vs your marginal rate) and compound growth over decades. However, if your HECS balance is large and indexation is high, paying it off faster can be worthwhile." } },
    { "@type": "Question", name: "How is HECS-HELP debt indexed?", acceptedAnswer: { "@type": "Answer", text: "HECS-HELP debt is indexed annually on 1 June to the lower of CPI or the Wage Price Index (WPI). This cap was introduced in 2023 to prevent debt growing faster than wages, typically resulting in indexation of 3-4% per year." } },
    { "@type": "Question", name: "Do voluntary HECS repayments reduce my compulsory repayments?", acceptedAnswer: { "@type": "Answer", text: "Voluntary repayments reduce your outstanding HECS balance but do not reduce the compulsory repayment percentage applied to your income. However, if voluntary payments bring your balance to zero, compulsory repayments cease entirely." } },
    { "@type": "Question", name: "What tax benefit do I get from extra super contributions?", acceptedAnswer: { "@type": "Answer", text: "Salary sacrifice or personal deductible contributions to super are taxed at 15% inside super, compared to your marginal rate (up to 45% plus Medicare). The tax saving ranges from 4% (for the 19% bracket) to 32% (for the 45%+2% bracket) on each dollar contributed." } },
    { "@type": "Question", name: "Can I do both extra super and voluntary HECS payments?", acceptedAnswer: { "@type": "Answer", text: "Yes. If you have surplus cash flow, you can split between both. A common approach is to maximise super contributions up to the concessional cap ($30,000 including employer SG) for the tax benefit, then direct any remaining surplus to voluntary HECS repayments." } },
  ]
};

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, article, faq]} />
      <ExtraSuperVsHecsRepaymentPage />
    </>
  );
}
