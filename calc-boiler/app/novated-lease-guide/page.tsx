import type { Metadata } from "next";
import NovatedLeaseGuidePage from "@/modules/guide/novated-lease-guide";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebPage, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/novated-lease-guide/`;
const TITLE = "How a Novated Lease Works — Explained Step by Step";
const DESCRIPTION = "What a novated lease actually is: the three-way agreement, what sits in the running-cost budget, how the employee contribution cancels FBT, which electric cars are exempt, the 1 April 2025 plug-in hybrid cut-off, and what you owe at the end of the lease.";

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
    { "@type": "ListItem", position: 2, name: "How a Novated Lease Works", item: URL },
  ],
};

const webPage: WithContext<WebPage> = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "How a Novated Lease Works",
  description: DESCRIPTION,
  url: URL,
  publisher: { "@type": "Organization", name: SITE_CONFIG.name },
  // The arithmetic lives on the calculator; this page explains the mechanism.
  significantLink: `${BASE}/novated-lease-calculator/`,
};

// Explainer questions only — the "how much" questions belong to
// /novated-lease-calculator/ and are answered there, so the two pages do not
// compete for the same result.
const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is a novated lease in simple terms?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A three-way arrangement between you, your employer and a finance company. Your employer takes the lease payments and the running-cost budget out of your pay and sends them to the leasing company; the car stays registered in your name and is yours to use privately.",
      },
    },
    {
      "@type": "Question",
      name: "What happens to a novated lease if I leave my job?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The novation unwinds and the lease reverts to a finance agreement between you and the leasing company. You can novate it to a new employer that offers salary packaging, keep paying it from after-tax income, or pay it out.",
      },
    },
    {
      "@type": "Question",
      name: "Which electric cars are exempt from FBT on a novated lease?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Battery electric and hydrogen fuel cell cars first held and used on or after 1 July 2022, on which luxury car tax has never been payable. Plug-in hybrids stopped qualifying on 1 April 2025 and remain exempt only under a binding arrangement that was already in place and in use before that date. An exempt car is still a reportable fringe benefit.",
      },
    },
  ],
};

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, faq]} />
      <NovatedLeaseGuidePage />
    </>
  );
}
