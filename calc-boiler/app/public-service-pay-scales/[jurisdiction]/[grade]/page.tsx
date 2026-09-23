import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ApsGradePage from "@/modules/guide/aps-grade-page";
import { t3JsonLd } from "@/modules/guide/t3-seo";
import { SITE_CONFIG } from "@/lib/constants";
import {
  APS_GRADE_SLUGS,
  apsGradeData,
  apsGradeFaqs,
  getApsGrade,
  type ApsGradeSlug,
} from "@/lib/data/public-service-pay/aps-grades";
import { formatSalary } from "@/lib/data/public-service-pay/types";
import { withPageEnd } from "@/components/common/content-slots";

// J6 (wave 4, 24 Sep 2026): one page per APS level, nested under the APS
// jurisdiction page. Only /aps/{grade}/ is built; other jurisdictions have no
// grade pages, so generateStaticParams emits APS only and dynamicParams is off.
// Targets (DataForSEO AU, Sep 2026): aps 6 salary / aps6 salary / aps 6 pay
// rate 1.9k each, aps 5 salary 1.3k, aps 4 salary 1k, el1 salary 880,
// el2 salary 590, aps3 salary 480.

interface PageProps {
  params: Promise<{ jurisdiction: string; grade: string }>;
}

export async function generateStaticParams() {
  return APS_GRADE_SLUGS.map((grade) => ({ jurisdiction: "aps", grade }));
}

export const dynamicParams = false;

function resolve(jurisdiction: string, grade: string) {
  if (jurisdiction !== "aps") return undefined;
  const g = getApsGrade(grade);
  return g ? apsGradeData(g.slug as ApsGradeSlug) : undefined;
}

function meta(d: NonNullable<ReturnType<typeof resolve>>) {
  const label = d.grade.label;
  const title = `${label} Salary 2026 — Pay Rates by Agency and After Tax`;
  const description = `${label} salary from 12 March 2026: at least ${formatSalary(d.threshold.min)} in every APS agency, median ${formatSalary(d.survey.median ?? 0)}. ATO, Services Australia, Home Affairs, Defence pay points and take-home pay.`;
  return { title, description };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { jurisdiction, grade } = await params;
  const d = resolve(jurisdiction, grade);
  if (!d) return {};
  const { title, description } = meta(d);
  const url = `${SITE_CONFIG.baseUrl}/public-service-pay-scales/aps/${d.grade.slug}/`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: SITE_CONFIG.name, type: "article", locale: "en_AU", images: ["/og-image.png"] },
    twitter: { card: "summary_large_image", title, description },
  };
}

async function Page({ params }: PageProps) {
  const { jurisdiction, grade } = await params;
  const d = resolve(jurisdiction, grade);
  if (!d) notFound();
  const { title, description } = meta(d);
  const slug = `public-service-pay-scales/aps/${d.grade.slug}`;

  return (
    <>
      {t3JsonLd({
        slug,
        title,
        description,
        headline: `${d.grade.label} Salary 2026: Pay Rates by Agency, Pay Points and Take-Home Pay`,
        crumbs: [
          { name: "Public Service Pay Scales", path: "/public-service-pay-scales/" },
          { name: "APS (federal)", path: "/public-service-pay-scales/aps/" },
          { name: `${d.grade.label} salary`, path: `/${slug}/` },
        ],
        faqs: apsGradeFaqs(d),
        published: "2026-09-24",
      })}
      <ApsGradePage data={d} />
    </>
  );
}

export default withPageEnd(Page, "/public-service-pay-scales/[jurisdiction]/[grade]/");
