import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Article, BreadcrumbList, FAQPage, WithContext } from "schema-dts";

import NursingPayStatePage from "@/modules/guide/nursing-pay-state";
import { JsonLd } from "@/modules/seo/json-ld";
import { ORGANIZATION_SCHEMA } from "@/lib/schema";
import { SITE_CONFIG, formatAUD } from "@/lib/constants";
import {
  NURSING_PAY_STATES,
  getNursingPay,
  hourlyFor,
  nursingPageH1,
  ratesYear,
  nursingPageTitle,
  registeredNurseLadder as registeredNurseRange,
  resolveKeyGrade,
} from "@/lib/data/nursing-pay";
import { nursingStateFaqs } from "@/lib/data/nursing-pay/faqs";
import { pageDateModified, pageDatePublished } from "@/lib/page-dates";
import { fitDescription } from "@/lib/seo-title";
import { withPageEnd } from "@/components/common/content-slots";
import { withFeaturedImage } from "@/lib/featured-image";

const BASE = SITE_CONFIG.baseUrl;

interface PageProps {
  params: Promise<{ state: string }>;
}

/** All eight states and territories (ACT and NT added in H2, 24 Sep 2026). */
export async function generateStaticParams() {
  return NURSING_PAY_STATES.map((state) => ({ state }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { state: slug } = await params;
  const state = getNursingPay(slug);
  if (!state) return {};

  const range = registeredNurseRange(state);
  const url = `${BASE}/healthcare-worker-pay/${state.slug}/`;
  const instrument = state.instruments[0];

  // Search-shaped: "QLD Nurse Pay Rates 2026 — …". The dollar range moved into
  // the description, where it earns the click without pushing the query terms
  // out of the visible title.
  const title = nursingPageTitle(state);

  const employer = state.employer.split(" (")[0];
  const rn = range ? `registered nurse and midwife from ${formatAUD(range.entry)} to ${formatAUD(range.top)}` : "";
  const rnShort = range ? `RN and midwife from ${formatAUD(range.entry)} to ${formatAUD(range.top)}` : "";
  // Instrument names run to ~110 characters: named only when the description still fits.
  // Salary-led description for the states rebuilt on 23 Oct 2026 around
  // "nurse salary {state}". Every figure comes from the state's scales.
  const firstPoint = range
    ? state.scales.find((s) => s.family === "registered")?.points.find((p) => p.label === range.entryLabel)
    : undefined;
  const firstHourly = firstPoint ? hourlyFor(firstPoint, state) : null;
  const en = state.keyGrades?.find((g) => /enrolled/i.test(g.label));
  const enRow = en ? resolveKeyGrade(state, en) : null;
  const nextRise = state.upcoming?.[0]?.effectiveFrom;
  const salaryDescription =
    state.salaryTitle && range
      ? fitDescription(
          `${state.shortName} nurse salary ${ratesYear(state)}: RN ${formatAUD(range.entry)} to ${formatAUD(range.top)}${
            firstHourly !== null ? ` (from ${formatAUD(firstHourly, 2)} an hour)` : ""
          }${enRow ? `, EN from ${formatAUD(enRow.lowAnnual)}` : ""}. Every ${employer} grade with fortnightly and after-tax pay.${
            nextRise ? ` Next rise ${nextRise}.` : ""
          }`,
          `${state.shortName} nurse salary: RN ${formatAUD(range.entry)} to ${formatAUD(range.top)}${
            enRow ? `, EN from ${formatAUD(enRow.lowAnnual)}` : ""
          }. Every ${employer} pay grade, hourly and after tax.${nextRise ? ` Next rise ${nextRise}.` : ""}`,
          `${state.shortName} nurse salary: RN ${formatAUD(range.entry)} to ${formatAUD(range.top)}. Every ${employer} pay grade, hourly and after tax.`,
        )
      : null;

  const description = salaryDescription
    ? salaryDescription
    : range
    ? fitDescription(
        `${employer} nursing pay scales: ${rn}, plus enrolled nurse, clinical nurse, unit manager and nurse practitioner rates. From the ${instrument.name}, effective ${instrument.effectiveFrom}. Shift penalties and after-tax figures included.`,
        `${employer} nursing pay scales: ${rn}, effective ${instrument.effectiveFrom}. Enrolled nurse, clinical nurse and NP rates, shift penalties and after-tax pay.`,
        `${employer} nursing pay scales: ${rn}, effective ${instrument.effectiveFrom}. Plus EN, CN and NP rates and after-tax pay.`,
        `${employer} nursing pay scales: ${rnShort}, effective ${instrument.effectiveFrom}.`,
        `${employer} nursing pay scales: ${rnShort}. Plus EN, CN and NP rates and after-tax pay.`,
      )
    : fitDescription(
        `${employer} nursing and midwifery pay scales from the ${instrument.name}, effective ${instrument.effectiveFrom}.`,
        `${employer} nursing and midwifery pay scales, effective ${instrument.effectiveFrom}.`,
      );

  return withFeaturedImage({
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_CONFIG.name,
      type: "article",
      locale: "en_AU",
    },
    twitter: { card: "summary_large_image", title, description },
  });
}

async function Page({ params }: PageProps) {
  const { state: slug } = await params;
  const state = getNursingPay(slug);
  if (!state) notFound();

  const url = `${BASE}/healthcare-worker-pay/${state.slug}/`;
  const range = registeredNurseRange(state);
  const instrument = state.instruments[0];
  const faqs = nursingStateFaqs(state);

  const breadcrumb: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
      { "@type": "ListItem", position: 2, name: "Healthcare Worker Pay", item: `${BASE}/healthcare-worker-pay/` },
      { "@type": "ListItem", position: 3, name: `Nurse Pay ${state.shortName}`, item: url },
    ],
  };

  const article: WithContext<Article> = {
    "@context": "https://schema.org",
    "@type": "Article",
    datePublished: pageDatePublished(`healthcare-worker-pay/${slug}`),
    dateModified: pageDateModified(`healthcare-worker-pay/${slug}`),
    "@id": `${url}#article`,
    headline: nursingPageH1(state),
    image: `${BASE}/og-image.png`,
    description: range
      ? `Registered nurse and midwife pay in ${state.name} runs from ${formatAUD(range.entry)} to ${formatAUD(
          range.top,
        )} under the ${instrument.name}, effective ${instrument.effectiveFrom}.`
      : `Nursing and midwifery pay scales for ${state.name}.`,
    mainEntityOfPage: url,
    inLanguage: "en-AU",
    isAccessibleForFree: true,
    publisher: { "@type": "Organization", name: SITE_CONFIG.name, url: BASE },
    citation: state.instruments.map((i) => i.source.url),
  };

  // Built from the same array the accordion renders, so the markup cannot drift
  // from the visible answers.
  const faq: WithContext<FAQPage> = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question" as const,
      name: f.q,
      acceptedAnswer: { "@type": "Answer" as const, text: f.a },
    })),
  };

  return (
    <>
      <JsonLd code={[breadcrumb, article, faq, ORGANIZATION_SCHEMA]} />
      <NursingPayStatePage state={state} />
    </>
  );
}

export default withPageEnd(Page, "/healthcare-worker-pay/[state]/");
