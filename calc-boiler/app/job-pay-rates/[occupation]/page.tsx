import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { BreadcrumbList, FAQPage, WebPage, WithContext } from "schema-dts";
import JobPayRatesOccupationPage, { occupationHeading } from "@/modules/guide/job-pay-rates-occupation";
import { JsonLd } from "@/modules/seo/json-ld";
import { SITE_CONFIG } from "@/lib/constants";
import { ORGANIZATION_SCHEMA } from "@/lib/schema";
import {
  OCCUPATION_SLUGS,
  getOccupation,
  type Occupation,
} from "@/lib/data/job-pay-rates";
import { occupationMetaDescription, occupationMetaTitle } from "@/lib/data/job-pay-rates/meta";
import { withPageEnd } from "@/components/common/content-slots";
import { withFeaturedImage } from "@/lib/featured-image";

const BASE = SITE_CONFIG.baseUrl;

interface PageProps {
  params: Promise<{ occupation: string }>;
}

export async function generateStaticParams() {
  return OCCUPATION_SLUGS.map((occupation) => ({ occupation }));
}

function canonicalFor(slug: string) {
  return `${BASE}/job-pay-rates/${slug}/`;
}

/** Title and description templates live in lib/data/job-pay-rates/meta.ts. */
function titleFor(occ: Occupation): string {
  return occupationMetaTitle(occ) ?? occupationHeading(occ);
}

function descriptionFor(occ: Occupation): string {
  return occupationMetaDescription(occ);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { occupation } = await params;
  const occ = getOccupation(occupation);
  if (!occ) return {};
  const title = titleFor(occ);
  const description = descriptionFor(occ);
  const url = canonicalFor(occ.slug);
  return withFeaturedImage({
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: SITE_CONFIG.name, type: "article", locale: "en_AU" },
    twitter: { card: "summary_large_image", title, description },
  });
}

async function Page({ params }: PageProps) {
  const { occupation } = await params;
  const occ = getOccupation(occupation);
  if (!occ) notFound();

  const url = canonicalFor(occ.slug);

  const breadcrumb: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
      { "@type": "ListItem", position: 2, name: "Job Pay Rates", item: `${BASE}/job-pay-rates/` },
      ...(occ.parent
        ? [
            { "@type": "ListItem" as const, position: 3, name: occ.parent.label, item: `${BASE}${occ.parent.href}` },
            { "@type": "ListItem" as const, position: 4, name: `${occ.name} Pay Rates`, item: url },
          ]
        : [{ "@type": "ListItem" as const, position: 3, name: `${occ.name} Pay Rates`, item: url }]),
    ],
  };

  const webPage: WithContext<WebPage> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    name: occupationHeading(occ),
    url,
    description: descriptionFor(occ),
    inLanguage: "en-AU",
    dateModified: occ.dateModified ?? "2026-09-23",
    publisher: { "@type": "Organization", name: SITE_CONFIG.name },
  };

  // Built from the same array the accordion renders, so markup and visible
  // answers cannot drift.
  const faq: WithContext<FAQPage> = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: occ.faqs.map((f) => ({
      "@type": "Question" as const,
      name: f.q,
      acceptedAnswer: { "@type": "Answer" as const, text: f.a },
    })),
  };

  return (
    <>
      <JsonLd code={[breadcrumb, webPage, faq, ORGANIZATION_SCHEMA]} />
      <JobPayRatesOccupationPage occ={occ} />
    </>
  );
}

export default withPageEnd(Page, "/job-pay-rates/[occupation]/");
