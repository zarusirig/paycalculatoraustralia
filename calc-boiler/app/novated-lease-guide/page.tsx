import type { Metadata } from "next";
import NovatedLeaseGuidePage from "@/modules/guide/novated-lease-guide";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, WebPage, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { faqPageSchema } from "@/lib/faq";
import { NOVATED_LEASE_GUIDE_FAQS } from "@/modules/guide/novated-lease-guide-faqs";
import { withPageEnd } from "@/components/common/content-slots";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/novated-lease-guide/`;
const TITLE = "How a Novated Lease Works — Explained Step by Step";
const DESCRIPTION = "What a novated lease is: the three-way agreement, how the employee contribution cancels FBT, which EVs are exempt, and what you owe at the end.";

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
const faq = faqPageSchema(NOVATED_LEASE_GUIDE_FAQS);

function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, faq]} />
      <NovatedLeaseGuidePage />
    </>
  );
}

export default withPageEnd(Page, "/novated-lease-guide/");
