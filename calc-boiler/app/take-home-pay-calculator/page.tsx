import type { Metadata } from "next";
import TakeHomePayCalculatorPage from "@/modules/calculator/take-home-pay-calculator";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import { calculatePayBreakdown, formatAUD, SITE_CONFIG, SUPER_GUARANTEE } from "@/lib/constants";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/take-home-pay-calculator/`;

const FY = SITE_CONFIG.financialYear;
// Figures from the tax engine at build time, never hardcoded.
const at80k = calculatePayBreakdown({ grossSalary: 80_000 });
const at50k = calculatePayBreakdown({ grossSalary: 50_000 });
const at100k = calculatePayBreakdown({ grossSalary: 100_000 });
const keep = (net: number, gross: number) => `${((net / gross) * 100).toFixed(1)}%`;

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
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU" },
  twitter: { card: "summary_large_image", title: TITLE, description: "Net pay and after tax income — tax, Medicare, HECS & super." },
};

const breadcrumb: WithContext<BreadcrumbList> = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
  { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
  { "@type": "ListItem", position: 2, name: "Take Home Pay Calculator", item: URL },
]};

const webApp: WithContext<WebApplication> = { "@context": "https://schema.org", "@type": "WebApplication", name: `Take Home Pay Calculator Australia ${FY}`, url: URL, applicationCategory: "FinanceApplication", operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" }, creator: { "@type": "Organization", name: SITE_CONFIG.name }, dateModified: new Date().toISOString().split("T")[0], inLanguage: "en-AU" };

const faq: WithContext<FAQPage> = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [
  { "@type": "Question", name: "How is take-home pay calculated?", acceptedAnswer: { "@type": "Answer", text: "Take-home pay is your gross salary minus income tax, Medicare levy, and any HECS repayments. Your employer deducts these through the PAYG system. Super is paid separately." } },
  { "@type": "Question", name: "What percentage of my salary do I take home?", acceptedAnswer: { "@type": "Answer", text: `In ${FY}, at $50,000 you keep ${keep(at50k.takeHomePay, 50_000)} (${formatAUD(at50k.takeHomePay)}). At $100,000 you keep ${keep(at100k.takeHomePay, 100_000)} (${formatAUD(at100k.takeHomePay)}, without HECS). The percentage decreases as salary increases due to progressive tax rates.` } },
  { "@type": "Question", name: "Is super deducted from my pay?", acceptedAnswer: { "@type": "Answer", text: `No. Your employer pays super (${Math.round(SUPER_GUARANTEE.rate * 100)}%) on top of your salary. Voluntary salary sacrifice amounts are deducted pre-tax.` } },
  { "@type": "Question", name: "Why is my first pay smaller than expected?", acceptedAnswer: { "@type": "Answer", text: "If you haven't submitted a TFN declaration, your employer withholds at the highest rate (45% plus Medicare). Submit your TFN immediately." } },
]};

const howToSchema = calculatorHowTo({
  name: "How to Use the Take-Home Pay Calculator",
  url: URL,
  description: "Calculate your Australian take-home pay after tax in under a minute.",
  steps: PAY_CALCULATOR_STEPS,
});

export default function Page() {
  return (<><JsonLd code={[breadcrumb, webApp, faq, ORGANIZATION_SCHEMA, howToSchema]} /><TakeHomePayCalculatorPage /></>);
}
