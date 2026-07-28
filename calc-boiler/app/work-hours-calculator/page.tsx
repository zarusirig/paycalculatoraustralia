import type { Metadata } from "next";
import WorkHoursCalculatorPage from "@/modules/guide/work-hours-calculator-page";
import { WORK_HOURS_FAQS } from "@/modules/guide/work-hours-faqs";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebApplication, WebPage, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS } from "@/lib/authors";
import { CASUAL_LOADING, STANDARD_WEEKLY_HOURS } from "@/lib/constants/work-hours";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/work-hours-calculator/`;

const TITLE = "Work Hours Calculator — Timesheet With Breaks & Overtime";
const DESCRIPTION = `Add up your work hours from start and finish times, take out unpaid breaks and get weekly totals in decimal hours and h:mm. Handles overnight shifts, the ${CASUAL_LOADING * 100}% casual loading and overtime past ${STANDARD_WEEKLY_HOURS} hours.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description:
      "Free multi-day timesheet calculator: start and finish times, unpaid breaks, overnight shifts, decimal and h:mm totals, and gross pay.",
    url: URL,
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: "en_AU",
  },
  twitter: {
    card: "summary_large_image",
    title: "Work Hours Calculator",
    description:
      "Add up a week of shifts, deduct unpaid breaks, handle overnight shifts and price the period.",
  },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Work Hours Calculator", item: URL },
  ],
};

const webPage: WithContext<WebPage> = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: TITLE,
  url: URL,
  description: DESCRIPTION,
  inLanguage: "en-AU",
  author: AUTHORS["penny-ward"].jsonLd,
  publisher: { "@type": "Organization", name: SITE_CONFIG.name },
};

const webApp: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Work Hours & Timesheet Calculator",
  url: URL,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
  creator: { "@type": "Organization", name: SITE_CONFIG.name },
  inLanguage: "en-AU",
  featureList: [
    "Multi-day timesheet with add and remove rows",
    "Overnight shifts that cross midnight",
    "Unpaid break deduction in minutes",
    "Daily and weekly totals in decimal hours and h:mm",
    "Configurable overtime threshold and multipliers",
    `${CASUAL_LOADING * 100}% casual loading`,
    "Gross pay for the period",
    "Printable and copyable summary",
  ],
};

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: WORK_HOURS_FAQS.map((f) => ({
    "@type": "Question" as const,
    name: f.q,
    acceptedAnswer: { "@type": "Answer" as const, text: f.a },
  })),
};

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, webApp, faq]} />
      <WorkHoursCalculatorPage />
    </>
  );
}
