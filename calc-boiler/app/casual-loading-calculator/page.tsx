import type { Metadata } from "next";
import type { BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import CasualLoadingPage from "@/modules/guide/casual-loading";
import { CASUAL_FAQS } from "@/modules/guide/casual-loading-faqs";
import { JsonLd } from "@/modules/seo/json-ld";
import { SITE_CONFIG, formatAUD } from "@/lib/constants";
import { calculatorHowTo } from "@/lib/schema";
import { NMW } from "@/lib/constants/minimum-wage";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/casual-loading-calculator/`;

const TITLE = `Casual Loading Calculator ${SITE_CONFIG.financialYear}: 25% Casual Rate vs Permanent`;
const DESCRIPTION = `How much is casual loading? Usually 25%: casual rate = base rate × 1.25, so the ${formatAUD(NMW.hourly, 2)} minimum wage is ${formatAUD(NMW.casualHourly, 2)} casual. Compare a year as a casual against permanent pay with paid leave, by award.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Casual Loading Calculator", item: URL },
  ],
};

const webApp: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "@id": `${URL}#webpage`,
  name: "Casual Loading Calculator",
  url: URL,
  description: DESCRIPTION,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
  creator: { "@type": "Organization", name: SITE_CONFIG.name },
  inLanguage: "en-AU",
};

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: CASUAL_FAQS.map((f) => ({
    "@type": "Question" as const,
    name: f.q,
    acceptedAnswer: { "@type": "Answer" as const, text: f.a },
  })),
};

const howTo = calculatorHowTo({
  name: "How to Calculate a Casual Rate with Casual Loading",
  url: URL,
  description: "Add the casual loading to a base hourly rate and compare casual pay with permanent pay including leave.",
  steps: [
    { name: "Enter the permanent hourly rate", text: "Use the award or agreement rate for your classification, before any loading." },
    { name: "Check the loading", text: "25% under the National Minimum Wage Order and most awards. Change it if your agreement differs." },
    { name: "Enter your hours and sick days", text: "The comparison assumes both employees take the same holidays and sick days." },
    { name: "Read the comparison", text: "See the casual hourly rate, a year's pay each way, and the loading at which the two break even." },
  ],
});

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webApp, faq, howTo]} />
      <CasualLoadingPage />
    </>
  );
}
