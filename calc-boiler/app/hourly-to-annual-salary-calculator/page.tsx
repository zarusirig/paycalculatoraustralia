import type { Metadata } from "next";
import HourlyToAnnualCalculatorPage from "@/modules/calculator/hourly-to-annual-salary-calculator";
import WhatsNextInline from "@/components/common/whats-next-inline";
import HourlyToAnnualSalaryCalculatorContent from "@/modules/calculator/hourly-to-annual-salary-calculator-content";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, WebApplication, WithContext } from "schema-dts";
import { faqPageSchema } from "@/lib/faq";
import { HOURLY_TO_ANNUAL_FAQS } from "@/modules/calculator/hourly-to-annual-salary-calculator-faqs";
import { calculatePayBreakdown, EMPLOYMENT, formatAUD, SITE_CONFIG } from "@/lib/constants";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";
import { pageDateModified } from "@/lib/page-dates";
import { withPageEnd } from "@/components/common/content-slots";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/hourly-to-annual-salary-calculator/`;

// Answer-first figures, computed from the tax engine at build time. HEADLINE_RATE
// must match the module's lead (a "use client" module can't export it here).
const HOURS = EMPLOYMENT.hoursPerYear; // 38 × 52 = 1,976
const HOURS_LABEL = HOURS.toLocaleString("en-AU");
const FY = SITE_CONFIG.financialYear;
const HEADLINE_RATE = 30;
const annualAt = (rate: number) => rate * HOURS;
const netAt = (rate: number) => calculatePayBreakdown({ grossSalary: annualAt(rate) }).takeHomePay;

// GSC: "hourly rate to annual salary" (323 impr), "hourly to annual salary",
// "hourly to annual salary calculator" (12% CTR). DataForSEO: "how many hours
// in a year" 12.1k/mo, KD 4 — answered in the description and on the page.
const TITLE = `Hourly to Annual Salary Calculator Australia: $${HEADLINE_RATE}/hr = ${formatAUD(annualAt(HEADLINE_RATE))}`;
const DESCRIPTION = `$${HEADLINE_RATE} an hour is ${formatAUD(annualAt(HEADLINE_RATE))} a year (${EMPLOYMENT.standardWeeklyHours} hrs × ${EMPLOYMENT.weeksPerYear} weeks = ${HOURS_LABEL} hours), or ${formatAUD(netAt(HEADLINE_RATE))} after tax in ${FY}. Convert any hourly rate to weekly, fortnightly and annual pay.`;

export const metadata: Metadata = {
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
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: `Any hourly rate to an annual salary, before and after tax, ${FY}.`,
  },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Hourly to Annual Salary Calculator", item: URL },
  ],
};

const webApp: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Hourly to Annual Salary Calculator Australia",
  url: URL,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
  creator: { "@type": "Organization", name: SITE_CONFIG.name },
  dateModified: pageDateModified("hourly-to-annual-salary-calculator"),
  inLanguage: "en-AU",
};

const faq = faqPageSchema(HOURLY_TO_ANNUAL_FAQS);

const howToSchema = calculatorHowTo({
  name: "How to Use the Hourly to Annual Salary Calculator",
  url: URL,
  description: "Convert your hourly rate to an annual salary in under a minute.",
  steps: PAY_CALCULATOR_STEPS,
});

function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webApp, faq, ORGANIZATION_SCHEMA, howToSchema]} />
      <HourlyToAnnualCalculatorPage afterCalculator={<WhatsNextInline route="/hourly-to-annual-salary-calculator/" />}>
        <HourlyToAnnualSalaryCalculatorContent />
      </HourlyToAnnualCalculatorPage>
    </>
  );
}

export default withPageEnd(Page, "/hourly-to-annual-salary-calculator/");
