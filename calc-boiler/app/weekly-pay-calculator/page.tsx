import type { Metadata } from "next";
import WeeklyPayCalculatorPage from "@/modules/calculator/weekly-pay-calculator";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, WebApplication, WithContext } from "schema-dts";
import { calculatePayBreakdown, formatAUD, SITE_CONFIG } from "@/lib/constants";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";
import { faqPageSchema } from "@/lib/faq";
import { WEEKLY_PAY_FAQS } from "@/modules/calculator/weekly-pay-calculator-faqs";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/weekly-pay-calculator/`;

const FY = SITE_CONFIG.financialYear;
// Example computed from the tax engine at build time, never hardcoded.
const at80k = calculatePayBreakdown({ grossSalary: 80_000, includeHECS: false, hasPrivateHealth: true });

// Queries: "65k a year is how much a week after tax", "weekly pay calculator" 1.9k/mo.
// Head-term intent map (docs/seo/2026-09-23-head-term-intent-map.md): this URL
// is also the ONE primary for "weekly tax calculator" (18.1k, KD9, not in our
// top 100) — its SERP is ATO tax-withheld + pay calculators, so "& Tax" joins
// the title and the calculator now takes weekly pay as well as salary.
// /weekly-tax-table/ keeps the "weekly tax table" terms. Title carries the FY;
// description leads with a real after-tax figure.
// Previous: "Weekly Pay Calculator Australia ${FY}: Take-Home Pay".
const TITLE = `Weekly Pay & Tax Calculator Australia ${FY}: Take-Home Pay`;
const DESCRIPTION = `$80,000 is ${formatAUD(at80k.weekly)} a week after tax in ${FY} (${formatAUD(80_000 / 52)} gross ÷ 52). Weekly tax calculator: enter your weekly pay or salary for weekly tax, Medicare, super and take-home pay.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU" },
  twitter: { card: "summary_large_image", title: TITLE, description: `Weekly take-home pay after tax — ${FY} rates.` },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Weekly Pay Calculator", item: URL },
  ]
};

const webApp: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: `Weekly Pay & Tax Calculator Australia ${FY}`,
  url: URL,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
  creator: { "@type": "Organization", name: SITE_CONFIG.name },
  dateModified: new Date().toISOString().split("T")[0],
  inLanguage: "en-AU"
};

const faq = faqPageSchema(WEEKLY_PAY_FAQS);

const howToSchema = calculatorHowTo({
  name: "How to Use the Weekly Pay Calculator",
  url: URL,
  description: "Calculate your weekly take-home pay in under a minute.",
  steps: PAY_CALCULATOR_STEPS,
});

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webApp, faq, ORGANIZATION_SCHEMA, howToSchema]} />
      <WeeklyPayCalculatorPage />
    </>
  );
}
