import type { Metadata } from "next";
import SalarySacrificeCalculatorPage from "@/modules/calculator/salary-sacrifice-calculator";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/salary-sacrifice-calculator/`;

export const metadata: Metadata = {
  title: "Salary Sacrifice Calculator — How Much Will You Save?",
  description:
    "Compare take-home pay before and after salary sacrifice. See your tax savings, super boost & actual benefit. Free Australian calculator updated for FY2025-26.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Salary Sacrifice Calculator — How Much Will You Save?",
    description: "Compare your pay before and after salary sacrifice. See the tax savings instantly.",
    url: URL,
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: "en_AU",
  },
  twitter: {
    card: "summary_large_image",
    title: "Salary Sacrifice Calculator Australia",
    description: "Compare pay before and after sacrifice. See your tax savings.",
  },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Salary Sacrifice Calculator", item: URL },
  ],
};

const webApp: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Salary Sacrifice Calculator Australia",
  url: URL,
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
      name: "How much can I salary sacrifice?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "There's no legal limit, but total concessional super contributions (employer SG + salary sacrifice) can't exceed $30,000 per year without penalty. On $100,000, your employer contributes $12,000, leaving room for up to $18,000 in sacrifice.",
      },
    },
    {
      "@type": "Question",
      name: "Does salary sacrifice reduce my take-home pay?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — the amount you sacrifice is redirected before tax. But the tax saving means you lose less than the full amount. Sacrificing $10,000 on $80,000 reduces take-home by only $6,800.",
      },
    },
    {
      "@type": "Question",
      name: "Can I salary sacrifice into things other than super?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Salary sacrifice can also be used for novated leases, additional employer super, and some other items. Non-super items may attract FBT. Super sacrifice is the most tax-effective for most people.",
      },
    },
    {
      "@type": "Question",
      name: "Should I salary sacrifice or pay off my mortgage?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "If your mortgage rate is higher than your expected super return (after tax advantage), prioritise the mortgage. At current rates, salary sacrifice into super typically offers a better after-tax return.",
      },
    },
  ],
};

const howToSchema = calculatorHowTo({
  name: "How to Use the Salary Sacrifice Calculator",
  url: URL,
  description: "Calculate your salary sacrifice tax savings in under a minute.",
  steps: PAY_CALCULATOR_STEPS,
});

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webApp, faq, ORGANIZATION_SCHEMA, howToSchema]} />
      <SalarySacrificeCalculatorPage />
    </>
  );
}
