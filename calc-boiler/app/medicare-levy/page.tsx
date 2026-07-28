import type { Metadata } from "next";
import MedicareLevyGuidePage from "@/modules/guides/medicare-levy";
import { JsonLd } from "@/modules/seo/json-ld";
import type { Article, BreadcrumbList, FAQPage, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS, GUIDE_AUTHORSHIP } from "@/lib/authors";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/medicare-levy/`;

export const metadata: Metadata = {
  title: "Medicare Levy Calculator — 2% Rate, Surcharge & Who Pays",
  description:
    "Work out your Medicare Levy in seconds. 2% standard rate, low-income exemption thresholds, MLS surcharge by income — calculate yours for FY2026-27.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Medicare Levy Calculator 2026-27 — 2% Rate, Surcharge & Who Pays",
    description: "Work out your Medicare Levy in seconds. 2% standard rate, low-income thresholds, MLS surcharge by income — FY2026-27.",
    url: URL, siteName: SITE_CONFIG.name, type: "article", locale: "en_AU",
  },
  twitter: {
    card: "summary_large_image",
    title: "Medicare Levy Calculator 2026-27 — 2% Rate, Surcharge & Who Pays",
    description: "Work out your Medicare Levy in seconds — 2% rate, MLS surcharge, low-income thresholds for FY2026-27.",
  },
};

const breadcrumb: WithContext<BreadcrumbList> = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
  { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
  { "@type": "ListItem", position: 2, name: "Medicare Levy", item: URL },
]};

const article: WithContext<Article> = { "@context": "https://schema.org", "@type": "Article",
  headline: "Medicare Levy 2026-27 — Rate, Surcharge, Thresholds & Exemptions",
  url: URL, datePublished: "2025-07-01", dateModified: GUIDE_AUTHORSHIP["medicare-levy"].lastReviewed,
  author: AUTHORS["james-harrington"].jsonLd,
  publisher: { "@type": "Organization", name: SITE_CONFIG.name, logo: { "@type": "ImageObject", url: `${BASE}/logo.png` } },
  mainEntityOfPage: URL, inLanguage: "en-AU",
  isBasedOn: { "@type": "Legislation", name: "Medicare Levy Act 1986", url: "https://www.legislation.gov.au/Details/C2023C00287" },
};

const faq: WithContext<FAQPage> = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [
  { "@type": "Question", name: "What is the Medicare Levy rate in 2026-27?",
    acceptedAnswer: { "@type": "Answer", text: "2% of your taxable income." } },
  { "@type": "Question", name: "What income do you start paying the Medicare Levy at?",
    acceptedAnswer: { "@type": "Answer", text: "Above $26,000 for singles in FY2026-27." } },
  { "@type": "Question", name: "What is the Medicare Levy Surcharge (MLS)?",
    acceptedAnswer: { "@type": "Answer", text: "An additional 1–1.5% paid by high-income earners without private hospital cover." } },
  { "@type": "Question", name: "How do I avoid the Medicare Levy Surcharge?",
    acceptedAnswer: { "@type": "Answer", text: "Hold an eligible private hospital insurance policy for the full year." } },
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
