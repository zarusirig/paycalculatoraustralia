import type { Metadata } from "next";
import TakeHomePayCalculatorPage from "@/modules/calculator/take-home-pay-calculator";
import { faqPageSchema } from "@/lib/faq";
import { TAKE_HOME_PAY_FAQS } from "@/modules/calculator/take-home-pay-calculator-faqs";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, WebApplication, WithContext } from "schema-dts";
import { calculatePayBreakdown, formatAUD, SITE_CONFIG } from "@/lib/constants";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";
import { pageDateModified } from "@/lib/page-dates";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/take-home-pay-calculator/`;

const FY = SITE_CONFIG.financialYear;
// Figures from the tax engine at build time, never hardcoded.
const at80k = calculatePayBreakdown({ grossSalary: 80_000 });

// 8.6k impr at 0.41% CTR (pos 4.8) but DataForSEO shows this URL ranking for
// only 4 keywords — the head terms were split between / (take home #12, after
// tax income #18-44), /gross-pay-calculator/ (net pay #40) and
// /monthly-pay-calculator/ (net pay calculator australia #42). Head-term intent
// map (docs/seo/2026-09-23-head-term-intent-map.md) makes this URL the ONE
// primary for "take home pay calculator", "net pay calculator" and "after tax
// income calculator"; the other pages now link here with those exact anchors.
// Previous: "Take-Home Pay Calculator Australia ${FY}: Pay After Tax".
const TITLE = `Take Home Pay Calculator Australia ${FY}: Net Pay After Tax`;
const DESCRIPTION = `On $80,000 your net pay is ${formatAUD(at80k.takeHomePay)} a year (${formatAUD(at80k.fortnightly)} a fortnight) in ${FY}. Take home pay and after tax income calculator — enter weekly, fortnightly, monthly or annual pay.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU", images: ["/og-image.png"] },
  twitter: { card: "summary_large_image", title: TITLE, description: "Net pay and after tax income — tax, Medicare, HECS & super." },
};

const breadcrumb: WithContext<BreadcrumbList> = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
  { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
  { "@type": "ListItem", position: 2, name: "Take Home Pay Calculator", item: URL },
]};

const webApp: WithContext<WebApplication> = { "@context": "https://schema.org", "@type": "WebApplication", name: `Take Home Pay Calculator Australia ${FY}`, url: URL, applicationCategory: "FinanceApplication", operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" }, creator: { "@type": "Organization", name: SITE_CONFIG.name }, dateModified: pageDateModified("take-home-pay-calculator"), inLanguage: "en-AU" };

const faq = faqPageSchema(TAKE_HOME_PAY_FAQS);

const howToSchema = calculatorHowTo({
  name: "How to Use the Take-Home Pay Calculator",
  url: URL,
  description: "Calculate your Australian take-home pay after tax in under a minute.",
  steps: PAY_CALCULATOR_STEPS,
});

export default function Page() {
  return (<><JsonLd code={[breadcrumb, webApp, faq, ORGANIZATION_SCHEMA, howToSchema]} /><TakeHomePayCalculatorPage /></>);
}
