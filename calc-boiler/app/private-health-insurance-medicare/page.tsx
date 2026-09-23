import type { Metadata } from "next";
import PrivateHealthInsuranceMedicarePage from "@/modules/guide/private-health-insurance-medicare";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebPage, Article, WithContext } from "schema-dts";
import { MEDICARE_LEVY, SITE_CONFIG, formatAUD } from "@/lib/constants";
import { MLS_INCOME_YEAR, familyBaseThreshold } from "@/lib/constants/medicare-levy-surcharge";
import { AUTHORS } from "@/lib/authors";
import { pageDateModified, pageDatePublished } from "@/lib/page-dates";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/private-health-insurance-medicare/`;
// Retitled 23 Sep 2026 (W2): "Medicare levy surcharge" queries belong to
// /medicare-levy-surcharge-calculator/. This page owns the cover decision.
const MLS_SINGLE = formatAUD(MEDICARE_LEVY.surcharge.tier1.min - 1);
const MLS_FAMILY = formatAUD(familyBaseThreshold(0));
const TITLE = "Private Health Insurance vs the Surcharge: Is Hospital Cover Worth It?";
const DESCRIPTION = `Is private hospital cover cheaper than the Medicare levy surcharge? The ${MLS_INCOME_YEAR} surcharge and rebate tiers, how to find your break-even premium, and lifetime health cover loading.`;

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
  datePublished: pageDatePublished("private-health-insurance-medicare"),
  dateModified: pageDateModified("private-health-insurance-medicare"),
  headline: TITLE,
  description: DESCRIPTION,
  author: AUTHORS["james-harrington"].jsonLd,
  publisher: { "@type": "Organization", name: SITE_CONFIG.name, logo: { "@type": "ImageObject", url: `${BASE}/icon-512.png` } },
  mainEntityOfPage: { "@type": "WebPage", "@id": URL },
};

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "What income triggers the Medicare Levy Surcharge?", acceptedAnswer: { "@type": "Answer", text: `In ${MLS_INCOME_YEAR} the Medicare levy surcharge applies to singles with income for MLS purposes over ${MLS_SINGLE} or families over ${MLS_FAMILY} who do not hold appropriate private patient hospital cover. The surcharge ranges from 1% to 1.5% depending on your income tier.` } },
    { "@type": "Question", name: "Is it cheaper to get private health insurance or pay the surcharge?", acceptedAnswer: { "@type": "Answer", text: "It depends on your income and the premium you are quoted. Divide the surcharge you would pay by the share of the premium you pay after the government rebate: a quote below that, before the rebate, costs less than the surcharge. The surcharge rises with income while the rebate falls, so cover tends to compare better at higher incomes." } },
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
