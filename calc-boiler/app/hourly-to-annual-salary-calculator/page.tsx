import type { Metadata } from "next";
import HourlyToAnnualCalculatorPage from "@/modules/calculator/hourly-to-annual-salary-calculator";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/hourly-to-annual-salary-calculator/`;

export const metadata: Metadata = {
  title: "Hourly to Annual Salary Calculator — Convert Your Pay Instantly",
  description:
    "Convert your hourly rate to an annual salary. See your exact take-home pay after tax and super across weekly, fortnightly & monthly periods.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Hourly to Annual Salary Calculator Australia",
    description: "Convert your hourly rate to an annual salary and see exactly how much you take home after tax.",
    url: URL,
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: "en_AU",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hourly to Annual Converter",
    description: "Convert your hourly rate to an annual salary instantly.",
  },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Hourly to Annual Salary Calculator", item: URL },
  ],
};

const webApp: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Hourly to Annual Salary Calculator Australia",
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
      name: "How do you calculate annual salary from an hourly rate?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Multiply your hourly rate by the number of hours you work each week, then multiply that result by 52 (the number of weeks in a year). For example, $40/hr × 38 hours × 52 weeks = $79,040 gross per year.",
      },
    },
    {
      "@type": "Question",
      name: "What is a standard working week in Australia?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "For full-time employees, the National Employment Standards (NES) define maximum ordinary hours as 38 hours per week.",
      },
    },
    {
      "@type": "Question",
      name: "Does my hourly rate include superannuation?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "If you are a permanent employee, your hourly rate usually excludes superannuation. Your employer must pay an additional 12% into your super fund. If you are a casual employee, your rate includes a 25% casual loading, and you still receive 12% super on top if you meet eligibility rules.",
      },
    },
  ],
};

const howToSchema = calculatorHowTo({
  name: "How to Use the Hourly to Annual Salary Calculator",
  url: URL,
  description: "Convert your hourly rate to an annual salary in under a minute.",
  steps: PAY_CALCULATOR_STEPS,
});

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webApp, faq, ORGANIZATION_SCHEMA, howToSchema]} />
      <HourlyToAnnualCalculatorPage />
    </>
  );
}
