import type { Metadata } from "next";
import PayCalculatorNSWPage from "@/modules/state/pay-calculator-nsw";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/pay-calculator-nsw/`;

export const metadata: Metadata = {
  title: "Pay Calculator NSW — Your Take-Home Pay in New South Wales",
  description:
    "Work out your take-home pay in NSW. A free salary and wage calculator on current ATO rates, plus NSW public holidays, penalty rates and long service leave.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Pay Calculator NSW — Your Take-Home Pay in New South Wales",
    description: "See what you actually take home in NSW after income tax, the Medicare levy and HECS-HELP.",
    url: URL,
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: "en_AU",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pay Calculator NSW",
    description: "Your take-home pay in New South Wales, plus NSW holidays and long service leave.",
  },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Pay Calculator NSW", item: URL },
  ],
};

const webAppSchema: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Pay Calculator NSW",
  url: URL,
  description: "Take-home pay calculator for employees in New South Wales, Australia.",
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
      name: "Is income tax different in NSW compared to other states?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Income tax in Australia is levied by the federal government through the ATO. The tax brackets, Medicare levy and HECS-HELP repayment rates are exactly the same in NSW as in every other state and territory. There is no state-level income tax anywhere in Australia.",
      },
    },
    {
      "@type": "Question",
      name: "How many public holidays does NSW have?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Thirteen state-wide public holidays in 2026, the fewest of any state or territory. NSW adds a day when Anzac Day and Boxing Day fall on a weekend but has no equivalent of Melbourne Cup Day, Canberra Day or the Royal Queensland Show. Regional show days are declared locally.",
      },
    },
    {
      "@type": "Question",
      name: "When do I get long service leave in NSW?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "After 10 years of continuous service with the same employer you are entitled to 8.67 weeks — two months — of paid long service leave under the Long Service Leave Act 1955, then 4.33 weeks for each further 5 years. Between 5 and 10 years a pro-rata payment is only owed in defined circumstances.",
      },
    },
    {
      "@type": "Question",
      name: "Do employees pay payroll tax or workers compensation premiums?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Both payroll tax and workers compensation (iCare in NSW) are employer expenses. These costs do not appear on your payslip and do not reduce your gross salary or take-home pay.",
      },
    },
  ],
};

const howToSchema = calculatorHowTo({
  name: "How to Calculate Take-Home Pay in New South Wales",
  url: URL,
  description: "Calculate your take-home pay in NSW in under a minute.",
  steps: PAY_CALCULATOR_STEPS,
});

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webAppSchema, faq, ORGANIZATION_SCHEMA, howToSchema]} />
      <PayCalculatorNSWPage />
    </>
  );
}
