import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TeacherPayStatePage from "@/modules/guide/teacher-pay-state";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebPage, WithContext } from "schema-dts";
import { SITE_CONFIG, formatAUD } from "@/lib/constants";
import { ORGANIZATION_SCHEMA } from "@/lib/schema";
import {
  TEACHER_STATE_SLUGS,
  getTeacherPayState,
  graduateSalary,
  topOfClassroomScale,
  type TeacherPayState,
} from "@/lib/data/teacher-pay";

const BASE = SITE_CONFIG.baseUrl;

interface PageProps {
  params: Promise<{ state: string }>;
}

export async function generateStaticParams() {
  return TEACHER_STATE_SLUGS.map((state) => ({ state }));
}

function canonicalFor(slug: string) {
  return `${BASE}/teacher-pay-australia/${slug}/`;
}

function titleFor(state: TeacherPayState) {
  const grad = graduateSalary(state);
  const top = topOfClassroomScale(state);
  if (grad === null || top === null) {
    return `${state.code} Teacher Salary — ${state.name} Public School Pay Scale`;
  }
  return `${state.code} Teacher Salary — ${state.name} Pay Scale, ${formatAUD(grad)} to ${formatAUD(top)}`;
}

function descriptionFor(state: TeacherPayState) {
  const grad = graduateSalary(state);
  const top = topOfClassroomScale(state);
  if (grad === null || top === null) {
    return `What ${state.employer} pays public school teachers, what we could verify from the ${state.agreementName}, and what we deliberately do not publish. Checked ${state.verifiedOn}.`;
  }
  return `Every step of the ${state.code} teacher pay scale, from ${formatAUD(grad)} for a graduate to ${formatAUD(top)} at the top, plus leadership rates. From the ${state.agreementName}, effective ${state.ratesEffectiveFrom}. Each salary links to its take-home figure. Verified ${state.verifiedOn}.`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { state: slug } = await params;
  const state = getTeacherPayState(slug);
  if (!state) return {};

  const title = titleFor(state);
  const description = descriptionFor(state);
  const url = canonicalFor(state.slug);

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
  const state = getTeacherPayState(slug);
  if (!state) notFound();

  const url = canonicalFor(state.slug);
  const title = titleFor(state);

  const breadcrumb: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
      {
        "@type": "ListItem",
        position: 2,
        name: "Teacher Pay Australia",
        item: `${BASE}/teacher-pay-australia/`,
      },
      { "@type": "ListItem", position: 3, name: `${state.code} Teacher Salary`, item: url },
    ],
  };

  const webPage: WithContext<WebPage> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    name: title,
    url,
    description: descriptionFor(state),
    inLanguage: "en-AU",
    // The reader needs to know how stale this can be: these are the two dates
    // that decide it.
    datePublished: state.verifiedOn,
    publisher: { "@type": "Organization", name: SITE_CONFIG.name },
  };

  // Built from the same array the accordion renders, so the markup cannot drift
  // from the visible answers. A state with no verified data has no FAQs, and an
  // empty FAQPage is invalid markup — so it is omitted rather than emitted bare.
  const faq: WithContext<FAQPage> | null =
    state.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: state.faqs.map((f) => ({
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
      <TeacherPayStatePage state={state} />
    </>
  );
}
