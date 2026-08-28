import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PublicServicePayJurisdictionPage from "@/modules/guide/public-service-pay-jurisdiction";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, Dataset, FAQPage, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { ORGANIZATION_SCHEMA } from "@/lib/schema";
import { JURISDICTION_SLUGS, getJurisdiction } from "@/lib/data/public-service-pay";

interface PageProps {
  params: Promise<{ jurisdiction: string }>;
}

// Exactly the jurisdictions with verified data. NSW, WA, SA, TAS, ACT and NT
// are listed on the hub as not yet covered rather than generated empty.
export async function generateStaticParams() {
  return JURISDICTION_SLUGS.map((jurisdiction) => ({ jurisdiction }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { jurisdiction: slug } = await params;
  const jurisdiction = getJurisdiction(slug);
  if (!jurisdiction) return {};

  const url = `${SITE_CONFIG.baseUrl}/public-service-pay-scales/${jurisdiction.slug}/`;
  return {
    title: jurisdiction.metaTitle,
    description: jurisdiction.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: jurisdiction.metaTitle,
      description: jurisdiction.metaDescription,
      url,
      siteName: SITE_CONFIG.name,
      type: "website",
      locale: "en_AU",
    },
    twitter: {
      card: "summary_large_image",
      title: jurisdiction.metaTitle,
      description: jurisdiction.metaDescription,
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { jurisdiction: slug } = await params;
  const jurisdiction = getJurisdiction(slug);
  if (!jurisdiction) notFound();

  const BASE = SITE_CONFIG.baseUrl;
  const URL = `${BASE}/public-service-pay-scales/${jurisdiction.slug}/`;

  const breadcrumb: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
      {
        "@type": "ListItem",
        position: 2,
        name: "Public Service Pay Scales",
        item: `${BASE}/public-service-pay-scales/`,
      },
      { "@type": "ListItem", position: 3, name: jurisdiction.label, item: URL },
    ],
  };

  const faq: WithContext<FAQPage> = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: jurisdiction.faqs.map((f) => ({
      "@type": "Question" as const,
      name: f.q,
      acceptedAnswer: { "@type": "Answer" as const, text: f.a },
    })),
  };

  // The page is a transcription of published pay schedules, so it declares the
  // instruments it came from rather than claiming the rates as original data.
  const dataset: WithContext<Dataset> = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "@id": `${URL}#dataset`,
    name: `${jurisdiction.name} classification salary schedule`,
    description: jurisdiction.metaDescription,
    url: URL,
    inLanguage: "en-AU",
    creator: { "@type": "Organization", name: SITE_CONFIG.name },
    isBasedOn: jurisdiction.sources.map((source) => source.url),
    temporalCoverage: jurisdiction.schedules[0].effectiveFrom,
    dateModified: jurisdiction.verifiedOn,
  };

  return (
    <>
      <JsonLd code={[breadcrumb, faq, dataset, ORGANIZATION_SCHEMA]} />
      <PublicServicePayJurisdictionPage jurisdiction={jurisdiction} />
    </>
  );
}
