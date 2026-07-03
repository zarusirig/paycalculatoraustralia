import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, NewsArticle, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS } from "@/lib/authors";
import { getAllNews, getNewsBySlug } from "@/lib/news";
import { NEWS_COMPONENTS } from "@/modules/news/articles";
import NewsArticleLayout from "@/modules/news/layout";

const BASE = SITE_CONFIG.baseUrl;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllNews().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const meta = getNewsBySlug(slug);
  if (!meta) return {};
  const url = `${BASE}/news/${meta.slug}/`;
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: url },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url,
      siteName: SITE_CONFIG.name,
      type: "article",
      locale: "en_AU",
      publishedTime: meta.datePublished,
      modifiedTime: meta.dateModified,
    },
    twitter: { card: "summary_large_image", title: meta.title, description: meta.description },
  };
}

export default async function NewsArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const meta = getNewsBySlug(slug);
  const Body = NEWS_COMPONENTS[slug];
  if (!meta || !Body) notFound();

  const url = `${BASE}/news/${meta.slug}/`;

  const newsArticle: WithContext<NewsArticle> = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: meta.headline,
    description: meta.description,
    datePublished: meta.datePublished,
    dateModified: meta.dateModified,
    articleSection: meta.category,
    isAccessibleForFree: true,
    author: AUTHORS[meta.authorId].jsonLd,
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      logo: { "@type": "ImageObject", url: `${BASE}/favicon.ico` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };

  const breadcrumb: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
      { "@type": "ListItem", position: 2, name: "News", item: `${BASE}/news/` },
      { "@type": "ListItem", position: 3, name: meta.headline, item: url },
    ],
  };

  const schemas: (WithContext<NewsArticle> | WithContext<BreadcrumbList> | WithContext<FAQPage>)[] = [newsArticle, breadcrumb];

  if (meta.faq?.length) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: meta.faq.map((f) => ({
        "@type": "Question" as const,
        name: f.question,
        acceptedAnswer: { "@type": "Answer" as const, text: f.answer },
      })),
    });
  }

  return (
    <>
      <JsonLd code={schemas} />
      <NewsArticleLayout meta={meta}>
        <Body />
      </NewsArticleLayout>
    </>
  );
}
