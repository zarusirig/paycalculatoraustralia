import type { Metadata } from "next";
import AnnualPayCalculatorPage from "@/modules/calculator/annual-pay-calculator";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/annual-pay-calculator/`;

export const metadata: Metadata = {
  title: "Annual Salary Calculator Australia — Yearly Take-Home Pay",
  description: "Free annual salary calculator for Australia FY2025-26. Convert any yearly gross salary (e.g. $80,000, $100,000) into annual take-home pay after income tax, Medicare levy & HECS.",
  alternates: { canonical: URL },
  openGraph: { title: "Annual Salary Calculator Australia — Yearly Take-Home Pay (2025-26)", description: "Convert any gross annual salary into your yearly take-home figure after tax, Medicare & HECS.", url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU" },
  twitter: { card: "summary_large_image", title: "Annual Salary Calculator Australia", description: "Yearly take-home pay calculated instantly for FY2025-26." },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Annual Pay Calculator", item: URL },
  ]
};

const webApp: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Annual Pay Calculator Australia",
  url: URL,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
  creator: { "@type": "Organization", name: SITE_CONFIG.name },
  dateModified: new Date().toISOString().split("T")[0],
  inLanguage: "en-AU"
};

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "What is $80,000 a year after tax in Australia?", acceptedAnswer: { "@type": "Answer", text: "A gross annual salary of $80,000 in Australia for FY2025-26 results in approximately $63,933 in annual take-home pay after $14,367 in income tax and $1,600 Medicare levy. Your employer pays an additional $9,600 into super on top." } },
    { "@type": "Question", name: "What is $100,000 a year after tax in Australia?", acceptedAnswer: { "@type": "Answer", text: "A gross annual salary of $100,000 in Australia for FY2025-26 results in approximately $76,633 in annual take-home pay after $21,367 in income tax and $2,000 Medicare levy. Effective tax rate is approximately 23.4%." } },
    { "@type": "Question", name: "How is annual pay calculated in Australia?", acceptedAnswer: { "@type": "Answer", text: "Annual take-home pay is your gross yearly salary minus total income tax, the 2% Medicare levy, and any HECS-HELP repayments for the Australian financial year (1 July to 30 June). The ATO applies progressive tax brackets — 0% on the first $18,200, 16% to $45,000, 30% to $135,000, 37% to $190,000, and 45% above." } },
    { "@type": "Question", name: "What is the annual salary calculator used for?", acceptedAnswer: { "@type": "Answer", text: "The annual salary calculator converts a yearly gross figure into a single annual take-home number for budgeting, salary comparisons, loan applications, and tax return verification. It is preferred over per-cycle calculators when you negotiate a yearly package or compare two job offers." } },
    { "@type": "Question", name: "Does my annual pay include superannuation?", acceptedAnswer: { "@type": "Answer", text: "Generally no. Your gross annual salary forms your 'Ordinary Time Earnings' (OTE). Your employer pays an additional 12% superannuation guarantee on top into your nominated super fund. The base salary plus super together form your total remuneration package." } },
    { "@type": "Question", name: "Why does my annual pay look different from my tax return?", acceptedAnswer: { "@type": "Answer", text: "Your actual tax return factors in work-related deductions, bank interest, investment income, and spouse income. This calculator shows standard PAYG withholding estimates on salary income only. The ATO reconciles your final position when you lodge." } },
  ]
};

const howToSchema = calculatorHowTo({
  name: "How to Use the Annual Pay Calculator",
  url: URL,
  description: "Calculate your annual take-home pay and tax summary in under a minute.",
  steps: PAY_CALCULATOR_STEPS,
});

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webApp, faq, ORGANIZATION_SCHEMA, howToSchema]} />
      <AnnualPayCalculatorPage />
    </>
  );
}
