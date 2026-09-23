import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EmployerPayRatesPage from "@/modules/guide/employer-pay-rates";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebPage, WithContext } from "schema-dts";
import { SITE_CONFIG, formatAUD } from "@/lib/constants";
import { ORGANIZATION_SCHEMA } from "@/lib/schema";
import {
  EMPLOYER_SLUGS,
  entryRate,
  getEmployerPay,
  type EmployerPay,
} from "@/lib/data/employer-pay";

const BASE = SITE_CONFIG.baseUrl;

interface PageProps {
  params: Promise<{ employer: string }>;
}

export async function generateStaticParams() {
  return EMPLOYER_SLUGS.map((employer) => ({ employer }));
}

function canonicalFor(slug: string) {
  return `${BASE}/pay-rates/${slug}/`;
}

function titleFor(e: EmployerPay) {
  return `${e.name} Pay Rates 2026 — Hourly Wage by Age & Level`;
}

function descriptionFor(e: EmployerPay) {
  const entry = entryRate(e);
  return `${e.name} pays adults ${formatAUD(entry.hourly, 2)}/hr (${formatAUD(entry.casualHourly, 2)} casual) at ${entry.level} under the ${e.instrument.title}. Every level, junior rates by age, penalty rates and weekly pay. Verified ${e.verifiedOn}.`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { employer: slug } = await params;
  const e = getEmployerPay(slug);
  if (!e) return {};

  const title = titleFor(e);
  const description = descriptionFor(e);
  const url = canonicalFor(e.slug);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: SITE_CONFIG.name, type: "article", locale: "en_AU", images: ["/og-image.png"] },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function Page({ params }: PageProps) {
  const { employer: slug } = await params;
  const e = getEmployerPay(slug);
  if (!e) notFound();

  const url = canonicalFor(e.slug);

  const breadcrumb: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
      { "@type": "ListItem", position: 2, name: "Pay Rates by Employer", item: `${BASE}/pay-rates/` },
      { "@type": "ListItem", position: 3, name: `${e.name} Pay Rates`, item: url },
    ],
  };

  const webPage: WithContext<WebPage> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    name: titleFor(e),
    url,
    description: descriptionFor(e),
    inLanguage: "en-AU",
    datePublished: e.verifiedOn,
    publisher: { "@type": "Organization", name: SITE_CONFIG.name },
  };

  // Built from the same array the accordion renders, so markup cannot drift
  // from the visible answers.
  const faq: WithContext<FAQPage> | null =
    e.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: e.faqs.map((f) => ({
            "@type": "Question" as const,
            name: f.q,
            acceptedAnswer: { "@type": "Answer" as const, text: f.a },
          })),
        }
      : null;

  const schemas = [breadcrumb, webPage, ...(faq ? [faq] : []), ORGANIZATION_SCHEMA];

  return (
    <>
      <JsonLd code={schemas} />
      <EmployerPayRatesPage employer={e} />
    </>
  );
}
