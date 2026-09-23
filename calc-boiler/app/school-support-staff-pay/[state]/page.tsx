import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SchoolSupportStatePage } from "@/modules/guide/school-support-pay";
import { t3JsonLd } from "@/modules/guide/t3-seo";
import { SITE_CONFIG } from "@/lib/constants";
import { SCHOOL_SUPPORT_SLUGS, getSchoolSupportState } from "@/lib/data/school-support-pay";

// J6 (wave 4, 24 Sep 2026): one page per state with verified current rates.
// Targets (DataForSEO AU): slso pay rate nsw 480, sso pay rate 480,
// education assistant pay wa 70, plus the teacher aide cluster on the hub.

interface PageProps {
  params: Promise<{ state: string }>;
}

export async function generateStaticParams() {
  return SCHOOL_SUPPORT_SLUGS.map((state) => ({ state }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { state: slug } = await params;
  const state = getSchoolSupportState(slug);
  if (!state) return {};
  const url = `${SITE_CONFIG.baseUrl}/school-support-staff-pay/${state.slug}/`;
  return {
    title: state.metaTitle,
    description: state.metaDescription,
    alternates: { canonical: url },
    openGraph: { title: state.metaTitle, description: state.metaDescription, url, siteName: SITE_CONFIG.name, type: "article", locale: "en_AU", images: ["/og-image.png"] },
    twitter: { card: "summary_large_image", title: state.metaTitle, description: state.metaDescription },
  };
}

export default async function Page({ params }: PageProps) {
  const { state: slug } = await params;
  const state = getSchoolSupportState(slug);
  if (!state) notFound();
  const path = `school-support-staff-pay/${state.slug}`;
  return (
    <>
      {t3JsonLd({
        slug: path,
        title: state.metaTitle,
        description: state.metaDescription,
        headline: state.h1,
        crumbs: [
          { name: "School Support Staff Pay", path: "/school-support-staff-pay/" },
          { name: state.code, path: `/${path}/` },
        ],
        faqs: [...state.faqs],
        published: "2026-09-24",
      })}
      <SchoolSupportStatePage state={state} />
    </>
  );
}
