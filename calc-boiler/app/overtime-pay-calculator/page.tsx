import type { Metadata } from "next";
import OvertimePayCalculatorPage from "@/modules/calculator/overtime-pay-calculator";
import WhatsNextInline from "@/components/common/whats-next-inline";
import OvertimePayCalculatorContent from "@/modules/calculator/overtime-pay-calculator-content";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, WebApplication, WithContext } from "schema-dts";
import { EMPLOYMENT, SITE_CONFIG, formatAUD } from "@/lib/constants";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";
import { pageDateModified } from "@/lib/page-dates";
import { faqPageSchema } from "@/lib/faq";
import { OVERTIME_PAY_FAQS } from "@/modules/calculator/overtime-pay-calculator-faqs";
import { withPageEnd } from "@/components/common/content-slots";
import { withFeaturedImage } from "@/lib/featured-image";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/overtime-pay-calculator/`;

// Meta pass 23 Oct 2026: SERP for "double time and a half calculator" /
// "overtime pay calculator australia" titles say "Overtime (Pay) Calculator
// Australia" and "time and a half" unhyphenated, as searchers type it; ours had
// neither and a generic description (pos 7.6, CTR 0.5%). Description answers
// with the minimum-wage multiples the page's own rate table uses.
// Previous title: "Overtime Pay Calculator - Time-and-a-Half & Double Time".
const MIN = EMPLOYMENT.minimumWageHourly;
const TITLE = "Overtime Pay Calculator Australia: Time and a Half & Double Time";
const DESCRIPTION = `On the ${formatAUD(MIN, 2)} minimum wage, time and a half is ${formatAUD(MIN * 1.5, 2)} an hour, double time ${formatAUD(MIN * 2, 2)} and double time and a half ${formatAUD(MIN * 2.5, 2)}. Work out your overtime pay after tax.`;

export const metadata: Metadata = withFeaturedImage({
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: "en_AU",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: "Calculate your overtime pay after tax.",
  },
});

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
      <OvertimePayCalculatorPage afterCalculator={<WhatsNextInline route="/overtime-pay-calculator/" />}>
        <OvertimePayCalculatorContent />
      </OvertimePayCalculatorPage>
    </>
  );
}

export default withPageEnd(Page, "/overtime-pay-calculator/");
