import type { Metadata } from "next";
import TakeHomePayCalculatorPage from "@/modules/calculator/take-home-pay-calculator";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/take-home-pay-calculator/`;

export const metadata: Metadata = {
  title: "Take-Home Pay Calculator Australia — Net Pay After Tax & Super",
  description: "Free Australian take-home pay calculator. See your net pay after income tax, Medicare levy, HECS & super. Updated FY2025-26 using official ATO rates.",
  alternates: { canonical: URL },
  openGraph: { title: "Take-Home Pay Calculator Australia", description: "Calculate your net pay after all deductions. Free, updated for FY2025-26.", url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU" },
  twitter: { card: "summary_large_image", title: "Take-Home Pay Calculator Australia", description: "Net pay after tax, Medicare, HECS & super." },
};

const breadcrumb: WithContext<BreadcrumbList> = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
  { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
  { "@type": "ListItem", position: 2, name: "Take-Home Pay Calculator", item: URL },
]};

const webApp: WithContext<WebApplication> = { "@context": "https://schema.org", "@type": "WebApplication", name: "Take-Home Pay Calculator Australia", url: URL, applicationCategory: "FinanceApplication", operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" }, creator: { "@type": "Organization", name: SITE_CONFIG.name }, dateModified: new Date().toISOString().split("T")[0], inLanguage: "en-AU" };

const faq: WithContext<FAQPage> = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [
  { "@type": "Question", name: "How is take-home pay calculated?", acceptedAnswer: { "@type": "Answer", text: "Take-home pay is your gross salary minus income tax, Medicare levy, and any HECS repayments. Your employer deducts these through the PAYG system. Super is paid separately." } },
  { "@type": "Question", name: "What percentage of my salary do I take home?", acceptedAnswer: { "@type": "Answer", text: "At $50,000, about 86.4%. At $100,000, about 77.2% (without HECS). The percentage decreases as salary increases due to progressive tax rates." } },
  { "@type": "Question", name: "Is super deducted from my pay?", acceptedAnswer: { "@type": "Answer", text: "No. Your employer pays super (12%) on top of your salary. Voluntary salary sacrifice amounts are deducted pre-tax." } },
  { "@type": "Question", name: "Why is my first pay smaller than expected?", acceptedAnswer: { "@type": "Answer", text: "If you haven't submitted a TFN declaration, your employer withholds at the highest rate (45% plus Medicare). Submit your TFN immediately." } },
]};

const howToSchema = calculatorHowTo({
  name: "How to Use the Take-Home Pay Calculator",
  url: URL,
  description: "Calculate your Australian take-home pay after tax in under a minute.",
  steps: PAY_CALCULATOR_STEPS,
});

export default function Page() {
  return (<><JsonLd code={[breadcrumb, webApp, faq, ORGANIZATION_SCHEMA, howToSchema]} /><TakeHomePayCalculatorPage /></>);
}
