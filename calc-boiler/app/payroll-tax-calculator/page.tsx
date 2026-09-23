import type { Metadata } from "next";
import type { BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import PayrollTaxCalculatorPage from "@/modules/payroll-tax/payroll-tax-calculator-page";
import { CALCULATOR_FAQS } from "@/modules/payroll-tax/content";
import { JsonLd } from "@/modules/seo/json-ld";
import { SITE_CONFIG } from "@/lib/constants";
import { calculatorHowTo } from "@/lib/schema";
import { PAYROLL_TAX_FY } from "@/lib/constants/payroll-tax";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/payroll-tax-calculator/`;

const TITLE = `Payroll Tax Calculator ${PAYROLL_TAX_FY} — NSW, VIC, QLD & All States`;
const DESCRIPTION = `Free payroll tax calculator for every Australian state and territory on ${PAYROLL_TAX_FY} rates: thresholds, phase-outs, VIC surcharges, the QLD levy and grouped wages.`;

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
    { "@type": "ListItem", position: 2, name: "Payroll Tax Calculator", item: URL },
  ],
};

const webApp: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "@id": `${URL}#webpage`,
  name: "Payroll Tax Calculator",
  url: URL,
  description: DESCRIPTION,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
  creator: { "@type": "Organization", name: SITE_CONFIG.name },
  inLanguage: "en-AU",
};

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: CALCULATOR_FAQS.map((f) => ({
    "@type": "Question" as const,
    name: f.q,
    acceptedAnswer: { "@type": "Answer" as const, text: f.a },
  })),
};

const howTo = calculatorHowTo({
  name: "How to Calculate Payroll Tax in Australia",
  url: URL,
  description: "Work out a year's state payroll tax from your wages, the state's threshold and its rate.",
  steps: [
    { name: "Choose the state", text: "Payroll tax is paid to each state or territory where you pay wages." },
    { name: "Enter the state's taxable wages", text: "Salaries, super, fringe benefits and taxable contractor payments for the year, less exempt wages." },
    { name: "Add interstate or group wages", text: "If you or your group pay wages in other states, enter total Australian wages so the threshold is apportioned." },
    { name: "Read the liability", text: "See the threshold or deduction, the wages taxed, any surcharge, the annual total and the effective rate." },
  ],
});

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webApp, faq, howTo]} />
      <PayrollTaxCalculatorPage />
    </>
  );
}
