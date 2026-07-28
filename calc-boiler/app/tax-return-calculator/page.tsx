import type { Metadata } from "next";
import TaxReturnCalculatorPage from "@/modules/calculator/tax-return-calculator";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/tax-return-calculator/`;

export const metadata: Metadata = {
  title: "Tax Return Estimator Australia — Estimate Your Refund",
  description:
    "Estimate your tax refund or bill for FY2025-26. Enter salary, deductions and see how much you get back. Free Australian tax return estimator.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Tax Return Estimator Australia",
    description: "Estimate your tax refund or amount owing for FY2025-26.",
    url: URL,
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: "en_AU",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tax Return Estimator Australia",
    description: "Estimate your tax refund instantly.",
  },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Tax Return Estimator", item: URL },
  ],
};

const webApp: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Tax Return Estimator Australia",
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
      name: "How much will my tax refund be?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Your refund depends on the difference between tax withheld and your actual tax liability. On average, Australians receive a refund of around $2,500-$3,500, but this varies widely based on your income and deductions.",
      },
    },
    {
      "@type": "Question",
      name: "When will I get my tax refund?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "If you lodge electronically through myTax, you can typically expect your refund within 2-4 weeks. Paper returns take 10-12 weeks.",
      },
    },
    {
      "@type": "Question",
      name: "What if I owe money to the ATO?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "If your tax withheld was less than your actual liability, you will receive a bill. Common causes include multiple jobs or investment income. You can request a payment plan from the ATO.",
      },
    },
  ],
};

const howToSchema = calculatorHowTo({
  name: "How to Use the Tax Return Estimator",
  url: URL,
  description: "Estimate your Australian tax refund or bill in under a minute.",
  steps: PAY_CALCULATOR_STEPS,
});

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webApp, faq, ORGANIZATION_SCHEMA, howToSchema]} />
      <TaxReturnCalculatorPage />
    </>
  );
}
