import type { Metadata } from "next";
import PayslipGeneratorPage from "@/modules/calculator/payslip-generator";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { ORGANIZATION_SCHEMA, calculatorHowTo } from "@/lib/schema";

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

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is it legal to make your own payslip?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, as long as the payslip is accurate. Small employers, bookkeepers and sole traders regularly create payslips manually or with online tools. Creating a false payslip — for example to inflate income on a loan application — is fraud. Employers must also still meet Single Touch Payroll reporting obligations regardless of how the payslip is produced.",
      },
    },
    {
      "@type": "Question",
      name: "What must a payslip include in Australia?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Under the Fair Work Regulations 2009, a payslip must include the employer's name and ABN, the employee's name, the date of payment, the pay period, gross and net pay, the hourly rate and hours worked (for hourly employees) or annual salary (for salaried employees), any loadings, allowances or bonuses as separate items, each deduction with its purpose, and superannuation contributions with the name of the fund.",
      },
    },
    {
      "@type": "Question",
      name: "How do I make a payslip for an ABN contractor?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Genuine independent contractors invoice for their work rather than receiving payslips — they handle their own tax and usually their own super. If a worker with an ABN works like an employee (set hours, employer direction and equipment), they may legally be an employee entitled to payslips and superannuation.",
      },
    },
    {
      "@type": "Question",
      name: "Do casual employees get payslips?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Every employee — full-time, part-time or casual — must receive a payslip within one working day of being paid. A casual's payslip should show the ordinary hourly rate including casual loading, the hours worked, and any penalty rates as separate items.",
      },
    },
  ],
};

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
