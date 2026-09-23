import type { Metadata } from "next";
import PayCalculatorACTPage from "@/modules/state/pay-calculator-act";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, WebApplication, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { faqPageSchema } from "@/lib/faq";
import { ACT_FAQS } from "@/modules/state/pay-calculator-act-faqs";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";
import { pageDateModified } from "@/lib/page-dates";
import { withPageEnd } from "@/components/common/content-slots";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/pay-calculator-act/`;

export const metadata: Metadata = {
  title: "Pay Calculator ACT — Your Take-Home Pay in Canberra",
  description:
    "Work out your take-home pay in the ACT. A free salary and wage calculator on current ATO rates, plus Canberra Day, Reconciliation Day and 7-year long service leave.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Pay Calculator ACT — Your Take-Home Pay in Canberra",
    description: "See what you actually take home in the ACT after income tax, the Medicare levy and HECS-HELP.",
    url: URL,
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: "en_AU",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pay Calculator ACT",
    description: "Your take-home pay in Canberra, plus ACT holidays and long service leave.",
  },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Pay Calculator ACT", item: URL },
  ],
};

const webAppSchema: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Pay Calculator ACT",
  url: URL,
  description: "Take-home pay calculator for employees in the Australian Capital Territory.",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
  creator: { "@type": "Organization", name: SITE_CONFIG.name },
  dateModified: pageDateModified("pay-calculator-act"),
  inLanguage: "en-AU",
};

const faq = faqPageSchema(ACT_FAQS);

const howToSchema = calculatorHowTo({
  name: "How to Calculate Take-Home Pay in the ACT",
  url: URL,
  description: "Calculate your take-home pay in the ACT in under a minute.",
  steps: PAY_CALCULATOR_STEPS,
});

function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webAppSchema, faq, ORGANIZATION_SCHEMA, howToSchema]} />
      <PayCalculatorACTPage />
    </>
  );
}

export default withPageEnd(Page, "/pay-calculator-act/");
