import type { Metadata } from "next";
import PrivateHealthInsuranceMedicarePage from "@/modules/guide/private-health-insurance-medicare";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebPage, Article, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS } from "@/lib/authors";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/private-health-insurance-medicare/`;
const TITLE = "Private Health Insurance & Medicare Levy Surcharge";
const DESCRIPTION = "Should you get private health insurance to avoid the Medicare Levy Surcharge? Income thresholds, surcharge rates, PHI rebate tiers, and when PHI saves you money vs costs more.";

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
    { "@type": "ListItem", position: 2, name: "Private Health Insurance & Medicare", item: URL },
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
    { "@type": "Question", name: "What income triggers the Medicare Levy Surcharge?", acceptedAnswer: { "@type": "Answer", text: "The Medicare Levy Surcharge applies to singles earning over $93,000 or families earning over $186,000 who do not hold an eligible private hospital cover policy. The surcharge ranges from 1% to 1.5% depending on your income tier." } },
    { "@type": "Question", name: "Is it cheaper to get private health insurance or pay the surcharge?", acceptedAnswer: { "@type": "Answer", text: "For most people earning between $93,000 and $120,000, basic hospital cover (around $1,200-$1,500 per year) is cheaper than the 1% MLS ($930-$1,200). At higher incomes the surcharge increases, making PHI increasingly cost-effective compared to paying the surcharge." } },
    { "@type": "Question", name: "What is Lifetime Health Cover loading?", acceptedAnswer: { "@type": "Answer", text: "Lifetime Health Cover (LHC) loading adds 2% to your private health insurance premium for every year you are aged over 30 without hospital cover. The maximum loading is 70%. The loading is removed after 10 continuous years of holding hospital cover." } },
  ]
};

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, article, faq]} />
      <PrivateHealthInsuranceMedicarePage />
    </>
  );
}
