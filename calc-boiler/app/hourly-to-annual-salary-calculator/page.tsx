import type { Metadata } from "next";
import HourlyToAnnualCalculatorPage from "@/modules/calculator/hourly-to-annual-salary-calculator";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import { calculatePayBreakdown, EMPLOYMENT, formatAUD, SITE_CONFIG } from "@/lib/constants";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";
import { pageDateModified } from "@/lib/page-dates";

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
const DESCRIPTION = `$${HEADLINE_RATE} an hour is ${formatAUD(annualAt(HEADLINE_RATE))} a year (${EMPLOYMENT.standardWeeklyHours} hrs × ${EMPLOYMENT.weeksPerYear} weeks = ${HOURS_LABEL} hours a year), or ${formatAUD(netAt(HEADLINE_RATE))} after tax in ${FY}. Convert any hourly rate to weekly, fortnightly and annual pay.`;

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

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "$40 an hour is how much a year in Australia?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `$40/hr full-time (${EMPLOYMENT.standardWeeklyHours}h/week, ${EMPLOYMENT.weeksPerYear} weeks) = ${formatAUD(annualAt(40))} gross per year, ${formatAUD(netAt(40))} after tax (FY${FY}).`,
      },
    },
    {
      "@type": "Question",
      name: "$25 an hour is how much per year?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `$25/hr = ${formatAUD(annualAt(25))} gross per year, ${formatAUD(netAt(25))} after tax (FY${FY}).`,
      },
    },
    {
      "@type": "Question",
      name: "$50 an hour is how much per year?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `$50/hr = ${formatAUD(annualAt(50))} gross per year, ${formatAUD(netAt(50))} after tax (FY${FY}).`,
      },
    },
    {
      "@type": "Question",
      name: "How many working hours are in a year in Australia?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `A full-time employee is paid for ${HOURS_LABEL} hours a year: ${EMPLOYMENT.standardWeeklyHours} ordinary hours a week × ${EMPLOYMENT.weeksPerYear} weeks. A 40-hour week is ${(40 * EMPLOYMENT.weeksPerYear).toLocaleString("en-AU")} hours and a 37.5-hour week is ${(37.5 * EMPLOYMENT.weeksPerYear).toLocaleString("en-AU")}. A calendar year has 8,760 hours in total (8,784 in a leap year).`,
      },
    },
    {
      "@type": "Question",
      name: "How do you convert hourly to annual salary?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Multiply your hourly rate by hours worked per week (typically 38 in Australia), then by 52 weeks.",
      },
    },
    {
      "@type": "Question",
      name: "How do you calculate annual salary from an hourly rate?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Multiply your hourly rate by the number of hours you work each week, then multiply that result by 52 (the number of weeks in a year). For example, $40/hr × 38 hours × 52 weeks = $79,040 gross per year.",
      },
    },
    {
      "@type": "Question",
      name: "What is a standard working week in Australia?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "For full-time employees, the National Employment Standards (NES) define maximum ordinary hours as 38 hours per week.",
      },
    },
    {
      "@type": "Question",
      name: "Does my hourly rate include superannuation?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "If you are a permanent employee, your hourly rate usually excludes superannuation. Your employer must pay an additional 12% into your super fund. If you are a casual employee, your rate includes a 25% casual loading, and you still receive 12% super on top if you meet eligibility rules.",
      },
    },
  ],
};

const howToSchema = calculatorHowTo({
  name: "How to Use the Hourly to Annual Salary Calculator",
  url: URL,
  description: "Convert your hourly rate to an annual salary in under a minute.",
  steps: PAY_CALCULATOR_STEPS,
});

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webApp, faq, ORGANIZATION_SCHEMA, howToSchema]} />
      <HourlyToAnnualCalculatorPage />
    </>
  );
}
