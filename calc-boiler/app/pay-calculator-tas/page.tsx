import type { Metadata } from "next";
import PayCalculatorTASPage from "@/modules/state/pay-calculator-tas";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/pay-calculator-tas/`;

export const metadata: Metadata = {
  title: "Pay Calculator TAS — Your Take-Home Pay in Tasmania",
  description:
    "Work out your take-home pay in Tasmania. A free salary and wage calculator on current ATO rates, plus Tasmanian public holidays by region and long service leave.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Pay Calculator TAS — Your Take-Home Pay in Tasmania",
    description: "See what you actually take home in Tasmania after income tax, the Medicare levy and HECS-HELP.",
    url: URL,
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: "en_AU",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pay Calculator TAS",
    description: "Your take-home pay in Tasmania, plus TAS holidays and long service leave.",
  },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Pay Calculator TAS", item: URL },
  ],
};

const webAppSchema: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Pay Calculator TAS",
  url: URL,
  description: "Take-home pay calculator for employees in Tasmania.",
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
      name: "Is income tax different in Tasmania?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Income tax, the Medicare levy and HECS-HELP repayment thresholds are set federally by the ATO and are identical in Tasmania, on the mainland, and in both territories. There is no Tasmanian income tax.",
      },
    },
    {
      "@type": "Question",
      name: "Do I get Royal Hobart Regatta or Recreation Day?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "One or the other, depending on where in Tasmania you work. The Regatta in February is observed in certain areas including Hobart; the areas that do not observe it get Recreation Day in early November instead. Both are Tasmanian-only public holidays.",
      },
    },
    {
      "@type": "Question",
      name: "What is Eight Hours Day?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Eight Hours Day, held on the second Monday in March, is Tasmania's version of Labour Day. It commemorates the campaign for the eight-hour working day and attracts the same public holiday entitlements as any other gazetted holiday.",
      },
    },
    {
      "@type": "Question",
      name: "When do I get long service leave in Tasmania?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Private sector employees get 8⅔ weeks after 10 years of continuous employment under the Long Service Leave Act 1976, then 4⅓ weeks every further 5 years. A pro-rata payment may be owed on termination once you have completed 7 but fewer than 10 years.",
      },
    },
  ],
};

const howToSchema = calculatorHowTo({
  name: "How to Calculate Take-Home Pay in Tasmania",
  url: URL,
  description: "Calculate your take-home pay in Tasmania in under a minute.",
  steps: PAY_CALCULATOR_STEPS,
});

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webAppSchema, faq, ORGANIZATION_SCHEMA, howToSchema]} />
      <PayCalculatorTASPage />
    </>
  );
}
