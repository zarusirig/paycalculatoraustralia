import type { Metadata } from "next";
import FortnightlyPayCalculatorPage from "@/modules/calculator/fortnightly-pay-calculator";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/fortnightly-pay-calculator/`;

export const metadata: Metadata = {
  title: "Fortnightly Pay Calculator Australia — Take-Home Pay Every 2 Weeks (2025-26)",
  description:
    "Convert any salary or hourly rate to your fortnightly take-home pay. See exact tax, super and net amount paid every 2 weeks — Australian rates FY2025-26.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Fortnightly Pay Calculator Australia — Take-Home Pay Every 2 Weeks",
    description: "See exact tax, super and net pay every 2 weeks for FY2025-26.",
    url: URL,
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: "en_AU",
  },
  twitter: { card: "summary_large_image", title: "Fortnightly Pay Calculator Australia", description: "Take-home pay every 2 weeks — FY2025-26 rates." },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Fortnightly Pay Calculator", item: URL },
  ]
};

const webApp: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Fortnightly Pay Calculator Australia",
  url: URL,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
  creator: { "@type": "Organization", name: SITE_CONFIG.name },
  dateModified: new Date().toISOString().split("T")[0],
  inLanguage: "en-AU"
};

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "How much is an $85,000 salary fortnightly after tax?", acceptedAnswer: { "@type": "Answer", text: "An $85,000 annual salary equals approximately $3,269.23 gross per fortnight before tax. After PAYG income tax and the 2% Medicare levy for FY2025-26, the net fortnightly take-home is approximately $2,576 (for a resident claiming the tax-free threshold, no HECS-HELP, with private hospital cover)." } },
    { "@type": "Question", name: "How is fortnightly tax calculated in Australia?", acceptedAnswer: { "@type": "Answer", text: "Fortnightly tax in Australia is calculated by dividing your gross annual salary by 26 (the number of fortnights in a year), then applying the ATO PAYG fortnightly tax table. The table accounts for the 5 income tax brackets, the 2% Medicare levy, and the Low Income Tax Offset (LITO) so the correct amount reaches the ATO across the financial year." } },
    { "@type": "Question", name: "Why is my fortnightly pay different from monthly divided by 2?", acceptedAnswer: { "@type": "Answer", text: "Because a year has 26 fortnights but 12 months. Fortnightly pay = annual salary ÷ 26 ($3,269.23 on $85,000). Monthly pay = annual salary ÷ 12 ($7,083.33 on $85,000). Dividing monthly by 2 gives $3,541.67 — which is $272.44 higher than the real fortnightly amount. Two months each year contain 3 fortnightly pays instead of 2." } },
    { "@type": "Question", name: "Is super deducted from my fortnightly pay?", acceptedAnswer: { "@type": "Answer", text: "No. Your employer pays the 12% Superannuation Guarantee on top of your gross salary. It is not deducted from your fortnightly take-home pay unless your contract specifies a 'total package inclusive of super'." } },
    { "@type": "Question", name: "Are there 26 or 27 pays in a year?", acceptedAnswer: { "@type": "Answer", text: "Usually 26 fortnightly pays in a year (26 × 14 = 364 days). Every 11 to 12 years, a financial year contains 27 fortnightly pay days, which changes PAYG withholding slightly and can result in a small tax shortfall at year-end." } },
  ]
};

const howToSchema = calculatorHowTo({
  name: "How to Use the Fortnightly Pay Calculator",
  url: URL,
  description: "Calculate your fortnightly take-home pay in under a minute.",
  steps: PAY_CALCULATOR_STEPS,
});

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webApp, faq, ORGANIZATION_SCHEMA, howToSchema]} />
      <FortnightlyPayCalculatorPage />
    </>
  );
}
