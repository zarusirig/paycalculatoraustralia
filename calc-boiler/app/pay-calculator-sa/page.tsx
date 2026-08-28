import type { Metadata } from "next";
import PayCalculatorSAPage from "@/modules/state/pay-calculator-sa";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/pay-calculator-sa/`;

export const metadata: Metadata = {
  title: "Pay Calculator SA — Your Take-Home Pay in South Australia",
  description:
    "Work out your take-home pay in South Australia. A free salary and wage calculator on current ATO rates, plus SA public holidays, part-days and long service leave.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Pay Calculator SA — Your Take-Home Pay in South Australia",
    description: "See what you actually take home in SA after income tax, the Medicare levy and HECS-HELP.",
    url: URL,
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: "en_AU",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pay Calculator SA",
    description: "Your take-home pay in South Australia, plus SA holidays and long service leave.",
  },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Pay Calculator SA", item: URL },
  ],
};

const webAppSchema: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Pay Calculator SA",
  url: URL,
  description: "Take-home pay calculator for employees in South Australia.",
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
      name: "Is income tax different in South Australia?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Income tax is levied by the federal government through the ATO and is identical in all six states and both territories. Your income tax brackets, the low income tax offset and the Medicare levy are the same whether you live in Adelaide, Sydney or Perth.",
      },
    },
    {
      "@type": "Question",
      name: "Are Christmas Eve and New Year's Eve public holidays in SA?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Both are part-day public holidays in South Australia, running from 7 pm to midnight. Hours worked before 7 pm are ordinary hours and hours after it attract public holiday entitlements, so a single evening shift can span both.",
      },
    },
    {
      "@type": "Question",
      name: "Why is long service leave better in South Australia?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Long Service Leave Act 1987 (SA) sets accrual at 1.3 weeks per completed year, which produces 13 weeks at the 10-year mark. Most other states accrue about 0.867 weeks a year and reach only 8.67 weeks at 10 years. A pro-rata payment becomes available once you complete 7 years.",
      },
    },
    {
      "@type": "Question",
      name: "What is the payroll tax rate in SA, and do employees pay it?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SA payroll tax is 4.95% on wages above a $1,500,000 threshold. It is an employer cost, charged to the business rather than the employee, and it never appears as a deduction on a payslip.",
      },
    },
  ],
};

const howToSchema = calculatorHowTo({
  name: "How to Calculate Take-Home Pay in South Australia",
  url: URL,
  description: "Calculate your take-home pay in South Australia in under a minute.",
  steps: PAY_CALCULATOR_STEPS,
});

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webAppSchema, faq, ORGANIZATION_SCHEMA, howToSchema]} />
      <PayCalculatorSAPage />
    </>
  );
}
