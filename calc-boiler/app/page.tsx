import type { Metadata } from "next";
import HomePage from "@/modules/home/templates";
import { JsonLd } from "@/modules/seo/json-ld";
import type {
  BreadcrumbList,
  FAQPage,
  Organization,
  WebApplication,
  WebSite,
  WithContext,
} from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  alternates: { canonical: `${SITE_CONFIG.baseUrl}/` },
};

const organizationSchema: WithContext<Organization> = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_CONFIG.name,
  url: SITE_CONFIG.baseUrl,
  logo: `${SITE_CONFIG.baseUrl}/logo.png`,
  description:
    "Free Australian pay calculator with income tax, super, Medicare levy & HECS. Updated for FY2025-26.",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    email: SITE_CONFIG.email,
  },
  knowsAbout: [
    "Australian income tax",
    "superannuation",
    "Medicare levy",
    "HECS-HELP repayments",
    "salary sacrifice",
    "Australian employment law",
    "pay calculation",
  ],
};

const websiteSchema: WithContext<WebSite> = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_CONFIG.name,
  url: SITE_CONFIG.baseUrl,
  description:
    "Free Australian pay & income tax calculator. Calculate take-home pay, income tax, super, Medicare & HECS for FY2025-26.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_CONFIG.baseUrl}/?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  } as unknown as WebSite["potentialAction"],
};

const webAppSchema: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Pay Calculator Australia — Free Take-Home Pay Calculator",
  url: SITE_CONFIG.baseUrl,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "AUD",
  },
  creator: {
    "@type": "Organization",
    name: SITE_CONFIG.name,
  },
  dateModified: new Date().toISOString().split("T")[0],
  inLanguage: "en-AU",
};

const breadcrumbSchema: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Pay Calculator",
      item: SITE_CONFIG.baseUrl,
    },
  ],
};

const faqSchema: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How much tax do I pay on $80,000 in Australia?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "On an $80,000 salary in FY2025-26, you pay $14,788 in income tax plus $1,600 in Medicare levy — a total of $16,388. Your take-home pay is approximately $63,612 per year, or $1,223.31 per week. Your employer also pays $9,600 into your super fund on top of your salary.",
      },
    },
    {
      "@type": "Question",
      name: "What is the tax-free threshold in Australia?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The tax-free threshold is $18,200. You pay no income tax on the first $18,200 you earn. With the Low Income Tax Offset (LITO), the effective tax-free threshold increases to $22,575.",
      },
    },
    {
      "@type": "Question",
      name: "How much super does my employer pay?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "From 1 July 2025, employers must pay 12% of your Ordinary Time Earnings into your super fund. On an $80,000 salary, that's $9,600 per year. This is paid on top of your salary — it doesn't reduce your take-home pay.",
      },
    },
    {
      "@type": "Question",
      name: "What is the Medicare levy?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Medicare levy is 2% of your taxable income, collected to help fund Australia's public healthcare system. On $80,000, that's $1,600 per year. Low-income earners below approximately $27,222 may pay a reduced levy or be exempt.",
      },
    },
    {
      "@type": "Question",
      name: "How do HECS-HELP repayments work in 2025-26?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "From FY2025-26, HECS-HELP uses a new marginal repayment system. Compulsory repayments start when your income reaches $69,528, and you only pay on the amount above the threshold — not on your total income.",
      },
    },
    {
      "@type": "Question",
      name: "What's the difference between gross and net pay?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Gross pay is your total salary before any deductions. Net pay (or take-home pay) is what you actually receive after income tax, Medicare levy, and any HECS repayments are deducted. For example, $80,000 gross becomes approximately $63,612 net.",
      },
    },
  ],
};

export default function Home() {
  return (
    <>
      <JsonLd
        code={[
          organizationSchema,
          websiteSchema,
          webAppSchema,
          breadcrumbSchema,
          faqSchema,
        ]}
      />
      <HomePage />
    </>
  );
}
