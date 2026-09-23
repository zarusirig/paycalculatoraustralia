import type { Metadata } from "next";
import JobseekerPaymentCalculatorPage from "@/modules/calculator/jobseeker-payment-calculator";
import { JOBSEEKER_FAQS } from "@/modules/calculator/jobseeker-payment-faqs";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import { SITE_CONFIG, formatAUD } from "@/lib/constants";
import { CENTRELINK_SOURCES, JOBSEEKER_RATES, SEPTEMBER_2026 } from "@/lib/constants/centrelink-income-test";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";
import { withPageEnd } from "@/components/common/content-slots";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/jobseeker-payment-calculator/`;
const SEP = JOBSEEKER_RATES[SEPTEMBER_2026];
const TITLE = "JobSeeker Payment Calculator 2026 — Rates From 20 September";
const DESCRIPTION = `How much is JobSeeker? ${formatAUD(SEP.maxFortnightly.single, 2)} a fortnight single from 20 September 2026. See what you keep when you work: the $150 free area, tapers and partner income.`;

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
    { "@type": "ListItem", position: 3, name: "JobSeeker Payment Calculator", item: URL },
  ],
};

const webApp: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "JobSeeker Payment Calculator",
  url: URL,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
  creator: { "@type": "Organization", name: SITE_CONFIG.name },
  dateModified: CENTRELINK_SOURCES.verifiedOnISO,
  inLanguage: "en-AU",
};

// Built from the same array the on-page accordion renders, so the structured
// data cannot drift from the visible answers.
const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: JOBSEEKER_FAQS.map((f) => ({
    "@type": "Question" as const,
    name: f.q,
    acceptedAnswer: { "@type": "Answer" as const, text: f.a },
  })),
};

const howToSchema = calculatorHowTo({
  name: "How to Use the JobSeeker Payment Calculator",
  url: URL,
  description: "Enter your fortnightly wages and situation to see your JobSeeker payment after the income test.",
  steps: PAY_CALCULATOR_STEPS,
});

function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webApp, faq, ORGANIZATION_SCHEMA, howToSchema]} />
      <JobseekerPaymentCalculatorPage />
    </>
  );
}

export default withPageEnd(Page, "/jobseeker-payment-calculator/");
