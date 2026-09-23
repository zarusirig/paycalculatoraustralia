import type { Metadata } from "next";
import SalarySacrificeCalculatorPage from "@/modules/calculator/salary-sacrifice-calculator";
import { faqPageSchema } from "@/lib/faq";
import { SALARY_SACRIFICE_FAQS } from "@/modules/calculator/salary-sacrifice-calculator-faqs";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, WebApplication, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/salary-sacrifice-calculator/`;

export const metadata: Metadata = {
  title: "Salary Sacrifice Calculator — How Much Will You Save?",
  description:
    "Compare take-home pay before and after salary sacrifice. See your tax savings, super boost & actual benefit. Free Australian calculator updated for FY2026-27.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Salary Sacrifice Calculator — How Much Will You Save?",
    description: "Compare your pay before and after salary sacrifice. See the tax savings instantly.",
    url: URL,
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: "en_AU",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Salary Sacrifice Calculator Australia",
    description: "Compare pay before and after sacrifice. See your tax savings.",
  },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Salary Sacrifice Calculator", item: URL },
  ],
};

const webApp: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Salary Sacrifice Calculator Australia",
  url: URL,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
  creator: { "@type": "Organization", name: SITE_CONFIG.name },
  dateModified: new Date().toISOString().split("T")[0],
  inLanguage: "en-AU",
};

const faq = faqPageSchema(SALARY_SACRIFICE_FAQS);

const howToSchema = calculatorHowTo({
  name: "How to Use the Salary Sacrifice Calculator",
  url: URL,
  description: "Calculate your salary sacrifice tax savings in under a minute.",
  steps: PAY_CALCULATOR_STEPS,
});

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webApp, faq, ORGANIZATION_SCHEMA, howToSchema]} />
      <SalarySacrificeCalculatorPage />
    </>
  );
}
