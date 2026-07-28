import type { Metadata } from "next";
import SalarySacrificeVsMortgagePage from "@/modules/guide/salary-sacrifice-vs-mortgage";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebPage, Article, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS } from "@/lib/authors";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/salary-sacrifice-vs-mortgage/`;
const TITLE = "Salary Sacrifice to Super vs Extra Mortgage Payments";
const DESCRIPTION = "Should you salary sacrifice into super or make extra mortgage payments? Compare tax savings, investment returns, and accessibility. Real scenarios at different income and debt levels.";

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
    { "@type": "ListItem", position: 2, name: "Salary Sacrifice vs Mortgage", item: URL },
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
    { "@type": "Question", name: "Is salary sacrifice into super better than paying off a mortgage?", acceptedAnswer: { "@type": "Answer", text: "It depends on your marginal tax rate, mortgage interest rate, and time to retirement. Generally, salary sacrifice wins when your marginal tax rate is high (37%+) and mortgage rates are low. Extra mortgage payments win when rates are high (6%+) and you need accessible equity." } },
    { "@type": "Question", name: "What tax benefit does salary sacrifice into super provide?", acceptedAnswer: { "@type": "Answer", text: "Salary sacrifice contributions are taxed at just 15% inside super, compared to your marginal tax rate (up to 45%). For someone in the 37% bracket, that is a 22% tax saving on every dollar sacrificed." } },
    { "@type": "Question", name: "Can I access salary sacrificed super early?", acceptedAnswer: { "@type": "Answer", text: "No. Super is preserved until you reach your preservation age (currently 60) and meet a condition of release. This is the key trade-off: the tax benefit is significant, but the money is locked away." } },
    { "@type": "Question", name: "What is the maximum I can salary sacrifice into super?", acceptedAnswer: { "@type": "Answer", text: "The concessional contributions cap is $30,000 per year for FY2025-26, which includes both employer SG contributions and salary sacrifice amounts. Unused cap amounts from the previous 5 years can be carried forward if your total super balance is under $500,000." } },
    { "@type": "Question", name: "Should I do both salary sacrifice and extra mortgage payments?", acceptedAnswer: { "@type": "Answer", text: "A hybrid approach often works best. Salary sacrifice enough to maximise the tax benefit (especially if in the 37% or 45% bracket), then direct remaining surplus cash to mortgage repayments for the guaranteed return at your mortgage interest rate." } },
  ]
};

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, article, faq]} />
      <SalarySacrificeVsMortgagePage />
    </>
  );
}
