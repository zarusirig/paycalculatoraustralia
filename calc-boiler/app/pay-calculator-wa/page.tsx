import type { Metadata } from "next";
import PayCalculatorWAPage from "@/modules/state/pay-calculator-wa";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/pay-calculator-wa/`;

export const metadata: Metadata = {
  title: "Pay Calculator WA — Your Take-Home Pay in Western Australia",
  description:
    "Work out your take-home pay in WA. A free salary and wage calculator on current ATO rates, plus WA public holidays, the state award system and long service leave.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Pay Calculator WA — Your Take-Home Pay in Western Australia",
    description: "See what you actually take home in WA after income tax, the Medicare levy and HECS-HELP.",
    url: URL,
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: "en_AU",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pay Calculator WA",
    description: "Your take-home pay in Western Australia, plus WA holidays and long service leave.",
  },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Pay Calculator WA", item: URL },
  ],
};

const webAppSchema: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Pay Calculator WA",
  url: URL,
  description: "Take-home pay calculator for employees in Western Australia.",
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
      name: "Is income tax different in WA compared to other states?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Personal income tax in Australia is levied by the federal government through the ATO. The income tax brackets, Medicare levy and HECS-HELP repayment thresholds are identical in Western Australia and every other state and territory.",
      },
    },
    {
      "@type": "Question",
      name: "Am I covered by WA state awards or federal awards?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It depends on your employer's legal structure, not on where you live. Employees of incorporated companies are in the national system and covered by federal modern awards. Employees of sole traders, unincorporated partnerships and other non-constitutional employers in WA are covered by the WA state system, with its own awards and its own state minimum wage.",
      },
    },
    {
      "@type": "Question",
      name: "Why is the King's Birthday in September in WA?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Western Australia sets its own public holiday dates. It observes the King's Birthday in late September rather than the June date used in NSW, Victoria, SA, Tasmania and the NT, and holds Labour Day in early March. Some regional areas in WA hold the King's Birthday on a different date again.",
      },
    },
    {
      "@type": "Question",
      name: "When do I get long service leave in WA?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Leave can be taken after 10 years of continuous employment, when 8.667 weeks has accrued under the Long Service Leave Act 1958, then a further 4.333 weeks every 5 years. Separately, after 7 years of continuous employment a payment may be owed when employment ends by resignation, dismissal, redundancy or death.",
      },
    },
    {
      "@type": "Question",
      name: "Do WA employees pay for WorkCover?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. WorkCover WA insurance premiums are entirely an employer expense. Premiums vary by industry risk classification, ranging from 0.5% of wages in low-risk office roles to over 7% in underground mining. These costs do not reduce your gross salary or take-home pay.",
      },
    },
  ],
};

const howToSchema = calculatorHowTo({
  name: "How to Calculate Take-Home Pay in Western Australia",
  url: URL,
  description: "Calculate your take-home pay in WA in under a minute.",
  steps: PAY_CALCULATOR_STEPS,
});

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webAppSchema, faq, ORGANIZATION_SCHEMA, howToSchema]} />
      <PayCalculatorWAPage />
    </>
  );
}
