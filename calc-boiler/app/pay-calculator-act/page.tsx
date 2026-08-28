import type { Metadata } from "next";
import PayCalculatorACTPage from "@/modules/state/pay-calculator-act";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/pay-calculator-act/`;

export const metadata: Metadata = {
  title: "Pay Calculator ACT — Your Take-Home Pay in Canberra",
  description:
    "Work out your take-home pay in the ACT. A free salary and wage calculator on current ATO rates, plus Canberra Day, Reconciliation Day and 7-year long service leave.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Pay Calculator ACT — Your Take-Home Pay in Canberra",
    description: "See what you actually take home in the ACT after income tax, the Medicare levy and HECS-HELP.",
    url: URL,
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: "en_AU",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pay Calculator ACT",
    description: "Your take-home pay in Canberra, plus ACT holidays and long service leave.",
  },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Pay Calculator ACT", item: URL },
  ],
};

const webAppSchema: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Pay Calculator ACT",
  url: URL,
  description: "Take-home pay calculator for employees in the Australian Capital Territory.",
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
      name: "Is income tax different in the ACT?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Income tax, the Medicare levy and HECS-HELP obligations are set by the ATO at the federal level and do not change based on your address. Cross-border commuters from Queanbeyan, Yass or Bungendore pay the same tax as Canberra residents.",
      },
    },
    {
      "@type": "Question",
      name: "Which public holidays are unique to the ACT?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Canberra Day, held on the second Monday in March, and Reconciliation Day, held on the first Monday on or after 27 May. Neither is observed in NSW, so a worker based in Canberra gets two penalty-rate days a Queanbeyan colleague does not.",
      },
    },
    {
      "@type": "Question",
      name: "When do I get long service leave in the ACT?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "After 7 years of continuous service you are entitled to 6.0667 weeks of paid leave under the Long Service Leave Act 1976, plus a further fifth of a month for each subsequent year. A pro-rata payment can be owed from 5 years in defined circumstances.",
      },
    },
    {
      "@type": "Question",
      name: "Does 15.4% APS super change my take-home pay?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Superannuation is paid on top of your salary, not deducted from it, so a higher scheme rate raises your total package without changing your net pay. Federal public servants under PSSap receive 15.4% against the standard 12% guarantee.",
      },
    },
  ],
};

const howToSchema = calculatorHowTo({
  name: "How to Calculate Take-Home Pay in the ACT",
  url: URL,
  description: "Calculate your take-home pay in the ACT in under a minute.",
  steps: PAY_CALCULATOR_STEPS,
});

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webAppSchema, faq, ORGANIZATION_SCHEMA, howToSchema]} />
      <PayCalculatorACTPage />
    </>
  );
}
