import type { Metadata } from "next";
import TaxFileNumberDeclarationPage from "@/modules/guide/tax-file-number-declaration";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebPage, Article, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS } from "@/lib/authors";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/tax-file-number-declaration/`;
const TITLE = "Tax File Number Declaration Guide — How to Fill It In (2025-26)";
const DESCRIPTION = "How to complete a TFN declaration for a new job. Tax-free threshold claim, HECS debt notification, and what happens if you don't provide your TFN. Step-by-step guide.";

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
    { "@type": "ListItem", position: 2, name: "TFN Declaration Guide", item: URL },
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
    { "@type": "Question", name: "What happens if I don't provide my TFN to my employer?", acceptedAnswer: { "@type": "Answer", text: "If you do not provide your TFN within 28 days of starting work, your employer must withhold tax at the highest marginal rate of 47% (including Medicare levy) from every dollar you earn. This rate applies until you provide your TFN, at which point your employer adjusts to the correct withholding rate." } },
    { "@type": "Question", name: "Should I claim the tax-free threshold on my TFN declaration?", acceptedAnswer: { "@type": "Answer", text: "You should claim the tax-free threshold at your main (highest paying) job only. If you have multiple jobs, claim it at one employer and leave it unclaimed at all others. Claiming it at two jobs means neither employer withholds enough tax and you will likely owe money at tax time." } },
    { "@type": "Question", name: "Do I need to submit a new TFN declaration if I change roles within the same company?", acceptedAnswer: { "@type": "Answer", text: "Generally no, unless your circumstances change (e.g., you acquire a HECS debt, change residency status, or want to change your tax-free threshold claim). If you move to a different ABN within the same corporate group, a new TFN declaration is required." } },
  ]
};

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, article, faq]} />
      <TaxFileNumberDeclarationPage />
    </>
  );
}
