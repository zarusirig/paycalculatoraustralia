import type { Metadata } from "next";
import SuperannuationGuidePage from "@/modules/guide/superannuation-guide";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebPage, Article, WithContext } from "schema-dts";
import { SITE_CONFIG, SUPER_GUARANTEE, SUPER_GUARANTEE_CHARGE, formatAUD } from "@/lib/constants";
import { AUTHORS, GUIDE_AUTHORSHIP } from "@/lib/authors";
import { pageDateModified, pageDatePublished } from "@/lib/page-dates";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/superannuation-guide/`;
const TITLE = "Superannuation Guide — How Super Works in Australia";
const DESCRIPTION = `How super works in ${SITE_CONFIG.financialYear}: the 12% SG rate, Payday Super from ${SUPER_GUARANTEE.paydaySuperStart}, the ${formatAUD(SUPER_GUARANTEE.concessionalCap)} concessional cap, transfer balance cap and salary sacrifice.`;

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
    { "@type": "ListItem", position: 2, name: "Superannuation Guide", item: URL },
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
  datePublished: pageDatePublished("superannuation-guide"),
  dateModified: pageDateModified("superannuation-guide"),
  headline: TITLE,
  description: DESCRIPTION,
  author: AUTHORS["james-harrington"].jsonLd,
  publisher: { "@type": "Organization", name: SITE_CONFIG.name, logo: { "@type": "ImageObject", url: `${BASE}/icon-512.png` } },
  mainEntityOfPage: { "@type": "WebPage", "@id": URL },
  isBasedOn: { "@type": "Legislation", name: "Superannuation Guarantee (Administration) Act 1992", url: "https://www.legislation.gov.au/Details/C2024C00199" },
};

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: `What is the Super Guarantee rate for ${SITE_CONFIG.financialYear}?`, acceptedAnswer: { "@type": "Answer", text: `The Superannuation Guarantee (SG) rate is 12%, unchanged since ${SUPER_GUARANTEE.effectiveDate}. Since Payday Super began on ${SUPER_GUARANTEE.paydaySuperStart}, employers must pay it on each employee's qualifying earnings every payday, and the contribution must reach the fund within ${SUPER_GUARANTEE_CHARGE.current.businessDaysToPay} business days.` } },
    { "@type": "Question", name: "Does superannuation come out of my salary?", acceptedAnswer: { "@type": "Answer", text: "It depends on how your contract is written. If you are offered a 'Base Salary + Super' package, your employer pays the 12% on top of your base pay. If you have a 'Total Remuneration Package' (TRP), the 12% super is deducted from that total figure to determine your taxable base salary." } },
    { "@type": "Question", name: "Can I choose my own super fund?", acceptedAnswer: { "@type": "Answer", text: "Yes, most Australian employees have the right to choose their own superannuation fund. If you don't nominate one, your employer will pay into their default fund or check with the ATO for your 'stapled' fund." } },
  ]
};

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, article, faq]} />
      <SuperannuationGuidePage />
    </>
  );
}
