import type { Metadata } from "next";
import EmploymentTypeCalculatorPage from "@/modules/calculator/employment-type-calculator";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, WebApplication, WithContext } from "schema-dts";
import { faqPageSchema } from "@/lib/faq";
import { EMPLOYMENT_TYPE_FAQS } from "@/modules/calculator/employment-type-calculator-faqs";
import { SITE_CONFIG } from "@/lib/constants";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";
import { pageDateModified } from "@/lib/page-dates";
import { withPageEnd } from "@/components/common/content-slots";

const BASE_URL = SITE_CONFIG.baseUrl;
const PAGE_URL = `${BASE_URL}/employment-type-calculator/`;

export const metadata: Metadata = {
  title: "Part-Time vs Full-Time vs Casual Pay Calculator",
  description:
    "Compare take-home pay and entitlements for full-time, part-time and casual work in Australia, including leave, super and casual loading.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Part-Time vs Full-Time vs Casual Calculator — Compare Pay & Entitlements",
    description:
      "Compare take-home pay across full-time, part-time, and casual employment including leave, super, and casual loading.",
    url: PAGE_URL,
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: "en_AU",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Part-Time vs Full-Time vs Casual Calculator",
    description: "Compare full-time, part-time, and casual pay including entitlements and super.",
  },
};

const breadcrumbSchema: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE_URL },
    { "@type": "ListItem", position: 2, name: "Employment Type Calculator", item: PAGE_URL },
  ],
};

const webAppSchema: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Employment Type Calculator — Part-Time vs Full-Time vs Casual",
  url: PAGE_URL,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
  creator: { "@type": "Organization", name: SITE_CONFIG.name },
  dateModified: pageDateModified("employment-type-calculator"),
  inLanguage: "en-AU",
};

const faqSchema = faqPageSchema(EMPLOYMENT_TYPE_FAQS);

const howToSchema = calculatorHowTo({
  name: "How to Use the Employment Type Calculator",
  url: PAGE_URL,
  description: "Compare pay and entitlements across full-time, part-time, and casual employment.",
  steps: PAY_CALCULATOR_STEPS,
});

function Page() {
  return (
    <>
      <JsonLd code={[breadcrumbSchema, webAppSchema, faqSchema, ORGANIZATION_SCHEMA, howToSchema]} />
      <EmploymentTypeCalculatorPage />
    </>
  );
}

export default withPageEnd(Page, "/employment-type-calculator/");
