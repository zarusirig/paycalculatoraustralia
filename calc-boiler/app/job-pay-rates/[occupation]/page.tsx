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
import { fitDescription, fitTitle } from "@/lib/seo-title";
import { withPageEnd } from "@/components/common/content-slots";

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
  if (r) {
    // Long occupation names pushed 16 of these titles past ~65 characters,
    // where Google cuts them mid-figure. Keep the fullest form that fits.
    const hourly = `${money(r.hourly)}/hr`;
    const forms = [
      `${occ.name} Pay Rates Australia 2026 — ${hourly} Award Minimum`,
      `${occ.name} Pay Rates Australia 2026 — ${hourly} Minimum`,
      `${occ.name} Pay Rates 2026 — ${hourly} Award Minimum`,
      `${occ.name} Pay Rates 2026 — ${hourly} Minimum`,
    ];
    return forms.find((t) => t.length <= 65) ?? forms[forms.length - 1];
  }
  if (occ.median) {
    const median = `${formatAUD(occ.median.medianWeekly)}/wk Median`;
    return fitTitle(
      `${occ.name} Pay Rates Australia 2026 — No Award, ${median}`,
      `${occ.name} Pay Rates 2026 — No Award, ${median}`,
      `${occ.name} Pay Rates 2026 — ${median}`,
    );
  }
  return occupationHeading(occ);
}

function descriptionFor(occ: Occupation): string {
  const r = headlineRow(occ);
  if (r && occ.award) {
    // Award names run long ("Electrical, Electronic and Communications Contracting
    // Award 2020"): the rates lead, and the award is named in full only if it fits.
    const rates = `${money(r.hourly)}/hr, ${money(r.weekly)}/wk${r.casualHourly !== null ? `, casual ${money(r.casualHourly)}/hr` : ""}`;
    return fitDescription(
      `${occ.name} award pay rates for 2026–27 under the ${occ.award.name} [${occ.award.code}]: ${rates}. Every classification, penalty rates, overtime and take-home pay. Verified ${occ.verifiedOn}.`,
      `${occ.name} award pay rates for 2026–27 under the ${occ.award.name} [${occ.award.code}]: ${rates}. Every classification, penalty rates and take-home pay.`,
      `${occ.name} award pay rates for 2026–27: ${rates} under the ${occ.award.name}. Penalty rates and take-home pay.`,
      `${occ.name} award pay rates for 2026–27: ${rates} under ${occ.award.code}. Every classification, penalty rates and take-home pay.`,
      `${occ.name} award pay rates for 2026–27: ${rates} under ${occ.award.code}. Penalty rates and take-home pay.`,
    );
  }
  return fitDescription(
    `Is there an award for ${occ.plural}? What the law requires (the National Minimum Wage), the ${occ.median ? `${formatAUD(occ.median.medianWeekly)} a week median` : "market median"}, and take-home pay. Verified ${occ.verifiedOn}.`,
    `Is there an award for ${occ.plural}? What the law requires (the National Minimum Wage), the ${occ.median ? `${formatAUD(occ.median.medianWeekly)} a week median` : "market median"}, and take-home pay.`,
  );
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
    openGraph: { title, description, url, siteName: SITE_CONFIG.name, type: "article", locale: "en_AU", images: ["/og-image.png"] },
    twitter: { card: "summary_large_image", title, description },
  };
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

export default withPageEnd(Page, "/job-pay-rates/[occupation]/");
