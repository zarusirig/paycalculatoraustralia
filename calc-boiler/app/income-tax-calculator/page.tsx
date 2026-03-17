import type { Metadata } from "next";
import IncomeTaxCalculatorPage from "@/modules/calculator/income-tax-calculator";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";

const BASE_URL = SITE_CONFIG.baseUrl;
const PAGE_URL = `${BASE_URL}/income-tax-calculator/`;

export const metadata: Metadata = {
  title: "Income Tax Calculator Australia 2025-26 — How Much Tax Do You Pay?",
  description:
    "Free Australian income tax calculator. See exactly how much tax you pay on any salary with bracket-by-bracket breakdown. Updated for FY2025-26 using official ATO rates.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Income Tax Calculator Australia 2025-26",
    description:
      "Calculate your income tax with a bracket-by-bracket breakdown. Free, accurate, updated for FY2025-26.",
    url: PAGE_URL,
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: "en_AU",
  },
  twitter: {
    card: "summary_large_image",
    title: "Income Tax Calculator Australia 2025-26",
    description: "Free income tax calculator with bracket breakdown. ATO rates for FY2025-26.",
  },
};

const breadcrumbSchema: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE_URL },
    { "@type": "ListItem", position: 2, name: "Income Tax Calculator", item: PAGE_URL },
  ],
};

const webAppSchema: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Income Tax Calculator Australia 2025-26",
  url: PAGE_URL,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
  creator: { "@type": "Organization", name: SITE_CONFIG.name },
  dateModified: new Date().toISOString().split("T")[0],
  inLanguage: "en-AU",
};

const faqSchema: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How much tax do I pay on $80,000?",
      acceptedAnswer: { "@type": "Answer", text: "On $80,000, you pay $14,788 in income tax for FY2025-26. After the 2% Medicare levy ($1,600), your total tax deductions are $16,388. Your take-home pay is $63,612 per year — $1,223.31 per week." },
    },
    {
      "@type": "Question",
      name: "Do I pay my marginal rate on my entire salary?",
      acceptedAnswer: { "@type": "Answer", text: "No. Australia uses a progressive system. You only pay the marginal rate on the portion of income within that bracket. On $80,000, your marginal rate is 30%, but your effective rate is only 18.49%." },
    },
    {
      "@type": "Question",
      name: "What is the tax-free threshold?",
      acceptedAnswer: { "@type": "Answer", text: "The tax-free threshold is $18,200. You pay no income tax on the first $18,200 you earn. With LITO, the effective threshold is $22,575." },
    },
    {
      "@type": "Question",
      name: "How is income tax collected?",
      acceptedAnswer: { "@type": "Answer", text: "Your employer deducts income tax from each pay through the PAYG (Pay As You Go) withholding system. The amount withheld is based on the ATO's tax tables. You reconcile any difference when you lodge your annual tax return." },
    },
  ],
};

const howToSchema = calculatorHowTo({
  name: "How to Use the Income Tax Calculator",
  url: PAGE_URL,
  description: "Calculate your Australian income tax in under a minute.",
  steps: PAY_CALCULATOR_STEPS,
});

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumbSchema, webAppSchema, faqSchema, ORGANIZATION_SCHEMA, howToSchema]} />
      <IncomeTaxCalculatorPage />
    </>
  );
}
