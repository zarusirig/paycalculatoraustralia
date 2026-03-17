import type { Metadata } from "next";
import FortnightlyPayCalculatorPage from "@/modules/calculator/fortnightly-pay-calculator";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/fortnightly-pay-calculator/`;

export const metadata: Metadata = {
  title: "Fortnightly Pay Calculator Australia — Net Pay Every Two Weeks",
  description: "Work out your fortnightly take-home pay. See your deductions per fortnight including tax, super & Medicare levy. Free calculator.",
  alternates: { canonical: URL },
  openGraph: { title: "Fortnightly Pay Calculator Australia", description: "Work out your fortnightly take-home pay online securely.", url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU" },
  twitter: { card: "summary_large_image", title: "Fortnightly Pay Calculator Australia", description: "Take-home pay calculated fortnightly." },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Fortnightly Pay Calculator", item: URL },
  ]
};

const webApp: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Fortnightly Pay Calculator Australia",
  url: URL,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
  creator: { "@type": "Organization", name: SITE_CONFIG.name },
  dateModified: new Date().toISOString().split("T")[0],
  inLanguage: "en-AU"
};

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "How is fortnightly pay calculated?", acceptedAnswer: { "@type": "Answer", text: "Fortnightly pay is calculated by dividing your gross annual salary by 26 (the number of fortnights in a year). Fortnightly income tax, Medicare levy, and any HECS repayments are then deducted according to the ATO PAYG system." } },
    { "@type": "Question", name: "Is super deducted from my fortnightly pay?", acceptedAnswer: { "@type": "Answer", text: "No. Your employer pays super on top of your salary. It is not deducted from your take-home pay." } },
    { "@type": "Question", name: "Are there 26 or 27 pays in a year?", acceptedAnswer: { "@type": "Answer", text: "Usually, there are 26 fortnightly pays in a year (26 x 14 = 364 days). Occasionally a financial year will have 27 pays, which changes your PAYG limits slightly." } },
  ]
};

const howToSchema = calculatorHowTo({
  name: "How to Use the Fortnightly Pay Calculator",
  url: URL,
  description: "Calculate your fortnightly take-home pay in under a minute.",
  steps: PAY_CALCULATOR_STEPS,
});

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webApp, faq, ORGANIZATION_SCHEMA, howToSchema]} />
      <FortnightlyPayCalculatorPage />
    </>
  );
}
