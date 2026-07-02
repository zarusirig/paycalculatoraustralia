import type { Metadata } from "next";
import YTDIncomeCalculatorPage from "@/modules/calculator/ytd-income-calculator";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { ORGANIZATION_SCHEMA, calculatorHowTo } from "@/lib/schema";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/ytd-income-calculator/`;

export const metadata: Metadata = {
  title: "YTD Calculator Australia — Year to Date Income & Annualiser",
  description:
    "Free YTD calculator for Australia. Work out your year-to-date income from your payslip, or annualise a YTD gross figure into a projected annual salary and tax estimate.",
  alternates: { canonical: URL },
  openGraph: {
    title: "YTD Calculator Australia — Year to Date Income",
    description: "Calculate year-to-date income from your payslip, or annualise a YTD figure into a projected annual salary.",
    url: URL,
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: "en_AU",
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
  dateModified: new Date().toISOString().split("T")[0],
  inLanguage: "en-AU",
};

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What does YTD mean on a payslip?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "YTD means year to date. It is the running total of your earnings, tax withheld, and superannuation from 1 July (the start of the Australian financial year) up to that payslip. Every YTD column resets to zero with the first pay after 1 July.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between YTD gross and YTD net?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "YTD gross is your total before-tax earnings for the financial year so far, including overtime, bonuses, and allowances. YTD net is the total that actually reached your bank account after PAYG tax, study loan withholding, and other deductions. Lenders and the ATO work from the gross figure.",
      },
    },
    {
      "@type": "Question",
      name: "How do you calculate YTD income?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Multiply your gross pay per period by the number of pays you have received since 1 July. For example, 13 fortnightly pays of $2,000 gives a YTD gross income of $26,000. To annualise a YTD figure, divide it by the pays received and multiply by the number of pays in a full year (52 weekly, 26 fortnightly, or 12 monthly).",
      },
    },
    {
      "@type": "Question",
      name: "Does YTD reset on 1 July?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Australian payroll systems reset all YTD totals to zero at the start of the financial year on 1 July. Your first July payslip shows YTD figures equal to just that single pay, while your final June payslip holds the full-year totals that flow into your income statement in myGov.",
      },
    },
    {
      "@type": "Question",
      name: "Does YTD gross include superannuation?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Employer superannuation guarantee contributions are paid on top of your gross salary and tracked in a separate YTD super column on your payslip. YTD gross only covers your own earnings — salary, overtime, bonuses, allowances, and leave payments.",
      },
    },
  ],
};

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
