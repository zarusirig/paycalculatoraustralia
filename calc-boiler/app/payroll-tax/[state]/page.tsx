import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import PayrollTaxStatePage from "@/modules/payroll-tax/payroll-tax-state-page";
import { stateFaqs } from "@/modules/payroll-tax/content";
import { JsonLd } from "@/modules/seo/json-ld";
import { SITE_CONFIG, formatAUD } from "@/lib/constants";
import { millions } from "@/modules/payroll-tax/format";
import {
  PAYROLL_TAX_FY,
  PAYROLL_TAX_STATE_CODES,
  PAYROLL_TAX_STATES,
  isPayrollTaxStateCode,
} from "@/lib/constants/payroll-tax";

const BASE = SITE_CONFIG.baseUrl;

interface PageProps {
  params: Promise<{ state: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  return PAYROLL_TAX_STATE_CODES.map((state) => ({ state }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { state } = await params;
  if (!isPayrollTaxStateCode(state)) return {};
  const s = PAYROLL_TAX_STATES[state];
  const url = `${BASE}/payroll-tax/${state}/`;
  const title = `${s.abbr} Payroll Tax ${PAYROLL_TAX_FY}: ${s.headlineRate} Rate, ${millions(s.annualThreshold)} Threshold, Calculator`;
  const description = `${s.name} payroll tax for ${PAYROLL_TAX_FY}: ${s.headlineRate} above a ${formatAUD(s.annualThreshold)} threshold. How to calculate it, worked examples, who must register, due dates, and a calculator set to ${s.abbr}.`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function Page({ params }: PageProps) {
  const { state } = await params;
  if (!isPayrollTaxStateCode(state)) notFound();
  const s = PAYROLL_TAX_STATES[state];
  const url = `${BASE}/payroll-tax/${state}/`;

  const breadcrumb: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
      { "@type": "ListItem", position: 2, name: "Payroll Tax", item: `${BASE}/payroll-tax/` },
      { "@type": "ListItem", position: 3, name: `${s.abbr} Payroll Tax`, item: url },
    ],
  };

  const webApp: WithContext<WebApplication> = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": `${url}#webpage`,
    name: `${s.abbr} Payroll Tax Calculator`,
    url,
    description: `Annual ${s.name} payroll tax on ${PAYROLL_TAX_FY} rates.`,
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
    mainEntity: stateFaqs(state).map((f) => ({
      "@type": "Question" as const,
      name: f.q,
      acceptedAnswer: { "@type": "Answer" as const, text: f.a },
    })),
  };

  return (
    <>
      <JsonLd code={[breadcrumb, webApp, faq]} />
      <PayrollTaxStatePage code={state} />
    </>
  );
}
