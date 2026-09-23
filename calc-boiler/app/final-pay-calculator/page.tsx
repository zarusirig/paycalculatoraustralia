import type { Metadata } from "next";
import FinalPayCalculatorPage from "@/modules/calculator/final-pay-calculator";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, WebApplication, WithContext } from "schema-dts";
import { faqPageSchema } from "@/lib/faq";
import { FINAL_PAY_FAQS } from "@/modules/calculator/final-pay-calculator-faqs";
import { SITE_CONFIG } from "@/lib/constants";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";
import { pageDateModified } from "@/lib/page-dates";

const BASE_URL = SITE_CONFIG.baseUrl;
const PAGE_URL = `${BASE_URL}/final-pay-calculator/`;

export const metadata: Metadata = {
  title: "Final Pay Calculator Australia — End of Employment Payout",
  description:
    "Calculate your final pay when leaving a job: unused annual leave payout, notice pay, long service leave and the tax on your final payment. Free calculator.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Final Pay Calculator Australia — End of Employment Payout (2026-27)",
    description:
      "Calculate your final pay when leaving a job including leave payout, notice period pay, and estimated tax.",
    url: PAGE_URL,
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: "en_AU",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Final Pay Calculator Australia — End of Employment Payout (2026-27)",
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
  name: "Final Pay Calculator Australia 2026-27",
  url: PAGE_URL,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
  creator: { "@type": "Organization", name: SITE_CONFIG.name },
  dateModified: pageDateModified("final-pay-calculator"),
  inLanguage: "en-AU",
};

const faqSchema = faqPageSchema(FINAL_PAY_FAQS);

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
