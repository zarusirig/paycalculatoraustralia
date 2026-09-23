import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { BreadcrumbList, FAQPage, WebPage, WithContext } from "schema-dts";
import JobPayRatesOccupationPage, { occupationHeading } from "@/modules/guide/job-pay-rates-occupation";
import { JsonLd } from "@/modules/seo/json-ld";
import { SITE_CONFIG, formatAUD } from "@/lib/constants";
import { ORGANIZATION_SCHEMA } from "@/lib/schema";
import {
  OCCUPATION_SLUGS,
  getOccupation,
  headlineRow,
  type Occupation,
} from "@/lib/data/job-pay-rates";

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

function money(n: number) {
  return formatAUD(n, 2);
}

/** Title leads with the answer: the hourly minimum, or the median for award-free jobs. */
function titleFor(occ: Occupation): string {
  if (occ.metaTitle) return occ.metaTitle;
  const r = headlineRow(occ);
  if (r) return `${occ.name} Pay Rates Australia 2026 — ${money(r.hourly)}/hr Award Minimum`;
  if (occ.median) return `${occ.name} Pay Rates Australia 2026 — No Award, ${formatAUD(occ.median.medianWeekly)}/wk Median`;
  return occupationHeading(occ);
}

function descriptionFor(occ: Occupation): string {
  const r = headlineRow(occ);
  if (r && occ.award) {
    return `${occ.name} award pay rates for 2026–27 under the ${occ.award.name} [${occ.award.code}]: ${money(r.hourly)}/hr, ${money(r.weekly)}/wk${r.casualHourly !== null ? `, casual ${money(r.casualHourly)}/hr` : ""}. Every classification, penalty rates, overtime and take-home pay. Verified ${occ.verifiedOn}.`;
  }
  return `Is there an award for ${occ.plural}? What the law requires (the National Minimum Wage), the ${occ.median ? `${formatAUD(occ.median.medianWeekly)} a week median` : "market median"}, and take-home pay. Verified ${occ.verifiedOn}.`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { occupation } = await params;
  const occ = getOccupation(occupation);
  if (!occ) return {};
  const title = titleFor(occ);
  const description = descriptionFor(occ);
  const url = canonicalFor(occ.slug);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: SITE_CONFIG.name, type: "article", locale: "en_AU" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function Page({ params }: PageProps) {
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
      { "@type": "ListItem", position: 3, name: `${occ.name} Pay Rates`, item: url },
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
    dateModified: "2026-09-23",
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
