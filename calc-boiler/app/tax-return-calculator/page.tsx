import type { Metadata } from "next";
import TaxReturnCalculatorPage from "@/modules/calculator/tax-return-calculator";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { ORGANIZATION_SCHEMA, calculatorHowTo } from "@/lib/schema";
import { RETURN_2026 } from "@/lib/constants/tax-return-2025-26";
import { RETURN_YEARS } from "@/lib/constants/tax-return-estimator";
import { TAX_RETURN_CALCULATOR_FAQS } from "@/modules/calculator/tax-return-calculator-faqs";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/tax-return-calculator/`;

const THIS = RETURN_YEARS["2025-26"];
const NEXT = RETURN_YEARS["2026-27"];
const TITLE = `Tax Return Calculator ${THIS.returnName} — Estimate Your ${THIS.incomeYear} Refund`;
const DESCRIPTION = `Estimate your ${THIS.incomeYear} tax refund or bill using the ${THIS.incomeYear} rates your ${THIS.returnName} return is assessed on. Due ${RETURN_2026.selfLodgeDueDate}. Switch to ${NEXT.incomeYear} to plan next year.`;

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
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: `Estimate your ${THIS.incomeYear} tax refund on the rates your return is actually assessed on.`,
  },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Tax Return Calculator", item: URL },
  ],
};

const webApp: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: `Tax Return Calculator ${THIS.returnName} (${THIS.incomeYear} and ${NEXT.incomeYear})`,
  description: DESCRIPTION,
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
  mainEntity: TAX_RETURN_CALCULATOR_FAQS.map((f) => ({
    "@type": "Question" as const,
    name: f.q,
    acceptedAnswer: { "@type": "Answer" as const, text: f.a },
  })),
};

const howToSchema = calculatorHowTo({
  name: "How to Use the Tax Return Calculator",
  url: URL,
  description: `Estimate your ${THIS.incomeYear} Australian tax refund or bill in under a minute.`,
  steps: [
    { name: "Choose the income year", text: `Pick ${THIS.incomeYear} for the return you lodge now, or ${NEXT.incomeYear} to plan next year's return.` },
    { name: "Enter income and tax withheld", text: "Type your total income and the tax withheld from your income statement." },
    { name: "Add deductions and extras", text: "Enter your deductions and tick if you have no private hospital cover or have a study loan." },
    { name: "Read your estimate", text: "See your estimated refund or amount owing, with income tax, offsets, Medicare levy and any study loan repayment." },
  ],
});

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webApp, faq, ORGANIZATION_SCHEMA, howToSchema]} />
      <TaxReturnCalculatorPage />
    </>
  );
}
