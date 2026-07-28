import type { Metadata } from "next";
import BonusTaxGuidePage from "@/modules/guide/bonus-tax-guide";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebPage, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS, GUIDE_AUTHORSHIP } from "@/lib/authors";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/bonus-tax-guide/`;

export const metadata: Metadata = {
  title: "How Bonus Tax Works in Australia — Lump Sum & Commission",
  description: "How bonuses are taxed: Schedule 5 withholding, marginal rates, lump sum B, back-pay tax. Worked examples at $80K and $120K salary.",
  alternates: { canonical: URL },
  openGraph: { title: "How Bonus Tax Works in Australia", description: "Learn how bonuses, commissions and lump sums are taxed under ATO Schedule 5.", url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU" },
  twitter: { card: "summary_large_image", title: "How Bonus Tax Works in Australia", description: "Schedule 5 withholding, marginal rates, and worked examples." },
};

const breadcrumb: WithContext<BreadcrumbList> = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE }, { "@type": "ListItem", position: 2, name: "Bonus Tax Guide", item: URL }] };
const webPage: WithContext<WebPage> = { "@context": "https://schema.org", "@type": "WebPage", name: "How Bonus Tax Works in Australia", url: URL, description: "Complete guide to bonus taxation in Australia.", publisher: { "@type": "Organization", name: SITE_CONFIG.name } };
const faq: WithContext<FAQPage> = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [
  { "@type": "Question", name: "Will I get the tax on my bonus back at tax time?", acceptedAnswer: { "@type": "Answer", text: "Potentially. If your employer over-withheld, you receive a refund. The Schedule 5 method generally minimises this gap." } },
  { "@type": "Question", name: "Can I salary sacrifice my bonus into super?", acceptedAnswer: { "@type": "Answer", text: "Yes, if your employer allows it. The bonus is then taxed at 15% instead of your marginal rate, but counts towards your $30,000 concessional cap." } },
] };

export default function Page() {
  return (<><JsonLd code={[breadcrumb, webPage, faq]} /><BonusTaxGuidePage /></>);
}
