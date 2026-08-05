import type { Metadata } from "next";
import LeaveCalculatorPage from "@/modules/calculator/leave-calculator";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";
import { LEAVE_FAQS } from "@/modules/calculator/leave-calculator-faqs";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/leave-calculator/`;

// Derived once so the title, description, JSON-LD and rendered page can never
// disagree. Leads with the leave-loading intent without dropping the payout one.
const TITLE = `Annual Leave & Leave Loading Calculator (17.5%) ${SITE_CONFIG.financialYear}`;
const DESCRIPTION = `Work out your annual leave payout and 17.5% leave loading. Who gets loading, the 4-week formula, and tax on lump-sum payouts — FY${SITE_CONFIG.financialYear} rates.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: "en_AU",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Leave Calculator", item: URL },
  ],
};

const webApp: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: `Annual Leave & Leave Loading Calculator Australia`,
  url: URL,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
  creator: { "@type": "Organization", name: SITE_CONFIG.name },
  dateModified: new Date().toISOString().split("T")[0],
  inLanguage: "en-AU",
};

// Built from the same shared array the visible accordion renders, so the
// structured data cannot drift from the page (see leave-calculator-faqs.ts).
const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: LEAVE_FAQS.map((f) => ({
    "@type": "Question" as const,
    name: f.q,
    acceptedAnswer: { "@type": "Answer" as const, text: f.a },
  })),
};

const howToSchema = calculatorHowTo({
  name: "How to Use the Annual Leave & Leave Loading Calculator",
  url: URL,
  description: "Calculate your annual leave balance, 17.5% leave loading, and payout value in under a minute.",
  steps: PAY_CALCULATOR_STEPS,
});

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webApp, faq, ORGANIZATION_SCHEMA, howToSchema]} />
      <LeaveCalculatorPage />
    </>
  );
}
