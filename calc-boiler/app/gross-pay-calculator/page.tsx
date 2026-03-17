import type { Metadata } from "next";
import GrossPayCalculatorPage from "@/modules/calculator/gross-pay-calculator";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/gross-pay-calculator/`;

export const metadata: Metadata = {
  title: "Gross Pay Calculator Australia — Reverse Calculate from Net",
  description:
    "Need to take home a specific amount? Use this reverse tax calculator to find the gross salary required to hit your weekly or annual net pay target.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Gross Pay Calculator Australia",
    description: "Reverse calculate the gross salary you need to negotiate to get your required take-home pay.",
    url: URL,
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: "en_AU",
  },
  twitter: {
    card: "summary_large_image",
    title: "Reverse Tax Calculator",
    description: "Find out exactly how much gross salary you need to hit your take-home goals.",
  },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Gross Pay Calculator", item: URL },
  ],
};

const webApp: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Gross Pay Calculator Australia",
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
      name: "What is the difference between gross and net pay?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Gross pay is the total amount you earn before any taxes or deductions are taken out. Net pay (or take-home pay) is the amount that actually lands in your bank account after income tax, Medicare levy, and other deductions.",
      },
    },
    {
      "@type": "Question",
      name: "How do you calculate gross from net in Australia?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Because Australia has a progressive tax system with different marginal rates, you cannot just multiply your net pay by a single percentage. You have to \"reverse engineer\" the calculation by figuring out which tax brackets your required gross income falls into and adding the appropriate tax back on top of your net amount.",
      },
    },
    {
      "@type": "Question",
      name: "Does gross pay include superannuation?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Generally, no. When negotiating a salary in Australia, \"Gross Pay\" or \"Base Salary\" excludes the compulsory employer superannuation guarantee (currently 12% for FY2025-26). A \"Total Remuneration Package\" (TRP) includes super.",
      },
    },
  ],
};

const howToSchema = calculatorHowTo({
  name: "How to Use the Gross Pay Calculator",
  url: URL,
  description: "Reverse calculate the gross salary you need from your target net pay in under a minute.",
  steps: PAY_CALCULATOR_STEPS,
});

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webApp, faq, ORGANIZATION_SCHEMA, howToSchema]} />
      <GrossPayCalculatorPage />
    </>
  );
}
