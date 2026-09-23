import ContractorPayCalculator from "@/modules/calculator/contractor-pay-calculator";
import { JsonLd } from "@/modules/seo/json-ld";
import type {
  BreadcrumbList,
  FAQPage,
  WebApplication,
  WithContext,
} from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { CONTRACTOR_FAQS } from "@/modules/calculator/contractor-pay-faqs";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contractor Pay Calculator Australia — Your Real Take-Home",
  description:
    "Calculate your take-home as a contractor in Australia. See your net pay after GST, income tax, super self-contribution & deductions — ABN vs PAYG comparison for FY2026-27.",
  alternates: {
    canonical: `${SITE_CONFIG.baseUrl}/contractor-pay-calculator/`,
  },
  openGraph: {
    title: "Contractor Pay Calculator Australia — What You Take Home as a Contractor",
    description:
      "Calculate your take-home as a contractor. See net pay after GST, income tax, super self-contribution & deductions for FY2026-27.",
    url: `${SITE_CONFIG.baseUrl}/contractor-pay-calculator/`,
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: "en_AU",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contractor Pay Calculator Australia",
    description: "See your real take-home as a contractor in Australia.",
  },
};

const webAppSchema: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Contractor Pay Calculator Australia",
  url: `${SITE_CONFIG.baseUrl}/contractor-pay-calculator/`,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "AUD",
  },
  creator: {
    "@type": "Organization",
    name: SITE_CONFIG.name,
  },
  dateModified: new Date().toISOString().split("T")[0],
  inLanguage: "en-AU",
};

const breadcrumbSchema: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Pay Calculator",
      item: SITE_CONFIG.baseUrl,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Contractor Pay Calculator",
      item: `${SITE_CONFIG.baseUrl}/contractor-pay-calculator/`,
    },
  ],
};

const faqSchema: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  // Same array as the on-page accordion, so the two cannot drift.
  mainEntity: CONTRACTOR_FAQS.map((f) => ({
    "@type": "Question" as const,
    name: f.q,
    acceptedAnswer: { "@type": "Answer" as const, text: f.a },
  })),
};

const howToSchema = calculatorHowTo({
  name: "How to Use the Contractor Pay Calculator",
  url: `${SITE_CONFIG.baseUrl}/contractor-pay-calculator/`,
  description: "Calculate your contractor take-home pay after tax and GST in under a minute.",
  steps: PAY_CALCULATOR_STEPS,
});

export default function ContractorPayCalculatorPage() {
  return (
    <>
      <JsonLd
        code={[webAppSchema, breadcrumbSchema, faqSchema, ORGANIZATION_SCHEMA, howToSchema]}
      />
      <ContractorPayCalculator />
    </>
  );
}
