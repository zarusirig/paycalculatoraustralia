import type { Metadata } from "next";
import BackpayCalculatorPage from "@/modules/calculator/backpay-calculator";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";

const BASE_URL = SITE_CONFIG.baseUrl;
const PAGE_URL = `${BASE_URL}/backpay-calculator/`;

export const metadata: Metadata = {
  title: "Backpay Calculator Australia — Underpayment & Wage Theft Calculator",
  description:
    "Calculate how much you're owed in backpay. Enter your actual rate vs correct rate, hours worked, and period. See total underpayment including super and leave. Free calculator.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Backpay Calculator Australia — Underpayment & Wage Theft Calculator",
    description:
      "Calculate how much you're owed in backpay including unpaid super, leave loading, and tax on the lump sum.",
    url: PAGE_URL,
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: "en_AU",
  },
  twitter: {
    card: "summary_large_image",
    title: "Backpay Calculator Australia — Underpayment & Wage Theft Calculator",
    description: "Calculate backpay owed including unpaid super and leave. Free Australian calculator.",
  },
};

const breadcrumbSchema: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE_URL },
    { "@type": "ListItem", position: 2, name: "Backpay Calculator", item: PAGE_URL },
  ],
};

const webAppSchema: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Backpay Calculator Australia — Underpayment Calculator",
  url: PAGE_URL,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
  creator: { "@type": "Organization", name: SITE_CONFIG.name },
  dateModified: new Date().toISOString().split("T")[0],
  inLanguage: "en-AU",
};

const faqSchema: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How far back can I claim backpay in Australia?",
      acceptedAnswer: { "@type": "Answer", text: "Under the Fair Work Act, you can claim underpayments going back 6 years from the date you make a complaint. This applies to wages, overtime, penalty rates, allowances, and superannuation." },
    },
    {
      "@type": "Question",
      name: "Is backpay taxed differently to normal wages?",
      acceptedAnswer: { "@type": "Answer", text: "Backpay received as a lump sum may be taxed at a higher rate under PAYG withholding (Schedule 5 — back payments). However, you can request the ATO to spread the amount over the financial years it relates to, potentially reducing your tax liability." },
    },
    {
      "@type": "Question",
      name: "Does my employer owe super on backpay?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. The 12% superannuation guarantee applies to all ordinary time earnings, including any underpayment. If you were underpaid wages, your employer also underpaid super contributions on that amount." },
    },
    {
      "@type": "Question",
      name: "How do I report underpayment to the Fair Work Ombudsman?",
      acceptedAnswer: { "@type": "Answer", text: "You can lodge a complaint online at fairwork.gov.au or call 13 13 94. The Fair Work Ombudsman can investigate, mediate, and in serious cases take legal action against employers who underpay workers." },
    },
  ],
};

const howToSchema = calculatorHowTo({
  name: "How to Use the Backpay Calculator",
  url: PAGE_URL,
  description: "Calculate how much backpay you are owed for underpayment of wages.",
  steps: PAY_CALCULATOR_STEPS,
});

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumbSchema, webAppSchema, faqSchema, ORGANIZATION_SCHEMA, howToSchema]} />
      <BackpayCalculatorPage />
    </>
  );
}
