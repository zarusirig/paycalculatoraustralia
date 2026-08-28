import type { Metadata } from "next";
import PayCalculatorVICPage from "@/modules/state/pay-calculator-vic";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/pay-calculator-vic/`;

export const metadata: Metadata = {
  title: "Pay Calculator VIC — Your Take-Home Pay in Victoria",
  description:
    "Work out your take-home pay in Victoria. A free salary and wage calculator on current ATO rates, plus Victorian public holidays, penalty rates and long service leave.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Pay Calculator VIC — Your Take-Home Pay in Victoria",
    description: "See what you actually take home in Victoria after income tax, the Medicare levy and HECS-HELP.",
    url: URL,
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: "en_AU",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pay Calculator VIC",
    description: "Your take-home pay in Victoria, plus VIC holidays and long service leave.",
  },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Pay Calculator VIC", item: URL },
  ],
};

const webAppSchema: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Pay Calculator VIC",
  url: URL,
  description: "Take-home pay calculator for employees in Victoria, Australia.",
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
      name: "Is income tax different in Victoria compared to other states?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Personal income tax in Australia is levied by the federal government through the ATO. The income tax brackets, Medicare levy and HECS-HELP repayment thresholds are identical in Victoria, New South Wales, Queensland and every other state and territory.",
      },
    },
    {
      "@type": "Question",
      name: "Which public holidays are unique to Victoria?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Victoria gazettes Labour Day in March, the Friday before the AFL Grand Final in September and Melbourne Cup Day in November — none of which are national. Some regional areas hold the Melbourne Cup holiday on a different date. Working one attracts public holiday penalty rates under most awards.",
      },
    },
    {
      "@type": "Question",
      name: "When do I get long service leave in Victoria?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "After 7 years of continuous service with one employer, under the Long Service Leave Act 2018. Leave accrues at one week for every 60 weeks of service. Past 7 years the accrued balance is paid out however the employment ends, including resignation.",
      },
    },
    {
      "@type": "Question",
      name: "Do employees pay the Mental Health and Wellbeing Surcharge?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. The Mental Health and Wellbeing Surcharge is paid exclusively by employers whose national payroll exceeds $10 million. It does not reduce your personal salary or affect your take-home pay calculation.",
      },
    },
  ],
};

const howToSchema = calculatorHowTo({
  name: "How to Calculate Take-Home Pay in Victoria",
  url: URL,
  description: "Calculate your take-home pay in Victoria in under a minute.",
  steps: PAY_CALCULATOR_STEPS,
});

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webAppSchema, faq, ORGANIZATION_SCHEMA, howToSchema]} />
      <PayCalculatorVICPage />
    </>
  );
}
