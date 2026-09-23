import type { Metadata } from "next";
import GrossPayCalculatorPage from "@/modules/calculator/gross-pay-calculator";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, WebApplication, WithContext } from "schema-dts";
import { faqPageSchema } from "@/lib/faq";
import { GROSS_PAY_FAQS } from "@/modules/calculator/gross-pay-calculator-faqs";
import { formatAUD, SITE_CONFIG } from "@/lib/constants";
import { findGrossForNet } from "@/modules/calculator/gross-for-net";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/gross-pay-calculator/`;

const FY = SITE_CONFIG.financialYear;
// Answer-first figure from the same search the calculator runs.
const GROSS_FOR_1500_WK = Math.round(findGrossForNet(1_500 * 52));

// 14.5k impr at 0.57% CTR (pos 8.5). The page is a reverse (net → gross)
// calculator; GSC shows "net to gross calculator" / "net to gross calculator
// australia" and DataForSEO "salary gross calculator", "gross income". Title
// now names that intent and the FY; description leads with a computed answer.
// Previous: "Gross Pay Calculator Australia — Reverse Calculate from Net".
const TITLE = `Net to Gross Pay Calculator Australia ${FY} (Reverse Tax)`;
const DESCRIPTION = `To take home $1,500 a week you need ${formatAUD(GROSS_FOR_1500_WK)} a year gross in ${FY}. Enter any weekly, fortnightly, monthly or annual net pay to find the gross salary you need.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: "en_AU",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
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

const faq = faqPageSchema(GROSS_PAY_FAQS);

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
