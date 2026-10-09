import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ApprenticePayTradePage, { spokeDescription, spokeTitle } from "@/modules/guide/apprentice-pay-trade";
import { spokeFaqs } from "@/modules/guide/apprentice-pay-trade-faqs";
import { t3JsonLd } from "@/modules/guide/t3-seo";
import { APPRENTICE_SPOKES, getSpoke } from "@/lib/data/apprentice-pay/spokes";
import { SITE_CONFIG } from "@/lib/constants";
import { withPageEnd } from "@/components/common/content-slots";
import { withFeaturedImage } from "@/lib/featured-image";

// Oct 2026 keyword-gap family F3: /apprentice-pay/{trade}/. One trade deep; the
// all-trades comparison lives on /apprentice-pay-rates/. Rates: lib/data/apprentice-pay
// (awards read 5 October 2026). Electrician is /job-pay-rates/apprentice-electrician/.

interface PageProps {
  params: Promise<{ trade: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  return APPRENTICE_SPOKES.map((s) => ({ trade: s.slug }));
}

const url = (slug: string) => `${SITE_CONFIG.baseUrl}/apprentice-pay/${slug}/`;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { trade } = await params;
  const spoke = getSpoke(trade);
  if (!spoke) return {};
  const title = spokeTitle(spoke);
  const description = spokeDescription(spoke);
  return withFeaturedImage({
    title,
    description,
    alternates: { canonical: url(spoke.slug) },
    openGraph: { title, description, url: url(spoke.slug), siteName: SITE_CONFIG.name, type: "article", locale: "en_AU" },
    twitter: { card: "summary_large_image", title, description },
  });
}

async function Page({ params }: PageProps) {
  const { trade } = await params;
  const spoke = getSpoke(trade);
  if (!spoke) notFound();
  const jsonLd = t3JsonLd({
    slug: `apprentice-pay/${spoke.slug}`,
    title: spokeTitle(spoke),
    description: spokeDescription(spoke),
    headline: `${spoke.h1} in Australia: Year 1 to 4 (2026-27)`,
    crumbs: [
      { name: "Apprentice Pay Rates", path: "/apprentice-pay-rates/" },
      { name: `Apprentice ${spoke.label}`, path: `/apprentice-pay/${spoke.slug}/` },
    ],
    faqs: spokeFaqs(spoke),
    app: {
      name: `Apprentice ${spoke.label} Wages Calculator`,
      description: `Shows the award minimum hourly, weekly and annual wage for an apprentice ${spoke.label.toLowerCase()} by year, compares it with your payslip rate and estimates take-home pay.`,
    },
    published: "2026-10-05",
  });
  return (
    <>
      {jsonLd}
      <ApprenticePayTradePage spoke={spoke} />
    </>
  );
}

export default withPageEnd(Page, "/apprentice-pay/[trade]/");
