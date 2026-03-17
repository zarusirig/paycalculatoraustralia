import type { Metadata } from "next";
import HECSHelpCalculatorPage from "@/modules/calculator/hecs-help-calculator";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/hecs-help-calculator/`;

export const metadata: Metadata = {
  title: "HECS-HELP Repayment Calculator 2025-26 — New Marginal System",
  description:
    "Calculate your HECS/HELP repayment under the new marginal rate system. See how student debt affects your take-home pay from $67,000+. Free calculator updated FY2025-26.",
  alternates: { canonical: URL },
  openGraph: {
    title: "HECS-HELP Repayment Calculator 2025-26",
    description: "Calculate your HECS repayment under the new marginal system. Free, updated for FY2025-26.",
    url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU",
  },
  twitter: {
    card: "summary_large_image",
    title: "HECS-HELP Repayment Calculator 2025-26",
    description: "New marginal system calculator. See your HECS impact instantly.",
  },
};

const breadcrumb: WithContext<BreadcrumbList> = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
  { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
  { "@type": "ListItem", position: 2, name: "HECS-HELP Calculator", item: URL },
]};

const webApp: WithContext<WebApplication> = { "@context": "https://schema.org", "@type": "WebApplication",
  name: "HECS-HELP Repayment Calculator 2025-26", url: URL, applicationCategory: "FinanceApplication", operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
  creator: { "@type": "Organization", name: SITE_CONFIG.name },
  dateModified: new Date().toISOString().split("T")[0], inLanguage: "en-AU",
};

const faq: WithContext<FAQPage> = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [
  { "@type": "Question", name: "At what income do HECS repayments start?",
    acceptedAnswer: { "@type": "Answer", text: "Compulsory HECS repayments start at $67,000 in FY2025-26 (up from $54,435 in FY2024-25). Below $67,000, you make no compulsory repayment." } },
  { "@type": "Question", name: "How much is my HECS repayment on $80,000?",
    acceptedAnswer: { "@type": "Answer", text: "On $80,000, your HECS repayment is $1,950 per year ($37.50/week). Calculated at 15c per dollar on the $13,000 above the $67,000 threshold." } },
  { "@type": "Question", name: "Do HECS repayments come out of my pay?",
    acceptedAnswer: { "@type": "Answer", text: "Yes. Your employer deducts HECS through PAYG if you've indicated a HELP debt on your TFN declaration. Withheld from each pay cycle, like income tax." } },
  { "@type": "Question", name: "Can I reduce my HECS repayment with salary sacrifice?",
    acceptedAnswer: { "@type": "Answer", text: "Salary sacrifice reduces taxable income but reportable super contributions are added back for HECS calculation, so the benefit is limited." } },
]};

const howToSchema = calculatorHowTo({
  name: "How to Use the HECS-HELP Repayment Calculator",
  url: URL,
  description: "Calculate your HECS-HELP repayment in under a minute.",
  steps: PAY_CALCULATOR_STEPS,
});

export default function Page() {
  return (<><JsonLd code={[breadcrumb, webApp, faq, ORGANIZATION_SCHEMA, howToSchema]} /><HECSHelpCalculatorPage /></>);
}
