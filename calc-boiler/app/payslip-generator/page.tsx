import type { Metadata } from "next";
import PayslipGeneratorPage from "@/modules/calculator/payslip-generator";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, WebApplication, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { ORGANIZATION_SCHEMA, calculatorHowTo } from "@/lib/schema";
import { faqPageSchema } from "@/lib/faq";
import { PAYSLIP_GENERATOR_FAQS } from "@/modules/calculator/payslip-generator-faqs";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/payslip-generator/`;
const TITLE = "Free Payslip Generator Australia — Create Payslips Online";
const DESCRIPTION =
  "Create a professional, Fair Work-compliant Australian payslip in your browser. Free payslip generator with PAYG tax, super and YTD totals — print or save as PDF. No signup, no data stored.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: "Free Payslip Generator Australia",
    description: "Generate Fair Work-compliant payslips with PAYG withholding, super and YTD totals. Free, private, and printable as PDF.",
    url: URL,
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: "en_AU",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Payslip Generator Australia",
    description: "Create compliant Australian payslips online — PAYG tax, super and YTD totals included. Print or save as PDF.",
  },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Payslip Generator", item: URL },
  ],
};

const webApp: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Payslip Generator Australia",
  url: URL,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
  creator: { "@type": "Organization", name: SITE_CONFIG.name },
  featureList: [
    "Fair Work-compliant payslip fields",
    "PAYG withholding estimate from ATO tax rates",
    "Super Guarantee calculation on ordinary time earnings",
    "Year-to-date totals",
    "Print or save as PDF",
    "Client-side only — no data stored",
  ],
  dateModified: new Date().toISOString().split("T")[0],
  inLanguage: "en-AU",
};

const faq = faqPageSchema(PAYSLIP_GENERATOR_FAQS);

const howToSchema = calculatorHowTo({
  name: "How to Create a Payslip Online",
  url: URL,
  description: "Generate a Fair Work-compliant Australian payslip with PAYG tax and super in under two minutes.",
  steps: [
    { name: "Enter employer details", text: "Type the business name and ABN that must appear on every Australian payslip." },
    { name: "Add employee and pay period", text: "Enter the employee's name, pay frequency, pay period dates, and the date of payment." },
    { name: "Enter earnings", text: "Add an hourly rate and hours worked or an annual salary, plus any overtime and allowances." },
    { name: "Review tax and super", text: "Check the estimated PAYG withholding and the Super Guarantee contribution, or enter an exact PAYG amount from payroll software." },
    { name: "Print or save as PDF", text: "Click Print / Save as PDF and choose Save as PDF in your browser's print dialog to download the payslip." },
  ],
});

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webApp, faq, ORGANIZATION_SCHEMA, howToSchema]} />
      <PayslipGeneratorPage />
    </>
  );
}
