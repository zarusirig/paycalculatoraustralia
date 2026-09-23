import type { Metadata } from "next";
import AnnualPayCalculatorPage from "@/modules/calculator/annual-pay-calculator";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, WebApplication, WithContext } from "schema-dts";
import { faqPageSchema } from "@/lib/faq";
import { ANNUAL_PAY_FAQS } from "@/modules/calculator/annual-pay-calculator-faqs";
import { calculatePayBreakdown, formatAUD, SITE_CONFIG } from "@/lib/constants";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/annual-pay-calculator/`;

const FY = SITE_CONFIG.financialYear;
// Answer-first figure from the tax engine at build time, never hardcoded.
const at80k = calculatePayBreakdown({ grossSalary: 80_000, includeHECS: false, hasPrivateHealth: true });

// Head-term intent map (docs/seo/2026-09-23-head-term-intent-map.md): this URL
// is the ONE primary for "salary after tax calculator" (6.6k, /monthly-pay-
// calculator/ was #71) and "salary after tax" (2.9k, this URL #44). "Annual
// salary calculator"/"yearly salary calculator" currently rank via
// /hourly-to-annual-salary-calculator/ (#20-24) and are left there. The generic
// "salary calculator" head term belongs to the homepage — this page links to it.
// Previous: "Annual Salary Calculator Australia — Yearly Take-Home Pay" (no FY,
// description hardcoded FY2026-27).
const TITLE = `Annual Salary After Tax Calculator Australia ${FY}`;
const DESCRIPTION = `A $80,000 salary is ${formatAUD(at80k.takeHomePay)} a year after tax in ${FY}. Salary after tax calculator: convert any yearly gross salary into annual take-home pay after income tax, Medicare levy and HECS.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU" },
  twitter: { card: "summary_large_image", title: TITLE, description: `Yearly take-home pay after tax for FY${FY}.` },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Annual Pay Calculator", item: URL },
  ]
};

const webApp: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: `Annual Salary After Tax Calculator Australia ${FY}`,
  url: URL,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
  creator: { "@type": "Organization", name: SITE_CONFIG.name },
  dateModified: new Date().toISOString().split("T")[0],
  inLanguage: "en-AU"
};

const faq = faqPageSchema(ANNUAL_PAY_FAQS);

const howToSchema = calculatorHowTo({
  name: "How to Use the Annual Pay Calculator",
  url: URL,
  description: "Calculate your annual take-home pay and tax summary in under a minute.",
  steps: PAY_CALCULATOR_STEPS,
});

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webApp, faq, ORGANIZATION_SCHEMA, howToSchema]} />
      <AnnualPayCalculatorPage />
    </>
  );
}
