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
  registeredNurseRange,
} from "@/lib/data/nursing-pay";
import { nursingStateFaqs } from "@/lib/data/nursing-pay/faqs";

const BASE = SITE_CONFIG.baseUrl;

interface PageProps {
  params: Promise<{ state: string }>;
}

/**
 * Six spokes today. ACT and NT are typed but not registered, so adding them is
 * a data file plus one registry line — this function needs no change.
 */
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

  const title = range
    ? `Nurse Pay Rates ${state.shortName} — Registered Nurse ${formatAUD(range.entry)} to ${formatAUD(range.top)}`
    : `Nurse & Midwife Pay Rates ${state.shortName}`;

  const description = range
    ? `${state.employer.split(" (")[0]} nursing pay scales: registered nurse and midwife from ${formatAUD(
        range.entry,
      )} to ${formatAUD(
        range.top,
      )}, plus enrolled nurse, clinical nurse, unit manager and nurse practitioner rates. From the ${
        instrument.name
      }, effective ${instrument.effectiveFrom}. Shift penalties and after-tax figures included.`
    : `${state.employer.split(" (")[0]} nursing and midwifery pay scales from the ${instrument.name}, effective ${instrument.effectiveFrom}.`;

  return {
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
  };
}

export default async function Page({ params }: PageProps) {
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
    "@id": `${url}#article`,
    headline: `Nurse and midwife pay rates in ${state.name}`,
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
