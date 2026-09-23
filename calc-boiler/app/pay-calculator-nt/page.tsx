import type { Metadata } from "next";
import PayCalculatorNTPage from "@/modules/state/pay-calculator-nt";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, WebApplication, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { faqPageSchema } from "@/lib/faq";
import { NT_FAQS } from "@/modules/state/pay-calculator-nt-faqs";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";
import { pageDateModified } from "@/lib/page-dates";
import { withPageEnd } from "@/components/common/content-slots";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/pay-calculator-nt/`;

export const metadata: Metadata = {
  title: "Pay Calculator NT — Your Take-Home Pay in the Northern Territory",
  description:
    "Work out your take-home pay in the NT. A free salary and wage calculator on current ATO rates, plus the zone tax offset, Picnic Day and long service leave.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Pay Calculator NT — Your Take-Home Pay in the Northern Territory",
    description: "See what you actually take home in the NT after income tax, the Medicare levy and HECS-HELP.",
    url: URL,
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: "en_AU",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pay Calculator NT",
    description: "Your take-home pay in the Northern Territory, plus the zone tax offset and NT holidays.",
  },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Pay Calculator NT", item: URL },
  ],
};

const webAppSchema: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Pay Calculator NT",
  url: URL,
  description: "Take-home pay calculator for employees in the Northern Territory.",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
  creator: { "@type": "Organization", name: SITE_CONFIG.name },
  dateModified: pageDateModified("pay-calculator-nt"),
  inLanguage: "en-AU",
};

const faq = faqPageSchema(NT_FAQS);

const howToSchema = calculatorHowTo({
  name: "How to Calculate Take-Home Pay in the Northern Territory",
  url: URL,
  description: "Calculate your take-home pay in the NT in under a minute.",
  steps: PAY_CALCULATOR_STEPS,
});

function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webAppSchema, faq, ORGANIZATION_SCHEMA, howToSchema]} />
      <PayCalculatorNTPage />
    </>
  );
}

export default withPageEnd(Page, "/pay-calculator-nt/");
