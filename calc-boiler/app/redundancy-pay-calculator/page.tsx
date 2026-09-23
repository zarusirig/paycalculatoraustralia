import type { Metadata } from "next";
import RedundancyPayCalculatorPage from "@/modules/calculator/redundancy-pay-calculator";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import { SITE_CONFIG, formatAUD } from "@/lib/constants";
import { REDUNDANCY_TAX } from "@/lib/constants/redundancy";
import { REDUNDANCY_FAQS } from "@/modules/calculator/redundancy-pay-faqs";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/redundancy-pay-calculator/`;

const Y = REDUNDANCY_TAX.incomeYear;
const TITLE = `Redundancy Pay Calculator ${Y} — NES Table & Tax-Free Limit`;
const DESCRIPTION = `Free Australian redundancy calculator: NES redundancy pay table (4 to 16 weeks by years of service), the ${Y} tax-free limit of ${formatAUD(REDUNDANCY_TAX.taxFreeBase)} + ${formatAUD(REDUNDANCY_TAX.taxFreePerYear)} per year, ETP tax and a worked example. Same rules in QLD, NSW, VIC and WA.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: `Redundancy Pay Calculator Australia ${Y}`,
    description: `NES redundancy pay by years of service, the ${Y} tax-free limit and your take-home payout.`,
    url: URL,
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: "en_AU",
  },
  twitter: {
    card: "summary_large_image",
    title: `Redundancy Pay Calculator Australia ${Y}`,
    description: `NES table, ${Y} tax-free limit and ETP tax in one calculator.`,
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
  name: `Redundancy Pay Calculator Australia ${Y}`,
  url: URL,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
  creator: { "@type": "Organization", name: SITE_CONFIG.name },
  dateModified: new Date().toISOString().split("T")[0],
  inLanguage: "en-AU",
};

// Built from the same array the on-page accordion renders.
const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: REDUNDANCY_FAQS.map((f) => ({
    "@type": "Question" as const,
    name: f.q,
    acceptedAnswer: { "@type": "Answer" as const, text: f.a },
  })),
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
      <RedundancyPayCalculatorPage faqs={REDUNDANCY_FAQS} />
    </>
  );
}
