import type { Metadata } from "next";
import RentAssistanceCalculatorPage from "@/modules/calculator/rent-assistance-calculator";
import RentAssistanceCalculatorContent from "@/modules/calculator/rent-assistance-calculator-content";
import { RENT_FAQS } from "@/modules/calculator/rent-assistance-faqs";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import { SITE_CONFIG, formatAUD } from "@/lib/constants";
import { FAMILY_PAYMENT_SOURCES, RENT_ASSISTANCE } from "@/lib/constants/centrelink-family-payments";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";
import { withPageEnd } from "@/components/common/content-slots";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/rent-assistance-calculator/`;
const TITLE = "Rent Assistance Calculator — Centrelink Rates From 20 Sep 2026";
const DESCRIPTION = `Centrelink Rent Assistance pays 75c per dollar of rent over the threshold, up to ${formatAUD(RENT_ASSISTANCE.rows.single.max, 2)} a fortnight single or ${formatAUD(RENT_ASSISTANCE.rows.singleFamily1or2.max, 2)} for families, from ${RENT_ASSISTANCE.ratesFrom}.`;

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
    { "@type": "ListItem", position: 3, name: "Rent Assistance Calculator", item: URL },
  ],
};

const webApp: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Rent Assistance Calculator",
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
  mainEntity: RENT_FAQS.map((f) => ({
    "@type": "Question" as const,
    name: f.q,
    acceptedAnswer: { "@type": "Answer" as const, text: f.a },
  })),
};

const howToSchema = calculatorHowTo({
  name: "How to Use the Rent Assistance Calculator",
  url: URL,
  description: "Choose your situation and enter the rent you pay each week, fortnight or month to see your Rent Assistance.",
  steps: PAY_CALCULATOR_STEPS,
});

function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webApp, faq, ORGANIZATION_SCHEMA, howToSchema]} />
      <RentAssistanceCalculatorPage><RentAssistanceCalculatorContent /></RentAssistanceCalculatorPage>
    </>
  );
}

export default withPageEnd(Page, "/rent-assistance-calculator/");
