import type { Metadata } from "next";
import EmploymentTypeCalculatorPage from "@/modules/calculator/employment-type-calculator";
import WhatsNextInline from "@/components/common/whats-next-inline";
import EmploymentTypeCalculatorContent from "@/modules/calculator/employment-type-calculator-content";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, WebApplication, WithContext } from "schema-dts";
import { faqPageSchema } from "@/lib/faq";
import { EMPLOYMENT_TYPE_FAQS } from "@/modules/calculator/employment-type-calculator-faqs";
import { EMPLOYMENT, SITE_CONFIG, calculatePayBreakdown, formatAUD } from "@/lib/constants";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";
import { pageDateModified } from "@/lib/page-dates";
import { withPageEnd } from "@/components/common/content-slots";

const BASE_URL = SITE_CONFIG.baseUrl;
const PAGE_URL = `${BASE_URL}/employment-type-calculator/`;

// The calculator's defaults (modules/calculator/employment-type-calculator:
// $35 an hour on a 38-hour week). Annual, casual rate and take-home come from
// the same constants and engine the calculator uses, so the description and
// the first render always agree.
const DEFAULT_HOURLY_RATE = 35;
const DEFAULT_HOURS = EMPLOYMENT.standardWeeklyHours;
const annualAtDefaults = Math.round(DEFAULT_HOURLY_RATE * DEFAULT_HOURS * EMPLOYMENT.weeksPerYear);
const takeHomeAtDefaults = calculatePayBreakdown({ grossSalary: annualAtDefaults }).takeHomePay;
const casualRateAtDefaults = DEFAULT_HOURLY_RATE * (1 + EMPLOYMENT.casualLoading);
// Previous: "Compare take-home pay and entitlements for full-time, part-time and casual work in Australia, including leave, super and casual loading."
// seo-brain 25 Sep 2026 (Jev-ranked): a concrete part-time answer for "part time salary calculator".
const DESCRIPTION = `Part-time salary from your hourly rate and hours: ${formatAUD(DEFAULT_HOURLY_RATE)} an hour over ${DEFAULT_HOURS} hours is ${formatAUD(annualAtDefaults)} a year, ${formatAUD(takeHomeAtDefaults)} after tax. Casual loading lifts the same rate to ${formatAUD(casualRateAtDefaults, 2)}.`;

export const metadata: Metadata = {
  title: "Part-Time vs Full-Time vs Casual Pay Calculator",
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Part-Time vs Full-Time vs Casual Calculator — Compare Pay & Entitlements",
    description: DESCRIPTION,
    url: PAGE_URL,
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: "en_AU",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Part-Time vs Full-Time vs Casual Calculator",
    description: "Compare full-time, part-time, and casual pay including entitlements and super.",
  },
};

const breadcrumbSchema: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE_URL },
    { "@type": "ListItem", position: 2, name: "Employment Type Calculator", item: PAGE_URL },
  ],
};

const webAppSchema: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Employment Type Calculator — Part-Time vs Full-Time vs Casual",
  url: PAGE_URL,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
  creator: { "@type": "Organization", name: SITE_CONFIG.name },
  dateModified: pageDateModified("employment-type-calculator"),
  inLanguage: "en-AU",
};

const faqSchema = faqPageSchema(EMPLOYMENT_TYPE_FAQS);

const howToSchema = calculatorHowTo({
  name: "How to Use the Employment Type Calculator",
  url: PAGE_URL,
  description: "Compare pay and entitlements across full-time, part-time, and casual employment.",
  steps: PAY_CALCULATOR_STEPS,
});

function Page() {
  return (
    <>
      <JsonLd code={[breadcrumbSchema, webAppSchema, faqSchema, ORGANIZATION_SCHEMA, howToSchema]} />
      <EmploymentTypeCalculatorPage afterCalculator={<WhatsNextInline route="/employment-type-calculator/" />}>
        <EmploymentTypeCalculatorContent />
      </EmploymentTypeCalculatorPage>
    </>
  );
}

export default withPageEnd(Page, "/employment-type-calculator/");
