import type { Metadata } from "next";
import type { BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import ProRataSalaryPage from "@/modules/guide/pro-rata-salary";
import { PRO_RATA_EXAMPLE, PRO_RATA_FAQS } from "@/modules/guide/pro-rata-salary-faqs";
import { JsonLd } from "@/modules/seo/json-ld";
import { SITE_CONFIG, formatAUD } from "@/lib/constants";
import { calculatorHowTo } from "@/lib/schema";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/pro-rata-salary-calculator/`;

const TITLE = `Pro-Rata Salary Calculator ${SITE_CONFIG.financialYear}: Part-Time Pay After Tax`;
const DESCRIPTION = `Work out a pro-rata salary from the full-time (FTE) salary and your hours or days. ${formatAUD(PRO_RATA_EXAMPLE.fte)} at 3 days a week = ${formatAUD(PRO_RATA_EXAMPLE.threeDays.annualSalary)}. Weekly, fortnightly and after-tax pay.`;

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
    { "@type": "ListItem", position: 2, name: "Pro-Rata Salary Calculator", item: URL },
  ],
};

const webApp: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "@id": `${URL}#webpage`,
  name: "Pro-Rata Salary Calculator",
  url: URL,
  description: DESCRIPTION,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
  creator: { "@type": "Organization", name: SITE_CONFIG.name },
  inLanguage: "en-AU",
};

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: PRO_RATA_FAQS.map((f) => ({
    "@type": "Question" as const,
    name: f.q,
    acceptedAnswer: { "@type": "Answer" as const, text: f.a },
  })),
};

const howTo = calculatorHowTo({
  name: "How to Calculate a Pro-Rata Salary",
  url: URL,
  description: "Scale a full-time salary to part-time hours or days, then see it per pay period and after tax.",
  steps: [
    { name: "Enter the full-time salary", text: "Use the full-time equivalent (FTE) figure from the job ad or contract, before tax and excluding super." },
    { name: "Enter your hours or days", text: "Enter your ordinary hours a week against full-time hours (usually 38), or your days against five." },
    { name: "Set the months worked", text: "Leave at 12 for a full year, or reduce it if you start or finish part-way through." },
    { name: "Read the result", text: "The calculator shows the pro-rata salary, weekly, fortnightly and monthly pay, and take-home pay after tax." },
  ],
});

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webApp, faq, howTo]} />
      <ProRataSalaryPage />
    </>
  );
}
