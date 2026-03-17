import type { Metadata } from "next";
import ContractorVsEmployeeCalculatorPage from "@/modules/calculator/contractor-vs-employee-calculator";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/contractor-vs-employee-calculator/`;

export const metadata: Metadata = {
  title: "Contractor vs Employee Calculator — Compare Your Take-Home Pay",
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
  dateModified: new Date().toISOString().split("T")[0],
  inLanguage: "en-AU",
};

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Should I be a contractor or employee?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It depends on the rate differential. If contracting pays 30%+ more than the equivalent employee salary, the financial benefit usually outweighs the loss of entitlements. Below that, employment is typically better value.",
      },
    },
    {
      "@type": "Question",
      name: "Do contractors have to pay super?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Contractors are not legally required to pay their own super (unlike employers). However, for retirement planning, setting aside 12% voluntarily is strongly recommended. You can claim a tax deduction for personal super contributions.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need to register for GST as a contractor?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You must register for GST if your annual turnover is $75,000 or more. If below $75,000, registration is optional. When registered, you charge clients an additional 10% GST and remit it to the ATO quarterly via your BAS.",
      },
    },
  ],
};

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
