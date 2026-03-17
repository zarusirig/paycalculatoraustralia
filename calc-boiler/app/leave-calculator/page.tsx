import type { Metadata } from "next";
import LeaveCalculatorPage from "@/modules/calculator/leave-calculator";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/leave-calculator/`;

export const metadata: Metadata = {
  title: "Leave Entitlements Calculator — Annual Leave, Loading & Payout (2025-26)",
  description:
    "Calculate your annual leave balance, leave loading at 17.5% and payout on termination. Enter your salary and tenure. Free Australian leave calculator.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Leave Entitlements Calculator Australia",
    description: "Calculate your annual leave accrual, leave loading, and termination payout value.",
    url: URL,
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: "en_AU",
  },
  twitter: {
    card: "summary_large_image",
    title: "Leave Entitlements Calculator",
    description: "Calculate your annual leave balance and payout value.",
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
  name: "Leave Entitlements Calculator Australia",
  url: URL,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
  creator: { "@type": "Organization", name: SITE_CONFIG.name },
  dateModified: new Date().toISOString().split("T")[0],
  inLanguage: "en-AU",
};

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How much annual leave do I get in Australia?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Full-time employees get 4 weeks (20 days or 152 hours) of paid annual leave per year. Part-time employees accrue on a pro-rata basis. Shift workers may be entitled to 5 weeks.",
      },
    },
    {
      "@type": "Question",
      name: "What is leave loading?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Leave loading is an extra 17.5% on top of your base pay during annual leave. It depends on your Award or enterprise agreement — not all employees receive it.",
      },
    },
    {
      "@type": "Question",
      name: "Is annual leave paid out when I leave my job?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. When your employment ends, your employer must pay out all accrued but untaken annual leave. This is a legal requirement under the National Employment Standards.",
      },
    },
  ],
};

const howToSchema = calculatorHowTo({
  name: "How to Use the Leave Entitlements Calculator",
  url: URL,
  description: "Calculate your annual leave balance and payout value in under a minute.",
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
