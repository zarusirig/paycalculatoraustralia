import ContractorPayCalculator from "@/modules/calculator/contractor-pay-calculator";
import { JsonLd } from "@/modules/seo/json-ld";
import type {
  BreadcrumbList,
  FAQPage,
  WebApplication,
  WithContext,
} from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contractor Pay Calculator Australia — Your Real Take-Home",
  description:
    "Calculate your take-home as a contractor in Australia. See your net pay after GST, income tax, super self-contribution & deductions — ABN vs PAYG comparison for FY2025-26.",
  alternates: {
    canonical: `${SITE_CONFIG.baseUrl}/contractor-pay-calculator/`,
  },
  openGraph: {
    title: "Contractor Pay Calculator Australia — What You Take Home as a Contractor",
    description:
      "Calculate your take-home as a contractor. See net pay after GST, income tax, super self-contribution & deductions for FY2025-26.",
    url: `${SITE_CONFIG.baseUrl}/contractor-pay-calculator/`,
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: "en_AU",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contractor Pay Calculator Australia",
    description: "See your real take-home as a contractor in Australia.",
  },
};

const webAppSchema: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Contractor Pay Calculator Australia",
  url: `${SITE_CONFIG.baseUrl}/contractor-pay-calculator/`,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "AUD",
  },
  creator: {
    "@type": "Organization",
    name: SITE_CONFIG.name,
  },
  dateModified: new Date().toISOString().split("T")[0],
  inLanguage: "en-AU",
};

const breadcrumbSchema: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Pay Calculator",
      item: SITE_CONFIG.baseUrl,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Contractor Pay Calculator",
      item: `${SITE_CONFIG.baseUrl}/contractor-pay-calculator/`,
    },
  ],
};

const faqSchema: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How much do I take home as a contractor in Australia?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A contractor charging $1,000 per day grosses approximately $240,000 over 48 working weeks and takes home roughly $162,000 after income tax and the 2% Medicare levy (FY2025-26). Take-home varies with hourly or daily rate, hours worked, GST treatment, and whether you set aside the 12% Super Guarantee for yourself. ABN contractors typically need to charge 30-40% more than an equivalent PAYG hourly rate to cover lost leave, super, and insurance.",
      },
    },
    {
      "@type": "Question",
      name: "What is a contractor for tax purposes?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A contractor (independent contractor or ABN worker) operates their own business and invoices clients for work. Unlike employees, contractors handle their own tax, super, and insurance. The ATO uses a multi-factor test to determine contractor status.",
      },
    },
    {
      "@type": "Question",
      name: "What's the difference between ABN and PAYG income tax?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ABN contractors and PAYG employees pay the same marginal income tax brackets (0%, 16%, 30%, 37%, 45%) plus the 2% Medicare levy in FY2025-26. The difference is in how it's collected: PAYG employees have tax withheld every pay cycle by their employer, while ABN contractors invoice gross and pay tax through quarterly PAYG instalments or at year-end. Contractors also handle GST (10%) once turnover exceeds $75,000.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need to charge GST as a contractor?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "If your ABN business income exceeds $75,000 per year, you must register for GST and charge 10% on your invoices. The GST you collect is remitted to the ATO quarterly. Below $75,000, GST registration is optional.",
      },
    },
    {
      "@type": "Question",
      name: "Do contractors need to pay super?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "For independent contractors under their own ABN, super is optional but recommended. However, if a business hires you primarily for your labour, they may be required to pay super on your behalf at the current rate of 12%.",
      },
    },
    {
      "@type": "Question",
      name: "How do I calculate my contractor hourly rate?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Your contractor rate should cover lost employee benefits: super (12%), annual leave (4 weeks), sick leave, public holidays, insurance, and admin time. A common rule of thumb: multiply an equivalent employee hourly rate by 1.4-1.6.",
      },
    },
    {
      "@type": "Question",
      name: "Can contractors claim business deductions?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Contractors can deduct legitimate business expenses including equipment, home office, vehicle, phone, software, professional development, and insurance. This reduces your taxable income and the tax you owe.",
      },
    },
  ],
};

const howToSchema = calculatorHowTo({
  name: "How to Use the Contractor Pay Calculator",
  url: `${SITE_CONFIG.baseUrl}/contractor-pay-calculator/`,
  description: "Calculate your contractor take-home pay after tax and GST in under a minute.",
  steps: PAY_CALCULATOR_STEPS,
});

export default function ContractorPayCalculatorPage() {
  return (
    <>
      <JsonLd
        code={[webAppSchema, breadcrumbSchema, faqSchema, ORGANIZATION_SCHEMA, howToSchema]}
      />
      <ContractorPayCalculator />
    </>
  );
}
