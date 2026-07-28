import type { Metadata } from "next";
import PayCalculatorWAPage from "@/modules/state/pay-calculator-wa";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/pay-calculator-wa/`;

export const metadata: Metadata = {
  title: "Pay Calculator WA — Western Australia Take-Home Pay",
  description: "Calculate your take-home pay in Western Australia. Learn about federal income tax, WA payroll tax, WorkCover, and the high average salaries driven by the resources sector.",
  alternates: { canonical: URL },
  openGraph: { title: "Pay Calculator WA — Take-Home Pay in Western Australia", description: "Calculate your net pay in WA. See the exact tax deductions based on federal rates.", url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU" },
  twitter: { card: "summary_large_image", title: "Pay Calculator WA", description: "Calculate your take-home pay in Western Australia." },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Pay Calculator WA", item: URL },
  ]
};

const webAppSchema: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Pay Calculator WA",
  url: URL,
  description: "Take-home pay calculation and tax specifics for Western Australia.",
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
    { "@type": "Question", name: "Is income tax different in WA compared to other states?", acceptedAnswer: { "@type": "Answer", text: "No, income tax in Australia is levied by the federal government (the ATO). The tax brackets and rates are exactly the same in Western Australia as they are in all other states and territories." } },
    { "@type": "Question", name: "What is the payroll tax threshold in WA?", acceptedAnswer: { "@type": "Answer", text: "In Western Australia, the payroll tax threshold is currently $1,000,000. Employers pay this, not employees." } },
    { "@type": "Question", name: "Do employees pay for WorkCover WA?", acceptedAnswer: { "@type": "Answer", text: "No. WorkCover WA insurance premiums are an employer expense. They do not come out of your gross salary or reduce your take-home pay." } },
  ]
};

const howToSchema = calculatorHowTo({
  name: "How to Calculate Take-Home Pay in Western Australia",
  url: URL,
  description: "Calculate your take-home pay in Western Australia in under a minute.",
  steps: PAY_CALCULATOR_STEPS,
});

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webAppSchema, faq, ORGANIZATION_SCHEMA, howToSchema]} />
      <PayCalculatorWAPage />
    </>
  );
}
