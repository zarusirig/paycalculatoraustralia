import type { Metadata } from "next";
import NovatedLeaseCalculatorPage from "@/modules/calculator/novated-lease-calculator";
import { NOVATED_LEASE_FAQS } from "@/modules/calculator/novated-lease-faqs";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { ORGANIZATION_SCHEMA, calculatorHowTo } from "@/lib/schema";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/novated-lease-calculator/`;
const TITLE = "Novated Lease Calculator — EV, PHEV and FBT";
const DESCRIPTION = "Salary sacrifice a car and see both payslip lines: the pre-tax deduction, the post-tax employee contribution, FBT or the electric car exemption, and your take-home pay before and after. Includes the reportable fringe benefits amount that changes your HECS-HELP repayment. FBT and luxury car tax figures verified at ato.gov.au.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Novated Lease Calculator", item: URL },
  ],
};

const webApp: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Novated Lease Calculator",
  url: URL,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
  creator: { "@type": "Organization", name: SITE_CONFIG.name },
  dateModified: new Date().toISOString().split("T")[0],
  inLanguage: "en-AU",
};

// Built from the same array the on-page accordion renders, so the structured
// data cannot drift from the visible answers.
const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: NOVATED_LEASE_FAQS.map((f) => ({
    "@type": "Question" as const,
    name: f.q,
    acceptedAnswer: { "@type": "Answer" as const, text: f.a },
  })),
};

const howToSchema = calculatorHowTo({
  name: "How to Use the Novated Lease Calculator",
  url: URL,
  description: "Enter your salary, the car's GST-inclusive price and your running costs to see the pre-tax and post-tax deductions, the FBT, and your take-home pay.",
  steps: [
    { name: "Enter your salary and the car price", text: "Type your gross annual salary and the vehicle's GST-inclusive purchase price, excluding registration and stamp duty." },
    { name: "Choose the vehicle type", text: "Battery electric, plug-in hybrid or conventional. Battery electric cars under the luxury car tax fuel-efficient threshold are exempt from FBT; plug-in hybrids are only exempt under a pre-1 April 2025 arrangement." },
    { name: "Set the term and running costs", text: "Pick a lease term of one to five years and enter the annual running costs your packaging budget covers." },
    { name: "Pick the FBT method", text: "Choose the employee contribution method or the statutory formula, and tick HECS-HELP or private hospital cover if they apply." },
    { name: "Read the payslip split", text: "See the pre-tax deduction, the post-tax employee contribution, the FBT, the reportable fringe benefits amount, your take-home pay and the total against buying the car outright." },
  ],
});

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webApp, faq, ORGANIZATION_SCHEMA, howToSchema]} />
      <NovatedLeaseCalculatorPage />
    </>
  );
}
