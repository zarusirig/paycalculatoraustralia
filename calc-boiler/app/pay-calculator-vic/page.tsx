import type { Metadata } from "next";
import PayCalculatorVICPage from "@/modules/state/pay-calculator-vic";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/pay-calculator-vic/`;

export const metadata: Metadata = {
  title: "Pay Calculator VIC 2025-26 — Victoria Take-Home Pay",
  description: "Calculate your take-home pay in Victoria. Learn about federal income tax, VIC payroll tax, WorkSafe premiums, and the mental health and wellbeing surcharge.",
  alternates: { canonical: URL },
  openGraph: { title: "Pay Calculator VIC — Take-Home Pay in Victoria", description: "Calculate your net pay in VIC. See the exact tax deductions based on federal rates.", url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU" },
  twitter: { card: "summary_large_image", title: "Pay Calculator VIC", description: "Calculate your take-home pay in Victoria." },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Pay Calculator VIC", item: URL },
  ]
};

const webAppSchema: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Pay Calculator VIC",
  url: URL,
  description: "Take-home pay calculation and tax specifics for Victoria, Australia.",
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
    { "@type": "Question", name: "Is income tax different in Victoria compared to other states?", acceptedAnswer: { "@type": "Answer", text: "No, personal income tax in Australia is levied by the federal government (the ATO). The tax brackets and rates are exactly the same in Victoria as they are everywhere else in Australia." } },
    { "@type": "Question", name: "What is the payroll tax threshold in VIC?", acceptedAnswer: { "@type": "Answer", text: "From 1 July 2024, the payroll tax threshold in Victoria is $900,000. It is set to increase to $1,000,000 from 1 July 2025. Employers pay this, not employees." } },
    { "@type": "Question", name: "Do employees pay the Mental Health and Wellbeing Surcharge?", acceptedAnswer: { "@type": "Answer", text: "No. The Mental Health and Wellbeing Surcharge is a state tax applied to employers whose national payroll exceeds $10 million. It does not come out of your personal salary." } },
  ]
};

const howToSchema = calculatorHowTo({
  name: "How to Calculate Take-Home Pay in Victoria",
  url: URL,
  description: "Calculate your take-home pay in Victoria in under a minute.",
  steps: PAY_CALCULATOR_STEPS,
});

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webAppSchema, faq, ORGANIZATION_SCHEMA, howToSchema]} />
      <PayCalculatorVICPage />
    </>
  );
}
