import type { Metadata } from "next";
import PayRiseCalculatorPage from "@/modules/calculator/pay-rise-calculator";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/pay-rise-calculator/`;

export const metadata: Metadata = {
  title: "Pay Rise Calculator — How Much Extra Will You Take Home?",
  description:
    "Enter your current & new salary to see exactly how much extra you take home after tax. See the marginal rate impact on your pay rise for FY2025-26.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Pay Rise Calculator — How Much Extra Will You Take Home?",
    description: "Calculate your new take-home pay after a pay rise and see exactly how much goes to tax.",
    url: URL,
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: "en_AU",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pay Rise Calculator Australia",
    description: "Calculate your take-home pay increase after tax and Medicare.",
  },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Pay Rise Calculator", item: URL },
  ],
};

const webApp: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Pay Rise Calculator Australia",
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
      name: "Why is my pay rise taxed so highly?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Your pay rise is taxed at your \"marginal tax rate\", which is the highest tax bracket your income falls into. This is often much higher than your average tax rate, meaning a larger percentage of your extra pay goes to the ATO.",
      },
    },
    {
      "@type": "Question",
      name: "Does my employer pay extra super on my pay rise?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Under the Superannuation Guarantee, your employer must pay 12% super on your ordinary time earnings. So a $10,000 pay rise also means an extra $1,200 deposited into your super fund.",
      },
    },
    {
      "@type": "Question",
      name: "Can a pay rise push me into a higher tax bracket and leave me worse off?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No! Only the portion of your income above the threshold is taxed at the higher rate. You will never end up with less take-home pay simply because a pay rise pushed you into a new tax bracket.",
      },
    },
  ],
};

const howToSchema = calculatorHowTo({
  name: "How to Use the Pay Rise Calculator",
  url: URL,
  description: "Calculate how much extra you take home after a pay rise in under a minute.",
  steps: PAY_CALCULATOR_STEPS,
});

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webApp, faq, ORGANIZATION_SCHEMA, howToSchema]} />
      <PayRiseCalculatorPage />
    </>
  );
}
