import type { Metadata } from "next";
import LeaveCalculatorPage from "@/modules/calculator/leave-calculator";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/leave-calculator/`;

export const metadata: Metadata = {
  title: "Annual Leave Calculator Australia — What Your Payout Is Worth",
  description:
    "Calculate the value of your annual leave payout. Pro-rata accrual, tax on leave loading & lump-sum payouts — FY2026-27 Australian rates.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Annual Leave Calculator Australia — How Much Your Leave Payout Actually Is",
    description: "Calculate the value of your annual leave payout. Pro-rata accrual, tax on leave loading and lump-sum payouts for FY2026-27.",
    url: URL,
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: "en_AU",
  },
  twitter: {
    card: "summary_large_image",
    title: "Annual Leave Calculator Australia",
    description: "How much your annual leave payout is actually worth — FY2026-27 rates.",
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
      name: "How is annual leave payout calculated?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Annual leave payout is calculated by multiplying the employee's weekly base pay rate by the number of accrued unused weeks of leave, plus 17.5% leave loading if the Award or contract provides for it. On an $80,000 salary with 4 weeks accrued leave, the gross payout is $6,154 base ($80,000 ÷ 52 × 4) plus $1,077 leave loading where applicable, totalling around $7,231 before tax.",
      },
    },
    {
      "@type": "Question",
      name: "Is leave loading taxed differently?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Leave loading of 17.5% paid out on termination is taxed at the employee's marginal income tax rate, the same as ordinary salary income. The historical concessional tax treatment for leave loading was removed by the ATO years ago. The payout is added to taxable income for the financial year it is received.",
      },
    },
    {
      "@type": "Question",
      name: "Do I get tax back on unused annual leave?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Possibly. Annual leave payouts are taxed as lump-sum income at your marginal rate, which can over-withhold tax if the payout temporarily pushes you into a higher bracket for that pay period. When you lodge your annual tax return, any over-withheld tax is refunded based on actual annual income.",
      },
    },
    {
      "@type": "Question",
      name: "How much annual leave do I get in Australia?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Full-time employees get 4 weeks (20 days or 152 hours) of paid annual leave per year under the National Employment Standards. Part-time employees accrue on a pro-rata basis proportional to their ordinary hours. Shift workers on rotating rosters may be entitled to 5 weeks (190 hours).",
      },
    },
    {
      "@type": "Question",
      name: "What is leave loading?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Leave loading is an extra 17.5% on top of your base pay during annual leave. It depends on your Award or enterprise agreement — Award-free professional employees typically do not receive it. Common Awards with leave loading include the Clerks Award, Manufacturing Award, and Building Award.",
      },
    },
    {
      "@type": "Question",
      name: "Is annual leave paid out when I leave my job?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. When your employment ends, your employer must pay out all accrued but untaken annual leave. This is a legal requirement under the National Employment Standards and applies whether you resign, are made redundant, or are dismissed.",
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
