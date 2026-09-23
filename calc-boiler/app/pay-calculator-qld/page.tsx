import type { Metadata } from "next";
import PayCalculatorQLDPage from "@/modules/state/pay-calculator-qld";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, WebApplication, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { faqPageSchema } from "@/lib/faq";
import { QLD_FAQS } from "@/modules/state/pay-calculator-qld-faqs";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/pay-calculator-qld/`;

export const metadata: Metadata = {
  title: "Pay Calculator QLD — Your Take-Home Pay in Queensland",
  description:
    "Work out your take-home pay in Queensland. A free salary and wage calculator on current ATO rates, plus QLD public holidays, penalty rates and long service leave.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Pay Calculator QLD — Your Take-Home Pay in Queensland",
    description: "See what you actually take home in Queensland after income tax, the Medicare levy and HECS-HELP.",
    url: URL,
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: "en_AU",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pay Calculator QLD",
    description: "Your take-home pay in Queensland, plus QLD holidays and long service leave.",
  },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Pay Calculator QLD", item: URL },
  ],
};

const webAppSchema: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Pay Calculator QLD",
  url: URL,
  description: "Take-home pay calculator for employees in Queensland, Australia.",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
  creator: { "@type": "Organization", name: SITE_CONFIG.name },
  dateModified: new Date().toISOString().split("T")[0],
  inLanguage: "en-AU",
};

const faq = faqPageSchema(QLD_FAQS);

const howToSchema = calculatorHowTo({
  name: "How to Calculate Take-Home Pay in Queensland",
  url: URL,
  description: "Calculate your take-home pay in Queensland in under a minute.",
  steps: PAY_CALCULATOR_STEPS,
});

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webAppSchema, faq, ORGANIZATION_SCHEMA, howToSchema]} />
      <PayCalculatorQLDPage />
    </>
  );
}
