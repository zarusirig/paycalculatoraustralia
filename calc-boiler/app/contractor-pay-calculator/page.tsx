import ContractorPayCalculator from "@/modules/calculator/contractor-pay-calculator";
import WhatsNextInline from "@/components/common/whats-next-inline";
import ContractorPayCalculatorContent from "@/modules/calculator/contractor-pay-calculator-content";
import { JsonLd } from "@/modules/seo/json-ld";
import type {
  BreadcrumbList,
  WebApplication,
  WithContext,
} from "schema-dts";
import { faqPageSchema } from "@/lib/faq";
import { CONTRACTOR_PAY_FAQS } from "@/modules/calculator/contractor-pay-calculator-faqs";
import { SITE_CONFIG, SUPER_GUARANTEE, formatAUD, formatPercent } from "@/lib/constants";

import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";
import type { Metadata } from "next";
import { pageDateModified } from "@/lib/page-dates";
import { withPageEnd } from "@/components/common/content-slots";
import { withFeaturedImage } from "@/lib/featured-image";

// Meta pass 23 Oct 2026: GSC queries are "abn to wages calculator" (pos 9.3),
// "abn to tfn calculator", "abn calculator"; the old title never said ABN.
// The description leads with the page's own worked example ($50/h, 38 h,
// 48 weeks = the $91,200 gross in the comparison table).
// Previous title: "Contractor Pay Calculator Australia - Your Real Take-Home".
const FY = SITE_CONFIG.financialYear;
const TITLE = "Contractor Pay Calculator Australia: ABN to Wages After Tax";
const DESCRIPTION = `An ABN rate of $50 an hour for 38 hours over 48 weeks is ${formatAUD(50 * 38 * 48)} gross. See take-home after tax, ${formatPercent(SUPER_GUARANTEE.rate, 0)} super and GST, compared with PAYG wages in ${FY}.`;

export const metadata: Metadata = withFeaturedImage({
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: `${SITE_CONFIG.baseUrl}/contractor-pay-calculator/`,
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.baseUrl}/contractor-pay-calculator/`,
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: "en_AU",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contractor Pay Calculator Australia",
    description: "See your real take-home as a contractor in Australia.",
  },
});

const webAppSchema: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Contractor Pay Calculator Australia",
  url: `${SITE_CONFIG.baseUrl}/contractor-pay-calculator/`,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "AUD",
  },
  creator: {
    "@type": "Organization",
    name: SITE_CONFIG.name,
  },
  dateModified: pageDateModified("contractor-pay-calculator"),
  inLanguage: "en-AU",
};

const breadcrumbSchema: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Pay Calculator",
      item: SITE_CONFIG.baseUrl,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Contractor Pay Calculator",
      item: `${SITE_CONFIG.baseUrl}/contractor-pay-calculator/`,
    },
  ],
};

const faqSchema = faqPageSchema(CONTRACTOR_PAY_FAQS);

const howToSchema = calculatorHowTo({
  name: "How to Use the Contractor Pay Calculator",
  url: `${SITE_CONFIG.baseUrl}/contractor-pay-calculator/`,
  description: "Calculate your contractor take-home pay after tax and GST in under a minute.",
  steps: PAY_CALCULATOR_STEPS,
});

function ContractorPayCalculatorPage() {
  return (
    <>
      <JsonLd
        code={[webAppSchema, breadcrumbSchema, faqSchema, ORGANIZATION_SCHEMA, howToSchema]}
      />
      <ContractorPayCalculator afterCalculator={<WhatsNextInline route="/contractor-pay-calculator/" />}>
        <ContractorPayCalculatorContent />
      </ContractorPayCalculator>
    </>
  );
}

export default withPageEnd(ContractorPayCalculatorPage, "/contractor-pay-calculator/");
