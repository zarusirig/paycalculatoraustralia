import type { Metadata } from "next";
import SuperannuationCalculatorPage from "@/modules/calculator/superannuation-calculator";
import { SUPERANNUATION_FAQS } from "@/modules/calculator/superannuation-faqs";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/superannuation-calculator/`;

export const metadata: Metadata = {
  title: "Super Guarantee Calculator — 12% SG on Your Salary",
  description: "Calculate your superannuation contribution at the 12% SG rate for FY2026-27. See employer super, total package, and contribution cap space.",
  alternates: { canonical: URL },
  openGraph: { title: "Superannuation Calculator Australia", description: "Calculate employer super at 12% SG rate. Free, updated for FY2026-27.", url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU" },
  twitter: { card: "summary_large_image", title: "Super Calculator Australia", description: "Employer SG at 12% for FY2026-27." },
};

const breadcrumb: WithContext<BreadcrumbList> = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
  { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
  { "@type": "ListItem", position: 2, name: "Superannuation Calculator", item: URL },
]};

const webApp: WithContext<WebApplication> = { "@context": "https://schema.org", "@type": "WebApplication", name: "Superannuation Calculator Australia", url: URL, applicationCategory: "FinanceApplication", operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" }, creator: { "@type": "Organization", name: SITE_CONFIG.name }, dateModified: new Date().toISOString().split("T")[0], inLanguage: "en-AU" };

// Built from the same array the on-page accordion renders, so the structured
// data cannot drift from the visible answers.
const faq: WithContext<FAQPage> = { "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: SUPERANNUATION_FAQS.map((f) => ({
    "@type": "Question" as const,
    name: f.q,
    acceptedAnswer: { "@type": "Answer" as const, text: f.a },
  })),
};

const howToSchema = calculatorHowTo({
  name: "How to Use the Superannuation Calculator",
  url: URL,
  description: "Calculate your superannuation contributions in under a minute.",
  steps: PAY_CALCULATOR_STEPS,
});

export default function Page() {
  return (<><JsonLd code={[breadcrumb, webApp, faq, ORGANIZATION_SCHEMA, howToSchema]} /><SuperannuationCalculatorPage /></>);
}
