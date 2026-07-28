import type { Metadata } from "next";
import PayCalculatorQLDPage from "@/modules/state/pay-calculator-qld";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/pay-calculator-qld/`;

export const metadata: Metadata = {
  title: "Pay Calculator QLD — Queensland Take-Home Pay",
  description: "Calculate your take-home pay in Queensland. Learn about federal income tax, QLD payroll tax thresholds, WorkCover, and average salaries in Brisbane & QLD.",
  alternates: { canonical: URL },
  openGraph: { title: "Pay Calculator QLD — Take-Home Pay in Queensland", description: "Calculate your net pay in QLD. See the exact tax deductions based on federal rates.", url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU" },
  twitter: { card: "summary_large_image", title: "Pay Calculator QLD", description: "Calculate your take-home pay in Queensland." },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Pay Calculator QLD", item: URL },
  ]
};

const webAppSchema: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Pay Calculator QLD",
  url: URL,
  description: "Take-home pay calculation and tax specifics for Queensland, Australia.",
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
    { "@type": "Question", name: "Is income tax different in QLD compared to other states?", acceptedAnswer: { "@type": "Answer", text: "No, income tax in Australia is levied by the federal government (the ATO). The tax brackets and rates are exactly the same in Queensland as they are in all other states and territories." } },
    { "@type": "Question", name: "What is the payroll tax threshold in QLD?", acceptedAnswer: { "@type": "Answer", text: "In Queensland, the payroll tax threshold is $1.3 million. Employers only pay payroll tax on their total Australian taxable wages that exceed this threshold." } },
    { "@type": "Question", name: "Do employees in QLD pay for WorkCover?", acceptedAnswer: { "@type": "Answer", text: "No. WorkCover Queensland insurance premiums are an employer expense. They do not come out of your gross salary or take-home pay." } },
  ]
};

const howToSchema = calculatorHowTo({
  name: "How to Calculate Take-Home Pay in Queensland",
  url: URL,
  description: "Calculate your take-home pay in Queensland in under a minute.",
  steps: PAY_CALCULATOR_STEPS,
});

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webAppSchema, faq, ORGANIZATION_SCHEMA, howToSchema]} />
      <PayCalculatorQLDPage />
    </>
  );
}
