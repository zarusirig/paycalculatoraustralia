import type { Metadata } from "next";
import { LongServiceLeaveHub } from "@/modules/calculator/long-service-leave-content";
// FAQs come from the non-client module: importing a value across a "use client"
// boundary gives a client-reference proxy, not the array.
import { LSL_HUB_FAQS } from "@/modules/calculator/long-service-leave-faqs";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { ORGANIZATION_SCHEMA, calculatorHowTo } from "@/lib/schema";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/long-service-leave-calculator/`;
const TITLE = "Long Service Leave Calculator — All 8 States and Territories";
const DESCRIPTION =
  "Work out your long service leave: weeks accrued, what you can take now, what is paid out if you resign, and the tax on it. Every state and territory Act compared — 8.667 weeks at 10 years in NSW, QLD, WA and Tasmania, 13 weeks in SA and the NT, 7-year qualifying periods in Victoria and the ACT.";

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
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Long Service Leave Calculator", item: URL },
  ],
};

const webApp: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Long Service Leave Calculator",
  url: URL,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
  creator: { "@type": "Organization", name: SITE_CONFIG.name },
  dateModified: new Date().toISOString().split("T")[0],
  inLanguage: "en-AU",
};

// Built from the same array the on-page accordion renders, so the structured
// data cannot drift from the visible answers.
const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: LSL_HUB_FAQS.map((f) => ({
    "@type": "Question" as const,
    name: f.q,
    acceptedAnswer: { "@type": "Answer" as const, text: f.a },
  })),
};

const howToSchema = calculatorHowTo({
  name: "How to Use the Long Service Leave Calculator",
  url: URL,
  description:
    "Enter your state, your first day of continuous service and your ordinary weekly pay to see the long service leave you have accrued and what it is worth.",
  steps: [
    {
      name: "Choose your state or territory",
      text: "Long service leave comes from a separate Act in each state and territory, so the qualifying period and accrual rate depend on where you work.",
    },
    {
      name: "Enter your first day of continuous service",
      text: "Use the date you started with this employer, including service carried over if the business changed hands.",
    },
    {
      name: "Enter your ordinary weekly pay",
      text: "Ordinary time only, before tax and excluding overtime. Part-time and casual employees enter their own actual weekly pay.",
    },
    {
      name: "Say whether you are still employed",
      text: "Still employed shows the weeks you can take as leave. Leaving shows what is paid out, and asks why the job ended because the answer changes what is owed.",
    },
    {
      name: "Read the weeks and the payout",
      text: "The calculator shows weeks accrued, weeks takeable, the gross payout at your rate, and the tax the ATO withholds from an unused balance.",
    },
  ],
});

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webApp, faq, ORGANIZATION_SCHEMA, howToSchema]} />
      <LongServiceLeaveHub />
    </>
  );
}
