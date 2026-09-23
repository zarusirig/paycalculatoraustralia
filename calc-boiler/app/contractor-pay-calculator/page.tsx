import ContractorPayCalculator from "@/modules/calculator/contractor-pay-calculator";
import { JsonLd } from "@/modules/seo/json-ld";
import type {
  BreadcrumbList,
  WebApplication,
  WithContext,
} from "schema-dts";
import { faqPageSchema } from "@/lib/faq";
import { CONTRACTOR_PAY_FAQS } from "@/modules/calculator/contractor-pay-calculator-faqs";
import { SITE_CONFIG } from "@/lib/constants";

import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";
import type { Metadata } from "next";
import { pageDateModified } from "@/lib/page-dates";
import { withPageEnd } from "@/components/common/content-slots";

export const metadata: Metadata = {
  title: "Contractor Pay Calculator Australia — Your Real Take-Home",
  description:
    "Contractor pay calculator for Australia: net pay after GST, income tax, super and deductions, with an ABN vs PAYG comparison for FY2026-27.",
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
  dateModified: pageDateModified("contractor-pay-calculator"),
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

const faqSchema = faqPageSchema(CONTRACTOR_PAY_FAQS);

const howToSchema = calculatorHowTo({
  name: "How to Use the Contractor Pay Calculator",
  url: `${SITE_CONFIG.baseUrl}/contractor-pay-calculator/`,
  description: "Calculate your contractor take-home pay after tax and GST in under a minute.",
  steps: PAY_CALCULATOR_STEPS,
});

function ContractorPayCalculatorPage() {
  return (
    <>
      <JsonLd
        code={[webAppSchema, breadcrumbSchema, faqSchema, ORGANIZATION_SCHEMA, howToSchema]}
      />
      <ContractorPayCalculator />
    </>
  );
}

export default withPageEnd(ContractorPayCalculatorPage, "/contractor-pay-calculator/");
