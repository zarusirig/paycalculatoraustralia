import type { Metadata } from "next";
import SecondJobTaxCalculatorPage from "@/modules/calculator/second-job-tax-calculator";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";

const BASE_URL = SITE_CONFIG.baseUrl;
const PAGE_URL = `${BASE_URL}/second-job-tax-calculator/`;

export const metadata: Metadata = {
  title: "Second Job Tax Calculator Australia — Tax on Two Jobs (2025-26)",
  description:
    "Calculate how much tax you pay on a second job in Australia. See why your second job is taxed higher, PAYG withholding without the tax-free threshold, and your combined take-home pay.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Second Job Tax Calculator Australia — Tax on Two Jobs (2025-26)",
    description:
      "Calculate how much tax you pay on a second job in Australia. See PAYG withholding without the tax-free threshold and your combined take-home pay.",
    url: PAGE_URL,
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: "en_AU",
  },
  twitter: {
    card: "summary_large_image",
    title: "Second Job Tax Calculator Australia — Tax on Two Jobs (2025-26)",
    description: "Calculate tax on a second job including PAYG withholding and combined take-home pay.",
  },
};

const breadcrumbSchema: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE_URL },
    { "@type": "ListItem", position: 2, name: "Second Job Tax Calculator", item: PAGE_URL },
  ],
};

const webAppSchema: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Second Job Tax Calculator Australia 2025-26",
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
      name: "Why is my second job taxed more?",
      acceptedAnswer: { "@type": "Answer", text: "Your second job is taxed at a higher rate because you can only claim the tax-free threshold ($18,200) on one job. Your second employer withholds tax from the first dollar at the 'no tax-free threshold' rate, which starts at 16%." },
    },
    {
      "@type": "Question",
      name: "Should I claim the tax-free threshold on my higher-paying job?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. Always claim the tax-free threshold on the job that pays more. This reduces withholding on your largest income source and minimises the chance of a tax debt at the end of the financial year." },
    },
    {
      "@type": "Question",
      name: "Will I get a tax refund from my second job?",
      acceptedAnswer: { "@type": "Answer", text: "Possibly. The 'no tax-free threshold' withholding rate on your second job often over-withholds tax. When you lodge your tax return, the ATO calculates your actual liability on combined income — if more was withheld than owed, you receive a refund." },
    },
    {
      "@type": "Question",
      name: "Do I need to declare my second job to the ATO?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. All income from every employer must be reported on your tax return. Each employer reports your earnings to the ATO via Single Touch Payroll, so the ATO already has your income data." },
    },
  ],
};

const howToSchema = calculatorHowTo({
  name: "How to Use the Second Job Tax Calculator",
  url: PAGE_URL,
  description: "Calculate the tax impact of working two jobs in Australia.",
  steps: PAY_CALCULATOR_STEPS,
});

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumbSchema, webAppSchema, faqSchema, ORGANIZATION_SCHEMA, howToSchema]} />
      <SecondJobTaxCalculatorPage />
    </>
  );
}
