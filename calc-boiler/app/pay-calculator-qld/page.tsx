import type { Metadata } from "next";
import PayCalculatorQLDPage from "@/modules/state/pay-calculator-qld";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/pay-calculator-qld/`;

export const metadata: Metadata = {
  title: "Pay Calculator QLD — Your Take-Home Pay in Queensland",
  description:
    "Work out your take-home pay in Queensland. A free salary and wage calculator on current ATO rates, plus QLD public holidays, penalty rates and long service leave.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Pay Calculator QLD — Your Take-Home Pay in Queensland",
    description: "See what you actually take home in Queensland after income tax, the Medicare levy and HECS-HELP.",
    url: URL,
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: "en_AU",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pay Calculator QLD",
    description: "Your take-home pay in Queensland, plus QLD holidays and long service leave.",
  },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Pay Calculator QLD", item: URL },
  ],
};

const webAppSchema: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Pay Calculator QLD",
  url: URL,
  description: "Take-home pay calculator for employees in Queensland, Australia.",
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
      name: "Is income tax different in Queensland compared to other states?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Income tax in Australia is levied by the federal government through the ATO. The income tax brackets, Medicare levy and HECS-HELP repayment rates are identical in Queensland, New South Wales, Victoria and every other state and territory.",
      },
    },
    {
      "@type": "Question",
      name: "Is the Ekka a public holiday for the whole of Queensland?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. The Royal Queensland Show public holiday on Wednesday 12 August 2026 applies to the Brisbane area only. Other parts of Queensland hold their own local show holidays on different dates, declared regionally.",
      },
    },
    {
      "@type": "Question",
      name: "Is Christmas Eve a public holiday in Queensland?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Partly. Christmas Eve is a part-day public holiday in Queensland from 6 pm to midnight. Hours worked before 6 pm are ordinary hours; hours after it attract public holiday entitlements. Queensland's 6 pm start is an hour earlier than South Australia's and the Northern Territory's.",
      },
    },
    {
      "@type": "Question",
      name: "When do I get long service leave in Queensland?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "After 10 years of continuous service you can take 8.6667 weeks of paid leave under the Industrial Relations Act 2016, rising to 13 weeks at 15 years. Between 7 and 10 years a proportionate payment is owed only in defined circumstances; at 10 years the payment on termination becomes automatic.",
      },
    },
    {
      "@type": "Question",
      name: "Do employees pay for WorkCover in QLD?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. WorkCover Queensland insurance premiums are an employer-only expense. They do not reduce your gross salary and do not affect your take-home pay or net pay after tax.",
      },
    },
  ],
};

const howToSchema = calculatorHowTo({
  name: "How to Calculate Take-Home Pay in Queensland",
  url: URL,
  description: "Calculate your take-home pay in Queensland in under a minute.",
  steps: PAY_CALCULATOR_STEPS,
});

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webAppSchema, faq, ORGANIZATION_SCHEMA, howToSchema]} />
      <PayCalculatorQLDPage />
    </>
  );
}
