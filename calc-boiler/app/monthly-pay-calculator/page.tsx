import type { Metadata } from "next";
import MonthlyPayCalculatorPage from "@/modules/calculator/monthly-pay-calculator";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/monthly-pay-calculator/`;

export const metadata: Metadata = {
  title: "Monthly Pay Calculator Australia — Net Salary Per Month",
  description: "Calculate your monthly take-home pay after all deductions. See tax, super & Medicare broken down per month. Free Australian calculator.",
  alternates: { canonical: URL },
  openGraph: { title: "Monthly Pay Calculator Australia", description: "Calculate your monthly take-home pay and tax deductions.", url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU" },
  twitter: { card: "summary_large_image", title: "Monthly Pay Calculator Australia", description: "Monthly take-home pay calculated instantly." },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Monthly Pay Calculator", item: URL },
  ]
};

const webApp: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Monthly Pay Calculator Australia",
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
    { "@type": "Question", name: "How is monthly pay calculated?", acceptedAnswer: { "@type": "Answer", text: "Monthly pay is calculated by dividing your gross annual salary by 12 (the number of months in a year). Then, your income tax, Medicare levy, and any HECS repayments are divided by 12 and deducted through the PAYG system." } },
    { "@type": "Question", name: "Is super deducted from my monthly pay?", acceptedAnswer: { "@type": "Answer", text: "No. Your employer pays super on top of your salary. It is not deducted from your monthly take-home pay." } },
    { "@type": "Question", name: "Why do some months have different pay amounts?", acceptedAnswer: { "@type": "Answer", text: "If you are paid an annual salary on a monthly basis, your pay should be exactly the same every month, regardless of whether the month has 28, 30, or 31 days." } },
  ]
};

const howToSchema = calculatorHowTo({
  name: "How to Use the Monthly Pay Calculator",
  url: URL,
  description: "Calculate your monthly take-home pay in under a minute.",
  steps: PAY_CALCULATOR_STEPS,
});

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webApp, faq, ORGANIZATION_SCHEMA, howToSchema]} />
      <MonthlyPayCalculatorPage />
    </>
  );
}
