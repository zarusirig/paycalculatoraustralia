import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Article, BreadcrumbList, FAQPage, WithContext } from "schema-dts";
import MinimumWageByAgePage from "@/modules/guide/minimum-wage-by-age";
import { MIN_WAGE_AGES, spokeDescription, spokeFaqs, spokeTitle } from "@/modules/guide/minimum-wage-by-age-data";
import { JsonLd } from "@/modules/seo/json-ld";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS } from "@/lib/authors";
import { NMW_ORDER } from "@/lib/constants/junior-rates";
import { isMinWageAge, type MinWageAge } from "@/lib/constants/minimum-wage";

const BASE = SITE_CONFIG.baseUrl;

interface PageProps {
  params: Promise<{ age: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  return MIN_WAGE_AGES.map((age) => ({ age: String(age) }));
}

function resolve(raw: string): MinWageAge | null {
  const n = Number(raw);
  return /^\d+$/.test(raw) && isMinWageAge(n) ? n : null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { age: raw } = await params;
  const age = resolve(raw);
  if (age == null) return {};
  const url = `${BASE}/minimum-wage-by-age/${age}/`;
  const title = spokeTitle(age);
  const description = spokeDescription(age);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: SITE_CONFIG.name, type: "article", locale: "en_AU" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function Page({ params }: PageProps) {
  const { age: raw } = await params;
  const age = resolve(raw);
  if (age == null) notFound();

  const url = `${BASE}/minimum-wage-by-age/${age}/`;
  const title = spokeTitle(age);

  const breadcrumb: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
      { "@type": "ListItem", position: 2, name: "Minimum Wage by Age", item: `${BASE}/junior-pay-rates/` },
      { "@type": "ListItem", position: 3, name: `${age} Year Olds`, item: url },
    ],
  };

  const article: WithContext<Article> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: spokeDescription(age),
    author: AUTHORS["penny-ward"].jsonLd,
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      logo: { "@type": "ImageObject", url: `${BASE}/favicon.ico` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    isBasedOn: {
      "@type": "Legislation",
      name: `${NMW_ORDER.citation} (${NMW_ORDER.reference})`,
      url: NMW_ORDER.url,
    },
  };

  const faq: WithContext<FAQPage> = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: spokeFaqs(age).map((f) => ({
      "@type": "Question" as const,
      name: f.q,
      acceptedAnswer: { "@type": "Answer" as const, text: f.a },
    })),
  };

  return (
    <>
      <JsonLd code={[breadcrumb, article, faq]} />
      <MinimumWageByAgePage age={age} />
    </>
  );
}
