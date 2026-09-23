import type { Metadata } from "next";
import FamilyTaxBenefitCalculatorPage from "@/modules/calculator/family-tax-benefit-calculator";
import { FTB_FAQS } from "@/modules/calculator/family-tax-benefit-faqs";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import { SITE_CONFIG, formatAUD } from "@/lib/constants";
import { FAMILY_PAYMENT_SOURCES, FTB_A, FTB_B } from "@/lib/constants/centrelink-family-payments";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/family-tax-benefit-calculator/`;
const TITLE = `Family Tax Benefit Calculator ${FTB_A.financialYear} — FTB Part A & B`;
const DESCRIPTION = `Estimate FTB Part A (up to ${formatAUD(FTB_A.maxFortnightly.age0to12, 2)} a fortnight per child) and Part B (up to ${formatAUD(FTB_B.maxFortnightly.youngestUnder5, 2)}) for ${FTB_A.financialYear}: income thresholds, the Part B limit and how a pay rise changes it.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU", images: ["/og-image.png"] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Centrelink Income Test", item: `${BASE}/centrelink-income-test/` },
    { "@type": "ListItem", position: 3, name: "Family Tax Benefit Calculator", item: URL },
  ],
};

const webApp: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Family Tax Benefit Calculator",
  url: URL,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
  creator: { "@type": "Organization", name: SITE_CONFIG.name },
  dateModified: FAMILY_PAYMENT_SOURCES.verifiedOnISO,
  inLanguage: "en-AU",
};

// Built from the array the on-page accordion renders, so they cannot drift.
const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FTB_FAQS.map((f) => ({
    "@type": "Question" as const,
    name: f.q,
    acceptedAnswer: { "@type": "Answer" as const, text: f.a },
  })),
};

const howToSchema = calculatorHowTo({
  name: "How to Use the Family Tax Benefit Calculator",
  url: URL,
  description: "Enter your family type, each adult's adjusted taxable income and your children's ages to estimate FTB Part A and Part B.",
  steps: PAY_CALCULATOR_STEPS,
});

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webApp, faq, ORGANIZATION_SCHEMA, howToSchema]} />
      <FamilyTaxBenefitCalculatorPage />
    </>
  );
}
