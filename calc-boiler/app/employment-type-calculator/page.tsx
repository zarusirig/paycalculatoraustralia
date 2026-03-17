import type { Metadata } from "next";
import EmploymentTypeCalculatorPage from "@/modules/calculator/employment-type-calculator";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";

const BASE_URL = SITE_CONFIG.baseUrl;
const PAGE_URL = `${BASE_URL}/employment-type-calculator/`;

export const metadata: Metadata = {
  title: "Part-Time vs Full-Time vs Casual Calculator — Compare Pay & Entitlements",
  description:
    "Compare take-home pay and entitlements across employment types. See the real difference between full-time, part-time, and casual including leave, super, and casual loading.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Part-Time vs Full-Time vs Casual Calculator — Compare Pay & Entitlements",
    description:
      "Compare take-home pay across full-time, part-time, and casual employment including leave, super, and casual loading.",
    url: PAGE_URL,
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: "en_AU",
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
  dateModified: new Date().toISOString().split("T")[0],
  inLanguage: "en-AU",
};

const faqSchema: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is casual loading better than annual leave?",
      acceptedAnswer: { "@type": "Answer", text: "The 25% casual loading compensates for the lack of paid leave. For most workers, the total value of annual leave (4 weeks), personal leave (10 days), and public holidays exceeds the 25% loading, making permanent employment more valuable in total package terms." },
    },
    {
      "@type": "Question",
      name: "Do casual workers get superannuation?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. All employees including casuals receive the 12% superannuation guarantee from their employer, calculated on ordinary time earnings including the casual loading." },
    },
    {
      "@type": "Question",
      name: "What is the difference between part-time and casual?",
      acceptedAnswer: { "@type": "Answer", text: "Part-time employees work regular guaranteed hours (under 38 per week), receive paid leave, and have ongoing employment. Casual employees have no guaranteed hours, receive 25% casual loading instead of leave, and can be terminated without notice." },
    },
    {
      "@type": "Question",
      name: "Can I convert from casual to permanent?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. Under the Fair Work Act, casual employees who have worked regular hours for 12 months can request conversion to permanent (full-time or part-time) employment. Employers with 15+ employees must offer conversion if the criteria are met." },
    },
  ],
};

const howToSchema = calculatorHowTo({
  name: "How to Use the Employment Type Calculator",
  url: PAGE_URL,
  description: "Compare pay and entitlements across full-time, part-time, and casual employment.",
  steps: PAY_CALCULATOR_STEPS,
});

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumbSchema, webAppSchema, faqSchema, ORGANIZATION_SCHEMA, howToSchema]} />
      <EmploymentTypeCalculatorPage />
    </>
  );
}
