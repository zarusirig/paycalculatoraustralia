import type { Metadata } from "next";
import PayCalculatorVICPage from "@/modules/state/pay-calculator-vic";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, WebApplication, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { faqPageSchema } from "@/lib/faq";
import { VIC_FAQS } from "@/modules/state/pay-calculator-vic-faqs";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/pay-calculator-vic/`;

export const metadata: Metadata = {
  title: "Pay Calculator VIC — Your Take-Home Pay in Victoria",
  description:
    "Work out your take-home pay in Victoria. A free salary and wage calculator on current ATO rates, plus Victorian public holidays, penalty rates and long service leave.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Pay Calculator VIC — Your Take-Home Pay in Victoria",
    description: "See what you actually take home in Victoria after income tax, the Medicare levy and HECS-HELP.",
    url: URL,
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: "en_AU",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pay Calculator VIC",
    description: "Your take-home pay in Victoria, plus VIC holidays and long service leave.",
  },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Pay Calculator VIC", item: URL },
  ],
};

const webAppSchema: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Pay Calculator VIC",
  url: URL,
  description: "Take-home pay calculator for employees in Victoria, Australia.",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
  creator: { "@type": "Organization", name: SITE_CONFIG.name },
  dateModified: new Date().toISOString().split("T")[0],
  inLanguage: "en-AU",
};

const faq = faqPageSchema(VIC_FAQS);

const howToSchema = calculatorHowTo({
  name: "How to Calculate Take-Home Pay in Victoria",
  url: URL,
  description: "Calculate your take-home pay in Victoria in under a minute.",
  steps: PAY_CALCULATOR_STEPS,
});

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webAppSchema, faq, ORGANIZATION_SCHEMA, howToSchema]} />
      <PayCalculatorVICPage />
    </>
  );
}
