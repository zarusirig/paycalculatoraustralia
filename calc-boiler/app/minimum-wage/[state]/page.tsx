import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Article, BreadcrumbList, FAQPage, WithContext } from "schema-dts";
import MinimumWageStatePage from "@/modules/guide/minimum-wage-state";
import { MW_STATE_SLUGS, getMwState, mwStateDescription, mwStateFaqs, mwStateH1, mwStateTitle } from "@/lib/data/minimum-wage-state";
import { JsonLd } from "@/modules/seo/json-ld";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS, getGuideAuthorship } from "@/lib/authors";
import { ORGANIZATION_SCHEMA } from "@/lib/schema";
import { pageDateModified, pageDatePublished } from "@/lib/page-dates";
import { withPageEnd } from "@/components/common/content-slots";
import { withFeaturedImage } from "@/lib/featured-image";

const BASE = SITE_CONFIG.baseUrl;

interface PageProps {
  params: Promise<{ state: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  return MW_STATE_SLUGS.map((state) => ({ state }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { state } = await params;
  const s = getMwState(state);
  if (!s) return {};
  const title = mwStateTitle(s);
  const description = mwStateDescription(s);
  const url = `${BASE}/minimum-wage/${s.slug}/`;
  return withFeaturedImage({
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: SITE_CONFIG.name, type: "article", locale: "en_AU" },
    twitter: { card: "summary_large_image", title, description },
  });
}

async function Page({ params }: PageProps) {
  const { state } = await params;
  const s = getMwState(state);
  if (!s) notFound();

  const url = `${BASE}/minimum-wage/${s.slug}/`;
  const reviewed = getGuideAuthorship("minimum-wage")?.lastReviewed;

  const breadcrumb: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
      { "@type": "ListItem", position: 2, name: "Minimum Wage Australia", item: `${BASE}/minimum-wage-australia/` },
      { "@type": "ListItem", position: 3, name: s.name, item: url },
    ],
  };

  const article: WithContext<Article> = {
    "@context": "https://schema.org",
    "@type": "Article",
    datePublished: pageDatePublished(`minimum-wage/${s.slug}`),
    dateModified: pageDateModified(`minimum-wage/${s.slug}`, reviewed),
    headline: mwStateH1(s),
    image: `${BASE}/og-image.png`,
    description: mwStateDescription(s),
    author: AUTHORS["anita-bell"].jsonLd,
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      logo: { "@type": "ImageObject", url: `${BASE}/icon-512.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };

  // Same array the accordion renders, so markup and visible answers cannot drift.
  const faq: WithContext<FAQPage> = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: mwStateFaqs(s).map((f) => ({
      "@type": "Question" as const,
      name: f.q,
      acceptedAnswer: { "@type": "Answer" as const, text: f.a },
    })),
  };

  return (
    <>
      <JsonLd code={[breadcrumb, article, faq, ORGANIZATION_SCHEMA]} />
      <MinimumWageStatePage state={s} />
    </>
  );
}

export default withPageEnd(Page, "/minimum-wage/[state]/");
