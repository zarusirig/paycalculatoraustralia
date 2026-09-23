import type { Metadata } from "next";
import PayRiseCalculatorPage from "@/modules/calculator/pay-rise-calculator";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import { calculatePayBreakdown, formatAUD, SITE_CONFIG, SUPER_GUARANTEE } from "@/lib/constants";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/pay-rise-calculator/`;

const FY = SITE_CONFIG.financialYear;
// Answer-first figure from the tax engine at build time.
const RAISE_10K_ON_80K =
  calculatePayBreakdown({ grossSalary: 90_000 }).takeHomePay - calculatePayBreakdown({ grossSalary: 80_000 }).takeHomePay;

// 12.5k impr, 1.4% CTR (pos 5.2). GSC: "payrise calculator", "pay rise
// calculator", "pay increase calculator australia"; DataForSEO: "salary
// increase calculator", "wage increase calculator" (720/mo each). Title adds
// "Australia" and the FY; description leads with a computed answer.
// Previous: "Pay Rise Calculator — How Much Extra Will You Take Home?".
const TITLE = `Pay Rise Calculator Australia ${FY}: Extra Take-Home Pay`;
const DESCRIPTION = `A $10,000 pay rise on $80,000 adds ${formatAUD(RAISE_10K_ON_80K)} a year after tax in ${FY} (${formatAUD(RAISE_10K_ON_80K / 52)} a week). Work out what any salary increase or percentage raise really adds to your pay.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: "en_AU",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
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
        text: `Yes. Under the Superannuation Guarantee, your employer must pay ${Math.round(SUPER_GUARANTEE.rate * 100)}% super on your qualifying earnings. So a $10,000 pay rise also means an extra ${formatAUD(10_000 * SUPER_GUARANTEE.rate)} deposited into your super fund.`,
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
