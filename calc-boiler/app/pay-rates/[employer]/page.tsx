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
  juniorRates,
  underInstrument,
  type EmployerPay,
} from "@/lib/data/employer-pay";
import { fitDescription, fitTitle } from "@/lib/seo-title";
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

/**
 * Meta pass (23 Oct 2026): the name searchers type where it differs from the
 * trading name ("maccas", "gyg"), and "EBA" where the queries are about the
 * agreement ("bunnings eba 2026"). Everyone else keeps the standard title.
 */
const TITLE_NAME: Partial<Record<string, string>> = {
  mcdonalds: "McDonald's (Maccas) Pay Rates 2026",
  "guzman-y-gomez": "Guzman y Gomez (GYG) Pay Rates 2026",
  bunnings: "Bunnings Pay Rates & EBA 2026",
};

function titleFor(e: EmployerPay) {
  return fitTitle(
    `${TITLE_NAME[e.slug] ?? `${e.name} Pay Rates 2026`} - Hourly Wage by Age & Level`,
    `${e.name} Pay Rates 2026 - Hourly Wage by Age & Level`,
  );
}

/** Does a junior band label ("Under 16", "16 and under", "17", "20 and over") cover this age? */
function bandCovers(label: string, age: number): boolean {
  const under = /^under (\d+)/i.exec(label);
  if (under) return age < Number(under[1]);
  const andUnder = /^(\d+) and (?:under|younger)/i.exec(label);
  if (andUnder) return age <= Number(andUnder[1]);
  const andOver = /^(\d+) and over/i.exec(label);
  if (andOver) return age >= Number(andOver[1]);
  const exact = /^(\d+)\b/.exec(label);
  return exact ? age === Number(exact[1]) : false;
}

/**
 * Meta pass (23 Oct 2026): most employer queries are "how much does {employer}
 * pay 15 year olds", so the snippet gives the 15 and 16 year old rates from the
 * same junior table the page renders. Null when the employer has no junior rates.
 */
function juniorAnswer(e: EmployerPay): string | null {
  const rows = juniorRates(e);
  const r15 = rows.find((r) => bandCovers(r.age, 15));
  const r16 = rows.find((r) => bandCovers(r.age, 16));
  if (r15 && r16 && r15 === r16) return `15 and 16 year olds get ${formatAUD(r15.hourly, 2)}/hr.`;
  if (r15 && r16) return `15 year olds get ${formatAUD(r15.hourly, 2)}/hr, 16 year olds ${formatAUD(r16.hourly, 2)}.`;
  if (r16) return `16 year olds get ${formatAUD(r16.hourly, 2)}/hr.`;
  return null;
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
  // Meta pass (23 Oct 2026): a replacement agreement voted up but not yet
  // approved (Bunnings) is what "{employer} eba 2026" searchers want to know.
  if (e.enterpriseAgreement?.status === "replacement-before-fwc") {
    const leadNoLevel = `${e.name} pays adults ${formatAUD(entry.hourly, 2)}/hr${casual}`;
    return fitDescription(
      `${leadNoLevel} under ${under}. The new EBA is voted up but not yet approved by the FWC.`,
      `${leadNoLevel}. The new EBA is voted up but not yet approved by the FWC.`,
    );
  }
  const junior = juniorAnswer(e);
  if (junior) {
    // The snippet has already given the junior figures, so the closing list
    // does not repeat "junior rates by age".
    const rest = (e.allowances?.length ?? 0) > 0 ? "All ages, every level, penalty rates and allowances." : "All ages, every level and penalty rates.";
    const leadNoLevel = `${e.name} pays adults ${formatAUD(entry.hourly, 2)}/hr${casual}`;
    return fitDescription(
      `${lead} under ${under}.${agreement} ${junior} ${rest}`,
      `${lead} under ${under}. ${junior} ${rest}`,
      `${leadNoLevel} under ${under}. ${junior} ${rest}`,
      `${lead} under ${under}. ${junior}`,
      `${leadNoLevel} under ${under}. ${junior}`,
      `${lead}. ${junior} ${rest}`,
      `${lead}. ${junior}`,
    );
  }
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
