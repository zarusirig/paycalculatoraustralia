import type { Metadata } from "next";
import AgePensionIncomeTestCalculatorPage from "@/modules/calculator/age-pension-income-test-calculator";
import WhatsNextInline from "@/components/common/whats-next-inline";
import AgePensionIncomeTestCalculatorContent from "@/modules/calculator/age-pension-income-test-calculator-content";
import { PENSION_FAQS } from "@/modules/calculator/age-pension-income-test-faqs";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import { SITE_CONFIG, formatAUD } from "@/lib/constants";
import { AGE_PENSION_RATES, SEPTEMBER_2026 } from "@/lib/constants/centrelink-income-test";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";
import { pageDateModified } from "@/lib/page-dates";
import { withPageEnd } from "@/components/common/content-slots";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/age-pension-income-test-calculator/`;
const TITLE = "Age Pension Calculator 2026 — Rates From 20 Sep & Income Test";
const SEP = AGE_PENSION_RATES[SEPTEMBER_2026].maxFortnightly;
const DESCRIPTION = `Age Pension rates from 20 September 2026: ${formatAUD(SEP.single.total, 2)} a fortnight single, ${formatAUD(SEP.coupleEach.total, 2)} each for couples. Calculate it with your wages, the free areas and the Work Bonus.`;

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
    { "@type": "ListItem", position: 3, name: "Age Pension Calculator", item: URL },
  ],
};

const webApp: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Age Pension Calculator",
  url: URL,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
  creator: { "@type": "Organization", name: SITE_CONFIG.name },
  dateModified: pageDateModified("age-pension-income-test-calculator"),
  inLanguage: "en-AU",
};

// Built from the same array the on-page accordion renders, so the structured
// data cannot drift from the visible answers.
const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: PENSION_FAQS.map((f) => ({
    "@type": "Question" as const,
    name: f.q,
    acceptedAnswer: { "@type": "Answer" as const, text: f.a },
  })),
};

const howToSchema = calculatorHowTo({
  name: "How to Use the Age Pension Income Test Calculator",
  url: URL,
  description: "Enter your employment income, Work Bonus balance and other income to see your Age Pension after the income test.",
  steps: PAY_CALCULATOR_STEPS,
});

function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webApp, faq, ORGANIZATION_SCHEMA, howToSchema]} />
      <AgePensionIncomeTestCalculatorPage afterCalculator={<WhatsNextInline route="/age-pension-income-test-calculator/" />}><AgePensionIncomeTestCalculatorContent /></AgePensionIncomeTestCalculatorPage>
    </>
  );
}

export default withPageEnd(Page, "/age-pension-income-test-calculator/");
