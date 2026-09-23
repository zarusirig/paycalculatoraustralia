import type { Metadata } from "next";
import OvertimePayCalculatorPage from "@/modules/calculator/overtime-pay-calculator";
import OvertimePayCalculatorContent from "@/modules/calculator/overtime-pay-calculator-content";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, WebApplication, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";
import { pageDateModified } from "@/lib/page-dates";
import { faqPageSchema } from "@/lib/faq";
import { OVERTIME_PAY_FAQS } from "@/modules/calculator/overtime-pay-calculator-faqs";
import { withPageEnd } from "@/components/common/content-slots";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/overtime-pay-calculator/`;

export const metadata: Metadata = {
  title: "Overtime Pay Calculator — Time-and-a-Half & Double Time",
  description:
    "Calculate your overtime and penalty rate pay. Enter your base rate, select the multiplier — see your overtime pay after tax. Free penalty rate calculator.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Overtime & Penalty Rate Calculator",
    description: "Calculate time-and-a-half, double-time and public holiday pay instantly.",
    url: URL,
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: "en_AU",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Overtime & Penalty Rate Calculator",
    description: "Calculate your overtime pay after tax.",
  },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Overtime Pay Calculator", item: URL },
  ],
};

const webApp: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Overtime & Penalty Rate Calculator",
  url: URL,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
  creator: { "@type": "Organization", name: SITE_CONFIG.name },
  dateModified: pageDateModified("overtime-pay-calculator"),
  inLanguage: "en-AU",
};

const faq = faqPageSchema(OVERTIME_PAY_FAQS);

const howToSchema = calculatorHowTo({
  name: "How to Use the Overtime Pay Calculator",
  url: URL,
  description: "Calculate your overtime and penalty rate pay in under a minute.",
  steps: PAY_CALCULATOR_STEPS,
});

function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webApp, faq, ORGANIZATION_SCHEMA, howToSchema]} />
      <OvertimePayCalculatorPage>
        <OvertimePayCalculatorContent />
      </OvertimePayCalculatorPage>
    </>
  );
}

export default withPageEnd(Page, "/overtime-pay-calculator/");
