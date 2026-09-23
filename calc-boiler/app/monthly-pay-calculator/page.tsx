import type { Metadata } from "next";
import MonthlyPayCalculatorPage from "@/modules/calculator/monthly-pay-calculator";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import { calculatePayBreakdown, formatAUD, SITE_CONFIG } from "@/lib/constants";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";
import { pageDateModified } from "@/lib/page-dates";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/monthly-pay-calculator/`;

const FY = SITE_CONFIG.financialYear;
// Example computed from the tax engine at build time, never hardcoded.
const at80k = calculatePayBreakdown({ grossSalary: 80_000, includeHECS: false, hasPrivateHealth: true });

// Queries: "monthly pay calculator", "100k salary per month", "net salary calculator". Title carries the FY (rolls over with SITE_CONFIG);
// description leads with a real after-tax figure.
const TITLE = `Monthly Pay Calculator Australia ${FY}: Take-Home Pay`;
const DESCRIPTION = `$80,000 is ${formatAUD(at80k.monthly)} a month after tax in ${FY} (${formatAUD(80_000 / 12)} gross ÷ 12). Enter any salary to see your monthly tax, Medicare, super and take-home pay.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU" },
  twitter: { card: "summary_large_image", title: TITLE, description: `Monthly take-home pay after tax — ${FY} rates.` },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Monthly Pay Calculator", item: URL },
  ]
};

const webApp: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Monthly Pay Calculator Australia",
  url: URL,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
  creator: { "@type": "Organization", name: SITE_CONFIG.name },
  dateModified: pageDateModified("monthly-pay-calculator"),
  inLanguage: "en-AU"
};

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "How is monthly pay calculated?", acceptedAnswer: { "@type": "Answer", text: "Monthly pay is calculated by dividing your gross annual salary by 12 (the number of months in a year). Then, your income tax, Medicare levy, and any HECS repayments are divided by 12 and deducted through the PAYG system." } },
    { "@type": "Question", name: "Is super deducted from my monthly pay?", acceptedAnswer: { "@type": "Answer", text: "No. Your employer pays super on top of your salary. It is not deducted from your monthly take-home pay." } },
    { "@type": "Question", name: "Why do some months have different pay amounts?", acceptedAnswer: { "@type": "Answer", text: "If you are paid an annual salary on a monthly basis, your pay should be exactly the same every month, regardless of whether the month has 28, 30, or 31 days." } },
  ]
};

const howToSchema = calculatorHowTo({
  name: "How to Use the Monthly Pay Calculator",
  url: URL,
  description: "Calculate your monthly take-home pay in under a minute.",
  steps: PAY_CALCULATOR_STEPS,
});

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webApp, faq, ORGANIZATION_SCHEMA, howToSchema]} />
      <MonthlyPayCalculatorPage />
    </>
  );
}
