import type { Metadata } from "next";
import PayCalculatorWAPage from "@/modules/state/pay-calculator-wa";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, WebApplication, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { faqPageSchema } from "@/lib/faq";
import { WA_FAQS } from "@/modules/state/pay-calculator-wa-faqs";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";
import { pageDateModified } from "@/lib/page-dates";
import { withPageEnd } from "@/components/common/content-slots";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/pay-calculator-wa/`;

export const metadata: Metadata = {
  title: "Pay Calculator WA — Your Take-Home Pay in Western Australia",
  description:
    "Work out your take-home pay in WA. A free salary and wage calculator on current ATO rates, plus WA public holidays, the state award system and long service leave.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Pay Calculator WA — Your Take-Home Pay in Western Australia",
    description: "See what you actually take home in WA after income tax, the Medicare levy and HECS-HELP.",
    url: URL,
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: "en_AU",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pay Calculator WA",
    description: "Your take-home pay in Western Australia, plus WA holidays and long service leave.",
  },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Pay Calculator WA", item: URL },
  ],
};

const webAppSchema: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Pay Calculator WA",
  url: URL,
  description: "Take-home pay calculator for employees in Western Australia.",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
  creator: { "@type": "Organization", name: SITE_CONFIG.name },
  dateModified: pageDateModified("pay-calculator-wa"),
  inLanguage: "en-AU",
};

const faq = faqPageSchema(WA_FAQS);

const howToSchema = calculatorHowTo({
  name: "How to Calculate Take-Home Pay in Western Australia",
  url: URL,
  description: "Calculate your take-home pay in WA in under a minute.",
  steps: PAY_CALCULATOR_STEPS,
});

function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webAppSchema, faq, ORGANIZATION_SCHEMA, howToSchema]} />
      <PayCalculatorWAPage />
    </>
  );
}

export default withPageEnd(Page, "/pay-calculator-wa/");
