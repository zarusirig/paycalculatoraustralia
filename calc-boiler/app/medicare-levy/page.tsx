import type { Metadata } from "next";
import MedicareLevyGuidePage from "@/modules/guides/medicare-levy";
import { JsonLd } from "@/modules/seo/json-ld";
import type { Article, BreadcrumbList, FAQPage, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS, GUIDE_AUTHORSHIP } from "@/lib/authors";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/medicare-levy/`;

export const metadata: Metadata = {
  title: "Medicare Levy 2025-26 — Rate, Surcharge, Thresholds & Exemptions",
  description:
    "Medicare Levy explained: 2% standard rate, 1-1.5% surcharge, low-income thresholds, private health link. How it affects your take-home pay in FY2025-26.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Medicare Levy 2025-26",
    description: "Complete guide to the Medicare Levy: rates, surcharge, exemptions. Updated for FY2025-26.",
    url: URL, siteName: SITE_CONFIG.name, type: "article", locale: "en_AU",
  },
  twitter: {
    card: "summary_large_image",
    title: "Medicare Levy 2025-26 — Rates, Surcharge & Exemptions",
    description: "Everything about the Medicare Levy and surcharge.",
  },
};

const breadcrumb: WithContext<BreadcrumbList> = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
  { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
  { "@type": "ListItem", position: 2, name: "Medicare Levy", item: URL },
]};

const article: WithContext<Article> = { "@context": "https://schema.org", "@type": "Article",
  headline: "Medicare Levy 2025-26 — Rate, Surcharge, Thresholds & Exemptions",
  url: URL, datePublished: "2025-07-01", dateModified: GUIDE_AUTHORSHIP["medicare-levy"].lastReviewed,
  author: AUTHORS["james-harrington"].jsonLd,
  publisher: { "@type": "Organization", name: SITE_CONFIG.name, logo: { "@type": "ImageObject", url: `${BASE}/logo.png` } },
  mainEntityOfPage: URL, inLanguage: "en-AU",
  isBasedOn: { "@type": "Legislation", name: "Medicare Levy Act 1986", url: "https://www.legislation.gov.au/Details/C2023C00287" },
};

const faq: WithContext<FAQPage> = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [
  { "@type": "Question", name: "Is the Medicare levy included in the tax tables?",
    acceptedAnswer: { "@type": "Answer", text: "No. The 2% Medicare levy is separate from income tax. Tax brackets on the ATO website don't include the levy. Your total effective rate is income tax rate plus 2%." } },
  { "@type": "Question", name: "Can I opt out of paying the Medicare levy?",
    acceptedAnswer: { "@type": "Answer", text: "Generally, no. If you're an Australian resident for tax purposes, the levy is mandatory. Exceptions exist for certain non-residents, some visa holders, and specific exemption categories." } },
  { "@type": "Question", name: "Is the Medicare levy the same as the Medicare Levy Surcharge?",
    acceptedAnswer: { "@type": "Answer", text: "No. The Medicare levy (2%) applies to nearly all residents. The Surcharge (1%–1.5%) is additional and only applies to higher earners ($93,001+) without private hospital cover." } },
]};

export default function Page() {
  return (<><JsonLd code={[breadcrumb, article, faq]} /><MedicareLevyGuidePage /></>);
}
