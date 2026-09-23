import type { Metadata } from "next";
import AustudyYouthAllowanceCalculatorPage from "@/modules/calculator/austudy-youth-allowance-calculator";
import AustudyYouthAllowanceCalculatorContent from "@/modules/calculator/austudy-youth-allowance-calculator-content";
import { STUDENT_FAQS } from "@/modules/calculator/austudy-youth-allowance-faqs";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";
import { pageDateModified } from "@/lib/page-dates";
import { withPageEnd } from "@/components/common/content-slots";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/austudy-youth-allowance-calculator/`;
const TITLE = "Youth Allowance Calculator 2026 — Rates, Eligibility, Income Test";
const DESCRIPTION = "Youth Allowance and Austudy rates ($418.90 to $854.20 a fortnight), eligibility and the student income test: $539 free area, 50c to $646, then 60c.";

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
    { "@type": "ListItem", position: 3, name: "Austudy and Youth Allowance Income Test Calculator", item: URL },
  ],
};

const webApp: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Austudy and Youth Allowance Income Test Calculator",
  url: URL,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
  creator: { "@type": "Organization", name: SITE_CONFIG.name },
  dateModified: pageDateModified("austudy-youth-allowance-calculator"),
  inLanguage: "en-AU",
};

// Built from the same array the on-page accordion renders, so the structured
// data cannot drift from the visible answers.
const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: STUDENT_FAQS.map((f) => ({
    "@type": "Question" as const,
    name: f.q,
    acceptedAnswer: { "@type": "Answer" as const, text: f.a },
  })),
};

const howToSchema = calculatorHowTo({
  name: "How to Use the Austudy and Youth Allowance Income Test Calculator",
  url: URL,
  description: "Pick your payment and situation, enter your fortnightly income, and see the payment after the income test.",
  steps: PAY_CALCULATOR_STEPS,
});

function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webApp, faq, ORGANIZATION_SCHEMA, howToSchema]} />
      <AustudyYouthAllowanceCalculatorPage><AustudyYouthAllowanceCalculatorContent /></AustudyYouthAllowanceCalculatorPage>
    </>
  );
}

export default withPageEnd(Page, "/austudy-youth-allowance-calculator/");
