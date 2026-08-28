import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LongServiceLeaveSpoke } from "@/modules/calculator/long-service-leave-content";
// See the hub page: FAQ data must not cross the "use client" boundary.
import { spokeFaqs } from "@/modules/calculator/long-service-leave-faqs";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { ORGANIZATION_SCHEMA, calculatorHowTo } from "@/lib/schema";
import {
  JURISDICTION_CODES,
  LSL_JURISDICTIONS,
  accruedWeeks,
  serviceFromParts,
  type JurisdictionCode,
} from "@/lib/constants/long-service-leave";

const BASE = SITE_CONFIG.baseUrl;

interface PageProps {
  params: Promise<{ state: string }>;
}

export async function generateStaticParams() {
  return JURISDICTION_CODES.map((state) => ({ state }));
}

function resolve(raw: string): JurisdictionCode | null {
  const code = raw.toLowerCase() as JurisdictionCode;
  return JURISDICTION_CODES.includes(code) ? code : null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { state } = await params;
  const code = resolve(state);
  if (!code) return {};
  const j = LSL_JURISDICTIONS[code];
  const url = `${BASE}/long-service-leave-calculator/${code}/`;

  const title = `Long Service Leave Calculator ${j.abbr} — ${j.weeksAtQualifying} Weeks After ${j.takeAfterYears} Years`;
  const description = `How much long service leave you get ${j.inName}: ${j.weeksAtQualifying} weeks at ${j.takeAfterYears} years under the ${j.act}, accruing ${j.weeksPerYear.toFixed(4)} weeks a year. Pro-rata from ${j.proRataFromYears} years, what a resignation pays, casual and part-time rules, cashing out, and the tax on a payout.`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_CONFIG.name,
      type: "website",
      locale: "en_AU",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function Page({ params }: PageProps) {
  const { state } = await params;
  const code = resolve(state);
  if (!code) notFound();

  const j = LSL_JURISDICTIONS[code];
  const url = `${BASE}/long-service-leave-calculator/${code}/`;
  const faqs = spokeFaqs(code);

  const breadcrumb: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
      {
        "@type": "ListItem",
        position: 2,
        name: "Long Service Leave Calculator",
        item: `${BASE}/long-service-leave-calculator/`,
      },
      { "@type": "ListItem", position: 3, name: `${j.abbr} Long Service Leave`, item: url },
    ],
  };

  const webApp: WithContext<WebApplication> = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": `${url}#webpage`,
    name: `Long Service Leave Calculator ${j.abbr}`,
    url,
    description: `Long service leave ${j.inName} under the ${j.act}: ${j.weeksAtQualifying} weeks after ${j.takeAfterYears} years of continuous service.`,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    browserRequirements: "Requires JavaScript",
    offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
    creator: { "@type": "Organization", name: SITE_CONFIG.name },
    dateModified: new Date().toISOString().split("T")[0],
    inLanguage: "en-AU",
  };

  // Built from the same array the on-page accordion renders.
  const faq: WithContext<FAQPage> = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question" as const,
      name: f.q,
      acceptedAnswer: { "@type": "Answer" as const, text: f.a },
    })),
  };

  const tenYearWeeks = accruedWeeks(code, serviceFromParts(10)).toFixed(2);

  const howToSchema = calculatorHowTo({
    name: `How to Work Out Long Service Leave ${j.inName}`,
    url,
    description: `Work out ${j.abbr} long service leave under the ${j.act} from your start date and ordinary weekly pay.`,
    steps: [
      {
        name: "Enter your first day of continuous service",
        text: `Use the date you started with this employer. ${j.abbr} counts service with a previous owner where the business changed hands.`,
      },
      {
        name: "Enter your ordinary weekly pay",
        text: "Ordinary time only, before tax and excluding overtime. Part-time and casual employees enter their own actual weekly pay.",
      },
      {
        name: "Read the weeks accrued",
        text: `${j.abbr} accrues ${j.weeksPerYear.toFixed(4)} weeks a year, so 10 years is ${tenYearWeeks} weeks.`,
      },
      {
        name: "Check whether you can take it yet",
        text: `Leave can be taken ${j.inName} after ${j.takeAfterYears} years of continuous service, when ${j.weeksAtQualifying} weeks is available.`,
      },
      {
        name: "Check what a payout would be",
        text: `Switch to "no longer employed" and choose why the job ended. ${j.abbr} pays pro-rata from ${j.proRataFromYears} years, and the calculator applies the ATO withholding to the gross figure.`,
      },
    ],
  });

  return (
    <>
      <JsonLd code={[breadcrumb, webApp, faq, ORGANIZATION_SCHEMA, howToSchema]} />
      <LongServiceLeaveSpoke code={code} />
    </>
  );
}
