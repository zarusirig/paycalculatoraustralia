import type { Metadata } from "next";
import YTDIncomeCalculatorPage from "@/modules/calculator/ytd-income-calculator";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, WebApplication, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { ORGANIZATION_SCHEMA, calculatorHowTo } from "@/lib/schema";
import { pageDateModified } from "@/lib/page-dates";
import { faqPageSchema } from "@/lib/faq";
import { YTD_FAQS } from "@/modules/calculator/ytd-income-calculator-faqs";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/ytd-income-calculator/`;

export const metadata: Metadata = {
  title: "YTD Calculator Australia — Year to Date Income & Annualiser",
  description:
    "Free YTD calculator for Australia. Work out your year-to-date income from your payslip, or annualise a YTD gross figure into projected annual salary and tax.",
  alternates: { canonical: URL },
  openGraph: {
    title: "YTD Calculator Australia — Year to Date Income",
    description: "Calculate year-to-date income from your payslip, or annualise a YTD figure into a projected annual salary.",
    url: URL,
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: "en_AU",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "YTD Income Calculator",
    description: "Calculate or annualise your year-to-date income — Australian financial year aware.",
  },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "YTD Calculator", item: URL },
  ],
};

const webApp: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "YTD Income Calculator Australia",
  url: URL,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
  creator: { "@type": "Organization", name: SITE_CONFIG.name },
  dateModified: pageDateModified("ytd-income-calculator"),
  inLanguage: "en-AU",
};

const faq = faqPageSchema(YTD_FAQS);

const howToSchema = calculatorHowTo({
  name: "How to Use the YTD Income Calculator",
  url: URL,
  description: "Calculate your year-to-date income or annualise a YTD payslip figure in under a minute.",
  steps: [
    { name: "Choose a mode", text: "Pick 'Calculate my YTD income' to add up your earnings so far, or 'Annualise my YTD figure' to project a full-year salary from your payslip." },
    { name: "Enter your pay details", text: "Type your gross pay per period, or the YTD gross figure shown on your latest payslip." },
    { name: "Set your pay count", text: "Enter how many pays you have received since 1 July, or select your latest payslip date and the calculator counts the pay cycles for you." },
    { name: "View your results", text: "Instantly see your YTD gross income, projected annual salary, and estimated full-year tax and take-home pay." },
  ],
});

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webApp, faq, ORGANIZATION_SCHEMA, howToSchema]} />
      <YTDIncomeCalculatorPage />
    </>
  );
}
