import type { Metadata } from "next";
import WeeklyPayCalculatorPage from "@/modules/calculator/weekly-pay-calculator";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/weekly-pay-calculator/`;

export const metadata: Metadata = {
  title: "Weekly Pay Calculator Australia — Your Net Pay Per Week",
  description: "Calculate your weekly take-home pay after tax, super & Medicare. Enter your annual salary and see your weekly net pay breakdown.",
  alternates: { canonical: URL },
  openGraph: { title: "Weekly Pay Calculator Australia", description: "Calculate your weekly take-home pay after tax, super & Medicare.", url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU" },
  twitter: { card: "summary_large_image", title: "Weekly Pay Calculator Australia", description: "Weekly take-home pay breakdown." },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Weekly Pay Calculator", item: URL },
  ]
};

const webApp: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Weekly Pay Calculator Australia",
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
    { "@type": "Question", name: "How is weekly pay calculated?", acceptedAnswer: { "@type": "Answer", text: "Weekly pay is calculated by dividing your gross annual salary by 52 (the number of weeks in a year). Then, the weekly income tax, Medicare levy, and any HECS repayments are deducted through the PAYG system." } },
    { "@type": "Question", name: "Is super deducted from my weekly pay?", acceptedAnswer: { "@type": "Answer", text: "No. Your employer pays super (12%) on top of your salary. It is not deducted from your weekly take-home pay." } },
    { "@type": "Question", name: "Why did my weekly pay change?", acceptedAnswer: { "@type": "Answer", text: "Changes to tax brackets, Medicare levy thresholds, or HECS repayment rates at the start of the financial year (July 1) can affect your weekly net pay. Your employer may also have updated your tax code." } },
  ]
};

const howToSchema = calculatorHowTo({
  name: "How to Use the Weekly Pay Calculator",
  url: URL,
  description: "Calculate your weekly take-home pay in under a minute.",
  steps: PAY_CALCULATOR_STEPS,
});

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webApp, faq, ORGANIZATION_SCHEMA, howToSchema]} />
      <WeeklyPayCalculatorPage />
    </>
  );
}
