import type { Metadata } from "next";
import IncomeTaxCalculatorPage from "@/modules/calculator/income-tax-calculator";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";

const BASE_URL = SITE_CONFIG.baseUrl;
const PAGE_URL = `${BASE_URL}/income-tax-calculator/`;

export const metadata: Metadata = {
  title: "Income Tax Calculator Australia — How Much Tax Do You Pay?",
  description:
    "Calculate your Australian income tax instantly using ATO brackets for FY2026-27. See how much tax you pay on any salary from $30,000 to $200,000 — with bracket-by-bracket breakdown.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Income Tax Calculator Australia 2026-27",
    description:
      "Calculate your income tax with a bracket-by-bracket breakdown. Free, accurate, updated for FY2026-27.",
    url: PAGE_URL,
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: "en_AU",
  },
  twitter: {
    card: "summary_large_image",
    title: "Income Tax Calculator Australia 2026-27",
    description: "Free income tax calculator with bracket breakdown. ATO rates for FY2026-27.",
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
  name: "Income Tax Calculator Australia 2026-27",
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
      name: "How much income tax do I pay in Australia?",
      acceptedAnswer: { "@type": "Answer", text: "Australian residents pay income tax on a progressive scale for FY2026-27: 0% up to $18,200, 16% from $18,201 to $45,000, 30% from $45,001 to $135,000, 37% from $135,001 to $190,000, and 45% above $190,000. On an $80,000 salary you pay $14,788 in income tax plus $1,600 Medicare levy — total $16,388, leaving a take-home of $63,612." },
    },
    {
      "@type": "Question",
      name: "What are the 2025-26 tax brackets?",
      acceptedAnswer: { "@type": "Answer", text: "The FY2026-27 ATO resident tax brackets are: $0–$18,200 at 0% (tax-free threshold), $18,201–$45,000 at 16%, $45,001–$135,000 at 30%, $135,001–$190,000 at 37%, and $190,001+ at 45%. These are the same brackets as FY2024-25 after the Stage 3 tax cuts took effect on 1 July 2024." },
    },
    {
      "@type": "Question",
      name: "How is income tax calculated in Australia?",
      acceptedAnswer: { "@type": "Answer", text: "Australia uses a progressive marginal system. Your income is sliced across the 5 ATO brackets and each slice is taxed at that bracket's rate. The portions are summed to get your gross income tax, then the Low Income Tax Offset (LITO) is subtracted, and the 2% Medicare levy is added. For example, $90,000 = $0 (on first $18,200) + $4,288 (16% on $26,800) + $13,500 (30% on $45,000) = $17,788 income tax." },
    },
    {
      "@type": "Question",
      name: "Do I pay tax on the first $18,200?",
      acceptedAnswer: { "@type": "Answer", text: "No. The first $18,200 of your taxable income is tax-free if you claim the tax-free threshold with your primary employer. With the Low Income Tax Offset (LITO) added in, you can earn up to $22,575 before paying any net income tax. The threshold only applies to one employer — claiming it on a second job will create a tax debt." },
    },
    {
      "@type": "Question",
      name: "What is the difference between marginal and effective tax rate?",
      acceptedAnswer: { "@type": "Answer", text: "Your marginal rate is the rate applied to the next dollar you earn — it equals the bracket rate at your current income. Your effective rate is your total income tax divided by your total income — it averages across all brackets. On $100,000, your marginal rate is 30% but your effective rate (excluding Medicare) is about 17.79%, because the first $18,200 was taxed at 0% and the next $26,800 was taxed at only 16%." },
    },
    {
      "@type": "Question",
      name: "How much tax do I pay on $80,000?",
      acceptedAnswer: { "@type": "Answer", text: "On $80,000, you pay $14,788 in income tax for FY2026-27. After the 2% Medicare levy ($1,600), your total tax deductions are $16,388. Your take-home pay is $63,612 per year — $1,223.31 per week." },
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
