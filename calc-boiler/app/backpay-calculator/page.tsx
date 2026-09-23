import type { Metadata } from "next";
import BackpayCalculatorPage from "@/modules/calculator/backpay-calculator";
import BackpayCalculatorContent from "@/modules/calculator/backpay-calculator-content";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, WebApplication, WithContext } from "schema-dts";
import { faqPageSchema } from "@/lib/faq";
import { BACKPAY_FAQS } from "@/modules/calculator/backpay-calculator-faqs";
import { SITE_CONFIG } from "@/lib/constants";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";
import { pageDateModified } from "@/lib/page-dates";
import { withPageEnd } from "@/components/common/content-slots";

const BASE_URL = SITE_CONFIG.baseUrl;
const PAGE_URL = `${BASE_URL}/backpay-calculator/`;

export const metadata: Metadata = {
  title: "Backpay Calculator Australia — Underpayment & Wage Theft",
  description:
    "Calculate how much backpay you're owed: enter your actual and correct rates, hours and period to see the total underpayment, including super and leave.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Backpay Calculator Australia — Underpayment & Wage Theft Calculator",
    description:
      "Calculate how much you're owed in backpay including unpaid super, leave loading, and tax on the lump sum.",
    url: PAGE_URL,
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: "en_AU",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Backpay Calculator Australia — Underpayment & Wage Theft Calculator",
    description: "Calculate backpay owed including unpaid super and leave. Free Australian calculator.",
  },
};

const breadcrumbSchema: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE_URL },
    { "@type": "ListItem", position: 2, name: "Backpay Calculator", item: PAGE_URL },
  ],
};

const webAppSchema: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Backpay Calculator Australia — Underpayment Calculator",
  url: PAGE_URL,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
  creator: { "@type": "Organization", name: SITE_CONFIG.name },
  dateModified: pageDateModified("backpay-calculator"),
  inLanguage: "en-AU",
};

const faqSchema = faqPageSchema(BACKPAY_FAQS);

const howToSchema = calculatorHowTo({
  name: "How to Use the Backpay Calculator",
  url: PAGE_URL,
  description: "Calculate how much backpay you are owed for underpayment of wages.",
  steps: PAY_CALCULATOR_STEPS,
});

function Page() {
  return (
    <>
      <JsonLd code={[breadcrumbSchema, webAppSchema, faqSchema, ORGANIZATION_SCHEMA, howToSchema]} />
      <BackpayCalculatorPage>
        <BackpayCalculatorContent />
      </BackpayCalculatorPage>
    </>
  );
}

export default withPageEnd(Page, "/backpay-calculator/");
