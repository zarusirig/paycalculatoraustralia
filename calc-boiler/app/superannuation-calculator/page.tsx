import type { Metadata } from "next";
import SuperannuationCalculatorPage from "@/modules/calculator/superannuation-calculator";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/superannuation-calculator/`;

export const metadata: Metadata = {
  title: "Superannuation Calculator Australia — Employer SG at 12% (2025-26)",
  description: "Calculate your superannuation contribution at the 12% SG rate for FY2025-26. See employer super, total package, and contribution cap space.",
  alternates: { canonical: URL },
  openGraph: { title: "Superannuation Calculator Australia", description: "Calculate employer super at 12% SG rate. Free, updated for FY2025-26.", url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU" },
  twitter: { card: "summary_large_image", title: "Super Calculator Australia", description: "Employer SG at 12% for FY2025-26." },
};

const breadcrumb: WithContext<BreadcrumbList> = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
  { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
  { "@type": "ListItem", position: 2, name: "Superannuation Calculator", item: URL },
]};

const webApp: WithContext<WebApplication> = { "@context": "https://schema.org", "@type": "WebApplication", name: "Superannuation Calculator Australia", url: URL, applicationCategory: "FinanceApplication", operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" }, creator: { "@type": "Organization", name: SITE_CONFIG.name }, dateModified: new Date().toISOString().split("T")[0], inLanguage: "en-AU" };

const faq: WithContext<FAQPage> = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [
  { "@type": "Question", name: "Is super included in my salary?", acceptedAnswer: { "@type": "Answer", text: "Typically, no. Most contracts quote base salary with super paid on top. Check if your contract says 'plus super' or 'including super'." } },
  { "@type": "Question", name: "Do casual workers get super?", acceptedAnswer: { "@type": "Answer", text: "Yes. Since 1 July 2024, all employees including casuals are entitled to SG regardless of how much they earn." } },
  { "@type": "Question", name: "Can my employer pay super less than 12%?", acceptedAnswer: { "@type": "Answer", text: "No. 12% SG is the legal minimum. Employers who don't pay face the Super Guarantee Charge." } },
  { "@type": "Question", name: "How much super should I have at 30?", acceptedAnswer: { "@type": "Answer", text: "A common benchmark is 1× your annual salary by age 30. Salary sacrifice and voluntary contributions can help if you're behind." } },
]};

const howToSchema = calculatorHowTo({
  name: "How to Use the Superannuation Calculator",
  url: URL,
  description: "Calculate your superannuation contributions in under a minute.",
  steps: PAY_CALCULATOR_STEPS,
});

export default function Page() {
  return (<><JsonLd code={[breadcrumb, webApp, faq, ORGANIZATION_SCHEMA, howToSchema]} /><SuperannuationCalculatorPage /></>);
}
