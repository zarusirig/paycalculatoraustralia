import type { Metadata } from "next";
import OvertimePayCalculatorPage from "@/modules/calculator/overtime-pay-calculator";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/overtime-pay-calculator/`;

export const metadata: Metadata = {
  title: "Overtime Pay Calculator — Time-and-a-Half & Double Time",
  description:
    "Calculate your overtime and penalty rate pay. Enter your base rate, select the multiplier — see your overtime pay after tax. Free penalty rate calculator.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Overtime & Penalty Rate Calculator",
    description: "Calculate time-and-a-half, double-time and public holiday pay instantly.",
    url: URL,
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: "en_AU",
  },
  twitter: {
    card: "summary_large_image",
    title: "Overtime & Penalty Rate Calculator",
    description: "Calculate your overtime pay after tax.",
  },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Overtime Pay Calculator", item: URL },
  ],
};

const webApp: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Overtime & Penalty Rate Calculator",
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
      name: "How is overtime pay calculated?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Overtime pay is your base hourly rate multiplied by the penalty rate set in your Award or agreement. For example, time-and-a-half on a $30/hr base rate = $45/hr.",
      },
    },
    {
      "@type": "Question",
      name: "When does overtime start?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "For most full-time employees, overtime begins after 38 hours per week (or 7.6 hours per day). The exact threshold depends on your Award or enterprise agreement.",
      },
    },
    {
      "@type": "Question",
      name: "Do casual workers get overtime?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Casual employees are entitled to overtime rates when they exceed 38 hours per week. The overtime multiplier applies to the base rate, not the casual-loaded rate.",
      },
    },
  ],
};

const howToSchema = calculatorHowTo({
  name: "How to Use the Overtime Pay Calculator",
  url: URL,
  description: "Calculate your overtime and penalty rate pay in under a minute.",
  steps: PAY_CALCULATOR_STEPS,
});

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webApp, faq, ORGANIZATION_SCHEMA, howToSchema]} />
      <OvertimePayCalculatorPage />
    </>
  );
}
