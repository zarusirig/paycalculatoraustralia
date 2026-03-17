import type { Metadata } from "next";
import BonusTaxCalculatorPage from "@/modules/calculator/bonus-tax-calculator";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/bonus-tax-calculator/`;

export const metadata: Metadata = {
  title: "Bonus Tax Calculator Australia — How Much Tax on Your Bonus (2025-26)",
  description:
    "Calculate how much tax you pay on a bonus or commission. See your actual take-home from any lump sum using marginal tax rates for FY2025-26.",
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

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How is a bonus taxed in Australia?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Bonuses are taxed at your marginal tax rate. Because the bonus sits on top of your regular salary, it is taxed at whatever bracket your total income falls into. Your employer uses ATO Schedule 5 to calculate the correct withholding amount.",
      },
    },
    {
      "@type": "Question",
      name: "Why is my bonus smaller than expected?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Because tax is withheld at your marginal rate (not your effective rate). For example, if your salary puts you in the 30% bracket, 32% (30% + 2% Medicare) is taken from every dollar of your bonus.",
      },
    },
    {
      "@type": "Question",
      name: "Do I get superannuation on my bonus?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Generally yes. Bonuses paid for work performed are considered Ordinary Time Earnings (OTE) and attract the 12% Superannuation Guarantee. However, retention bonuses or discretionary payments may be excluded from OTE.",
      },
    },
  ],
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
