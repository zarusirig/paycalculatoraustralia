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
  underInstrument,
  type EmployerPay,
} from "@/lib/data/employer-pay";
import { fitDescription } from "@/lib/seo-title";
import { withPageEnd } from "@/components/common/content-slots";
import { withFeaturedImage } from "@/lib/featured-image";

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
  return `${e.name} Pay Rates 2026 - Hourly Wage by Age & Level`;
}

/** What the page actually shows beyond the adult table, so the description claims nothing it lacks. */
function contentsFor(e: EmployerPay): string {
  const parts = [
    "Every level",
    ...(e.juniorScale.length > 0 ? ["junior rates by age"] : []),
    "penalty rates",
    ...((e.allowances?.length ?? 0) > 0 ? ["allowances"] : []),
  ];
  return `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`;
}

function descriptionFor(e: EmployerPay) {
  const entry = entryRate(e);
  // Batch A (22 Oct 2026): no casual figure where the employer has no adult casuals (ALDI).
  const casual = entry.noCasual ? "" : ` (${formatAUD(entry.casualHourly, 2)} casual)`;
  const lead = `${e.name} pays adults ${formatAUD(entry.hourly, 2)}/hr${casual} at ${entry.level}`;
  const contents = contentsFor(e);
  // 22 Oct 2026: agreement-paid employers already name their agreement in the
  // lead. An award-paid employer with an enterprise agreement section says so,
  // so the snippet answers the "{employer} enterprise agreement" query.
  const agreement = e.enterpriseAgreement?.status === "no-agreement" ? " No enterprise agreement: the award applies." : "";
  const under = underInstrument(e.instrument.title);
  return fitDescription(
    `${lead} under ${under}.${agreement} ${contents}. Verified ${e.verifiedOn}.`,
    `${lead} under ${under}.${agreement} ${contents}.`,
    `${lead} under ${under}.${agreement}`,
    `${lead}. ${contents}.`,
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { employer: slug } = await params;
  const e = getEmployerPay(slug);
  if (!e) return {};

  const title = titleFor(e);
  const description = descriptionFor(e);
  const url = canonicalFor(e.slug);

  return withFeaturedImage({
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: SITE_CONFIG.name, type: "article", locale: "en_AU" },
    twitter: { card: "summary_large_image", title, description },
  });
}

async function Page({ params }: PageProps) {
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

export default withPageEnd(Page, "/pay-rates/[employer]/");
