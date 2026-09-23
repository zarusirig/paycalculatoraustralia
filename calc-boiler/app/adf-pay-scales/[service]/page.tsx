import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { BreadcrumbList, FAQPage, WebPage, WithContext } from "schema-dts";
import { AdfServicePage, serviceFaqs } from "@/modules/guide/adf-pay-scales";
import { JsonLd } from "@/modules/seo/json-ld";
import { SITE_CONFIG, formatAUD } from "@/lib/constants";
import { ORGANIZATION_SCHEMA } from "@/lib/schema";
import {
  ADF_PAY_EFFECTIVE,
  ADF_SERVICE_SLUGS,
  OTHER_RANK_SALARIES,
  getAdfService,
  salaryRange,
  type AdfService,
} from "@/lib/data/adf-pay";
import { fitDescription, fitTitle } from "@/lib/seo-title";
import { withPageEnd } from "@/components/common/content-slots";

const BASE = SITE_CONFIG.baseUrl;

interface PageProps {
  params: Promise<{ service: string }>;
}

export async function generateStaticParams() {
  return ADF_SERVICE_SLUGS.map((service) => ({ service }));
}

function canonicalFor(slug: string) {
  return `${BASE}/adf-pay-scales/${slug}/`;
}

function titleFor(s: AdfService) {
  return fitTitle(
    `${s.name} Pay Scales 2026 — ${s.fullName} Salary by Rank & Pay Grade`,
    `${s.name} Pay Scales 2026 — ${s.fullName} Salary by Rank`,
    `${s.name} Pay Scales 2026 — ${s.fullName} Salary`,
  );
}

function descriptionFor(s: AdfService) {
  const pte = OTHER_RANK_SALARIES.find((t) => t.id === "pte")!;
  const r = salaryRange(pte);
  const lead = `${s.fullName} pay rates from PACMAN, effective ${ADF_PAY_EFFECTIVE}: ${pte.names[s.key]} ${formatAUD(r.min)}–${formatAUD(r.max)}`;
  return fitDescription(
    `${lead}, every rank and increment, which pay grade each ${s.name} job is on, and take-home pay.`,
    `${lead}, every rank and increment, each job's pay grade and take-home pay.`,
    `${lead}, every rank, pay grade and take-home pay.`,
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { service } = await params;
  const s = getAdfService(service);
  if (!s) return {};
  const title = titleFor(s);
  const description = descriptionFor(s);
  const url = canonicalFor(s.slug);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: SITE_CONFIG.name, type: "article", locale: "en_AU", images: ["/og-image.png"] },
    twitter: { card: "summary_large_image", title, description },
  };
}

async function Page({ params }: PageProps) {
  const { service } = await params;
  const s = getAdfService(service);
  if (!s) notFound();
  const url = canonicalFor(s.slug);

  const breadcrumb: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
      { "@type": "ListItem", position: 2, name: "ADF Pay Scales", item: `${BASE}/adf-pay-scales/` },
      { "@type": "ListItem", position: 3, name: `${s.name} Pay Scales`, item: url },
    ],
  };

  const webPage: WithContext<WebPage> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    name: titleFor(s),
    url,
    description: descriptionFor(s),
    inLanguage: "en-AU",
    dateModified: "2026-09-23",
    publisher: { "@type": "Organization", name: SITE_CONFIG.name },
  };

  const faq: WithContext<FAQPage> = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: serviceFaqs(s).map((f) => ({
      "@type": "Question" as const,
      name: f.q,
      acceptedAnswer: { "@type": "Answer" as const, text: f.a },
    })),
  };

  return (
    <>
      <JsonLd code={[breadcrumb, webPage, faq, ORGANIZATION_SCHEMA]} />
      <AdfServicePage service={s} />
    </>
  );
}

export default withPageEnd(Page, "/adf-pay-scales/[service]/");
