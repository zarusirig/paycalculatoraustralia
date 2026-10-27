import type { Metadata } from "next";
import ContractorVsEmployeeCalculatorPage from "@/modules/calculator/contractor-vs-employee-calculator";
import WhatsNextInline from "@/components/common/whats-next-inline";
import ContractorVsEmployeeCalculatorContent from "@/modules/calculator/contractor-vs-employee-calculator-content";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, WebApplication, WithContext } from "schema-dts";
import { faqPageSchema } from "@/lib/faq";
import { CONTRACTOR_VS_EMPLOYEE_FAQS } from "@/modules/calculator/contractor-vs-employee-calculator-faqs";
import { SITE_CONFIG, SUPER_GUARANTEE, formatPercent } from "@/lib/constants";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";
import { pageDateModified } from "@/lib/page-dates";
import { withPageEnd } from "@/components/common/content-slots";
import { withFeaturedImage } from "@/lib/featured-image";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/contractor-vs-employee-calculator/`;

// Meta pass 23 Oct 2026: the SERP for "contractor vs employee calculator
// australia" (we rank ~10) is "Contractor vs Employee Calculator Australia
// 2026/27" style titles; ours had neither "Australia" nor the year.
// Previous title: "Contractor vs Employee Calculator - Compare Take-Home".
const TITLE = `Contractor vs Employee Calculator Australia ${SITE_CONFIG.financialYear}: Take-Home`;
const DESCRIPTION = `Compare take-home pay as an ABN contractor and a PAYG employee on the same gross at ${SITE_CONFIG.financialYear} rates: tax, Medicare, ${formatPercent(SUPER_GUARANTEE.rate, 0)} super, expenses and the leave you give up.`;

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
    title: "Contractor vs Employee Calculator Australia",
    description: "Are you better off as a contractor or employee? Compare take-home pay.",
  },
});

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Contractor vs Employee Calculator", item: URL },
  ],
};

const webApp: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Contractor vs Employee Calculator Australia",
  url: URL,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
  creator: { "@type": "Organization", name: SITE_CONFIG.name },
  dateModified: pageDateModified("contractor-vs-employee-calculator"),
  inLanguage: "en-AU",
};

const faq = faqPageSchema(CONTRACTOR_VS_EMPLOYEE_FAQS);

const howToSchema = calculatorHowTo({
  name: "How to Use the Contractor vs Employee Calculator",
  url: URL,
  description: "Compare your take-home pay as a contractor vs employee in under a minute.",
  steps: PAY_CALCULATOR_STEPS,
});

function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webApp, faq, ORGANIZATION_SCHEMA, howToSchema]} />
      <ContractorVsEmployeeCalculatorPage afterCalculator={<WhatsNextInline route="/contractor-vs-employee-calculator/" />}>
        <ContractorVsEmployeeCalculatorContent />
      </ContractorVsEmployeeCalculatorPage>
    </>
  );
}

export default withPageEnd(Page, "/contractor-vs-employee-calculator/");
