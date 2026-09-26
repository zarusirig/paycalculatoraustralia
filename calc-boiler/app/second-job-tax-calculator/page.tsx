import type { Metadata } from "next";
import SecondJobTaxCalculatorPage from "@/modules/calculator/second-job-tax-calculator";
import WhatsNextInline from "@/components/common/whats-next-inline";
import SecondJobTaxCalculatorContent from "@/modules/calculator/second-job-tax-calculator-content";
import { faqPageSchema } from "@/lib/faq";
import { SECOND_JOB_FAQS } from "@/modules/calculator/second-job-tax-calculator-faqs";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, WebApplication, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";

import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";
import { pageDateModified } from "@/lib/page-dates";
import { withPageEnd } from "@/components/common/content-slots";

const BASE_URL = SITE_CONFIG.baseUrl;
const PAGE_URL = `${BASE_URL}/second-job-tax-calculator/`;

export const metadata: Metadata = {
  title: "Second Job Tax Calculator Australia — Tax on Two Jobs",
  description:
    "Calculate how much tax you pay on a second job in Australia: why it's taxed higher, PAYG withholding without the tax-free threshold, and combined take-home pay.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Second Job Tax Calculator Australia — Tax on Two Jobs (2026-27)",
    description:
      "Calculate how much tax you pay on a second job in Australia. See PAYG withholding without the tax-free threshold and your combined take-home pay.",
    url: PAGE_URL,
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: "en_AU",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Second Job Tax Calculator Australia — Tax on Two Jobs (2026-27)",
    description: "Calculate tax on a second job including PAYG withholding and combined take-home pay.",
  },
};

const breadcrumbSchema: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE_URL },
    { "@type": "ListItem", position: 2, name: "Second Job Tax Calculator", item: PAGE_URL },
  ],
};

const webAppSchema: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Second Job Tax Calculator Australia 2026-27",
  url: PAGE_URL,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
  creator: { "@type": "Organization", name: SITE_CONFIG.name },
  dateModified: pageDateModified("second-job-tax-calculator"),
  inLanguage: "en-AU",
};

const faqSchema = faqPageSchema(SECOND_JOB_FAQS);

const howToSchema = calculatorHowTo({
  name: "How to Use the Second Job Tax Calculator",
  url: PAGE_URL,
  description: "Calculate the tax impact of working two jobs in Australia.",
  steps: PAY_CALCULATOR_STEPS,
});

function Page() {
  return (
    <>
      <JsonLd code={[breadcrumbSchema, webAppSchema, faqSchema, ORGANIZATION_SCHEMA, howToSchema]} />
      <SecondJobTaxCalculatorPage afterCalculator={<WhatsNextInline route="/second-job-tax-calculator/" />}>
        <SecondJobTaxCalculatorContent />
      </SecondJobTaxCalculatorPage>
    </>
  );
}

export default withPageEnd(Page, "/second-job-tax-calculator/");
