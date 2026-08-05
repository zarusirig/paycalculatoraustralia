import type { Metadata } from "next";
import BonusTaxCalculatorPage from "@/modules/calculator/bonus-tax-calculator";
import { BONUS_TAX_FAQS } from "@/modules/calculator/bonus-tax-faqs";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/bonus-tax-calculator/`;

export const metadata: Metadata = {
  title: "Bonus Tax Calculator Australia — Tax on Your Bonus",
  description:
    "Calculate how much tax you pay on a bonus or commission. See your actual take-home from any lump sum using marginal tax rates for FY2026-27.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Bonus Tax Calculator Australia",
    description: "See how much tax you pay on a bonus and what you actually take home.",
    url: URL,
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: "en_AU",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bonus Tax Calculator Australia",
    description: "Calculate the tax on your bonus or commission instantly.",
  },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Bonus Tax Calculator", item: URL },
  ],
};

const webApp: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Bonus Tax Calculator Australia",
  url: URL,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
  creator: { "@type": "Organization", name: SITE_CONFIG.name },
  dateModified: new Date().toISOString().split("T")[0],
  inLanguage: "en-AU",
};

// Built from the same array the on-page accordion renders, so the structured
// data cannot drift from the visible answers.
const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: BONUS_TAX_FAQS.map((f) => ({
    "@type": "Question" as const,
    name: f.q,
    acceptedAnswer: { "@type": "Answer" as const, text: f.a },
  })),
};

const howToSchema = calculatorHowTo({
  name: "How to Calculate Your Bonus Tax",
  url: URL,
  description: "Calculate how much tax you pay on a bonus in under a minute.",
  steps: PAY_CALCULATOR_STEPS,
});

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webApp, faq, ORGANIZATION_SCHEMA, howToSchema]} />
      <BonusTaxCalculatorPage />
    </>
  );
}
