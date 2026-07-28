import type { Metadata } from "next";
import FinalPayCalculatorPage from "@/modules/calculator/final-pay-calculator";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";

const BASE_URL = SITE_CONFIG.baseUrl;
const PAGE_URL = `${BASE_URL}/final-pay-calculator/`;

export const metadata: Metadata = {
  title: "Final Pay Calculator Australia — End of Employment Payout",
  description:
    "Calculate your final pay when leaving a job. See unused annual leave payout, notice period pay, long service leave, and tax on your final payment. Free Australian calculator.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Final Pay Calculator Australia — End of Employment Payout (2025-26)",
    description:
      "Calculate your final pay when leaving a job including leave payout, notice period pay, and estimated tax.",
    url: PAGE_URL,
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: "en_AU",
  },
  twitter: {
    card: "summary_large_image",
    title: "Final Pay Calculator Australia — End of Employment Payout (2025-26)",
    description: "Calculate your final pay including leave payout, notice period, and tax on termination.",
  },
};

const breadcrumbSchema: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE_URL },
    { "@type": "ListItem", position: 2, name: "Final Pay Calculator", item: PAGE_URL },
  ],
};

const webAppSchema: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Final Pay Calculator Australia 2025-26",
  url: PAGE_URL,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
  creator: { "@type": "Organization", name: SITE_CONFIG.name },
  dateModified: new Date().toISOString().split("T")[0],
  inLanguage: "en-AU",
};

const faqSchema: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "When must my employer pay my final pay?",
      acceptedAnswer: { "@type": "Answer", text: "Under the Fair Work Act, your employer must pay your final pay within 7 days of your employment ending or on the next scheduled pay day, whichever comes first. This includes outstanding wages, accrued leave, and any notice period pay." },
    },
    {
      "@type": "Question",
      name: "Is leave loading included in my final pay?",
      acceptedAnswer: { "@type": "Answer", text: "Yes, if your award or agreement provides for annual leave loading (typically 17.5%), it must be paid on your unused annual leave balance when employment ends." },
    },
    {
      "@type": "Question",
      name: "Do I get long service leave in my final pay?",
      acceptedAnswer: { "@type": "Answer", text: "Long service leave entitlements vary by state. In most states, you become eligible after 7-10 years of continuous service. Some states provide a pro-rata entitlement if you are terminated after 5-7 years." },
    },
    {
      "@type": "Question",
      name: "How is my final pay taxed?",
      acceptedAnswer: { "@type": "Answer", text: "Outstanding wages and notice period pay are taxed at your normal marginal rate. Unused annual leave is taxed at your marginal rate (or a maximum of 32% for pre-August 1993 leave). Long service leave has separate concessional tax treatment depending on when it accrued." },
    },
  ],
};

const howToSchema = calculatorHowTo({
  name: "How to Use the Final Pay Calculator",
  url: PAGE_URL,
  description: "Calculate your final pay entitlements when leaving a job in Australia.",
  steps: PAY_CALCULATOR_STEPS,
});

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumbSchema, webAppSchema, faqSchema, ORGANIZATION_SCHEMA, howToSchema]} />
      <FinalPayCalculatorPage />
    </>
  );
}
