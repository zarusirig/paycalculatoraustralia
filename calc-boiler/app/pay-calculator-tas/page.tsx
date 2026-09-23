import type { Metadata } from "next";
import PayCalculatorTASPage from "@/modules/state/pay-calculator-tas";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, WebApplication, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { faqPageSchema } from "@/lib/faq";
import { TAS_FAQS } from "@/modules/state/pay-calculator-tas-faqs";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";
import { pageDateModified } from "@/lib/page-dates";
import { withPageEnd } from "@/components/common/content-slots";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/pay-calculator-tas/`;

export const metadata: Metadata = {
  title: "Pay Calculator TAS — Your Take-Home Pay in Tasmania",
  description:
    "Work out your take-home pay in Tasmania. A free salary and wage calculator on current ATO rates, plus Tasmanian public holidays by region and long service leave.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Pay Calculator TAS — Your Take-Home Pay in Tasmania",
    description: "See what you actually take home in Tasmania after income tax, the Medicare levy and HECS-HELP.",
    url: URL,
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: "en_AU",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pay Calculator TAS",
    description: "Your take-home pay in Tasmania, plus TAS holidays and long service leave.",
  },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Pay Calculator TAS", item: URL },
  ],
};

const webAppSchema: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Pay Calculator TAS",
  url: URL,
  description: "Take-home pay calculator for employees in Tasmania.",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
  creator: { "@type": "Organization", name: SITE_CONFIG.name },
  dateModified: pageDateModified("pay-calculator-tas"),
  inLanguage: "en-AU",
};

const faq = faqPageSchema(TAS_FAQS);

const howToSchema = calculatorHowTo({
  name: "How to Calculate Take-Home Pay in Tasmania",
  url: URL,
  description: "Calculate your take-home pay in Tasmania in under a minute.",
  steps: PAY_CALCULATOR_STEPS,
});

function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webAppSchema, faq, ORGANIZATION_SCHEMA, howToSchema]} />
      <PayCalculatorTASPage />
    </>
  );
}

export default withPageEnd(Page, "/pay-calculator-tas/");
