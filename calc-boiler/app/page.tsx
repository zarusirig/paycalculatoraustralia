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
import { HOME_FAQS } from "@/modules/home/home-faqs";
import { calculatePayBreakdown, formatAUD, SITE_CONFIG, SUPER_GUARANTEE } from "@/lib/constants";
import { pageDateModified } from "@/lib/page-dates";

const FY = SITE_CONFIG.financialYear;

// Derived from the engine so the title, description, JSON-LD and rendered page
// can never disagree — the defect class that put stale figures into Google's
// index on /tax-on/.
const BD80 = calculatePayBreakdown({ grossSalary: 80_000 });

// No brand suffix: the root layout title template is "%s" (see app/layout.tsx).
// Year in the title is the challenger pattern winning this SERP (emumoney).
// Sep 2026 head-term intent map (docs/seo/2026-09-23-head-term-intent-map.md):
// the homepage is the ONE primary URL for "pay calculator australia",
// "pay calculator" and "salary calculator" (+ "salary calculator australia").
// Live SERPs for those terms are won by homepage-style all-in-one calculators
// (paycalculator.com.au, wagecalculator, emumoney), and we already sit #13-15
// with this URL. "Take home pay calculator", "net pay" and "after tax income"
// moved to /take-home-pay-calculator/; "tax calculator australia" to
// /income-tax-calculator/ — so "Tax" and "Take-Home" leave this title.
// Previous: "Pay Calculator Australia ${FY} — Salary, Tax & Take-Home Pay".
const TITLE = `Pay Calculator Australia ${FY} — Salary Calculator After Tax`;
const DESCRIPTION = `On $80,000 you take home ${formatAUD(BD80.takeHomePay)} a year (${formatAUD(BD80.weekly)} a week) in ${FY}. Free Australian pay and salary calculator for any salary, hourly or casual wage — after tax, Medicare, HECS and ${Math.round(SUPER_GUARANTEE.rate * 100)}% super.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_CONFIG.baseUrl}/` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.baseUrl}/`,
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: "en_AU",
    images: ["/og-image.png"],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const organizationSchema: WithContext<Organization> = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_CONFIG.name,
  url: SITE_CONFIG.baseUrl,
  logo: `${SITE_CONFIG.baseUrl}/icon-512.png`,
  description: `Free Australian pay calculator with income tax, super, Medicare levy & HECS. Updated for FY${FY}.`,
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
    "casual loading and penalty rates",
    "Australian employment law",
    "pay calculation",
  ],
};

const websiteSchema: WithContext<WebSite> = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_CONFIG.name,
  url: `${SITE_CONFIG.baseUrl}/`,
  description: `Free Australian pay & salary calculator. Calculate take-home pay, income tax, super, Medicare & HECS for FY${FY}.`,
  // No SearchAction: the site has no search results page (/?q= just renders
  // the homepage, and robots.txt disallows /*?*), and Google retired the
  // sitelinks search box in Nov 2024.
};

const webAppSchema: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: `Pay Calculator Australia ${FY} — Salary Calculator`,
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
  dateModified: pageDateModified(""),
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
      item: `${SITE_CONFIG.baseUrl}/`,
    },
  ],
};

// Built from the SAME array the page renders (sr-only mirror + accordion), so
// 100% of visible questions are in the structured data and cannot drift.
const faqSchema: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: HOME_FAQS.map((f) => ({
    "@type": "Question" as const,
    name: f.q,
    acceptedAnswer: { "@type": "Answer" as const, text: f.a },
  })),
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
