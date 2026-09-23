import type { Metadata } from "next";
import PayCalculatorSAPage from "@/modules/state/pay-calculator-sa";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, WebApplication, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { faqPageSchema } from "@/lib/faq";
import { SA_FAQS } from "@/modules/state/pay-calculator-sa-faqs";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";
import { pageDateModified } from "@/lib/page-dates";
import { withPageEnd } from "@/components/common/content-slots";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/pay-calculator-sa/`;

export const metadata: Metadata = {
  title: "Pay Calculator SA — Your Take-Home Pay in South Australia",
  description:
    "Work out your take-home pay in South Australia. A free salary and wage calculator on current ATO rates, plus SA public holidays, part-days and long service leave.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Pay Calculator SA — Your Take-Home Pay in South Australia",
    description: "See what you actually take home in SA after income tax, the Medicare levy and HECS-HELP.",
    url: URL,
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: "en_AU",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pay Calculator SA",
    description: "Your take-home pay in South Australia, plus SA holidays and long service leave.",
  },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Pay Calculator SA", item: URL },
  ],
};

const webAppSchema: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Pay Calculator SA",
  url: URL,
  description: "Take-home pay calculator for employees in South Australia.",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
  creator: { "@type": "Organization", name: SITE_CONFIG.name },
  dateModified: pageDateModified("pay-calculator-sa"),
  inLanguage: "en-AU",
};

const faq = faqPageSchema(SA_FAQS);

const howToSchema = calculatorHowTo({
  name: "How to Calculate Take-Home Pay in South Australia",
  url: URL,
  description: "Calculate your take-home pay in South Australia in under a minute.",
  steps: PAY_CALCULATOR_STEPS,
});

function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webAppSchema, faq, ORGANIZATION_SCHEMA, howToSchema]} />
      <PayCalculatorSAPage />
    </>
  );
}

export default withPageEnd(Page, "/pay-calculator-sa/");
