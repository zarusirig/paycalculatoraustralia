// JSON-LD for the T3 pages: BreadcrumbList, WebPage, Article (with the
// guide's author from lib/authors.ts), FAQPage and, where the page has one,
// WebApplication for the calculator.
import type { Article, BreadcrumbList, FAQPage, WebApplication, WebPage, WithContext } from "schema-dts";
import { JsonLd } from "@/modules/seo/json-ld";
import { SITE_CONFIG } from "@/lib/constants";
import { getGuideAuthorship } from "@/lib/authors";
import type { Faq } from "./t3-shared";

export const T3_PUBLISHED = "2026-09-23";

export interface T3JsonLdInput {
  slug: string;
  title: string;
  description: string;
  headline: string;
  /** Crumbs after "Pay Calculator" (home), the last one being this page. */
  crumbs: { name: string; path: string }[];
  faqs: Faq[];
  app?: { name: string; description: string };
}

export function t3JsonLd(input: T3JsonLdInput) {
  const base = SITE_CONFIG.baseUrl;
  const url = `${base}/${input.slug}/`;
  const authorship = getGuideAuthorship(input.slug);
  const modified = authorship?.lastReviewed ?? T3_PUBLISHED;

  const breadcrumb: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Pay Calculator", item: base },
      ...input.crumbs.map((c, i) => ({ "@type": "ListItem" as const, position: i + 2, name: c.name, item: `${base}${c.path}` })),
    ],
  };

  const webPage: WithContext<WebPage> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: input.title,
    description: input.description,
    url,
    inLanguage: "en-AU",
    publisher: { "@type": "Organization", name: SITE_CONFIG.name },
  };

  const article: WithContext<Article> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.headline,
    description: input.description,
    url,
    datePublished: T3_PUBLISHED,
    dateModified: modified,
    ...(authorship ? { author: authorship.author.jsonLd } : {}),
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      logo: { "@type": "ImageObject", url: `${base}/logo.png` },
    },
    mainEntityOfPage: url,
    inLanguage: "en-AU",
  };

  const faq: WithContext<FAQPage> = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: input.faqs.map((f) => ({
      "@type": "Question" as const,
      name: f.q,
      acceptedAnswer: { "@type": "Answer" as const, text: f.a },
    })),
  };

  const code: object[] = [breadcrumb, webPage, article, faq];
  if (input.app) {
    const webApp: WithContext<WebApplication> = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: input.app.name,
      description: input.app.description,
      url,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      browserRequirements: "Requires JavaScript",
      offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
      creator: { "@type": "Organization", name: SITE_CONFIG.name },
      dateModified: modified,
      inLanguage: "en-AU",
    };
    code.splice(2, 0, webApp);
  }
  return <JsonLd code={code as WithContext<WebPage>[]} />;
}
