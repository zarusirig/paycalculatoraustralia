import type { Metadata } from "next";
import ParentingPaymentCalculatorPage from "@/modules/calculator/parenting-payment-calculator";
import { PARENTING_FAQS } from "@/modules/calculator/parenting-payment-faqs";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import { SITE_CONFIG, formatAUD } from "@/lib/constants";
import { FAMILY_PAYMENT_SOURCES, PARENTING_PAYMENT, ppsFreeArea } from "@/lib/constants/centrelink-family-payments";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/parenting-payment-calculator/`;
const TITLE = "Parenting Payment Calculator 2026 — Single & Partnered Rates";
const DESCRIPTION = `Parenting Payment Single is ${formatAUD(PARENTING_PAYMENT.single.maxFortnightly, 2)} a fortnight and Partnered ${formatAUD(PARENTING_PAYMENT.partnered.maxFortnightly, 2)} from ${PARENTING_PAYMENT.ratesFrom}. What you keep when you work: the ${formatAUD(ppsFreeArea(1), 2)} free area and 40c taper.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU", images: ["/og-image.png"] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Centrelink Income Test", item: `${BASE}/centrelink-income-test/` },
    { "@type": "ListItem", position: 3, name: "Parenting Payment Calculator", item: URL },
  ],
};

const webApp: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Parenting Payment Calculator",
  url: URL,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
  creator: { "@type": "Organization", name: SITE_CONFIG.name },
  dateModified: FAMILY_PAYMENT_SOURCES.verifiedOnISO,
  inLanguage: "en-AU",
};

// Built from the array the on-page accordion renders, so they cannot drift.
const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: PARENTING_FAQS.map((f) => ({
    "@type": "Question" as const,
    name: f.q,
    acceptedAnswer: { "@type": "Answer" as const, text: f.a },
  })),
};

const howToSchema = calculatorHowTo({
  name: "How to Use the Parenting Payment Calculator",
  url: URL,
  description: "Choose single or partnered, enter your fortnightly wages (and your partner's), and see your Parenting Payment after the income test.",
  steps: PAY_CALCULATOR_STEPS,
});

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webApp, faq, ORGANIZATION_SCHEMA, howToSchema]} />
      <ParentingPaymentCalculatorPage />
    </>
  );
}
