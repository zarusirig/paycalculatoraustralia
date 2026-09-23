import type { Metadata } from "next";
import ContractorVsEmployeeCalculatorPage from "@/modules/calculator/contractor-vs-employee-calculator";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, WebApplication, WithContext } from "schema-dts";
import { faqPageSchema } from "@/lib/faq";
import { CONTRACTOR_VS_EMPLOYEE_FAQS } from "@/modules/calculator/contractor-vs-employee-calculator-faqs";
import { SITE_CONFIG } from "@/lib/constants";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";
import { pageDateModified } from "@/lib/page-dates";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/contractor-vs-employee-calculator/`;

export const metadata: Metadata = {
  title: "Contractor vs Employee Calculator — Compare Take-Home",
  description:
    "Compare take-home pay as a contractor (ABN) vs employee. See the real difference after tax, super, GST & insurance. Side-by-side comparison.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Contractor vs Employee Calculator — Compare Your Take-Home Pay",
    description: "Compare your take-home pay as a contractor vs employee side-by-side.",
    url: URL,
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: "en_AU",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contractor vs Employee Calculator Australia",
    description: "Are you better off as a contractor or employee? Compare take-home pay.",
  },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Contractor vs Employee Calculator", item: URL },
  ],
};

const webApp: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Contractor vs Employee Calculator Australia",
  url: URL,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
  creator: { "@type": "Organization", name: SITE_CONFIG.name },
  dateModified: pageDateModified("contractor-vs-employee-calculator"),
  inLanguage: "en-AU",
};

const faq = faqPageSchema(CONTRACTOR_VS_EMPLOYEE_FAQS);

const howToSchema = calculatorHowTo({
  name: "How to Use the Contractor vs Employee Calculator",
  url: URL,
  description: "Compare your take-home pay as a contractor vs employee in under a minute.",
  steps: PAY_CALCULATOR_STEPS,
});

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webApp, faq, ORGANIZATION_SCHEMA, howToSchema]} />
      <ContractorVsEmployeeCalculatorPage />
    </>
  );
}
