import type { Metadata } from "next";
import RedundancyPayCalculatorPage from "@/modules/calculator/redundancy-pay-calculator";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/redundancy-pay-calculator/`;

export const metadata: Metadata = {
  title: "Redundancy Pay Calculator Australia — Entitlements & Tax",
  description:
    "Calculate your redundancy pay based on years of service. See tax-free components, ETP tax rates & total payout. Free Australian redundancy calculator.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Redundancy Pay Calculator Australia",
    description: "Calculate your NES redundancy entitlements, tax-free components, and total take-home payout.",
    url: URL,
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: "en_AU",
  },
  twitter: {
    card: "summary_large_image",
    title: "Redundancy Pay Calculator Australia",
    description: "Calculate your redundancy payout and tax-free limits instantly.",
  },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Redundancy Pay Calculator", item: URL },
  ],
};

const webApp: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Redundancy Pay Calculator Australia",
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
      name: "How much redundancy pay am I entitled to?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Under the National Employment Standards (NES), redundancy pay ranges from 4 weeks for 1 year of service, up to 16 weeks for 9 years of service. It drops to 12 weeks after 10 years because long service leave entitlements kick in.",
      },
    },
    {
      "@type": "Question",
      name: "Is redundancy pay tax-free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A portion of a genuine redundancy payment is tax-free. The limit is comprised of a base amount plus a service amount for each completed year of service. Any amount above this limit is taxed as an Employment Termination Payment (ETP) at concessional rates.",
      },
    },
    {
      "@type": "Question",
      name: "What makes a redundancy 'genuine'?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A redundancy is genuine if your employer no longer needs your job to be done by anyone, and they followed any consultation requirements in your award. If you were dismissed for performance or if they hire someone else to do your exact job, it is not a genuine redundancy.",
      },
    },
    { "@type": "Question", name: "What is a genuine redundancy in Australia?", acceptedAnswer: { "@type": "Answer", text: "A genuine redundancy happens when your employer's business no longer requires anyone to do your job because of changes in operational requirements, AND they have actively consulted you and tried to redeploy you elsewhere within the business first." } },
    { "@type": "Question", name: "Is my redundancy payout tax-free?", acceptedAnswer: { "@type": "Answer", text: "It is partially tax-free. If it is a genuine redundancy, the ATO provides a 'tax-free base limit' of $12,524, plus an extra $6,263 for every complete year of service you have with the company. Any amount paid above this threshold is taxed heavily as an ETP." } },
  ],
};

const howToSchema = calculatorHowTo({
  name: "How to Use the Redundancy Pay Calculator",
  url: URL,
  description: "Calculate your redundancy pay entitlements and tax in under a minute.",
  steps: PAY_CALCULATOR_STEPS,
});

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webApp, faq, ORGANIZATION_SCHEMA, howToSchema]} />
      <RedundancyPayCalculatorPage />
    </>
  );
}
