import type { Metadata } from "next";
import HECSHelpCalculatorPage from "@/modules/calculator/hecs-help-calculator";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/hecs-help-calculator/`;

export const metadata: Metadata = {
  title: "HECS Repayment Calculator 2026-27 — HELP Debt Rates",
  description:
    "Calculate your HECS-HELP repayment for 2026-27. Repayments start at $69,528 under the marginal rate system — see exactly how your student debt affects your take-home pay.",
  alternates: { canonical: URL },
  openGraph: {
    title: "HECS Repayment Calculator Australia 2026-27",
    description: "Calculate your HECS repayment under the marginal system. Free, updated for FY2026-27 — threshold $69,528.",
    url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU",
  },
  twitter: {
    card: "summary_large_image",
    title: "HECS Repayment Calculator Australia 2026-27",
    description: "Marginal system calculator with FY2026-27 thresholds. See your HECS impact instantly.",
  },
};

const breadcrumb: WithContext<BreadcrumbList> = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
  { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
  { "@type": "ListItem", position: 2, name: "HECS Repayment Calculator", item: URL },
]};

const webApp: WithContext<WebApplication> = { "@context": "https://schema.org", "@type": "WebApplication",
  name: "HECS Repayment Calculator Australia 2026-27", url: URL, applicationCategory: "FinanceApplication", operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
  creator: { "@type": "Organization", name: SITE_CONFIG.name },
  dateModified: new Date().toISOString().split("T")[0], inLanguage: "en-AU",
};

const faq: WithContext<FAQPage> = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [
  { "@type": "Question", name: "At what income do HECS repayments start in 2026-27?",
    acceptedAnswer: { "@type": "Answer", text: "Compulsory HECS repayments start once your repayment income exceeds $69,528 in FY2026-27 (up from $69,528 in FY2025-26). At or below $69,528, you make no compulsory repayment." } },
  { "@type": "Question", name: "How much is my HECS repayment on $80,000?",
    acceptedAnswer: { "@type": "Answer", text: "On $80,000, your HECS repayment is $1,571 per year (about $30.21/week) in FY2026-27. Calculated at 15c per dollar on the $10,472 above the $69,528 threshold." } },
  { "@type": "Question", name: "What are the HECS repayment rates for 2026-27?",
    acceptedAnswer: { "@type": "Answer", text: "For FY2026-27: nil up to $69,528; 15c for each $1 over $69,528 up to $129,717; $9,028 plus 17c for each $1 over $129,717 up to $186,050; and 10% of total repayment income from $186,051." } },
  { "@type": "Question", name: "Do HECS repayments come out of my pay?",
    acceptedAnswer: { "@type": "Answer", text: "Yes. Your employer deducts HECS through PAYG if you've indicated a HELP debt on your TFN declaration. It appears as STSL on your payslip and is withheld each pay cycle, like income tax." } },
  { "@type": "Question", name: "Why is the HECS amount on my payslip different from my actual repayment?",
    acceptedAnswer: { "@type": "Answer", text: "Your payslip shows STSL withholding — an estimate based on each pay period's earnings. Your actual compulsory repayment is calculated on your full-year repayment income at tax time, and any difference is settled through your refund or tax bill." } },
  { "@type": "Question", name: "Can I reduce my HECS repayment with salary sacrifice?",
    acceptedAnswer: { "@type": "Answer", text: "Salary sacrifice reduces taxable income but reportable super contributions are added back for HECS calculation, so the benefit is limited." } },
]};

const howToSchema = calculatorHowTo({
  name: "How to Use the HECS Repayment Calculator",
  url: URL,
  description: "Calculate your HECS-HELP repayment in under a minute.",
  steps: PAY_CALCULATOR_STEPS,
});

export default function Page() {
  return (<><JsonLd code={[breadcrumb, webApp, faq, ORGANIZATION_SCHEMA, howToSchema]} /><HECSHelpCalculatorPage /></>);
}
