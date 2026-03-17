import type { Metadata } from "next";
import AnnualPayCalculatorPage from "@/modules/calculator/annual-pay-calculator";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/annual-pay-calculator/`;

export const metadata: Metadata = {
  title: "Annual Pay Calculator Australia — Yearly Take-Home Pay & Tax",
  description: "See your full-year pay breakdown: total tax, super, Medicare & net income. Compare across financial years. Annual salary calculator.",
  alternates: { canonical: URL },
  openGraph: { title: "Annual Pay Calculator Australia", description: "Calculate your yearly take-home pay and tax summary.", url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU" },
  twitter: { card: "summary_large_image", title: "Annual Pay Calculator Australia", description: "Annual take-home pay calculated instantly." },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Annual Pay Calculator", item: URL },
  ]
};

const webApp: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Annual Pay Calculator Australia",
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
    { "@type": "Question", name: "How is annual pay calculated?", acceptedAnswer: { "@type": "Answer", text: "Annual take-home pay is your gross yearly salary minus your total income tax, Medicare levy, and any HECS-HELP repayments for the entire financial year (1 July to 30 June)." } },
    { "@type": "Question", name: "Does my annual pay include superannuation?", acceptedAnswer: { "@type": "Answer", text: "Generally, no. Your gross annual salary usually forms your 'Ordinary Time Earnings' (OTE). Your employer pays an additional 12% on top of this into your super fund." } },
    { "@type": "Question", name: "Why does my annual pay look different from my tax return?", acceptedAnswer: { "@type": "Answer", text: "Your actual tax return factors in variables like work-related deductions, bank interest, investments, and spouse income. This calculator shows your standard PAYG withholding estimates." } },
  ]
};

const howToSchema = calculatorHowTo({
  name: "How to Use the Annual Pay Calculator",
  url: URL,
  description: "Calculate your annual take-home pay and tax summary in under a minute.",
  steps: PAY_CALCULATOR_STEPS,
});

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webApp, faq, ORGANIZATION_SCHEMA, howToSchema]} />
      <AnnualPayCalculatorPage />
    </>
  );
}
