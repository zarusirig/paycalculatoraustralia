import type { Metadata } from "next";
import SuperCoContributionPage from "@/modules/guide/super-co-contribution";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebPage, Article, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS } from "@/lib/authors";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/super-co-contribution/`;
const TITLE = "Super Co-Contribution & Spouse Tax Offset Explained";
const DESCRIPTION = "Government super co-contribution: up to $500 matched for low-income earners. Plus spouse super contribution tax offset up to $540. Eligibility, thresholds, and how to claim.";

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
    { "@type": "ListItem", position: 2, name: "Super Co-Contribution", item: URL },
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
  isBasedOn: { "@type": "Legislation", name: "Superannuation (Government Co-contribution for Low Income Earners) Act 2003", url: "https://www.legislation.gov.au/Details/C2024C00123" },
};

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "How much is the government super co-contribution?", acceptedAnswer: { "@type": "Answer", text: "The government matches 50 cents for every $1.00 of eligible personal (non-concessional) super contributions you make, up to a maximum of $500 per financial year. To receive the full $500, you need to contribute $1,000 of after-tax money and earn $43,445 or less." } },
    { "@type": "Question", name: "Do I need to apply for the super co-contribution?", acceptedAnswer: { "@type": "Answer", text: "No. The ATO automatically determines your eligibility after you lodge your income tax return. If eligible, the co-contribution is paid directly into your super fund, usually within 60 days of your tax return being processed." } },
    { "@type": "Question", name: "What is the spouse super contribution tax offset?", acceptedAnswer: { "@type": "Answer", text: "If you contribute to your spouse's super fund and their income is below $40,000, you may claim a tax offset of up to $540. The maximum offset applies when you contribute $3,000 or more and your spouse earns $37,000 or less. The offset phases out completely at $40,000 spouse income." } },
  ]
};

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, article, faq]} />
      <SuperCoContributionPage />
    </>
  );
}
