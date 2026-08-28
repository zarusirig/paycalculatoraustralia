import type { Metadata } from "next";
import PayCalculatorNTPage from "@/modules/state/pay-calculator-nt";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/pay-calculator-nt/`;

export const metadata: Metadata = {
  title: "Pay Calculator NT — Your Take-Home Pay in the Northern Territory",
  description:
    "Work out your take-home pay in the NT. A free salary and wage calculator on current ATO rates, plus the zone tax offset, Picnic Day and long service leave.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Pay Calculator NT — Your Take-Home Pay in the Northern Territory",
    description: "See what you actually take home in the NT after income tax, the Medicare levy and HECS-HELP.",
    url: URL,
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: "en_AU",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pay Calculator NT",
    description: "Your take-home pay in the Northern Territory, plus the zone tax offset and NT holidays.",
  },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Pay Calculator NT", item: URL },
  ],
};

const webAppSchema: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Pay Calculator NT",
  url: URL,
  description: "Take-home pay calculator for employees in the Northern Territory.",
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
      name: "Is income tax different in the Northern Territory?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Income tax brackets, the 2% Medicare levy and HECS-HELP thresholds are federal and apply uniformly across Australia. The zone tax offset is the only NT-linked adjustment, and it is claimed in your tax return rather than withheld from your pay.",
      },
    },
    {
      "@type": "Question",
      name: "Why isn't the zone tax offset in the calculator?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Because it depends on the exact locality you live in and on a residency test of more than half the income year. It is a rebate against tax payable, claimed in your return, so it does not change your fortnightly withholding.",
      },
    },
    {
      "@type": "Question",
      name: "What is Picnic Day?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Picnic Day is a Northern Territory public holiday held on the first Monday in August — 3 August in 2026. It is observed nowhere else in Australia and attracts full public holiday entitlements, including penalty rates under most awards if you work it.",
      },
    },
    {
      "@type": "Question",
      name: "Are district allowances included in my NT long service leave pay?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. NT long service leave is paid at your usual rate of pay, which excludes overtime, penalties, and district and site allowances. If a large part of your income comes from allowances, your leave pay will be noticeably lower than your normal fortnightly pay.",
      },
    },
  ],
};

const howToSchema = calculatorHowTo({
  name: "How to Calculate Take-Home Pay in the Northern Territory",
  url: URL,
  description: "Calculate your take-home pay in the NT in under a minute.",
  steps: PAY_CALCULATOR_STEPS,
});

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webAppSchema, faq, ORGANIZATION_SCHEMA, howToSchema]} />
      <PayCalculatorNTPage />
    </>
  );
}
